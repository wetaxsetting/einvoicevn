<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">
    <v-row no-gutters>     
      <v-col md="12" class="pa-1">       
        <v-row no-gutters>
          <v-col md="12">
            <v-card class="pa-2 pt-0" v-show="selectedTab === '1'">
              <v-row align="center" justify="space-between" no-gutters>               
                <v-col md="12">
                  <v-card class="pa-2 py-0 rounded" outlined tile>
                     <v-row align="center" justify="space-between" >
                        <v-col md="4" class="pt-3">
                          <BaseSelect
                              :label="$t('company')"
                              v-model="modelSearch.P_TCO_COMPANY_PK"
                              :lstData="dataList.lstCompany1"
                              item-text="TEXT"
                              item-value="PK"
                          />                               
                        </v-col>
                      
                        <v-col md="2"  class="pt-3">
                          <BaseDatePicker :label="$t('apply_from_from')" v-model="modelSearch.P_APPLY_FROM_FR" />                                                                 
                        </v-col>
                        <v-col md="2"  class="pt-3">
                          <BaseDatePicker :label="$t('apply_from_to')" v-model="modelSearch.P_APPLY_FROM_TO" />                                               
                        </v-col>
                        <v-col md="2"  class="pt-3">
                          <BaseDatePicker :label="$t('apply_to_from')" v-model="modelSearch.P_APPLY_TO_FR" />
                        </v-col>
                        <v-col md="2"  class="pt-3">
                          <BaseDatePicker :label="$t('apply_to_to')" v-model="modelSearch.P_APPLY_TO_TO" />                                                                                   
                        </v-col>                       
                     </v-row>
                    <v-row align="center" justify="space-between" > 
                                                                       
                    <v-col md="4" class="pt-0">
                      <BaseSelect
                              :label="$t('item_group')"
                              v-model="modelSearch.P_TLG_IT_ITEMGRP_PK"
                              :lstData="dataList.lstItemGroup01"
                              item-text="CODEDESC"
                              item-value="CODEKEY"
                          />                          
                      </v-col> 
                      <v-col md="2" class="pt-0">
                        <BaseInput v-model="modelSearch.P_ITEM_SEARCH" :label="$t('item')" @keyPressEnter="onClickButton('btnSearch')" />                       
                      </v-col>                                  
                      <v-col md="2" class="pt-0">
                        <BaseSelect
                              :label="$t('active_yn')"
                              v-model="modelSearch.P_ACTIVE_YN"
                              :lstData="dataList.lstYesNo1"
                              item-text="NAME"
                              item-value="CODE"
                          />                              
                      </v-col>    
                      <v-col md="4" class="pt-0">
                         <v-row justify="end" class="mr-1"> 
                            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch')"/>                                   
                          </v-row>                           
                      </v-col>                                                                
                    </v-row>                    
                  </v-card>
                  <v-card class="pa-2 py-0 rounded" outlined tile>
                        <v-row align="center" justify="space-between"> 
                          <v-col md="2" class="pt-3">
                            <BaseSelect
                              :label="$t('columns_set')"
                              v-model="modelSet.lstColumns"
                              :lstData="dataList.lstColumns"
                              item-text="NAME"
                              item-value="CODE"
                            />                             
                          </v-col>                                                                 
                          <v-col md="2" class="pt-3">
                            <BaseSelect
                              :label="$t('active_yn')"
                              v-model="modelSet.P_ACTIVE_YN"
                              :lstData="dataList.lstYesNo2"
                              item-text="NAME"
                              item-value="CODE"
                            />                             
                          </v-col>                                                                  
                          <v-col md="2" class="pt-3">
                            <BaseDatePicker :label="$t('apply_date')" v-model="modelSet.P_DATE_APPLY" default />                                         
                          </v-col>    
                          <v-col md="1" class="pt-3">  
                            <v-row justify="end" class="mr-1"> 
                              <BaseButton icon_type="move_down" :btn_text="$t('set_data')" :disabled="isProcessing" @onclick="onClickButton('btnSetData')"/>                                                                                              
                             </v-row> 
                          </v-col>
                           <v-col md="2" class="pt-3"  align="center">
                            <i style="color:red; ">{{$t('rows')}} : {{this.returnRows }}  </i>    
                          </v-col>
                          <v-col md="3" class="pt-3">  
                              <v-row justify="end" class="mr-1">                                   
                                  <BaseButton icon_type="add_new" :btn_text="$t('btn_add')" :disabled="isProcessing" @onclick="onClickButton('btnAddNew')"/>                                                                                
                                  <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSave')"/>
                                  <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"  @onclick="onClickButton('btnDelete')"/>
                              </v-row>                                                                                                  
                          </v-col>
                        </v-row>
                  </v-card> 
                </v-col>
              </v-row>              
              <v-row align="center" justify="space-between" class="pa-0">
                <v-col cols="12" class="pt-0">
                  <DataGridView
                    column-resizing-mode="widget"
                    ref="grdDetail01"                   
                    sel_procedure="CW_SEL_8030070_1_NOCACHE"
                    upd_procedure="CW_UPD_8030070_1"
                    select_mode="Multiple"
                    :auto_load="false"
                    :max_height="limitHeight"
                    @setDataSource="onAfterLoad"
                    :filter_paras="[
                          this.modelSearch.P_TCO_COMPANY_PK,
                          this.modelSearch.P_TCO_BUSPLACE_PK,
                          this.modelSearch.P_TCO_BUSPARTNER_PK,
                          this.modelSearch.P_APPLY_FROM_FR,
                          this.modelSearch.P_APPLY_FROM_TO,
                          this.modelSearch.P_APPLY_TO_FR,
                          this.modelSearch.P_APPLY_TO_TO,
                          this.modelSearch.P_TLG_IT_ITEMGRP_PK  ,
                          this.modelSearch.P_ITEM_SEARCH,
                          this.modelSearch.P_ACTIVE_YN, 
                      ]"                   
                    :update_paras="[
                        'PK',
                        'TCO_COMPANY_PK',
                        'TCO_BUSPLACE_PK',
                        'PARTNER_ID',
                        'PARTNER_NAME',
                        'ITEM_CODE',
                        'ITEM_NAME',
                        'EXPIRE_DAYS',
                        'APPLY_FROM_DT',                                                
                        'APPLY_TO_DT',
                        'ACTIVE_YN',
                        'DESCRIPTION',                                             
                        'TLG_IT_ITEM_PK',
                        'TCO_BUSPARTNER_PK',
                      ]"
                  :header="[  
                    {dataField: 'TCO_COMPANY_PK',caption: this.$t('company'), allowEditing: false, width: 200, fixed: true,
                      lookup: { dataSource: this.dataList.lstCompany1, displayExpr:'TEXT', valueExpr: 'PK' } 
                    }, 
                    {dataField: 'TCO_BUSPLACE_PK',caption: this.$t('biz_center'), allowEditing: false, width: 200, visible: false,
                      lookup: { dataSource: this.dataList.lstBizCenter1, displayExpr:'TEXT', valueExpr: 'PK' } 
                    },                                            
                    {dataField: 'PARTNER_ID',caption: this.$t('consignor_id'), allowEditing: false, visible: false }, 
                    {dataField: 'PARTNER_NAME',caption: this.$t('consignor_name'), allowEditing: false, visible: false }, 
                    {dataField: 'GRP_NM',caption: this.$t('item_group'), allowEditing: false, width: 200 },  
                    {dataField: 'ITEM_CODE',caption: this.$t('item_code'), allowEditing: false }, 
                    {dataField: 'ITEM_NAME',caption: this.$t('item_name'), allowEditing: false },                                            
                    {dataField: 'EXPIRE_DAYS',caption: this.$t('expire_days'), allowEditing: true,  width: 80, formatFloat:'0' },                                         
                    {dataField: 'APPLY_FROM_DT',caption: this.$t('apply_from_date'), allowEditing: true, width: 100, dataType:'date' },                                                                      
                    {dataField: 'APPLY_TO_DT',caption: this.$t('apply_to_date'), allowEditing: true, width: 100, dataType:'date' },  
                    {dataField: 'ACTIVE_YN',caption: this.$t('active_yn'), allowEditing: true, dataType: 'checkbox' , width: 100},                                                                       
                    {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: true }                                                       
                  ]"           
                  />
                </v-col>
              </v-row>
            </v-card>                      
          </v-col>
        </v-row>
      </v-col>
    </v-row>    
       
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
    <alert-dialog ref="alertDialog"></alert-dialog>
    <partner-dialog ref="delitoDialog" @callBackData="mappingPartner" />
    <free-item-dialog ref="refFreeItemDialog"  @callBackData="callBackFreeItem" />
    
  </v-container>
</template>

<script>
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import PartnerDialog from '@/components/dialog/CWPartnerDialog';
import FreeItemDialog from "@/components/dialog/FreeItemDialog";
import DataGridView from "@/components/control/DataGridView";

export default {
  layout: "default",
  middleware: "user",

  components: {   
    'partner-dialog' : PartnerDialog,
    'free-item-dialog': FreeItemDialog,
    DataGridView,
    ConfirmDialog,
    AlertDialog
  },
  data: () => ({
    dataList: {
      lstCompany1: [],
      lstCompany2: [],
      lstBizCenter1: [],
      lstBizCenter2: [],
      lstYesNo1: [],
      lstYesNo2: [],
      lstCurrency01: [],      
      lstCurrency02: [],  
      lstUOM: [],
      selectList:[],
      selectedDatas:[]
    },
    selectedTab: "1",
    CustomerType: "",
    chkCheckAll1: false,
       
    modelSet: {        
      P_ACTIVE_YN:"",        
      P_DATE_APPLY: "",
    },
    modelSearch:{
      txtPartnerName01:"",
      P_TCO_COMPANY_PK: "",
      P_TCO_BUSPLACE_PK: "",
      P_TCO_BUSPARTNER_PK: "",
      P_APPLY_FROM_FR: "",
      P_APPLY_FROM_TO: "",
      P_APPLY_TO_FR: "",
      P_APPLY_TO_TO: "",
      P_TLG_IT_ITEMGRP_PK: "",
      P_ITEM_SEARCH: "",
      P_ACTIVE_YN: ""
    },
    returnRows: 0,
    objClick: "",
    
    cellDblClickGrdDetail: {}
  }),
  created() {
    /*TODO: */ 
    this.dataList.lstYesNo1 = [{CODE: "", NAME: ""}, {CODE: "Y", NAME: this.$t("yes")}, {CODE: "N", NAME: this.$t("no")}];
    this.dataList.lstYesNo2 = [{CODE: "Y", NAME: this.$t("yes")}, {CODE: "N", NAME: this.$t("no")}];
    this.dataList.lstColumns = [{CODE: "ACTIVE_YN", NAME: this.$t("active_yn")}, {CODE: "APPLY_FROM_DT", NAME: this.$t("apply_from_date")}, {CODE: "APPLY_TO_DT", NAME: this.$t("apply_to_date")}];
    this.SYS_SEL_LIST_COMPANY([this.user.PK]); 
           
    this.LG_GET_ITEMGRP( ["ITEMGRP",this.user.TCO_COMPANY_PK, this.user.PK,'']);
    //this.getListCodes();
    // this.modelSearch.P_APPLY_FROM_FR = null;
    // this.modelSearch.P_APPLY_FROM_TO = null;
    // this.modelSearch.P_APPLY_TO_FR = null;
    // this.modelSearch.P_APPLY_TO_TO = null;
  },


  watch: {
    chkCheckAll1(value)
    {
      this.onChangCheckAll(value);
    }
  },
  mounted() {
  
    /*TODO: */
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 350;
    }
  },
  methods: {
    onAfterLoad()
    {
      this.returnRows = this.$refs.grdDetail01.getDataSource().length;
    },

    onClearDeliTo()
    {      
      this.modelSearch.P_TCO_BUSPARTNER_PK = '';
      this.modelSearch.txtPartnerName01 = '';     
    },
    mappingPartner(item) {      
      if(item){    
        if (this.CustomerType == 'CUSTOMER01')
        {
          this.modelSearch.P_TCO_BUSPARTNER_PK = item.PK;        
          this.modelSearch.txtPartnerName01 = item.PARTNER_ID+" - "+item.PARTNER_NAME;
        }        
      }
    },

    onChangCheckAll(value)
    {
      let updValue1 = (value ? "Y":"N");
      let arrRowSelected = this.$refs.grdDetail.instance.getSelectedRowsData();
              if (arrRowSelected.length > 0)
              {
                  for (let i = 0; i < arrRowSelected.length; i++) 
                  {
                      if (this._hasValue(arrRowSelected[i].PK)) {
                        let arrIdx = this.dataGrid2.findIndex( e => e.PK == arrRowSelected[i].PK );                                         
                        this.dataGrid2[arrIdx]["CONFIRM_YN"] = updValue1;                                                                      
                        this.dataGrid2[arrIdx]._rowstatus = "UPDATE";                                   
                      } 
                  } 
              }  
              else
              {
                for (let i = 0; i < this.dataGrid2.length; i++) 
                {                                                        
                  this.dataGrid2[i]["CONFIRM_YN"] = updValue1;                                                      
                  this.dataGrid2[i]._rowstatus = "UPDATE";                                                    
                }
              }       

    },

    onClickLabel(obj){
      if(this.isPopYN)
      {
        return
      }
      switch(obj){
        case 'CUSTOMER01':
          this.CustomerType = obj;
          this.$refs.delitoDialog.txtExpired_Date_YN = 'Y';
          this.$refs.delitoDialog.dialogIsShow = true;
          break;       
      }
    },

    onClickButton(obj) {
      switch (obj) {
        case "btnSearch":
          this.$refs.grdDetail01.loadData();        
          break;       
        case "btnAddNew":         
          //  if (!this._hasValue(this.modelSearch.P_TCO_BUSPARTNER_PK) || !this._hasValue(this.modelSearch.P_TCO_BUSPLACE_PK))
          //  {
          //    this.showNotification("danger", this.$t("pls_choose_consignor_first"), "");
          //    return;
          //  }
           this.$refs.refFreeItemDialog.dataGrid1 = [];
           this.$refs.refFreeItemDialog.dataGrid2 = [];
          // this.$refs.refFreeItemDialog.P_TCO_BUSPARTNER_PK = this.modelSearch.P_TCO_BUSPARTNER_PK;
           this.$refs.refFreeItemDialog.dialogIsShow = true;
          break;
        case "btnSave":
          this.objClick = "btnSave";
          this.$refs.confirmDialog.showConfirm(
            this.$t("do_you_want_save")
          );
          break;
        case "btnDelete":
          this.objClick = "btnDelete";
          this.$refs.confirmDialog.showConfirm(
            this.$t("do_you_want_delete"),
            "warning"
          );
          break;  
        case "btnGetSOPrice":
          this.objClick = "btnGetSOPrice";
          this.$refs.confirmDialog.showConfirm(
            this.$t("do_you_want_to_get_price_from_sale_order")
          );
          break;   
          
         case "btnSetData":                        
            let updateValue1 = "";
           let colindex1 = this.modelSet.lstColumns;
            switch(this.modelSet.lstColumns)
            {              
              case "ACTIVE_YN":
                  updateValue1 = this.modelSet.P_ACTIVE_YN;
              break;              
            
              case "APPLY_FROM_DT":                  
              case "APPLY_TO_DT":
                  updateValue1 = this.modelSet.P_DATE_APPLY;
              break;
            }
            
            let selectRows = this.$refs.grdDetail01.getSelectRowsData().length;    
            if (selectRows > 0)
              {
                  for (let i = 0; i < selectRows; i++) 
                  {
                        let pk = this.$refs.grdDetail01.getSelectRowsData()[i].PK;
                        this.$refs.grdDetail01.setCellValue(colindex1,updateValue1,pk);                                                    
                  } 
              }                        
        break;

        case "btnAgreeCF":    
          if (this.objClick == "btnSave") {
            this.$refs.grdDetail01.saveData();          
          } else if (this.objClick == "btnDelete") {
            this.$refs.grdDetail01.deleteRows();
          } 
          
          break;        
      }
    },

    onChangeField(obj) {
      switch (obj) {   
        case "lstCompany1":
          this.LG_SEL_WMS_BIZ([
            this.modelSearch.P_TCO_COMPANY_PK
          ]);
          break;         
      }
    },

    callBackFreeItem(objData) {
      if (objData) {
        objData.forEach(item => {
          let insertRow = {};                     
          insertRow.PK = this._uniqueID(); 
          if (this._hasValue(this.modelSearch.P_TCO_COMPANY_PK))
          {
            insertRow.TCO_COMPANY_PK = this.modelSearch.P_TCO_COMPANY_PK;
          }      
          else
          {
            insertRow.TCO_COMPANY_PK = this.dataList.lstCompany1[0]["PK"] ; 
          }    
          // if (this._hasValue(this.modelSearch.P_TCO_BUSPLACE_PK))
          // {
          //   insertRow.TCO_BUSPLACE_PK = this.modelSearch.P_TCO_BUSPLACE_PK;
          // }      
          // else
          // {
          //   insertRow.TCO_BUSPLACE_PK = this.dataList.lstBizCenter1[0]["PK"] ; 
          // }
          // insertRow.PARTNER_NAME = this.modelSearch.txtPartnerName01;                     
          insertRow.GRP_NM = item.ITEMGRP_NAME;                              
          insertRow.ITEM_CODE = item.ITEM_CODE;
          insertRow.ITEM_NAME = item.ITEM_NAME;    
          insertRow.EXPIRE_DAYS =  0;
          insertRow.APPLY_FROM_DT =  null;   
          insertRow.APPLY_TO_DT =  null;  
          insertRow.ACTIVE_YN = 'Y';     
          insertRow.DESCRIPTION =  "";   
          // insertRow.TCO_BUSPARTNER_PK = this.modelSearch.P_TCO_BUSPARTNER_PK;
          insertRow.TLG_IT_ITEM_PK = item.TLG_IT_ITEM_PK;
          this.$refs.grdDetail01.addRowStruct(insertRow); 
        });
      }
    },
         
    /*NOTE: */
    

    onEndEditGrid(e) {     
    },
  
     /*NOTE: */
    async SYS_SEL_LIST_COMPANY(_param) {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: _param,
      };
      this.dataList.lstCompany1 = await this._dsoCall(dso, "select", false);
      if (this.dataList.lstCompany1.length > 0) {
        this.modelSearch.P_TCO_COMPANY_PK = this.dataList.lstCompany1[0]["PK"];        
      }
      this.onChangeField("lstCompany1");
    },
     /*NOTE: */
    async LG_SEL_WMS_BIZ(_param) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_WMS_BIZ",
        para: _param,
      };
      this.dataList.lstBizCenter1 = await this._dsoCall(dso, "select", false);
      if (this.dataList.lstBizCenter1.length > 0) {
        this.modelSearch.P_TCO_BUSPLACE_PK = this.dataList.lstBizCenter1[0]["PK"];        
      }    
      this.$refs.grdDetail01.reRender(); 
    },
    async getListCodes() {
    //   let lstCommoncode = await this._getCommonCode2( ['LGCM0100','LGCM0130'],  this.user.TCO_COMPANY_PK  );
    //   this.dataList.lstCurrency01 = lstCommoncode[0];
    //   this.dataList.lstYesNo1 = lstCommoncode[1];   
      
    //   this.dataList.lstCurrency02 =  [...this.dataList.lstCurrency01];
    //   this.dataList.lstCurrency01.unshift({ CODE: "", NAME: "All" });                    
    //   this.modelSearch.lstCurrency01 = "";   
    //   if (this.dataList.lstCurrency02.length > 0) {
    //         this.modelSet.lstCurrency02 = this.dataList.lstCurrency02[0]["CODE"];
    //   }       
      
    //   this.dataList.lstYesNo2  = [...this.dataList.lstYesNo1];
    //   this.dataList.lstYesNo1.unshift({ CODE: "", NAME: "All" });
    //   if (this.dataList.lstYesNo1.length > 0) {
    //         this.modelSearch.lstYesNo1 = this.dataList.lstYesNo1[0]["CODE"];
    //       }  
    //  if (this.dataList.lstYesNo2.length > 0) {
    //         this.modelSet.P_ACTIVE_YN = this.dataList.lstYesNo2[0]["CODE"];
    //       }     
    },
    /*NOTE: */
    async LG_GET_ITEMGRP(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_FREEITEM_DIALOG',
        para: _param
			}
			switch(_param[0]){
        case 'ITEMGRP':
          this.dataList.lstItemGroup01 = await this._dsoCall(dso, "select", false);
          this.dataList.lstItemGroup01.unshift({ CODE: "", NAME: "All" });                                     
           if (this.dataList.lstItemGroup01.length > 0) {
            this.modelSearch.lstItemGroup01 = this.dataList.lstItemGroup01[0]["CODE"];
          }         
          break;                 
      }
		},
  }
};
</script>

<style>
.btn {
  min-width: 100px;
  min-height: 30px;
  max-width: 100px;
  max-height: 30px;
}
</style>
