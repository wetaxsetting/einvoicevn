<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-card>
      <v-row dense justify="space-between" class="py-0">
        <v-col cols="7">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container>
                  <v-row dense justify="space-between">
                    <v-col cols="12">
                      <v-row class="py-0">
                        <v-col lg="6" cols="12">
                          <BaseSelect
                            :label="$t('company')"
                            v-model="selected_company"
                            :lstData="company_list"
                            item-text="NAME"
                            item-value="VAL"
                          />
                        </v-col>
                        <v-col lg="6" cols="12" class="py-0">
                          <v-row class="py-0">
                            <v-col lg="4">
                              <BaseSelect
                                :label="$t('send_status')"
                                v-model="selected_status"
                                :lstData="status_list"
                                item-text="NAME"
                                item-value="VAL"
                              />
                            </v-col>
                            <v-col lg="4">
                              <BaseInput
                                :label="$t('invoice_no')"
                                v-model="invoice_no"
                              />
                            </v-col>
                            <v-col lg="4">
                              <BaseInput
                                :label="$t('partner')"
                                v-model="partner"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col lg="3" cols="12">
                          <BaseSelect
                            :label="$t('send_limit')"
                            v-model="selected_send_limit"
                            :lstData="send_limit_list"
                            item-text="NAME"
                            item-value="VAL"
                          />
                        </v-col>
                        <v-col lg="3" cols="12">
                          <BaseSelect
                            :label="$t('trading_type')"
                            v-model="selected_trading_type"
                            :lstData="trading_type_list"
                            item-text="NAME"
                            item-value="VAL"
                          />
                        </v-col>
                        <v-col lg="3" cols="12">
                          <BaseDatePicker
                            :outlined="false"
                            default
                            :label="$t('date_from')"
                            v-model="dt_from"
                          />
                        </v-col>
                        <v-col lg="3" cols="12">
                          <BaseDatePicker
                            :outlined="false"
                            default
                            :label="$t('date_to')"
                            v-model="dt_to"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="5">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container>
                  <v-row dense align="center" justify="space-between">
                    <v-col cols="12">
                      <v-row>
                        <v-col
                          lg="12"
                          cols="12"
                          dense
                          class="d-flex text-right"
                          justify="end"
                        >
                          <BaseButton
                            icon_type="search"
                            :btn_text="$t('search')"
                            :disabled="isProcessing"
                            @onclick="onSearch"
                          />
                          <BaseButton
                            :btn_text="$t('preview')"
                            @onclick="onPreview"
                            :disabled="isProcessing"
                          />
                          <BaseButton
                            :btn_text="$t('debit_note')"
                            @onclick="debitNote"
                            :disabled="isProcessing"
                          />
                          <BaseButton
                            :btn_text="$t('send_mail')"
                            @onclick="sendMail"
                            :disabled="isSending"
                          />
                          <!-- <BaseCheckbox
                            :label="$t('check_all')"
                            v-model="check_all"
                            true-value="Y"
                            false-value="N"
                          /> -->
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense align="stretch" justify="space-between">
        <v-col cols="12">
          <v-card outlined :height="masterContainerHeight">
            <v-container fluid class="">
              <!-- :selectionmode="'checkbox'" -->
              <BaseGridView
                ref="grdSendMail"
                :header="grdHeader"
                sel_procedure="EI_SEL_6095100_SEL_DATA"
                :multiselect="true"
                @onSelectionDataChanged="onGridSelectionChanged"
                :selectionmode="'checkbox'" 
                :autocheckbox="false"
                :headertype="1"
                :filter_paras="[
                  this.dt_from,
                  this.dt_to,
                  this.partner,
                  this.invoice_no,
                  this.selected_company,
                  this.selected_trading_type,
                  this.selected_status,
                  this.selected_send_limit,
                ]"
                :height="gridHeight"
                @cellClick="onCellClick"
                upd_procedure="EI_UPD_6095100"
                :editable="true"
                :update_paras="[
                  this.PK_list,
                  this.selected_company,
                  this.count_send,
                  this.Email_Address_list,
                  this.Email_Address_cc_list,
                ]"
              />
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card> </v-card>
        <view-einvoice-pdf-dialog
      ref="ViewEInvoicePDFDialog"
      :src_pdfUrl="pdfUrl"
    ></view-einvoice-pdf-dialog>
  </v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
import moment from "moment";
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: { "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog },
  /*############### data ##########################*/
  data: () => ({
    selected_company: null,
    company_list: null,

    selected_status: null,
    status_list: null,

    selected_trading_type: null,
    trading_type_list: null,

    selected_send_limit: null,
    send_limit_list: null,

    dt_from: null,
    dt_to: null,

    invoice_no: null,
    check_all: null,
    partner: null,

    selected_rows: [],
    mail: [],
    PK_list: "",
    Email_Address_list: "",
    Email_Address_cc_list: "",

    l_seq: null,
    count_send: null,
    count_send_error: null,

    isSending: false,
    pdfUrl: "",
    tei_einvoice_m_pk_row:""
  }),
  /*############### created #######################*/
  created() {
    this.getListCodes();
      this.html_handler = require("./js/EiExcelHandler.js");
      if(!!this.html_handler) {
          Object.assign(this, this.html_handler.default);
      }
  },
  /*############### watch ######################*/
  watch: {
    // lst_line: async function () {
    //   // const machineMtCC = await this._callProcedure(
    //   //   "mes_sel_meca020_select_machine_mt_comcode",
    //   //   [this.lst_line]
    //   // );
    //     const machineMtCC = await this._getCommonCode("MTYPE");
    //   console.log(machineMtCC)
    //   this.mt_comcode = machineMtCC[0].mt_comcode;
    // },
  },
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    gridHeight() {
      return this.formContainerHeight - 200;
    },
    masterContainerHeight() {
      return this.formContainerHeight - 200;
    },
    grdHeader() {
      return [     {field:"PK",width:20,title:this.$t("PK"),alignment:"left",type:"text",visible: false},
{field:"CHK",width:40,title:this.$t("chk"),alignment:"right",type:"text",visible: false},
{field:"RN",width:40,title:this.$t("No"),alignment:"right",type:"text"},
{field:"TR_DATE",width:100,title:this.$t("TransDate"),alignment:"left",type:"text"},
{field:"CUS_CD",width:80,title:this.$t("CustomerID"),alignment:"left",type:"text"},
{field:"CUS_NM",width:200,title:this.$t("Customername"),alignment:"left",type:"text"},
{field:"CUS_FNM",width:150,title:this.$t("Customername"),alignment:"left",type:"text"},
{field:"TAX_CODE",width:150,title:this.$t("TaxCode"),alignment:"left",type:"text"},
{field:"BUYER_NAME",width:150,title:this.$t("Buyername"),alignment:"left",type:"text"},
{field:"ORM_NO",width:120,title:this.$t("FormNo"),alignment:"left",type:"text"},
{field:"SERIAL_NO",width:90,title:this.$t("SerialNo"),alignment:"left",type:"text"},
{field:"INVOICE_NO",width:100,title:this.$t("InvoiceNo"),alignment:"left",type:"text"},
{field:"TR_CCY",width:80,title:this.$t("Currency"),alignment:"left",type:"text"},
{field:"R_RATE",width:90,title:this.$t("Ex.rate"),alignment:"right",type:"number"},
{field:"TOT_NET_TR_AMT",width:130,title:this.$t("Amount(Trans)"),alignment:"right",type:"number"},
{field:"TOT_NET_BK_AMT",width:130,title:this.$t("Amount(Books)"),alignment:"right",type:"number"},
{field:"REMARK",width:210,title:this.$t("Description"),alignment:"left",type:"text"},
{field:"REMARK2",width:210,title:this.$t("LocalDescription"),alignment:"left",type:"text"},
{field:"EI_STATUS",width:120,title:this.$t("EI.Status"),alignment:"left",type:"text",visible: false},
{field:"SIGN_BY",width:150,title:this.$t("Signname"),alignment:"left",type:"text"},
{field:"SIGN_DT",width:170,title:this.$t("Signdate"),alignment:"left",type:"text"},
{field:"INVOICE_TYPE",width:150,title:this.$t("InvoiceType"),alignment:"left",type:"text"},
{field:"TAC_CRCA_PK",width:150,title:this.$t("tac_crca_pk"),alignment:"left",type:"text",visible: false},
{field:"SEND_EMAIL_YN",width:150,title:this.$t("SendemailY/N"),alignment:"left",type:"text"},
{field:"CONVERT_YN",width:150,title:this.$t("convert_yn"),alignment:"left",type:"text"},
{field:"REPORT_CODE",width:150,title:this.$t("report_code"),alignment:"left",type:"text",visible: false},
{field:"SEND_DATE",width:150,title:this.$t("SendDate"),alignment:"left",type:"text"},
{field:"SEND_BY",width:150,title:this.$t("SendBy"),alignment:"left",type:"text"},
{field:"EI_STATUS_V",width:150,title:this.$t("SendBy"),alignment:"left",type:"text"},
{field:"PARTNER_PK",width:150,title:this.$t("PartnerPK"),alignment:"left",type:"text",visible: false},
{field:"MAIL",width:200,title:this.$t("Mail"),alignment:"left",type:"text"},
{field:"EMAIL_ADDRESS_CC",width:200,title:this.$t("MailCC"),alignment:"left",type:"text"},
{field:"BODY_1_MAIL",width:500,title:this.$t("Body1Mail"),alignment:"left",type:"text"},
{field:"BODY_2_MAIL",width:500,title:this.$t("Body2Mail"),alignment:"left",type:"text"},
{field:"SUBJECT",width:200,title:this.$t("Subject"),alignment:"left",type:"text"},
{field:"OLD_YN",width:20,title:this.$t("OldYN"),alignment:"left",type:"text",visible: false},];
    },
  },
  /*############### mounted #######################*/
  mounted() {},

  /*############### methods #######################*/
  methods: {
    debitNote(){},
    async onPreview(){
      this.isProcessing=true
      this.pdfUrl = await this.pdfUrlGetter(this.tei_einvoice_m_pk_row);
      this.$nextTick(() => {
        this.isProcessing=false
        this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      });
    },

    async onSearch() {
      this.$refs.grdSendMail.loadData();
    },
    async getListCodes() {
      let company = await this._callProcedure("EI_SEL_6095100_SEL_LIST", [
        this.user.PK,
      ]);
      this.company_list = company;
      this.selected_company = this.company_list[0].VAL;

      let tradingType = await this._callProcedure(
        "EI_SEL_6095100_SEL_TRADING_TYPE"
      );
      this.trading_type_list = tradingType;
      //this.trading_type_list.unshift({ VAL: "", NAME: this.$t("select_all") });
      this.selected_trading_type = this.trading_type_list[0].VAL;

      let sendStatus = await this._callProcedure(
        "EI_SEL_6095100_SEL_SEND_STATUS"
      );
      this.status_list = sendStatus;
      // this.status_list.unshift({ VAL:'', NAME:this.$t("select_all") });
      this.selected_status = this.status_list[0].VAL;

      let count = await this._callProcedure("EI_SEL_6095100_SEL_COUNT");
      this.send_limit_list = count;
      this.selected_send_limit = this.send_limit_list[0].VAL;
    },

    async onGridSelectionChanged(data) {
      // console.log(data)
      this.selected_rows = data;
    },
     async onCellClick({ column, data, rowIndex, rowType }) {
       this.tei_einvoice_m_pk_row=data.PK
    },
    async sendMail() {
      this.isSending = true;
      var tei_einvoice_m_pk = "",
        tei_company_pk = "";
      this.PK_list = "";
      this.Email_Address_list = "";
      this.Email_Address_cc_list = "";
      this.l_seq = "";

      //btnSend.SetEnable(false);*********************************************

      for (let i = 0; i < this.selected_rows.length; i++) {
        if (this.selected_rows[i].MAIL == "") {
          alert(
            "Khách hàng " +
              this.selected_rows[i].CUS_CD +
              "  " +
              this.selected_rows[i].CUS_NM +
              " chưa được đăng ký mail người nhận !!"
          );
        } else {
          if (
            this.selected_company == "181" ||
            this.selected_company == "482" ||
            this.selected_company == "101" ||
            this.selected_company == "1" ||
            this.selected_company == "503" ||
            this.selected_company == "442" ||
            (this.selected_company == "221" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "263" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "502" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "462" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "201" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "301" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "422" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "382" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "583" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "602" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "622" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "642" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "643" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "362" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "321" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "161" &&
              this.selected_rows[i].OLD_YN == "N") ||
            (this.selected_company == "341" &&
              this.selected_rows[i].OLD_YN == "N") ||
            this.selected_company == "281" ||
            this.selected_company == "682"
          ) {
            this.l_seq += this.selected_rows[i].PK + "|";
            let tmpObj = {
              pk: this.selected_rows[i].PK,
               mail:this.selected_rows[i].MAIL,
              //mail: "tuan.tran@genuwinsolution.com",
              email_address_cc: this.selected_rows[i].EMAIL_ADDRESS_CC,
              body_mail:
                this.selected_rows[i].BODY_1_MAIL +
                this.selected_rows[i].BODY_2_MAIL,
              subject: this.selected_rows[i].SUBJECT,
              attachfile1:await this.pdfUrlGetter(this.selected_rows[i].PK),
                // "http://genuclouding.com/wseinvoice/BSService.asmx/Download_File_PDF?pk=" +
                // this.selected_rows[i].PK,
              attachfile2: await this.xmlUrlGetter(this.selected_rows[i].PK),
                // "http://genuclouding.com/wseinvoice/BSService.asmx/Download_File_XML_v4?pk=" +
                // this.selected_rows[i].PK,
              filename1:
                this.selected_rows[i].FORM_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].SERIAL_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].INVOICE_NO +
                ".pdf",
              filename2:
                this.selected_rows[i].FORM_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].SERIAL_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].INVOICE_NO +
                ".xml",
            };

            this.mail.push(tmpObj);
          } else {
            this.l_seq += this.selected_rows[i].PK + "|";
            let tmpObj = {
              pk: this.selected_rows[i].PK,
               mail:this.selected_rows[i].MAIL,
              //mail: "tuan.tran@genuwinsolution.com",
              email_address_cc: this.selected_rows[i].EMAIL_ADDRESS_CC,
              body_mail:
                this.selected_rows[i].BODY_1_MAIL +
                this.selected_rows[i].BODY_2_MAIL,
              subject: this.selected_rows[i].SUBJECT,
              attachfile1:await this.pdfUrlGetter(this.selected_rows[i].PK),
                // "http://genuclouding.com/wseinvoice/BSService.asmx/Download_File_PDF?pk=" +
                // this.selected_rows[i].PK,
              attachfile2: await this.xmlUrlGetter(this.selected_rows[i].PK),
                // "http://genuclouding.com/wseinvoice/BSService.asmx/Download_File_XML?pk=" +
                // this.selected_rows[i].PK,
              filename1:
                this.selected_rows[i].FORM_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].SERIAL_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].INVOICE_NO +
                ".pdf",
              filename2:
                this.selected_rows[i].FORM_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].SERIAL_NO.replace("/", "") +
                "_" +
                this.selected_rows[i].INVOICE_NO +
                ".xml",
            };

            this.mail.push(tmpObj);
          }
        }
      }
      // jQuery.support.cors = true;
      // // alert(this.l_seq + " - " + this.selected_company);
      // //console.log(this.selected_company)
      // $.ajax({
      //   type: "POST",
      //   url: "http://genuclouding.com/wseinvoice/BSService.asmx/SendPDF_R",
      //   // 	url:"http://localhost:39236/BSService.asmx/SendPDF_R",
      //   data: {
      //     tei_einvoice_m_pk: this.l_seq,
      //     tei_company_pk: this.selected_company,
      //   },
      //   dataType: "text",
      //   crossDomain: true,
      //   success: this.OnSuccessCall,
      //   error: this.OnErrorCall,
      // });
      this.count_send = 0;
      this.onBuildMail();
    },
   async pdfUrlGetter(pk){
    //351913 265263
    // let einvoicePk=351913
     const pdfUrlExcel = await this.getEinvoice(this,pk)
     return pdfUrlExcel
    },
   async xmlUrlGetter(pk){
    const res = await this.$axios.$get("/dso/getfiledbtoken", {params:{ token:'',proc:'EI_SEL_XML_FILE',pk:pk }});
      return res
    },
  
    onBuildMail() {
      if (this.selected_company == "482") {
        jQuery.support.cors = true;
        $.ajax({
          type: "POST",
          url: "http://sendmail.genuwinsolution.com/api/user/sendmailajtotal ",
          data: {
            mail_to: this.mail[this.count_send].mail,
            cc_to: this.mail[this.count_send].email_address_cc,
            subject: this.mail[this.count_send].subject,
            body: this.mail[this.count_send].body_mail,
            attachfile1: this.mail[this.count_send].attachfile1,
            attachfile2: this.mail[this.count_send].attachfile2,
            filename1: this.mail[this.count_send].filename1,
            filename2: this.mail[this.count_send].filename2,
          },

          dataType: "text",
          crossDomain: true,
          success: this.OnSuccessCallBuildMail,
          error: this.OnErrorCallBuildMail,
        });
      } else {
        console.log("abc",this.mail[this.count_send].attachfile1)
        jQuery.support.cors = true;
        $.ajax({
          type: "POST",
          url: "http://sendmail.genuwinsolution.com/api/user/sendmail",
          data: {
            mail_to: this.mail[this.count_send].mail,
            cc_to: this.mail[this.count_send].email_address_cc,
            subject: this.mail[this.count_send].subject,
            body: this.mail[this.count_send].body_mail,
            attachfile1: this.mail[this.count_send].attachfile1,
            attachfile2: this.mail[this.count_send].attachfile2,
            filename1: this.mail[this.count_send].filename1,
            filename2: this.mail[this.count_send].filename2,
          },
          dataType: "text",
          crossDomain: true,
          success: this.OnSuccessCallBuildMail,
          error: this.OnErrorCallBuildMail,
        });
      }
    },
    async OnSuccessCallBuildMail(response) {
      var data = JSON.parse(response);
      if (data.success == true && data.code == "200" && data.message == true) {
        this.PK_list += this.mail[this.count_send].pk + "|";
        this.Email_Address_list += this.mail[this.count_send].mail + "|";
        this.Email_Address_cc_list +=
          this.mail[this.count_send].email_address_cc + "|";
        this.count_send = this.count_send + 1;
        this.count_send_error = 0;
        if (this.count_send < this.mail.length) {
          this.count_send_error = 0;
          this.onBuildMail();
        } else {
          let count = await this._callProcedure("EI_UPD_6095100", [
            this.PK_list,
            this.selected_company,
            this.count_send,
            this.Email_Address_list,
            this.Email_Address_cc_list,
          ]);
          // console.log(count)
          if (Object.values(count[0]) =='SENT FINISHED.') {
            this.$refs.grdSendMail.loadData();
            
          }
          this.isSending = false;
        }
      } else {
        
        let count = await this._callProcedure("EI_UPD_6095100",[this.PK_list,this.selected_company,this.count_send,this.Email_Address_list,this.Email_Address_cc_list]);
               //console.log(count)
              if(Object.values(count[0]) =='SENT FINISHED.'){
                this.$refs.grdSendMail.loadData();
              }
           //   this.showNotification("warning", this.$t("abc"), "", 5000);
        this.isSending = false;
      }
    },
    async OnErrorCallBuildMail(response) {
      let count = await this._callProcedure("EI_UPD_6095100", [
        this.PK_list,
        this.selected_company,
        this.count_send,
        this.Email_Address_list,
        this.Email_Address_cc_list,
      ]);
      // console.log(count)
      if (Object.values(count[0]) =='SENT FINISHED.') {
        this.$refs.grdSendMail.loadData();
      
      }
        this.showNotification("warning", this.$t(response), "", 5000);
        this.isSending = false;
      //this.$refs.grdSendMail.loadData();
      //	dso_process_data_SendEmail.Call();
      //alert(response.status + " - " + response.statusText);
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
