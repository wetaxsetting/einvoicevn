<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3" class="pl-4">
        <BaseSelect outlined :label="$t('company')" v-model="company" :lstData="companyList" item-text="TEXT" item-value="PK" />
      </v-col>

      <v-col md="1">
        <BaseDatePicker outlined :label="$t('date_year')" v-model="date_year" month today />
      </v-col>
      <v-col md="2">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" start />
      </v-col>
      <v-col md="2">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" today />
      </v-col>
      <v-col md="2" class="pl-4">
        <BaseSelect outlined :label="$t('form_no')" v-model="form_no" item-value="VAL" item-text="NAME" :lstData="form_no_list"/>
      </v-col>
      <v-col md="2">
        <BaseSelect outlined :label="$t('serial_no')" v-model="serial_no" :lstData="serial_List" item-text="NAME" item-value="VAL"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="3">
        <BaseInput outlined :label="$t('invoice_no')" v-model="invoiceNo" />
      </v-col>
      <v-col md="3">
        <BaseInput outlined :label="$t('trand_code')" v-model="tranCode" />
      </v-col>
      <v-col md="4">
        <BaseInput outlined :label="$t('cqt_code')" v-model="cqtCode" />
      </v-col>
      <v-col md="4" class="d-flex justify-end">
        <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton()" />
        <BaseButton icon_type="excel" :btn_text="$t('print')" @onclick="onReport()" />
      </v-col>
    </v-row>

    <v-row> </v-row>
    <v-row no-gutters align="center" justify="start" class="mb-2">
      <v-col cols="12">
        <BaseGridView ref="gridview" select_mode="Single" :maxheight="limitHeight" column-resizing-mode="widget"
          sel_procedure="EI_SEL_6095180_S_01_NC" :editable="false" :header="this.headerQQ" :filter_paras="[
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
    TCO_BUSPLACE_PK: "",
    companyList: [],
    company: "",
    mstData: "",
    companyFornno: "",
    serialno_formno_list: [],
    dateList: [],
    from_date: "20190101",
    form_no: "",
    to_date: "20220101",
    date: null,
    date_year: "",
    searchInput: null,
    limitHeight: [],
    headerQQ: [],
    invoiceNo: "",
    form_no_list: [],
    serial_List: [],
    gridview: [],
    serial_no: "",
    tranCode: "",
    cqtCode: "",
  }),

  async created() {
    await this.getListCodes("company");
    await this.getListCodes("form_no");
    await this.getListCodes("serial_no");
    //this.selectedCompany = this.user.PK;
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
    selectedCompany(val) {
      if (val) {
        this.search();
      }
    },
    date_year(val) {
      if (val) {
        this.from_date = val + "01";
        this.to_date = val + this._maxDateOfMonth(val);
      }
    },
    company(val) {
      this.getListCodes("form_no");
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
          if (this.companyList.length > 0) {
            this.company = this.companyList[0].PK;
          }
          break;

        case "form_no":
          const dso_form_no_list = {
            type: "list",
            selpro: "EI_SEL_6095180_05_FORM_NO",
            para: [this.company, this.from_date, this.to_date, this.form_no],
          };

          this.form_no_list = await this._dsoCall( dso_form_no_list, "select", false );
          if (this.form_no_list != null) {
            this.form_no = this.form_no_list[0].VAL;
          }
          break;
        case "serial_no": 
          const dso_serial_no_list = {
            type: "list",
            selpro: "EI_SEL_6095180_6_SERIAL_NO",
            para: [
              this.company,
              this.form_no,
              this.from_date,
              this.to_date,
              this.serial_no,
            ],
          };

          this.serial_List = await this._dsoCall(dso_serial_no_list, "select", false );
          this.serial_no = this.serial_List[0].VAL;
          break;
      }
    },
    // async getListCodes(pos) {
    //   const result = await this._getCompanyByUser(this.user.PK);

    //   if (result) {
    //     this.companyList = result;
    //     this.company = this.companyList[0].PK;
    //   }
    //   const dso_form_no_list = {
    //     type: "list",
    //     selpro: "AC_SEL_6095180_05_FORM_NO",
    //     para: [this.company, this.from_date, this.to_date, this.form_no],
    //   };

    //   this.form_no_list = await this._dsoCall(
    //     dso_form_no_list,
    //     "select",
    //     false
    //   );
    //   const dso_serial_no_list = {
    //     type: "list",
    //     selpro: "AC_SEL_6095180_6_SERIAL_NO",
    //     para: [
    //       this.company,
    //       this.form_no,
    //       this.from_date,
    //       this.to_date,
    //       this.serial_no,
    //     ],
    //   };

    //   this.serial_List = await this._dsoCall(
    //     dso_serial_no_list,
    //     "select",
    //     false
    //   );
    // },
    onClickButton(obj) {
      this.$refs.gridview.loadData();
    },
    async onReport() {
      console.log(1);
      let report_path = "report/60/95/rpt_6095180.xlsx";
      let hiddenCols = [];
      let excel = [];
      excel = [
        {
          sheet: 1,
          insertRange: [
            {
              range: "A1:Q7",
              proc: "EI_RPT_6095180_M",
              params: [
                this.from_date,
                this.to_date,
                this.form_no,
                this.serial_no,
                this.invoiceNo,
                this.company,
              ],
            }, //header
          ],
          insertRows: [
            {
              sequence: "break",
              startRow: 11,
              proc: "EI_RPT_6095180",
              params: [
                this.from_date,
                this.to_date,
                this.form_no,
                this.serial_no,
                this.invoiceNo,
                this.company,
              ],
              dateColumns: [
                "INVOICE_DATE",
                "CANCEL_DT",
                "SIGN_DT_ADJ",
              ],
              stringColumns: [
                "STT",
                "FORM_NO",
                "SERIAL_NO",
                "INVOICE_NO",
                "AMOUNT",
                "FORM_NO_ADJ",
                "SERIAL_NO_ADJ",
                "INVOICE_NO_ADJ",
                "INVOICE_DATE_ADJ",
                "AMOUNT_ADJ",
                "CUS_CD",
                "CUS_NM",
                "TAX_CODE",
                "ADDR",
                // "CRT_BY",
                "REL_BY",
                "REMARK",
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
        saveAs(blob, ["6095180_E_invoice Replace List"]);
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
          dataField: "STT",
          caption: this.$t("no"),
          allowEditing: false,
          alignment: "right",
        },

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
              alignment: "right",
            },
            {
              dataField: "SIGN_DT",
              caption: this.$t("sign_date"),
              allowEditing: false,
              dataType: "string",
              alignment: "right",
            },
            {
              dataField: "AMOUNT",
              caption: this.$t("amount"),
              allowEditing: false,
              //dataType: "number",
              alignment: "right",
              dataType: "number",
              formatFloat: 0,
              summaryType: "sum",
            },
          ],
        },
        {
          caption: "Invoice (Reaplace)",
          columns: [
            {
              dataField: "FORM_NO_ADJ",
              caption: this.$t("form_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "SERIAL_NO_ADJ",
              caption: this.$t("serial_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "INVOICE_NO_ADJ",
              caption: this.$t("invoice_no"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "INVOICE_DATE_ADJ",
              caption: this.$t("invoice_date"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",

            },
            {
              dataField: "SIGN_DT_ADJ",
              caption: this.$t("sign_date"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "AMOUNT_ADJ ",
              caption: this.$t("amount"),
              allowEditing: false,
              dataType: "string",
              alignment: "center",
            },
            {
              dataField: "CUS_CD",
              caption: this.$t("tax_code"),
              allowEditing: false,
              dataType: "num",
              alignment: "left",
            },
            {
              dataField: "CUS_NM",
              caption: this.$t("custome_code"),
              allowEditing: false,
              dataType: "string",
            },
            {
              dataField: "TAX_CODE",
              caption: this.$t("tax_code"),
              allowEditing: false,
              dataType: "string",
              dataType: "string",
            },
            {
              dataField: "ADDR",
              caption: this.$t("address"),
              allowEditing: false,
              dataType: "string",
              alignment: "left",
            },
          ],
        },
        {
          dataField: "REL_BY",
          caption: this.$t("replace_by"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "REL_DT",
          caption: this.$t("replace_date"),
          allowEditing: false,
        },
        {
          dataField: "CQT_CODE",
          caption: this.$t("cqt_code"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "TRAND_CODE",
          caption: this.$t("trand_code"),
          allowEditing: false,
          dataType: "string",
          visible:false 
        },
        {
          dataField: "REMARK",
          caption: this.$t("remark"),
          allowEditing: false,
          alignment: "left",
        },
      ];
      this.headerQQ = headerobj;
    },
  },
};
</script>
