<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-card>
      <v-row dense justify="space-between" class="py-0">
        <v-col cols="8">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container>
                  <v-row dense justify="space-between">
                    <v-col cols="12">
                      <v-row class="py-0">
                        <v-col lg="5" cols="12">
                          <BaseSelect
                            :label="$t('company')"
                            v-model="selected_company"
                            :lstData="company_list"
                            item-text="NAME"
                            item-value="VAL"
                          />
                        </v-col>
                        <v-col lg="7" cols="12" class="py-0">
                          <v-row class="py-0">
                            <v-col lg="4">
                              <BaseSelect
                                :label="$t('status')"
                                v-model="selected_status"
                                :lstData="status_list"
                                item-text="NAME"
                                item-value="VAL"
                              />
                            </v-col>
                              <v-col lg="4" cols="12">
                          <BaseDatePicker
                            :outlined="false"
                            default
                            :label="$t('date_from')"
                            v-model="dt_from"
                          />
                        </v-col>
                        <v-col lg="4" cols="12">
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
                      <v-row>
                        <v-col lg="2" cols="12">
                          <BaseSelect
                           :label="$t('form_no')"
                            item-text="NAME"
                            item-value="VAL"
                            filter_off
                            :lstData="form_no_list"
                            v-model="selected_form_no"
                          />
                        </v-col>
                        <v-col lg="2" cols="12">
                          <BaseSelect
                            :label="$t('serial_no')"
                            item-text="NAME"
                            item-value="VAL"
                            filter_off
                            :lstData="serial_no_list"
                            v-model="selected_serial_no"
                          />
                        </v-col>
                          <v-col lg="2">
                              <BaseInput
                                :label="$t('invoice_no')"
                                v-model="invoice_no"
                              />
                            </v-col>
                            <v-col lg="2">
                              <BaseInput
                                :label="$t('partner')"
                                v-model="partner"
                              />
                            </v-col>
                                <v-col lg="2">
                              <BaseInput
                                :label="$t('trade_cqt')"
                                v-model="trade_cqt"
                              />
                            </v-col>
                            <v-col lg="2">
                              <BaseInput
                                :label="$t('cqt_code')"
                                v-model="cqt_code"
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
        <v-col cols="4">
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
                          class="d-flex"
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
                            :btn_text="$t('cancel_sign')"
                            @onclick="onCancelSign"
                            :disabled="isProcessing"
                          />
                          <BaseButton
                            :btn_text="$t('checking_code_cqt')"
                            @onclick="onCheckingCqt"
                            :disabled="isSending"
                          />
                          <BaseButton
                            :btn_text="$t('report')"
                            @onclick="onReport"
                            :disabled="isProcessing"
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
                ref="grdCancel"
                :header="grdHeader"
                sel_procedure="AC_SEL_6095110_SEL_DATA"
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
                  '',
                  this.selected_status,
                    this.selected_serial_no,
                     this.selected_form_no,
                     this.trade_cqt,
                     this.cqt_code,
                
                ]"
                :height="gridHeight"
                @cellClick="onCellClick"
               
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

    form_no_list: null,
    selected_form_no: null,

    serial_no_list: null,
    selected_serial_no: null,

    dt_from: null,
    dt_to: null,

    invoice_no: null,
    check_all: null,
    partner: null,
    cqt_code:null,
    trade_cqt:null,

    selected_rows: [],
    pdfUrl: "",
    tei_einvoice_m_pk_row:""
  }),
  /*############### created #######################*/
  created() {
    this.getListCodes();
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
      return [   {field:"PK",width:20,title:this.$t("PK"),alignment:"right",type:"text",visible:false},
{field:"RN",width:40,title:this.$t("No"),alignment:"right",type:"text"},
{field:"INVOICE_DATE",width:100,title:this.$t("InvoiceDate"),alignment:"right",type:"text"},
{field:"CUS_CD",width:200,title:this.$t("CustomerID"),alignment:"right",type:"text"},
{field:"CUS_NM",width:200,title:this.$t("Customername"),alignment:"right",type:"text"},
{field:"TAX_CODE",width:200,title:this.$t("TaxCode"),alignment:"right",type:"text"},
{field:"FORM_NO",width:120,title:this.$t("FormNo"),alignment:"right",type:"text"},
{field:"SERIAL_NO",width:90,title:this.$t("SerialNo"),alignment:"right",type:"text"},
{field:"INVOICE_NO",width:100,title:this.$t("InvoiceNo"),alignment:"right",type:"text"},
{field:"TR_CCY",width:80,title:this.$t("Currency"),alignment:"right",type:"text"},
{field:"TR_RATE",width:90,title:this.$t("Ex.rate"),alignment:"right",type:"text"},
{field:"TOT_NET_TR_AMT",width:130,title:this.$t("Amount(Trans)"),alignment:"right",type:"text"},
{field:"TOT_NET_BK_AMT",width:130,title:this.$t("Amount(Books)"),alignment:"right",type:"text"},
{field:"EI_STATUS",width:120,title:this.$t("EI.Status"),alignment:"right",type:"text"},
{field:"SIGN_BY",width:150,title:this.$t("Signname"),alignment:"center",type:"text"},
{field:"SIGN_DT",width:170,title:this.$t("Signdate"),alignment:"center",type:"text"},
{field:"INVOICE_TYPE",width:150,title:this.$t("InvoiceType"),alignment:"left",type:"text"},
{field:"TAC_CRCA_PK",width:150,title:this.$t("tac_crca_pk"),alignment:"left",type:"text",visible:false},
{field:"REPORT_CODE",width:150,title:this.$t("report_code"),alignment:"left",type:"text"},
{field:"MAIL",width:200,title:this.$t("Mail"),alignment:"left",type:"text"},
{field:"EMAIL_ADDRESS_CC",width:200,title:this.$t("MailCC"),alignment:"left",type:"text"},
{field:"BODY_1_MAIL",width:500,title:this.$t("Body1Mail"),alignment:"left",type:"text"},
{field:"BODY_2_MAIL",width:500,title:this.$t("Body2Mail"),alignment:"left",type:"text"},
{field:"BODY_3_MAIL",width:500,title:this.$t("Body3Mail"),alignment:"left",type:"text"},
{field:"SUBJECT",width:200,title:this.$t("Subject"),alignment:"left",type:"text"},
{field:"CQT_MAGD",width:200,title:this.$t("TradeCode"),alignment:"left",type:"text"},
{field:"CQT_MCCQT_ID",width:200,title:this.$t("CQTCode"),alignment:"left",type:"text"},
{field:"CQT_MAGD_CANCEL",width:200,title:this.$t("TradeCodeCancel"),alignment:"left",type:"text"},
{field:"INVOICE_FORM_SYMBOL",width:200,title:this.$t("InvoiceFormSymbol"),alignment:"left",type:"text"},
{field:"CANCEL_REASON",width:200,title:this.$t("CauseCancel"),alignment:"left",type:"text"},


];
    },
  },
  /*############### mounted #######################*/
  mounted() {},

  /*############### methods #######################*/
  methods: {
    onCheckingCqt(){},
    onCancelSign(){},
    async onReport(PK, TCO_BUSPLACE_PK) {
        // let p_param = [PK];
        // let report_no = "01";
        // let report_path = "";
        // let report_name = "";      
        // let excel = [];
        // let report_name_ext = "pdf";


        // switch(report_no) { 
        //   case "01": {
        //     report_path = "report/CS/40/rpt_CS40010_01.xlsx"; 
        //     report_name = "rpt_CS40010_01." + report_name_ext; 


        //     excel = [
        //       //sheet1
        //       {
        //         sheet: 1,               
        //         insertRange: [
        //           { range: "A1:Q3", proc: "CW_RPT_BUSPLACE_INFO", params: [TCO_BUSPLACE_PK]  },//header
        //           { range: "A4:Q23", proc: "CW_RPT_CS40010_01_1", params: [...p_param]  },//master
        //         ],
        //            insertRows: [
        //              {                      
        //                startRow: 16, proc: "CW_RPT_CS40010_01_2", params: [...p_param], stringColumns: [ "ITEM_CODE","ITEM_NAME"],
        //              }
        //             ],
        //       },
        //     ];

        //     break;
        //   }

        //   default: report_path=""; break;
        // }

        // if(!report_path) {
        //   this.showNotification(
        //       "danger",
        //       this.$t("please_select_report"),
        //       "",
        //       4000
        //     );
        //   return;
        // }

        //  const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel), convert: report_name_ext  } }  );

        // if(res){
        //    this._ExcelSaveAs(res, report_name);         
        //  } else {
          
        //    this.showNotification(
        //      "danger",
        //    this.$t("fail_to_export_report"),
        //      "",
        //      4000
        //    );
        //  }

       },
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

    async onSearch() {
      this.$refs.grdCancel.loadData();
    },
    async getListCodes() {
      let company = await this._callProcedure("AC_SEL_6095110_COMPANY", [
        this.user.PK,
      ]);
      this.company_list = company;
      this.selected_company = this.company_list[0].VAL;
///////////////////////////////////////////////////////////
      let formno = await this._callProcedure(
        "AC_SEL_6095110_SEL_FORM_NO",[this.selected_company]
      );
      this.form_no_list = formno;
      this.selected_form_no = this.form_no_list[0].VAL;

      let serialno = await this._callProcedure(
        "AC_SEL_6095110_SEL_SERIAL_NO",[this.selected_company, this.selected_form_no]
      );
      this.serial_no_list = serialno;
      this.selected_serial_no = this.serial_no_list[0].VAL;
/////////////////////////////////////////////////////////////////
      let sendStatus = await this._callProcedure(
        "AC_SEL_6095110_SEL_STATUS"
      );
      this.status_list = sendStatus;
      // this.status_list.unshift({ VAL:'', NAME:this.$t("select_all") });
      this.selected_status = this.status_list[0].VAL;
////////////////////////////////////////////////////
    },
    async onGridSelectionChanged(data) {
      // console.log(data)
      this.selected_rows = data;
    },
     async onCellClick({ column, data, rowIndex, rowType }) {
       this.tei_einvoice_m_pk_row=data.PK
    },

  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
