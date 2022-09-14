<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-card>
      <v-row dense justify="space-between">
        <v-col cols="12">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container fluid class="">
                  <v-row dense justify="space-between">
                    <v-col cols="12">
                      <v-row>
                        <!-- <v-col lg="2" cols="12">
                          <BaseSelect
                            :label="$t('company')"
                            v-model="selected_company"
                            :lstData="company_list"
                            item-text="PARTNER_NAME"
                            item-value="TCO_COMPANY_PK"
                          />
                        
                        </v-col> -->
                       
                         <v-col lg="2" cols="12">
                          <BaseDatePicker
                            :outlined="false"
                            default
                            :label="$t('date_from')"
                            v-model="dt_from"
                          />
                        </v-col>
                        <v-col lg="2" cols="12">
                          <BaseDatePicker
                            :outlined="false"
                            default
                            :label="$t('date_to')"
                            v-model="dt_to"
                          />
                        </v-col>
                              <v-col lg="1" cols="12">
                          
                          <BaseInput
                            :label="$t('invoice_no')"
                            v-model="invoice_no"
                          />
                        </v-col>
                         <v-col lg="1" cols="12">
                          <BaseInput :label="$t('sale_company')" v-model="company" />
                         
                        </v-col>
                        <v-col lg="1" cols="12">
                          <BaseInput :label="$t('tax_code')" v-model="tax_code" />
                         
                        </v-col>
                           <v-col lg="1" cols="12">
                          
                          <BaseInput
                            :label="$t('buyer_company')"
                            v-model="buyer_company"
                          />
                        </v-col>
                           <v-col lg="1" cols="12">
                          
                          <BaseInput
                            :label="$t('buyer_tax_code')"
                            v-model="buyer_tax_code"
                          />
                        </v-col>
                         <v-col lg="1" cols="12">
                          <BaseSelect
                            :label="$t('serial_no')"
                            v-model="selected_serial_no"
                            :lstData="serial_no_list"
                            item-text="NAME"
                            item-value="CODE"
                          />
                        </v-col>
                         <v-col lg="1" cols="12">
                          <BaseSelect
                            :label="$t('form_no')"
                            v-model="selected_form_no"
                            :lstData="form_no_list"
                            item-text="NAME"
                            item-value="CODE"
                          />
                        </v-col>
                        <v-col
                          lg="1"
                          cols="12"
                          dense
                          class="d-flex text-right"
                          justify="end"
                        >
                         <BaseButton
                icon_type="search"
                btn_type="icon"
                :btn_text="$t('search')"
                :disabled="isProcessing"
                @onclick="onSearch"
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
    
      </v-row>
      <v-row dense align="stretch" justify="space-between">
        <v-col cols="12">
          <v-card outlined :height="masterContainerHeight">
            <v-container fluid class="">
              <BaseGridView
                ref="grdEinvoiceInfo"
                :header="grdHeader"
                sel_procedure="AC_SEL_6095330_SEL_TEI_EINVOICE_INFO"
                :multiselect="true"
                :headertype="1"
                :filter_paras="[this.selected_serial_no,this.selected_form_no,this.dt_from,this.dt_to,this.invoice_no,this.company,this.tax_code,this.buyer_company,this.buyer_tax_code]"
                :height="gridHeight"
                @cellClick="onCellClick"
              />
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card> </v-card>
  </v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
import moment from "moment";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: {},
  /*############### data ##########################*/
  data: () => ({
    // selected_company: null,
    // company_list: null,


    selected_serial_no: null,
    serial_no_list: null,

    selected_form_no: null,
    form_no_list: null,


    dt_from: null,
    dt_to: null,

    invoice_no: null,
    company:null,
    tax_code: null,
    buyer_company: null,
    buyer_tax_code: null,
 
  }),
  /*############### created #######################*/
  created() {

    this.getCode()
  },
  /*############### watch ######################*/
  watch: {

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
    grdHeader() { return[
       {field:"AMT_EXCLUDE_VAT",width:40,title:"AMT_EXCLUDE_VAT",alignment:"right",type:"number"},
{field:"AMT_EXCLUDE_VAT_BOOK",width:100,title:"AMT_EXCLUDE_VAT_BOOK",alignment:"right",type:"number"},
{field:"AMT_IN_WORD",width:120,title:"AMT_IN_WORD",alignment:"left",type:"text"},
{field:"AMT_INCLUDE_VAT",width:200,title:"AMT_INCLUDE_VAT",alignment:"right",type:"number"},
{field:"AMT_INCLUDE_VAT_BOOK",width:120,title:"AMT_INCLUDE_VAT_BOOK",alignment:"right",type:"number"},
{field:"AMT_VAT",width:90,title:"AMT_VAT",alignment:"right",type:"number"},
{field:"AMT_VAT_BOOK",width:100,title:"AMT_VAT_BOOK",alignment:"right",type:"number"},
{field:"BUYER_ADDRESS",width:80,title:"BUYER_ADDRESS",alignment:"left",type:"text"},
{field:"BUYER_COMPANY_NAME",width:90,title:"BUYER_COMPANY_NAME",alignment:"left",type:"text"},
{field:"BUYER_NAME",width:130,title:"BUYER_NAME",alignment:"left",type:"text"},
{field:"BUYER_TAXCODE",width:130,title:"BUYER_TAXCODE",alignment:"left",type:"text"},
{field:"CATEGORY_TYPE",width:210,title:"CATEGORY_TYPE",alignment:"left",type:"text"},
{field:"CRT_BY",width:210,title:"CRT_BY",alignment:"left",type:"text"},
{field:"CRT_DT",width:120,title:"CRT_DT",alignment:"left",type:"text"},
{field:"CURRENCY",width:150,title:"CURRENCY",alignment:"center",type:"text"},
{field:"CUSTOMFIELD1",width:170,title:"CUSTOMFIELD1",alignment:"center",type:"text"},
{field:"CUSTOMFIELD10",width:150,title:"CUSTOMFIELD10",alignment:"left",type:"text"},
{field:"CUSTOMFIELD2",width:150,title:"CUSTOMFIELD2",alignment:"left",type:"text"},
{field:"CUSTOMFIELD3",width:150,title:"CUSTOMFIELD3",alignment:"left",type:"text"},
{field:"CUSTOMFIELD4",width:50,title:"CUSTOMFIELD4",alignment:"left",type:"text"},
{field:"CUSTOMFIELD5",width:50,title:"CUSTOMFIELD5",alignment:"left",type:"text"},
{field:"CUSTOMFIELD6",width:50,title:"CUSTOMFIELD6",alignment:"left",type:"text"},
{field:"CUSTOMFIELD7",width:50,title:"CUSTOMFIELD7",alignment:"left",type:"text"},
{field:"CUSTOMFIELD8",width:50,title:"CUSTOMFIELD8",alignment:"left",type:"text"},
{field:"CUSTOMFIELD9",width:50,title:"CUSTOMFIELD9",alignment:"left",type:"text"},
{field:"DELIVERY_ADDRESS",width:50,title:"DELIVERY_ADDRESS",alignment:"left",type:"text"},
{field:"DGIA",width:50,title:"UNITPRICE",alignment:"right",type:"number"},
{field:"DISPLAY_SEQ",width:50,title:"DISPLAY_SEQ",alignment:"right",type:"number"},
{field:"DVTINH",width:50,title:"UNITOFMEASURE",alignment:"left",type:"text"},
{field:"EX_RATE",width:50,title:"EX_RATE",alignment:"right",type:"number"},
{field:"FORM_NO",width:50,title:"FORM_NO",alignment:"left",type:"text"},
{field:"GCHU",width:50,title:"DESCRIPTION",alignment:"left",type:"text"},
{field:"INVOICE_DATE",width:50,title:"INVOICE_DATE",alignment:"left",type:"text"},
{field:"INVOICE_NO",width:50,title:"INVOICE_NO",alignment:"left",type:"text"},
{field:"KHMSHDCLQUAN",width:50,title:"SERIAL_NO_RELATIVE",alignment:"left",type:"text"},
{field:"LHDCLQUAN",width:50,title:"INVOICETYPERELATIVE",alignment:"left",type:"text"},
{field:"MASTER_INVOICE_PK",width:50,title:"MASTER_INVOICE_PK",alignment:"left",type:"text"},
{field:"MHHDVU",width:50,title:"ITEMCODE",alignment:"left",type:"text"},
{field:"MOD_BY",width:50,title:"MOD_BY",alignment:"left",type:"text"},
{field:"MOD_DT",width:50,title:"MOD_DT",alignment:"left",type:"text"},
{field:"NLHDCLQUAN",width:50,title:"INVOICE_DATE_RELATIVE",alignment:"left",type:"text"},
{field:"PAYMENT_METHOD",width:50,title:"PAYMENT_METHOD",alignment:"left",type:"text"},
{field:"PK",width:50,title:"PK",alignment:"left",type:"text"},
{field:"PO_NUMBER",width:50,title:"PO_NUMBER",alignment:"left",type:"text"},
{field:"PROCESS_YN",width:50,title:"PROCESS_YN",alignment:"left",type:"text"},
{field:"SALE_ADDRESS",width:50,title:"SALE_ADDRESS",alignment:"left",type:"text"},
{field:"SALE_COMPANY_NAME",width:50,title:"SALE_COMPANY_NAME",alignment:"left",type:"text"},
{field:"SALE_PHONE",width:50,title:"SALE_PHONE",alignment:"left",type:"text"},
{field:"SALE_TAXCODE",width:50,title:"SALE_TAXCODE",alignment:"left",type:"text"},
{field:"SERIAL_NO",width:50,title:"SERIAL_NO",alignment:"left",type:"text"},
{field:"SHDCLQUAN",width:50,title:"INVOICE_NO_RELATIVE",alignment:"left",type:"text"},
{field:"SLUONG",width:50,title:"QUANTITY",alignment:"right",type:"number"},
{field:"STCKHAU",width:50,title:"COMMISSIONAMOUNT",alignment:"right",type:"number"},
{field:"STT",width:50,title:"SEQUENCE",alignment:"right",type:"number"},
{field:"TAX_AGENCY_CODE",width:50,title:"TAX_AGENCY_CODE",alignment:"left",type:"text"},
{field:"TCHAT",width:50,title:"NATURE",alignment:"right",type:"number"},
{field:"TCHDON",width:50,title:"INVOICEKIND",alignment:"right",type:"number"},
{field:"THHDVU",width:50,title:"ITEMNAME",alignment:"left",type:"text"},
{field:"THTIEN",width:50,title:"AMOUNT",alignment:"right",type:"number"},
{field:"THTIEN_BOOK",width:50,title:"AMOUNT_BOOK",alignment:"right",type:"number"},
{field:"THTIEN_VAT",width:50,title:"AMOUNT_VAT",alignment:"right",type:"number"},
{field:"THTIEN_VAT_BOOK",width:50,title:"AMOUNT_VAT_BOOK",alignment:"right",type:"number"},
{field:"TLCKHAU",width:50,title:"COMMISSIONRATE",alignment:"right",type:"number"},
{field:"TSUAT",width:50,title:"TAXRATE",alignment:"right",type:"number"},
{field:"VAT_RATE",width:50,title:"VAT_RATE",alignment:"right",type:"number"},
{field:"WAREHOUSE_ID",width:50,title:"WAREHOUSE_ID",alignment:"left",type:"text"},
{field:"YYYYMMDD",width:50,title:"YYYYMMDD",alignment:"left",type:"text"},
      ]},
  },
  /*############### mounted #######################*/
  mounted() {},

  /*############### methods #######################*/
  methods: {
    async getCode(){
         const dso_form_no_list = await this._getCommonCode("ACEIS010");
           // console.log(dso_form_no_list)
           if (dso_form_no_list != null) {
             this.form_no_list=dso_form_no_list
             this.selected_form_no = dso_form_no_list[0].CODE;
           }

    },
    onSearch(){
      this.$refs.grdEinvoiceInfo.loadData();
    }
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
