<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card  tile>
              <v-container fluid class="py-1">
                <v-row no-gutters class="px-1 py-1">
                  <!-- Company -->
                  <v-col cols="3" class="px-1 py-1">
                   <v-select clearable dense hide-details outlined :label="$t('company')" v-model="lstCompany" :items="companyGroup" item-text="TEXT" item-value="PK" :text_all="$t('all')" ></v-select> 
                  </v-col>
                  <v-col cols="2" class="px-1 py-1">
                    <BaseDatePicker outlined :label="$t('date_from')" readnonly start  v-model="transDateFrom"></BaseDatePicker>
                  </v-col>
                  <v-col cols="2" class="px-1 py-1">
                    <BaseDatePicker outlined :label="$t('date_to')" readnonly end v-model="transDateTo"></BaseDatePicker>
                  </v-col>
                  <v-col cols="2" class="px-1 py-1">
                    <v-text-field clearable dense hide-details outlined :label="$t('serial_no')" v-model="txtSerialNo" ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="px-1 py-1">
                    <v-select clearable dense hide-details outlined :label="$t('status')" v-model="lstStatus" :items="statusGroup" item-text="TEXT" item-value="PK" :text_all="$t('all')" ></v-select> 
                  </v-col>
                  <v-col cols="1" class="px-1 py-1">
                    <div class="d-flex justify-end">
                      <BaseButton  icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('SEARCH')"/>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Tabs & Tab Contents -->
        <v-row no-gutters align="center" justify="start" class="mb-2" >
          <v-col cols="12">
              <DataGridView column-resizing-mode="widget" 
              ref="grdCompany" 
              :auto_load="false"
              select_mode="Single"
              :max_height="limitHeight" 
              :header="headerGrid" 
              :onCellPrepared="onCellPrepared"
              @row-updated="checkUpdatedItem"
              sel_procedure="AC_SEL_6095030_ISSUSE_NO_CACHE"
              :filter_paras="[this.lstCompany,this.transDateFrom,this.transDateFrom,this.txtSerialNo,this.lstStatus]" 
              
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('OPTION')"></confirm-dialog>
   </v-container>
   
</template>

<script>
const findValueDeep = require('deepdash/findValueDeep');
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
export default {
  layout: 'default',
  middleware: 'user',

  components: {
    DatePicker:    ()    => import("@/components/control/DatePicker"),
    ConfirmDialog
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
    txtSerialNo:""
  }),

  created() {
    this.getListCodes();
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { if(this.$vuetify.breakpoint.smAndUp) 
                        {  return   570}  },// this.windowHeight },
    headerGrid() {
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
      this.$refs.grdCompany.addRowStruct({
                          PK: '',
                          COMPANY_CD: '',
                          COMPANY_NM: '',
                          COMPANY_LNM: '',
                          COMPANY_FNM: '',
                          TAX_CODE: '',
                          ADDR: '',
                          ADDR_L: '',
                          ADDR_F: '',
                          TEL: '',
                          FAX: '',
                          ACC_NO: '',
                          ACC_CCY: '',
                          ACC_HOLDER: '',
                          BANK_NAME: '',
                          CONTACT_PERSON: '',
                          REP_PERSON: '',
                          TAX_NAME: '',
                          REMARKS: '',
                          ERP_COMPANY_PK: '',
                          ERP_COMPANY_NAME: '',
                          USE_YN: 'Y',
                          WEB_SITE: '',
                          TAX_CODE_DISPLAY: '',
                          CONTACT_COM_PHONE: '',
                          BRIEF_COM_NM: '',
                          CONTACT_ADDR: '',
                          CONTACT_EMAIL: '',
                          CONTACT_MOBI: '',
                          WEBSITE_EI:''
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
       case "SEARCH":
          this.$refs.grdCompany.loadData();       
          break;   
        case "NEW":
          this.addNewMaster();//    
          break;       
        case "SAVE":   
          this.objClick = "btnSave";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
          break;
        case "DELETE":   
          this.objClick = "btnDelete";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
          break;
        case "OPTION":
          if (this.objClick == "btnSave") 
          {
            this.$refs.grdCompany.saveData();          
          } 
          else if (this.objClick == "btnDelete") 
          {
            this.$refs.grdCompany.deleteRows2();
          }
          break;  
        
      }
    }
   
  },
}
</script>
