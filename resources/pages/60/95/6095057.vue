<template>
  <v-container fluid v-resize="onResize">
    <v-row dense class="pt-1">
      <v-col v-show="showHilden" cols="12" :lg="showHilden ? 7 : 0">
        <v-row dense>
          <v-col md="11">
            <BaseInput outlined :label="$t('template_id')" v-model="template_id" @keyPressEnter="onSearch" />
          </v-col>
          <v-col md="1">
            <BaseButton icon_type="search" btn_type="icon" :btn_text="$t('search')" @onclick="onClickButton('SEARCH')" />
          </v-col>
        </v-row>
        <v-row dense>
          <!-- <v-col md="2" class="d-flex justify-end">
            <b> {{ $t("template_table") }} </b>
          </v-col> -->
          <v-col md="12" class="d-flex justify-end">
            <GwPutFile
              :label="$t('import_einvoice_excel')"
              :impMultipleTemp="imp_MultipleTemp"
              :impCboTemp="cboTemplate"
              @onrtnseltemp="selTemplate = $event"
              sProd="EI_UPD_TEMPLATES_EINVOICE"
              :impAddParam="['', this.itemTemplatePK]"
              @onAfterImport="onAfterImport"
            />
            <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('template_file')" @onclick="getImpFile" />
            <BaseButton btn_type="icon" icon_type="view" :btn_text="$t('view')" @onclick="onClickButton('VIEW')" />
            <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" @onclick="onClickButton('NEW_T')" />
            <!-- <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onClickButton('DELETE_T')" /> -->
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClickButton('SAVE_T')" />
          </v-col>
          <v-row lg="12">
            <v-col>
              <BaseGridView
                :headertype="1"
                ref="grdTemplate"
                :header="grdTemplate"
                :height="limitHeightT"
                :multiselect="true"
                sel_procedure="EI_SEL_6095057_01_NC"
                :filter_paras="[this.template_id]"
                upd_procedure="EI_UPD_6095057_02"
                :editable="true"
                :update_paras="[
                  'PK',
                  'TEMPLATE_CD',
                  'TEMPLATE_NM',
                  'TEMPLATE_LNM',
                  'TEMPLATE_FNM',
                  'USE_YN',
                  'URL_FILE_EXCEL',
                  'DETAILS_START_ROW',
                  'SIGN_BY_START_CELL',
                  'SIGN_BY_END_CELL',
                  'SIGN_START_CELL',
                  'SIGN_END_CELL',
                  'SIGN_CELL_BOX',
                  'SIGN_RANGE_DETAILS',
                  'FORM_NO',
                  'URL_FILE_EXCEL_IMP', 
                  'URL_FILE_EXCEL_C', 
                  'URL_FILE_EXCEL_C_IMP'
                ]"
                @cellClick="cellClickCellTemplate"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-col>
      <v-col cols="12" :lg="showHilden ? 5 : 12">
        <v-row dense>
          <v-col md="1"></v-col>
          <v-col md="2" class="d-flex justify-end">
            <b> {{ $t("master_table") }} </b>
          </v-col>
          <v-col md="6">
            <BaseInput :outlined="true" :label="$t('param_code_master')" v-model="txtParamCodeMaster" @keyPressEnter="onLoadDataParamM" />
          </v-col>
          <v-col md="3" class="d-flex justify-end">
            <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" @onclick="onClickButton('NEW_PM')" />
            <!-- <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onClickButton('DELETE_PM')" /> -->
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClickButton('SAVE_PM')" />
          </v-col>
          <v-row lg="12">
            <v-col>
              <BaseGridView
                :headertype="1"
                ref="grdParamM"
                :height="limitHeightmin"
                :header="grdParamM"
                sel_procedure="EI_SEL_6095055_5_NC"
                upd_procedure="EI_UPD_6095055_6"
                :editable="true"
                :update_paras="['PK', 'CELL_CODE', 'DATA_MAPPING', 'REMARKS', 'TEI_TEMPLATE_PK', 'TYPE_TABLE', 'TYPE_TEMPLATE', 'TYPE']"
                :filter_paras="[this.itemTemplatePK, this.txtParamCodeMaster]"
              />
            </v-col>
          </v-row>
        </v-row>

        <v-row dense>
          <v-col md="1"></v-col>
          <v-col md="2" class="d-flex justify-end">
            <b> {{ $t("detail_table") }} </b>
          </v-col>
          <v-col md="6">
            <BaseInput :outlined="true" :label="$t('param_code_details')" v-model="txtParamCodeDetails" @keyPressEnter="onLoadDataParamD" />
          </v-col>
          <v-col md="3" class="d-flex justify-end">
            <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" @onclick="onClickButton('NEW_PD')" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onClickButton('DELETE_PD')" />
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClickButton('SAVE_PD')" />
          </v-col>
          <v-row lg="12">
            <v-col>
              <BaseGridView
                :headertype="1"
                ref="grdParamD"
                :height="limitHeightmin"
                :header="grdParamD"
                sel_procedure="EI_SEL_6095057_7_NC"
                upd_procedure="EI_UPD_6095057_8"
                :editable="true"
                :update_paras="['PK', 'REMARKS', 'TEI_TEMPLATE_PK', 'TYPE_TABLE', 'TYPE_TEMPLATE', 'STARTCELL', 'ENDCELL', 'CELLBORDER', 'FIELD', 'TYPE', 'ORD']"
                :filter_paras="[this.itemTemplatePK, this.txtParamCodeDetails]"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-col>
    </v-row>
    <GwLoading :visible="showLoading" />
    <!-- <view-einvoice-pdf-dialog ref="ViewEInvoicePDFDialog" :src_pdfUrl="pdfUrl"></view-einvoice-pdf-dialog> -->
    <v-dialog v-model="showPDF" max-width="800">
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <v-card outlined :height="limitHeight1" :max-height="limitHeight1" style="overflow-y: scroll" v-resize="onResize">
              <v-overlay :value="showLoading" :absolute="true" opacity="0.3">
                <v-progress-circular indeterminate size="50"></v-progress-circular>
              </v-overlay>
              <iframe :src="pdfUrl" height="100%" width="100%"></iframe>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
  </v-container>
</template>

!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= -->

<script>
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: {
    "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
  },
  /*############### data ##########################*/
  data: () => ({
    origin: "center center",
    isMaximized: false,
    showPDF: false,
    showLoading: false,
    item_pk: null,
    itemTemplatePK: "",
    file: null,
    selected_company: "",
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
    overWriteYN: "N",
    copyResult: "",
    selectedCompanyTo: "",
    selectedCompanyFrom: "",
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    url_template: "",
    txtParamCodeMaster: "",
    txtParamCodeDetails: "",
    dataIssued: [],

    Form_noList: [],
    TemplateList: [],
    template_id: "",
  }),
  /*############### created #######################*/
  async created() {
    console.clear();
    await this.getListCodes("status");

    this.pdf_handler = require("./js/EiExcelHandlerERPTemplates.js");
    if (!!this.pdf_handler) {
      Object.assign(this, this.pdf_handler.default);
    }
  },
  /*############### watch ######################*/
  watch: {},
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight1() {
      if (this.isMaximized) {
        return Math.floor(this._calculateHeight(this.windowHeight, 90));
      }
      return Math.floor(this._calculateHeight(this.windowHeight, 80));
    },
    limitHeightT() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.8; //1366x768
      } else {
        return this.windowHeight * 0.62; //1920x1080
      }
    },
    limitHeightmin() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.14; //1366x768
      } else {
        return this.windowHeight * 0.3; //1920x1080
      }
    },
    gridHeight() {
      return this.formContainerHeight - 250;
    },
    masterContainerHeight() {
      return this.formContainerHeight - 250;
    },
    grdTemplate() {
      return [
        {
          dataField: "PK",
          width: 0,
          caption: this.$t("pk"),
          alignment: "left",
          type: "text",
          visible: false,
        },
        {
          dataField: "TEMPLATE_CD",
          width: 250,
          caption: this.$t("template_id"),
          editable: true,
          lookup: {
            dataSource: this.TemplateList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
        },
        // {
        //   dataField: "TEMPLATE_NM",
        //   width: 100,
        //   caption: this.$t("template_nm"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "TEMPLATE_LNM",
        //   width: 100,
        //   caption: this.$t("template_lnm"),
        //   alignment: "left",
        //   type: "text",
        //   hidden: true,
        // },
        // {
        //   dataField: "TEMPLATE_FNM",
        //   width: 100,
        //   caption: this.$t("template_fnm"),
        //   alignment: "left",
        //   type: "text",
        //   hidden: true,
        // },
        {
          dataField: "FORM_NO",
          width: 130,
          caption: this.$t("form_no"),
          alignment: "left",
          type: "text",
          lookup: {
            dataSource: this.Form_noList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          editable: true,
        },
        {
          dataField: "USE_YN",
          width: 60,
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
          visible: false,
        },
        // {
        //   dataField: "VALID_DATE_FROM",
        //   width: 150,
        //   caption: this.$t("valid_date_from"),
        //   alignment: "center",
        //   type: "date",
        //   editable: true,
        // },
        // {
        //   dataField: "VALID_DATE_TO",
        //   width: 150,
        //   caption: this.$t("valid_date_to"),
        //   alignment: "center",
        //   type: "date",
        //   editable: true,
        // },
        // {
        //   dataField: "REPORT_ID",
        //   width: 200,
        //   caption: this.$t("report_id"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "TEL",
        //   width: 150,
        //   caption: this.$t("tel"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "FAX",
        //   width: 150,
        //   caption: this.$t("fax"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "BANK_ACCOUNT1",
        //   width: 200,
        //   caption: this.$t("bank_account1"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "BANK_ACCOUNT2",
        //   width: 200,
        //   caption: this.$t("bank_account2"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "BANK_NM1",
        //   width: 200,
        //   caption: this.$t("bank_nm1"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "BANK_NM2",
        //   width: 200,
        //   caption: this.$t("bank_nm2"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "TAX_CODE",
        //   width: 150,
        //   caption: this.$t("tax_code"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "WEBSITE",
        //   width: 100,
        //   caption: this.$t("website"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "TAX_CODE_DISPLAY",
        //   width: 200,
        //   caption: this.$t("tax_code_display"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "PBAN",
        //   width: 100,
        //   caption: this.$t("pban"),
        //   type: "text",
        //   editable: true,
        //   alignment: "center",
        //   lookup: {
        //     dataSource: this.versionList,
        //     displayExpr: "NAME",
        //     valueExpr: "CODE",
        //   },
        // },
        {
          dataField: "URL_FILE_EXCEL",
          width: 450,
          caption: this.$t("url_file_excel"),
          alignment: "left",
          type: "text",
          editable: true,
        },{
          dataField: "URL_FILE_EXCEL_IMP",
          width: 400,
          caption: this.$t("url_file_excel_imp"),
          alignment: "left",
          type: "text",
          editable: true,
        },{
          dataField: "URL_FILE_EXCEL_C",
          width: 400,
          caption: this.$t("url_file_excel_c"),
          alignment: "left",
          type: "text",
          editable: true,
        },{
          dataField: "URL_FILE_EXCEL_C_IMP",
          width: 400,
          caption: this.$t("url_file_excel_c_imp"),
          alignment: "left",
          type: "text",
          editable: true,
        },
        // {
        //   dataField: "URL_IMG_LOGO",
        //   width: 200,
        //   caption: this.$t("url_img_logo"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "LOGO_START_ROW",
        //   width: 100,
        //   caption: this.$t("logo_start_row"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 1,
        //   editable: true,
        // },
        // {
        //   dataField: "LOGO_START_COL",
        //   width: 100,
        //   caption: this.$t("logo_start_col"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 1,
        //   editable: true,
        // },
        // {
        //   dataField: "URL_IMG_BG",
        //   width: 200,
        //   caption: this.$t("url_img_bg"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "BG_START_ROW",
        //   width: 100,
        //   caption: this.$t("bg_start_row"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 1,
        //   editable: true,
        // },
        // {
        //   dataField: "BG_END_ROW",
        //   width: 100,
        //   caption: this.$t("bg_end_row"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 1,
        //   editable: true,
        // },

        // {
        //   dataField: "BG_WIDTH",
        //   width: 100,
        //   caption: this.$t("bg_width"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 1,
        //   editable: true,
        // },
        // {
        //   dataField: "BG_HEIGHT",
        //   width: 100,
        //   caption: this.$t("bg_height"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 1,
        //   editable: true,
        // },
        {
          dataField: "SIGN_START_CELL",
          width: 150,
          caption: this.$t("sign_start_cell"),
          alignment: "left",
          type: "number",
          formatFloat: 0,
          editable: true,
        },
        {
          dataField: "SIGN_END_CELL",
          width: 150,
          caption: this.$t("sign_end_cell"),
          alignment: "left",
          type: "number",
          formatFloat: 0,
          editable: true,
        },
        {
          dataField: "SIGN_BY_START_CELL",
          width: 160,
          caption: this.$t("sign_by_start_cell"),
          alignment: "left",
          type: "number",
          formatFloat: 0,
          editable: true,
        },
        {
          dataField: "SIGN_BY_END_CELL",
          width: 150,
          caption: this.$t("sign_by_end_cell"),
          alignment: "left",
          type: "number",
          formatFloat: 0,
          editable: true,
        },
        {
          dataField: "SIGN_CELL_BOX",
          width: 150,
          caption: this.$t("sign_cell_box"),
          alignment: "left",
          type: "text",
          // formatFloat: 0,
          editable: true,
        },
        {
          dataField: "DETAILS_START_ROW",
          width: 150,
          caption: this.$t("details_start_row"),
          alignment: "left",
          type: "number",
          formatFloat: 0,
          editable: true,
        },
        {
          dataField: "SIGN_RANGE_DETAILS",
          width: 150,
          caption: this.$t("range_details_sign"),
          alignment: "left",
          type: "number",
          formatFloat: 0,
          editable: true,
        },
        // {
        //   dataField: "ATT01",
        //   width: 200,
        //   caption: this.$t("att01"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT02",
        //   width: 200,
        //   caption: this.$t("att02"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT03",
        //   width: 200,
        //   caption: this.$t("att03"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT04",
        //   width: 200,
        //   caption: this.$t("att04"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT05",
        //   width: 200,
        //   caption: this.$t("att05"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT06",
        //   width: 200,
        //   caption: this.$t("att06"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT07",
        //   width: 200,
        //   caption: this.$t("att07"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT08",
        //   width: 200,
        //   caption: this.$t("att08"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        // },
        // {
        //   dataField: "ATT09",
        //   width: 200,
        //   caption: this.$t("att09"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "ATT10",
        //   width: 200,
        //   caption: this.$t("att10"),
        //   alignment: "left",
        //   type: "text",
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "ATT01_NUM",
        //   width: 100,
        //   caption: this.$t("att01_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "ATT02_NUM",
        //   width: 100,
        //   caption: this.$t("att02_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "ATT03_NUM",
        //   width: 100,
        //   caption: this.$t("att03_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "ATT04_NUM",
        //   width: 100,
        //   caption: this.$t("att04_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "ATT05_NUM",
        //   width: 100,
        //   caption: this.$t("att05_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: true,
        // },
        // {
        //   dataField: "ATT06_NUM",
        //   width: 100,
        //   caption: this.$t("att06_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: true,
        // },
        // {
        //   dataField: "ATT07_NUM",
        //   width: 100,
        //   caption: this.$t("att07_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: true,
        // },
        // {
        //   dataField: "ATT08_NUM",
        //   width: 100,
        //   caption: this.$t("att08_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: true,
        // },
        // {
        //   dataField: "ATT09_NUM",
        //   width: 100,
        //   caption: this.$t("att09_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: false,
        // },
        // {
        //   dataField: "ATT10_NUM",
        //   width: 100,
        //   caption: this.$t("att10_num"),
        //   alignment: "left",
        //   type: "number",
        //   formatFloat: 0,
        //   editable: true,
        //   visible: false,
        // },
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
          visible: false,
        },
        {
          dataField: "CELL_CODE",
          width: 80,
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
          visible: false,
        },
        {
          dataField: "TYPE_TEMPLATE",
          width: 180,
          caption: this.$t("type_template"),
          alignment: "center",
          lookup: {
            dataSource: this.typeTemplateList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          type: "text",
          hidden: true,
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
          hidden: true,
        },
        {
          dataField: "TYPE",
          width: 200,
          caption: this.$t("type_m"),
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
          width: 350,
          caption: this.$t("remarks"),
          alignment: "left",
          type: "text",
          editable: true,
        },
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
          width: 40,
          caption: this.$t("ord"),
          alignment: "right",
          type: "text",
          allowEditing: true,
        },
        {
          dataField: "STARTCELL",
          width: 50,
          caption: this.$t("startcell"),
          alignment: "right",
          type: "number",
          allowEditing: true,
        },
        {
          dataField: "ENDCELL",
          width: 50,
          caption: this.$t("endcell"),
          alignment: "right",
          type: "number",
          allowEditing: true,
        },
        {
          dataField: "CELLBORDER",
          width: 100,
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
          width: 150,
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
          width: 180,
          caption: this.$t("type_d"),
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
          width: 260,
          caption: this.$t("remarks"),
          alignment: "left",
          type: "text",
          allowEditing: true,
        },
        {
          dataField: "TEI_TEMPLATE_PK",
          width: 250,
          caption: this.$t("tei_template_pk"),
          alignment: "left",
          type: "text",
          editable: true,
          visible: false,
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
          hidden: true,
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
          hidden: true,
        },
      ];
    },
  },
  /*############### mounted #######################*/
  mounted() {},

  /*############### methods #######################*/
  methods: {
    cellClickCellTemplate({data  , value }) {
      // console.log("file: 6095057.vue:962 [vng-304] cellClickCellTemplate [vng-304] cell:", data);
      // console.log("file: 6095057.vue:962 [vng-304] cellClickCellTemplate [vng-304] value:", value);
      this.itemTemplatePK = data.PK;
      this.url_template = value;   //column.datafield
      this.$refs.grdParamM.loadData();
      this.$refs.grdParamD.loadData();
    },
    onClickButton(pos) {
      switch (pos) {
        case "VIEW":
          this.onPreview();
          // this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
          break;
        case "NEW_M":
          this.onNew();
          break;
        case "DELETE_M":
          this.onDelete();
          break;
        case "SAVE_M":
          this.onSave();
          break;
        case "SEARCH":
          this.onSearch();
          break;
        case "NEW_T":
          this.onNew_T();
          break;
        case "SAVE_T":
          this.onSave_T();
          break;
        case "DELETE_T":
          this.onDelete_T();
          break;
        case "NEW_PM":
          this.onNew_PM();
          break;
        case "SAVE_PM":
          this.onSave_PM();
          break;
        case "DELETE_PM":
          this.onDelete_PM();
          break;
        case "NEW_PD":
          this.onNew_PD();
          break;
        case "SAVE_PD":
          this.onSave_PD();
          break;
        case "DELETE_PD":
          this.onDelete_PD();
          break;
      }
    },
    async onSearch() {
      this.$refs.grdTemplate.loadData();
    },
    onDelete_T() {
      this.$refs.grdTemplate.onSetMarkedDelete(true);
    },
    onDelete_P() {
      this.$refs.grdParamM.onSetMarkedDelete(true);
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

    onValudateMaster() {
      // console.log("this.$refs.grdParamM.getDataSource()  ", this.$refs.grdParamM.getDataSource());
      for (let i = 0; i < this.$refs.grdParamM.getDataSource().length; i++) {
        if (this.$refs.grdParamM.getDataSource()[i].CELL_CODE == null && this.$refs.grdParamM.getDataSource()[i].TYPE == null) {
          return this.showNotification("warning", this.$t("notification"), this.$t(`you_can_combinatons_to_generate_accountcode`), 500);
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
      // let dataD = this.$refs.grdParamD.getData();
      // for (let i = 0; i < dataD.length; i++) {
      // if (!dataD[i].ORD) {
      //   this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_ord_at_" + (i + 1)));
      //   return;
      // } else if (!dataD[i].STARTCELL) {
      //   this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_start_cell_at_" + (i + 1)));
      //   return;
      // } else if (!dataD[i].ENDCELL) {
      //   this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_end_cell_at_" + (i + 1)));
      //   return;
      // } else if (!dataD[i].CELLBORDER) {
      //   this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_cell_border_at_" + (i + 1)));
      //   return;
      // } else if (!dataD[i].FIELD) {
      //   this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_feild_at_" + (i + 1)));
      //   return;
      // } else if (!dataD[i].TYPE) {
      //   this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_to_type_at_" + (i + 1)));
      //   return;
      // }
      // }
      this.$refs.grdParamD.saveData();
    },
    async getListCodes(pos) {
      switch (pos) {
        case "status":
          const parentCodes = [
            "ACEIS020", //0
            "ACEIS030", //1
            "ACEI0390", //2
            "ACJS0400", //3
            "ACJS0410", //4
            "ACEI0220", //5
            "ACJS0430", //6
            "ACJS0470", //7
            "ACJS0480", //8
            "ACJS0500", //"ACJS0490", //9
            "ACEIS330", //10
            "ACEIS340", //11
          ];
          const results = await this._getCommonCode2(parentCodes, this.user.TEI_COMPANY_PK);
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
            this.Form_noList = results[10];
            this.TemplateList = results[11];
          }
          break;
      }
    },
    onNew_T() {
      this.$refs.grdTemplate.addRowStruct({
        PK: "",
        TEMPLATE_CD: "111",
        TEMPLATE_NM: "",
        TEMPLATE_LNM: "",
        TEMPLATE_FNM: "",
        FORM_NO: "1",
        USE_YN: "Y",
        DETAILS_START_ROW: "",
        SIGN_BY_END_CELL: "",
        SIGN_BY_START_CELL: "",
        SIGN_END_CELL: "",
        SIGN_START_CELL: "",
        SIGN_CELL_BOX: "",
        SIGN_RANGE_DETAILS: "",
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
        TYPE: "1",
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
        TYPE: "1",
      });
    },

    onAfterImport() {
      this.$refs.grdTemplate.loadData();
    },

    async onProcessConfirm(action) {
      this.actionProcess = action;
      //this.actionDialog = true;

      let promise = Swal.fire({
        icon: "question",
        caption: this.$t(`do_you_want_to_${action.toLowerCase()}`),
        showCancelButton: true,
        confirmButtonText: this.$t("yes"),
        cancelButtonText: this.$t("no"),
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
        return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_select_from_company"));
      }
      if (!this.txtForm_No_To) {
        return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_input_form_no_to"));
      }
      if (!this.txtSerial_No_To) {
        return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_input_serial_no_to"));
      }
      const dso = {
        type: "process",
        updpro: "EI_PRO_6060230_COPY",
        para: [
          this.selectedCompanyFrom,
          this.selectedCompanyTo,
          //   this.lstBizplaceFrom,
          //   this.lstBizplaceTo,
          this.lstFrom_No_From,
          this.txtForm_No_To,
          this.lstSerial_No_From,
          this.txtSerial_No_To,
          this.overWriteYN,
        ],
      };

      const result = await this._dsoCall(dso, "process", true);
      if (result) {
        const rtn = result[0].RTN;
        this.copyToDialog = false;
        //this.copyResult =  this.$t( rtn);
      }
      this.onSearch();
    },

    async onPreview() {
      // if (!this.itemTemplatePK) {
      //   return this.showNotification("warning", this.$t("error_occurs"), "pls_select_template");
      // }
      // try {
      //   this.pdfUrl = await this.pdfUrlGetter(this.itemTemplatePK);
      //   console.log("=====> pdfUrlv", this.pdfUrl);
      //   this.$nextTick(() => {
      //     this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      //   });
      // } catch (e) {
      //   return this.showNotification("danger", e.message);
      // }
      // if(this.itemTemplatePK != "")
      // {
      //   let res_url = await this.$axios.$post("/einvoice/general-url-pdf-template", {
      //         responseType: "json",
      //         data: this.itemTemplatePK,
      //       });
      //   if(res_url.success)
      //   {
      //     this.pdfUrl = res_url.data;

      //     this.$nextTick(() => {
      //       this.isProcessing = false
      //       this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      //     });
      //   }
      // }else
      // {
      //   this.showNotification("warning", this.$t("no_row_selected"), '');
      // }

      this.showLoading = true;
      try {
        const rec = await this.$axios.$get("/dso/makereport", {
          responseType: "blob",
          params: {
            template: this.url_template,
            excel: JSON.stringify([
              {
                sheet: 1,
                // insertRange: [{
                //   range: "A1:E22", proc: "SP_RPT_SH10070_TAB2_M_NOCACHE", params: [this.modelMaster.PK, this.user.USER_NAME]
                // }],
              },
            ]),
            convert: "pdf",
          },
        });
        this.pdfUrl = window.URL.createObjectURL(rec);
        this.showLoading = false;
        this.showPDF = true;
        let rtnBase64pdf = await this._blobFileToBase64(rec);
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_view_pdf"), "", 4000);
      }
    },

    async pdfUrlGetter(pk) {
      const pdfUrlExcel = await this.getEinvoiceERP_V2(this, pk);
      return pdfUrlExcel;
    },

    async getImpFile() {
      // console.log("this.url_template  ", this.url_template);
      if (!this.url_template.length) {
        return this.showNotification("warning", this.$t("error_occurs"), "pls_select_template");
      }
      const res = await this.$axios.$get("/dso/downloadtemp", {
        responseType: "blob",
        params: {
          template: this.url_template,
        },
      });
      //console.log("res   ", res);
      //console.log("res   ", res.size);
      if (res && res.size > 0) {
        try {
          let blob = new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          // let _gettime = new Date().getTime();
          const filenameSplit = this.url_template.split("/");
          let filename = this.filterItems(filenameSplit, ".xlsx")[0].split(".")[0] + ".xlsx";
          // filename =     this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '.xlsx';
          this._ExcelSaveAs(blob, filename);
        } catch (e) {
          let blob = new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const filenameSplit = this.url_template.split("/");
          let filename = this.filterItems(filenameSplit, ".xls")[0].split(".")[0] + ".xls";
          // filename =     this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '.xlsx';
          this._ExcelSaveAs(blob, filename);

          // this.showNotification("danger", this.$t("cannot_find_template"), e, 3001);
        }
      } else {
        this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
      }
    },

    onLoadDataParamM() {
      this.$refs.grdParamM.loadData();
    },

    onLoadDataParamD() {
      this.$refs.grdParamD.loadData();
    },

    async onGeneralData() {
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
      if (res.success) {
        this.showNotification("success", this.$t("alert"), res.message);
      } else {
        this.showNotification("danger", this.$t("error_occurs"), res.message);
      }
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
