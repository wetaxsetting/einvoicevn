<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="4">
        <BaseSelect
          :label="$t('company')"
          v-model="company"
          :lstData="companyList"
          item-text="TEXT"
          item-value="PK"
        />
      </v-col>

      <v-col md="2">
        <BaseDatePicker
          :label="$t('date_year')"
          v-model="date_year"
          month
          today
        />
      </v-col>
      <v-col md="3">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" start />
      </v-col>
      <v-col md="3">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" today />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="2">
        <BaseSelect
          :label="$t('form_no')"
          v-model="form_no"
          item-value="VAL"
          item-text="NAME"
          :lstData="form_no_list"
          :text_all="$t('all')"
        />
      </v-col>
      <v-col md="2">
        <BaseSelect
          :label="$t('serial_no')"
          v-model="serial_no"
          :lstData="serial_List"
          item-text="NAME"
          item-value="VAL"
          :text_all="$t('all')"
        />
      </v-col>
      <v-col md="2">
        <BaseInput :label="$t('invoice_no')" v-model="invoiceNo" />
      </v-col>
      <v-col md="2">
        <BaseInput :label="$t('trand_code')" v-model="tranCode" />
      </v-col>
      <v-col md="2">
        <BaseInput :label="$t('cqt_code')" v-model="cqtCode" />
      </v-col>
      <v-col md="2" class="d-flex justify-end">
        <BaseButton
          icon_type="search"
          :btn_text="$t('search')"
          @onclick="onClickButton()"
        />
        <BaseButton
          icon_type="excel"
          :btn_text="$t('print')"
          @onclick="onReport()"
        />
      </v-col>
    </v-row>

  
    <v-row no-gutters align="center" justify="start" class="mb-2">
      <v-col cols="12">
        <BaseGridView
          ref="gridview"
          select_mode="Single"
          :max_height="limitHeight"
          column-resizing-mode="widget"
          sel_procedure="stacfrstac710019_s_01_node"
          :editable="false"
          :header="this.headerQQ"
          :filter_paras="[
            this.from_date,
            this.to_date,
            this.form_no,
            this.serial_no,
            this.invoiceNo,
            this.company,
            this.tranCode,
            this.cqtCode,
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
    this.selectedCompany = this.user.TCO_COMPANY_PK;
  },
  mounted() {
    this.onSetHeader();
  },
  computed: {
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 510;
      }
    },
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  watch: {
    date_year(val) {
      if (val) {
        this.from_date = val + "01";
        this.to_date = val + this._maxDateOfMonth(val);
      }
    },

    form_no(val) {
      this.getListCodes("serial_no");
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
          this.company = this.companyList[0].PK;
          break;
        case "form_no":
          const dso_form_no_list = {
            type: "list",
            selpro: "stacfrstac710019_s_06_node",
            para: [this.company],
          };

          this.form_no_list = await this._dsoCall(
            dso_form_no_list,
            "select",
            false
          );
          break;
        case "serial_no":
          const dso_serial_no_list = {
            type: "list",
            selpro: "stacfrstac710019_s_07_node",
            para: [this.company, this.form_no],
          };

          this.serial_List = await this._dsoCall(
            dso_serial_no_list,
            "select",
            false
          );
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
              dateColumns: ["INVOICE_DATE", "SIGN_DT", "CANCEL_DT"],
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
        let url = window.URL.createObjectURL(blob);
        window.open(url);
        this.salaryStatus = this.$t("complete");
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
            },
            {
              dataField: "CUS_NM",
              caption: this.$t("name"),
              allowEditing: false,
              dataType: "string",
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
          dataType: "date",
        },
        {
          dataField: "CANCEL_REASON",
          caption: this.$t("cancel_couse"),
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
