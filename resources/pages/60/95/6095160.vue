<template>
  <v-container fluid v-resize="onResize" class="pa-0">
    <v-row dense>
    <v-row md="12">
      <v-col md="3" class="pl-5">
        <BaseSelect outlined :label="$t('company')" v-model="company" :lstData="companyList" item-text="TEXT"
          item-value="PK" />
      </v-col>
      <v-col md="1" class="pl-3 pr-2">
        <BaseDatePicker outlined :label="$t('date_year')" v-model="date_year" month today />
      </v-col>
      <v-col md="1" class="pl-3 pr-2">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" start  />
      </v-col>
      <v-col md="1" class="pl-3 pr-2">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" today />
      </v-col>
      <v-col md="2">
        <BaseSelect outlined :label="$t('form_no')" v-model="form_no" item-value="VAL" item-text="NAME"
          :lstData="form_no_list" :text_all="$t('all')" />
      </v-col>
      <v-col md="2" class="pr-5">
        <BaseSelect outlined :label="$t('serial_no')" v-model="serial_no" :lstData="serial_List" item-text="NAME"
          item-value="VAL" :text_all="$t('all')" />
      </v-col>
      <v-col md="2" class="d-flex justify-end pr-3">
        <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton()" />
        <BaseButton icon_type="excel" :btn_text="$t('print')" @onclick="onReport()" />
      </v-col>
    </v-row>
    <v-row md="12">
      <v-col md="3" class="pl-5">
        <BaseInput outlined :label="$t('invoice_no')" v-model="invoiceNo" />
      </v-col>
      <v-col md="3" class="pl-3 pr-2">
        <BaseInput outlined :label="$t('trand_code')" v-model="tranCode" />
      </v-col>
      <v-col md="2">
        <BaseInput outlined :label="$t('cqt_code')" v-model="cqtCode" />
      </v-col>
      
    </v-row>
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
    mstData: "",
    companyFornno: "",
    serialno_formno_list: [],
    dateList: [],
    from_date: "",
    form_no: "",
    to_date: "",
    date: null,
    date_year: "",
    searchInput: null,
    limitHeight: [],
    headerQQ: [],
    invoiceNo: "",
    tranCode: "",
    cqtCode: "",
    form_no_list: [],
    serial_List: [],

    gridview: [],
    serial_no: "",
  }),

  async created() {
    await this.getListCodes("company");
    await this.getListCodes("form_no");
    await this.getListCodes("serial_no");
    // this.company = this.user.TCO_COMPANY_PK;
  },
  mounted() {
    this.onSetHeader();
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
    company(val){
      this.getListCodes("form_no");
    },
    form_no(val){
      this.getListCodes("serial_no");
    },
    from_date(val){
      this.getListCodes("form_no");
      this.getListCodes("serial_no");
    },
    to_date(val){
      this.getListCodes("form_no");
      this.getListCodes("serial_no");
    },
    date_year(val) {
      if (val) {
        this.from_date = val + "01";
        this.to_date = val + this._maxDateOfMonth(val);
      }
    },
  },
  methods: {
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "SYS_SEL_LIST_COMPANY",
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
          const dso_form_no_list = {
            type: "list",
            selpro: "AC_SEL_6095160_FORM_NO",
            para: [this.company, this.from_date, this.to_date],
          };
          this.form_no_list = await this._dsoCall(dso_form_no_list, "select",false);
          if (this.form_no_list != null) {
            this.form_no = this.form_no_list[0].VAL;
          }
          break;
        case "serial_no":
          const dso_serial_no_list = {
            type: "list",
            selpro: "AC_SEL_6095160_SERIAL_NO",
            para: [this.company, this.form_no],
          };
          this.serial_List = await this._dsoCall(dso_serial_no_list, "select",false);
          
            this.serial_no = this.serial_List[0].VAL;
          break;
      }
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
              dateColumns: ["INVOICE_DATE", ],
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
        saveAs(blob, ["6095160_E_invoice Cancelled List"]);
        // let url = window.URL.createObjectURL(blob);
        // window.open(url);
        // this.salaryStatus = this.$t("complete");
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
          caption: this.$t("cancel_couse"),
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
          caption: this.$t("trand_code "),
          allowEditing: false,
        },
      ];
      this.headerQQ = headerobj;
    },
  },
};
</script>
