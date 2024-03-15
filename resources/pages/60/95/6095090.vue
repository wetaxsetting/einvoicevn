<template>
  <v-container fluid class="pt-1" v-resize="onResize">
    <v-card outlined>
      <v-row dense justify="space-between" class="pl-3 pr-3 pt-2">
        <v-col lg="4" cols="12">
          <BaseSelect outlined :label="$t('company')" item-text="NAME" item-value="VAL" :lstData="company_list"
            v-model="selected_company" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseInput outlined :label="$t('invoice_no')" v-model="txtFromInvoiceNo" filter_off />
        </v-col>
        <v-col lg="2">
          <BaseInput outlined v-model="txtToInvoiceNo" filter_off />
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
            item-text="NAME" item-value="CODE" filter_off />
        </v-col>
      </v-row>


      <v-row dense justify="space-between" class="pl-3 pr-3 pt-2">
        <v-col lg="4">
          <BaseInput outlined :label="$t('tot_net_tr_amt')" v-model="tot_net_tr_amt" number />
        </v-col>
        <!-- <v-col lg="2">
          <BaseInput outlined :label="$t('tot_net_bk_amt')" v-model="tot_net_bk_amt" number />
        </v-col> -->
       
        <v-col lg="4">
          <BaseInput outlined :label="$t('tot_net_tr_vat_amt')" v-model="tot_net_tr_vat_amt" number />
        </v-col>

        <!-- <v-col lg="2">
          <BaseInput outlined :label="$t('tot_net_bk_vat_amt')" v-model="tot_net_bk_vat_amt" number />
        </v-col> -->
        <v-col lg="4">
          <BaseInput outlined :label="$t('total')" v-model="total" number />
        </v-col>
        <!-- <v-col lg="2">
          <BaseInput outlined :label="$t('total_bk')" v-model="total_bk" number />
        </v-col> -->
      </v-row>

      <v-row dense justify="space-between" class="pl-3 pr-3 pt-2">
        <v-col lg="2">
          <BaseInput outlined :label="$t('partner')" v-model="txtPartner" />
        </v-col>
        <v-col lg="2">
          <BaseSelect outlined :label="$t('directly_yn')" :lstData="yn_list" v-model="selected_yn" item-text="NAME"
            item-value="VAL" filter_off />
        </v-col>
        <v-col lg="1">
          <!-- <BaseCheckbox :label="$t('check_all')" true-value="Y" false-value="N" v-model="check_all" /> -->
        </v-col>
        <v-col lg="7" class="pl-1 d-flex justify-end">
          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="funcSearch()" />
          <BaseButton icon_type="view" :btn_text="$t('preview')" :disabled="isProcessing" @onclick="onPreview" />
          <BaseButton icon_type="xml" :btn_text="$t('view_xml')" @onclick="onPreviewXml" />
          <BaseButton icon_type="attach" :btn_text="$t('invoice_sign')" :disabled="selected_status == 1 || selected_status == 5" @onclick="InvoiceSign()" />
          <BaseButton icon_type="add_new" :btn_text="$t('check_code_cqt')" :disabled="selected_status == 0" @onclick="checkingCQT()"/>
        </v-col>
      </v-row>


      <v-row dense align="stretch" justify="space-between">
        <v-col cols="12">
          <v-card outlined>
              <!-- :selectionmode="'checkbox'" -->
              <BaseGridView ref="gridview" :header="grdReviewSign" sel_procedure="EI_SEL_6095090_SEL_DATA_NC"
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
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <!-- <v-dialog v-model="showPDF" max-width="800">
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <v-card outlined :height="limitHeight1" :max-height="limitHeight1" style="overflow-y: scroll" v-resize="onResize">
              <v-overlay :value="showLoading" :absolute="true" opacity="0.3">
                <v-progress-circular indeterminate size="50"></v-progress-circular>
              </v-overlay>
              <iframe :src="urlPDF" height="100%" width="100%"></iframe>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog> -->
    <view-einvoice-pdf-dialog
      ref="ViewEInvoicePDFDialog"
      :src_pdfUrl="pdfUrl"
      @minimizeDialogPDF="manualIsMinimizedPDF = true"
      @closeManualDialog="manualIsMinimizedPDF = false"
    ></view-einvoice-pdf-dialog>
    <view-einvoice-xml-dialog
      ref="ViewEInvoiceXMLDialog"
      :src_xmlUrl="xmlUrl"
      :xmlFileNm="xmlFileNm"
      dwnFile
      @minimizeDialog="manualIsMinimized = true"
      @closeManualDialog="manualIsMinimized = false"
    ></view-einvoice-xml-dialog>

    <methor-sign-x-m-l-dialog
      ref="MethorSignXML"
      :src_pdfUrl="pdfUrl"
    ></methor-sign-x-m-l-dialog>

    <div class="squareBox" v-if="false">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon small v-on="on" @click="openManualDialog">
            <v-icon :color="currentTheme">mdi-help-box</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("show_manual") }}</span>
      </v-tooltip>
    </div>
    <v-scale-transition origin="bottom center">
      <v-btn dark depressed fab fixed bottom right small :color="currentTheme" v-if="manualIsMinimized" @click="restoreManualDialog">
        <v-icon>mdi-window-restore</v-icon>
      </v-btn>
    </v-scale-transition>

    <v-scale-transition origin="bottom center">
      <v-btn dark depressed fab fixed bottom right small :color="currentTheme" v-if="manualIsMinimizedPDF" @click="restoreManualDialogPDF">
        <v-icon>mdi-window-restore</v-icon>
      </v-btn>
    </v-scale-transition>

  
  </v-container>
</template>

<script>
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
import ViewEInvoiceXMLDialog from "@/components/dialog/ViewEInvoiceXMLDialog.vue";
import MethorSignXML from "@/components/dialog/MethorSignXML.vue";
export default {
  layout: "default",
  middleware: "user",

  components: {
    DatePicker: () => import("@/components/control/DatePicker"),
    "view-einvoice-xml-dialog": ViewEInvoiceXMLDialog,
    "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
    "methor-sign-x-m-l-dialog": MethorSignXML,
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
    manualIsMinimized: false,
    manualIsMinimizedPDF: false,
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
    xmlUrl:"",
    xmlFileNm:"",
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
    maGD:"",
    xml_signed : "",
    showPDF: false,
    urlPDF:""

  }),

  async created() {
    // let month = parseInt(new Date().getMonth() + 1);
    // if (month.length == 1) {
    //   month = "0" + month;
    // }
    // this.dt_from = "" + new Date().getFullYear() + month + "01";
    // this.dt_to = "" + new Date().getFullYear() + month + "31";
    // this.pdf_handler = require("./js/EiExcelHandler.js");
    // if (!!this.pdf_handler) {
    //   Object.assign(this, this.pdf_handler.default);
    // }
    await this.getListCodes();
  },
  mounted() {
    
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

    grdReviewSign(){
      let _headerObj = [
        {
          dataField: "RN",
          caption: this.$t("no"),
          type: "text",
          width: 80,
          alignment: "right",
        },
        {
          dataField: "INVOICE_DATE",
          caption: this.$t("invoice_date"),
          type: "text",
          width: 120,
          alignment: "center",
          format: this.curLang.DATE_FORMAT,
        },
        {
          dataField: "CUS_CD",
          caption: this.$t("cus_id"),
          type: "text",
          width: 120,
          alignment: "left",
        },
        {
          dataField: "CUS_NM",
          caption: this.$t("cus_nm"),
          type: "text",
          width: 420,
          alignment: "left",
        },
        {
          dataField: "CUS_FNM",
          caption: this.$t("cus_fnm"),
          type: "text",
          width: 150,
          alignment: "left",
        },
        {
          dataField: "TAX_CODE",
          caption: this.$t("tax_code"),
          type: "text",
          width: 150,
          alignment: "center",
        },
        {
          dataField: "BUYER_NAME",
          caption: this.$t("buyer_nm"),
          type: "text",
          width: 120,
          alignment: "left",
        },
        {
          dataField: "FORM_NO",
          caption: this.$t("form_no"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          dataField: "SERIAL_NO",
          caption: this.$t("serial_no"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          dataField: "INVOICE_NO",
          caption: this.$t("invoice_no"),
          type: "text",
          width: 80,
          alignment: "right",
        },
        {
          dataField: "TR_CCY",
          caption: this.$t("tr_ccy"),
          type: "text",
          width: 50,
          alignment: "center",
        },
        {
          dataField: "TR_RATE",
          caption: this.$t("tr_rate"),
          type: "number",
          width: 50,
          alignment: "right",
        },
        //
        {
          dataField: "TOT_NET_TR_AMT",
          caption: this.$t("tot_net_tr_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
        },
        {
          dataField: "TOT_NET_BK_AMT",
          caption: this.$t("tot_net_bk_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
          hidden: true
        },
        {
          dataField: "TOT_VAT_TR_AMT",
          caption: this.$t("tot_vat_tr_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
        },
        {
          dataField: "TOT_VAT_BK_AMT",
          caption: this.$t("tot_vat_tr_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
          hidden: true
        },
        {
          dataField: "TOTAL_AMT",
          caption: this.$t("total_amt"),
          type: "number",
          formatFloat: 0,
          width: 150,
          alignment: "right",
        },
        {
          dataField: "REMARK",
          caption: this.$t("description"),
          type: "text",
          width: 80,
          alignment: "left",
          hidden: true
        },
        {
          dataField: "REMARK2",
          caption: this.$t("local_description"),
          type: "text",
          width: 80,
          alignment: "left",
          hidden: true
        },
        {
          dataField: "EI_STATUS",
          caption: this.$t("ei_status"),
          type: "text",
          width: 80,
          alignment: "center",
        },
        {
          dataField: "SIGN_BY",
          caption: this.$t("sign_by"),
          type: "text",
          width: 280,
          alignment: "left",
        },
        {
          dataField: "SIGN_DT",
          caption: this.$t("sign_dt"),
          type: "text",
          width: 180,
          alignment: "center",
        },
        {
          dataField: "INVOICE_TYPE",
          caption: this.$t("invoice_type"),
          type: "text",
          width: 120,
          alignment: "center",
        },
        {
          dataField: "EMAIL_ADDRESS",
          caption: this.$t("email_address"),
          type: "text",
          width: 150,
          alignment: "left",
        },
        {
          dataField: "EMAIL_ADDRESS_CC",
          caption: this.$t("email_address_cc"),
          type: "text",
          width: 150,
          alignment: "left",
        },
        {
          dataField: "DIRECTLY_YN",
          caption: this.$t("directly_yn"),
          type: "text",
          width: 80,
          alignment: "left",
          hidden:true
        },
        {
          dataField: "CQT_MAGD",
          caption: this.$t("cqt_magd"),
          width: 400,
        },
        {
          dataField: "CQT_MCCQT_ID",
          caption: this.$t("cqt_mccqt_id"),
          type: "text",
          width: 300,
          alignment: "center",
        },
        {
          dataField: "ETAX_STATUS",
          caption: this.$t("etax_status"),
          width: 150,
          allowEditing: true,
        },
        {
          dataField: "ETAX_RESULT",
          caption: this.$t("etax_result"),
          width: 150,
          allowEditing: true,
          
        },
        {
          dataField: "CQT_ERROR_CODE",
          caption: this.$t("cqt_err_code"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          dataField: "CQT_NOTIFICATION",
          caption: this.$t("cqt_noti"),
          type: "text",
          width: 80,
          alignment: "left",
        },
        {
          dataField: "TAX_RATE_MULTI",
          caption: this.$t("tax_rate_multi"),
          alignment: "left",
          hidden:true
        },
      ];

      return _headerObj;
    }
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

    async checkingCQT(){
      this.invoice = [];
      const grdSelectedRow = this.$refs.gridview.getSelectedRows();
      for(let i =0; i< grdSelectedRow.length; i++)
      {
        this.invoice.push({
            req_key : grdSelectedRow[i].PK,
            trade_code : grdSelectedRow[i].CQT_MAGD,
            tax_code: grdSelectedRow[i].SELLER_TAXCODE,
          })
        
      }

      let res_check = await this.$axios.$post("/einvoice/check-status-invoice-at", {
          responseType: "json",
          data: this.invoice,
        });

        if (res_check.success) {
          this.funcSearch();
          this.showNotification("success", "Checking invoice to Tax Office was Successfully!", "");
        }

      console.log("sss",this.invoice );
    },

    async InvoiceSign() {

      this.$refs.MethorSignXML.dialogIsShow = true;
      return;

      const grdSelectedRow = this.$refs.gridview.getSelectedRows();
      this.invoice = [];

      for(let i =0; i< grdSelectedRow.length; i++)
      {
        this.invoice.push({
            PK : grdSelectedRow[i].PK,
            USER_ID : this.user.USER_ID,
          })
        
      }
  
      let res = await this.$axios.$post("/einvoice/general-invoice-xml", {
          responseType: "json",
          list_invoice: this.invoice,
        });
        
        // 13/11/2023 vng-199 Mr.The update signXML new
        /*console.log("this.invoice  ", this.invoice);
        if (res.success) {
          console.log("response", res.data);
          jQuery.support.cors = true;
          $.ajax({
            url: "http://localhost:1080/issueXmlList",
            dataType: "json",
            method: "POST",
            data: {
              crt_by: this.user.USER_ID,
              xml: JSON.stringify(res.data),
            },
            error: this.onErrorissueXmlList,
            success: this.onSuccessissueXmlList,
          });

        }*/

        console.log("this.invoice  ", this.invoice);
        if (res.success) {
          console.log("response", res.data);
          jQuery.support.cors = true;
          $.ajax({
            url: "http://localhost:1080/signXML",
            dataType: "json",
            method: "POST",
            data: {
              crt_by: this.user.USER_ID,
              xml: JSON.stringify(res.data),
            },
            error: this.onErrorissueXmlList,
            success: this.onSuccessissueXmlList,
          });

        }

    },

    async onErrorissueXmlList(json, textStatus, errorThrown) {
      alert(" Error :" + errorThrown);
    },

    async onSuccessissueXmlList(data) {
      console.log(data);
      let jsonXML = data.result;
      // this.txtXMl_T = data.result[0].xml;
      // this.txtSerial_Number = data.serial_number;
      // this.txtNOTBEFORE = data.not_before;
      // this.txtNOTAFTER = data.not_after;
      // this.txtRAWDATA = data.raw_data;
      // this.txtISSUER = data.issuer;
      // this.txtISSUEBY = data.issue_by;
      // this.txtISSUETO = data.issue_to;
      // this.txtDN_NAME = data.dn_name;
      // this.txtDN_MST = data.dn_mst;

      const dso_process_check_serialno = {
        type: "list",
        selpro: "EI_SEL_6095090_SERIAL_CHECK",
        para: [
          this.selected_company,
          this.txtSerial_Number,
          this.txtNOTBEFORE,
          this.txtNOTAFTER,
        ],
      };
      const check_serial_no_result = await this._dsoCall(
        dso_process_check_serialno,
        "select",
        false
      );

      if (check_serial_no_result[0].STATUS == "1") {

        let data_invoice = [];
        for(let i = 0; i < jsonXML.length; i++)
        {
          data_invoice.push({
              req_key: jsonXML[i].req_key,
              token_serial_number: data.serial_number,
              sign_tax_code: data.dn_mst,
              sign_by: data.dn_name,
              xml_signed: jsonXML[i].xml,
          });
        }

        let res_send = await this.$axios.$post("/einvoice/send-invoice-at", {
          responseType: "json",
          invoices: data_invoice,
        });

        if(res_send.success)
        {
          this.funcSearch();
            this.showNotification("success", "Send invoice to Tax Office was Successfully!", "");

        } else {
            this.funcSearch();
            this.showNotification("danger", "Send invoice to Tax Office was Faile!");
        }
        
      } else {
        alert("Token not suitable !!!");
      }
      
    },

    async onPreviewXml(){
      if(this.tei_einvoice_m_pk_row != "")
      {
        if (!this.maGD) {
            this.invoice = [];
            this.invoice.push({
              PK : this.tei_einvoice_m_pk_row,
              USER_ID : this.user.USER_ID,
            });

            let res = await this.$axios.$post("/einvoice/general-invoice-xml", {
                responseType: "json",
                list_invoice: this.invoice,
              });
            console.log("res  ", res);
            if (res.success && res.data.length) {
              this.xmlUrl = res.data[0].xml;
              await this.$nextTick();
              this.isProcessing = false;
              this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
            }else {
            this.showNotification("danger", res.message);
          }
        }
        else
        {
          try {
            this.xmlUrl = this.xml_signed; //new Blob([byteArray], { type: _typeFile });;
            this.$nextTick(() => {
              this.isProcessing = false;
              this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
            });

            this.isProcessing = false;
          } catch (e) {
            this.isProcessing = false;
            return this.showNotification("danger", e.message);
          }
        }
      }else
      {
        this.showNotification("warning", this.$t("no_row_selected"), '');
      }
    },

    async onPreview() {
      if(this.tei_einvoice_m_pk_row != "")
      {
        if( Number(this.selected_company) < 943 )
        {
          let res_url = await this.$axios.$post("/einvoice/view-pdf", {
              responseType: "json",
              rep_key: this.tei_einvoice_m_pk_row,
              type: "C"
            });
          if(res_url.success)
          {
            this.pdfUrl = res_url.data;
            this.$nextTick(() => {
              this.isProcessing = false
              this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
            });
          }
        }else
        {
          let res_url = await this.$axios.$post("/einvoice/general-url-pdf", {
              responseType: "json",
              tei_wt_sale_bill_pk: this.tei_einvoice_m_pk_row,
            });
          if(res_url.success)
          {
            this.pdfUrl = res_url.data;

            this.$nextTick(() => {
              this.isProcessing = false
              this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
            });
          }
        }
      }else
      {
        this.showNotification("warning", this.$t("no_row_selected"), '');
      }
    },

    onAfterLoad() {
      let gridArray = [];
      this.tot_net_tr_amt = 0;
      this.tot_net_bk_amt = 0;
      this.tot_net_tr_vat_amt = 0;
      this.tot_net_bk_vat_amt = 0;
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
      this.maGD = data.CQT_MAGD;
      this.xml_signed = data.SIGN_XML;
    },

    onClickExport(obj) {
      this.$refs.gridview.exportExcel();
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


      const TrandingTypeList = await this._getCommonCode2(["ACEI0040"], this.user.PK);
      this.trading_type_list = TrandingTypeList[0];
      

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
            selpro: "EI_SEL_6095090_FORM_NO",
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
            selpro: "EI_SEL_6095090_SERIAL_NO",
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

    penManualDialogPDF() {
      if (this.hasForm) {
        if (this.manualIsMinimizedPDF) {
          this.manualIsMinimizedPDF = false;
          this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
        } else {
          this.dialogIsShow = true;
        }
      }
    },

    restoreManualDialogPDF() {
      this.manualIsMinimizedPDF = false;
      this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
    },

    openManualDialog() {
      if (this.hasForm) {
        if (this.manualIsMinimized) {
          this.manualIsMinimized = false;
          this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
        } else {
          this.dialogIsShow = true;
        }
      }
    },

    restoreManualDialog() {
      this.manualIsMinimized = false;
      this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
    },
  },
};
</script>
