<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col lg="6" :class="isShowLeft ? null : 'd-none'">
        <v-card>
          <v-row dense class="pt-2">
            <v-col lg="4" class="pl-2">
              <BaseSelect outlined v-model="sellerName" :lstData="dataSearchList.sellerNameList" item-value="CODE" item-text="NAME" :label="$t('seller_name')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseInput outlined readonly v-model="sellerTaxcode" :label="$t('seller_taxcode')"></BaseInput>
            </v-col>
            <v-col lg="2" class="pl-2">
              <BaseDatePicker outlined :pretoday="7" :label="$t('from_date')" v-model="form_date" />
            </v-col>
            <v-col lg="2">
              <BaseDatePicker outlined today :label="$t('to_date')" v-model="to_date" />
            </v-col>
            <v-col lg="2" class="text-right">
              <GwFlexBox class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('search')" />
                <BaseButton icon_type="XML" :btn_text="$t('XML')" :disabled="isProcessing" @onclick="onClickButton('XML')" />
              </GwFlexBox>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="12" class="pt-2">
              <BaseGridView
                ref="grdCompany"
                :auto_load="false"
                sel_procedure="AC_SEL_6095470_SEARCH_NC"
                select_mode="Single"
                :max_height="limitHeight"
                :header="headerGridLeft"
                @cellClick="grdSearchClick"
                :filter_paras="[this.sellerName, this.form_date, this.to_date]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col :lg="isShowLeft ? 6 : 12">
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
            <v-col lg="3">
              <GwFlexBox class="d-flex justify-end">
                <BaseButton :icon_type="btnIconType" :disabled="isProcessing" :btn_text="$t('show_detail_item')" @onclick="onClick('ShowItem')" />
              </GwFlexBox>
            </v-col>
            <v-col lg="8">
              <GwFlexBox class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="!this.masterPK" @onclick="onClickButton('searchM')" />
                <BaseButton icon_type="preview" :btn_text="$t('preview')" :disabled="!this.mastersPK" @onclick="onClickButton('preview')" />
                <BaseButton icon_type="viewxml" :btn_text="$t('viewxml')" :disabled="!this.mastersPK" @onclick="onClickButton('viewxml')" />
              </GwFlexBox>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="2" class="pl-2">
              <BaseDatePicker outlined :pretoday="7" :label="$t('from_date')" v-model="form_dateM" />
            </v-col>
            <v-col lg="2">
              <BaseDatePicker outlined today :label="$t('to_date')" v-model="to_dateM" />
            </v-col>
            <v-col lg="2">
              <BaseSelect outlined v-model="form_No" :lstData="dataSearchList.formNoList" item-value="CODE" item-text="NAME" :label="$t('form_no')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseSelect outlined :label="$t('serial_no')" v-model="serial_no" :lstData="dataSearchList.serialNoList" item-value="CODE" item-text="NAME" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('invoice_no')" v-model="invoice_no" @keyPressEnter="onClickButton('searchM')" />
            </v-col>
            <v-col lg="2" class="pr-2">
              <BaseInput outlined :label="$t('trade_code')" v-model="trade_code" />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="4" class="pl-2">
              <BaseInput outlined :label="$t('net_amount')" readonly v-model="netAmount" number />
            </v-col>
            <v-col lg="4">
              <BaseInput outlined :label="$t('vat_amount')" readonly v-model="vatAmount" number />
            </v-col>
            <v-col lg="4" class="pr-2">
              <BaseInput outlined :label="$t('total_amount')" readonly v-model="totalAmount" number />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="12" class="pt-2">
              <BaseGridView
                ref="grdMaster"
                :auto_load="false"
                select_mode="Single"
                :max_height="limitHeightM"
                sel_procedure="AC_SEL_6095471_01_NC"
                :header="headerGridM"
                @cellClick="grdMasterM"
                @setDataSource="onAfterLoad"
                :filter_paras="[this.masterPK, this.form_dateM, this.to_dateM, this.form_No, this.serial_no, this.invoice_no, this.trade_code]"
              />
              <!-- this.form_No,
                    this.serial_no,
                    this.invoice_no,
                    this.status,
                    this.form_date,
                    this.to_date,
                    this.trading_type,
                    this.mccqt,
                    this.store_id,
                    this.pos_no,
                    this.bill_no, -->
            </v-col>
          </v-row>
          <v-row dense v-show="ShowDetailItem">
            <v-col lg="7" class="pt-2">
              <BaseGridView
                ref="grdDetailD"
                :auto_load="false"
                select_mode="Single"
                :max_height="limitHeightGridDetails"
                sel_procedure="AC_SEL_6095470_02_NC"
                :header="headerProD"
                :filter_paras="[this.mastersPK]"
              />
            </v-col>
            <v-col lg="5" class="pt-2">
              <BaseGridView
                ref="grdDetailVAT"
                :auto_load="false"
                select_mode="Single"
                :max_height="limitHeightGridDetails"
                sel_procedure="AC_SEL_6095470_03_NC"
                :header="headerProVAT"
                :filter_paras="[this.mastersPK]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <GwLoading :visible="showLoading" />
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
    isShowLeft: true,
    isMaximized: false,
    showPDF: false,
    showLoading: false,
    xml_signed: "",
    urlPDF: "",
    xmlUrl: "",
    xmlFileNm: "",

    sellerName: "",
    sellerTaxcode: "",
    serial_no: "All",
    form_No: "1",
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
    mastersPK: "",
    pdfUrl: "",
    btnIconType: "eye_off",
    ShowDetailItem: false,
    form_dateM: "",
    to_dateM: "",
    prexml_Url: "",
    statusList:[],
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
        return 750;
      }
    },
    limitHeightM() {
      let _grdInitSHeight = 0;
      let showItem = this.ShowDetailItem ? (this.limitHeight1 / 6) * 4 : this.limitHeight1;
      _grdInitSHeight = showItem - 75;
      return _grdInitSHeight;
    },
    limitHeightGridDetails() {
      let _grdInitSHeight = 0;
      let showItem = this.ShowDetailItem ? (this.limitHeight1 / 6) * 2 : 0;
      _grdInitSHeight = showItem - 12;
      return _grdInitSHeight;
    },
    headerGridLeft() {
      const self = this;
      return [
        {
          dataField: "INVOICE_DATE",
          caption: this.$t("invoice_date"),
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
          width: 120
        },
        {
          dataField: "CRT_DT",
          caption: this.$t("time"),
          width: 220
        },
        {
          dataField: "POS_INV_XML",
          caption: this.$t("box_key"),
          alignment: "right",
        },
        {
          dataField: "INVOICE_QTY",
          caption: this.$t("invoice_qty"),
          type:"number",
        },
        {
          dataField: "STATUS",
          caption: this.$t("status"),
          lookup: {
            dataSource: this.statusList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          alignment: "center",
          type: "text",
        },
        {
          dataField: "CQT_MAGD",
          caption: this.$t("cqt_magd"),
          width: 300,
        },
        // {
        //   dataField: "SLLR_TAXCODE",
        //   caption: this.$t("sllr_taxcode"),
        // },
        // {
        //   dataField: "CQT_MAGD",
        //   caption: this.$t("cqt_magd"),
        // },
        // {
        //   dataField: "SIGN_SERIAL_NUMBER",
        //   caption: this.$t("sign_serial_number"),
        // },
      ];
    },
    headerGridM() {
      const self = this;
      return [
        {
          dataField: "RN",
          caption: this.$t("no"),
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
          dataField: "INVOICE_DATE",
          caption: this.$t("sale_date"),
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
        },
        {
          dataField: "INVOICE_NO",
          caption: this.$t("invoice_no"),
          dataType: "number",
          formatFloat: 0,
        },
        {
          dataField: "CQT_MCCQT",
          caption: this.$t("cqt_mccqt"),
          width: 220,
        },
        {
          dataField: "TOTAL_AMT",
          caption: this.$t("total_amount"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "TR_STATUS",
          width: 100,
          caption: this.$t("status"),
          lookup: {
            dataSource: this.statusList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          alignment: "left",
          type: "text",
          width: 120
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
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
          width: 120,
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("production_name"),
        },
        {
          dataField: "ITEM_UOM",
          caption: this.$t("unit"),
        },
        {
          dataField: "QTY",
          caption: this.$t("quantity"),
          dataType: "number",
          formatFloat: 0,
        },
        {
          dataField: "U_PRICE",
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
          dataField: "VAT_TR_AMT",
          caption: this.$t("amount"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "FEATURE",
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
        },
        {
          dataField: "SUB_AMT",
          caption: this.$t("net_amount"),
          formatFloat: 2,
          dataType: "number",
        },
        {
          dataField: "SUB_VAT_AMT",
          caption: this.$t("vat_amount"),
          formatFloat: 2,
          dataType: "number",
        },
      ];
    },
  },
  watch: {
    sellerName(val) {
      if (val) {
        this.sellerTaxcode = this.dataSearchList.sellerNameList.find((item) => item.CODE == val).TAX_CODE;
        this.initDataList("form_no");
        this.initDataList("serial_no");
      }
    },
    form_No(val) {
      this.initDataList("serial_no");
    },
    form_dateM(val) {
      this.initDataList("form_no");
      this.initDataList("serial_no");
    },
    to_dateM(val) {
      this.initDataList("form_no");
      this.initDataList("serial_no");
    },
  },
  methods: {
    onClick(_type, obj = "") {
      switch (_type) {
        case "ShowItem":
          this.ShowDetailItem = !this.ShowDetailItem;
          this.btnIconType = this.ShowDetailItem ? "eye_on" : "eye_off";
          break;
      }
    },
    async grdSearchClick(cell) {
      this.masterPK = await cell.data.PK;
      this.prexml_Url = cell.data.POS_XML;
      this.serial_no = "All";
      await this.$refs.grdMaster.loadData();
    },
    async grdMasterM(cell) {
      this.mastersPK = await cell.data.PK;
      this.xml_signed = cell.data.CQT_XML_SIGNED;
      await this.$refs.grdDetailD.loadData();
      await this.$refs.grdDetailVAT.loadData();
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
          this.dataSearchList.formNoList = [];
          this.form_No = "";
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
          this.dataSearchList.serialNoList = [];
          this.serial_no = "All";
          const dso_serial_list = {
            type: "list",
            selpro: "AC_SEL_6095450_SERIAL_NO",
            para: [this.sellerName, this.form_No, this.form_date, this.to_date],
          };
          this.dataSearchList.serialNoList = await this._dsoCall(dso_serial_list, "select", false);
          //   this.serial_no = this.dataSearchList.serialNoList[0].CODE;
          break;
      }
    },
    async onClickButton(pos) {
      switch (pos) {
        case "search":
          await this.$refs.grdCompany.loadData();
          await this.$refs.grdMaster.Clear();
          break;
        case "preview":
          this.onPreview();
          break;
        case "viewxml":
          this.OnPreviewXML();
          break;
        case "searchM":
          await this.$refs.grdMaster.loadData();
          break;
        case "XML":
          this.OnPreviewS_XML();
          break;
      }
    },
    async onPreview() {
      if (this.mastersPK) {
        this.showLoading = true;
        try {
          let res_url = await this.$axios.$post("/einvoice/general-pdf-template-WT", {
            responseType: "json",
            data: this.mastersPK,
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
      }
    },
    async OnPreviewXML() {
      if (this.masterPK) {
        this.xmlUrl = this.xml_signed;
        this.$nextTick(() => {
          this.isProcessing = false;
          this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
        });
      }
    },
    async OnPreviewS_XML() {
      if (this.masterPK) {
        this.xmlUrl = this.prexml_Url;
        this.$nextTick(() => {
          this.isProcessing = false;
          this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
        });
      }
    },
    async getListCodes() {
      const results = await this._getCommonCode2(["ACEI0010", "ACEI0040", "ACEI0120", "ACEI0190", "ACEI0140", "ACEIN010", "ACJS0460"], this.user.PK);
      this.statusList = results[0];
      this.dataSearchList.tradingTypeList = results[1];
    },
    async onAfterLoad() {
      setTimeout(() => {
        this.netAmount = this.$refs.grdMaster.getDataSource().reduce((n, { TOT_NET_TR_AMT }) => n + TOT_NET_TR_AMT, 0);
        this.vatAmount = this.$refs.grdMaster.getDataSource().reduce((n, { TOTAL_VAT_AMT }) => n + TOTAL_VAT_AMT, 0);
        this.totalAmount = this.$refs.grdMaster.getDataSource().reduce((n, { TOTAL_AMT }) => n + TOTAL_AMT, 0);
      }, 1000);
    },
  },
};
</script>
