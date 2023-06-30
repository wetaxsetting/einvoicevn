<template>
  <v-container fluid v-resize="onResize">
    <v-row dense justify="space-between">
      <v-col cols="12">
        <v-card class="pa-2" :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'">
          <v-row class="py-0">
            <v-col md="2">
              <BaseSelect outlined :label="$t('company')" :lstData="company_list" v-model="selected_company" item-value="VAL"
                item-text="NAME" />
            </v-col>
            <v-col md="1">
              <BaseDatePicker outlined :label="$t('date')" default v-model="formDate" />
            </v-col>
            <v-col md="1">
              <BaseDatePicker outlined :label="$t('to')" default v-model="formTo" />
            </v-col>
            <v-col md="2">
              <BaseSelect outlined :label="$t('form_no')" item-text="NAME" item-value="VAL" :lstData="from_no_list"
                v-model="selected_form_no" />
            </v-col>
            <v-col md="1">
              <BaseSelect outlined :label="$t('serial_no')" item-value="VAL" item-text="NAME" :lstData="serial_no_list"
                v-model="selected_serial_no" />
            </v-col>
            <v-col md="1">
              <BaseSelect outlined :label="$t('status')" item-value="VAL" item-text="NAME" :lstData="status_list"
                v-model="selected_status" />
            </v-col>
            <v-col md="1">
              <BaseSelect outlined :label="$t('trading_type')" item-value="VAL" item-text="NAME" :lstData="trading_type_list"
                v-model="selected_trading_type" />
            </v-col>
            <v-col md="3">
              <GwFlexBox class="d-flex justify-end">
                <BaseButton icon_type="search" btn_type="icon" @onclick="onClickButton()" />
                <BaseButton icon_type="preview" :btn_text="$t('preview')" @onclick="onPreview" :disabled="isProcessing" />
                <BaseButton icon_type="pdf" :btn_text="$t('pdf')" :disabled="isProcessing" @onclick="onDownloadPdf" />

                <BaseButton icon_type="xml" :btn_text="$t('xml')" :disabled="isProcessing" @onclick="onDownloadXml" />
                <!-- <BaseButton icon_type="xml" />
              <BaseButton icon_type="pdf" btn_type="icon" /> -->
              </GwFlexBox>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="2">
              <BaseInput outlined :label="$t('partner')" />
            </v-col>
            <v-col md="2">
              <BaseInput outlined :label="$t('invoice_no')" />
            </v-col>
            <v-col md="2">
              <BaseInput outlined :label="$t('cqt_code')" />
            </v-col>
            <v-col md="2">
              <BaseInput outlined :label="$t('trade_code')" />
            </v-col>
            <v-col md="1">
              <BaseInput outlined :label="$t('amount')" readonly v-model="amount" number />
            </v-col>
            <v-col md="1">
              <BaseInput outlined :label="$t('vat_amount')" readonly v-model="vatAmount" number />
            </v-col>
            <v-col md="1">
              <BaseInput outlined :label="$t('total')" readonly v-model="total" number />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card outlined  :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'">
          <v-row>
            <v-col cols="12">
              <BaseGridView ref="gridview" :selectionmode="'checkbox'" :autocheckbox="false"
                @onSelectionDataChanged="onGridSelectionChanged" :header="this.headerGrid"  :height="limitHeight" :setting="true"
                :autoresize="false" @cellClick="onCellClick" :headertype="1" sel_procedure="EI_SEL_6095190_DATA"
                :filter_paras="[
                  this.formDate,
                  this.formTo,
                  this.partner,
                  this.invoceNo,
                  this.selected_company,
                  this.selected_trading_type,
                  this.selected_status,
                  this.selected_serial_no,
                  this.selected_form_no,
                  this.cqtCode,
                  this.tradeCode,
                ]" />
            </v-col>
          </v-row>
          <view-einvoice-pdf-dialog ref="ViewEInvoicePDFDialog" :src_pdfUrl="pdfUrl"></view-einvoice-pdf-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  layout: "default",
  middleware: "user",

  components: { "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog },
  data: () => ({
    selected_company: null,
    company_list: [],
    invoceNo: "",
    from_no_list: [],
    selected_form_no: "",
    serial_no_list: [],
    selected_serial_no: "",
    formDate: "",
    formTo: "",
    status_list: [],
    selected_status: "",
    partner: "",
    trading_type_list: [],
    selected_trading_type: "",
    cqtCode: "",
    tradeCode: "",
    checkAll: "N",

    headerGrid: [],
    lstsumAmount: [],
    amount: 0,
    vatAmount: 0,
    total: 0,

    selected_rows: [],
    pdfUrl: "",
    tei_einvoice_m_pk_row: "",
  }),

  async created() {
    await this.getListCodes("company");
    await this.getListCodes("form_no");
    await this.getListCodes("serial_no");
    await this.getListCodes("status");
    await this.getListCodes("trading_type");
    this.onSetHeader();
  },
  watch: {
    selected_company(val) {
      this.getListCodes("form_no");
      this.getListCodes("serial_no");
    },
    selected_form_no(val) {
      this.getListCodes("serial_no");
    },
  },

  mounted() { },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 295;
    },
  },

  methods: {
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
    onDownloadXml() {
      for (var i = 0; i < this.selected_rows.length; i++) {
        let txtPK = this.selected_rows[i].PK;
        if (txtPK != "") {
          var url =
            "http://genuclouding.com/wseinvoice/BSService.asmx/Download_File_XML_v4?pk=" +
            txtPK;
          url += "&key=" + this.selected_company;
          window.open(url, txtPK);
        }
      }
    },
    async onGridSelectionChanged(data) {
      // console.log(data)
      this.selected_rows = data;
    },
    async onCellClick({ column, data, rowIndex, rowType }) {
      this.tei_einvoice_m_pk_row = data.PK;
    },
    async onClickButton() {
      this.$refs.gridview.loadData();
      const dso_amount_list = {
        type: "list",
        selpro: "EI_SEL_6095190_AMOUNT_T",
        para: [
          this.formDate,
          this.formTo,
          this.partner,
          this.invoceNo,
          this.selected_company,
          this.selected_trading_type,
          this.selected_status,
          this.selected_serial_no,
          this.selected_form_no,
          this.cqtCode,
          this.tradeCode,
        ],
      };
      this.lstsumAmount = await this._dsoCall(dso_amount_list, "select", false);
      if (this.lstsumAmount != null) {
        this.amount = this.lstsumAmount[0].TOT_NET_TR_AMT;
        this.vatAmount = this.lstsumAmount[0].VAT_AMT;
        this.total = this.lstsumAmount[0].TOT_AMT;
      }
    },

    onSetHeader() {
      this.headerGrid = [
        {
          field: "PK",
          title: this.$t("pk"),
          hidden: true,
          alignment: "right",
          type: "text",
          width: 50,
        },
        {
          field: "RN",
          title: this.$t("no"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "TR_DATE",
          title: this.$t("invoice_date"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "INVOICE_NO",
          title: this.$t("invoice_no"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "CUS_CD",
          title: this.$t("customer_id"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "CUS_NM",
          title: this.$t("customer_name"),
          alignment: "right",
          type: "text",
          width: 150,
        },
        {
          field: "CUS_FNM",
          title: this.$t("shost_name"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "TAX_CODE",
          title: this.$t("tax_code"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "BUYER_NAME",
          title: this.$t("buyer"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "TR_CCY",
          title: this.$t("currency"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "TR_RATE",
          title: this.$t("ex_rate"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "TOT_NET_TR_AMT",
          title: this.$t("amount_trans"),
          alignment: "right",
          dataType: "number",
          formatFloat: 0,
          type: "text",
          width: 120,
        },
        {
          field: "TOT_NET_BK_AMT",
          title: this.$t("amount_books"),
          alignment: "right",
          dataType: "number",
          formatFloat: 0,
          type: "text",
          width: 150,
        },
        {
          field: "TAX_RATE",
          title: this.$t("tax_rate"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "VAT_AMT",
          title: this.$t("vat_amount"),
          alignment: "right",
          dataType: "number",
          formatFloat: 0,
          type: "text",
          width: 100,
        },
        {
          field: "TOT_AMT",
          title: this.$t("total_amount"),
          alignment: "right",
          dataType: "number",
          formatFloat: 0,
          type: "text",
          width: 100,
        },
        {
          field: "EI_STATUS",
          title: this.$t("ei_status"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "INVOICE_TYPE",
          title: this.$t("invoice_type"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "INVOICE_CODE",
          title: this.$t("invoice_code"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "SEND_DATE",
          title: this.$t("send_date"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "CONVERT_NAME",
          title: this.$t("convert_by"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "CONVERT_DATE",
          title: this.$t("convert_date"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "EMAIL_ADDRESS",
          title: this.$t("email_address"),
          alignment: "right",
          type: "text",
          width: 150,
        },
        {
          field: "EMAILTRACKING_YN",
          title: this.$t("email_tracking_yn"),
          alignment: "right",
          type: "text",
          width: 200,
        },
        {
          field: "EMAILTRACKING_DT",
          title: this.$t("email_tracking_date"),
          alignment: "right",
          type: "text",
          width: 200,
        },
        {
          field: "EMAILTRACKING_DT_END",
          title: this.$t("emaill_tracking_date_end"),
          alignment: "right",
          type: "text",
          width: 200,
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "EI_SEL_6095190_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );

          break;

        case "form_no":
          const dso_form_no_list = {
            type: "list",
            selpro: "EI_SEL_6095190_FORM_NO",
            para: [this.selected_company],
          };
          this.from_no_list = await this._dsoCall(
            dso_form_no_list,
            "select",
            false
          );
          if (this.from_no_list != null) {
            this.selected_form_no = this.from_no_list[0].VAL;
          }
          break;

        case "serial_no":
          const dso_serial_no_list = {
            type: "list",
            selpro: "EI_SEL_6095190_SERIAL_NO",
            para: [this.selected_company, this.selected_form_no],
          };
          this.serial_no_list = await this._dsoCall(
            dso_serial_no_list,
            "select",
            false
          );
          if (this.serial_no_list != null) {
            this.selected_serial_no = this.serial_no_list[0].VAL;
          }
          break;

        case "status":
          const dso_status_list = {
            type: "list",
            selpro: "EL_SEL_6095190_STATUS",
            para: [this.selected_company],
          };
          this.status_list = await this._dsoCall(
            dso_status_list,
            "select",
            false
          );
          if (this.status_list != null) {
            this.selected_status = this.status_list[0].VAL;
          }
          break;

        case "trading_type":
          const dso_trading_type_list = {
            type: "list",
            selpro: "EI_SEL_6095190_TRADING_TYPE",
            para: [this.selected_company],
          };
          this.trading_type_list = await this._dsoCall(
            dso_trading_type_list,
            "select",
            false
          );
          if (this.trading_type_list != null) {
            this.selected_trading_type = this.trading_type_list[0].VAL;
          }
          break;
      }
    },
  },
};
</script>
