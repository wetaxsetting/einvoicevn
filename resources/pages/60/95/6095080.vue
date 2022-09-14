<template>
  <v-container fluid class="pa-0">
    <v-row class="pt-1" dense>
      <v-col md="4">
        <BaseSelect
          :label="$t('company')"
          item-text="NAME"
          item-value="VAL"
          filter_off
          :lstData="company_list"
          v-model="selected_company"
        />
      </v-col>
      <v-col md="1">
        <BaseInput :label="$t('invoice_no')" v-model="txtInvoiceNo" />
      </v-col>
      <v-col md="2">
        <BaseSelect
          :label="$t('form_no')"
          item-text="NAME"
          item-value="VAL"
          filter_off
          :lstData="form_no_list"
          v-model="selected_form_no"
        />
      </v-col>
      <v-col md="2">
        <BaseSelect
          :label="$t('serial_no')"
          item-text="NAME"
          item-value="VAL"
          filter_off
          :lstData="serial_no_list"
          v-model="selected_serial_no"
        />
      </v-col>
      <!-- <v-col md="1">
        <BaseButton icon_type="search" :btn_text="$t('xml')" />
      </v-col> -->
      <v-col md="1">
        <BaseButton
          icon_type="search"
          :btn_text="$t('search')"
          @onclick="funcSearch()"
        />
      </v-col>
    </v-row>

    <v-row class="pt-1" dense>
      <v-col md="2">
        <BaseDatePicker :label="$t('from_date')" v-model="fromDate" start />
      </v-col>
      <v-col md="2">
        <BaseDatePicker :label="$t('to_date')" v-model="toDate" end />
      </v-col>
      <v-col md="2">
        <BaseSelect
          :label="$t('status')"
          v-model="selected_status"
          :lstData="status_list"
          item-text="NAME"
          item-value="VAL"
          filter_off
        />
      </v-col>
      <v-col md="1">
        <BaseInput :label="$t('partnet')" v-model="partner" />
      </v-col>
      <v-col md="2">
        <BaseSelect
          :label="$t('trading_type')"
          v-model="selected_trading_type"
          :lstData="trading_type_list"
          item-text="NAME"
          item-value="VAL"
          filter_off
        />
      </v-col>
      <v-col md="1">
        <BaseButton :btn_text="$t('preview')"  @onclick="onPreview" :disabled="isProcessing" />
      </v-col>
      <!-- <v-col md="1">
        <BaseButton
          icon_type="print"
          :btn_text="$t('print')"
          @onclick="onClickButton()"
        />
      </v-col> -->
      <v-col md="1">
        <BaseButton :btn_text="$t('invoice_sign')" />
      </v-col>
    </v-row>

    <v-row no-gutters align="center" justify="start" class="mb-2">
      <v-col cols="12">
        <BaseGridView
          column-resizing-mode="widget"
          ref="gridview"
          :auto_load="false"
          select_mode="Single"
          :max_height="limitHeight"
          :header="this.headerGrid"
           @cellClick="onCellClick"
          sel_procedure="STACFRSTAC710001_V3_S_01_TRG"
          :filter_paras="[
            this.selected_company,
            this.txtInvoiceNo,
            this.selected_form_no,
            this.selected_serial_no,
            this.fromDate,
            this.toDate,
            this.selected_status,
            this.txtPartner,
            this.selected_trading_type,
          ]"
        />
      </v-col>
    </v-row>
    
        <view-einvoice-pdf-dialog
      ref="ViewEInvoicePDFDialog"
      :src_pdfUrl="pdfUrl"
    ></view-einvoice-pdf-dialog>
  </v-container>
</template>

<script>
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  layout: "default",
  middleware: "user",

  components: {
     "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog ,
    DatePicker: () => import("@/components/control/DatePicker"),
  },
  data: () => ({
    company_list: [],
    selected_company: null,
    txtInvoiceNo: "",
    form_no_list: [],
    selected_form_no: "",
    serial_no_list: [],
    selected_serial_no: "",
    fromDate: "",
    toDate: "",
    status_list: [],
    selected_status: "",
    txtPartner: "",
    trading_type_list: [],
    selected_trading_type: "",
    headerGrid: [],

pdfUrl: "",
    tei_einvoice_m_pk_row:""
  }),

  async created() {
    await this.getListCodes();
  },
  mounted() {
    this.onSetHeader();
  },
  watch: {
    async selected_company(val) {
      const dso_form_list = {
        type: "list",
        selpro: "AC_SEL_6095080_FORM_NO",
        para: [this.selected_company],
      };
      const checkFormNo = await this._dsoCall(dso_form_list, "select", false);
      if (checkFormNo != null) {
        if (checkFormNo.length > 0) {
          this.form_no_list = checkFormNo;
          this.selected_form_no = this.form_no_list[0].VAL;
        }
      }
    },
    async selected_form_no(val) {
      const dso_serial_list = {
        type: "list",
        selpro: "AC_SEL_6095080_SERIAL_NO",
        para: [this.selected_company, this.selected_form_no],
      };
      const checkSerialNo = await this._dsoCall(
        dso_serial_list,
        "select",
        false
      );
      if (checkSerialNo != null) {
        if (checkSerialNo.length > 0) {
          this.serial_no_list = checkSerialNo;
          this.selected_serial_no = this.serial_no_list[0].VAL;
        }
      }
    },
    // selected_status(val) {
    //   // console.log(`${new Date().getTime()} val=`, val)
    //   if (val == 1) {
    //     this.offInvoiceSign = true;
    //   } else {
    //     this.offInvoiceSign = false;
    //   }
    // },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 570;
      }
    }, // this.windowHeight },
  },

  methods: {
       async onPreview(){
      this.isProcessing=true
      this.pdfUrl = await this.pdfUrlGetter(this.tei_einvoice_m_pk_row);
      this.$nextTick(() => {
        this.isProcessing=false
        this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      });
    },
     async pdfUrlGetter(pk){
     const pdfUrlExcel = await this.getEinvoice(this,pk)
     return pdfUrlExcel
    },
        async onCellClick({ column, data, rowIndex, rowType }) {
       this.tei_einvoice_m_pk_row=data.PK
    },
    funcSearch() {
      this.$refs.gridview.loadData();
    },
    onClickExport(obj) {
      this.$refs.gridview.exportExcel();
    },
    onSetHeader() {
      let headerObj = [
        {
          dataField: "RN",
          // allowEditing: false,
          caption: this.$t("rn"),
          dataType: "string",
          alignment: "right",
        },
        {
          dataField: "TR_DATE",
          // allowEditing: false,
          caption: this.$t("tr_date"),
          dataType: "string",
          alignment: "right",
        },
        {
          dataField: "CUS_CD",
          // allowEditing: false,
          caption: this.$t("cus_cd"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "CUS_NM",
          // allowEditing: false,
          caption: this.$t("cus_nm"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "CUS_FNM",
          // allowEditing: false,
          caption: this.$t("cus_fnm"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "TAX_CODE",
          // allowEditing: false,
          caption: this.$t("tax_code"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "BUYER_NAME",
          // allowEditing: false,
          caption: this.$t("buyer_name"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "FORM_NO",
          // allowEditing: false,
          caption: this.$t("form_no"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "SERIAL_NO",
          // allowEditing: false,
          caption: this.$t("serial_no"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "INVOICE_NO",
          // allowEditing: false,
          caption: this.$t("invoice_no"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "TR_CCY",
          // allowEditing: false,
          caption: this.$t("tr_ccy"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "TR_RATE",
          // allowEditing: false,
          caption: this.$t("tr_rate"),
          dataType: "string",
          alignment: "right",
        },
        {
          dataField: "TOT_NET_TR_AMT",
          // allowEditing: false,
          caption: this.$t("tot_net_tr_amt"),
          dataType: "number",
          formatFloat: 0,
          alignment: "right",
        },
        {
          dataField: "TOT_NET_BK_AMT",
          // allowEditing: false,
          caption: this.$t("tot_net_bk_amt"),
           dataType: "number",
          formatFloat: 0,
          alignment: "right",
        },
        {
          dataField: "REMARK",
          // allowEditing: false,
          caption: this.$t("remark"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "REMARK2",
          // allowEditing: false,
          caption: this.$t("remark2"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "EI_STATUS",
          // allowEditing: false,
          caption: this.$t("ei_status"),
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "SIGN_BY",
          // allowEditing: false,
          caption: this.$t("sign_by"),
          dataType: "string",
          alignment: "center",
        },
        {
          dataField: "SIGN_DT",
          // allowEditing: false,
          caption: this.$t("sign_dt"),
          dataType: "string",
          alignment: "canter",
        },
        {
          dataField: "INVOICE_TYPE",
          // allowEditing: false,
          caption: this.$t("invoice_type"),
          dataType: "string",
          alignment: "left",
        },
      ];
      this.headerGrid = headerObj;
    },
    
    async getListCodes(pos) {
      const dso_company_list = {
        type: "list",
        selpro: "AC_SEL_6095080_COMPANY",
        para: [this.user.PK],
      };
      const checkCompany = await this._dsoCall(
        dso_company_list,
        "select",
        false
      );
   //   console.log(checkCompany)
      if (checkCompany != null) {
        if (checkCompany.length > 0) {
          this.company_list = checkCompany;
          this.selected_company = this.company_list[0].VAL;
        }
      }
      const dso_form_list = {
        type: "list",
        selpro: "AC_SEL_6095080_FORM_NO",
        para: [this.selected_company],
      };
      const checkFormNo = await this._dsoCall(dso_form_list, "select", false);
      if (checkFormNo != null) {
        if (checkFormNo.length > 0) {
          this.form_no_list = checkFormNo;
          this.selected_form_no = this.form_no_list[0].VAL;
        }
      }
      const dso_serial_list = {
        type: "list",
        selpro: "AC_SEL_6095080_SERIAL_NO",
        para: [this.selected_company, this.selected_form_no],
      };
      const checkSerialNo = await this._dsoCall(
        dso_serial_list,
        "select",
        false
      );
      if (checkSerialNo != null) {
        if (checkSerialNo.length > 0) {
          this.serial_no_list = checkSerialNo;
          this.selected_serial_no = this.serial_no_list[0].VAL;
        }
      }
      const dso_status_list = {
        type: "list",
        selpro: "AC_SEL_6095080_STATUS",
      };
      const checkStatus = await this._dsoCall(dso_status_list, "select", false);
      if (checkStatus != null) {
        if (checkStatus.length > 0) {
          this.status_list = checkStatus;
          this.selected_status = this.status_list[0].VAL;
        }
      }
      const dso_tradingtype_list = {
        type: "list",
        selpro: "AC_SEL_6095080_TRADING_TYPE",
      };
      const checkTrandingType = await this._dsoCall(
        dso_tradingtype_list,
        "select",
        false
      );
      if (checkTrandingType != null) {
        if (checkTrandingType.length > 0) {
          this.trading_type_list = checkTrandingType;
          this.selected_trading_type = this.trading_type_list[0].VAL;
        }
      }
    },
    async exportReport() {
      let report_path = "report/60/95/template_710020.xlsx";
      let hiddenCols = [];
      let excel = [];
      //setup allow col
      excel = [
        {
          sheet: 1,
          insertRange: [
            {
              range: "A1:E7",
              proc: "stacfrstac710020_s_01_node_trg",
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
          insertRows: [
            {
              sequence: "break",
              startRow: 11,
              proc: "stacfrstac710020_s_01_node_trg",
              params: [
                this.fromDate,
                this.toDate,
                this.lstForm,
                this.lstSerial,
                this.lstInvoiceNo,
                this.company,
              ],
              dateColumns: [
                "INVOICE_DATE",
                "SIGN_DT",
                "INVOICE_DATE_ADJ",
                "SIGN_DT_ADJ",
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
                "CANCEL_BY",
                "CANCEL_DT",
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
