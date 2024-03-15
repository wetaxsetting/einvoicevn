<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-row dense>
      <v-col md="12" class="pt-2 pr-4 d-flex justify-end" >
          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
          <BaseButton icon_type="preview" :btn_text="$t('preview')" @onclick="onPreview" :disabled="isProcessing" />
          <BaseButton icon_type="convert" :btn_text="$t('convert')" @onclick="onConvert" :disabled="isProcessing" />
          <BaseButton icon_type="pdf" :btn_text="$t('pdf')" :disabled="isProcessing" @onclick="onDownloadPdf" />
          <BaseButton icon_type="debit_note" :btn_text="$t('debit_note')" @onclick="debitNote" :disabled="isSending" />
          <BaseButton icon_type="credit_note" :btn_text="$t('credit_note')" @onclick="creditNote" :disabled="isSending" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col md="12">
          <v-row dense class="pa-3">
            <v-col md="3" class="pl-2 pr-2">
              <BaseSelect outlined :label="$t('company')" v-model="selected_company" :lstData="company_list" item-text="NAME"
                item-value="VAL" />
            </v-col>
            <v-col md="1" class="pl-2 pr-2">
              <BaseDatePicker outlined :pretoday="7" :label="$t('date_from')" v-model="dt_from" />
            </v-col>
            <v-col md="1" class="pl-2 pr-2">
              <BaseDatePicker outlined default :label="$t('date_to')" v-model="dt_to" />
            </v-col>
            <!-- <v-col md="1" class="pl-2 pr-2"></v-col> -->
            <v-col md="1" class="pl-2 pr-2">
              <BaseSelect outlined :label="$t('trading_type')" v-model="selected_trading_type" :lstData="trading_type_list"
                item-text="NAME" item-value="VAL" filter_off />
            </v-col>
            <v-col md="2" class="pl-2 pr-2">
              <BaseSelect outlined :label="$t('converted_yn')" :lstData="yn_list" v-model="selected_yn" item-text="NAME"
                item-value="VAL" filter_off />
            </v-col>
            <v-col md="1" class="pl-2 pr-2">
              <BaseInput outlined :label="$t('invoice_no')" v-model="invoice_no" />
            </v-col>
            <v-col md="1" class="pl-2 pr-2">
              <BaseInput outlined :label="$t('partner')" v-model="partner" />
            </v-col>
            <v-col md="1" class="pl-2 pr-2">
              <BaseInput outlined :label="$t('trade_cqt')" v-model="trade_cqt" />
            </v-col>
            <v-col md="1" class="pl-2 pr-2">
              <BaseInput outlined :label="$t('cqt_code')" v-model="cqt_code" />
            </v-col>
          </v-row>
      </v-col>
    </v-row>
    <v-row dense >
      <v-col md="12">
        <!-- :selectionmode="'checkbox'" -->
        <BaseGridView ref="grdConvert" :header="grdHeader" sel_procedure="EI_SEL_6095120_SEL_DATA" :multiselect="true"
          @onSelectionDataChanged="onGridSelectionChanged" :selectionmode="'checkbox'" :autocheckbox="false"
          :headertype="1" :filter_paras="[
            this.dt_from,
            this.dt_to,
            this.partner,
            this.invoice_no,
            this.selected_company,
            this.selected_trading_type,
            this.selected_yn
          ]" :height="gridHeight" @cellClick="onCellClick"/>
      </v-col>
    </v-row>
    <view-einvoice-pdf-dialog ref="ViewEInvoicePDFDialog" :src_pdfUrl="pdfUrl"></view-einvoice-pdf-dialog>
  </v-container>
</template>
<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 
<script>
import moment from "moment";
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: { "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog },
  /*############### data ##########################*/
  data: () => ({
    selected_company: null,
    company_list: null,

    trading_type_list: null,
    selected_trading_type: null,
    selected_yn: null,
    yn_list: null,

    dt_from: null,
    dt_to: null,

    invoice_no: null,
    partner: null,


    selected_rows: [],
    pdfUrl: "",
    tei_einvoice_m_pk_row: ""
  }),
  /*############### created #######################*/
  created() {
    this.getListCodes();
  },
  /*############### watch ######################*/
  watch: {
    // lst_line: async function () {
    //   // const machineMtCC = await this._callProcedure(
    //   //   "mes_sel_meca020_select_machine_mt_comcode",
    //   //   [this.lst_line]
    //   // );
    //     const machineMtCC = await this._getCommonCode("MTYPE");
    //   console.log(machineMtCC)
    //   this.mt_comcode = machineMtCC[0].mt_comcode;
    // },
  },
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    gridHeight() {
      return this.formContainerHeight - 140;
    },
    masterContainerHeight() {
      return this.formContainerHeight - 200;
    },
    grdHeader() {
      return [{ field: "RN", width: 40, title: "No", alignment: "right", type: "text" },
      { field: "TR_DATE", width: 100, title: "TransDate", alignment: "right", type: "text" },
      { field: "CUS_CD", width: 120, title: "CustomerID", alignment: "right", type: "text" },
      { field: "CUS_NM", width: 200, title: "Customername", alignment: "right", type: "text" },
      { field: "ORM_NO", width: 120, title: "FormNo", alignment: "right", type: "text" },
      { field: "SERIAL_NO", width: 90, title: "SerialNo", alignment: "right", type: "text" },
      { field: "INVOICE_NO", width: 100, title: "InvoiceNo", alignment: "right", type: "text" },
      { field: "TR_CCY", width: 80, title: "Currency", alignment: "right", type: "text" },
      { field: "R_RATE", width: 90, title: "Ex.rate", alignment: "right", type: "text" },
      { field: "TOT_NET_TR_AMT", width: 130, title: "Amount(Trans)", alignment: "right", type: "text" },
      { field: "TOT_NET_BK_AMT", width: 130, title: "Amount(Books)", alignment: "right", type: "text" },
      { field: "REMARK", width: 210, title: "Description", alignment: "right", type: "text" },
      { field: "REMARK2", width: 210, title: "LocalDescription", alignment: "right", type: "text" },
      { field: "EI_STATUS", width: 120, title: "EI.Status", alignment: "right", type: "text" },
      { field: "SIGN_BY", width: 150, title: "Signname", alignment: "center", type: "text" },
      { field: "SIGN_DT", width: 170, title: "Signdate", alignment: "center", type: "text" },
      { field: "INVOICE_TYPE", width: 150, title: "InvoiceType", alignment: "left", type: "text" },
      { field: "CONVERT_NAME", width: 150, title: "Convertname", alignment: "left", type: "text" },
      { field: "CONVERT_DATE", width: 150, title: "Convertdate", alignment: "left", type: "text" },
      { field: "CONVERT_YN", width: 50, title: "ConvertY/N", alignment: "left", type: "text" },

      ];
    },
  },
  /*############### mounted #######################*/
  mounted() { },

  /*############### methods #######################*/
  methods: {
    debitNote() { },
    onConvert() { },
    async onPreview() {
      this.isProcessing = true
      this.pdfUrl = await this.pdfUrlGetter(this.tei_einvoice_m_pk_row);
      this.$nextTick(() => {
        this.isProcessing = false
        this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      });
    },
    async pdfUrlGetter(pk) {
      const pdfUrlExcel = await this.getEinvoice(this, pk)
      return pdfUrlExcel
    },
    ///////////////////////////
    onDownloadPdf() {
      let pkArr = "";
      //this.tei_einvoice_m_pk_row=""
      for (var i = 0; i < this.selected_rows.length; i++) {
        let item = this.selected_rows[i];
        pkArr += item.PK + "|";
      }
      this.tei_einvoice_m_pk_row = pkArr;
      if (pkArr != "") {
        jQuery.support.cors = true;
        $.ajax({
          type: "POST",
          url: "http://genuclouding.com/wseinvoice/BSService.asmx/SendPDF_R",
          data: {
            tei_einvoice_m_pk: pkArr,
            tei_company_pk: this.selected_company,
          },
          dataType: "text",
          crossDomain: true,
          success: this.OnSuccessCallReUploadPDFS,
          error: this.OnErrorCallReUploadPDFS,
        });
      }
    },
    downloadPDF(pdf) {
      //const linkSource = `data:application/pdf;base64,${pdf}`;
      const downloadLink = document.createElement("a");
      const fileName = Math.floor(Math.random() * 1000000000);
      downloadLink.href = pdf;
      downloadLink.download = fileName;
      downloadLink.click();
    },
    async OnSuccessCallReUploadPDFS() {
      let pdfFile = await this._callProcedure("EI_SEL_GET_PDF_FILE_DYNAMIC", [
        this.tei_einvoice_m_pk_row,
      ]);
      pdfFile.forEach((e) => {
        this.downloadPDF("data:application/pdf;base64," + encodeURI(btoa(String.fromCharCode(...new Uint8Array(e.ATTACH_FILE_PDF.data)))) + "");
      });

    },
    OnErrorCallReUploadPDFS(response) {
      alert(response.msg + " - " + response.statusText);
    },

    /////////////////
    async onSearch() {
      this.$refs.grdConvert.loadData();
    },
    async getListCodes() {
      let company = await this._callProcedure("EI_SEL_6095120_COMPANY", [
        this.user.PK,
      ]);
      this.company_list = company;
      this.selected_company = this.company_list[0].VAL;
      ///////////////////////////////////////////////////////////
      let tradingType = await this._callProcedure(
        "EI_SEL_6095120_TRADING_TYPE"
      );
      this.trading_type_list = tradingType;
      this.selected_trading_type = this.trading_type_list[0].VAL;
      /////////////////////////////////////////////////////////////////
      let convertYN = await this._callProcedure(
        "EI_SEL_6095120_SEL_CONVERTYN"
      );
      this.yn_list = convertYN;
      // this.status_list.unshift({ VAL:'', NAME:this.$t("select_all") });
      this.selected_yn = this.yn_list[0].VAL;
      ////////////////////////////////////////////////////
    },
    async onGridSelectionChanged(data) {
      // console.log(data)
      this.selected_rows = data;
    },
    async onCellClick({ column, data, rowIndex, rowType }) {
      this.tei_einvoice_m_pk_row = data.PK
    },

  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
