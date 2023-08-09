<template>
    <div>
        <GwGridLayout flat dense colsPerRow="1" containerHeight="auto" containerClass="py-1" @callBackHeight="parentHeight = $event">
            <div colspan="6" />
            <GwFlexBox colspan="6">
                <!-- action grid -->
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('grdPOPSearch')" />
                <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick('grdPOPSave')" />
                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick('grdPOPDel')" />
                <!-- process data -->
                <BaseButton icon_type="delete" :btn_text="$t('delete_all')" :disabled="isProcessing" @onclick="onClick('DELETE_ALL')" />
                <BaseButton icon_type="update" :btn_text="$t('update_transation')" :disabled="isProcessing" @onclick="onClick('UPDATE_TRANS')" />
                <BaseButton icon_type="process" :btn_text="$t('process')" :disabled="isProcessing" @onclick="onClick('PROCESS')" />
                <BaseButton icon_type="cancel" :btn_text="$t('cancel')" :disabled="isProcessing" @onclick="onClick('CANCEL')" />
            </GwFlexBox>
            <!-- Row 1 -->
            <BaseSelect colspan="3" :label="$t('company')" v-model="selCompany" :lstData="cboCompany" item-text="TEXT" item-value="PK" mandatory />
            <BaseSelect colspan="3" :label="$t('biz_place')" v-model="selBizPlace" :lstData="cboBizPlace" item-text="TEXT" item-value="PK" mandatory />
            <BaseDatePicker colspan="1" default :label="$t('trans_date')" v-model="dtTrans" mandatory />
            <BaseSelect colspan="1" :label="$t('form_no')" v-model="selFormNo" :lstData="cboFormSerialNo" item-text="FORM_NO_NAME" item-value="FORM_NO_CODE" mandatory />
            <BaseSelect colspan="2" :label="$t('serial_no')" v-model="selSerialNo" :lstData="cboFormSerialNo" item-text="SERIAL_NO_NAME" item-value="SERIAL_NO_CODE" mandatory />
            <BaseSelect colspan="2" :label="$t('process_YN')" v-model="selProcessYn" :lstData="cboselProcessYn" item-text="NAME" item-value="CODE" :text_all="$t('select_all')" mandatory />
            <!-- Row 2 -->
            <BaseInput colspan="2" :label="$t('payment_type')" v-model="txtPaymentType" />
            <BaseInput colspan="2" :label="$t('pl')" @dblClick="dlgPL" v-model="txtPL_NM" readonly>
                <template v-slot:append>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" :color="currentTheme" @click="dlgPL">mdi-window-restore</v-icon>
                        </template>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" :color="currentTheme" @click="txtPL_CD = '', txtPL_NM = '', txtPL_PK = ''">mdi-eraser</v-icon>
                        </template>
                    </v-tooltip>
                </template>
            </BaseInput>
            <BaseSelect colspan="2" :label="$t('tax_rate')" v-model="selTaxRate" :lstData="cboTaxRate" item-text="NAME" item-value="CODE" />
            <GwImportExcelFile colspan="6" :label="$t('import_ar_invoice')" :impMultipleTemp="imp_MultipleTemp" :impCboTemp="cboTemplate" @onrtnseltemp="selTemplate = $event" :impAddParam="[this.dtTrans, this.selBizPlace, this.selCompany, this.txtPL_CD, '', '']" @onAfterImport="onAfterImport" />
            <!-- Row 3 -->
            <BaseInput colspan="2" :label="$t('shop_code')" v-model="txtShopCode" />
            <BaseInput colspan="2" :label="$t('force')" v-model="txtForce" />
            <BaseInput colspan="2" :label="$t('bill_number')" v-model="txtBillNumber" />
            <BaseInput colspan="2" :label="$t('discount_code')" v-model="txtDiscountCode" />
            <BaseInput colspan="2" :label="$t('ar_amount')" v-model="txtArAmount" number addClass="text-danger" />
            <BaseInput colspan="2" :label="$t('actual_sale')" v-model="txtARAmountBK" number addClass="text-danger" />
            <!-- Row 4 -->
            <BaseGridView colspan="12" ref="grdPOS" :header="grdHeadPOS" :height="limitHeight" :sel_procedure="grdSelPOS" :filter_paras="grdSelParaPOS" :upd_procedure="grdUpdPOS" :update_paras="grdUpdParaPOS" @setDataSource="onAfterLoad" />
        </GwGridLayout>
        <cost-center-dialog ref="refPLCenter" :companyPK="selCompany" @returnData="rtnMappingPL"></cost-center-dialog>
    </div>
    </template>
    
    <script>
    export default {
        layout: 'default',
        middleware: 'user',
        components: {
            CostCenterDialog: () => import('@/components/dialog/CostCenterDialog'),
            GwImportExcelFile: () => import('@/components/control/GwImportExcelFile.vue'),
        },
        data: () => ({
            _actionClick: '',
            headerGirdData: [],
            cboCompany: [],
            selCompany: '',
            txtShopCode: '',
            dtTrans: '',
            txtPL_CD: '',
            txtPL_NM: '',
            txtArAmount: null,
    
            selCompany: '',
            cboBizPlace: [],
            selBizPlace: '',
            formNoListS: [],
            selFormNo: '',
            serialNoListS: [],
            selSerialNo: '',
    
            transDate: '',
            txtDiscountCode: '',
    
            shopCode: '',
            txtForce: '',
            txtBillNumber: '',
            txtPaymentType: '',
            selProcessYn: 'N',
            cboselProcessYn: [{
                    NAME: 'Yes',
                    CODE: 'Y',
                },
                {
                    NAME: 'No',
                    CODE: 'N',
                },
            ],
    
            txtARAmountBK: 0,
            selTaxRate: '',
            cboTaxRate: [],
            cboFormSerialNo: [],
    
            imp_MultipleTemp: true,
            cboTemplate: [],
            selTemplate: [],
        }),
        async created() {
            // console.clear();
            this.getCompany();
        },
        watch: {
            async selCompany(val) {
                if (val) {
                    this.getListCodes();
                }
            },
        },
    
        mounted() {
            this.onResize();
        },
        computed: {
            user() {
                return this.$store.getters['auth/user'];
            },
            limitHeight() {
                return this.windowHeight * 0.7;
            },
            grdHeadPOS() {
                let _grdHeadPOS = [{
                        dataField: 'ROWNUM',
                        caption: this.$t('No'),
                        allowEditing: false,
                        width: 80,
                    },
                    {
                        dataField: 'ITEMCODE',
                        caption: this.$t('Item_code'),
                        allowEditing: false,
                        width: 150,
                    },
                    {
                        dataField: 'ITEMNAME',
                        caption: this.$t('Item_name'),
                        allowEditing: false,
                        width: 200,
                    },
                    {
                        dataField: 'UNITPRICE',
                        caption: this.$t('Unit Price'),
                        allowEditing: false,
                        width: 100,
                        formatFloat: 0,
                        dataType: 'number',
                    },
                    {
                        dataField: 'CASH_QTY',
                        caption: this.$t('Qty'),
                        allowEditing: false,
                        width: 50,
                        formatFloat: 0,
                        dataType: 'number',
                    },
                    {
                        dataField: 'CASH_AMT',
                        caption: this.$t('Total Amount'),
                        allowEditing: false,
                        width: 100,
                        formatFloat: 0,
                        dataType: 'number',
                    },
                    {
                        dataField: 'ACTUAL_SALE',
                        caption: this.$t('Actual Sale'),
                        allowEditing: false,
                        width: 100,
                        formatFloat: 0,
                        dataType: 'number',
                    },
                    {
                        dataField: 'GEN_DISCOUNT',
                        caption: this.$t('Gen discount'),
                        allowEditing: false,
                        width: 100,
                        formatFloat: 0,
                        dataType: 'number',
                    },
                    {
                        dataField: 'SH_CARD_DISCOUNT',
                        caption: this.$t('SH Card Discount'),
                        allowEditing: false,
                        width: 100,
                        formatFloat: 0,
                        dataType: 'number',
                    },
                    {
                        dataField: 'STORE_CODE',
                        caption: this.$t('Store code'),
                        allowEditing: false,
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        dataField: 'STORE_NAME',
                        caption: this.$t('Store name'),
                        allowEditing: false,
                        width: 150,
                    },
                    {
                        dataField: 'FORCE',
                        caption: this.$t('Force'),
                        allowEditing: false,
                        width: 80,
                        alignment: 'right',
                    },
                    {
                        dataField: 'RECEIPT_NUM',
                        caption: this.$t('Receipt number'),
                        allowEditing: false,
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        dataField: 'SALE_CAT',
                        caption: this.$t('Sales category'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'PAYMENT_TYPE',
                        caption: this.$t('Payment type'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'DISCOUNT_ID',
                        caption: this.$t('Discount ID'),
                        allowEditing: false,
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        dataField: 'BANK_ID',
                        caption: this.$t('Bank ID'),
                        allowEditing: false,
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        dataField: 'AC_CD_DR',
                        caption: this.$t('Debit ACC Code'),
                        allowEditing: false,
                        width: 150,
                    },
                    {
                        dataField: 'AC_CD_CR',
                        caption: this.$t('Credit ACC Code'),
                        allowEditing: false,
                        width: 150,
                    },
                    {
                        dataField: 'REMARK',
                        caption: this.$t('AR Desc'),
                        allowEditing: false,
                        width: 150,
                    },
                    {
                        dataField: 'REMARK2',
                        caption: this.$t('Local AR Desc'),
                        allowEditing: false,
                        width: 150,
                    },
                    {
                        dataField: 'PL_CD',
                        caption: this.$t('PL Code'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'WH_ID',
                        caption: this.$t('Warehouse ID'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'TRANSDATE',
                        caption: this.$t('Transdate'),
                        allowEditing: false,
                        width: 150,
                        dataType: 'date',
                    },
                    {
                        dataField: 'MAKH',
                        caption: this.$t('Partner Code'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'TENKH',
                        caption: this.$t('Partner Name'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'TAX_CODE',
                        caption: this.$t('Tax Code'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'ADDRESS',
                        caption: this.$t('Address'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'CUS_EMAIL',
                        caption: this.$t('Email'),
                        allowEditing: false,
                        width: 200,
                    },
                    {
                        dataField: 'VOUCHERNO',
                        caption: this.$t('AR Voucher No'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'FORM_NO',
                        caption: this.$t('Form No'),
                        allowEditing: false,
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        dataField: 'SERIAL_NO',
                        caption: this.$t('Serial No'),
                        allowEditing: false,
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        dataField: 'INVOICE_NO',
                        caption: this.$t('Invoice No'),
                        allowEditing: false,
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        dataField: 'EI_STATUS',
                        caption: this.$t('Ei Status'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'INVOICE_TYPE',
                        caption: this.$t('Invoice Type'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'PAYMENT_METHOD',
                        caption: this.$t('Payment Method'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'COMBINE_YN',
                        caption: this.$t('Combine'),
                        allowEditing: false,
                        width: 100,
                    },
                    {
                        dataField: 'CUS_PHONE',
                        caption: this.$t('Cus Phone (Dis code)'),
                        allowEditing: false,
                        width: 150,
                        alignment: 'right',
                    },
                ];
                return _grdHeadPOS;
            },
            grdSelPOS() {
                let _grdSelPOS = 'AC_SEL_6060200_01'; //ac_sel_60110230v2
                return _grdSelPOS;
            },
            grdUpdPOS() {
                const _grdUpdPOS = 'AC_UPD_6060200_02'; //ac_upd_60110230v2
                return _grdUpdPOS;
            },
            grdSelParaPOS() {
                let _grdSelPOS = [
                    this.selCompany,
                    this.dtTrans,
                    this.selBizPlace,
                    this.txtPL_CD,
                    this.txtShopCode,
                    this.txtForce,
                    this.txtBillNumber,
                    this.txtPaymentType,
                    this.txtDiscountCode,
                    this.selProcessYn,
                    this.selTaxRate,
                ];
                return _grdSelPOS;
            },
            grdUpdParaPOS() {
                let _grdUpdPOS = ['PK'];
                return _grdUpdPOS;
            },
        },
        methods: {
            // async onChangeCompany(val) {
            //   const dso_bizplace_list = {
            //     type: 'list',
            //     selpro: 'SYS_SEL_BIZ_PLACE_V2',
            //     para: [val, this.user.PK],
            //   };
            //   this.cboBizPlace = await this._dsoCall(dso_bizplace_list, 'select', false);
            //   if (this.cboBizPlace.length > 0) {
            //     this.selBizPlace = this.cboBizPlace[0].PK;
            //   }
            // },
            onAfterLoad() {
                setTimeout(() => {
                    this.txtArAmount = this.$refs.grdPOS.getDataSource().reduce((prev, {
                        CASH_AMT
                    }) => prev + CASH_AMT, 0);
                    this.txtARAmountBK = this.$refs.grdPOS.getDataSource().reduce((prev, {
                        ACTUAL_SALE
                    }) => prev + ACTUAL_SALE, 0);
                }, 1000);
            },
            onAfterImport() {},
            async getCompany() {
                const result = await this._getCompanyByUser(this.user.PK);
                if (result) {
                    this.cboCompany = result;
                    this.selCompany = this.cboCompany[0].PK;
                }
            },
            async getListCodes() {
                const dso_bizplace_list = {
                    type: 'list',
                    selpro: 'SYS_SEL_BIZ_PLACE_V2',
                    para: [this.selCompany, this.user.PK],
                };
                this.cboBizPlace = await this._dsoCall(dso_bizplace_list, 'select', false);
                if (this.cboBizPlace.length > 0) {
                    this.selBizPlace = this.cboBizPlace[0].PK;
                }
    
                const dso_cboFormSerialNo = {
                    type: 'list',
                    selpro: 'AC_FORM_NO_SERIAL_NO_MAPPING',
                    para: [this.selCompany, this.selBizPlace],
                };
                this.cboFormSerialNo = await this._dsoCall(dso_cboFormSerialNo, 'select', false);
    
                if (this.cboFormSerialNo.length > 0) {
                    this.selSerialNo = this.cboFormSerialNo[0].SERIAL_NO_CODE;
                    this.selFormNo = this.cboFormSerialNo[0].FORM_NO_CODE;
                }
    
                const dso_vatrate_list = {
                    type: 'list',
                    selpro: 'AC_GET_VAT_EI',
                    para: [this.selCompany, 'ACCR0110'],
                };
                this.cboTaxRate = await this._dsoCall(dso_vatrate_list, 'select', false);
                if (this.cboTaxRate.length) {
                    this.selTaxRate = this.cboTaxRate[0].CODE; //this.vatTaxList[0].PK
                }
    
                const commoncode = await this._getCommonCode3(['ACJS0320'], this.lstCompany);
    
                commoncode[0].forEach(item => {
                    if (item.NUM1 == '6060200') {
                        this.cboTemplate.push(item);
                    }
                });
            },
            async onClick(_type, _obj = "") {
                this._actionClick = _type;
                switch (_type) {
                    case 'grdPOPSearch':
                        this.$refs.grdPOS.loadData();
                        break;
                    case 'grdPOPDel':
                        this.$refs.grdPOS.deleteRows();
                        break;
                    case 'grdPOPSave':
                        this.$refs.grdPOS.saveData();
                        break;
                    case 'DELETE_ALL':
                        const dsoDeleteAll = {
                            type: 'list',
                            selpro: 'AC_PRO_6060200_03_DEL_ALL', //ac_upd_60110230v2s
                            para: [this.selCompany, this.dtTrans, this.selBizPlace, this.txtPL_CD, this.selFormNo, this.selSerialNo],
                        };
                        const rtnDeleteAll = await this._dsoCall(dsoDeleteAll, 'select', true);
                        await this.onClick("grdPOPSearch");
                        break;
                    case "UPDATE_TRANS":
                        const dsoUpdTrans = {
                            type: 'list',
                            selpro: 'AC_PRO_6060200_UPD_TRANS', //ac_pro_60110230v2_update
                            para: [
                                this.selCompany,
                                this.dtTrans,
                                this.selBizPlace,
                                this.txtPL_CD,
                                this.selFormNo,
                                this.selSerialNo,
                                this.selProcessYn,
                            ],
                        };
                        const rtnUpdTrans = await this._dsoCall(dsoUpdTrans, 'select', true);
                        await this.onClick("grdPOPSearch");
                        break;
                    case "PROCESS":
                        const dsoProcess = {
                            type: 'list',
                            selpro: 'AC_PRO_6060200_PROCESS', //ac_pro_60110230v2 AC_PRO_6060200_NODEJS
                            para: [
                                this.selCompany,
                                this.selBizPlace,
                                this.selFormNo,
                                this.selSerialNo,
                                this.dtTrans,
                                this.txtPL_CD,
                                this.selTaxRate,
                                this.user.PK,//THR_ABEMP_PK,
                                this.selProcessYn,
    
                            ],
                        };
                        const rtnProcess = await this._dsoCall(dsoProcess, 'select', true);
                        await this.onClick("grdPOPSearch");
                        break;
                    case "CANCEL":
                        const dsoCancel = {
                            type: 'list',
                            selpro: 'AC_PRO_6060200_CANCEL', //ac_pro_60110230v2_cancel AC_PRO_6060200_CANCEL_NODEJS
                            para: [this.selCompany, this.dtTrans, this.selBizPlace, this.txtPL_CD],
                        };
                        const rtnCancel = await this._dsoCall(dsoCancel, 'select', true);
                        await this.onClick("grdPOPSearch");
                        break;
                }
            },
            dlgPL() {
                this.$refs.refPLCenter.dialogIsShow = true;
            },
            rtnMappingPL(item) {
                this.txtPL_PK = item.PK;
                this.txtPL_CD = item.CODE;
                this.txtPL_NM = item.CODE + " - " + item.NAME;
            },
        },
    };
    </script>
    