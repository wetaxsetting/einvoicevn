<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3">
        <BaseSelect
          :label="$t('company')"
          :lstData="conpany_list"
          v-model="selected_company"
          item-value="VAL"
          item-text="NAME"
        />
      </v-col>
      <v-col md="2">
        <BaseSelect
          :label="$t('date')"
          :lstData="date_type_list"
          v-model="selected_date_type"
          item-value="VAL"
          item-text="NAME"
          filter_off
        />
      </v-col>

      <!-- month -->
      <v-col md="2" v-show="selected_date_type == '0'">
        <BaseDatePicker :label="$t('month')" v-model="month" month />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '0'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '0'">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- ascurrent -->
      <v-col md="2" v-show="selected_date_type == '1'"> </v-col>
      <v-col md="2" v-show="selected_date_type == '1'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '1'">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- year -->
      <v-col md="2" v-show="selected_date_type == '2'">
        <BaseDatePicker :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '2'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '2'">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- Quarter -->

      <v-col md="1" v-show="selected_date_type == '3'">
        <BaseDatePicker :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="1" v-show="selected_date_type == '3'">
        <BaseSelect
          :label="$t('type_quarter')"
          v-model="selectTypeQuarter"
          :lstData="lstTypeQuarter"
          item-text="NAME"
          item-value="VAL"
          filter_off
        />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '3'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '3'">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
      </v-col>

      <v-col md="1" class="d-flex justify-end">
        <BaseButton
          btn_type="icon"
          icon_type="search"
          @onclick="onClickButton()"
        />
        <BaseButton btn_type="icon" icon_type="print" @onclick="onReport"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BaseGridView
          ref="gridview"
          :header="this.headerGrid"
          :autoresize="false"
          :setting="true"
          :headertype="1"
          :height="limitHeight"
          sel_procedure="EI_SEL_6095200_DATA"
          :filter_paras="[this.selected_company, this.from_date, this.to_date]"
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
    conpany_list: [],
    from_date: "",
    to_date: "",
    headerGrid: [],
    selected_date_type: "",
    date_type_list: [
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
    selectTypeQuarter: "",
    lstTypeQuarter: [
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
    this.onSetHeader();
  },

  watch: {
    selected_date_type(val) {
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
        if (this.selectTypeQuarter == "0") {
          this.from_date = this.year + "0101";
          this.to_date = this.year + "0331";
        }
        if (this.selectTypeQuarter == "1") {
          this.from_date = this.year + "0401";
          this.to_date = this.year + "0630";
        }
        if (this.selectTypeQuarter == "2") {
          this.from_date = this.year + "0701";
          this.to_date = this.year + "0930";
        }
        if (this.selectTypeQuarter == "3") {
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
        if (this.selected_date_type == "2") {
          this.from_date = this.year + "0101";
          this.to_date = this.year + "1231";
        }
        if (this.selected_date_type == "3") {
          if (this.selectTypeQuarter == "0") {
            this.from_date = this.year + "0101";
            this.to_date = this.year + "0331";
          }
          if (this.selectTypeQuarter == "1") {
            this.from_date = this.year + "0401";
            this.to_date = this.year + "0630";
          }
          if (this.selectTypeQuarter == "2") {
            this.from_date = this.year + "0701";
            this.to_date = this.year + "0930";
          }
          if (this.selectTypeQuarter == "3") {
            this.from_date = this.year + "1001";
            this.to_date = this.year + "1231";
          }
        }
      }
    },
    selectTypeQuarter(val) {
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
    limitHeight() {
            if (this.windowHeight <= 768) {
                return this.windowHeight * 0.69;//1366x768
            } else {
                return this.windowHeight * 0.82;//1920x18/080
            }
        },
  },
  methods: {
    async onReport() {
      let report_path = "report/60/95/rpt_6095200.xlsx";
      let hiddenCols = [];
      let excel = [];
      excel = [
        {
          sheet: 1,
          insertRange: [
            {
              range: "A1:J11",
              proc: "AC_RPT_6095200_M",
              params: [ 
                this.selected_company,
                this.from_date,
                this.to_date,
              ],
            }, //header
          ],
          insertRows: [
            {
              sequence: "break",
              startRow: 16,
              proc: "AC_RPT_6095200_M",
              params: [
                this.selected_company,
                this.from_date,
                this.to_date,
              ],
              dateColumns: [],
              stringColumns: [
                "SEQ",
                "TAX_CODE",
                "COMPANY_NM",
                "ADDR",
                "INV_CONTENT",
                "FORM_NO",
                "SERIAL_NO",
                "INVOICE_MIN",
                "INVOICE_MAX",
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
    onClickButton() {
      this.$refs.gridview.loadData();
    },
    onSetHeader() {
      this.headerGrid = [
        {
          field: "SEQ",
          title: this.$t("no"),
          alignment: "right",
          type:"text",
          width:80,
        },
        {
          field: "TAX_CODE",
          title: this.$t("tax_code"),
          alignment: "left",
          type:"text",
          width:120,
        },
        {
          field: "COMPANY_NM",
          title: this.$t("company_name"),
          alignment: "left",
          type:"text",
          width:300,
        },
        {
          field: "ADDR",
          title: this.$t("address"),
          width: 350,
          alignment: "left",
          type:"text",
        },
        {
          field: "INV_CONTENT",
          title: this.$t("invoice_type"),
          alignment: "left",
          type:"text",
          width:200,
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width: 100,
          alignment: "left",
          type:"text",
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          alignment: "center",
          type:"text",
          width:100,
        },
        {
          field: "INVOICE_MIN",
          title: this.$t("form"),
          width: 100,
          alignment: "center",
          type:"munber",
        },
        {
          field: "INVOICE_MAX",
          title: this.$t("to"),
          width: 100,
          alignment: "center",
          type:"munber",
        },
        {
          field: "REMAIN_QTY",
          title: this.$t("quantity"),
          alignment: "left",
          type:"text",
          width:100,
          formatFloat: 0,
        },
        {
          field: "REMARK",
          title: this.$t("remark"),
          alignment: "right",
          type:"text",
          width:100,
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "EI_SEL_6095200_COMPANY",
            para: [this.user.PK],
          };
          this.conpany_list = await this._dsoCall(
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
