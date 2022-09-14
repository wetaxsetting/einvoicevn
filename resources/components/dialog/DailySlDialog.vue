<template>
<div>
    <v-dialog id="daily-sl-dialog" max-width="1400" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">
                <span>{{ $t("daily_sl", "common") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-container fluid class="pt-0">
                <v-row no-gutters>
                    <v-col cols="12">
                        <!-- Search Panel -->
                        <v-row align="center" justify="space-between">
                            <v-col cols="12">
                                <v-card outlined tile>
                                    <v-container fluid class="pb-0">
                                        <v-row dense align="center" justify="space-between">
                                            <!-- Company -->
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <v-select cache-items clearable dense hide-details item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="companyPK"></v-select>
                                            </v-col>
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <v-select dense hide-details background-color="yellow lighten-4" validate-on-blur :rules="validationRule.require" item-value="PK" item-text="TEXT" :label="$t('biz_place')" :items="bizPlaceList" v-model="lstBizPlace"></v-select>
                                            </v-col>
                                            <!-- Account Code -->
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <v-text-field dense hide-details :label="$t('acc_code', 'common')" v-model="accCode" @keypress.enter="search">
                                                    <template v-slot:append>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="$refs.accountDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                                            </template>
                                                            <span>{{ $t('get_acc_code', 'common') }}</span>
                                                        </v-tooltip>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="accCodePK = '', accCode = ''">mdi-eraser</v-icon>
                                                            </template>
                                                            <span>{{ $t('reset', 'common') }}</span>
                                                        </v-tooltip>
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                            <!-- Language -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-2">
                                                <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('language', 'common')" :items="selectedLanguage" v-model="selectedLang"></v-select>
                                            </v-col>
                                            <!-- Currency -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-2">
                                                <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('currency', 'common')" :items="currencyList" v-model="selectedCurrency"></v-select>
                                            </v-col>
                                            <!-- Report Option -->
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('report_option', 'common')" :items="reportOptionList" v-model="selectedReportOpt"></v-select>
                                            </v-col>
                                            <!-- Report Type -->
                                            <v-col lg="2" sm="3" cols="12">
                                                <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('report_type', 'common')" :items="reportTypeList" v-model="selectedReportType"></v-select>
                                            </v-col>
                                        </v-row>

                                        <v-row dense align="center" justify="space-between">
                                            <!-- Proposed From -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-sm-0 pb-2">
                                                <date-picker :label="$t('approve_from', 'common')" :defaultType="'startOfMonth'" :inputValue="proposeFrom" @returnValue="proposeFrom = $event"></date-picker>
                                            </v-col>
                                            <!-- Proposed To -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-sm-0 pb-2">
                                                <date-picker :label="$t('approve_to', 'common')" :defaultType="'endOfMonth'" :inputValue="proposeTo" @returnValue="proposeTo = $event"></date-picker>
                                            </v-col>
                                            <!-- Slip Status -->
                                            <v-col lg="2" sm="3" cols="12">
                                                <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('status')" :items="statusList" v-model="selectedStatus"></v-select>
                                            </v-col>
                                            <!-- Inquiry Type -->
                                            <v-col lg="2" sm="3" cols="12">
                                                <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('inquiry_type')" :items="inquiryTypeList" v-model="inquiryType"></v-select>
                                            </v-col>
                                            <!-- Amount Type -->
                                            <v-col lg="2" sm="3" cols="12">
                                                <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('amt_type')" :items="amtTypeList" v-model="amtType"></v-select>
                                            </v-col>
                                            <!-- Buttons -->
                                            <v-col lg="4" sm="3" cols="12" class="text-sm-right text-center">
                                                <!-- Search -->
                                                 <div class="d-flex justify-end"> 
                                                    <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" :disabled="isProcessing" />
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                        </v-row>
                        <!-- Table -->
                        <v-row dense align="center" justify="center">
                            <!-- Dates & Vouchers -->
                            <v-col cols="12" class="py-0">
                                <v-card outlined tile v-resize="onResize">
                                    <!-- <DxDataGrid column-resizing-mode="widget" ref="slDateVoucherGrid" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                                    :columns="slDateVoucherHeaders" :data-source="slDateVoucherDataList" 
                                    :height="limitHeight/2" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" 
                                    :onRowDblClick="onRowDblClick" :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                                        <DxPaging :page-size="slDateVoucherDataList.length" v-if="slDateVoucherDataList.length < 500" />
                                        <DxScrolling mode="infinite" v-else />
                                    </DxDataGrid> -->
                                    <DataGridView ref="slDateVoucherGrid" :header="slDateVoucherHeaders" :sel_procedure="store_pro" select_mode="Single" :auto_load="false" :filter_paras="[
                                                this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.openingBalance, this.lstBizPlace
                                                ]" :is_allow_paste="false" :max_height="limitHeight/2" @onRowPrepared="onRowPrepared" @cellDblClick="onRowDblClick" @setDataSource="afterLoad"/>
                                </v-card>
                            </v-col>
                            <!-- Sum -->
                            <v-col cols="12" class="pb-0">
                                <v-card outlined tile v-resize="onResize">
                                    <DataGridView ref="slSumGrid" :header="slSumHeaders" sel_procedure="AC_SEL_DAILY_SL_DIALOG_SUM" select_mode="Single" :filter_paras="[
                                                 this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.lstBizPlace
                                                ]" :is_allow_paste="false" :max_height="limitHeight/2" @setDataSource="onAfterLoad" />
                                    <!-- <DxDataGrid column-resizing-mode="widget" ref="slSumGrid" :allow-column-resizing="true" 
                                    :column-auto-width="$vuetify.breakpoint.smAndDown" :columns="slSumHeaders" 
                                    :data-source="slSumDataList" :height="limitHeight/2" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }"
                                     :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                                        <DxPaging :page-size="slSumDataList.length" v-if="slSumDataList.length < 500" />
                                        <DxScrolling mode="infinite" v-else />
                                    </DxDataGrid> -->
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
    <account-dialog ref="accountDialog" @returnAccountInfo="handleReturnedAccCode" />
    <account-slip-dialog ref="accountSlipDialog" :seqArray="seqArray" :currentSeq="currentSeq" />
</div>
</template>

<script>
export default {
    name: 'daily-sl-dialog',
    props: ["companyPK", "accountItem", "fromDate", "toDate", "status", "ccy", "bizPlace"],

    components: {
        DatePicker: () => import("@/components/control/DatePicker"),
        AccountDialog: () => import("@/components/dialog/AccountDialog"),
        AccountSlipDialog: () => import("@/components/dialog/AccountSlipDialog")
    },

    data: () => ({
        dialogIsShow: false,
        companyList: [],
        selectedCompany: null,
        accCodePK: '',
        accCode: '',
        selectedLang: 'ENG',
        proposeFrom: '',
        proposeTo: '',
        inquiryType: 'vouchers',
        reportOptionList: [],
        selectedReportOpt: '',
        currencyList: [],
        selectedCurrency: '',
        amtType: 'books',
        reportTypeList: [],
        selectedReportType: '',
        slipStatus: '',
        bookCcyList: [],
        selectedLanguage: [],
        slDateVoucherDataList: [],
        slSumDataList: [],
        seqArray: [],
        currentSeq: null,
        bizPlaceList: [],
        lstBizPlace: "",
        selectedStatus: "2",
        statusList: [],
        openingBalance:0,
        store_pro: "",
        txt_Bookccy :"",
        txt_Transccy :"",
    }),

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            return this.windowHeight * 0.5
        },
        slDateVoucherHeaders() {
            const self = this;
            if (this.dialogIsShow === true) {
                if (this.inquiryType === 'dates') {    
                    return [{
                                dataField: "FDATE",
                                caption: this.$t('f_date', 'common'),
                                dataType: "date",
                                format: this.curLang.DATE_FORMAT
                            },
                            {
                                dataField: "CCY",
                                caption: this.$t('ccy', 'common')
                            },
                            {
                                dataField: "OPENINGBALANCE",
                                caption: this.$t('op_balance', 'common'),
                                dataType: "number",
                                width: 300,
                                formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                            },
                            {
                                caption: this.$t('trans', 'common'),
                                alignment: 'center',
                                columns: [{
                                        dataField: "DEBITTRANSAMOUNT",
                                        caption: this.$t('debit', 'common'),
                                        width: this.amtType == 'books' ? "0" : "100", 
                                        alignment: "right",
                                    },
                                    {
                                        dataField: "CREDITTRANSAMOUNT",
                                        caption: this.$t('credit', 'common'),
                                        width: this.amtType == 'books' ? "0" : "100", 
                                        alignment: "right",
                                    }
                                ]
                            },
                            {
                                caption: this.$t('books', 'common'),
                                alignment: 'center',
                                columns: [{
                                        dataField: "DEBITBOOKAMOUNT",
                                        caption: this.$t('debit', 'common'),
                                        dataType: "number",
                                        formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                        width: this.amtType == 'trans' ? "0" : "100", 
                                    },
                                    {
                                        dataField: "CREDITBOOKAMOUNT",
                                        caption: this.$t('credit', 'common'),
                                        dataType: "number",
                                        formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                        width: this.amtType == 'trans' ? "0" : "100", 
                                    }
                                ]
                            },
                            {
                                dataField: "CLOSINGBALANCE",
                                caption: this.$t('cfm_balance', 'common'),
                                dataType: "number",
                                formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                            }
                        ]  
                } else {
                    return [{
                                dataField: "PK",
                                caption: this.$t('seq', 'common')
                            },
                            {
                                dataField: "VOUCHERNO",
                                caption: this.$t('voucher_no', 'common')
                            },
                            {
                                dataField: "TR_DATE",
                                caption: this.$t('proposed_date', 'common'),
                                dataType: "date",
                                format: this.curLang.DATE_FORMAT
                            },
                            {
                                dataField: "USER_ID",
                                caption: this.$t('proposed_by', 'common')
                            },
                            {
                                dataField: "CCY",
                                caption: this.$t('ccy', 'common')
                            },
                            {
                                dataField: "OPENINGBALANCE",
                                caption: this.$t('op_balance', 'common'),
                                dataType: "number",
                                formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                            },
                            {
                                caption: this.$t('trans', 'common'),
                                alignment: 'center',
                                columns: [{
                                        dataField: "DEBITTRANSAMOUNT",
                                        caption: this.$t('debit', 'common'),
                                        width: this.amtType == 'books' ? "0" : "100", 
                                        alignment: "right",
                                    },
                                    {
                                        dataField: "CREDITTRANSAMOUNT",
                                        caption: this.$t('credit', 'common'),
                                        width: this.amtType == 'books' ? "0" : "100", 
                                        alignment: "right",
                                    }
                                ]
                            },
                            {
                                caption: this.$t('books', 'common'),
                                alignment: 'center',
                                columns: [{
                                        dataField: "DEBITBOOKAMOUNT",
                                        caption: this.$t('debit', 'common'),
                                        dataType: "number",
                                        formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                        width: this.amtType == 'trans' ? "0" : "100", 
                                    },
                                    {
                                        dataField: "CREDITBOOKAMOUNT",
                                        caption: this.$t('credit', 'common'),
                                        dataType: "number",
                                        formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                        width: this.amtType == 'trans' ? "0" : "100", 
                                    }
                                ]
                            },
                            {
                                dataField: "CLOSINGBALANCE",
                                caption: this.$t('cfm_balance', 'common'),
                                dataType: "number",
                                formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                            },
                            {
                                dataField: "CUSTOMER",
                                caption: this.$t('customer_name', 'common')
                            },
                            {
                                caption: this.$t('description', 'common'),
                                alignment: 'center',
                                columns: [{
                                        dataField: "REMARK",
                                        caption: this.$t('foreign', 'common')
                                    },
                                    {
                                        dataField: "REMARK2",
                                        caption: this.$t('local', 'common')
                                    }
                                ]
                            }
                        ]
                }
            }
        },
        slSumHeaders() {
            if (this.dialogIsShow === true) {
                return [{
                            dataField: "OPENINGBALANCE",
                            caption: this.$t('op_balance', 'common'),
                            dataType: "number",
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        },
                        {
                            dataField: "CCY",
                            caption: this.$t('ccy', 'common')
                        },
                        {
                            caption: this.$t('trans', 'common'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "DEBITTRANSAMOUNT",
                                    caption: this.$t('debit', 'common'),
                                    width: this.amtType == 'books' ? "0" : "120",
                                    alignment: "right", 
                                },
                                {
                                    dataField: "CREDITTRANSAMOUNT",
                                    caption: this.$t('credit', 'common'),
                                    width: this.amtType == 'books' ? "0" : "120",
                                    alignment: "right",
                                }
                            ]
                        },
                        {
                            caption: this.$t('books', 'common'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "DEBITBOOKAMOUNT",
                                    caption: this.$t('debit', 'common'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "120",
                                },
                                {
                                    dataField: "CREDITBOOKAMOUNT",
                                    caption: this.$t('credit', 'common'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "120",
                                }
                            ]
                        },
                        {
                            dataField: "CLOSINGBALANCE",
                            caption: this.$t('cfm_balance', 'common'),
                            dataType: "number",
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        }
                    ]
            }
        },
        inquiryTypeList() {
            return [{
                    CODE: "dates",
                    NAME: this.$t("Date")
                },
                {
                    CODE: "vouchers",
                    NAME: this.$t("Voucher")
                }
            ];
        },
        amtTypeList() {
            return [{
                    CODE: "trans",
                    NAME: this.$t("Transaction")
                },
                {
                    CODE: "books",
                    NAME: this.$t("book")
                },
                {
                    CODE: "trans-book",
                    NAME: this.$t("trans_book")
                }
            ];
        },
    },

    watch: {
        _language(val) {
            this.selectedLang = val
        },
        dialogIsShow(val) {
            if (val === true) {
                //console.log("ahihi"+this.fromDate);
                // this.$refs.slSumGrid.clear();
                // this.$refs.slDateVoucherGrid.clear();
                this.selectedCompany = this.companyPK
                this.accCodePK = this.accountItem.PK

                this.accCode = `${this.accountItem.CODE} - ${this.accountItem.NAME}`

                this.proposeFrom = this.fromDate
                this.proposeTo = this.toDate
                this.slipStatus = this.status
                this.getListCodes()
                

            } else {
                this.slDateVoucherDataList = []
                this.slSumDataList = []
               
            }
        }
    },
    create() {

    },
    methods: {
        async getListCodes() {
            const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY_ALL',
                para: [this.user.PK]
            }
            this.companyList = await this._dsoCall(dso_company_list, 'select', false)
            const parentCodes = ["ACAB0110", "EACAB021", "EACBK002", "ACBG0040", "COAB0070", "ACBG0040"]
            const results = await this._getCommonCode2(parentCodes, this.user.TCO_COMPANY_PK)
            if (results.length) {
                this.currencyList = results[0]
                this.currencyList.unshift({
                    CODE: 'ALL',
                    NAME: this.$t('all', 'common')
                })
                if (this.ccy == "" || this.ccy == null || this.ccy == undefined || this.ccy == "null") {
                    this.selectedCurrency = this.currencyList[0].CODE
                } else {
                    this.selectedCurrency = this.ccy;
                }
                //this.reportOptionList = results[1]
                //this.selectedReportOpt = this.reportOptionList[0].CODE
                const result_reportOptionList = await this._getCommonCode('EACAB021', ''); 
                this.reportOptionList = result_reportOptionList;
                this.reportOptionList.forEach((e) => {
                    if (e.DEF_YN == "Y") {
                        this.selectedReportOpt = e.CODE;
                    }
                });
                //this.reportTypeList = results[2]
                //this.selectedReportType = this.reportTypeList[0].CODE;
                const result_reportTypeList = await this._getCommonCode('EACBK002', ''); 
                this.reportTypeList = result_reportTypeList;
                this.reportTypeList.forEach((e) => {
                    if (e.DEF_YN == "Y") {
                        this.selectedReportType = e.CODE;
                    }
                });
                this.bookCcyList = results[3]

                //this.selectedLanguage = results[4]; //this.curLang.CODE;//this._languages[0].CODE  this.selectedLanguage =
                //this.selectedLang = this.curLang.CODE;
                const result_selectedLanguage = await this._getCommonCode('COAB0070', ''); 
                this.selectedLanguage = result_selectedLanguage;
                this.selectedLang = this.curLang.CODE;

                const result_status = await this._getCommonCode('ACBG0010', '');
                this.statusList = [...result_status.filter(x => x.VAL1 == 'Y')];

                const dso_bizplace_list = {
                    type: 'list',
                    selpro: 'SYS_SEL_BIZ_PLACE_V2',
                    para: [this.selectedCompany, this.user.PK]
                }
                this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
                if (this.bizPlaceList.length > 0) {
                    this.lstBizPlace = this.bizPlaceList[0].PK;
                };
                //this.amtType = "books"
                if (this.ccy == "" || this.ccy == null || this.ccy == undefined || this.ccy == "null") {
                    this.selectedCurrency = "ALL";
                } else {
                    this.selectedCurrency = this.ccy;
                }
                if (this.bizPlace == "" || this.bizPlace == null || this.bizPlace == undefined || this.bizPlace == "null") {
                    this.lstBizPlace = this.bizPlaceList[0].PK;
                } else {
                    this.lstBizPlace = this.bizPlace;
                }
                const result_ccy = results[5];
                result_ccy.forEach(e => {
                if (e.DEF_YN == "Y") {
                    this.txt_Bookccy = e.CODE;
                }
                });
                this.search();
            }

        },

        async search() {
                this.$refs.slSumGrid.loadData();
        }, 
        handleReturnedAccCode(data) {
            this.accCodePK = data.PK
            this.accCode = `${data.AC_CD} - ${data.AC_NM}`
        },
        onRowPrepared(e){
            if (e.rowType == "data") {
                e.rowElement.style.backgroundColor = "#FFFFFF";
            }
        },
        onAfterLoad() {
            this.store_pro = (this.inquiryType === 'dates') ? 'AC_SEL_DAILY_SL_DIALOG_DATE' : 'AC_SEL_DAILY_SL_DIALOG_VOUCHER';
            this.openingBalance = this.$refs.slSumGrid.getDataSource().length ? parseFloat(this.$refs.slSumGrid.getDataSource()[0].OPENINGBALANCE) : 0;
            var rowData = this.$refs.slSumGrid.getDataSource(); 
            for (var i = 0; i < rowData.length; i++) {
                var l_trans_ccy = rowData[i].CCY;
                var _DEBITTRANSAMOUNT = '';
                var _CREDITTRANSAMOUNT = '';
                  if(l_trans_ccy == 'VND'){
                   _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,0);  
                   _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,0); 
                }
                else{
                   _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,2); 
                   _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,2); 
                }
                this.$refs.slSumGrid.setCellValue("DEBITTRANSAMOUNT", _DEBITTRANSAMOUNT, rowData[i].PK);
                this.$refs.slSumGrid.setCellValue("CREDITTRANSAMOUNT", _CREDITTRANSAMOUNT, rowData[i].PK);
            }
            this.$refs.slDateVoucherGrid.loadData();
        },
        afterLoad() {
           var rowData = this.$refs.slDateVoucherGrid.getDataSource(); 
            for (var i = 0; i < rowData.length; i++) {
                var l_trans_ccy = rowData[i].CCY;
                var _DEBITTRANSAMOUNT = '';
                var _CREDITTRANSAMOUNT = '';
                  if(l_trans_ccy == 'VND'){
                   _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,0);  
                   _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,0); 
                }
                else{
                   _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,2); 
                   _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,2); 
                }
                this.$refs.slDateVoucherGrid.setCellValue("DEBITTRANSAMOUNT", _DEBITTRANSAMOUNT, rowData[i].PK);
                this.$refs.slDateVoucherGrid.setCellValue("CREDITTRANSAMOUNT", _CREDITTRANSAMOUNT, rowData[i].PK);
            }
        },
        onRowDblClick({rowType,  data}) {
             if (rowType === "data" && this.inquiryType === 'vouchers') { 
                this.currentSeq = data.PK
                this.seqArray = this.$refs.slDateVoucherGrid.getDataSource().map(x => x.PK)
                this.$refs.accountSlipDialog.dialogIsShow = true
            }
        },
    }
}
</script>
