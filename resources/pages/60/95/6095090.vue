<template>
  <v-container fluid class="pt-1" v-resize="onResize">
    <v-card outlined>
      <v-row dense justify="space-between" class="pl-3 pr-3 pt-2">
        <v-col lg="4" cols="12">
          <BaseSelect outlined :label="$t('company')" item-text="NAME" item-value="VAL" :lstData="company_list"
            v-model="selected_company" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseInput outlined :label="$t('invoice_no')" v-model="invoice_no" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseInput outlined v-model="invoice_no_ip" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('form_no')" item-text="NAME" item-value="VAL" filter_off :lstData="form_no_list"
            v-model="selected_form_no" />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('serial_no')" item-text="NAME" item-value="VAL" filter_off
            :lstData="serial_no_list" v-model="selected_serial_no" />
        </v-col>
      </v-row>

      <v-row dense justify="space-between" class="pl-3 pr-3 pt-2">
        <v-col lg="2" cols="12">
          <BaseDatePicker outlined :pretoday="7" :label="$t('from_date')" v-model="dt_from" />
        </v-col>
        <v-col lg="2" cols="12">
          <BaseDatePicker outlined today :label="$t('to_date')" v-model="dt_to" />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('status')" v-model="selected_status" :lstData="status_list" item-text="NAME"
            item-value="VAL" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('etax_status')" v-model="selected_etaxStatus" :lstData="etaxStatus_list"
            item-text="NAME" item-value="VAL" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('etax_result')" v-model="selected_etaxResult" :lstData="etaxResult_list"
            item-text="NAME" item-value="VAL" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('trading_type')" v-model="selected_trading_type" :lstData="trading_type_list"
            item-text="NAME" item-value="VAL" filter_off />
        </v-col>
      </v-row>


      <v-row dense justify="space-between" class="pl-3 pr-3 pt-2">
        <v-col lg="2">
          <BaseInput outlined :label="$t('tot_net_tr_amt')" v-model="tot_net_tr_amt" number />
        </v-col>
        <!-- <v-col lg="2">
          <BaseInput outlined :label="$t('tot_net_bk_amt')" v-model="tot_net_bk_amt" number />
        </v-col> -->
        <v-col lg="2">
        </v-col>
        <v-col lg="2">
          <BaseInput outlined :label="$t('tot_net_tr_vat_amt')" v-model="tot_net_tr_vat_amt" number />
        </v-col>

        <v-col lg="2">
          <!-- <BaseInput outlined :label="$t('tot_net_bk_vat_amt')" v-model="tot_net_bk_vat_amt" number /> -->
        </v-col>
        <v-col lg="2">
          <BaseInput outlined :label="$t('total')" v-model="total" number />
        </v-col>
        <v-col lg="2">
          <!-- <BaseInput outlined :label="$t('total_bk')" v-model="total_bk" number /> -->
        </v-col>
      </v-row>

      <v-row dense justify="space-between" class="pl-3 pr-3 pt-2">
        <v-col lg="2">
          <BaseInput outlined :label="$t('partner')" v-model="itemPartner" />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('directly_yn')" :lstData="yn_list" v-model="selected_yn" item-text="NAME"
            item-value="VAL" filter_off />
        </v-col>
        <v-col lg="1">
          <BaseCheckbox :label="$t('check_all')" true-value="Y" false-value="N" v-model="check_all" />
        </v-col>
        <v-col lg="7" class="pl-1 d-flex justify-end">
          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="funcSearch()" />
          <BaseButton icon_type="view" :btn_text="$t('preview')" :disabled="isProcessing" @onclick="onPreview" />
          <BaseButton icon_type="xml" :btn_text="$t('view_xml')" @onclick="onClick('viewXML')" />
          <BaseButton icon_type="attach" :btn_text="$t('invoice_sign')" :disabled="isProcessing"
            @onclick="InvoiceSign()" />
          <BaseButton icon_type="add_new" :btn_text="$t('check_code_cqt')" :disabled="isProcessing" />
        </v-col>
      </v-row>


      <v-row dense align="stretch" justify="space-between">
        <v-col cols="12">
          <v-card outlined>
            <v-container fluid class="">
              <!-- :selectionmode="'checkbox'" -->
              <BaseGridView ref="gridview" :header="this.headerGrid" sel_procedure="EI_SEL_6095090_SEL_DATA"
                :multiselect="true" :selectionmode="'checkbox'" :autocheckbox="false" :headertype="1"
                @onSelectionDataChanged="onGridSelectionChanged" :filter_paras="[
                  this.selected_company,
                  this.txtFromInvoiceNo,
                  this.txtToInvoiceNo,
                  this.selected_form_no,
                  this.selected_serial_no,
                  this.dt_from,
                  this.dt_to,
                  this.selected_status,
                  this.txtPartner,
                  this.selected_trading_type,
                  this.selected_yn,
                  this.selected_etaxStatus,
                  this.selected_etaxResult
                ]" @setDataSource="onAfterLoad" :height="limitHeight" @cellClick="onCellClick" />
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <view-einvoice-pdf-dialog ref="ViewEInvoicePDFDialog" :src_pdfUrl="pdfUrl"></view-einvoice-pdf-dialog>
  </v-container>
</template>

<script>
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  layout: "default",
  middleware: "user",

  components: {
    DatePicker: () => import("@/components/control/DatePicker"),
    "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
  },
  data: () => ({
    company_list: [],
    selected_company: null,
    txtFromInvoiceNo: "",
    txtToInvoiceNo: "",
    form_no_list: [],
    selected_form_no: "",
    serial_no_list: [],
    selected_serial_no: "",
    dt_from: null,
    dt_to: null,
    status_list: [],
    etaxStatus_list: [],
    selected_etaxStatus: "",
    etaxResult_list: [],
    selected_etaxResult: "",
    invoice_no: "",
    invoice_no_ip: "",
    check_all: "Y",

    selected_status: "",
    txtPartner: "",
    trading_type_list: [],
    selected_trading_type: "DO",
    tot_net_tr_amt: 0,
    tot_net_bk_amt: 0,
    tot_net_tr_vat_amt: 0,
    tot_net_bk_vat_amt: 0,
    total_bk: 0,
    total: 0,
    selected_yn: "",
    yn_list: [],
    blYN: "Y",
    offInvoiceSign: true,
    headerGrid: [],

    pdfUrl: "",
    tei_einvoice_m_pk_row: "",

    selected_rows: [],

    PKs: "",
    PK_Send: "",
    FormNo: "",
    Invoice_No: "",
    SerialNo: "",
    tei_einvoice_m_PK: "",
    Count_Pk: 0,
    txtXMl_T: "",
    itemPartner: "",
    txtSerial_Number: "",
    txtNOTBEFORE: "",
    txtNOTAFTER: "",
    txtRAWDATA: "",
    txtISSUER: "",
    txtISSUEBY: "",
    txtISSUETO: "",
    txtDN_NAME: "",
    txtDN_MST: "",
  }),

  async created() {
    // let month = parseInt(new Date().getMonth() + 1);
    // if (month.length == 1) {
    //   month = "0" + month;
    // }
    // this.dt_from = "" + new Date().getFullYear() + month + "01";
    // this.dt_to = "" + new Date().getFullYear() + month + "31";
    await this.getListCodes();
    this.pdf_handler = require("./js/EiExcelHandler.js");
    if (!!this.pdf_handler) {
      Object.assign(this, this.pdf_handler.default);
    }
  },
  mounted() {
    this.onSetHeader();
  },
  watch: {
    selected_status(val) {
      // console.log(`${new Date().getTime()} val=`, val)
      if (val == 1) {
        this.offInvoiceSign = true;
      } else {
        this.offInvoiceSign = false;
      }
    },
    selected_company(val) {
      this.getListCode("form_no");
      this.getListCode("serial_no");
    },
    selected_form_no(val) {
      this.getListCode("serial_no");
    },
    dt_from(val) {
      this.getListCode("form_no");
      this.getListCode("serial_no");
    },
    dt_to(val) {
      this.getListCode("form_no");
      this.getListCode("serial_no");
    },
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
    ValidateEmail(mail) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        //alert("You have entered an invalidii email address!")
        return true;
      }
      //alert("You have entered an invalid email address!")
      return false;
    },
    async onGridSelectionChanged(data) {
      this.selected_rows = data;
    },
    InvoiceSign() {
      let count = 1;

      let grdSelectedRow = this.selected_rows;
      for (var i = 0; i < grdSelectedRow.length; i++) {
        if (grdSelectedRow[i].ei_status != "Issued") {
          if (
            !this.ValidateEmail(grdSelectedRow[i].mail) &&
            grdSelectedRow[i].mail.length > 0
          ) {
            alert(
              "E-Mail của công ty : " +
              grdSelectedRow[i].cus_cd +
              " chưa đúng. Chỉ sử dụng được 1 mail hoặc định dạng mail chưa đúng."
            );
            return;
          }
          this.PKs = grdSelectedRow[i].pk + "-" + this.PKs;
          this.tei_einvoice_m_PK =
            grdSelectedRow[i].pk + "-" + this.tei_einvoice_m_PK;
          this.PK_Send = grdSelectedRow[i].tac_crca_pk + "-" + this.PK_Send;
          this.FormNo =
            grdSelectedRow[i].form_no.replace("/", "") + "-" + this.FormNo;
          this.SerialNo =
            grdSelectedRow[i].serial_no.replace("/", "") + "-" + this.SerialNo;
          this.Invoice_No =
            grdSelectedRow[i].invoice_no + "-" + this.Invoice_No;
          this.PK_Send = grdSelectedRow[i].tac_crca_pk + "-" + this.PK_Send;
          this.Count_Pk = count++;
        }
      }
      jQuery.support.cors = true;
      $.ajax({
        url: "http://genuclouding.com/wseinvoice/BSService.asmx/GeneralXmlList_v2",
        dataType: "text",
        method: "POST",
        data: { tei_einvoice_m_pk: this.PKs },
        error: this.onError,
        success: this.onSuccess,
      });
    },
    async onError(response, json, textStatus, errorThrown) {
      alert(" Error :" + errorThrown);
    },
    async onSuccess(response) {
      var xmlDoc = $.parseXML(response);
      var xml = $(xmlDoc);
      let obj = $.parseJSON(xml.text());
      if (obj.msg == "OK") {
        this.txtXMl_T = obj.result;

        if (this.PKs != "") {
          jQuery.support.cors = true;
          $.ajax({
            url: "http://localhost:1080/issueXmlList",
            dataType: "text",
            method: "POST",
            data: {
              tei_invoice_m_pk: this.PKs,
              tei_company_pk: this.selected_company,
              crt_by: this.user.USER_ID,
              xml: this.txtXMl_T,
            },
            error: this.onErrorissueXmlList,
            success: this.onSuccessissueXmlList,
          });
        }
      }
    },

    async onErrorissueXmlList(json, textStatus, errorThrown) {
      alert(" Error :" + errorThrown);
    },
    async onSuccessissueXmlList(data) {
      let obj_token = $.parseJSON(data);

      this.txtXMl_T = obj_token.result;
      this.txtSerial_Number = obj_token.SerialNumber;
      this.txtNOTBEFORE = obj_token.NotBefore;
      this.txtNOTAFTER = obj_token.NotAfter;
      this.txtRAWDATA = obj_token.RAWDATA;
      this.txtISSUER = obj_token.IsSuer;
      this.txtISSUEBY = obj_token.IssueBy;
      this.txtISSUETO = obj_token.IssueTo;
      this.txtDN_NAME = obj_token.DN_Name;
      this.txtDN_MST = obj_token.DN_MST;

      //************call something */ dso_process_check_serialno.Call();
    },
    async SerialNoCheck() {
      const dso_process_check_serialno = {
        type: "list",
        selpro: "EI_SEL_6095090_SERIAL_CHECK",
        para: [
          this.selected_company,
          this.selected_serial_no,
          this.txtFromInvoiceNo,
          this.txtToInvoiceNo,
        ],
      };
      const check_serial_no_result = await this._dsoCall(
        dso_process_check_serialno,
        "select",
        false
      );
      // console.log(checkCompany);
      if (check_serial_no_result != null) {
        if (check_serial_no_result == "1") {
          $.ajax({
            url: "http://genuclouding.com/wseinvoice/BSService.asmx/UpdateXmlList_v3",
            dataType: "text",
            method: "POST",

            data: {
              tei_einvoice_m_pk: this.PKs,
              tei_company_pk: this.selected_company,
              arg_XmlStr: this.txtXMl_T,
              form_no: this.FormNo,
              serial_no: this.SerialNo,
              invoice_no: this.Invoice_No,
              ctr_by: this.user.USER_ID,
              serialNumber: this.txtSerial_Number,
              notBefore: this.txtNOTBEFORE,
              notAfter: this.txtNOTAFTER,
              rawData: this.txtRAWDATA,
              isSuer: this.txtISSUER,
              issueBy: this.txtISSUEBY,
              issueTo: this.txtISSUETO,
              dn_Name: this.txtDN_NAME,
              dm_MST: this.txtDN_MST,
              type_send_data: txtInvoice_Form_Symbol.value,
            },

            error: this.onErrorUpdateXmlList_v3,
            success: this.onSuccessUpdateXmlList_v3,
          });
        } else {
          alert("Token not suitable !!!");
        }
      }
    },
    onErrorUpdateXmlList_v3(json, textStatus, errorThrown) {
      alert(" Error :" + errorThrown);
    },
    onSuccessUpdateXmlList_v3(response) {
      var xmlDoc_serial = $.parseXML(response);
      var xml_serial = $(xmlDoc_serial);
      //alert(xml_serial.text());
      let obj_serial = $.parseJSON(xml_serial.text());
      if (obj_serial.msg == "OK") {
        alert("STAMP E-INVOICE FINISHED.");
        //dso_process_data_sign.Call();
        //dso_process_check_serialno.Call();
        //txtXMl_T.value = obj.result;
        dso_steafrstea010003_s_01.Call("SELECT");
      }
    },

    async onPreview() {
      // jQuery.support.cors = true;
      // $.ajax({
      //   type: "POST",
      //   url: "http://genuclouding.com/wseinvoice/BSService.asmx/SendPDF_R",
      //   data: {
      //     tei_einvoice_m_pk: this.tei_einvoice_m_pk_row + "|",
      //     tei_company_pk: this.selected_company,
      //   },
      //   dataType: "text",
      //   crossDomain: true,
      //   success: this.OnSuccessCallReUploadPDF,this.tei_einvoice_m_pk_row
      //   error: this.OnErrorCallReUploadPDF,
      // });

      //351913 265263 304524  313069
      this.isProcessing = true
      //this.pdfUrl = await this.pdfUrlGetter(385207);
      this.pdfUrl = await this.pdfUrlGetter(this.tei_einvoice_m_pk_row);
      //   this.pdfUrl = await this.$axios.$post("/einvoice/einvoicepdfconvert", { tradecode:this.tei_einvoice_m_pk_row });

      this.$nextTick(() => {
        this.isProcessing = false
        this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      });
    },
    async pdfUrlGetter(pk) {
      const pdfUrlExcel = await this.getEinvoice(this, pk)
      console.log("pdfUrlExcel ", pdfUrlExcel);
      return pdfUrlExcel
    },

    onAfterLoad() {
      let gridArray = [];
      this.$nextTick(() => {
        gridArray = this.$refs.gridview.getDataSource();

        gridArray.forEach((e) => {
          this.tot_net_tr_amt += e.TOT_NET_TR_AMT;
          this.tot_net_bk_amt += e.TOT_NET_BK_AMT;
          this.tot_net_tr_vat_amt += e.TOT_VAT_TR_AMT;
          this.tot_net_bk_vat_amt += e.TOT_VAT_BK_AMT;
        });
        this.total = this.tot_net_tr_amt + this.tot_net_tr_vat_amt;
        this.total_bk = this.tot_net_bk_amt + this.tot_net_bk_vat_amt;
      });
    },
    funcSearch() {
      this.$refs.gridview.loadData();
    },
    async onCellClick({ column, data, rowIndex, rowType }) {
      this.tei_einvoice_m_pk_row = data.PK;
    },
    onClickExport(obj) {
      this.$refs.gridview.exportExcel();
    },
    onSetHeader() {
      let headerObj = [
        {
          field: "RN",
          title: this.$t("no"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "INVOICE_DATE",
          title: this.$t("invoice_date"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "CUS_CD",
          title: this.$t("cus_id"),
          type: "text",
          width: 100,
          alignment: "left",
        },
        {
          field: "CUS_NM",
          title: this.$t("cus_nm"),
          type: "text",
          width: 120,
          alignment: "left",
        },
        {
          field: "CUS_FNM",
          title: this.$t("cus_fnm"),
          type: "text",
          width: 120,
          alignment: "left",
        },
        {
          field: "TAX_CODE",
          title: this.$t("tax_code"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "BUYER_NAME",
          title: this.$t("buyer_nm"),
          type: "text",
          width: 120,
          alignment: "left",
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "INVOICE_NO",
          title: this.$t("invoice_no"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "TR_CCY",
          title: this.$t("tr_ccy"),
          type: "text",
          width: 50,
          alignment: "left",
        },
        {
          field: "TR_RATE",
          title: this.$t("tr_rate"),
          type: "text",
          width: 50,
          alignment: "left",
        },
        //
        {
          field: "TOT_NET_TR_AMT",
          title: this.$t("tot_net_tr_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
        },
        {
          field: "TOT_NET_BK_AMT",
          title: this.$t("tot_net_bk_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
          hidden: true
        },
        {
          field: "TOT_VAT_TR_AMT",
          title: this.$t("tot_vat_tr_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
        },
        {
          field: "TOT_VAT_BK_AMT",
          title: this.$t("tot_vat_tr_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
          hidden: true
        },
        {
          field: "TOTAL_AMT",
          title: this.$t("total_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
        },
        {
          field: "REMARK",
          title: this.$t("description"),
          type: "text",
          width: 80,
          alignment: "left",
          hidden: true
        },
        {
          field: "REMARK2",
          title: this.$t("local_description"),
          type: "text",
          width: 80,
          alignment: "left",
          hidden: true
        },
        {
          field: "EI_STATUS",
          title: this.$t("ei_status"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "SIGN_BY",
          title: this.$t("sign_by"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "SIGN_DT",
          title: this.$t("sign_dt"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "INVOICE_TYPE",
          title: this.$t("invoice_type"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "MAIL",
          title: this.$t("mail"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "EMAIL_ADDRESS_CC",
          title: this.$t("email_address_cc"),
          type: "text",
          width: 150,
          alignment: "left",
        },
        {
          field: "DIRECTLY_YN",
          title: this.$t("directly_yn"),
          type: "text",
          width: 80,
          alignment: "left",
        },

        {
          field: "REPORT_CODE",
          title: this.$t("report_code"),
          type: "text",
          width: 80,
          alignment: "left",
          hidden: true
        },
        {
          field: "CQT_MCCQT_ID",
          title: this.$t("cqt_mccqt_id"),
          type: "text",
          width: 100,
          alignment: "left",
        },



        {
          field: "ETAX_STATUS",
          title: this.$t("etax_status"),
          width: 150,
          allowEditing: true,
        },
        {
          field: "ETAX_RESULT",
          title: this.$t("etax_result"),
          width: 150,
          allowEditing: true,
        },




        {
          field: "CQT_ERROR_CODE",
          title: this.$t("cqt_err_code"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "CQT_NOTIFICATION",
          title: this.$t("cqt_noti"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          field: "TAX_RATE_MULTI",
          title: this.$t("tax_rate_multi"),
          alignment: "left",
        },
      ];
      this.headerGrid = headerObj;
    },
    async getListCodes(pos) {
      const dso_company_list = {
        type: "list",
        selpro: "EI_SEL_6095090_COMPANY",
        para: [this.user.PK],
      };
      const checkCompany = await this._dsoCall(
        dso_company_list,
        "select",
        false
      );
      console.log(checkCompany);
      if (checkCompany != null) {
        if (checkCompany.length > 0) {
          this.company_list = checkCompany;
          this.selected_company = this.company_list[0].VAL;
        }
      }

      const dso_etaxStatus_list = {
        type: "list",
        selpro: "EI_SEL_6095090_ETAX_STATUS",
        para: [this.selected_company],
      };
      const checkeTaxStatus = await this._dsoCall(dso_etaxStatus_list, "select", false);
      if (checkeTaxStatus != null) {
        if (checkeTaxStatus.length > 0) {
          this.etaxStatus_list = checkeTaxStatus;
          this.selected_etaxStatus = this.etaxStatus_list[0].VAL;
        }
      }

      const dso_etaxResult_list = {
        type: "list",
        selpro: "EI_SEL_6095090_ETAX_RESULT",
        para: [this.selected_company],
      };
      const checkeTaxResult = await this._dsoCall(dso_etaxResult_list, "select", false);
      if (checkeTaxResult != null) {
        if (checkeTaxResult.length > 0) {
          this.etaxResult_list = checkeTaxResult;
          this.selected_etaxResult = this.etaxResult_list[0].VAL;
        }
      }

      const dso_status_list = {
        type: "list",
        selpro: "EI_SEL_6095090_STATUS",
      };
      const checkStatus = await this._dsoCall(dso_status_list, "select", false);
      if (checkStatus != null) {
        if (checkStatus.length > 0) {
          this.status_list = checkStatus;
          this.selected_status = this.status_list[1].VAL;

        }
      }

      // console.log(checkStatus);
      const dso_tradingtype_list = {
        type: "list",
        selpro: "EI_SEL_6095090_TRADING_TYPE",
      };
      const checkTrandingType = await this._dsoCall(
        dso_tradingtype_list,
        "select",
        false
      );
      if (checkTrandingType != null) {
        if (checkTrandingType.length > 0) {
          this.trading_type_list = checkTrandingType;
          this.selected_trading_type = this.trading_type_list[1].VAL;
        }
      }
      const dso_directly_list = {
        type: "list",
        selpro: "EI_SEL_6095090_YN",
        para: [this.user.PK],
      };
      const checkDerictly = await this._dsoCall(
        dso_directly_list,
        "select",
        false
      );
      if (checkDerictly != null) {
        if (checkDerictly.length > 0) {
          this.yn_list = checkDerictly;
          this.selected_yn = this.yn_list[0].VAL;
        }
      }
    },

    async getListCode(pos) {
      switch (pos) {
        case "form_no":
          const dso_form_list = {
            type: "list",
            selpro: "AC_SEL_6095090_FORM_NO",
            para: [this.selected_company, this.dt_from, this.dt_to],
          };
          const checkFormNo = await this._dsoCall(dso_form_list, "select", false);
          if (checkFormNo != null) {
            if (checkFormNo.length > 0) {
              this.form_no_list = checkFormNo;
              this.selected_form_no = this.form_no_list[0].VAL;
            }
          }
          break;
        case "serial_no":
          const dso_serial_no_list = {
            type: "list",
            selpro: "AC_SEL_6095090_SERIAL_NO",
            para: [this.selected_company, this.selected_form_no, this.dt_from, this.dt_to],
          };
          const checkSerialNo = await this._dsoCall(dso_serial_no_list, "select", false);
          if (checkSerialNo != null) {
            if (checkSerialNo.length > 0) {
              this.serial_no_list = checkSerialNo;
              this.selected_serial_no = this.serial_no_list[0].VAL;
            }
          }
          break;
      }
    },
  },
};
</script>
