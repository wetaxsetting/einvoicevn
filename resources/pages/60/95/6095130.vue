<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3">
        <BaseSelect
          :label="$t('company')"
          :lstData="company_list"
          v-model="selected_company"
          item-value="VAL"
          item-text="NAME"
        />
      </v-col>
      <v-col md="2">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" default />
      </v-col>
      <v-col md="2">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" default />
      </v-col>
      <v-col md="2">
        <BaseInput :label="$t('partner')" v-model="partner" />
      </v-col>
      <v-col md="2">
        <BaseInput :label="$t('invoice_no')" v-model="invoice_no"/>
      </v-col>
      <v-col md="1" class="d-flex justify-end">
        <BaseButton
          btn_type="icon"
          icon_type="search"
          @onclick="onClickButton()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <BaseGridView
          ref="gridview"
          :header="this.headerGrid"
          :autoresize="false"
          :setting="true"
          :height="limitHeight"
          :headertype="1"
          sel_procedure="AC_SEL_6095130_DATA"
          :filter_paras="[
            this.from_date,
            this.to_date,
            this.partner,
            this.invoice_no,
            this.selected_company,
          ]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  components: {},
  data: () => ({
    selected_company: null,
    company_list: [],
    from_date: "",
    to_date: "",
    headerGrid: [],
    partner: "",
    invoice_no: "",
  }),

  async created() {
    await this.getListCodes("company");
    this.onSetHeader();
  },

  watch: {},

  mounted() {},
  // meo
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.69; //1366x768
      } else {
        return this.windowHeight * 0.82; //1920x18/080
      }
    },
  },
  methods: {
    onClickButton() {
      this.$refs.gridview.loadData();
    },
    onSetHeader() {
      this.headerGrid = [
        {
          field: "TR_DATE",
          title: this.$t("trans_date"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "PARTNER_ID",
          title: this.$t("partner_id"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "PARTNER_NAME",
          title: this.$t("partner_NAME"),
          alignment: "left",
          type: "text",
          width: 300,
        },
        {
          field: "CUSTOMER_FNM",
          title: this.$t("customer_name"),
          width: 300,
          alignment: "left",
          type: "text",
        },
        {
          field: "TAX_CODE",
          title: this.$t("tax_code"),
          width: 150,
          alignment: "left",
          type: "text",
        },
        {
          field: "INVOICE_NO",
          title: this.$t("invoice_no"),
          width: 100,
          alignment: "left",
          type: "text",
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          alignment: "left",
          type: "text",
          allowEditing: true,
          width: 100,
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width: 80,
          alignment: "left",
          type: "text",
        },
        {
          field: "TR_STATUS",
          title: this.$t("status"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "TOT_NET_TR_AMT",
          title: this.$t("total_amuont"),
          alignment: "right",
          type: "number",
          width: 150,
          formatFoalt: 0,
        },
        {
          field: "REMARK",
          title: this.$t("description_ar"),
          alignment: "left",
          type: "text",
          width: 300,
        },
        {
          field: "REMARK2",
          title: this.$t("lacal_desc_ar"),
          alignment: "left",
          type: "text",
          width: 300,
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "AC_SEL_6095130_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );
          break;
      }
    },
  },
};
</script>
