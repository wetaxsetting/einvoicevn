<template>
  <v-container fluid v-resize="onResize" class="pa-0">
    <v-row md="12">
      <v-col md="4" class="pl-5">
        <BaseSelect outlined :label="$t('company')" v-model="company" :lstData="companyList" item-text="TEXT" item-value="PK" />
      </v-col>
      <v-col md="2">
        <BaseSelect outlined :label="$t('date')" :lstData="date_type_list" v-model="selected_date_type" item-value="VAL"
          item-text="NAME" filter_off />
      </v-col>
      <!-- month -->
      <v-col md="2" v-show="selected_date_type == '0'">
        <BaseDatePicker outlined :label="$t('month')" v-model="month" month />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '0'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '0'" cl>
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
       <!-- ascurrent -->
       <v-col md="2" v-show="selected_date_type == '1'"> </v-col>
      <v-col md="2" v-show="selected_date_type == '1'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '1'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- year -->
      <v-col md="2" v-show="selected_date_type == '2'">
        <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '2'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '2'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- Quarter -->
      <v-col md="1" v-show="selected_date_type == '3'">
        <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="1" v-show="selected_date_type == '3'">
        <BaseSelect outlined :label="$t('type_quarter')" v-model="selectTypeQuarter" :lstData="lstTypeQuarter" item-text="NAME"
          item-value="VAL" filter_off />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '3'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_date_type == '3'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
    </v-row>
    <v-row md="12">
      <v-col md="2" class="pl-5">
        <BaseSelect outlined :label="$t('form_no')" v-model="form_no" item-value="VAL" item-text="NAME" :lstData="form_no_list" />
      </v-col>
      <v-col md="1">
        <BaseSelect outlined :label="$t('serial_no')" v-model="serial_no" :lstData="serial_List" item-text="NAME" item-value="VAL"
          :text_all="$t('all')" />
      </v-col>
      <v-col md="1">
        <BaseSelect outlined :label="$t('invoice_type')" v-model="invoice_type" :lstData="invoiceType_List" item-text="NAME"
          item-value="CODE" />
      </v-col>
      <v-col md="2">
        <BaseInput outlined :label="$t('invoice_no')" v-model="invoiceNo" />
      </v-col>
      <v-col md="2">
        <BaseInput outlined :label="$t('trade_code')" v-model="tranCode" />
      </v-col>
      <v-col md="2">
        <BaseInput outlined :label="$t('cqt_code')" v-model="cqtCode" />
      </v-col>
      <v-col md="2" class="d-flex justify-end">
        <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton()" />
        <BaseButton icon_type="excel" :btn_text="$t('print')" @onclick="onReport()" />
      </v-col>
    </v-row>
    <v-row no-gutters align="center" justify="start" class="mb-2">
      <v-col cols="12">
        <BaseGridView ref="gridview" select_mode="Single" :max_height="limitHeight" column-resizing-mode="widget"
          sel_procedure="AC_SEL_6095160_S_NOCACHE" :editable="false" :header="this.headerQQ" :filter_paras="[
            this.from_date,
            this.to_date,
            this.form_no,
            this.serial_no,
            this.invoiceNo,
            this.company,
            this.tranCode,
            this.cqtCode,
            this.invoice_type
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
    companyList: [],
    company: "",
    form_no: "1",
    date_year: "",
    searchInput: null,
    limitHeight: [],
    headerQQ: [],
    invoiceNo: "",
    tranCode: "",
    cqtCode: "",
    form_no_list: [],
    serial_List: [],
    invoiceType_List: [],

    gridview: [],
    serial_no: "C22TCH",
    invoice_type: "",

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
    month: "",
    from_date: "",
    to_date: "",
    year: "",
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
  }),

  async created() {
    await this.initDataList();
    this.onSetHeader();
    this.selectedCompany = this.user.TCO_COMPANY_PK;
  },
  mounted() {
    
  },
  computed: {
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 600;
      }
    },
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  watch: {
    // date_year(val) {
    //   if (val) {
    //     this.from_date = val + "01";
    //     this.to_date = val + this._maxDateOfMonth(val);
    //   }
    // },
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
    form_no(val) {
      this.getListCodes("serial_no");
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
  methods: {
    async initDataList() {
      const company = await this._callProcedure("AC_SEL_6095160_COMPANY", [this.user.PK]);
      if (company.length > 0) {
        this.companyList = company;
      }

      const results = await this._getCommonCode2(["ACEI0020"], this.user.TCO_COMPANY_PK)
      this.invoiceType_List = results[0];
      // this.invoiceType_List  = this.invoiceType_List.filter(status => status.CODE !== "0");

      const dso_form_no_list = {
        type: "list",
        selpro: "AC_SEL_6095160_FORM_NO",
        para: [this.company],
      };
      this.form_no_list = await this._dsoCall(dso_form_no_list, "select", false);

      const dso_serial_no_list = {
            type: "list",
            selpro: "AC_SEL_6095160_SERIAL_NO",
            para: [this.company, this.form_no],
          };
      this.serial_List = await this._dsoCall( dso_serial_no_list,"select",false);
    },

    onClickButton(obj) {
      this.$refs.gridview.loadData();
    },
    async onReport() {
      console.log(1);
      let report_path = "report/60/95/rpt_6095160.xlsx";
      let hiddenCols = [];
      let excel = [];
      // this.$refs.gridview.exportExcel();
      excel = [
        {
          sheet: 1,
          insertRange: [
            {
              range: "A1:N7",
              proc: "ac_rpt_6095160_m",
              params: [
                this.from_date,
                this.to_date,
                this.form_no,
                this.serial_no,
                this.invoiceNo,
                this.company,
                this.invoice_type
                // this.tranCode,
                // this.cqtCode,
              ],
            }, //header
          ],
          insertRows: [
            {
              sequence: "break",
              startRow: 10,
              proc: "AC_RPT_6095160",
              params: [
                this.from_date,
                this.to_date,
                this.form_no,
                this.serial_no,
                this.invoiceNo,
                this.company,
                this.tranCode,
                this.cqtCode,
              ],
              dateColumns: ["INVOICE_DATE"],
              stringColumns: [
                "ORDERBY_NO",
                "FORM_NO",
                "SERIAL_NO",
                "INVOICE_NO",
                "AMOUNT",
                "CUS_CD",
                "CUS_NM",
                "TAX_CODE",
                "ADDR",
                "CANCEL_BY",
                "CANCEL_REASON",
                //"CQT_MAGD",
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

        saveAs(blob, ["6095160_E_invoice Cancel List"]);
        // let url = window.URL.createObjectURL(blob);
        // window.open(url);
        // this.salaryStatus = this.$t("complete");
        // console.log('res',  res);
        // console.log('url',  url);
      } else {
        //this.showNotification( "danger", this.$t("fail_to_export_report"),  "",  4000 );
        this.salaryStatus = this.$t("fail_to_export_report");
      }
    },
    onSetHeader() {
      let headerobj = [
        {
          dataField: "ORDERBY_NO",
          caption: this.$t("no"),
          allowEditing: false,
          alignment: "right",
          width: "40"
        },
        // {
        //   dataField: "CUST_NAME",
        //   caption: this.$t("customer"),
        //   allowEditing: false
        // },
        {
          caption: "Invoice(Original)",
          columns: [
            {
              dataField: "FORM_NO",
              caption: this.$t("form_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
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
              caption: this.$t("invoice_NO"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "INVOICE_DATE",
              caption: this.$t("invoice_date"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
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
              allowEditing: false,
              alignment: "right",
              dataType: "number",
              formatFloat: 2,
              summaryType: "sum",
            },
          ],
        },
        // {
        //   dataField: "GD_DATE",
        //   caption: this.$t("ex_factory_date"),
        //   allowEditing: false,
        //   dataType:"date"
        // },
        {
          caption: "Customer",
          columns: [
            {
              dataField: "CUS_CD",
              caption: this.$t("code"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
              width: "80"
            },
            {
              dataField: "CUS_NM",
              caption: this.$t("name"),
              allowEditing: false,
              dataType: "string",
              width: "120"
            },
            {
              dataField: "TAX_CODE",
              caption: this.$t("tax _code"),
              allowEditing: false,
              dataType: "num",
              alignment: "center",
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
          dataField: "CANCEL_BY",
          caption: this.$t("cancle_by"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "CANCEL_DT",
          caption: this.$t("cancle_date"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "CANCEL_REASON",
          caption: this.$t("cancel_cause"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "CQT_MCCQT_ID",
          caption: this.$t("cqt_code"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "CQT_MAGD",
          caption: this.$t("trade_code "),
          allowEditing: false,
        },
        {
          dataField: "CQT_MAGD_CANCEL",
          caption: this.$t("trade_code_cancel"),
          allowEditing: false,
          dataType: "string",
          alignment: "center",
        },
        {
          dataField: "CQT_STATUS_GE",
          caption: this.$t("cancel_cause"),
          allowEditing: false,
        },
      ];
      this.headerQQ = headerobj;
    },
  },
};
</script>
