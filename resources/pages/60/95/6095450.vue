<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col lg="8" :class="isShowLeft ? null : 'd-none'">
        <v-card>
          <v-row dense>
            <v-col lg="12" class="text-right">
              <GwFlexBox class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('search')" />
                <BaseButton icon_type="preview" :btn_text="$t('preview')" :disabled="isProcessing" @onclick="onClickButton('preview')" />
                <BaseButton icon_type="viewxml" :btn_text="$t('viewxml')" :disabled="isProcessing" @onclick="onClickButton('viewxml')" />
                <!-- <BaseButton icon_type="viewpdf" :btn_text="$t('viewpdf')" :disabled="isProcessing" @onclick="onClickButton('viewpdf')" /> -->
              </GwFlexBox>
            </v-col>
          </v-row>
          <v-row dense class="pt-2">
            <v-col lg="3" class="pl-2">
              <BaseSelect outlined v-model="sellerName" :lstData="dataSearchList.sellerNameList" item-value="CODE" item-text="NAME" :label="$t('seller_name')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseInput outlined readonly v-model="sellerTaxcode" :label="$t('seller_taxcode')"></BaseInput>
            </v-col>
            <v-col lg="1">
              <BaseSelect outlined v-model="form_No" :lstData="dataSearchList.formNoList" item-value="CODE" item-text="NAME" :label="$t('form_no')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseSelect outlined :label="$t('serial_no')" v-model="serial_no" :lstData="dataSearchList.serialNoList" item-value="CODE" item-text="NAME" />
            </v-col>
            <v-col lg="2">
              <BaseSelect outlined v-model="status" :lstData="dataSearchList.statusList" item-value="CODE" item-text="NAME" :label="$t('status')"></BaseSelect>
            </v-col>
            <v-col lg="2" class="pr-2">
              <BaseInput outlined :label="$t('invoice_no')" v-model="invoice_no" @keyPressEnter="onClickButton('search')" />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="2" class="pl-2">
              <BaseDatePicker outlined :pretoday="7" :label="$t('from_date')" v-model="form_date" />
            </v-col>
            <v-col lg="2">
              <BaseDatePicker outlined today :label="$t('to_date')" v-model="to_date" />
            </v-col>
            <v-col lg="2">
              <BaseSelect outlined v-model="trading_type" :lstData="dataSearchList.tradingTypeList" item-value="CODE" item-text="NAME" :label="$t('trading_type')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('partner')" v-model="partner" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('trade_code')" v-model="trade_code" />
            </v-col>
            <v-col lg="2" class="pr-2">
              <BaseInput outlined :label="$t('mccqt')" v-model="mccqt" />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="2" class="pl-2">
              <BaseInput outlined :label="$t('store_id')" v-model="store_id" @keyPressEnter="onClickButton('search')" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('pos')" v-model="pos_no" @keyPressEnter="onClickButton('search')" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('bill_no')" v-model="bill_no" @keyPressEnter="onClickButton('search')" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('net_amount')" readonly v-model="netAmount" number />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('vat_amount')" readonly v-model="vatAmount" number />
            </v-col>
            <v-col lg="2" class="pr-2">
              <BaseInput outlined :label="$t('total_amount')" readonly v-model="totalAmount" number />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="12" class="pt-2">
              <BaseGridView
                ref="grdCompany"
                :auto_load="false"
                sel_procedure="AC_SEL_6095450_01_NC"
                select_mode="Single"
                :max_height="limitHeight"
                :header="headerGrid"
                @cellClick="grdSearchClick"
                @setDataSource="onAfterLoad"
                :filter_paras="[
                  this.sellerName,
                  this.form_No,
                  this.serial_no,
                  this.invoice_no,
                  this.status,
                  this.form_date,
                  this.to_date,
                  this.trading_type,
                  this.mccqt,
                  this.store_id,
                  this.pos_no,
                  this.bill_no,
                ]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col :lg="isShowLeft ? 4 : 12">
        <v-card>
          <v-row dense>
            <v-col lg="1" class="d-flex pl-2">
              <BaseButton
                btn_type="icon"
                :icon_type="isShowLeft ? 'skip_prev' : 'skip_next'"
                :btn_text="isShowLeft ? $t('hide_left') : $t('show_left')"
                @onclick="
                  isShowLeft = !isShowLeft;
                  $refs.grdMaster.refresh();
                "
              />
            </v-col>
          </v-row>
          <v-row dense></v-row>
          <v-row dense></v-row>
          <v-row dense></v-row>
          <v-row dense>
            <v-col lg="12" class="pt-2">
              <BaseGridView
                ref="grdMaster"
                :auto_load="false"
                select_mode="Single"
                :max_height="limitHeightM"
                sel_procedure="AC_SEL_6095450_02_NC"
                :header="headerProD"
                :filter_paras="[this.masterPK]"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="12" class="pt-2">
              <BaseGridView
                ref="grdDetail"
                :auto_load="false"
                select_mode="Single"
                :max_height="limitHeightGridDetails"
                sel_procedure="AC_SEL_6095450_03_NC"
                :header="headerProVAT"
                :filter_paras="[this.masterPK]"
              />
            </v-col>
          </v-row>
        </v-card>
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
              <iframe :src="urlPDF" height="100%" width="100%"></iframe>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
    <view-einvoice-xml-dialog
      ref="ViewEInvoiceXMLDialog"
      :src_xmlUrl="xmlUrl"
      :xmlFileNm="xmlFileNm"
      dwnFile
      @minimizeDialog="manualIsMinimized = true"
      @closeManualDialog="manualIsMinimized = false"
    ></view-einvoice-xml-dialog>
  </v-container>
</template>

<script>
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
import ViewEInvoiceXMLDialog from "@/components/dialog/ViewEInvoiceXMLDialog.vue";
export default {
  layout: "default",
  middleware: "user",

  components: {
    "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
    "view-einvoice-xml-dialog": ViewEInvoiceXMLDialog,
  },
  data: () => ({
    showLoading: false,
    isMaximized: false,
    isShowLeft: true,
    showLoading: false,
    xml_signed: "",
    urlPDF: "",
    xmlUrl: "",
    xmlFileNm: "",

    sellerName: "",
    sellerTaxcode: "",
    serial_no: "",
    form_No: "",
    invoice_no: "",
    status: "1",
    //
    form_date: "",
    to_date: "",
    trading_type: "",
    partner: "",
    trade_code: "",
    mccqt: "",
    //
    store_id: "",
    pos_no: "",
    bill_no: "",
    netAmount: "",
    vatAmount: "",
    totalAmount: "",
    //
    dataSearchList: {
      sellerNameList: [],
      sellerTaxcodeList: [],
      serialNoList: [],
      formNoList: [],
      statusList: [],
      tradingTypeList: [],
    },
    masterPK: "",
    pdfUrl: "",
    showPDF:false
  }),

  async created() {
    await this.initDataList("company");
    await this.initDataList("form_no");
    await this.initDataList("serial_no");
    this.getListCodes();
  },

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
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 600;
      }
    }, // this.windowHeight },
    limitHeightM() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 520;
      }
    },
    limitHeightGridDetails() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 200;
      }
    },
    headerGrid() {
      const self = this;
      return [
        {
          dataField: "RN",
          caption: this.$t("no"),
        },
        {
          dataField: "SALE_DATE",
          caption: this.$t("sale_date"),
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
        },
        {
          dataField: "STORE_CODE",
          caption: this.$t("store_id"),
          dataType: "text",
        },
        {
          dataField: "STORE_NAME",
          caption: this.$t("store_name"),
          dataType: "text",
        },
        // {
        //   dataField: "POS_NO",
        //   caption: this.$t("pos"),
        //   dataType: "text",
        // },
        // {
        //   dataField: "BILL_NO",
        //   caption: this.$t("bill_number"),
        //   dataType: "text",
        // },
        // {
        //   dataField: "SALES_CATEGORY",
        //   caption: this.$t("sales_category"),
        //   dataType: "text",
        // },
        {
          dataField: "PAYMENT_METHOD",
          caption: this.$t("payment_type"),
          dataType: "text",
        },
        {
          dataField: "TOTAL_AMT",
          caption: this.$t("total_amount"),
          formatFloat: 2,
          dataType: "number",
        },
        // {
        //   dataField: "ACTUAL_SALES",
        //   caption: this.$t("actual_sales"),
        //   formatFloat: 2,
        //   dataType: "number",
        // },
        {
          dataField: "TOTAL_DC_AMT",
          caption: this.$t("discount"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "TOTAL_VAT_AMT",
          caption: this.$t("vat_amount"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "FORM_NO",
          caption: this.$t("form_no"),
          dataType: "number",
          formatFloat: 0,
        },
        {
          dataField: "SERIAL_NO",
          caption: this.$t("serial_no"),
        },
        {
          dataField: "INVOICE_NO",
          caption: this.$t("invoice_no"),
          dataType: "number",
          formatFloat: 0,
        },
        {
          dataField: "MCCQT",
          caption: this.$t("mccqt"),
          width:200
        },
        {
          dataField: "BUYER_COMP_NAME",
          caption: this.$t("buyer_name"),
          dataType: "text",
          width:200
        },
        {
          dataField: "BUYER_TAXCODE",
          caption: this.$t("buyer_taxcode"),
          dataType: "text",
          width:120

        },
        {
          dataField: "BUYER_ADDRESS",
          caption: this.$t("buyer_address"),
          dataType: "text",
          width:500

        },
        {
          dataField: "BUYER_INDENTIFICATION",
          caption: this.$t("buyer_indentification"),
        },
        {
          dataField: "BUYER_EMAIL",
          caption: this.$t("email"),
          dataType: "text",
          width:200

        },
        {
          dataField: "BUYER_EMAIL_CC",
          caption: this.$t("email_cc"),
          dataType: "text",
        },
        {
          dataField: "TRADE_CODE",
          caption: this.$t("trade_code"),
        },
      ];
    },

    headerProD() {
      const self = this;
      return [
        {
          dataField: "RN",
          caption: this.$t("no"),
        },
        {
          dataField: "ITEM_CODE",
          caption: this.$t("production_code"),
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("production_name"),
          width:200
        },
        {
          dataField: "UOM",
          caption: this.$t("unit"),
        },
        {
          dataField: "QUANTITY",
          caption: this.$t("quantity"),
          dataType: "number",
          formatFloat: 0,
        },
        {
          dataField: "UPRICE",
          caption: this.$t("price"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "DC_RATE",
          caption: this.$t("dic_rate"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "DC_AMT",
          caption: this.$t("dic_amount"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "VAT_RATE",
          caption: this.$t("tax_rate"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "AMT",
          caption: this.$t("amount"),
          formatFloat: 2,
          dataType: "number",
          width:200
        },
        {
          dataField: "NATURE",
          caption: this.$t("nature"),
          dataType: "number",
          formatFloat: 0,
        },
      ];
    },

    headerProVAT() {
      const self = this;
      return [
        {
          dataField: "SUB_VAT_RATE",
          caption: this.$t("tax_rate"),
          width: 120,
        },
        {
          dataField: "SUB_AMT",
          caption: this.$t("net_amount"),
          formatFloat: 2,
          dataType: "number",
          width: 200,
        },
        {
          dataField: "SUB_VAT_AMT",
          caption: this.$t("vat_amount"),
          formatFloat: 2,
          dataType: "number",
          width: 200,
        },
      ];
    },
  },
  watch: {
    sellerName(val) {
      if (val) {
        this.sellerTaxcode = this.dataSearchList.sellerNameList.find((item) => item.CODE == val).TAX_CODE;
      }
      this.initDataList("form_no");
      this.initDataList("serial_no");
    },
    form_No(val) {
      this.initDataList("serial_no");
    },
    form_date(val) {
      this.initDataList("form_no");
      this.initDataList("serial_no");
    },
    to_date(val) {
      this.initDataList("form_no");
      this.initDataList("serial_no");
    },
  },
  methods: {
    async grdSearchClick(cell) {
      //   console.log("file: 6095450.vue:372 [vng-304] grdSearchClick [vng-304] cell:", cell);
      this.masterPK = await cell.data.PK;
      this.xml_signed = cell.data.DATA_XML;
      await this.$refs.grdMaster.loadData();
      await this.$refs.grdDetail.loadData();
    },
    async initDataList(pos) {
      switch (pos) {
        case "company":
          const company = await this._callProcedure("AC_SEL_6095450_COMPANY", [this.user.PK]);
          if (company.length > 0) {
            this.dataSearchList.sellerNameList = company;
            // this.dataSearchList.sellerTaxcodeList = company;
          }
          break;

        case "form_no":
          const dso_form_list = {
            type: "list",
            selpro: "AC_SEL_6095450_FORM_NO",
            para: [this.sellerName, this.form_date, this.to_date],
          };
          this.dataSearchList.formNoList = await this._dsoCall(dso_form_list, "select", false);
          if (this.dataSearchList.formNoList != null) {
            this.form_No = this.dataSearchList.formNoList[0].CODE;
          }
          break;
        case "serial_no":
          const dso_serial_list = {
            type: "list",
            selpro: "AC_SEL_6095450_SERIAL_NO",
            para: [this.sellerName, this.form_No, this.form_date, this.to_date],
          };
          this.dataSearchList.serialNoList = await this._dsoCall(dso_serial_list, "select", false);
          this.serial_no = this.dataSearchList.serialNoList[0].CODE;
          break;
      }
    },
    async onClickButton(pos) {
      switch (pos) {
        case "search":
          await this.$refs.grdCompany.loadData();
          break;
        case "preview":
          this.onPreview();
          break;
        case "viewxml":
          this.OnPreviewXML();
          break;
      }
    },
    async onPreview() {
      this.showLoading = true;
        try {
          let res_url = await this.$axios.$post("/einvoice/general-pdf-template-send-bill", {
            responseType: "json",
            data: this.masterPK,
          });
          this.urlPDF = null;
          if (res_url.success) {
            this.urlPDF = res_url.data;
            this.showLoading = false;
            this.showPDF = true;
          }
        } catch (e) {
          this.showNotification("danger", this.$t("fail_view_to_url", "Error"), e.message);
        }
    },
    async OnPreviewXML() {
      if (!this.masterPK == null) {
        return this.showNotification("warning", this.$t("error_occurs"), "pls_select_invoice");
      }

      this.xmlUrl = this.xml_signed;
      this.$nextTick(() => {
        this.isProcessing = false;
        this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
      });
    },
    async getListCodes() {
      const results = await this._getCommonCode2(["ACEI0010", "ACEI0040", "ACEI0120", "ACEI0190", "ACEI0140", "ACEIN010", "ACJS0460"], this.user.PK);
      this.dataSearchList.statusList = results[0];
      this.dataSearchList.tradingTypeList = results[1];
    },
    async onAfterLoad() {
      setTimeout(() => {
        this.netAmount = this.$refs.grdCompany.getDataSource().reduce((n, { TOTAL_AMT }) => n + TOTAL_AMT, 0);
        this.vatAmount = this.$refs.grdCompany.getDataSource().reduce((n, { TOTAL_VAT_AMT }) => n + TOTAL_VAT_AMT, 0);
        this.totalAmount = this.$refs.grdCompany.getDataSource().reduce((n, { TOTAL_PAYMENT }) => n + TOTAL_PAYMENT, 0);
      }, 1000);
    },
  },
};
</script>
