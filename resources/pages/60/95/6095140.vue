<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3">
        <BaseSelect outlined :label="$t('company')" :lstData="company_list" v-model="selected_company" item-value="VAL"
          item-text="NAME" />
      </v-col>
      <v-col md="2">
        <BaseSelect outlined :label="$t('date')" :lstData="type_date_list" v-model="selected_type_date" item-value="VAL"
          item-text="NAME" filter_off />
      </v-col>

      <!-- month -->
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker outlined :label="$t('month')" v-model="month" month />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker outlined :label="$t('from_to')" v-model="to_date" />
      </v-col>
      <!-- ascurrent -->
      <v-col md="2" v-show="selected_type_date == '1'"> </v-col>
      <v-col md="2" v-show="selected_type_date == '1'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '1'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- year -->
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>

      <!-- Quarter -->
      <v-col md="1" v-show="selected_type_date == '3'">
        <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="1" v-show="selected_type_date == '3'">
        <BaseSelect outlined :label="$t('type_quarter')" v-model="selected_type_quarter" :lstData="type_quarter_list"
          item-text="NAME" item-value="VAL" filter_off />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '3'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '3'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>

      <v-col md="1" class="d-flex justify-end">
        <BaseButton btn_type="icon" icon_type="search" @onclick="onClickButton()" />
        <BaseButton btn_type="icon" icon_type="excel" @onclick="onReport" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BaseGridView ref="gridview" :header="this.headerGrid" :autoresize="false" :height="limitHeight" :setting="true"
          :headertype="1" sel_procedure="AC_SEL_6095140_DATA" :filter_paras="[
            this.from_date,
            this.to_date,
            this.selected_company,
            this.selected_fiscal,
          ]" />
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
    selected_fiscal: "",
    list_fiscal: [],
    headerGrid: [],
    selected_type_date: "",
    type_date_list: [
      {
        NAME: "Monthly",
        VAL: "0",
      },
      {
        NAME: "As current",
        VAL: "1",
      },
      {
        NAME: "Year",
        VAL: "2",
      },
      {
        NAME: "Quarter",
        VAL: "3",
      },
    ],
    selected_type_quarter: "",
    type_quarter_list: [
      {
        NAME: "I",
        VAL: "0",
      },
      {
        NAME: "II",
        VAL: "1",
      },
      {
        NAME: "III",
        VAL: "2",
      },
      {
        NAME: "IV",
        VAL: "3",
      },
    ],
    month: "",
    year: "",
  }),

  async created() {
    await this.getListCodes("company");
    await this.getListCodes("fiscal");
    this.onSetHeader();
  },

  watch: {
    selected_type_date(val) {
      if (val == "0" || val == "2") {
        this.from_date = "";
        this.to_date = "";
      }
      let tmpMonth = new Date().getMonth() + 1;
      if (val == "0" && this.month == "") {
        if (tmpMonth < 10) {
          this.month = "0" + tmpMonth.toString();
        } else {
          this.month = tmpMonth.toString();
        }
        let tmpYear = new Date().getFullYear();
        this.month = tmpYear.toString() + this.month;
      }
      if (val == "2" && this.year == "") {
        let tmpYear = new Date().getFullYear();
        this.year = tmpYear.toString();
      }
      if (val == "3" && this.year == "") {
        let tmpYear = new Date().getFullYear();
        this.year = tmpYear.toString();
      }
      if (this.year != "" && val == "2") {
        this.from_date = this.year + "0101";
        this.to_date = this.year + "1231";
      }
      if (this.month != "" && val == "0") {
        this.from_date = this.month + "01";
        this.to_date = this.month + this._maxDateOfMonth(this.from_date);
      }
      if (val == "3") {
        if (this.selected_type_quarter == "0") {
          this.from_date = this.year + "0101";
          this.to_date = this.year + "0331";
        }
        if (this.selected_type_quarter == "1") {
          this.from_date = this.year + "0401";
          this.to_date = this.year + "0630";
        }
        if (this.selected_type_quarter == "2") {
          this.from_date = this.year + "0701";
          this.to_date = this.year + "0930";
        }
        if (this.selected_type_quarter == "3") {
          this.from_date = this.year + "1001";
          this.to_date = this.year + "1231";
        }
      }
    },
    month(val) {
      if (val) {
        this.from_date = val + "01";
        this.to_date = val + this._maxDateOfMonth(val);
      }
    },
    year(val) {
      if (val) {
        if (this.selected_type_date == "2") {
          this.from_date = this.year + "0101";
          this.to_date = this.year + "1231";
        }
        if (this.selected_type_date == "3") {
          if (this.selected_type_quarter == "0") {
            this.from_date = this.year + "0101";
            this.to_date = this.year + "0331";
          }
          if (this.selected_type_quarter == "1") {
            this.from_date = this.year + "0401";
            this.to_date = this.year + "0630";
          }
          if (this.selected_type_quarter == "2") {
            this.from_date = this.year + "0701";
            this.to_date = this.year + "0930";
          }
          if (this.selected_type_quarter == "3") {
            this.from_date = this.year + "1001";
            this.to_date = this.year + "1231";
          }
        }
      }
    },
    selected_type_quarter(val) {
      switch (val) {
        case "0":
          this.from_date = this.year + "0101";
          this.to_date = this.year + "0331";
          break;
        case "1":
          this.from_date = this.year + "0401";
          this.to_date = this.year + "0630";
          break;
        case "2":
          this.from_date = this.year + "0701";
          this.to_date = this.year + "0930";
          break;
        case "3":
          this.from_date = this.year + "1001";
          this.to_date = this.year + "1231";
          break;
      }
    },
  },

  async mounted() {
    let tmpMonth = new Date().getMonth() + 1;
    if (tmpMonth < 10) {
      this.month = "0" + tmpMonth.toString();
    } else {
      this.month = tmpMonth.toString();
    }
    let tmpYear = new Date().getFullYear();
    this.month = tmpYear.toString() + this.month;
    this.year = tmpYear.toString();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    /// khbjhbkjblhkn
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
          field: "RN",
          title: this.$t("no"),
          alignment: "right",
          type: "text",
          width: 100,
        },
        {
          field: "TR_DATE",
          title: this.$t("trans_date"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "CUS_NM",
          title: this.$t("customer_name"),
          alignment: "left",
          type: "text",
          width: 400,
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width: 120,
          alignment: "left",
          type: "text",
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "INVOICE_ NO",
          title: this.$t("invoice_no"),
          width: 90,
          alignment: "right",
          type: "text",
        },
        {
          field: "TR_CCY",
          title: this.$t("currency"),
          alignment: "right",
          type: "munber",
          width: 100,
          formatFloat: 0,
        },
        {
          field: "TR_RATE",
          title: this.$t("ex_rate"),
          width: 100,
          alignment: "right",
          type: "number",
          formatFloat: 0,
        },
        {
          field: "TOT_NET_TR_AMT",
          title: this.$t("amount_trans"),
          width: 120,
          alignment: "right",
          type: "number",
          formatFloat: 0,
        },
        {
          field: "TOT_NET_BK_AMT",
          title: this.$t("amount_books"),
          width: 150,
          alignment: "right",
          type: "number",
          formatFloat: 0,
        },
        {
          field: "REMARK",
          title: this.$t("description"),
          alignment: "left",
          type: "text",
          width: 300,
        },
        {
          field: "REMARK2",
          title: this.$t("local_description"),
          alignment: "left",
          type: "text",
          width: 300,
        },
        {
          field: "EI_STATUS",
          title: this.$t("ei_status"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "SIGN_BY",
          title: this.$t("sign_name"),
          alignment: "left",
          type: "text",
          width: 200,
        },
        {
          field: "SIGN_DT",
          title: this.$t("sign_date"),
          alignment: "left",
          type: "text",
          width: 200,
        },
        {
          field: "INVOICE_TYPE",
          title: this.$t("invoice_type"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "CONVERT_NAME",
          title: this.$t("convert_name"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "CONVERT_DATE",
          title: this.$t("convert_date"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "CONVERT_YN",
          title: this.$t("convert_y_n"),
          alignment: "left",
          type: "text",
          width: 100,
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "AC_SEL_6095140_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );
          break;
        case "fiscal":
          const dso_fiscal_list = {
            type: "list",
            selpro: "AC_SEL_6095140_FISCAL",
            para: [this.selected_company],
          };
          this.list_fiscal = await this._dsoCall(
            dso_fiscal_list,
            "select",
            false
          );
          if (this.list_fiscal != null) {
            this.selected_fiscal = this.list_fiscal[0].VAL;
          }
          break;
      }
    },
    async onReport() {
      console.log(1);
      let report_path = "report/60/95/rpt_6095140_1.xlsx";
      let hiddenCols = [];
      let excel = [];
      excel = [
        {
          sheet: 1,
          insertRange: [
            {
              range: "A1:V18",
              proc: "AC_RPT_6095140_M",
              params: [
                this.from_date,
                this.to_date,
                this.selected_company,
                this.selected_type_quarter
              ],
            }, //header
          ],
          insertRows: [
            {
              sequence: "break",
              startRow: 24,
              proc: "AC_RPT_6095140",
              params: [
                this.from_date,
                this.to_date,
                this.selected_company,
                this.selected_type_quarter
              ],
              dateColumns: [
              ],
              stringColumns: [
                "INVOICE_TYPE",
                "FORM_NO",
                "SERIAL_NO",
                "CNT_QTY",
                "OPEN_FROM",
                "OPEN_TO",
                "FROM_NUM",
                "TO_NUM",
                "MIN_INVOI_NO",
                "MAX_INVOI_NO",
                "CNT_ALINV",
                "CNT_USE",
                "CNT_CANCEL",
                "CANCEL_INVOICE",
                "REMAIN_FROM",
                "REMAIN_TO",
                "REMAIN_QTY",
              ],
            },
          ],
          hideColumns: hiddenCols,
        },
      ];
      if (!report_path) {
        this.salaryStatus = this.$t("template_not_available");
        return;
      }

      const res = await this.$axios.$get("/dso/makereport", {
        responseType: "blob",
        params: {
          template: report_path,
          excel: JSON.stringify(excel),
        },
      });
      if (res && res.size > 0) {
        let blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        let url = window.URL.createObjectURL(blob);
        window.open(url);
        this.salaryStatus = this.$t("complete");
      } else {
        //this.showNotification( "danger", this.$t("fail_to_export_report"),  "",  4000 );
        this.salaryStatus = this.$t("fail_to_export_report");
      }
    },
  },
};
</script>
