<template>
<v-container fluid class="pa-0" v-resize="onResize">
  <v-row class="pt-2" dense>
    <v-col md="4" class="pl-3 pr-2">
      <BaseSelect outlined :label="$t('company')" item-text="NAME" item-value="VAL" filter_off :lstData="companyList" v-model="company" />
    </v-col>
    <!-- <v-col md="1">
      </v-col> -->
    <v-col md="1" class="pl-3 pr-2">
      <BaseSelect outlined :label="$t('choose_type_date')" v-model="itemChooseTypeDate" :lstData="lstChooseTypeDate" item-text="NAME" item-value="VAL" filter_off />
    </v-col>
    <!-- <v-col md="1">
      </v-col> -->
    <!-- Monthly -->
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '0'">
      <BaseDatePicker outlined :label="$t('month')" v-model="month" month />
    </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '0'">
      <BaseDatePicker outlined :label="$t('from_date')" v-model="fromDate" />
    </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '0'">
      <BaseDatePicker outlined :label="$t('to_date')" v-model="toDate" />
    </v-col>
    <!-- As current -->
    <v-col md="2"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '1'"> </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '1'">
      <BaseDatePicker outlined :label="$t('from_date')" v-model="fromDate" />
    </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '1'">
      <BaseDatePicker outlined :label="$t('to_date')" v-model="toDate" />
    </v-col>
    <!-- Year -->

    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '2'">
      <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
    </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '2'">
      <BaseDatePicker outlined :label="$t('from_date')" v-model="fromDate" />
    </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '2'">
      <BaseDatePicker outlined :label="$t('to_date')" v-model="toDate" />
    </v-col>

    <!-- Quarter -->

    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '3'">
      <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
    </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '3'">
      <BaseSelect outlined :label="$t('choose_type_quarter')" v-model="itemChooseTypeQuarter" :lstData="lstChooseTypeQuarter" item-text="NAME" item-value="VAL" filter_off />
    </v-col>
    <v-col md="1"  class="pl-3 pr-2" v-show="itemChooseTypeDate == '3'">
      <BaseDatePicker outlined :label="$t('from_date')" v-model="fromDate" />
    </v-col>
    <v-col md="1" class="pl-3 pr-2" v-show="itemChooseTypeDate == '3'">
      <BaseDatePicker outlined :label="$t('to_date')" v-model="toDate" />
    </v-col>
  </v-row>

  <v-row class="pt-1" dense>
    <v-col md="2" class="pl-3 pr-2">
      <BaseSelect outlined :label="$t('form_no')" item-text="NAME" item-value="VAL" filter_off :lstData="formList" v-model="lstForm" />
    </v-col>
    <!-- <v-col md="1">
      </v-col> -->
    <v-col md="2" class="pl-3 pr-2">
      <BaseSelect outlined :label="$t('serial_no')" item-text="NAME" item-value="VAL" filter_off :lstData="serialList" v-model="lstSerial" />
    </v-col>
    <v-col md="2" class="pl-3 pr-2">
      <BaseInput outlined :label="$t('invoice_no')" v-model="lstInvoiceNo" @keyPressEnter="onClickButton()" />
    </v-col>
    <v-col md="2" class="pl-3 pr-2">
      <BaseInput outlined :label="$t('trade_code')" v-model="lstTradeCode" @keyPressEnter="onClickButton()" />
    </v-col>
    <v-col md="2" class="pl-3 pr-2">
      <BaseInput outlined :label="$t('cqt_code')" v-model="lstCQTCode" @keyPressEnter="onClickButton()" />
    </v-col>
    <v-col md="2" class="d-flex justify-end">
      <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton()" />
      <BaseButton icon_type="print" :btn_text="$t('print')" @onclick="onReport" />
    </v-col>
  </v-row>

  <v-row no-gutters align="center" justify="start" class="pt-3">
    <v-col cols="12">
      <BaseGridView column-resizing-mode="widget" ref="gridview" :auto_load="false" select_mode="Single" :max_height="limitHeight" :header="this.headerGrid" sel_procedure="AC_SEL_6095170_1" :filter_paras="[
            this.fromDate,
            this.toDate,
            this.lstForm,
            this.lstSerial,
            this.lstInvoiceNo,
            this.lstTradeCode,
            this.lstCQTCode,
            this.company,
          ]" />
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  components: {
    DatePicker: () => import("@/components/control/DatePicker"),
  },
  data: () => ({
    companyList: [],
    company: null,
    headerGrid: [],
    lstCompany: [],
    txtSerialNo: "",
    lstStatus: "",
    selTypeDate: "0",
    fromDate: "",
    toDate: "",
    formList: [],
    lstForm: "",
    serialList: [],
    lstSerial: "",
    lstInvoiceNo: "",
    lstTradeCode: "",
    lstCQTCode: "",
    invoice_no: "",
    lstChooseTypeDate: [{
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
    itemChooseTypeDate: "0",
    lstChooseTypeQuarter: [{
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
    itemChooseTypeQuarter: "0",
    month: "",
    year: "",
  }),

  async created() {
    await this.getListCodes("company");
    await this.getListCodes("form_no");
    await this.getListCodes("serial_no");
    this.onSetHeader();
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
  watch: {
    company(val) {
      this.getListCodes("form_no");
      // this.getListCodes("serial_no");
    },
    lstForm(val) {
      this.getListCodes("serial_no");
    },
    fromDate(val){
      this.getListCodes("form_no");
      this.getListCodes("serial_no");
    },
    toDate(val){
      this.getListCodes("form_no");
      this.getListCodes("serial_no");
    },
    itemChooseTypeDate(val) {
      if (val == "0" || val == "2") {
        this.fromDate = "";
        this.toDate = "";
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
        this.fromDate = this.year + "0101";
        this.toDate = this.year + "1231";
      }
      if (this.month != "" && val == "0") {
        this.fromDate = this.month + "01";
        this.toDate = this.month + this._maxDateOfMonth(this.fromDate);
      }
      if (val == "3") {
        if (this.itemChooseTypeQuarter == "0") {
          this.fromDate = this.year + "0101";
          this.toDate = this.year + "0331";
        }
        if (this.itemChooseTypeQuarter == "1") {
          this.fromDate = this.year + "0401";
          this.toDate = this.year + "0630";
        }
        if (this.itemChooseTypeQuarter == "2") {
          this.fromDate = this.year + "0701";
          this.toDate = this.year + "0930";
        }
        if (this.itemChooseTypeQuarter == "3") {
          this.fromDate = this.year + "1001";
          this.toDate = this.year + "1231";
        }
      }
    },
    month(val) {
      if (val) {
        this.fromDate = val + "01";
        this.toDate = val + this._maxDateOfMonth(val);
      }
    },
    year(val) {
      if (val) {
        if (this.itemChooseTypeDate == "2") {
          this.fromDate = this.year + "0101";
          this.toDate = this.year + "1231";
        }
        if (this.itemChooseTypeDate == "3") {
          if (this.itemChooseTypeQuarter == "0") {
            this.fromDate = this.year + "0101";
            this.toDate = this.year + "0331";
          }
          if (this.itemChooseTypeQuarter == "1") {
            this.fromDate = this.year + "0401";
            this.toDate = this.year + "0630";
          }
          if (this.itemChooseTypeQuarter == "2") {
            this.fromDate = this.year + "0701";
            this.toDate = this.year + "0930";
          }
          if (this.itemChooseTypeQuarter == "3") {
            this.fromDate = this.year + "1001";
            this.toDate = this.year + "1231";
          }
        }
      }
    },
    itemChooseTypeQuarter(val) {
      switch (val) {
        case "0":
          this.fromDate = this.year + "0101";
          this.toDate = this.year + "0331";
          break;
        case "1":
          this.fromDate = this.year + "0401";
          this.toDate = this.year + "0630";
          break;
        case "2":
          this.fromDate = this.year + "0701";
          this.toDate = this.year + "0930";
          break;
        case "3":
          this.fromDate = this.year + "1001";
          this.toDate = this.year + "1231";
          break;
      }
    },

  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.8;
      }
    },
  },

  methods: {
    onClickButton() {
      this.$refs.gridview.loadData();
    },
    onClickExport(obj) {
      this.$refs.gridview.exportExcel();
    },

    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "AC_SEL_6095170_COM",
            para: [this.user.PK],
          };
          this.companyList = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );
           if (this.companyList.length > 0) {}
          this.company = this.companyList[0].PK;
          break;

        case "form_no":
          const dso_form_list = {
            type: "list",
            selpro: "AC_SEL_6095170_FORM_NO",
            para: [this.company, this.fromDate, this.toDate],
          };
          this.formList = await this._dsoCall(dso_form_list, "select", false);
          if (this.formList != null) {
            this.lstForm = this.formList[0].VAL;
          }
          break;

        case "serial_no":
          const dso_serial_list = {
            type: "list",
            selpro: "AC_SEL_6095170_SERIAL_NO",
            para: [this.company, this.lstForm],
          };
          this.serialList = await this._dsoCall(
            dso_serial_list,
            "select",
            false
          );
          this.lstSerial = this.serialList[0].VAL;
          break;
      }
    },
    async onReport() {
      let report_path = "report/60/95/rpt_6095170_1.xlsx";
      let hiddenCols = [];
      let excel = [];
      // this.$refs.gridview.exportExcel();
      excel = [
        {
          sheet: 1,
          insertRange: [
            {
               range: "A1:Q7",
                    proc: "AC_RPT_6095170_1",
                    params: [
                      this.fromDate,
                      this.toDate,
                      this.lstForm,
                      this.lstSerial,
                      this.lstInvoiceNo,
                      this.company,
                    ],
            }, //header
          ],
           insertRows: [{
                  sequence: "break",
                  startRow: 11,
                  proc: "AC_RPT_6095170_2",
                  params: [
                    this.fromDate,
                    this.toDate,
                    this.lstForm,
                    this.lstSerial,
                    this.lstInvoiceNo,
                    this.company,
                  ],
                  dateColumns: [
                    "INVOICE_DATE_ADJ",
                  ],
                  stringColumns: [
                    "ORDERBY_NO",
                    "FORM_NO",
                    "SERIAL_NO",
                    "INVOICE_NO",
                    "INVOICE_DATE",
                    "SIGN_DT",
                    "AMOUNT",
                    "FORM_NO_ADJ",
                    "SERIAL_NO_ADJ",
                    "INVOICE_DATE_ADJ",
                    "INVOICE_NO_ADJ",
                    "SIGN_DT_ADJ",
                    "AMOUNT_ADJ",
                    "CUS_CD",
                    "CUS_NM",
                    "TAX_CODE",
                    "ADDR",
                    "ADJ_BY",
                    "CANCEL_DT",
                    "REMARK",
                  ],
                }, ],
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
        saveAs(blob, ["6095170_E_invoice Adjusted List"]);
        // let url = window.URL.createObjectURL(blob);
        // window.open(url);
        // this.salaryStatus = this.$t("complete");
      } else {
        //this.showNotification( "danger", this.$t("fail_to_export_report"),  "",  4000 );
        this.salaryStatus = this.$t("fail_to_export_report");
      }
    },
    onSetHeader() {
      let headerObj = [{
          dataField: "ORDERBY_NO",
          allowEditing: false,
          caption: this.$t("no"),
        },
        {
          caption: this.$t("invoice_original"),
          columns: [{
              dataField: "FORM_NO",
              caption: this.$t("form_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "right",
            },
            {
              dataField: "SERIAL_NO",
              caption: this.$t("serial_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "INVOICE_NO",
              caption: this.$t("invoice_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "right",
            },
            {
              dataField: "INVOICE_DATE",
              caption: this.$t("invoice_date"),
              allowEditing: false,
              dataType: "string",
            },
            {
              dataField: "SIGN_DT",
              caption: this.$t("sign_date"),
              allowEditing: false,
              dataType: "string",
            },
            {
              dataField: "AMOUNT",
              caption: this.$t("amount"),
              cssClass: "cell-align-right",
              //allowEditing: false,
              dataType: "number",
              formatFloat: 0,
            },
          ],
        },
        {
          caption: this.$t("invoice_adjust"),
          columns: [{
              dataField: "FORM_NO_ADJ",
              caption: this.$t("form_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "right",
            },
            {
              dataField: "SERIAL_NO_ADJ",
              caption: this.$t("serial_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "INVOICE_DATE_ADJ",
              caption: this.$t("invoice_date"),
              allowEditing: false,
              dataType: "string",
              alignment: "right",
            },
            {
              dataField: "INVOICE_NO_ADJ",
              caption: this.$t("invoice_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "right",
            },
            {
              dataField: "SIGN_DT_ADJ",
              caption: this.$t("sign_date"),
              allowEditing: false,
              dataType: "string",
            },
            {
              dataField: "AMOUNT_ADJ",
              caption: this.$t("amount"),
              cssClass: "cell-align-right",
              allowEditing: false,
              dataType: "number",
              formatFloat: 0,
            },
            {
              dataField: "CUS_CD",
              caption: this.$t("customer_code"),
              allowEditing: false,
              dataType: "string",
            },
            {
              dataField: "CUS_NM",
              caption: this.$t("customer_name"),
              allowEditing: false,
              dataType: "string",
            },
            {
              dataField: "TAX_CODE",
              caption: this.$t("tax_code"),
              allowEditing: false,
              dataType: "string",
            },
            {
              dataField: "ADDR",
              caption: this.$t("address"),
              allowEditing: false,
              dataType: "string",
            },
          ],
        },
        {
          dataField: "ADJ_BY",
          width: 0,
          caption: this.$t("adjust_by"),
        },
        {
          dataField: "ADJ_DT",
          width: 0,
          caption: this.$t("adjust_date"),
        },
        {
          dataField: "REMARK2",
          width: 0,
          caption: this.$t("remark"),
        },
        {
          dataField: "CQT_MAGD",
          caption: this.$t("trand_code"),
          allowEditing: false,
        },
      ];
      this.headerGrid = headerObj;
    },
  },
};
</script>
