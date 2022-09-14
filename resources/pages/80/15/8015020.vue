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
                  <!-- row 1 -->
                  <!-- Company -->
                  <v-col lg="3" sm="6" cols="12">
                    <v-select  clearable dense hide-details  item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="lstCompany" @change="onBizPlace"></v-select> 
                  </v-col>
                  <!-- Customer  -->
                  <v-col lg="2" sm="6" cols="12" class="d-flex align-center justify-space-between">
                    <v-text-field clearable dense hide-details :label="$t('customer_nm')" v-model="txtCustomerName"></v-text-field>
                  </v-col>
                   <!--Tax Code -->
                  <v-col lg="2" sm="12" cols="12" class="d-flex align-center"> 
                    <v-text-field clearable dense hide-details  :label="$t('tax_code', 'common')" v-model="txtTax_Code"></v-text-field>
                  </v-col>
                   <!-- From NO-->
                   <v-col lg="5" cols="12">
                      <!-- Send  -->
                      <v-btn depressed x-small class="white--text mr-2" :color="currentTheme" :disabled="isProcessing" @click="OnSendBusPartner" v-if="btnSend">{{ $t('interface_einvoice') }}</v-btn>
                      <!-- Update -->
                      <v-btn depressed x-small class="white--text mr-2" :color="currentTheme" :disabled="isProcessing" @click="OnUpdateBusPartner" v-if="btnUpdate">{{ $t('update_einvoice') }}</v-btn>
                       <!-- check status Cancel -->
                      <v-btn depressed x-small class="white--text mr-2" :color="currentTheme" :disabled="isProcessing" v-show="false">{{ $t('check_status_einvoice') }}</v-btn>
                      <!-- Search -->
                      <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onSearch">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <!-- row 2 -->
                  <!-- Biz Place -->
                  <v-col lg="3" cols="12">
                       <v-select dense  hide-details  item-value="PK" item-text="TEXT" :label="$t('biz_place')" :items="bizPlaceList" v-model="lstBiz_Place"  ></v-select>
                  </v-col>  
                  <!-- Type  -->
                    <v-col lg="2" cols="12">
                        <v-select dense  hide-details  item-value="CODE" item-text="NAME" :label="$t('voucher_type')" :items="typeList" v-model="lstType" ></v-select>
                    </v-col>                 
                  <!-- Transaction -->
                    <v-col lg="2" cols="12">
                        <v-select dense  hide-details  item-value="PK" item-text="TEXT" :label="$t('transaction')" :items="transactionList" v-model="lstTransaction" ></v-select>
                    </v-col>
                  <!-- Use Y/N -->
                  <v-col lg="2" cols="12">
                      <v-select dense  hide-details  item-value="PK" item-text="TEXT" :label="$t('use_yn')" :items="useYNList" v-model="lstUseYN" ></v-select>
                  </v-col>
                  <!-- Interface Y/N -->
                  <v-col lg="2" cols="12" class="py-1">
                            <v-select dense  hide-details  item-value="PK" item-text="TEXT" :label="$t('interface_yn')" :items="interfaceYNList" v-model="lstInterfaceYN" @change="onChangeButton"></v-select>
                  </v-col>  
                  <!-- row 3 -->
                  <v-col lg="1" cols="12">
                     <i style="color:red; ">{{$t('rows')}} : {{this.returnRows}}  </i>    
                     <v-text-field clearable dense hide-details  v-model="txtTei_Company_PK"  v-show="false"></v-text-field>
                     <v-text-field clearable dense hide-details  v-model="txtPartner_Pk"      v-show="false"></v-text-field>
                     <v-text-field clearable dense hide-details  v-model="txtTei_Customer_pk" v-show="false"></v-text-field>
                     <v-text-field clearable dense hide-details  v-model="txtReturn_Status"   v-show="false"></v-text-field>
                     <v-text-field clearable dense hide-details  v-model="txtCount_Return"    v-show="false"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Grid Master -->
        <v-row no-gutters align="center" justify="start" class="mb-2" >
          <v-col cols="12">
              <DxDataGrid column-resizing-mode="widget"
                ref="gridMaster"  
                :data-source="dxg_gridMaster" 
                :allow-column-resizing="true" 
                :cache-enabled="false" 
                :column-auto-width="true" 
                :columns="deInquiryHeaders" 
                :height="limitHeight" 
                :loadPanel="{ enabled: isProcessing, text: $t('is_loading', 'common') }" 
                :no-data-text="$t('no_data', 'common')" 
                :paging="{ pageSize: dxg_gridMaster.length }"
                :selection="{ mode: 'single',showCheckBoxesMode: 'none' }" 
                :show-borders="true" 
                :show-column-lines="true" 
                :onCellPrepared="onCellPrepared"
                :hoverStateEnabled="true" 
                :show-row-lines="true"
                :onSelectionChanged="onSelectionChanged"
                >
                  <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                  <DxSelection mode="multiple" v-if="multiSelectMode" />
                  <DxSelection mode="single" v-if="!multiSelectMode" />
              </DxDataGrid> 
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <account-dialog ref="accountDialog" @returnAccountInfo="handleReturnedAccount"></account-dialog>
  </v-container>
</template>
<script>
import axios from 'axios';
export default {
  layout: 'default',
  middleware: 'user',
  components: {
    DatePicker:       () => import("@/components/control/DatePicker"),
    AccountDialog:    () => import("@/components/dialog/AccountDialog"),
    partnerDialog:    () => import("@/components/dialog/PartnerEiDialog"),
    DynamicDialog:    () => import("@/components/dialog/DynamicDialog"),
    CostCenterDialog: () => import("@/components/dialog/CostCenterDialog"),
  },
  data: () => ({
    txtItem_NM:'',
    txtItem_PK:'',
    txtItem_CD:'',
    txtTax_Code:'',
    txtTei_Company_PK:'',
    txtCount_Return:'',
    voucherTypeList:[],
    fromNoList:[],
    lstFrom_No:'',
    lstSerial_No:'',
    serialNoList:[],
    txtInvoice_No:'',
    useYNList:[{ 'PK': 'Y','TEXT':'Yes'},
                {'PK': 'N','TEXT':'No'}],
    lstUseYN:'',
    transactionList:[],
    lstTransaction:'',
    typeList:[],
    lstType:'',
    lstReport_Type:'',
    txtPL_CD:'',
    txtPL_PK:'',
    txtPL_NM:'',
    bizPlaceList:[],
    lstBiz_Place:'',
    companyList: [],
    lstCompany: null,
    lstTei_Company_PK:'',
    txtCustomerName: '',
    seq: '',
    languageList: [],
    selectedLang: '',
    status: '2',
    accCodeType: null,
    PK: '',
    inPK: '',
    in: '',
    dialogTitle: '',
    slipStatusList: [],
    btnPrint:true,
    codeType: null,
    moreParas: [],
    dxg_gridMaster:[],
    reportTypeList: [],
    selectedReportType: '',
    tab: null,
    dailyEntryInquiryList: [],
    cashFlowAmtDirectList: [],
    cashFlowAmtIndirectList: [],
    dailyEntryACCDList: [],
    dailyEntryPartnerList: [],
    interfaceYNList:[{'PK': 'ALL','TEXT':'ALL Select'},
                     {'PK': 'Y','TEXT':'Yes'},
                     {'PK': 'N','TEXT':'No'}],
    lstInterfaceYN:'',
    objInvoice_M: null,
    objInvoice_D:null,
    multiSelectMode: true,
    objcustomer:null,
    txtPartnerPk:'',
    selectedRowKeys_Partner: [],
    txtTei_Customer_pk:'',
    txtReturn_Status:'',
    txtPartner_Pk:'',
    btnSend:true,
    btnUpdate:true,
    returnRows: 0

  }),

  created() {
    this.getListCodes();
    this.onChangeButton();
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { if(this.$vuetify.breakpoint.smAndUp) 
                        {   
                          return  500;
                        }  
                  },
    deInquiryHeaders() {
      return [
        {
          dataField:"PK", width:0,
          allowEditing:false,
          caption: this.$t('pk') 
        },
        {
          dataField:"TCO_BUSPARTNER_ITF_YN",  
          allowEditing:true, width:0,
          cssClass: "cell-align-center",
          caption: this.$t('tco_buspartner_itf_yn')
        },
        {
          dataField:"PARTNER_ID",
          allowEditing:false,
          caption: this.$t('partner_id')
        },
        {
          dataField:"PARTNER_NAME",  allowEditing:false,
          caption: this.$t('partner_name')
        },
          {
          dataField:"PARTNER_LNAME",  allowEditing:"false", width:0,
          caption: this.$t('partner_lname')
        },
        {
          dataField:"PARTNER_FNAME",width:0,
          caption: this.$t('partner_fname'), allowEditing:true 
        },
        {
          dataField:"PARTNER_TYPE",    
          caption: this.$t('partner_type')
        },
          {
          dataField:"TAX_CODE", allowEditing:true, 
          caption: this.$t('tax_code') 
        },
          {
          dataField:"ADDR1", allowEditing:true,
          width:120,
          caption: this.$t('addr1')
        },
          {
          dataField:"ADDR2", width: 0,
          caption: this.$t('addr2')
        },
          {
          dataField:"ADDR3", allowEditing:true ,
           width: 0,
          caption: this.$t('addr3')
        },
          {
          dataField:"PHONE_NO",  allowEditing:true,
          caption: this.$t('phone_no')
         
        },
          {
          dataField:"EMAIL_ADDRESS", allowEditing :true ,
          caption: this.$t('email_address')
          
        },
          {
          dataField:"FAX_NO", allowEditing:true ,
          caption: this.$t('fax_no')
        },
          {
          dataField:"TEI_CUSTOMER_PK", 
          allowEditing:true ,
          caption: this.$t('tei_customer_pk')
        },
          {
          dataField:"DESCRIPTION",
          caption: this.$t('description')
        },
          {
          dataField:"WEB_SITE" ,
          caption: this.$t('web_site'), allowEditing:true
        },
          {
          dataField:"TEI_COMPANY_PK" ,
          caption: this.$t('tei_company_pk'), allowEditing:true
        },
          {
          dataField:"TAX_CODE_TO_USERID",
          caption: this.$t('tax_code_to_userid')
          
        },
           {
          dataField:"TAX_CODE_COMPANY", allowEditing:true,
          width:120
        },
          {
          dataField:"PASSWORD",
          caption: this.$t('password')
        },
          {
          dataField:"PASSWORDSEND", 
          caption: this.$t('passwordsend') 
        }
      ]
    }
  },
  methods: {
    async getListCodes() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      this.lstCompany = this.companyList[0].PK
      this.languageList = await this._getCommonCode('COAB0070')

      const dso_bizplace_list = { type: 'list', selpro: 'SYS_SEL_BIZ_PLACE_V2', para: [ this.lstCompany, this.user.PK ] }
      this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false) 
      if(this.bizPlaceList.length > 0)
      {
        this.lstBiz_Place = this.bizPlaceList[0].PK
      }
      

      this.lstUseYN = 'Y'

      const dso_invoice_type = { type: 'list', selpro: 'AC_GET_COMMONCODE_EI_ALL', para: [this.lstCompany,'TPS0023' ] }
      this.transactionList = await this._dsoCall(dso_invoice_type, 'select', false)
      this.lstTransaction = this.transactionList[0].PK   
      
      this.lstInterfaceYN = 'N'

      //const dso_typeinvoice_list = { type: 'list', selpro: 'AC_GET_COMMONCODE_EI_ALL', para: [this.lstCompany, 'CODC0010' ] }
      this.typeList = [];
      this.typeList = await this._getCommonCode('CODC0010', this.sel_Company);   // await this._dsoCall(dso_typeinvoice_list, 'select', false)
      this.lstType = this.typeList[0].CODE

      const dso_tei_company = { type: 'list', selpro: 'AC_GET_COMPANY_EI', para: [this.lstCompany ] }
      this.lstTei_Company_PK = await this._dsoCall(dso_tei_company, 'select', false)
      this.txtTei_Company_PK = this.lstTei_Company_PK[0].PK   
    },
    onSearch()
    { 
        this.search();
    },
    onChange()
    {
      this.changeFormNo();
    },
    async changeFormNo()
    {
        const dso_serial_no = { type: 'list', selpro: 'AC_SERIAL_NO_EI_ALL', para: ['GFQC0024',this.lstCompany,this.lstFrom_No ] }
        this.serialNoList = await this._dsoCall(dso_serial_no, 'select', false)
        this.lstSerial_No = this.serialNoList[0].PK 
    },
     async search() {
      let  pa = [         
                  this.txtCustomerName,                  
                  this.txtTax_Code,                       
                  this.lstType,               
                  this.lstUseYN,                     
                  this.lstTransaction,     
                  this.lstCompany,
                  this.lstInterfaceYN,    
                  this.lstBiz_Place,
                  this.txtTei_Company_PK   
                ];
      const dso = {
        type: "grid",
        selpro: "SP_SEL_8015020_PARTNER_NO_CACHE",
        para: pa 
      };
      this.dxg_gridMaster = await this._dsoCall(dso, "select", false);
      this.returnRows = this.dxg_gridMaster.length;
      this.onUpdatePassWordMd5();
    },
    onUpdatePassWordMd5()
    {
      for(let i = 0; i < this.dxg_gridMaster.length; i++)
      {
        this.dxg_gridMaster[i].PASSWORD = this.b64_md5(this.dxg_gridMaster[i].PASSWORDSEND);      
        //if(this.dxg_gridMaster[i].PASSWORDSEND == "") // && this.lstInterfaceYN !="Y"
        //{
        //  this.dxg_gridMaster[i].PASSWORD = this.b64_md5(this.dxg_gridMaster[i].PASSWORDSEND);      
          //this.dxg_gridMaster[i].PASSWORDSEND = b64_md5(this.dxg_gridMaster[i].PASSWORD);      
        //}
             
      }
    },
    onBizPlace()
    {
      this.getBizPlace();
    },
     async getBizPlace() {
      
      const dso_bizplace_list = { type: 'list', selpro: 'SYS_SEL_BIZ_PLACE_V2', para: [ this.lstCompany , this.user.PK ] }
      this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false) 
      console.log('vng-154-dvg^_^: > file: 8015020.vue > line 392 > getBizPlace > this.bizPlaceList ', this.bizPlaceList );
      this.lstBiz_Place = this.bizPlaceList.length>0?this.bizPlaceList[0].PK:'';

      this.lstUseYN = 'Y'

      const dso_invoice_type = { type: 'list', selpro: 'AC_GET_COMMONCODE_EI_ALL', para: [this.lstCompany,'TPS0023' ] }
      this.transactionList = await this._dsoCall(dso_invoice_type, 'select', false)
      this.lstTransaction = this.transactionList[0].PK   
      
      this.lstInterfaceYN = 'N'

      //const dso_typeinvoice_list = { type: 'list', selpro: 'AC_GET_COMMONCODE_EI_ALL', para: [this.lstCompany, 'ACBG0130' ] }
      //this.typeList = await this._dsoCall(dso_typeinvoice_list, 'select', false)
      this.typeList = [];
      this.typeList = await this._getCommonCode('CODC0010', this.sel_Company);   // await this._dsoCall(dso_typeinvoice_list, 'select', false)
      this.lstType = this.typeList[0].CODE

      const dso_tei_company = { type: 'list', selpro: 'AC_GET_COMPANY_EI', para: [this.lstCompany ] }
      this.lstTei_Company_PK = await this._dsoCall(dso_tei_company, 'select', false)
      this.txtTei_Company_PK = this.lstTei_Company_PK[0].PK   
    },
    save() {

    },

    handleReturnedAccount(data) {
     
    },
   
    openPartnerDialog() {
      this.$refs.partnerDialog.dialogIsShow = true;
    },
    openPLUnitDialog() {
       this.$refs.refPLCenter.dialogIsShow = true;
    },
    openCodeDialog(type) {
      this.$refs.directInDialog.dialogIsShow = true
      this.codeType = type
      if(type === 'direct') {
        this.dialogTitle = this.$t('direct_code', 'common')
        this.moreParas = [ 'EACAB022' ]
      } else {
        this.dialogTitle = this.$t('indirect_code', 'common')
        this.moreParas = [ 'EACAB026' ]
      }
    },
     onCellPrepared({ column, cellElement, rowType }) {
      
      if (rowType === "data" && column.dataField === "VAT_RATE" ||column.dataField === "SERIAL_NO" ||column.dataField === "ACCD_DR" ||column.dataField === "ACCD_CR1" ||column.dataField === "ACCD_CR2" ||column.dataField === "ITEM_UOM") { 
         cellElement.style.textAlign = 'center';
      }
    },
    clone(obj) 
    {
        if (null == obj || "object" != typeof obj) return obj;
        let copy = obj.constructor();
        for (let attr in obj)
        {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },

    initObjCustomer() {
       this.objcustomer =
      {
        Cus:
        {
          key: "",
          Customer:
          { 
            Cus_cd: "",
            Cus_nm: "",
            Cus_lnm: "",
            Cus_fnm: "",
            Tax_code: "",
            Address_vn: "",
            Address_en: "",
            Address_kr: "",
            Phone: "",
            Fax: "",
            Email: "",
            Acc_no: "",
            Acc_ccy: "",
            Acc_holder: "",
            Bank_name: "",
            Tei_company_pk: "",
            Remarks: "",
            Crt_by: "",
            Web_site: "",
            Erp_customer_pk: "",
            Buyer_name: "",
            User_login: "",
            Company_tax_code: "",
            PassWord: "",		
            PassWordSend: ""
          }
        }
      };
    },

    objectToXml(obj) 
    {
      let xml = '';
      for (let prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
          continue;
        }
        if (obj[prop] == undefined)
          continue;
        xml += "<" + prop + ">";
        if (typeof obj[prop] == "object")
          xml += this.objectToXml(new Object(obj[prop]));
        else
          xml += obj[prop];
        xml += "</" + prop + ">";
      }
      return xml;
    } ,
    safeXMLValue(value) 
    {
      let s = value.toString();
      //s = s.replace(/&/g, ' ');
      /*	s = s.replace('/\&/g', '&amp;');
      s = s.replace('/\"/g', '&quot;');
      s = s.replace('/</g', '&lt;');
      s = s.replace('/>/g', '&gt;');
      */
      return s;
    },
    replaceAllExt (strOgr, search, replacement) {
        let target = strOgr;
        //return target.replace(new RegExp(search, 'g'), replacement);
        //return strOgr.replace(new RegExp(search, 'g'), replacement);
        return target.replace(search, replacement);
    },

    convertHtmlCode(sText){
      if (sText != null || sText =='')
      {
         return sText.replace('&','&#38;').replace('"','&#34;').replace('<','&#60;').replace('>','&#62;'); 
      }else
      {
        return "";
      }
     
    },
    onSelectionChanged({ selectedRowKeys }) {
      this.selectedRowKeys_Partner = selectedRowKeys
    },
    onChangeButton()
    {
        if(this.lstInterfaceYN == 'Y')
        {
          this.btnSend   = false;
          this.btnUpdate = true;
        }else
        {
          this.btnUpdate  = false;
          this.btnSend    = true;
        }
    },
    OnUpdateBusPartner()
    {
      let arg_XmlStr_s = "";
        let arg_XmlStr   = "";
        this.initObjCustomer();
        for (let i =0; i<this.selectedRowKeys_Partner.length;i++)
		    {	
          if(this.selectedRowKeys_Partner[i].TCO_BUSPARTNER_ITF_YN == 'Yes')
          {
              this.txtPartnerPk                               += this.selectedRowKeys_Partner[i].PK + `-`;
              this.objcustomer.Cus.Customer.Cus_cd             = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_ID);
              this.objcustomer.Cus.Customer.Cus_nm             = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_NAME);        
              this.objcustomer.Cus.Customer.Cus_lnm            = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_LNAME);        
              this.objcustomer.Cus.Customer.Cus_fnm            = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_FNAME);        
              this.objcustomer.Cus.Customer.Tax_code           = this.convertHtmlCode(this.selectedRowKeys_Partner[i].TAX_CODE);        
              this.objcustomer.Cus.Customer.Address_vn         = this.convertHtmlCode(this.selectedRowKeys_Partner[i].ADDR1);        
              this.objcustomer.Cus.Customer.Address_en         = this.convertHtmlCode(this.selectedRowKeys_Partner[i].ADDR2);        
              this.objcustomer.Cus.Customer.Address_kr         = this.convertHtmlCode(this.selectedRowKeys_Partner[i].ADDR3);        
              this.objcustomer.Cus.Customer.Phone              = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PHONE_NO);        
              this.objcustomer.Cus.Customer.Fax                = this.convertHtmlCode(this.selectedRowKeys_Partner[i].FAX_NO);        
              this.objcustomer.Cus.Customer.Email              = this.convertHtmlCode(this.selectedRowKeys_Partner[i].EMAIL_ADDRESS);        
              this.objcustomer.Cus.Customer.Acc_no             = "" ;
              this.objcustomer.Cus.Customer.Acc_ccy            = "" ;
              this.objcustomer.Cus.Customer.Acc_holder         = "" ;
              this.objcustomer.Cus.Customer.Bank_name          = "" ;
              this.objcustomer.Cus.Customer.Tei_company_pk     = this.selectedRowKeys_Partner[i].TEI_COMPANY_PK;
              this.objcustomer.Cus.Customer.Remarks            = this.convertHtmlCode(this.selectedRowKeys_Partner[i].DESCRIPTION);
              this.objcustomer.Cus.Customer.Crt_by             = "";
              this.objcustomer.Cus.Customer.Web_site           = this.convertHtmlCode(this.selectedRowKeys_Partner[i].WEB_SITE);
              this.objcustomer.Cus.Customer.Erp_customer_pk    = this.selectedRowKeys_Partner[i].PK;
              this.objcustomer.Cus.Customer.Buyer_name         = "";
              this.objcustomer.Cus.Customer.User_login         = "";
              this.objcustomer.Cus.Customer.Company_tax_code   = this.selectedRowKeys_Partner[i].TAX_CODE_COMPANY;
              this.objcustomer.Cus.Customer.Tax_code_To_UserID = this.selectedRowKeys_Partner[i].TAX_CODE_TO_USERID;
              this.objcustomer.Cus.Customer.PassWord 			     = this.selectedRowKeys_Partner[i].PASSWORD;
              this.objcustomer.Cus.Customer.PassWordSend 		   = this.selectedRowKeys_Partner[i].PASSWORDSEND;
              this.objcustomer.Cus.Customer.tei_customer_pk    = this.selectedRowKeys_Partner[i].TEI_CUSTOMER_PK;
              arg_XmlStr =  this.objectToXml(this.objcustomer);
                  arg_XmlStr =  this.safeXMLValue(arg_XmlStr);  
                    arg_XmlStr_s = arg_XmlStr_s + arg_XmlStr;
          }
        }
          arg_XmlStr ="<Customers>"+arg_XmlStr_s+"</Customers>";
					if(this.txtPartnerPk !="")
					{
						if(confirm('Do you want to interface update partner ?'))
						{
							jQuery.support.cors = true;
							$.support.cors = true;
							$.ajax({
								type: "POST",
								url:"http://genuclouding.com/wseinvoice/BSService.asmx/UpdateCustomers_v3",
								data: {arg_XmlStr:arg_XmlStr},
								dataType: "text",
								crossDomain: true,
								success: this.OnSuccessCall_Up,
								error: this.OnErrorCall_Up
              });  
            }
          } 
    },
    OnSuccessCall_Up(response) {
      let xmlDoc = $.parseXML( response );
      let xml = $( xmlDoc );
      let obj =$.parseJSON(xml.text());
      //this.txt_tei_customer_pk = obj.result ;
      //this.txt_return_status = obj.msg;
      //this.txt_Count_Return = this.selectedRowKeys_Partner.length;
      //this.updateStatus_Up();
      if(obj.msg == "OK")
      {
        alert(`Update Customer E-invoice was finish !!`);
      }else
        {
           alert(obj.result);
        }
      
    },
    OnErrorCall_Up(response) {
      alert(response.status + " - " + response.statusText);
    },
    
    OnSendBusPartner()
    {
        let arg_XmlStr_s = "";
        let arg_XmlStr   = "";
        this.txtPartnerPk= "";
        this.txt_tei_customer_pk = "";
        this.initObjCustomer();
        for (let i =0; i<this.selectedRowKeys_Partner.length;i++)
		    {	
          if(this.selectedRowKeys_Partner[i].TCO_BUSPARTNER_ITF_YN == 'No')
          {
              this.txtPartnerPk                                =  this.selectedRowKeys_Partner[i].PK+ `-`   + this.txtPartnerPk ;
              this.objcustomer.Cus.Customer.Cus_cd             = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_ID);
              this.objcustomer.Cus.Customer.Cus_nm             = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_NAME);        
              this.objcustomer.Cus.Customer.Cus_lnm            = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_LNAME);        
              this.objcustomer.Cus.Customer.Cus_fnm            = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PARTNER_FNAME);        
              this.objcustomer.Cus.Customer.Tax_code           = this.convertHtmlCode(this.selectedRowKeys_Partner[i].TAX_CODE);        
              this.objcustomer.Cus.Customer.Address_vn         = this.convertHtmlCode(this.selectedRowKeys_Partner[i].ADDR1);        
              this.objcustomer.Cus.Customer.Address_en         = this.convertHtmlCode(this.selectedRowKeys_Partner[i].ADDR2);        
              this.objcustomer.Cus.Customer.Address_kr         = this.convertHtmlCode(this.selectedRowKeys_Partner[i].ADDR3);        
              this.objcustomer.Cus.Customer.Phone              = this.convertHtmlCode(this.selectedRowKeys_Partner[i].PHONE_NO);        
              this.objcustomer.Cus.Customer.Fax                = this.convertHtmlCode(this.selectedRowKeys_Partner[i].FAX_NO);        
              this.objcustomer.Cus.Customer.Email              = this.convertHtmlCode(this.selectedRowKeys_Partner[i].EMAIL_ADDRESS);        
              this.objcustomer.Cus.Customer.Acc_no             = "" ;
              this.objcustomer.Cus.Customer.Acc_ccy            = "" ;
              this.objcustomer.Cus.Customer.Acc_holder         = "" ;
              this.objcustomer.Cus.Customer.Bank_name          = "" ;
              this.objcustomer.Cus.Customer.Tei_company_pk     = this.selectedRowKeys_Partner[i].TEI_COMPANY_PK;
              this.objcustomer.Cus.Customer.Remarks            = this.convertHtmlCode(this.selectedRowKeys_Partner[i].DESCRIPTION);
              this.objcustomer.Cus.Customer.Crt_by             = this.user.USER_ID;
              this.objcustomer.Cus.Customer.Web_site           = this.convertHtmlCode(this.selectedRowKeys_Partner[i].WEB_SITE);
              this.objcustomer.Cus.Customer.Erp_customer_pk    = this.selectedRowKeys_Partner[i].PK;
              this.objcustomer.Cus.Customer.Buyer_name         = "";
              this.objcustomer.Cus.Customer.User_login         = "";
              this.objcustomer.Cus.Customer.Company_tax_code   = this.selectedRowKeys_Partner[i].TAX_CODE_COMPANY;
              this.objcustomer.Cus.Customer.Tax_code_To_UserID = this.selectedRowKeys_Partner[i].TAX_CODE_TO_USERID;
              this.objcustomer.Cus.Customer.PassWord 			     = this.selectedRowKeys_Partner[i].PASSWORD;
              this.objcustomer.Cus.Customer.PassWordSend 		   = this.selectedRowKeys_Partner[i].PASSWORDSEND;
              arg_XmlStr =  this.objectToXml(this.objcustomer);
                  arg_XmlStr =  this.safeXMLValue(arg_XmlStr);  
                    arg_XmlStr_s = arg_XmlStr_s + arg_XmlStr;
          }
        }
          arg_XmlStr ="<Customers>"+arg_XmlStr_s+"</Customers>";
					if(this.txtPartnerPk !="")
					{
						if(confirm('Do you want to interface selected partner ?'))
						{
							jQuery.support.cors = true;
							$.support.cors = true;
							$.ajax({
								type: "POST",
								url:"http://genuclouding.com/wseinvoice/BSService.asmx/ListInsertCustomers_Md5",
								data: {arg_XmlStr:arg_XmlStr},
								dataType: "text",
								crossDomain: true,
								success: this.OnSuccessCall,
								error: this.OnErrorCall
              });  
              
            }
          } 
           
    },
    OnSuccessCall(response) {
      let xmlDoc = $.parseXML( response );
      let xml = $( xmlDoc );
      alert(xml.text());
      let obj =$.parseJSON(xml.text());
      this.txt_tei_customer_pk = obj.result ;
      this.txt_return_status = obj.msg;
      this.txt_Count_Return = this.selectedRowKeys_Partner.length;
      this.insertStatus();
    },
    OnErrorCall(response) {
      alert(response.status + " - " + response.statusText);
    },
    insertStatus()
    {
      this.insertStatusPartner();
    },
    async insertStatusPartner(){
      const dso = {
        type: "process",
        updpro: "SP_PRO_8015020_BUSPARTNER",
        para: [
               this.txtPartnerPk,
               this.txt_tei_customer_pk,
               this.txtTei_Company_PK,
               this.lstCompany,
               this.selectedRowKeys_Partner.length
             
              ] 
      };
      //const result = 
      await this._dsoCall(dso, "process", false);
      //this.searchMaster(this.mstData.PK);
      this.onSearch();
    },

  }
}
</script>
