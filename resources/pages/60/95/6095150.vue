<template>
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row dense justify="space-between">
      <v-col cols="12">
        <v-card
          outlined
          class="pa-2"
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
        >
          <v-row>
            <v-col md="2">
              <BaseSelect
                :label="$t('company')"
                :lstData="company_list"
                v-model="selected_company"
                item-value="CODE"
                item-text="NAME"
              />
            </v-col>
            <v-col md="1">
              <BaseSelect
                :label="$t('fiscal')"
                :lstData="type_date_list"
                v-model="selected_type_date"
                item-text="NAME"
                item-value="VAL"
                filter_off
              />
            </v-col>
            <!-- month -->
            <v-col md="2" v-show="selected_type_date == '0'">
              <BaseDatePicker :label="$t('month')" v-model="month" month />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '0'">
              <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '0'">
              <BaseDatePicker :label="$t('from_to')" v-model="to_date" />
            </v-col>
            <!-- ascurrent -->
            <v-col md="" v-show="selected_type_date == '1'"> </v-col>
            <v-col md="1" v-show="selected_type_date == '1'">
              <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '1'">
              <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
            </v-col>
            <!-- year -->
            <v-col md="2" v-show="selected_type_date == '2'">
              <BaseDatePicker :label="$t('year')" v-model="year" year />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '2'">
              <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '2'">
              <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
            </v-col>
            <!-- Quarter -->

            <v-col md="1" v-show="selected_type_date == '3'">
              <BaseDatePicker :label="$t('year')" v-model="year" year />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '3'">
              <BaseSelect
                :label="$t('type_quarter')"
                v-model="selected_type_quarter"
                :lstData="type_quarter_list"
                item-text="NAME"
                item-value="VAL"
                filter_off
              />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '3'">
              <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
            </v-col>
            <v-col md="1" v-show="selected_type_date == '3'">
              <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
            </v-col>
            <v-col md="1">
              <BaseSelect
                null
                :label="$t('biz_place')"
                item-text="NAME"
                item-value="VAL"
                :lstData="biz_list"
                v-model="selected_biz"
              />
            </v-col>
            <v-col md="1">
              <BaseSelect
                :label="$t('form_no')"
                item-text="NAME"
                item-value="VAL"
                :lstData="form_no_list"
                v-model="selected_form_no"
              />
            </v-col>
            <v-col md="1">
              <BaseSelect
                :label="$t('ei_status')"
                item-value="VAL"
                item-text="NAME"
                :lstData="status_list"
                v-model="selected_status"
              />
            </v-col>
            <v-col md="1">
              <BaseSelect
                :label="$t('tax_rate')"
                item-value="VAL"
                item-text="NAME"
                :lstData="rate_list"
                v-model="selected_rate"
              />
            </v-col>

            <v-col cols="1" class="d-flex justify-end">
              <BaseButton
                icon_type="search"
                btn_type="icon"
                @onclick="onClickButton()"
              />
              <BaseButton
                btn_type="icon"
                icon_type="print"
                @onclick="onReport"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col md="1">
              <BaseSelect
                :label="$t('invoice_type')"
                item-value="VAL"
                item-text="NAME"
                :lstData="invoice_list"
                v-model="selected_invoice"
              />
            </v-col>
            <v-col md="1">
              <BaseSelect
                :label="$t('vat_type')"
                item-value="VAL"
                item-text="NAME"
                :lstData="vat_list"
                v-model="selected_vat"
              />
            </v-col>
            <v-col md="1">
              <BaseSelect
                :label="$t('serial_no')"
                item-value="VAL"
                item-text="NAME"
                :lstData="serial_list"
                v-model="selected_serial"
              />
            </v-col>
            <v-col md="2">
              <BaseSelect
                :label="$t('decision')"
                item-value="VAL"
                item-text="NAME"
                :lstData="decision_list"
                v-model="selected_decision"
              ></BaseSelect>
            </v-col>
            <v-col md="2">
              <BaseInput :label="$t('customer')" v-model="customer" />
            </v-col>
            <v-col md="2">
              <BaseInput :label="$t('tax_no')" v-model="tax_no" />
            </v-col>
            <v-col md="1">
              <BaseInput :label="$t('invoice_no')" v-model="invoice_no" />
            </v-col>
            <v-col md="2">
              <BaseInput :label="$t('tax_key')" v-model="tax_key" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          outlined
          class="pa-2"
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
        >
          <v-row>
            <v-col cols="12">
              <BaseGridView
                ref="gridview"
                :header="this.headerGrid"
                :autoresize="false"
                :headertype="1"
                :height="limitHeight"
                sel_procedure="EI_SEL_6095150_DATA"
                :filter_paras="[
                  this.selected_company,
                  this.selected_type_date,
                  this.from_date,
                  this.to_date,
                  this.customer,
                  this.selected_biz,
                  this.selected_form_no,
                  this.selected_status,
                  this.selected_rate,
                  this.tax_invoice,
                  this.selected_invoice,
                  this.selected_serial,
                  this.invoice_no,
                  this.selected_decision,
                  this.tax_key,
                ]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",
  props: ["paras"],

  components: {
    DatePicker: () => import("@/components/control/DatePicker"),
  },

  data: () => ({
    company_list: [],
    headerGrid: [],
    selected_company: null,
    from_date: "",
    to_date: "",
    biz_list: [],
    selected_biz: "",
    form_no_list: [],
    selected_form_no: "",
    customer: "",
    status_list: [],
    selected_status: "",
    rate_list: [],
    selected_rate: "",
    tax_no: "",
    invoice_list: [],
    selected_invoice: "",
    vat_list: [],
    selected_vat: "",
    serial_list: [],
    selected_serial: "",
    invoice: "",
    decision_list: [],
    selected_decision: "",
    tax_key: "",
    invoice_no: "",
    tax_invoice: "",
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
    selected_type_date: "",
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
    selected_type_quarter: "0",
    month: "",
    year: "",
  }),
  async created() {
    await this.getListCodes("company");
    await this.getListCodes("form_no");
    await this.getListCodes("ei_status");
    await this.getListCodes("tax_rate");
    await this.getListCodes("invoice_type");
    await this.getListCodes("vat_type");
    await this.getListCodes("serial_no");
    await this.getListCodes("invoice_no");
    this.onSetHeader();
  },

  watch: {
    selected_company(val) {
      this.getListCodes("form_no");
      this.getListCodes("serial_no");
    },

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
          field: "STT",
          title: this.$t("no"),
          width: 50,
          alignment: "center",
          type: "text",
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "SIGN_DT",
          title: this.$t("issue_date"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "INVOICE_NO",
          title: this.$t("invoice_no"),
          alignment: "left",
          type: "text",
          width: 100,
        },
        {
          field: "EI_STATUS",
          title: this.$t("ei_status"),
          alignment: "left",
          type: "text",
          width: 100,
        },

        {
          field: "CUSTOMER_CD",
          title: this.$t("buyer_company_code"),
          alignment: "left",
          type: "text",
          width: 150,
        },
        {
          field: "CUSTOMER_NM",
          title: this.$t("buy_company_name"),
          alignment: "left",
          type: "text",
          width: 300,
        },
        {
          field: "TAX_CODE",
          title: this.$t("buyer_cpmpany_tax_code"),
          alignment: "left",
          type: "text",
          width: 200,
        },
        {
          field: "TOT_NET_TR_AMT",
          title: this.$t("net_amount"),
          alignment: "right",
          type: "number",
          width: 100,
          formatFloat: 0,
        },
        {
          field: "TAX_RATE",
          title: this.$t("tax_rate"),
          alignment: "right",
          type: "number",
          width: 100,
        },
        {
          field: "VAT_AMOUNT",
          title: this.$t("vat_amount"),
          alignment: "right",
          type: "number",
          width: 100,
          formatFloat: 0,
        },
        {
          field: "REMARK",
          title: this.$t("decription"),
          alignment: "left",
          type: "text",
          width: 250,
        },
        {
          field: "REMARK2",
          title: this.$t("remark"),
          alignment: "left",
          type: "text",
          width: 250,
        },
        {
          field: "EMAIL_ADDRESS",
          title: this.$t("email_address"),
          alignment: "left",
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
            selpro: "EI_SEL_6095150_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );

          break;

        case "form_no":
          const dso_form_list = {
            type: "list",
            selpro: "EI_SEL_6095150_FORM_NO",
            para: [this.selected_company],
          };
          this.form_no_list = await this._dsoCall(
            dso_form_list,
            "select",
            false
          );
          if (this.form_no_list != null) {
            this.selected_form_no = this.form_no_list[0].VAL;
          }
          break;
        case "ei_status":
          const dso_status_list = {
            type: "list",
            selpro: "EI_SEL_6095150_STATUS",
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
        case "tax_rate":
          const dso_rate_list = {
            type: "list",
            selpro: "EI_SEL_6095150_TAX_RATE",
            para: [this.selected_company],
          };
          this.rate_list = await this._dsoCall(dso_rate_list, "select", false);
          if (this.rate_list != null) {
            this.selected_rate = this.rate_list[0].VAL;
          }
          break;
        case "invoice_type":
          const dso_invoice_list = {
            type: "list",
            selpro: "EI_SEL_6095150_INV",
            para: [this.company],
          };
          this.invoice_list = await this._dsoCall(
            dso_invoice_list,
            "select",
            false
          );
          if (this.invoice_list != null) {
            this.selected_invoice = this.invoice_list[0].VAL;
          }
          break;
        case "vat_type":
          const dso_vat_type_list = {
            type: "list",
            selpro: "EI_SEL_6095150_VAT",
            para: [this.company],
          };
          this.vat_list = await this._dsoCall(
            dso_vat_type_list,
            "select",
            false
          );
          if (this.vat_list != null) {
            this.selected_vat = this.vat_list[0].VAL;
          }
          break;
        case "serial_no":
          const dso_serial_list = {
            type: "list",
            selpro: "EI_SEL_6095150_SERIAL_NO",
            para: [this.selected_company],
          };
          this.serial_list = await this._dsoCall(
            dso_serial_list,
            "select",
            false
          );
          if (this.serial_list != null) {
            this.selected_serial = this.serial_list[0].VAL;
          }
          break;
        case "invoice_no":
          const dso_decision_list = {
            type: "list",
            selpro: "EI_SEL_6095150_DECISION",
            para: [this.company],
          };
          this.decision_list = await this._dsoCall(
            dso_decision_list,
            "select",
            false
          );
          if (this.decision_list != null) {
            this.selected_decision = this.decision_list[0].VAL;
          }
          break;
      }
    },
    async onReport() {
      console.log(1);
      let report_path = "report/60/95/rpt_6095150.xlsx";
      let hiddenCols = [];
      let excel = [];
      excel = [
        {
          sheet: 1,
          // insertRange: [
          //   {
          //     range: "A1:V18",
          //     proc: "AC_RPT_6095150",
          //     params: [
          //       this.from_date,
          //       this.to_date,
          //       this.selected_company,
          //       this.selected_type_quarter
          //     ],
          //   }, //header
          // ],
          insertRows: [
            {
              sequence: "break",
              startRow: 4,
              proc: "AC_RPT_6095150",
              params: [
                this.selected_company,
                this.selected_type_date,
                this.from_date,
                this.to_date,
                this.customer,
                this.selected_biz,
                this.selected_form_no,
                this.selected_status,
                this.selected_rate,
                this.tax_invoice,
                this.selected_invoice,
                this.selected_serial,
                this.invoice_no,
                this.selected_decision,
                this.tax_key,
              ],
              dateColumns: [],
              stringColumns: [
                "STT",
                "FORM_NO",
                "SERIAL_NO",
                "SIGN_DT",
                "INVOICE_NO",
                "EI_STATUS",
                "CUSTOMER_CD",
                "CUSTOMER_NM",
                "TAX_CODE",
                "TOT_NET_TR_AMT",
                "TAX_RATE",
                "VAT_AMOUNT",
                "REMARK",
                "REMARK2",
                "EMAIL_ADDRESS",
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
