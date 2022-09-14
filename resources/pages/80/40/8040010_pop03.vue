<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">
    <v-dialog id="dialog-8040010_pop01" max-width="1400" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">{{ $t('item_without_spec') }}
         <v-spacer></v-spacer>
         <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row no-gutters>
              <v-col class="pt-0" md="3" align="center">
                <b style="color:red; "> {{this.lblGroupName}}  </b>
              </v-col>
              <v-col class="pt-0" md="3" align="center">
                <i style="color:red; ">{{$t('rows')}} : {{this.rows}}  </i>
              </v-col>
              <v-col md="2" class="pt-0">
                <v-text-field
                  :label="$t('item_search01')"
                  v-model="item_search01"
                  clearable
                  dense
                  hide-details
                />
              </v-col>    
              <v-col md="3" class="pt-0" style="text-align:right">                   
                <v-btn
                  icon
                  tile
                  dark
                  :color="currentTheme"
                  :disabled="isProcessing"
                  @click="onClickButton('btnSearch01')"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      tile
                      :color="currentTheme"
                      :disabled="isProcessing"
                      @click="onAddNew('1')"
                      v-on="on"
                    >
                      <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("new", "common") }}</span>
                </v-tooltip>               
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      tile
                      :color="currentTheme"
                      :disabled="isProcessing"
                      @click="onClickButton('btnDelete01')"
                      v-on="on"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("delete", "common") }}</span>
                </v-tooltip>
                 <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          icon
                                          tile
                                          color="success"
                                          :disabled="isProcessing"
                                          @click="onClickButton('btnUnDelete01')"
                                          v-on="on"
                                        >
                                          <v-icon>mdi-reload</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>{{ $t("un_delete") }}</span>
                                    </v-tooltip>        
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      tile
                      color="success"
                      :disabled="isProcessing"
                      @click="onClickButton('btnSave01')"
                      v-on="on"
                    >
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("save", "common") }}</span>
                </v-tooltip>                  
              </v-col>                                         
            </v-row> 
            <v-row align="center" justify="space-between" class="pa-0">
              <v-col cols="12" class="pt-0">
                <DataGridView
                  column-resizing-mode="widget"
                  ref="grdDetail11"                   
                  sel_procedure="LG_SEL_8040010_POP03_2"
                  upd_procedure="LG_UPD_8040010_POP03_2"
                  select_mode="MultipleHideBox"
                  :auto_load="false"
                  :max_height="limitHeight"
                  @setDataSource="onAfterLoad"
                  @cellDblClick="onCellDbClick"
                  :filter_paras="[this.item_search01,this.txtItemGroupPK2, this.txtItemPK]"                   
                  :update_paras="[
                      'PK',
                      'ITEM_SEQ',
                      'ITEM_CODE',   
                      'ITEM_NAME',
                      'ITEM_LNAME',
                      'ITEM_FNAME',
                      'UOM',
                      'REF_UOM',
                      'REF_UOM_2',   
                      'USE_YN',
                      'DESCRIPTION',
                      'TLG_IT_ITEMPHOTO_PK',
                      'TLG_IT_ITEMGRP_PK',
                      'TAC_ABACCTCODE_PK',
                      'AC_NM',
                      'TAC_ABACCTCODE_PK_EXPENSE',
                      'EXPENSE_AC_NM',
                      'TAC_ABACCTCODE_PK_REVENUE',
                      'REVENUE_AC_NM',
                      'BOM_YN',
                      'INVENTORY_YN',   
                      'HS_CODE',
                      'DF_WIDTH',
                      'LOT_WEIGHT'
                    ]"
                :header="[       
                  {dataField: 'ITEM_SEQ',  caption: this.$t('seq'),   allowEditing: true},
                  {dataField: 'ITEM_CODE',caption: this.$t('item_code'), allowEditing: true },   
                  {dataField: 'ITEM_NAME',caption: this.$t('item_name'), allowEditing: true },       
                  {dataField: 'ITEM_LNAME',caption: this.$t('item_lname'), allowEditing: true },   
                  {dataField: 'ITEM_FNAME',caption: this.$t('item_fname'), allowEditing: true }, 
                  {dataField: 'UOM',caption: this.$t('uom'), allowEditing: true,
                    lookup: { dataSource: this.dataList.lstUOM1, displayExpr:'CODEDESC', valueExpr: 'CODEKEY' } 
                  }, 
                  {dataField: 'REF_UOM',caption: this.$t('ref_uom'), allowEditing: true,
                    lookup: { dataSource: this.dataList.lstUOM1, displayExpr:'CODEDESC', valueExpr: 'CODEKEY' } 
                  }, 
                  {dataField: 'REF_UOM_2',caption: this.$t('ref_uom_2'), allowEditing: true,
                    lookup: { dataSource: this.dataList.lstUOM1, displayExpr:'CODEDESC', valueExpr: 'CODEKEY' } 
                  },    
                  {dataField: 'USE_YN',caption: this.$t('use_yn'), allowEditing: true, dataType: 'checkbox' },   
                  {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: true }, 
                  {dataField: 'AC_NM',caption: this.$t('wh_ac'), allowEditing: false }, 
                  {dataField: 'EXPENSE_AC_NM',caption: this.$t('expense_ac'), allowEditing: false }, 
                  {dataField: 'REVENUE_AC_NM',caption: this.$t('revenue_ac'), allowEditing: false }, 

                  {dataField: 'BOM_YN',caption: this.$t('bom_yn'), allowEditing: true, dataType: 'checkbox'  },   
                  {dataField: 'INVENTORY_YN',caption: this.$t('inventory_yn'), allowEditing: true, dataType: 'checkbox'  },   

                  {dataField: 'HS_CODE',caption: this.$t('hs_code'), allowEditing: true },   
                  {dataField: 'DF_WIDTH',caption: this.$t('df_width'), allowEditing: true },   
                  {dataField: 'LOT_WEIGHT',caption: this.$t('lot_weight'), allowEditing: true }                                       
                ]"           
                />
              </v-col>
            </v-row>   
          </v-container>
        </v-card-text>
    </v-card>
  </v-dialog>      
    <account-dialog ref="accountDialog" :multiSelectMode="false" @returnAccountInfo="onMappingAll"></account-dialog>
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
    <alert-dialog ref="alertDialog"></alert-dialog>
  </v-container>
</template>

<script>

import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import DatePicker from "@/components/control/DatePicker";
import DataGridView from "@/components/control/DataGridView";
import AccountDialog from "@/components/dialog/AccountDialog";

export default {
  layout: "default",
  middleware: "user",

  components: {
    "date-picker": DatePicker,
    'account-dialog': AccountDialog,
    DataGridView,  
    ConfirmDialog,
    AlertDialog
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {
      lstUOM1: [],   
      selectList:[],
      selectedDatas:[]      
    },
    isRefesh: "N",

    IsGrpSpec:true,
    
    item_search01: "",
    lblGroupName: "",
    txtGrpUOM: "",
    txtLeafYN: "",
    txtCompanyPK: "",
    txtItemGroupPK2: "",
    txtItemPK: "",
    popup_type: "",
    item_type: "",
    txtMasterPK: "",

    radSearchPage1: "1",
    rows: 0,
    objClick: "",
    oldGroupPK: 0,
  
    seft: this
  }),
  created() {
    /*TODO: */
    //this.getCompany([this.user.PK]);
    //this.getListSpec([this.modelMaster1.tlg_it_itemgrp_pk]);
    ///this.LG_LST_8040010(["ITEMGROUP", this.modelMaster1.Company, this.radSearchPage1]);    
//this.LG_LST_8040010(["UOM", "", ""]);
    //this.LG_LST_8040010(["COLUMNS", "", ""]);
  },

 watch: {
    dialogIsShow(val)
     {       
       if (val === true)
       {                  
         this.LG_SEL_8040010_POP03_1();        
       }       
     },
   },
 
  mounted() {
    /*TODO: */
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 600;
    },
  },
  methods: {
 
    onClickLabel(obj) {    
      switch (obj) {        
        case "ACCOUNT1":
        case "ACCOUNT2":
        case "ACCOUNT3":
          this.objClick=obj;
          this.$refs.accountDialog.dialogIsShow = true;
          break;       
      }
    },
    onCellDbClick(_event) { 
      this.cellDblClickgrdDetail11 = _event;
      switch (_event.column.dataField) {
       case "AC_NM":
          this.objClick="ACCT_NM";
          this.$refs.accountDialog.dialogIsShow = true;   
        break;    
        case "EXPENSE_AC_NM":
          this.objClick="EXPENSE_NM";
          this.$refs.accountDialog.dialogIsShow = true;   
        break;    
        case "REVENUE_AC_NM":
          this.objClick="REVENUE_NM";
          this.$refs.accountDialog.dialogIsShow = true;   
        break;           
      }       
    },      
    onMappingAll(item) {
      if (item) {
        
        switch(this.objClick)
        {         
          case "ACCT_NM":
            this.$refs.grdDetail11.setCellValue("TAC_ABACCTCODE_PK",item.PK,this.cellDblClickgrdDetail11.data.PK);
            this.$refs.grdDetail11.setCellValue("AC_NM",item.AC_NM,this.cellDblClickgrdDetail11.data.PK);            
          break;
          case "EXPENSE_NM":
            this.$refs.grdDetail11.setCellValue("TAC_ABACCTCODE_PK_EXPENSE",item.PK,this.cellDblClickgrdDetail11.data.PK);
            this.$refs.grdDetail11.setCellValue("EXPENSE_AC_NM",item.AC_NM,this.cellDblClickgrdDetail11.data.PK);              
          break;
          case "REVENUE_NM":
            this.$refs.grdDetail11.setCellValue("TAC_ABACCTCODE_PK_REVENUE",item.PK,this.cellDblClickgrdDetail11.data.PK);
            this.$refs.grdDetail11.setCellValue("REVENUE_AC_NM",item.AC_NM,this.cellDblClickgrdDetail11.data.PK);     
          break;                    
        }
      }     
    },
  
    onClickButton(obj) {
      switch (obj) {      
        case "btnSearch01":  
          this.$refs.grdDetail11.loadData();              
        break;          
        case "btnAddNew01":
          break;          
        case "btnSave01":
          this.objClick = "btnSave01";
          this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_save'));
          break;  
        case "btnDelete01":
          this.objClick = "btnDelete01";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_delete_this_item"),"warning");
          break;                 
        case "btnUnDelete01":
          this.objClick = "btnUnDelete01";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_undelete_this_spec"),"warning");
          break;  
        case "btnAgreeCF":
         if (this.objClick == "btnSave01") {
           this.$refs.grdDetail11.saveData();
          } else if (this.objClick == "btnDelete01") {
              this.$refs.grdDetail11.deleteRows();
          } else if (this.objClick == "btnUnDelete01") {
              this.$refs.grdDetail11.unDeleteRows2();    
          } 
          break;       
      }
    },
    onAfterLoad()
    {
      if (this.popup_type == "2"  && this._hasValue(this.txtItemPK))
      {
        this.txtItemPK = "";
        this.onCoppy();     
      }
    },
    onCoppy()
    {
        this.$refs.grdDetail11.getDataSource()[0]._rowstatus = "i";
        this.$refs.grdDetail11.getDataSource()[0].PK = this._uniqueID();
        this.$refs.grdDetail11.getDataSource()[0].ITEM_SEQ = "";
        this.$refs.grdDetail11.getDataSource()[0].ITEM_CODE = "";
        this.$refs.grdDetail11.getDataSource()[0].ITEM_NAME = "";
        this.$refs.grdDetail11.getDataSource()[0].ITEM_LNAME = "";
        this.$refs.grdDetail11.getDataSource()[0].ITEM_FNAME = "";
    },

    //------------------------------------------------------------ 
    onAddNew(pos)
    {
        switch(pos)
        {
            case '1' :
                if (this._hasValue(this.txtItemGroupPK2))
                {
                    if ( this.txtLeafYN == 'Y' )
                    {
                      let insertRow = {};
                      insertRow.PK= this._uniqueID();
                      insertRow.ITEM_SEQ= "";
                      insertRow.ITEM_CODE= "";   
                      insertRow.ITEM_NAME= "";
                      insertRow.ITEM_LNAME= "";
                      insertRow.ITEM_FNAME= "";
                      insertRow.UOM= this.txtGrpUOM;
                      insertRow.REF_UOM= "";
                      insertRow.REF_UOM_2= "";   
                      insertRow.USE_YN= "Y";
                      insertRow.DESCRIPTION= "";
                      insertRow.TLG_IT_ITEMPHOTO_PK= "";
                      insertRow.TLG_IT_ITEMGRP_PK= this.txtItemGroupPK2;
                      insertRow.TAC_ABACCTCODE_PK= "";
                      insertRow.AC_NM= "";
                      insertRow.TAC_ABACCTCODE_PK_EXPENSE= "";
                      insertRow.EXPENSE_AC_NM= "";
                      insertRow.TAC_ABACCTCODE_PK_REVENUE= "";
                      insertRow.REVENUE_AC_NM= "";
                      insertRow.BOM_YN= "N";
                      insertRow.INVENTORY_YN= "Y";   
                      insertRow.HS_CODE= "";
                      insertRow.DF_WIDTH= "";
                      insertRow.LOT_WEIGHT= "";
                      this.$refs.grdDetail11.addRowStruct(insertRow);     
                    }
                    else
                    {
                      this.showNotification("danger", this.$t('add_new_for_leaf_group_only!'), "");
                    }    
                }
                else
                {
                  this.showNotification("danger", this.$t('pls_select_group_first!'), "");
                }    
            break;            
        }    
    },
        

    /*NOTE: */
    async LG_SEL_8040010_POP03_1() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_8040010_POP03_1",
        para: [this.txtItemGroupPK2]
      };
      let result = await this._dsoCall(dso, "select", false);          
      if (result) {
        this.lblGroupName         =  result[0].GRP_NM;  
        this.txtGrpUOM            =  result[0].ITEM_UOM;  
        this.txtLeafYN            =  result[0].LEAF_YN;  
        this.$refs.grdDetail11.Clear();
        this.$refs.grdDetail11.reRender();
        if (this.popup_type != "1")         
        {
          this.$refs.grdDetail11.loadData();
        }
        else
        {
           this.onAddNew('1');
        }
      }         
    }
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
