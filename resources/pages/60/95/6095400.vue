<template>
    <v-container fluid v-resize="onResize">
        <v-row class="pt-1" dense>
            <v-col md="12">
                <v-row dense>
                    <v-col md="3">
                        <BaseSelect outlined :label="$t('company')" v-model="modelSearch.COMPANY_PK"
                            :lstData="dataSearchList.companyList" item-value="PK" item-text="TEXT" />
                    </v-col>
                    <v-col md="1"></v-col>
                    <v-col md="2">
                        <BaseInput outlined :label="$t('invoice_no')" v-model="modelSearch.INVOICE_NO" number />
                    </v-col>
                    <v-col md="1">
                        <BaseInput outlined v-model="modelSearch.INVOICE_NM" />
                    </v-col>
                    <v-col md="1"></v-col>
                    <v-col md="2">
                        <BaseSelect outlined :label="$t('form_no')" v-model="modelSearch.FORM_NO"
                            :lstData="dataSearchList.formno_list" item-text="NAME" item-value="VAL" />
                    </v-col>
                    <v-col md="2">
                        <BaseSelect outlined :label="$t('serial_no')" item-text="NAME" item-value="VAL"
                            :lstData="dataSearchList.serialno_list" v-model="modelSearch.SERIAL_NO" />
                    </v-col>
                </v-row>
                <v-row dense>
                    <!--  -->
                    <v-col md="1">
                        <BaseDatePicker outlined today :label="$t('date')" v-model="modelSearch.TODATE" />
                    </v-col>
                    <v-col md="3"></v-col>
                    <v-col md="3">
                        <BaseInput outlined :label="$t('partner')" v-model="modelSearch.PARTNER" />
                    </v-col>
                    <v-col md="1"></v-col>
                    <v-col md="2">
                        <BaseSelect outlined :label="$t('combine_yn')" v-model="modelSearch.COMBINE_YN"
                            :lstData="dataSearchList.combineYN_list" item-text="NAME" item-value="CODE"
                            :text_all="$t('all')" />
                    </v-col>
                    <v-col md="2">
                        <BaseSelect outlined :label="$t('process_yn')" v-model="modelSearch.PROCESS_YN"
                            :lstData="dataSearchList.processYN_list" item-text="NAME" item-value="CODE"
                            :text_all="$t('all')" />
                    </v-col>
                </v-row>
                <!--  -->
                <v-row dense>
                    <v-col md="3">
                        <GwImportExcelFile :label="$t('import_ar_invoice')" :impMultipleTemp="imp_MultipleTemp"
                            :impCboTemp="cboTemplate" @onrtnseltemp="selTemplate = $event" 
                            :impAddParam="[ this.modelSearch.COMPANY_PK,this.modelSearch.FORM_NO, this.modelSearch.SERIAL_NO]"
                            @onAfterImport="onAfterImport" />
                    </v-col>
                    <v-col md="1">
                        <BaseInput outlined :label="$t('total')" readonly v-model="totalAmount" number />
                    </v-col>
                    <v-col md="1">
                        <BaseInput outlined :label="$t('actual')" readonly v-model="actualAmount" number />
                    </v-col>
                    <v-col md="1">
                        <BaseInput outlined :label="$t('gen_dis')" readonly v-model="generalDiscount" number />
                    </v-col>
                    <v-col md="1">
                        <BaseInput outlined :label="$t('cre_dis')" readonly v-model="creditDiscount" number />
                    </v-col>
                    <v-col md="5" class="pt-3">
                        <GwFlexBox justify="end">
                            <BaseButton icon_type="delete" :btn_text="$t('delete_all')" @onclick="onClick('OnDeleteALL')" />
                            <BaseButton icon_type="delete" :btn_text="$t('delete_row')" @onclick="onClick('OnDeleteRow')" />
                            <BaseButton icon_type="update" :btn_text="$t('update')" @onclick="onClick('UpdateTrans')" />
                            <BaseButton icon_type="process" :btn_text="$t('process')" @onclick="onClick('ProcessData')" />
                            <BaseButton icon_type="cancel" :btn_text="$t('cancel')" @onclick="onClick('CancelData')" />
                            <BaseButton icon_type="view" :btn_text="$t('preview')" @onclick="onClick('OnPreview')" />
                            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('btn_search')"
                                @onclick="onClick('search')" />
                        </GwFlexBox>
                    </v-col>
                </v-row>

                <!--  -->
                <v-row dense>
                    <v-col md="12">

                        <BaseGridView ref="grdData" :setting="true" :height="limitHeight" :header="headerGrdData"
                            sel_procedure="EI_SEL_6095400_s_01" :filter_paras="[
                                this.modelSearch.TODATE,
                                this.modelSearch.PARTNER,
                                this.modelSearch.COMPANY_PK,
                                this.modelSearch.PROCESS_YN,
                                this.modelSearch.COMBINE_YN,
                                this.modelSearch.SERIAL_NO,
                                this.modelSearch.FORM_NO,
                                this.modelSearch.FILE_IMPORT
                            ]" @setDataSource="onAfterLoad" @cellClickData="OnClickRowPK" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
export default {
    layout: "default",
    middleware: "user",
    components: {
        GwImportExcelFile: () => import('@/components/control/GwImportExcelFile.vue'),
    },

    data: () => ({
        headerGrdData: [],
        modelSearch: {
            COMPANY_PK: null,
            INVOICE_NO: null,
            INVOICE_NM: null,
            FORM_NO: null,
            SERIAL_NO: null,
            TODATE: null,
            PARTNER: null,
            COMBINE_YN: 'N',
            PROCESS_YN: 'N',
            SELAB: null,
            FILE_IMPORT: null
        },
        dataSearchList: {
            companyList: [],
            formno_list: [],
            serial_no_list: [],
            combineYN_list: [{
                NAME: 'Yes',
                CODE: 'Y',
            },
            {
                NAME: 'No',
                CODE: 'N',
            },],
            processYN_list: [
                {
                    NAME: 'Yes',
                    CODE: 'Y',
                },
                {
                    NAME: 'No',
                    CODE: 'N',
                },
            ],
            selab_list: [],
        },
        lstBizPlace: null,
        totalAmount: 0,
        actualAmount: 0,
        generalDiscount: 0,
        creditDiscount: 0,

        imp_MultipleTemp: true,
        cboTemplate: [],
        selTemplate: [],

        txtPK: "",
        txt_tei_einvoice_m_PK: "",
        txt_report_code: "",
        txtInvoice_No: "",
        txtFormNo: "",

        _arrData: [],
    }),
    mounted() {
        this.onResize();

    },

    async created() {
        await this.initDataList("company");
        await this.initDataList("filenm");
        // await this.initDataList("template");
        await this.initCboFrm();
        this.initHeaderList();

    },
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() { return this.windowHeight * 0.7; },

    },

    watch: {
        "modelSearch.COMPANY_PK"(val) {
            if (val) {
                this.initDataList("form_no");
                this.initDataList("serial_no");

                this.initCboFrm(this._arrData, val)
            }
        },
        "modelSearch.FORM_NO"(val) {
            if (val) {
                this.initDataList("serial_no");
            }
        },
        "modelSearch.TODATE"(val) {
            if (val) {
                this.initDataList("form_no");
                this.initDataList("serial_no");
            }
        },
        selTemplate(val) {

        },
    },
    methods: {
        async OnClickRowPK(item) {
            this.txtPK = item.PK;
            this.txtPK = item.PK;
            this.txt_tei_einvoice_m_PK = item.PK;
            this.txt_report_code = item.REPORT_CODE;
            this.txtInvoice_No = item.INVOICE_NO;
            this.txtFormNo = item.FORM_NO;
        },



        async onClick(pos) {
            switch (pos) {
                case "search":
                    this.$refs.grdData.loadData();
                    break;
                case "OnDeleteRow":
                // await this._dsoCall({
                //     type: "process", updpro: "EI_SEL_6095400_p_09", para: [this.modelSearch.COMPANY_PK, this.modelSearch.TODATE,
                //     this.modelSearch.SERIAL_NO, this.modelSearch.FORM_NO]
                // }, "update", false).then((res) => {
                //     this.onClick("search");
                // });
                // break;
                case "OnDeleteALL":
                    await this._dsoCall({ type: "process", updpro: "EI_UPD_6095400_p_09", para: [this.modelSearch.COMPANY_PK, this.modelSearch.TODATE, this.modelSearch.SERIAL_NO, this.modelSearch.FORM_NO] }, "update", true).then((res) => {
                        this.onClick("search");
                    });
                    break;
                case "UpdateTrans":
                    await this._dsoCall({ type: "process", updpro: "EI_SEL_6095400_P_08", para: [this.modelSearch.COMPANY_PK, this.modelSearch.TODATE, this.modelSearch.SERIAL_NO, this.modelSearch.FORM_NO] }, "update", true).then((res) => {
                        this.onClick("search");
                    });
                    break;
                case "ProcessData":
                    await this._dsoCall({ type: "process", updpro: "EI_SEL_6095400_p_02", para: [this.modelSearch.COMPANY_PK, this.modelSearch.TODATE, this.modelSearch.SERIAL_NO, this.modelSearch.FORM_NO] }, "process", true).then((res) => {
                        this.onClick("search");
                    });
                    break;
                case "CancelData":
                    await this._dsoCall({ type: "process", updpro: "EI_SEL_6095400_p_03", para: [this.modelSearch.COMPANY_PK, this.modelSearch.TODATE, this.modelSearch.SERIAL_NO, this.modelSearch.FORM_NO] }, "process", true).then((res) => {
                        this.onClick("search");
                    });
                    break;
                case "OnPreview":
                    this.PreviewIv();
                    break;
            }
        },
        async onAfterImport() {
            await this.onClick("search");
         },
        onAfterLoad() {
            setTimeout(() => {
                this.totalAmount = this.$refs.grdData.getDataSource().reduce((n, { TOTAL_AMOUNT }) => n + TOTAL_AMOUNT, 0);
                this.actualAmount = this.$refs.grdData.getDataSource().reduce((n, { ACTUAL_SALES }) => n + ACTUAL_SALES, 0);
                this.generalDiscount = this.$refs.grdData.getDataSource().reduce((n, { GENERAL_DISCOUNT }) => n + GENERAL_DISCOUNT, 0);
                this.creditDiscount = this.$refs.grdData.getDataSource().reduce((n, { CREDIT_CARD_DISCOUNT }) => n + CREDIT_CARD_DISCOUNT, 0);
            }, 1000);
        },
        PreviewIv() {
            var v_user_id = "";
            if (!this.txtPK == "") {

            }
        },
        async initDataList(pos) {
            switch (pos) {
                case "company":
                    const companyInfo = await this._getCompanyByUser(this.user.PK);
                    if (companyInfo.length > 0) {
                        this.dataSearchList.companyList = companyInfo;
                        this.modelSearch.COMPANY_PK = this.dataSearchList.companyList[0].PK;
                    }
                    break;
                case "form_no":
                    const dso_formno_list = {
                        type: 'list',
                        selpro: 'AC_SEL_6095400_FORM_NO',
                        para: [this.modelSearch.COMPANY_PK, this.modelSearch.TODATE, ""],
                    };
                    this.dataSearchList.formno_list = await this._dsoCall(dso_formno_list, 'select', false);
                    if (this.dataSearchList.formno_list.length > 0) {
                        this.modelSearch.FORM_NO = this.dataSearchList.formno_list[0].VAL;
                    };
                    break;
                case "serial_no":
                    const dso_serialno_list = {
                        type: 'list',
                        selpro: 'AC_SEL_6095400_SERIAL_NO',
                        para: [this.modelSearch.COMPANY_PK, this.modelSearch.FORM_NO, this.modelSearch.TODATE, ""],
                    };
                    this.dataSearchList.serialno_list = await this._dsoCall(dso_serialno_list, 'select', false);
                    if (this.dataSearchList.serialno_list.length > 0) {
                        this.modelSearch.SERIAL_NO = this.dataSearchList.serialno_list[0].VAL;
                    };
                    break;

                case "filenm":
                    const results = await this._getCommonCode2(["ACEIS130"], this.user.PK)
                    this.dataSearchList.selab_list = results[0];
                    break;
            }
        },
        async initCboFrm(_arrayData, _tco_compay_pk) {
            await this._getInitList('cboTemplate', _arrayData, 'ACEIS130', _tco_compay_pk).then((result) => {
                result.forEach(item => {
                    if (item.DESCRIPTION == 'EI-POST') {
                            this.cboTemplate.push(item);
                        }
                });
            });
        },
        async initHeaderList() {
            this.headerGrdData = [
                { dataField: "CHK", caption: this.$t("chk"), dataType: "checkbox" },
                // {dataField: "PK",caption: this.$t("pk"),hidden="true"},
                { dataField: "RN", caption: this.$t("No"), },
                { dataField: "INVOICE_DATE", caption: this.$t("invoice_date"), dataType: "date", format: this.curLang.DATE_FORMAT, allowEditing: false },
                { dataField: "BUYER_NAME", caption: this.$t("buyer_name"), allowEditing: false, },
                { dataField: "BUYER_ADDRESS", caption: this.$t("buyer_address"), allowEditing: false },
                { dataField: "BUYER_TAXCODE", caption: this.$t("buyer_taxcode"), allowEditing: false },
                { dataField: "BUYER_MAIL", caption: this.$t("buyer_mail"), allowEditing: false },
                { dataField: "BUYER_PHONE", caption: this.$t("buyer_phone"), allowEditing: false },
                { dataField: "DATE_OF_SALES", caption: this.$t("date_of_sales"), allowEditing: false, dataType: "date", format: this.curLang.DATE_FORMAT },
                { dataField: "STORE_CODE", caption: this.$t("store_code"), allowEditing: false },
                { dataField: "STORE_NAME", caption: this.$t("store_name"), allowEditing: false },
                { dataField: "POS", caption: this.$t("pos"), allowEditing: false },
                { dataField: "RECEIPT_NUMBER", caption: this.$t("receipt_number"), allowEditing: false },
                { dataField: "SALES_CATEGORY", caption: this.$t("sales_category"), allowEditing: false },
                { dataField: "PAYMENT_TYPE", caption: this.$t("payment_type"), allowEditing: false },
                { dataField: "TOTAL_AMOUNT", caption: this.$t("total_amount"), allowEditing: false, dataType: "number", formatFloat: 0, },
                { dataField: "ACTUAL_SALES", caption: this.$t("actual_sales"), allowEditing: false, dataType: "number", formatFloat: 0, },
                { dataField: "GENERAL_DISCOUNT", caption: this.$t("general_discount"), allowEditing: false },
                { dataField: "CREDIT_CARD_DISCOUNT", caption: this.$t("credit_card_discount"), allowEditing: false },
                { dataField: "ITEM_CODE", caption: this.$t("item_code"), allowEditing: false },
                { dataField: "ITEM_NAME", caption: this.$t("item_name"), allowEditing: false },
                { dataField: "UOM", caption: this.$t("uom"), allowEditing: false },
                { dataField: "QTY", caption: this.$t("qty"), allowEditing: false },
                { dataField: "PRICE", caption: this.$t("price"), allowEditing: false },
                { dataField: "FORM_NO", caption: this.$t("form_no"), allowEditing: false },
                { dataField: "SERIAL_NO", caption: this.$t("serial_no"), allowEditing: false },
                { dataField: "INVOICE_NO", caption: this.$t("invoice_no"), allowEditing: false },
                { dataField: "CQT_COMPANY_CODE", caption: this.$t("cqt_company_code"), allowEditing: false },
                { dataField: "CQT_MCCQT_ID", caption: this.$t("cqt_mccqt_id"), allowEditing: false },
                { dataField: "AR_GROUP_PK", caption: this.$t("ar_group_pk"), allowEditing: false },
                { dataField: "EINV_GROUP_PK", caption: this.$t("einv_group_pk"), allowEditing: false },
            ]
        }
    }
}
</script>
  
