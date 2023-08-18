<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col md="12">
        <v-card>
          <v-row dense>
            <v-col md="12" class="text-right">
              <GwFlexBox class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('search')" />
                <BaseButton icon_type="preview" :btn_text="$t('preview')" :disabled="isProcessing" @onclick="onClickButton('preview')" />
                <BaseButton icon_type="viewxml" :btn_text="$t('viewxml')" :disabled="isProcessing" @onclick="onClickButton('viewxml')" />
                <BaseButton icon_type="viewpdf" :btn_text="$t('viewpdf')" :disabled="isProcessing" @onclick="onClickButton('viewpdf')" />
              </GwFlexBox>
            </v-col>
          </v-row>
          <v-row dense class="pt-2">
            <v-col md="3" class="pl-2">
              <BaseSelect outlined v-model="sellerName" :lstData="dataSearchList.sellerNameList" item-value="CODE" item-text="NAME" :label="$t('seller_name')"></BaseSelect>
            </v-col>
            <v-col lg="1">
              <BaseSelect outlined v-model="sellerTaxcode" :lstData="dataSearchList.sellerTaxcodeList" item-value="CODE" item-text="NAME" :label="$t('seller_taxcode')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseSelect outlined v-model="form_No" :lstData="dataSearchList.formNoList" item-value="CODE" item-text="NAME" :label="$t('form_no')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('serial_no')" v-model="serial_no" :lstData="dataSearchList.serialNoList" item-value="CODE" item-text="NAME"/>
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('invoice_no')" v-model="invoice_no" />
            </v-col>
            <v-col lg="2" class="pr-2">
              <BaseSelect outlined v-model="status" :lstData="dataSearchList.statusList" item-value="CODE" item-text="NAME" :label="$t('status')"></BaseSelect>
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
              <BaseInput outlined :label="$t('store_id')" v-model="store_id" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('pos')" v-model="pos" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined :label="$t('bill_no')" v-model="bill_no" />
            </v-col>
            <v-col md="2">
              <BaseInput outlined :label="$t('net_amount')" readonly v-model="netAmount" number />
            </v-col>
            <v-col md="2">
              <BaseInput outlined :label="$t('vat_amount')" readonly v-model="vatAmount" number />
            </v-col>
            <v-col md="2" class="pr-2">
              <BaseInput outlined :label="$t('total_amount')" readonly v-model="totalAmount" number />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col md="8" class="pt-2">
              <BaseGridView column-resizing-mode="widget" ref="grdCompany" :auto_load="false" select_mode="Single" :max_height="limitHeight" :header="headerGrid" @cellClick="grdSearchClick" />
            </v-col>
            <v-col md="4" class="pt-2">
              <BaseGridView column-resizing-mode="widget" ref="grdCompany" :auto_load="false" select_mode="Single" :max_height="limitHeight" :header="headerProD" />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col md="8" class="pt-2"></v-col>
            <v-col md="4" class="pt-2">
              <BaseGridView column-resizing-mode="widget" ref="grdCompany" :auto_load="false" select_mode="Single" :max_height="limitHeightGridDetails" :header="headerProVAT" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- <v-col :md="isShowLeft ? 4 : 12">
        
    </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  components: {},
  data: () => ({
    isShowLeft: true,

    sellerName: "",
    sellerTaxcode: "",
    serial_no: "",
    form_No: "",
    invoice_no: "",
    status: "",
    //
    form_date: "",
    to_date: "",
    trading_type: "",
    partner: "",
    trade_code: "",
    mccqt: "",
    //
    store_id: "",
    pos: "",
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
  }),

  async created() {
    await this.initDataList("company");
    await this.initDataList("form_no");
    // await this.initDataList("serial_no");

  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 400;
      }
    }, // this.windowHeight },
    limitHeightGridDetails() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 200;
      }
    },
    headerGrid() {
      const self = this;
      return [
        {
          dataField: "PK",
          width: 80,
          caption: this.$t("no"),
        },
        {
          dataField: "COMPANY_CD",
          width: 120,
          caption: this.$t("sale_date"),
        },
        {
          dataField: "COMPANY_NM",
          width: 300,
          caption: this.$t("store_id"),
        },
        {
          dataField: "COMPANY_LNM",
          caption: this.$t("store_name"),
        },
        {
          dataField: "COMPANY_FNM",
          caption: this.$t("pos"),
          width: 180,
        },
        {
          dataField: "TAX_CODE",
          caption: this.$t("bill_number"),
          width: 120,
        },
        {
          dataField: "ADDR",
          caption: this.$t("sales_category"),
          width: 300,
        },
        {
          dataField: "ADDR_L",
          caption: this.$t("payment_type"),
          width: 80,
        },
        {
          dataField: "ADDR_F",
          caption: this.$t("total_amount"),
          width: 80,
        },
        {
          dataField: "TEL",
          caption: this.$t("actual_sales"),
          width: 120,
        },
        {
          dataField: "FAX",
          caption: this.$t("discount"),
          width: 80,
        },
        {
          dataField: "ACC_NO",
          caption: this.$t("vat_amount"),
          width: 80,
        },
        {
          dataField: "ACC_CCY",
          caption: this.$t("form_no"),
        },
        {
          dataField: "ACC_HOLDER",
          caption: this.$t("serial_no"),
        },
        {
          dataField: "BANK_NAME",
          caption: this.$t("invoice_no"),
          width: 80,
        },
        {
          dataField: "CONTACT_PERSON",
          caption: this.$t("mccqt"),
        },
        {
          dataField: "REP_PERSON",
          caption: this.$t("buyer_name"),
        },
        {
          dataField: "TAX_NAME",
          caption: this.$t("buyer_taxcode"),
        },
        {
          dataField: "REMARKS",
          caption: this.$t("buyer_address"),
        },
        {
          dataField: "ERP_COMPANY_PK",
          caption: this.$t("buyer_indentification"),
        },
        {
          dataField: "ERP_COMPANY_NAME",
          caption: this.$t("email"),
        },
        {
          dataField: "WEB_SITE",
          caption: this.$t("email_cc"),
        },
        {
          dataField: "TAX_CODE_DISPLAY",
          caption: this.$t("trade_code"),
        },
      ];
    },

    headerProD() {
      const self = this;
      return [
        {
          dataField: "PK",
          caption: this.$t("no"),
        },
        {
          dataField: "PRODUCTION_CODE",
          caption: this.$t("production_code"),
        },
        {
          dataField: "PRODUCTION_NAME",
          caption: this.$t("production_name"),
        },
        {
          dataField: "UNIT",
          caption: this.$t("unit"),
        },
        {
          dataField: "QUANTITY",
          caption: this.$t("quantity"),
        },
        {
          dataField: "PRICE",
          caption: this.$t("price"),
        },
        {
          dataField: "DIC_RATE",
          caption: this.$t("dic_rate"),
        },
        {
          dataField: "DIC_AMOUNT",
          caption: this.$t("dic_amount"),
        },
        {
          dataField: "TAX_RATE",
          caption: this.$t("tax_rate"),
        },
        {
          dataField: "AMOUNT",
          caption: this.$t("amount"),
        },
        {
          dataField: "NATURE",
          caption: this.$t("nature"),
        },
      ];
    },

    headerProVAT() {
      const self = this;
      return [
        {
          dataField: "TAX_RATE",
          caption: this.$t("tax_rate"),
        },
        {
          dataField: "NET_AMOUNT",
          caption: this.$t("net_amount"),
        },
        {
          dataField: "VAT_AMOUNT",
          caption: this.$t("vat_amount"),
        },
      ];
    },
  },
  watch: {
    "sellerName"(val) {
      if (val) {
        this.sellerTaxcode = this.dataSearchList.sellerNameList.find((item) => item.CODE == val).TAX_CODE;
      }
      this.initDataList("form_no");
    },
  },
  methods: {
    grdSearchClick() {},
    async initDataList(pos) {
      switch (pos) {
        case "company":
          const company = await this._callProcedure("AC_SEL_6095450_COMPANY", [this.user.PK]);
          if (company.length > 0) {
            this.dataSearchList.sellerNameList = company;
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
            para: [this.sellerName, this.form_No],
          };
          this.dataSearchList.serialNoList = await this._dsoCall(dso_serial_list, "select", false);
          this.serial_no = this.dataSearchList.serialNoList[0].CODE;
          break;
      }
    },
  },
};
</script>
