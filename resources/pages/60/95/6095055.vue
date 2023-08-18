<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
    <v-container fluid v-resize="onResize" class="pa-2">
        <v-row no-gutters class="pl-2">
            <v-col v-show="showHilden" cols="12" :lg="showHilden ? 4 : 0">
                <v-card class="pa-2">
                    <v-row dense>
                        <v-col md="7">
                            <BaseSelect :label="$t('company')" v-model="selected_company" :lstData="company_list"
                                item-text="TEXT" item-value="PK" @change="onChangeCompany" />
                        </v-col>
                        <v-col md="5" class="d-flex justify-end">
                            <BaseButton icon_type="search" btn_type="icon" :btn_text="$t('search')" :disabled="isProcessing"
                                @onclick="onClickButton('SEARCH_M')" />

                            <BaseButton btn_type="icon" icon_type="copy" @onclick="copyToDialog = true"
                                :disabled="isProcessing" />
                            <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" :disabled="isProcessing"
                                @onclick="onClickButton('NEW_M')" />
                            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"
                                @onclick="onClickButton('DELETE_M')" />
                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                                @onclick="onClickButton('SAVE_M')" />
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <!-- <v-col md="7">
                             <BaseSelect :label="$t('biz_place')" v-model="lstBizplace" :lstData="bizplaceList"
                                item-text="TEXT" item-value="PK" />
                        </v-col> -->
                        <v-col md="2">
                            <datePicker :label="$t('month')" :type="'month'" @returnValue="month = $event"></datePicker>
                        </v-col>
                        <v-col md="5">
                            <datePicker :label="$t('fromdate')" :inputValue="fromDate" :defaultType="'startOfMonth'"
                                @returnValue="fromDate = $event"></datePicker>
                        </v-col>
                        <v-col md="5">
                            <datePicker :inputValue="toDate" :defaultType="'endOfMonth'" :label="$t('to_date')"
                                @returnValue="toDate = $event"></datePicker>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col md="6">
                            <BaseInput :label="$t('serial_no')" v-model="txtSerialNo" />
                        </v-col>
                        <v-col md="6">
                            <BaseSelect :label="$t('status')" v-model="lstStatus" :lstData="statusList" item-text="NAME"
                                item-value="CODE" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <BaseGridView ref="grdEinvoiceIssue" :header="grdHeader" sel_procedure="EI_SEL_6095055_1"
                                :multiselect="true" :headertype="1" :filter_paras="[
                                    this.selected_company,
                                    this.fromDate,
                                    this.toDate,
                                    this.txtSerialNo,
                                    this.lstStatus,
                                ]" 
                                upd_procedure="EI_UPD_6095055_2" :editable="true" :update_paras="[
                                    'PK',
                                    'TCO_COMPANY_PK',
                                    'INVOICE_KIND',
                                    'SERIAL_NO_2',
                                    'FORM_NO',
                                    'SERIAL_NO',
                                    'FROM_DT',
                                    'TO_DT',
                                    'STATUS',
                                    'TCO_BUSPLACE_PK',
                                    'REMARKS',
                                    'USE_YN'
                                ]" :height="limitHeight" @cellDblClick="onDblClickCell" @cellClick="cellClickCell" />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col class="pa-1" cols="12" :lg="showHilden ? 8 : 12">
                <v-row>
                    <v-col md="2" class="d-flex justify-start">
                        <div class="d-flex">
                            <BaseButton btn_type="icon" icon_type="hide_search_panel" :btn_text="$t('hide_search_panel')"
                                v-if="showHilden" mdi-icon="mdi-backburger" @onclick="showHilden = !showHilden" />
                            <BaseButton btn_type="icon" icon_type="show_search_panel" :btn_text="$t('show_search_panel')"
                                v-else mdi-icon="mdi-forwardburger" @onclick="showHilden = !showHilden" />
                        </div>
                    </v-col>
                    <v-col md="4">
                        <div class="d-flex justify-end">
                            <BaseButton  icon_type="process" :btn_text="$t('send_data_template')" @onclick="onGeneralData" />
                        </div>
                    </v-col>
                    <v-col md="2">
                    </v-col>
                    <v-col md="2">
                    </v-col>
                    <v-col md="2">
                    </v-col>
                </v-row>

                <v-row>
                    <v-col md="12">
                        <v-row>
                            <v-col md="2" class="d-flex justify-end">
                                <b> {{ $t('template_table') }} </b>
                            </v-col>
                            <v-col md="10" class="d-flex justify-end">
                                <GwImportExcelFile :label="$t('import_ar_invoice')" :impMultipleTemp="imp_MultipleTemp"
                                    :impCboTemp="cboTemplate" @onrtnseltemp="selTemplate = $event" :impAddParam="[
                                        this.selected_company,
                                        this.lstBizplace,
                                        this.itemTemplatePK
                                    ]" @onAfterImport="onAfterImport" />
                                <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('template_file')"
                                    @onclick="getImpFile" />
                                <BaseButton btn_type="icon" icon_type="view" :btn_text="$t('view')" :disabled="isProcessing"
                                    @onclick="onClickButton('VIEW')" />
                                <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" :disabled="isProcessing"
                                    @onclick="onClickButton('NEW_T')" />
                                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                                    :disabled="isProcessing" @onclick="onClickButton('DELETE_T')" />
                                <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                                    @onclick="onClickButton('SAVE_T')" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <BaseGridView :headertype="1" ref="grdTemplate" :header="grdTemplate"
                                    :height="limitHeightmin" :multiselect="true" sel_procedure="EI_SEL_6095055_3"
                                    :filter_paras="[this.item_pk]" upd_procedure="EI_UPD_6095055_4" :editable="true"
                                    :update_paras="[
                                        'PK',
                                        'TEMPLATE_CD',
                                        'TEMPLATE_NM',
                                        'TEMPLATE_LNM',
                                        'TEMPLATE_FNM',
                                        'FORM_NO',
                                        'USE_YN',
                                        'TEI_COMPANY_PK',
                                        'VALID_DATE_FROM',
                                        'VALID_DATE_TO',
                                        'REPORT_ID',
                                        'ADDR1',
                                        'ADDR2',
                                        'BANK_ACCOUNT1',
                                        'BANK_ACCOUNT2',
                                        'BANK_NM1',
                                        'BANK_NM2',
                                        'TEL',
                                        'FAX',
                                        'TAX_CODE',
                                        'TEI_EINVOICE_ISSUSE_PK',
                                        'WEBSITE',
                                        'TAX_CODE_DISPLAY',
                                        'PBAN',
                                        'SERIAL_NO_2',
                                        'URL_FILE_EXCEL',
                                        'URL_IMG_LOGO',
                                        'LOGO_START_ROW',
                                        'LOGO_START_COL',
                                        'URL_IMG_BG',
                                        'BG_START_ROW',
                                        'BG_END_ROW',
                                        'BG_WIDTH',
                                        'BG_HEIGHT',
                                        'SIGN_START_CELL',
                                        'SIGN_END_CELL',
                                        'SIGN_BY_START_CELL',
                                        'SIGN_BY_END_CELL',
                                        'DETAILS_START_ROW',
                                        'SIGN_CELL_BOX',
                                        'ATT01',
                                        'ATT02',
                                        'ATT03',
                                        'ATT04',
                                        'ATT05',
                                        'ATT06',
                                        'ATT07',
                                        'ATT08',
                                        'ATT09',
                                        'ATT10',
                                        'ATT01_NUM',
                                        'ATT02_NUM',
                                        'ATT03_NUM',
                                        'ATT04_NUM',
                                        'ATT05_NUM',
                                        'ATT06_NUM',
                                        'ATT07_NUM',
                                        'ATT08_NUM',
                                        'ATT09_NUM',
                                        'ATT10_NUM',
                                        'RANGE_DETAILS_SIGN'

                                    ]" @cellClick="cellClickCellTemplate" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="2" class="d-flex justify-end">
                                <b> {{ $t('master_table') }} </b>
                            </v-col>
                            <v-col md="6">
                                <BaseInput :outlined="true"  :label="$t('param_code_master')" v-model="txtParamCodeMaster" @keyPressEnter="onLoadDataParamM" />
                            </v-col>
                            <v-col md="4" class="d-flex justify-end">
                                <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" :disabled="isProcessing"
                                    @onclick="onClickButton('NEW_PM')" />
                                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                                    :disabled="isProcessing" @onclick="onClickButton('DELETE_PM')" />
                                <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                                    @onclick="onClickButton('SAVE_PM')" />
                            </v-col>

                        </v-row>
                        <v-row>
                            <v-col>
                                <BaseGridView :headertype="1" ref="grdParamM" :height="limitHeightmin" :header="grdParamM"
                                    sel_procedure="EI_SEL_6095055_5" upd_procedure="EI_UPD_6095055_6" :editable="true"
                                    :update_paras="[
                                        'PK',
                                        'CELL_CODE',
                                        'DATA_MAPPING',
                                        'REMARKS',
                                        'TEI_TEMPLATE_PK',
                                        'TYPE_TABLE',
                                        'TYPE_TEMPLATE',
                                        'TYPE'
                                    ]" :filter_paras="[ this.itemTemplatePK,
                                                        this.txtParamCodeMaster]" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="2" class="d-flex justify-end">
                                <b> {{ $t('detail_table') }} </b>
                            </v-col>
                            <v-col md="6">
                                <BaseInput :outlined="true"  :label="$t('param_code_details')" v-model="txtParamCodeDetails" @keyPressEnter="onLoadDataParamD" />
                            </v-col>
                            <v-col md="4" class="d-flex justify-end">
                                <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" :disabled="isProcessing"
                                    @onclick="onClickButton('NEW_PD')" />
                                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                                    :disabled="isProcessing" @onclick="onClickButton('DELETE_PD')" />
                                <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                                    @onclick="onClickButton('SAVE_PD')" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <BaseGridView :headertype="1" ref="grdParamD" :height="limitHeightmin" :header="grdParamD"
                                    sel_procedure="EI_SEL_6060230_7" upd_procedure="EI_UPD_6060230_8" :editable="true"
                                    :update_paras="[
                                        'PK',
                                        'REMARKS',
                                        'TEI_TEMPLATE_PK',
                                        'TYPE_TABLE',
                                        'TYPE_TEMPLATE',
                                        'STARTCELL',
                                        'ENDCELL',
                                        'CELLBORDER',
                                        'dataField',
                                        'TYPE',
                                        'ORD'
                                    ]" :filter_paras="[this.itemTemplatePK,
                                                        this.txtParamCodeDetails]" />
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <view-einvoice-pdf-dialog ref="ViewEInvoicePDFDialog" :src_pdfUrl="pdfUrl"></view-einvoice-pdf-dialog>
        <!-- Copy To Dialog -->
        <v-dialog persistent id="copy-to-dialog" max-width="500" v-model="copyToDialog">
            <v-card>
                <v-card-caption class="headline primary-gradient white--text py-2">{{ $t("copy_template_to") }}</v-card-caption>
                <v-card-text class="pa-4 pb-2 d-flex flex-column align-space-between">
                    <v-row>
                        <v-col md="6">
                            <v-select cache-items dense hide-details outlined clearable class="pb-3" item-value="PK"
                                item-text="TEXT" :label="$t('from_company')" :items="company_list"
                                v-model="selectedCompanyFrom"></v-select>
                        </v-col>
                        <v-col md="6">
                            <v-select cache-items dense hide-details outlined class="pb-3" item-value="PK" item-text="TEXT"
                                :label="$t('to_company')" :items="company_list" v-model="selectedCompanyTo"
                                @change="onChangeCompanyFrom"></v-select>
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-col md="6">
                            <v-select cache-items dense hide-details outlined clearable class="pb-3" item-value="PK"
                                item-text="TEXT" :label="$t('from_bizplace')" :items="bizplaceList"
                                v-model="lstBizplaceFrom"></v-select>
                        </v-col>
                        <v-col md="6">
                            <v-select cache-items dense hide-details outlined class="pb-3" item-value="PK" item-text="TEXT"
                                :label="$t('to_bizplace')" :items="bizplaceListTo" v-model="lstBizplaceTo"></v-select>
                        </v-col>
                    </v-row> -->
                    <v-row>
                        <v-col md="6">
                            <v-select cache-items dense hide-details outlined class="pb-3" item-value="CODE"
                                item-text="NAME" :label="$t('from_no_from')" :items="fromNoList"
                                v-model="lstFrom_No_From"></v-select>
                        </v-col>
                        <v-col md="6">
                            <BaseInput :label="$t('from_no_to')" w v-model="txtForm_No_To" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="6">
                            <v-select cache-items dense hide-details outlined class="pb-3" item-value="CODE"
                                item-text="NAME" :label="$t('seria_no_from')" :items="serialNoList"
                                v-model="lstSerial_No_From"></v-select>
                        </v-col>
                        <v-col md="6">
                            <BaseInput :label="$t('seria_no_to')" v-model="txtSerial_No_To" />
                        </v-col>
                    </v-row>

                    <v-checkbox v-show="false" dense hide-details class="my-0 py-0" true-value="Y" false-value="N"
                        :label="$t('overwrite')" v-model="overWriteYN"></v-checkbox>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <span class="red--text">{{ copyResult }}</span>
                    <v-spacer></v-spacer>
                    <v-btn text :color="currentTheme" :disabled="isProcessing" @click="copyToDialog = false">{{ $t("cancel",
                        "common") }}</v-btn>
                    <v-btn depressed class="white--text" :color="currentTheme" :disabled="isProcessing"
                        :loading="isProcessing" @click="onProcessConfirm('copy')">{{ $t("copy") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
  
  <!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 
  
<script>
import moment from "moment";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
    /*############### DEFAULT #######################*/
    layout: "default",
    middleware: "user",
    /*############### components ####################*/
    components: {
        "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
        GwImportExcelFile: () => import('@/components/control/GwImportExcelFile.vue'),
    },
    /*############### data ##########################*/
    data: () => ({
        item_pk: 0,
        itemTemplatePK: "",
        file: null,
        selected_company: "",
        company_list: [],
        bizplaceList: [],
        lstBizplace: "",
        month: "",
        fromDate: "",
        toDate: "",
        lstStatus: "",
        statusList: [],
        txtSerialNo: "",
        pdfUrl: "",
        leftCols: 5,
        showHilden: true,
        indexTab: 0,
        typeInvoiceList: [],
        invoiceKind: [],
        // grdHeader: [],
        typeTableList: [],
        typeTemplateList: [],
        typeList: [],
        versionList: [],
        paramList: [],
        paramDList: [],
        styleList: [],
        imp_MultipleTemp: true,
        selTemplate: [],
        cboTemplate: [],
        selInvoiceType: "",
        cboInvoiceType: [],
        copyToDialog: false,
        fromNoList: [],
        lstFrom_No_From: "",
        serialNoList: [],
        lstSerial_No_From: "",
        txtForm_No_To: "",
        txtSerial_No_To: "",
        overWriteYN: 'N',
        copyResult: "",
        selectedCompanyTo: "",
        selectedCompanyFrom: "",
        lstBizplaceFrom: "",
        lstBizplaceTo: "",
        bizplaceListTo: [],
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        url_template:"",
        txtParamCodeMaster:"",
        txtParamCodeDetails:"",
        dataIssued:[],




    }),
    /*############### created #######################*/
    async created() {
        await this.getListCodes("company");
        await this.getListCodes("status");
        
        this.pdf_handler = require("./js/EiExcelHandlerERPTemplate.js");
        if (!!this.pdf_handler) {
            Object.assign(this, this.pdf_handler.default);
        }

    },
    /*############### watch ######################*/
    watch: {
        month(val) {
            if (val) {
                this.fromDate = val + "01";
                this.toDate = val + this._maxDateOfMonth(val);
            }
        },
    },
    /*############### computed ######################*/
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            if (this.windowHeight <= 768) {
                return this.windowHeight * 0.62; //1366x768
            } else {
                return this.windowHeight * 0.73; //1920x1080
            }
        },
        limitHeightmin() {
            if (this.windowHeight <= 768) {
                return this.windowHeight * 0.15; //1366x768
            } else {
                return this.windowHeight * 0.25; //1920x1080
            }
        },
        gridHeight() {
            return this.formContainerHeight - 250;
        },
        masterContainerHeight() {
            return this.formContainerHeight - 250;
        },

        grdHeader(){
            return   [
                { dataField: "PK", width: 100, caption: this.$t("pk"), alignment: "left", type: "text", visible: false },
                { dataField: "TCO_COMPANY_PK", width: 100, caption: this.$t("tco_company_pk"), alignment: "left", type: "text", visible: false },
                {
                    dataField: "INVOICE_KIND", width: 200, caption: this.$t("invoice_kind"), editable: true,
                    lookup: {
                        dataSource: this.typeInvoiceList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    }, alignment: "left", type: "text"
                },
                {
                    dataField: "SERIAL_NO_2", width: 200, caption: this.$t("invoice_symbol"), editable: true,
                    lookup: {
                        dataSource: this.invoiceKind,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    alignment: "left", type: "text"
                },
                { dataField: "FORM_NO", width: 100, caption: this.$t("form_no"), editable: true, alignment: "left", type: "text" },
                { dataField: "SERIAL_NO", width: 100, caption: this.$t("serial_no"), editable: true, alignment: "left", type: "text" },
                { dataField: "FROM_DT", width: 100, caption: this.$t("from_dt"), editable: true, alignment: "center", type: "date" },
                { dataField: "TO_DT", width: 100, caption: this.$t("to_dt"), editable: true, alignment: "center", type: "date" },
                {
                    dataField: "STATUS", width: 100, caption: this.$t("status"),
                    lookup: {
                        dataSource: this.statusList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    editable: true, alignment: "left", type: "text"
                },
                { dataField: "TCO_BUSPLACE_PK", width: 100, caption: this.$t("tco_busplace_pk"), alignment: "left", type: "text", visible: false },
                { dataField: "REMARKS", width: 100, caption: this.$t("remarks"), editable: true, alignment: "left", type: "text" },
                { dataField: "USE_YN", width: 100, caption: this.$t("use_yn"), editable: true, alignment: "center", type: "checkbox" },

            ];
        },

        grdTemplate() {
            return [
                {
                    dataField: "PK",
                    width: 0,
                    caption: this.$t("pk"),
                    alignment: "left",
                    type: "text",
                    visible: false
                },
                {
                    dataField: "TEMPLATE_CD",
                    width: 100,
                    caption: this.$t("template_cd"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "TEMPLATE_NM",
                    width: 100,
                    caption: this.$t("template_nm"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "TEMPLATE_LNM",
                    width: 100,
                    caption: this.$t("template_lnm"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "TEMPLATE_FNM",
                    width: 100,
                    caption: this.$t("template_fnm"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "FORM_NO",
                    width: 100,
                    caption: this.$t("form_no"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "USE_YN",
                    width: 100,
                    caption: this.$t("use_yn"),
                    alignment: "center",
                    type: "checkbox",
                    editable: true,
                },
                {
                    dataField: "TCO_COMPANY_PK",
                    width: 0,
                    caption: this.$t("tco_company_pk"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                    visible: false
                },
                {
                    dataField: "VALID_DATE_FROM",
                    width: 150,
                    caption: this.$t("valid_date_from"),
                    alignment: "center",
                    type: "date",
                    editable: true,
                },
                {
                    dataField: "VALID_DATE_TO",
                    width: 150,
                    caption: this.$t("valid_date_to"),
                    alignment: "center",
                    type: "date",
                    editable: true,
                },
                {
                    dataField: "REPORT_ID",
                    width: 200,
                    caption: this.$t("report_id"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                    visible: false
                },
                {
                    dataField: "TEL",
                    width: 150,
                    caption: this.$t("tel"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "FAX",
                    width: 150,
                    caption: this.$t("fax"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "BANK_ACCOUNT1",
                    width: 200,
                    caption: this.$t("bank_account1"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "BANK_ACCOUNT2",
                    width: 200,
                    caption: this.$t("bank_account2"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "BANK_NM1",
                    width: 200,
                    caption: this.$t("bank_nm1"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "BANK_NM2",
                    width: 200,
                    caption: this.$t("bank_nm2"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "TAX_CODE",
                    width: 150,
                    caption: this.$t("tax_code"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "WEBSITE",
                    width: 100,
                    caption: this.$t("website"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "TAX_CODE_DISPLAY",
                    width: 200,
                    caption: this.$t("tax_code_display"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "PBAN",
                    width: 100,
                    caption: this.$t("pban"),
                    type: "text",
                    editable: true,
                    alignment: "center",
                    lookup: {
                        dataSource: this.versionList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },

                },
                {
                    dataField: "URL_FILE_EXCEL",
                    width: 200,
                    caption: this.$t("url_file_excel"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "URL_IMG_LOGO",
                    width: 200,
                    caption: this.$t("url_img_logo"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "LOGO_START_ROW",
                    width: 100,
                    caption: this.$t("logo_start_row"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 1,
                    editable: true,
                },
                {
                    dataField: "LOGO_START_COL",
                    width: 100,
                    caption: this.$t("logo_start_col"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 1,
                    editable: true,
                },
                {
                    dataField: "URL_IMG_BG",
                    width: 200,
                    caption: this.$t("url_img_bg"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "BG_START_ROW",
                    width: 100,
                    caption: this.$t("bg_start_row"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 1,
                    editable: true,
                },
                {
                    dataField: "BG_END_ROW",
                    width: 100,
                    caption: this.$t("bg_end_row"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 1,
                    editable: true,
                },

                {
                    dataField: "BG_WIDTH",
                    width: 100,
                    caption: this.$t("bg_width"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 1,
                    editable: true,
                },
                {
                    dataField: "BG_HEIGHT",
                    width: 100,
                    caption: this.$t("bg_height"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 1,
                    editable: true,
                },
                {
                    dataField: "SIGN_START_CELL",
                    width: 100,
                    caption: this.$t("SIGN_START_CELL"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                },
                {
                    dataField: "SIGN_END_CELL",
                    width: 100,
                    caption: this.$t("SIGN_END_CELL"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                },
                {
                    dataField: "SIGN_BY_START_CELL",
                    width: 100,
                    caption: this.$t("SIGN_BY_START_CELL"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                },
                {
                    dataField: "SIGN_BY_END_CELL",
                    width: 100,
                    caption: this.$t("SIGN_BY_END_CELL"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                },
                {
                    dataField: "SIGN_CELL_BOX",
                    width: 100,
                    caption: this.$t("SIGN_CELL_BOX"),
                    alignment: "left",
                    type: "text",
                    // formatFloat: 0,
                    editable: true,
                },
                {
                    dataField: "DETAILS_START_ROW",
                    width: 100,
                    caption: this.$t("details_start_row"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                },
                {
                    dataField: "RANGE_DETAILS_SIGN",
                    width: 100,
                    caption: this.$t("range_details_sign"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                },
                {
                    dataField: "ATT01",
                    width: 200,
                    caption: this.$t("att01"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT02",
                    width: 200,
                    caption: this.$t("att02"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT03",
                    width: 200,
                    caption: this.$t("att03"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT04",
                    width: 200,
                    caption: this.$t("att04"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT05",
                    width: 200,
                    caption: this.$t("att05"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT06",
                    width: 200,
                    caption: this.$t("att06"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT07",
                    width: 200,
                    caption: this.$t("att07"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT08",
                    width: 200,
                    caption: this.$t("att08"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "ATT09",
                    width: 200,
                    caption: this.$t("att09"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                    visible: false
                },
                {
                    dataField: "ATT10",
                    width: 200,
                    caption: this.$t("att10"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                    visible: false
                },
                {
                    dataField: "ATT01_NUM",
                    width: 100,
                    caption: this.$t("att01_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: false
                },
                {
                    dataField: "ATT02_NUM",
                    width: 100,
                    caption: this.$t("att02_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: false
                },
                {
                    dataField: "ATT03_NUM",
                    width: 100,
                    caption: this.$t("att03_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: false
                },
                {
                    dataField: "ATT04_NUM",
                    width: 100,
                    caption: this.$t("att04_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: false
                },
                {
                    dataField: "ATT05_NUM",
                    width: 100,
                    caption: this.$t("att05_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: true
                },
                {
                    dataField: "ATT06_NUM",
                    width: 100,
                    caption: this.$t("att06_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: true
                },
                {
                    dataField: "ATT07_NUM",
                    width: 100,
                    caption: this.$t("att07_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: true
                },
                {
                    dataField: "ATT08_NUM",
                    width: 100,
                    caption: this.$t("att08_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: true
                },
                {
                    dataField: "ATT09_NUM",
                    width: 100,
                    caption: this.$t("att09_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: false
                },
                {
                    dataField: "ATT10_NUM",
                    width: 100,
                    caption: this.$t("att10_num"),
                    alignment: "left",
                    type: "number",
                    formatFloat: 0,
                    editable: true,
                    visible: false
                }
            ];
        },

        grdParamM() {
            return [
                {
                    dataField: "PK",
                    width: 80,
                    caption: this.$t("PK"),
                    alignment: "left",
                    type: "text",
                    visible: false
                },
                {
                    dataField: "CELL_CODE",
                    width: 100,
                    caption: this.$t("cell_code"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "DATA_MAPPING",
                    width: 150,
                    caption: this.$t("data_mapping"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                    lookup: {
                        dataSource: this.paramList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                },
                {
                    dataField: "TEI_TEMPLATE_PK",
                    width: 200,
                    caption: this.$t("tei_template_pk"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                    visible: false
                },
                {
                    dataField: "TYPE_TEMPLATE",
                    width: 100,
                    caption: this.$t("type_template"),
                    alignment: "center",
                    lookup: {
                        dataSource: this.typeTemplateList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "TYPE_TABLE",
                    width: 100,
                    caption: this.$t("type_table"),
                    alignment: "center",
                    lookup: {
                        dataSource: this.typeTableList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "TYPE",
                    width: 200,
                    caption: this.$t("type"),
                    alignment: "left",
                    lookup: {
                        dataSource: this.typeList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    editable: true,
                },
                {
                    dataField: "REMARKS",
                    width: 400,
                    caption: this.$t("remarks"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                }


            ];
        },

        grdParamD() {
            return [
                {
                    dataField: "PK",
                    width: 80,
                    caption: this.$t("PK"),
                    alignment: "left",
                    type: "text",
                    hidden: true,
                },
                {
                    dataField: "ORD",
                    width: 80,
                    caption: this.$t("ord"),
                    alignment: "right",
                    type: "text",
                    allowEditing: true,
                },
                {
                    dataField: "STARTCELL",
                    width: 100,
                    caption: this.$t("startcell"),
                    alignment: "right",
                    type: "number",
                    allowEditing: true,
                },
                {
                    dataField: "ENDCELL",
                    width: 100,
                    caption: this.$t("endcell"),
                    alignment: "right",
                    type: "number",
                    allowEditing: true,
                },
                {
                    dataField: "CELLBORDER",
                    width: 150,
                    caption: this.$t("cellborder"),
                    alignment: "center",
                    lookup: {
                        dataSource: this.styleList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    allowEditing: true,
                },
                {
                    dataField: "FIELD",
                    width: 100,
                    caption: this.$t("field"),
                    alignment: "left",
                    lookup: {
                        dataSource: this.paramDList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    allowEditing: true,
                },
                {
                    dataField: "TYPE",
                    width: 200,
                    caption: this.$t("type"),
                    alignment: "left",
                    lookup: {
                        dataSource: this.typeList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    allowEditing: true,
                },
                {
                    dataField: "REMARKS",
                    width: 200,
                    caption: this.$t("remarks"),
                    alignment: "left",
                    type: "text",
                    allowEditing: true,
                },
                {
                    dataField: "TEI_TEMPLATE_PK",
                    width: 200,
                    caption: this.$t("tei_template_pk"),
                    alignment: "left",
                    type: "text",
                    editable: true,
                    visible: false
                },
                {
                    dataField: "TYPE_TEMPLATE",
                    width: 100,
                    caption: this.$t("type_template"),
                    alignment: "center",
                    lookup: {
                        dataSource: this.typeTemplateList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    allowEditing: true,
                },
                {
                    dataField: "TYPE_TABLE",
                    width: 100,
                    caption: this.$t("type_table"),
                    alignment: "center",
                    lookup: {
                        dataSource: this.typeTableList,
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                    },
                    type: "text",
                    allowEditing: true,
                }
            ];
        },

       
    },
    /*############### mounted #######################*/
    mounted() {
        //this.$refs.grdEinvoiceIssue.loadData();
    },

    /*############### methods #######################*/
    methods: {

        onDblClickCell(cell) {
        },

        cellClickCell(cell) {
            this.item_pk = cell.data.PK;
            this.dataIssued = cell.data;
            this.itemTemplatePK = cell.data.TEI_TEMPLATE_PK
            this.$refs.grdTemplate.loadData();
            this.$refs.grdParamM.loadData();
            this.$refs.grdParamD.loadData();

        },

        cellClickCellTemplate(cell) {
            console.log("file: 6095420.vue:1242 [vng-304] cellClickCellTemplate [vng-304] cell:", cell)
            
            this.itemTemplatePK = cell.data.PK;
            this.url_template =  cell.data.URL_FILE_EXCEL;
            this.$refs.grdParamM.loadData();
            this.$refs.grdParamD.loadData();
        },

        toggleLeft() {
            this.showLeft = this.showLeft ? false : true;
            this.leftCols = !this.showLeft ? 0 : 5;
            this.btnIconType = !this.showLeft ? "skip_next" : "skip_prev";
        },

        onClickButton(pos) {
            switch (pos) {
                case 'VIEW':
                    this.onPreview();
                    // this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
                    break;
                case 'NEW_M':
                    this.onNew()
                    break;
                case 'DELETE_M':
                    this.onDelete();
                    break;
                case 'SAVE_M':
                    this.onSave();
                    break;
                case 'SEARCH_M':
                    this.onSearch();
                    break;
                case 'NEW_T':
                    this.onNew_T();
                    break;
                case 'SAVE_T':
                    this.onSave_T();
                    break;
                case 'DELETE_T':
                    this.onDelete_T();
                    break;
                case 'NEW_PM':
                    this.onNew_PM();
                    break;
                case 'SAVE_PM':
                    this.onSave_PM();
                    break;
                case 'DELETE_PM':
                    this.onDelete_PM();
                    break;
                case 'NEW_PD':
                    this.onNew_PD();
                    break;
                case 'SAVE_PD':
                    this.onSave_PD();
                    break;
                case 'DELETE_PD':
                    this.onDelete_PD();
                    break;

            }

        },

        async onCellClick({ column, data, rowIndex, rowType }) {
            // console.log(data)
        },

        async onSearch() {
            this.$refs.grdEinvoiceIssue.loadData();
        },

        onDelete() {
            this.$refs.grdEinvoiceIssue.onSetMarkedDelete(true);
        },

        onDelete_T() {
            this.$refs.grdTemplate.onSetMarkedDelete(true);
        },

        onDelete_P() {
            this.$refs.grdParamM.onSetMarkedDelete(true);
        },

        async onSave() {
            let requireCol = [];
            let validate = this.$refs.grdEinvoiceIssue.onCheckValid(requireCol);
            if (validate) {
                this.$refs.grdEinvoiceIssue.saveData();
            }
        },

        async onSave_T() {
            let requireCol = [];
            let validate = this.$refs.grdTemplate.onCheckValid(requireCol);
            if (validate) {
                this.$refs.grdTemplate.saveData();
            }
        },

        async onSave_PM() {
            // let requireCol = ["CELL_CODE", "DATA_MAPPING","TYPE"];
            this.onValudateMaster();
            let requireCol = [];
            let validate = this.$refs.grdParamM.onCheckValid(requireCol);
            if (validate) {
                this.$refs.grdParamM.saveData();
            }
        },

        onValudateMaster(){
            // console.log("this.$refs.grdParamM.getDataSource()  ", this.$refs.grdParamM.getDataSource());
              for(let i = 0; i< this.$refs.grdParamM.getDataSource().length; i++)
              {
                    if(this.$refs.grdParamM.getDataSource()[i].CELL_CODE == null && this.$refs.grdParamM.getDataSource()[i].TYPE == null)
                    {
                        return this.showNotification('warning', this.$t('notification'), this.$t(`you_can_combinatons_to_generate_accountcode`), 500);
                    }
              }
        },

        onDelete_PM() {
            this.$refs.grdParamM.onSetMarkedDelete(true);
        },

        onDelete_PD() {
            this.$refs.grdParamD.onSetMarkedDelete(true);
        },

        async onSave_PD() {
            let requireCol = ["ORD", "STARTCELL", "ENDCELL", "CELLBORDER","dataField", "TYPE" ];
            let validate = this.$refs.grdParamD.onCheckValid(requireCol);
            if (validate) {
                this.$refs.grdParamD.saveData();
            }
        },

        async getListCodes(pos) {
            switch (pos) {
                case "company":
                    const dso_company_list = {
                        type: "list",
                        selpro: "SYS_SEL_LIST_COMPANY",
                        para: [this.user.PK],
                    };
                    this.company_list = await this._dsoCall(
                        dso_company_list,
                        "select",
                        false
                    );
                    this.selected_company = this.company_list[0].PK;
                    this.selectedCompanyFrom = this.selected_company;

                    // const dso_bizplace_list = {
                    //     type: "list",
                    //     selpro: "SYS_SEL_BIZ_PLACE_V2",
                    //     para: [this.selected_company, this.user.PK],
                    // };
                    // this.bizplaceList = await this._dsoCall(dso_bizplace_list,"select",false);
                    // if (this.bizplaceList.length > 0) {
                    //     this.lstBizplace = this.bizplaceList[0].PK;
                    //     this.lstBizplaceFrom = this.bizplaceList[0].PK;
                    // }

                    const dso_from_no = {
                        type: "list",
                        selpro: "EI_FORM_NO_EI_V2",
                        para: [this.lstCompany],
                    };
                    this.fromNoList = await this._dsoCall(dso_from_no, "select", false);
                    this.lstFrom_No_From = this.fromNoList.length > 0 ? this.fromNoList[0].CODE : "";

                    const dso_serial_no = {
                        type: "list",
                        selpro: "EI_SERIAL_NO_EI_V2",
                        para: [this.selected_company],
                    };
                    this.serialNoList = await this._dsoCall(dso_serial_no, "select", false);
                    this.lstSerial_No_From = this.serialNoList.length > 0 ? this.serialNoList[0].CODE : "";

                    break;

                case "status":
                    const dso_status_list = { type: 'list', selpro: 'EI_GET_STATUS_CREATE_EI_NC', para: [this.selected_company] }
                    this.statusList = await this._dsoCall(dso_status_list, 'select', false)
                    this.lstStatus = "ALL";

                    const dso1 = {
                        type: "list",
                        updpro: "EI_SEL_EINVOICE_TYPE",
                        para: [this.selected_company,
                        this.lstBizplace, //this.lstBizPlace,
                            "Y",
                            "Y"],
                    };

                    const parentCodes = [
                        "ACEIS020",         //0
                        "ACEIS030",         //1
                        "ACEI0390",         //2
                        "ACJS0400",         //3
                        "ACJS0410",         //4
                        "ACEI0220",         //5
                        "ACJS0430",         //6
                        "ACJS0470",         //7
                        "ACJS0480",         //8
                        "ACJS0490"         //9
                    ];
                    const results = await this._getCommonCode2(parentCodes,this.selected_company);
                    if (results.length) {
                        this.typeInvoiceList = results[0];
                        this.invoiceKind = results[1];
                        this.typeTableList = results[2];
                        this.typeTemplateList = results[3];
                        this.typeList = results[4];
                        this.versionList = results[5];
                        this.paramList = results[6];
                        this.styleList = results[7];
                        this.paramDList = results[8];
                        this.cboTemplate = results[9];
                    }
                    break;
            }
        },

        async onChangeCompany() {
            this.selectedCompanyFrom = this.selected_company;
            this.lstBizplaceFrom = this.lstBizplace;
            this.fromNoList = [];
            this.serialNoList = [];

            // const dso_bizplace_list = {
            //     type: "list",
            //     selpro: "SYS_SEL_BIZ_PLACE_V2",
            //     para: [this.selected_company, this.user.PK],
            // };
            // this.bizplaceList = await this._dsoCall(
            //     dso_bizplace_list,
            //     "select",
            //     false
            // );
            // if (this.bizplaceList.length > 0) {
            //     this.lstBizplace = this.bizplaceList[0].PK;
            // }

            // const dso_from_no = {
            //     type: "list",
            //     selpro: "AC_FORM_NO_EI_V2",
            //     para: [this.lstCompany, this.lstBizplace],
            // };
            // this.fromNoList = await this._dsoCall(dso_from_no, "select", false);
            // this.lstFrom_No_From = this.fromNoList.length > 0 ? this.fromNoList[0].CODE : "";

            // const dso_serial_no = {
            //     type: "list",
            //     selpro: "AC_SERIAL_NO_EI_V2",
            //     para: [this.selected_company, this.lstBizplace],
            // };
            // this.serialNoList = await this._dsoCall(dso_serial_no, "select", false);
            // this.lstSerial_No_From = this.serialNoList.length > 0 ? this.serialNoList[0].CODE : "";

        },

        async onChangeCompanyFrom() {
            //this.selectedCompanyFrom = this.selected_company;
            this.fromNoList = [];
            this.serialNoList = [];

            const dso_bizplace_list = {
                type: "list",
                selpro: "SYS_SEL_BIZ_PLACE_V2",
                para: [this.selectedCompanyTo, this.user.PK],
            };
            this.bizplaceListTo = await this._dsoCall(
                dso_bizplace_list,
                "select",
                false
            );
            if (this.bizplaceListTo.length > 0) {
                this.lstBizplaceTo = this.bizplaceListTo[0].PK;
            }
        },

        onNew() {
            this.$refs.grdEinvoiceIssue.addRowStruct({
                PK: "",
                TCO_COMPANY_PK: this.selected_company,
                INVOICE_KIND: "",
                SERIAL_NO_2: "",
                FORM_NO: "",
                SERIAL_NO: "",
                FROM_DT: "",
                TO_DT: "",
                STATUS: "",
                TCO_BUSPLACE_PK: this.lstBizplace,
                REMARKS: "",
                USE_YN: "Y",
            });
        },

        onNew_T() {
            this.$refs.grdTemplate.addRowStruct({
                PK: "",
                TEMPLATE_CD: "",
                TEMPLATE_NM: "",
                TEMPLATE_LNM: "",
                TEMPLATE_FNM: "",
                FORM_NO: "",
                USE_YN: "Y",
                TEI_COMPANY_PK: this.selected_company,
                VALID_DATE_FROM: "",
                VALID_DATE_TO: "",
                REPORT_ID: "",
                ADDR1: "",
                ADDR2: "",
                BANK_ACCOUNT1: "",
                BANK_ACCOUNT2: "",
                BANK_NM1: "",
                BANK_NM2: "",
                TEL: "",
                FAX: "",
                TAX_CODE: "",
                TEI_EINVOICE_ISSUSE_PK: this.item_pk,
                WEBSITE: "",
                TAX_CODE_DISPLAY: "",
                PBAN: "",


            });
        },

        onNew_PM() {
            this.$refs.grdParamM.addRowStruct({
                PK: "",
                CELL_CODE: "",
                DATA_MAPPING: "",
                REMARKS: "",
                TEI_TEMPLATE_PK: this.itemTemplatePK,
                TYPE_TABLE: "M",
                TYPE_TEMPLATE: "O",
                TYPE: "1"
            });

        },
        onNew_PD() {
            this.$refs.grdParamD.addRowStruct({
                PK: "",
                REMARKS: "",
                TEI_TEMPLATE_PK: this.itemTemplatePK,
                TYPE_TABLE: "D",
                TYPE_TEMPLATE: "O",
                STARTCELL: "",
                ENDCELL: "",
                CELLBORDER: "",
                dataField: "",
                TYPE: "1"
            });

        },

        onAfterImport() {
            // console.log("onAfterImport  ");
            this.$refs.grdTemplate.loadData();
        },

        async onProcessConfirm(action) {

            this.actionProcess = action;
            //this.actionDialog = true;

            let promise = Swal.fire({
                icon: 'question',
                caption: this.$t(`do_you_want_to_${action.toLowerCase()}`),
                showCancelButton: true,
                confirmButtonText: this.$t("yes"),
                cancelButtonText: this.$t("no")
            }).then((result) => {
                if (result.isConfirmed) {
                    this.onCopy();
                }
            });

            await promise;

        },

        async onCopy() {
            // if (this.selectedCompanyTo === this.selectedCompanyFrom) {
            //     return this.showNotification("danger", this.$t("copy_failed"), this.$t("cannot_select_same_company"))
            // }
            if (!this.selectedCompanyTo) {
                return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_select_from_company"))
            }
            if (!this.txtForm_No_To) {
                return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_input_form_no_to"))
            }
            if (!this.txtSerial_No_To) {
                return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_input_serial_no_to"))
            }
            const dso = {
                type: 'process',
                updpro: 'EI_PRO_6060230_COPY',
                para: [
                    this.selectedCompanyFrom,
                    this.selectedCompanyTo,
                    this.lstBizplaceFrom,
                    this.lstBizplaceTo,
                    this.lstFrom_No_From,
                    this.txtForm_No_To,
                    this.lstSerial_No_From,
                    this.txtSerial_No_To,
                    this.overWriteYN
                ]
            }

            const result = await this._dsoCall(dso, 'process', true)
            if (result) {
                const rtn = result[0].RTN;
                this.copyToDialog = false;
                //this.copyResult =  this.$t( rtn);
            }

        },

        async onPreview() {
            if (!this.itemTemplatePK) {
                return this.showNotification("warning", this.$t("error_occurs"), "pls_select_template");
            }
            try {
                this.isProcessing = true;

                this.pdfUrl = await this.pdfUrlGetter(this.itemTemplatePK);
                // console.log("=====> pdfUrlv", this.pdfUrl);
                this.$nextTick(() => {
                    this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
                });
                this.isProcessing = false;
            } catch (e) {
                this.isProcessing = false;
                return this.showNotification("danger", e.message);
            }
        },

        async pdfUrlGetter(pk) {
            const pdfUrlExcel = await this.getEinvoiceERP_V2(this, pk);
            return pdfUrlExcel;
        },

        async getImpFile() {
            // console.log("this.url_template  ", this.url_template);
            if(!this.url_template.length)
            {
                return this.showNotification("warning", this.$t("error_occurs"), "pls_select_template");
            }
            const res = await this.$axios.$get('/dso/downloadtemp', {
                responseType: "blob",
                params: {
                    template: this.url_template
                }
            });
            //console.log("res   ", res);
            //console.log("res   ", res.size);
            if (res && res.size > 0) {
                try {
                    let blob = new Blob([res], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });
                    // let _gettime = new Date().getTime();
                    const filenameSplit = this.url_template.split("/");
                    let filename = this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] +'.xlsx';
                    // filename =     this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '.xlsx';
                    this._ExcelSaveAs(blob, filename);

                } catch (e) {
                    let blob = new Blob([res], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });
                    const filenameSplit = this.url_template.split("/");
                    let filename = this.filterItems(filenameSplit, '.xls')[0].split(".")[0] +'.xls';
                    // filename =     this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '.xlsx';
                    this._ExcelSaveAs(blob, filename);

                    // this.showNotification("danger", this.$t("cannot_find_template"), e, 3001);
                }
            } else {
                this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
            }
        },

        onLoadDataParamM(){
            this.$refs.grdParamM.loadData();
        },
        
        onLoadDataParamD(){
            this.$refs.grdParamD.loadData();
        },

        async onGeneralData(){
            this.dataIssued.Template = [];
            this.dataIssued.Template.push(this.$refs.grdTemplate.getDataSource());

            // console.log("this.$refs.grdParamM.getDataSource() 2 =>", this.$refs.grdParamM.getDataSource());
            this.dataIssued.ParamMaster = [];
            this.dataIssued.ParamMaster.push(this.$refs.grdParamM.getDataSource());

            // console.log("this.$refs.grdParamD.getDataSource() 2 =>", this.$refs.grdParamD.getDataSource());
            this.dataIssued.ParamDetail = [];
            this.dataIssued.ParamDetail.push(this.$refs.grdParamD.getDataSource());
            // console.log("dataIssued 2 =>", JSON.stringify(this.dataIssued));


            let res = await this.$axios.$post("/einvoice/updatetemplate", {
                responseType: "json",
                para: this.dataIssued,
            });
            if(res.success)
            {
                this.showNotification('success', this.$t('alert'), res.message);

            }else{
                this.showNotification("danger", this.$t("error_occurs"), res.message);
            }

        }
    },
};
  /*==================================================================== END export default  ========================================================================================*/
</script>
  <!-- ================================================================= END SCRIPT  ============================================================================================== -->
    