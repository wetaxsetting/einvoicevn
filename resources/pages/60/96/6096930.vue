<template>
  <v-container fluid class="pa-0">
    <v-row lg="12" class="d-flex pl-2">
      <BaseButton
        btn_type="icon"
        :icon_type="isShowLeft ? 'skip_prev' : 'skip_next'"
        :btn_text="isShowLeft ? $t('hide_left') : $t('show_left')"
        @onclick="isShowLeft = !isShowLeft"
      />
    </v-row>
    <v-row class="ma-0">
      <v-col lg="4" :class="isShowLeft ? null : 'd-none'" class="mr-1">
        <v-row lg="12">
          <v-col>
            <BaseDatePicker
              :label="$t('fromdate')"
              v-model="fromDate"
              :pretoday="3"
              outlined
            />
          </v-col>
          <v-col>
            <BaseDatePicker
              :label="$t('todate')"
              v-model="toDate"
              today
              outlined
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="ma-0">
            <BaseInput outlined :label="$t('bill_no')" v-model="bill_no" />
          </v-col>
          <v-col lg="4" cols="12" class="text-right d-flex">
            <BaseButton
              icon_type="search"
              :btn_text="$t('search')"
              :disabled="isProcessing"
              @onclick="onSearch"
            />
          </v-col>
        </v-row>

        <BaseGridView
          column-resizing-mode="widget"
          ref="grdMst"
          :auto_load="false"
          selectionmode="singlerow"
          :max_height="limitHeight"
          :header="headerMst"
          sel_procedure="SEL_6096930_MST_NC"
          :filter_paras="[fromDate, toDate, bill_no]"
          @cellClick="searchDtl"
        />
      </v-col>

      <v-col>
        <BaseGridView
          column-resizing-mode="widget"
          ref="grdDtl"
          :auto_load="false"
          selectionmode="singlerow"
          :max_height="limitHeight2"
          :header="headerDtl"
          sel_procedure="SEL_6096930_DTL_NC"
          :filter_paras="[mstPk]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  data: () => ({
    isShowLeft: true,
    fromDate: "",
    toDate: "",
    bill_no: "",
    mstPk: "",
    headerGrid: [],
  }),

  created() {
    this.initHeaderList();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 260;
    },
    limitHeight2() {
      return this.limitHeight + 125;
    },
  },

  mounted() {
    this.onSearch();
  },
  methods: {
    onSearch() {
      this.$refs.grdMst.loadData();
    },

    searchDtl() {
      this.mstPk = this.$refs.grdMst.getSelectedRows()?.[0]?.SID;
      if (this.mstPk) {
        this.$refs.grdDtl.loadData();
      }
    },

    initHeaderList() {
      this.headerMst = [
        {
          dataField: "SID",
          width: 0,
          caption: this.$t("SID"),
        },
        {
          dataField: "SH_ID",
          caption: this.$t("SH_ID"),
        },
        {
          dataField: "ORD_NO",
          caption: this.$t("ORD_NO"),
        },
        {
          dataField: "SALE_DT",
          caption: this.$t("SALE_DT"),
        },
        {
          dataField: "SALE_TM",
          caption: this.$t("SALE_TM"),
        },
        {
          dataField: "SHOP_CD",
          caption: this.$t("SHOP_CD"),
        },
        {
          dataField: "SHOP_NM",
          caption: this.$t("SHOP_NM"),
        },
        {
          dataField: "POS_NO",
          caption: this.$t("POS_NO"),
        },
        {
          dataField: "BILL_NO",
          caption: this.$t("BILL_NO"),
        },
        {
          dataField: "CURR_CD",
          caption: this.$t("CURR_CD"),
        },
        {
          dataField: "EX_RATE",
          caption: this.$t("EX_RATE"),
        },
        {
          dataField: "TOT_AMT",
          caption: this.$t("TOT_AMT"),
        },
        {
          dataField: "TOT_DC_AMT",
          caption: this.$t("TOT_DC_AMT"),
        },
        {
          dataField: "TOT_AFT_DC_AMT",
          caption: this.$t("TOT_AFT_DC_AMT"),
        },
        {
          dataField: "TOT_VAT_AMT",
          caption: this.$t("TOT_VAT_AMT"),
        },
        {
          dataField: "TOT_PAY",
          caption: this.$t("TOT_PAY"),
        },
        {
          dataField: "SALE_TP",
          caption: this.$t("SALE_TP"),
        },
        {
          dataField: "ORG_BILL_NO",
          caption: this.$t("ORG_BILL_NO"),
        },
        {
          dataField: "PAY_TP",
          caption: this.$t("PAY_TP"),
        },
        {
          dataField: "SEND_DT",
          caption: this.$t("SEND_DT"),
        },
        {
          dataField: "CUS_NM",
          caption: this.$t("CUS_NM"),
        },
        {
          dataField: "CUS_ADD",
          caption: this.$t("CUS_ADD"),
        },
        {
          dataField: "CUS_TAXCD",
          caption: this.$t("CUS_TAXCD"),
        },
        {
          dataField: "CUS_EML",
          caption: this.$t("CUS_EML"),
        },
        {
          dataField: "CUS_TEL",
          caption: this.$t("CUS_TEL"),
        },
        {
          dataField: "CID",
          caption: this.$t("CID"),
        },
        {
          dataField: "BUYER_NM",
          caption: this.$t("BUYER_NM"),
        },
        {
          dataField: "SALE_CHNL",
          caption: this.$t("SALE_CHNL"),
        },
        {
          dataField: "PROC_YN",
          caption: this.$t("PROC_YN"),
        },
        {
          dataField: "TAX_AUTH_CD",
          caption: this.$t("TAX_AUTH_CD"),
        },
        {
          dataField: "REG_ID",
          caption: this.$t("REG_ID"),
        },
        {
          dataField: "REG_DTM",
          caption: this.$t("REG_DTM"),
        },
        {
          dataField: "EDIT_ID",
          caption: this.$t("EDIT_ID"),
        },
        {
          dataField: "EDIT_DTM",
          caption: this.$t("EDIT_DTM"),
        },
        {
          dataField: "PRO_YN",
          caption: this.$t("PRO_YN"),
        },
        {
          dataField: "TEI_COMPANY_PK",
          caption: this.$t("TEI_COMPANY_PK"),
        },
      ];
      this.headerDtl = [
        {
          dataField: "SID",
          width: 0,
          caption: this.$t("SID"),
        },
        {
          dataField: "SH_ID",
          caption: this.$t("MST_ID"),
        },
        {
          dataField: "SALE_DT",
          caption: this.$t("SALE_DT"),
        },
        {
          dataField: "SALE_TM",
          caption: this.$t("SALE_TM"),
        },
        {
          dataField: "SHOP_CD",
          caption: this.$t("SHOP_CD"),
        },
        {
          dataField: "POS_NO",
          caption: this.$t("POS_NO"),
        },
        {
          dataField: "BILL_NO",
          caption: this.$t("BILL_NO"),
        },
        {
          dataField: "ORD_NO",
          caption: this.$t("ORD_NO"),
        },
        {
          dataField: "PROD_CD",
          caption: this.$t("PROD_CD"),
        },
        {
          dataField: "PROD_NM",
          caption: this.$t("PROD_NM"),
        },
        {
          dataField: "UOM",
          caption: this.$t("UOM"),
        },
        {
          dataField: "UNIT_PRC",
          caption: this.$t("UNIT_PRC"),
        },
        {
          dataField: "SALE_QTY",
          caption: this.$t("SALE_QTY"),
        },
        {
          dataField: "SALE_PRC",
          caption: this.$t("SALE_PRC"),
        },
        {
          dataField: "AMT",
          caption: this.$t("AMT"),
        },
        {
          dataField: "DC_RATE",
          caption: this.$t("DC_RATE"),
        },
        {
          dataField: "DC_AMT",
          caption: this.$t("DC_AMT"),
        },
        {
          dataField: "AFT_DC_AMT",
          caption: this.$t("AFT_DC_AMT"),
        },
        {
          dataField: "VAT_RATE",
          caption: this.$t("VAT_RATE"),
        },
        {
          dataField: "VAT_AMT",
          caption: this.$t("VAT_AMT"),
        },
        {
          dataField: "PAY_AMT",
          caption: this.$t("PAY_AMT"),
        },

        {
          dataField: "REG_ID",
          caption: this.$t("REG_ID"),
        },
        {
          dataField: "REG_DTM",
          caption: this.$t("REG_DTM"),
        },
        {
          dataField: "EDIT_ID",
          caption: this.$t("EDIT_ID"),
        },
        {
          dataField: "EDIT_DTM",
          caption: this.$t("EDIT_DTM"),
        },
      ];
    },
  },
};
</script>
