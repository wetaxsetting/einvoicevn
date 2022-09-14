<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card  tile>
              <v-container fluid class="py-1">
                <v-row dense align="center" justify="space-between">
                  <!-- Company -->
                  <v-col lg="3" sm="6" cols="12">
                    <v-select clearable dense hide-details outlined :label="$t('company')" v-model="lstCompany" :items="companyGroup" item-text="TEXT" item-value="PK" :text_all="$t('all')" ></v-select> 
                  </v-col>
                  <v-col lg="2" sm="6" cols="12">
                    <BaseDatePicker outlined :label="$t('date_from')" readnonly start  v-model="transDateFrom"></BaseDatePicker>
                  </v-col>
                  <v-col lg="2" sm="6" cols="12">
                    <BaseDatePicker outlined :label="$t('date_to')" readnonly end v-model="transDateTo"></BaseDatePicker>
                  </v-col>
                  <v-col lg="2" sm="6" cols="12">
                    <v-text-field clearable dense hide-details outlined :label="$t('serial_no')" v-model="txtSerialNo" ></v-text-field>
                  </v-col>
                  <v-col lg="2" sm="6" cols="12">
                    <v-select clearable dense hide-details outlined :label="$t('status')" v-model="lstStatus" :items="statusGroup" item-text="TEXT" item-value="PK" :text_all="$t('all')" ></v-select> 
                  </v-col>
                  <v-col lg="1" cols="12" class="text-right">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('SEARCH_M')"/>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Tabs & Tab Contents -->
        <v-row no-gutters align="center" justify="start" class="mb-2" >
          <v-col cols="6">
            <v-row dense align="center" justify="space-between">
              <v-col cols="12">
                 <div class="d-flex justify-end">
                    <!-- Add --> 
                    <BaseButton icon_type="add_new" :btn_text="$t('btn_add')" :disabled="isProcessing"  @onclick="onClickButton('NEW_M')" />
                    <!-- Save -->
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"  @onclick="onClickButton('SAVE_M')" />
                    <!-- Delete -->
                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClickButton('DELETE_M')" />
                  </div>
              </v-col>
               <v-col cols="12">
                 <DataGridView column-resizing-mode="widget" 
                  ref="grdMasters" 
                  :auto_load="false"
                  select_mode="Single"
                  :max_height="limitHeight" 
                  :header="headerGridMaster" 
                  :onCellPrepared="onCellPrepared"
                  @row-updated="checkUpdatedItem"
                  @cellClick="onClickButton('SEARCH_D')"
                  sel_procedure="AC_SEL_6095050_MASTERS_NO_CACHE"
                  upd_procedure="AC_UPD_6095050_MASTERS" 
                  :filter_paras="[this.lstCompany,this.transDateFrom,this.transDateTo,this.txtSerialNo,this.lstStatus]"
                  :update_paras="['PK',
                                  'TEI_TEMPLATE_PK',
                                  'INVOICE_TYPE',
                                  'FORM_NO',
                                  'SERIAL_NO',
                                  'INV_QTY',
                                  'FROM_NO',
                                  'TO_NO',
                                  'REMAIN_QTY',
                                  'FROM_DT',
                                  'TO_DT',
                                  'STATUS',
                                  'BIZ_PLACE',
                                  'REMARKS',
                                  'USE_YN',
                                  'TEI_COMPANY_PK']"  
                  
                />
              </v-col>
            </v-row>
            
          </v-col>
          <v-col cols="6">
            <v-row dense align="center" justify="space-between">
              <v-col cols="12">
                 <div class="d-flex justify-end">
                    <!-- Add --> 
                    <BaseButton icon_type="add_new" :btn_text="$t('btn_add')" :disabled="isProcessing"  @onclick="onClickButton('NEW_D')" />
                    <!-- Save -->
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"  @onclick="onClickButton('SAVE_D')" />
                    <!-- Delete -->
                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClickButton('DELETE_D')" />
                    <!-- View -->
                    <BaseButton icon_type="search" :btn_text="$t('view')" :disabled="isProcessing" @onclick="onClickButton('VIEW_D')"/>
                  </div>
              </v-col>
               <v-col cols="12">
                 <DataGridView column-resizing-mode="widget" 
                  ref="grdDetails" 
                  :auto_load="false"
                  select_mode="Single"
                  :max_height="limitHeight" 
                  :header="headerGridDetails" 
                  :onCellPrepared="onCellPrepared"
                  @row-updated="checkUpdatedItem"
                  @cellClick="onClickButton('SEARCH_DD')"
                  sel_procedure="AC_SEL_6095050_DETAILS_NO_CACHE"
                  upd_procedure="AC_UPD_6095050_DETAILS" 
                  :filter_paras="[this.lstCompany,this.transDateFrom,this.transDateTo,this.txtSerialNo,this.txtMastersPK]"
                  :update_paras="['PK',
                                  'TEMPLATE_CD',
                                  'TEMPLATE_NM',
                                  'TEMPLATE_LNM',
                                  'TEMPLATE_FNM',
                                  'FORM_NO',
                                  'REMARKS',
                                  'INV_CONTENT',
                                  'USE_YN',
                                  'TEI_COMPANY_PK',
                                  'VALID_DATE_FROM',
                                  'VALID_DATE_TO',
                                  'REPORT_ID',
                                  'TEI_EINVOICE_ISSUSE_PK',
                                  'TEL',
                                  'FAX',
                                  'ACC_NO',
                                  'ACC_CCY',
                                  'ACC_HOLDER',
                                  'BANK_NAME',
                                  'CONTACT_PERSON',
                                  'REP_PERSON',
                                  'TAX_NAME',
                                  'WEB_SITE',
                                  'TAX_CODE_DISPLAY',
                                  'CONTACT_COM_PHONE',
                                  'BRIEF_COM_NM',
                                  'CONTACT_ADDR',
                                  'CONTACT_EMAIL',
                                  'CONTACT_MOBI',
                                  'WEBSITE_EI']"  
                  
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('OPTION')"></confirm-dialog>
    <view-e-invoice-dialog ref="viewEInvoiceDialog" @onConfirm="onClickButton('OPTION')" :reportID="params" ></view-e-invoice-dialog>
  </v-container>
</template>

<script>
const findValueDeep = require('deepdash/findValueDeep');
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import ViewEInvoiceDialog from "@/components/dialog/ViewEInvoiceDialog";
import moment from "moment";
export default {
  layout: 'default',
  middleware: 'user',

  components: {
    DatePicker:    ()    => import("@/components/control/DatePicker"),
    ConfirmDialog,
    ViewEInvoiceDialog
  },
  data: () => ({
    txtCompanyName:"",
    dxg_gridCompany:[],
    objClick:"",
    lstCompany:"",
    companyGroup:[],
    transDateFrom:"",
    transDateTo:"",
    lstStatus:"",
    statusGroup:[],
    txtCustomerName:"",
    txtSerialNo:"",
    txtMastersPK:"",
    txtDetailsPK:"",
    txtReportIDType:"",
    params:{},
    reportIDPK:"",
    reportIDType:""


  }),

  created() {
    this.getListCodes();
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { if(this.$vuetify.breakpoint.smAndUp) 
                        {  return   510}  },// this.windowHeight },
    headerGridDetails() {
      const self = this;
      return [
      {   
        dataField: "PK", 
        width:0,
        caption: this.$t('pk') 
      },    
      { 
        dataField: "TEMPLATE_CD", 
        width:80,
        caption: this.$t('template_cd'),
      },
      { 
        dataField: "TEMPLATE_NM", 
        caption: this.$t('template_nm') 
      },
      { 
        dataField: "TEMPLATE_LNM", 
        caption: this.$t('template_lnm'),
      },
      { 
        dataField: "TEMPLATE_FNM", 
        caption: this.$t('template_fnm'),
      },
       { 
        dataField: "FORM_NO", 
        caption: this.$t('form_no') 
      },
       { 
        dataField: "REMARKS", 
        caption: this.$t('remarks') 
      },
      { 
        dataField: "INV_CONTENT", 
        caption: this.$t('inv_content') ,
      },
      { 
        dataField: "USE_YN", 
        caption: this.$t('use_yn') ,
        cssClass: "cell-align-center",
        dataType: "checkbox"
      },
      { 
        dataField: "TEI_COMPANY_PK", 
        caption: this.$t('tei_company_pk'),
      },
      { 
        dataField: "VALID_DATE_FROM", 
        caption: this.$t('valid_date_from'),
        dataType: "date",
        cssClass: "cell-align-center",
      },
      { 
        dataField: "VALID_DATE_TO",        
        caption: this.$t('valid_date_to'),
      },
      { 
        dataField: "REPORT_ID", 
        caption: this.$t('report_id'),
      },
      { 
        dataField: "TEL", 
        caption: this.$t('tel'),
      },
      { 
        dataField: "FAX",
        caption: this.$t('fax'),
        
      },
      { 
        dataField: "ACC_NO",
        caption: this.$t('acc_no'),
        
      },
      { 
        dataField: "ACC_CCY",
        caption: this.$t('acc_ccy'),
        
      },{ 
        dataField: "ACC_HOLDER",
        caption: this.$t('acc_holder'),
        
      },
      { 
        dataField: "BANK_NAME",
        caption: this.$t('bank_name'),
        
      },{ 
        dataField: "CONTACT_PERSON",
        caption: this.$t('contact_person'),
        
      },
      { 
        dataField: "REP_PERSON",
        caption: this.$t('rep_person'),
        
      },{ 
        dataField: "TAX_NAME",
        caption: this.$t('tax_name'),
        
      },
      { 
        dataField: "REMARKS_V2",
        caption: this.$t('remarks_v2'),
        
      },
      { 
        dataField: "ERP_COMPANY_PK",
        caption: this.$t('erp_company_pk'),
        
      },{ 
        dataField: "ERP_COMPANY_NAME",
        caption: this.$t('fax'),
        
      },
      { 
        dataField: "USE_Y1", 
        caption: this.$t('use_yn1') ,
        cssClass: "cell-align-center",
        dataType: "checkbox"
      },
      { 
        dataField: "WEB_SITE",
        caption: this.$t('web_site'),
        
      },
      { 
        dataField: "TAX_CODE_DISPLAY",
        caption: this.$t('tax_code_display'),
        
      },
      { 
        dataField: "CONTACT_COM_PHONE",
        caption: this.$t('contact_com_phone'),
        
      },
      { 
        dataField: "BRIEF_COM_NM",
        caption: this.$t('brief_com_nm'),
        
      },
      { 
        dataField: "CONTACT_ADDR",
        caption: this.$t('contact_addr'),
        
      },
      { 
        dataField: "CONTACT_EMAIL",
        caption: this.$t('contact_email'),
        
      },
      { 
        dataField: "CONTACT_MOBI",
        caption: this.$t('contact_mobi'),
        
      },
      { 
        dataField: "WEBSITE_EI",
        caption: this.$t('website_ei'),
        
      },
      { 
        dataField: "TEI_EINVOICE_ISSUSE_PK",
        caption: this.$t('tei_einvoice_issuse_pk'),
        
      }
      ]
    },
    headerGridMaster() {
      const self = this;
      return [
      {   
        dataField: "PK", 
        width:0,
        caption: this.$t('pk') 
      },
      { 
        dataField: "TEI_TEMPLATE_PK", 
        width:0,
        caption: this.$t('tei_template_pk') 
      },     
      { 
        dataField: "INVOICE_TYPE", 
        width:80,
        cssClass: "cell-align-center",
        caption: this.$t('invoice_type'),
      },
      { 
        dataField: "FORM_NO", 
        caption: this.$t('form_no') 
      },
      { 
        dataField: "SERIAL_NO", 
        caption: this.$t('serial_no'),
        width:80 
      },
      { 
        dataField: "INV_QTY", 
        caption: this.$t('inv_qty'),
        width:80
      },
       { 
        dataField: "FROM_NO", 
        caption: this.$t('from_no') 
      },
       { 
        dataField: "TO_NO", 
        caption: this.$t('to_no') 
      },
      { 
        dataField: "REMAIN_QTY", 
        caption: this.$t('remain_qty') ,
        width:80
      },
      { 
        dataField: "FROM_DT", 
        caption: this.$t('from_dt'),
        cssClass: "cell-align-center",
        dataType:"date",
        width:80 
      },
      { 
        dataField: "TO_DT", 
        caption: this.$t('to_dt'),
        cssClass: "cell-align-center",
        dataType:"date",
        width:80,
         
      },
      { 
        dataField: "STATUS",        
        caption: this.$t('status'),
        cssClass: "cell-align-center",
        lookup: {
                  displayExpr: "TEXT",
                  valueExpr: "PK",
                  dataSource: this.statusGroup
                },
        width:120 
      },
      { 
        dataField: "TCO_BUSPLACE_PK", 
        caption: this.$t('tco_busplace_pk'),
        width:0,
      },
      { 
        dataField: "REMARKS", 
        caption: this.$t('remarks'),
      },
      { 
        dataField: "USE_YN", 
        caption: this.$t('use_yn') ,
        cssClass: "cell-align-center",
        dataType: "checkbox"
      },
      { 
        dataField: "TEI_COMPANY_PK",
        with:0, 
        caption: this.$t('tei_company_pk'),
        
      }
      ]
    }
  },

  methods: {
    onSearch()
      { 
       this.$refs.grdCompany.loadData();
      },
    addNewMaster(item) {
      this.$refs.grdMasters.addRowStruct({
                          PK : '',
                          TEI_TEMPLATE_PK: '',
                          INVOICE_TYPE: '',
                          FORM_NO: '',
                          SERIAL_NO: '',
                          INV_QTY: '',
                          FROM_NO: '',
                          TO_NO: '',
                          REMAIN_QTY: '',
                          FROM_DT: moment().format('YYYYMMDD'),
                          TO_DT: '',
                          STATUS: '',
                          BIZ_PLACE: '',
                          REMARKS: '',
                          USE_YN: 'Y',
                          TEI_COMPANY_PK: this.lstCompany
                        },
                        0
                    );
        this.selectedItemAcc = {...item};
    },
    addNewDetails(item) {
      this.$refs.grdDetails.addRowStruct({
                          PK : '',
                          TEMPLATE_CD : '',
                          TEMPLATE_NM : '',
                          TEMPLATE_LNM : '',
                          TEMPLATE_FNM : '',
                          FORM_NO : '',
                          REMARKS : '',
                          INV_CONTENT : '',
                          USE_YN : 'Y',
                          TEI_COMPANY_PK : this.lstCompany,
                          VALID_DATE_FROM : '',
                          VALID_DATE_TO : '',
                          REPORT_ID : '',
                          TEI_EINVOICE_ISSUSE_PK : this.txtMastersPK,
                          TEL : '',
                          FAX : '',
                          ACC_NO : '',
                          ACC_CCY : '',
                          ACC_HOLDER : '',
                          BANK_NAME : '',
                          CONTACT_PERSON : '',
                          REP_PERSON : '',
                          TAX_NAME : '',
                          WEB_SITE : '',
                          TAX_CODE_DISPLAY : '',
                          CONTACT_COM_PHONE : '',
                          BRIEF_COM_NM : '',
                          CONTACT_ADDR : '',
                          CONTACT_EMAIL : '',
                          CONTACT_MOBI : '',
                          WEBSITE_EI : '' 
                        },
                        0
                    );
        this.selectedItemAcc = {...item};
    },
    onSaveMaster() {
      this.save()
    },
    
    onCellPrepared({ column, cellElement, rowType }) {
     if (this.txtInvoice_type === "E")
      {
        if (rowType === "data" && (column.dataField === "ATTRIBUTE1" || column.dataField === "ATTRIBUTE2"|| column.dataField === "ATTRIBUTE3"||column.dataField === "ATTRIBUTE4"||column.dataField === "ATTRIBUTE5"||column.dataField === "SEQ_DIS"||column.dataField === "SEQ")) {
             cellElement.style.width =  100;    
        }
      }
    },
    checkUpdatedItem(data, colName) {
      if (!data.cancel) {
        if (data.data._rowstatus !== "i") {
          data.data._rowstatus = "u";
        }
      }
      if (colName === 'NET_TR_AMT')
       {
         
         data.data.NET_BK_AMT = data.data.NET_TR_AMT*this.txtTrans_Rate / this.txtBook_Rate;
       }
      if(colName === 'U_PRICE' || colName === 'QTY')
      {
        data.data.EXT_PRICE = data.data.QTY*data.data.U_PRICE;
        data.data.NET_TR_AMT = data.data.QTY*data.data.U_PRICE;
        data.data.NET_BK_AMT = data.data.NET_TR_AMT*this.txtTrans_Rate / this.txtBook_Rate;
        data.data.ORDER_TRAMT = data.data.QTY*data.data.U_PRICE;
        data.data.ORDER_UPRICE = data.data.QTY*data.data.U_PRICE;
      }
      
    },
    async getListCodes() {
      const dso_company_list = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: [this.user.PK],
      };
      this.companyGroup = await this._dsoCall(dso_company_list, "select", false);
      this.lstCompany = this.companyGroup[0].PK;

      const dso_status_list = {
        type: "list",
        selpro: "SYS_SEL_LIST_STATUS",
        para: [this.user.PK],
      };
      this.statusGroup = await this._dsoCall(dso_status_list, "select", false);
      this.lstStatus = this.statusGroup[0].PK;

    },
    openDeleteDialog()
    {
      this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
    },
    onClickButton(obj) {
      switch (obj) {
       case "SEARCH_M":
          this.$refs.grdMasters.loadData();       
          break;   
        case "NEW_M":
          this.addNewMaster();//    
          break;       
        case "SAVE_M":   
          this.objClick = "btnSave_M";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
          break;
        case "DELETE_M":   
          this.objClick = "btnDelete_M";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
          break;
        case "OPTION":
          if (this.objClick == "btnSave_M") 
          {
            this.$refs.grdMasters.saveData();          
          } 
          else if (this.objClick == "btnDelete_M") 
          {
            this.$refs.grdMasters.deleteRows2();
          }
          else if (this.objClick == "btnSave_D") 
          {
            this.$refs.grdDetails.saveData();          
          } 
          else if (this.objClick == "btnDelete_D") 
          {
            this.$refs.grdDetails.deleteRows2();
          }
          break;  
          case "SEARCH_D":
            if (this.$refs.grdMasters.getSelectRowsData().length > 0) {
              let row = this.$refs.grdMasters.getSelectRowsData()[0];
              this.txtMastersPK = row.PK;
              this.$refs.grdDetails.loadData();
            }  
          break;
          case "SEARCH_DD":
            if (this.$refs.grdDetails.getSelectRowsData().length > 0) {
              let row = this.$refs.grdDetails.getSelectRowsData()[0];
              this.params = {
                PK :row.TEI_EINVOICE_ISSUSE_PK,
                REPORT_ID_TYPE : row.REPORT_ID_TYPE,
                TEI_COMPANY_PK : row.TEI_COMPANY_PK,
                CONVERT_YN : row.CONVERT_YN,
                REPORT_ID: row.REPORT_ID
              }
              console.log(this.params);
            }  
          break;
          case "NEW_D":
              this.addNewDetails();
          break;
          case "SAVE_D":
              this.objClick = "btnSave_D";
              this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
          break;
          case "DELETE_D":   
              this.objClick = "btnDelete_D";
              this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
          break;
          case "VIEW_D":
            this.$refs.viewEInvoiceDialog.dialogIsShow = true;
            break;
        
      }
    },
   
  },
}
</script>
