<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">
    <v-dialog id="dialog-4070051" max-width="1400" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">{{ $t('item_entry') }}
         <v-spacer></v-spacer>
         <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">        
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-card class="pa-2 pt-0">
                      <v-row align="center" justify="space-between">
                        <v-col  md="9" class="pt-0">        
                          <v-row align="center" justify="space-between">
                            <v-col md="3" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.GRP_CD"
                                :label="$t('group_code')"                          
                                readonly
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="8" class="pt-0">
                              <v-text-field
                                v-model="modelMaster1.GRP_NM"
                                :label="$t('group_name')"                                                     
                                readonly                          
                                dense
                                hide-details
                              >
                              <template v-slot:append>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-icon
                                      v-on="on"
                                      :color="currentTheme"
                                      @click="onClickLabel('ITEMGROUP')"
                                      >mdi-window-restore</v-icon
                                    >
                                  </template>
                                </v-tooltip>                                
                              </template>
                              </v-text-field>
                            </v-col>
                           
                            <v-col md="1" class="pt-0">
                              
                            </v-col>                                                                             
                          </v-row>
                          <v-row align="center" justify="space-between">
                            <v-col md="3" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.ST_ITEMCODE"
                                :label="$t('st_item_code')"                          
                                readonly
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="8" class="pt-0">
                              <v-text-field
                                v-model="modelMaster1.ST_ITEMNAME"
                                :label="$t('st_item_name')"                                                     
                                readonly                          
                                dense
                                hide-details
                              >
                              <template v-slot:append>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-icon
                                      v-on="on"
                                      :color="currentTheme"
                                      @click="onClickLabel('STITEM')"
                                      >mdi-window-restore</v-icon
                                    >
                                  </template>
                                </v-tooltip>                               
                              </template>
                              </v-text-field>
                            </v-col>
                           
                            <v-col md="1" class="pt-0">                              
                            </v-col>                                                                             
                          </v-row>
                          <v-row align="center" justify="space-between">
                            <v-col md="11" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.ITEM_CODE"
                                :label="$t('item_code')"                                                          
                                dense
                                hide-details
                              />
                            </v-col>                           
                            <v-col md="1" class="pt-0">
                                <v-checkbox
                                    dense
                                    hide-details
                                    class="mt-0"
                                    :color="currentTheme"
                                    :label="$t('manual')"
                                    v-model="modelMaster1.CODE_MANUAL"
                                    true-value="Y" false-value="N"
                                />
                            </v-col>                                                                             
                          </v-row>
                          <v-row align="center" justify="space-between">
                            <v-col md="12" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.ITEM_NAME"
                                :label="$t('item_name')"                                                          
                                dense
                                hide-details
                              />
                            </v-col>                                                                                                                              
                          </v-row>
                          <v-row align="center" justify="space-between">
                            <v-col md="12" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.ITEM_LNAME"
                                :label="$t('l_name')"                                                          
                                dense
                                hide-details
                              />
                            </v-col>                                                                                                                              
                          </v-row>
                          <v-row align="center" justify="space-between">
                            <v-col md="12" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.ITEM_FNAME"
                                :label="$t('f_name')"                                                          
                                dense
                                hide-details
                              />
                            </v-col>                                                                                                                              
                          </v-row>
                          <v-row align="center" justify="space-between">                           
                            <v-col md="4" class="pt-0">
                              <v-select
                                v-model="modelMaster1.UOM"
                                :label="$t('uom')"
                                item-value="CODEKEY"
                                item-text="CODEDESC"
                                :items="dataList.lstUOM1"                   
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="1" class="pt-0">
                                <v-checkbox
                                    dense
                                    hide-details
                                    class="mt-0"
                                    :color="currentTheme"
                                    :label="$t('active')"
                                    v-model="modelMaster1.USE_YN"
                                    true-value="Y" false-value="N"
                                />
                            </v-col>      
                            <v-col md="3">
                              <date-picker
                                :inputValue="modelMaster1.ST_DATE"
                                :label="$t('from_date')"
                                @returnValue="modelMaster1.ST_DATE = $event"
                                placeholder=" "
                              ></date-picker>
                            </v-col>
                            <v-col md="1">~</v-col>
                            <v-col md="3">
                              <date-picker
                                :inputValue="modelMaster1.END_DATE"
                                :label="$t('to_date')"
                                @returnValue="modelMaster1.END_DATE = $event"
                                placeholder=" "
                              ></date-picker>  
                             </v-col>                                                          
                          </v-row>
                          <v-row align="center" justify="space-between">
                            <v-col md="12" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.DESCRIPTION"
                                :label="$t('remark')"                                                          
                                dense
                                hide-details
                              />
                            </v-col>                                                                                                                              
                          </v-row>
                        </v-col>
                        <v-col  md="3" class="pt-0"> 
                          <v-row align="center" justify="space-between" class="pt-0">
                            <v-col md="6" class="pt-0" style="text-align:right">                                                
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    icon
                                    tile
                                    :color="currentTheme"
                                    :disabled="isProcessing"
                                    @click="onAddNew_Master()"
                                    v-on="on"
                                  >
                                    <v-icon>mdi-plus-box</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ $t("new") }}</span>
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
                                <span>{{ $t("save") }}</span>
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
                                <span>{{ $t("delete") }}</span>
                              </v-tooltip>
                                              
                            </v-col>  
                             <v-col md="6" class="pt-0" style="text-align:right">                                                                                                                                                          
                            </v-col>   
                          </v-row>
                          <v-row align="center" justify="space-between">
                          </v-row>  
                        </v-col>
                      </v-row>  
                    </v-card>
                    <v-card>  
                      <v-row no-gutters>
                        <v-col cols='12'>
                          <v-btn-toggle dense  mandatory  :color="currentTheme"  v-model="selectedTab">
                            <v-btn value="1">{{ $t('spec') }}</v-btn>
                            <v-btn value="2">{{ $t('other_info') }}</v-btn>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                      <v-row align="center" justify="space-between" class="pa-0">
                        <v-col cols="12" class="pt-0">
                          <v-card  v-show="selectedTab === '1'"  height="360"   > 
                            <v-row align="center" justify="space-between" class="pt-0">
                              <v-col  md="10" class="pt-0"> 
                              </v-col>
                              <v-col  md="2" class="pt-0"> 
                                <v-row align="center" justify="space-between">
                                  <v-col md="12" class="pt-0" style="text-align:right">                                                              
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          icon
                                          tile
                                          :color="currentTheme"
                                          :disabled="isProcessing"
                                          @click="onClickButton('btnDelete02')"
                                          v-on="on"
                                        >
                                          <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>{{ $t("delete") }}</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          icon
                                          tile
                                          color="success"
                                          :disabled="isProcessing"
                                          @click="onClickButton('btnUnDelete02')"
                                          v-on="on"
                                        >
                                          <v-icon>mdi-reload</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>{{ $t("un_delete") }}</span>
                                    </v-tooltip>                       
                                  </v-col>   
                                </v-row>
                              </v-col>
                            </v-row>
                            <v-row align="center" justify="space-between" class="pt-0">
                              <v-col cols="12" class="pt-0 px-8">
                                <DataGridView
                                  column-resizing-mode="widget"
                                  ref="grdDetail11"                   
                                  sel_procedure="LG_SEL_8040010_POP01_2"
                                  upd_procedure="LG_UPD_8040010_POP01_2"
                                  select_mode="MultipleHideBox"
                                  :auto_load="false"
                                  :max_height="280"
                                  @setDataSource="onAfterLoad"
                                  @cellDblClick="onCellDbClick"
                                  :filter_paras="[this.modelMaster1.TLG_IT_ITEMGRP_PK,this.modelMaster1.TLG_IT_STITEM_PK,this.modelMaster1.PK, this.txtCoppyPK]"                   
                                  :update_paras="[
                                      'TLG_IT_GRPSPECGRP_PK', 
                                      'TLG_IT_ITEMSPEC_PK',
                                      'TLG_IT_ITEMGRP_PK', 
                                      'GRP_CD', 
                                      'TLG_IT_ITEM_PK', 
                                      'SEQ',
                                      'TLG_IT_SPECGRP_PK', 
                                      'SPECGRP_NM', 
                                      'MANDATORY',
                                      'TLG_IT_SPEC_PK', 
                                      'SPEC_ID', 
                                      'SPEC_NM', 
                                      'SPEC_LNM',
                                      'SPEC_FNM', 
                                      'IDAUTO_YN', 
                                      'SPEC_TYPE', 
                                      'TYPE_YN', 
                                      'STMAPPING_YN',
                                      'DISPLAY_YN_CD',
                                      'DISPLAY_YN',
                                      'PREFIX_SIGN_CD', 
                                      'PREFIX_SIGN', 
                                      'ITEM_CODE_SEQ',
                                      'IN_TYPE'
                                    ]"
                                :header="[       
                                  {dataField: 'SEQ',  caption: this.$t('seq'),   allowEditing: false},
                                  {dataField: 'SPECGRP_NM',caption: this.$t('spec_group'), allowEditing: false },   
                                  {dataField: 'SPEC_ID',caption: this.$t('spec_id'), allowEditing: false },       
                                  {dataField: 'SPEC_NM',caption: this.$t('spec_name'), allowEditing: false },   
                                  {dataField: 'SPEC_TYPE_NM',caption: this.$t('spec_type'), allowEditing: false },   
                                  {dataField: 'DISPLAY_YN_CD',caption: this.$t('display_cd'), allowEditing: false, dataType: 'checkbox' },   
                                  {dataField: 'DISPLAY_YN',caption: this.$t('display_nm'), allowEditing: false, dataType: 'checkbox'  },   
                                  {dataField: 'PREFIX_SIGN_CD',caption: this.$t('prefix_code'), allowEditing: false },   
                                  {dataField: 'PREFIX_SIGN',caption: this.$t('prefix_name'), allowEditing: false },   
                                  {dataField: 'ITEM_CODE_SEQ',caption: this.$t('item_code_seq'), allowEditing: false } ,
                                  {dataField: 'TLG_IT_ITEM_PK',caption: this.$t('TLG_IT_ITEM_PK'), allowEditing: false }                                       
                                ]"           
                                />
                               </v-col>
                            </v-row>  
                          </v-card>  
                          <v-card  v-show="selectedTab === '2'" height="360"  > 
                            <v-row align="center" justify="space-between" class="pt-2">
                              <v-col cols="4" class="pt-0">
                                <v-card class="pa-2 py-0 rounded" outlined tile  height="130">
                                  <v-row align="center" justify="space-between">                           
                                      <v-col md="12"  class="pt-0" align="center">
                                        <b>{{$t('weight')}}</b>
                                      </v-col>                                                            
                                  </v-row>                               
                                  <v-row align="center" justify="space-between">                           
                                      <v-col md="12" class="pt-0">
                                        <v-select
                                          v-model="modelMaster1.UOM_WT"
                                          :label="$t('unit_of_measure')"
                                          item-value="CODEKEY"
                                          item-text="CODEDESC"
                                          :items="dataList.lstUOM1"                   
                                          dense
                                          hide-details
                                        />
                                      </v-col>                                                                                                    
                                    </v-row>  
                                    <v-row align="center" justify="space-between">                           
                                      <v-col md="12" class="pt-0">
                                        <!--<v-text-field :label="$t('unit_weight')" v-model="modelMaster1.WEIGHT" precision="2" type="number" placeholder=" " dense  hide-details />-->
                                        <BaseInput :label="$t('unit_weight')" v-model="modelMaster1.WEIGHT" precision="3" number />
                                      </v-col>                                                               
                                    </v-row>                                     
                                </v-card>
                                <v-card class="pa-2 py-0 rounded" outlined tile height="170">
                                  <v-row align="center" justify="space-between">                           
                                      <v-col md="12"  class="pt-0" align="center">
                                        <b>{{$t('lot')}}</b>
                                      </v-col>                                                            
                                  </v-row>                               
                                  <v-row align="center" justify="space-between">                           
                                      <v-col md="12" class="pt-0">
                                        <v-select
                                          v-model="modelMaster1.UOM_LOT"
                                          :label="$t('unit_of_measure')"
                                          item-value="CODEKEY"
                                          item-text="CODEDESC"
                                          :items="dataList.lstUOM1"                   
                                          dense
                                          hide-details
                                        />
                                      </v-col>                                                                                                    
                                    </v-row>  
                                    <v-row align="center" justify="space-between">                           
                                      <v-col md="12" class="pt-0">
                                        <v-text-field :label="$t('quantity')" v-model="modelMaster1.LOT_QTY"  type="number" placeholder=" " dense  hide-details />
                                      </v-col>                                                               
                                    </v-row>  
                                    <v-row align="center" justify="space-between">                           
                                      <v-col md="12" class="pt-0">
                                        <v-text-field :label="$t('weight')" v-model="modelMaster1.LOT_WEIGHT"  placeholder=" " format="###,###,###.##" dense  hide-details />
                                      </v-col>                                                               
                                    </v-row>  
                                </v-card>
                              </v-col>
                              <v-col cols="8" class="pt-0">
                                <v-card class="pa-2 py-0 rounded" outlined tile  height="300">
                                  <v-row align="center" justify="space-between">                           
                                      <v-col md="12"  class="pt-0" align="center">
                                        <b>{{$t('account')}}</b>
                                      </v-col>                                                            
                                  </v-row>                                     
                                  <v-row align="center" justify="space-between">                           
                                    <v-col md="4" class="pt-0">                  
                                      <v-text-field
                                        v-model="modelMaster1.EXPENSE_AC_CD"
                                        :label="$t('expense_acc_code')"                          
                                        readonly
                                        dense
                                        hide-details
                                      />
                                    </v-col>
                                    <v-col md="8" class="pt-0">
                                      <v-text-field
                                        v-model="modelMaster1.EXPENSE_AC_NM"
                                        :label="$t('expense_acc_name')"                                                     
                                        readonly                          
                                        dense
                                        hide-details
                                      >
                                      <template v-slot:append>
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-icon
                                              v-on="on"
                                              :color="currentTheme"
                                              @click="onClickLabel('ACCOUNT1')"
                                              >mdi-window-restore</v-icon
                                            >
                                          </template>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-icon
                                              v-on="on"
                                              :color="currentTheme"
                                              @click="onClearAccount('ACCOUNT1')"
                                              >mdi-eraser</v-icon
                                            >
                                          </template>
                                        </v-tooltip>
                                      </template>
                                      </v-text-field>
                                    </v-col>                                                        
                                  </v-row>  
                                  <v-row align="center" justify="space-between">                           
                                    <v-col md="4" class="pt-0">                  
                                      <v-text-field
                                        v-model="modelMaster1.REVENUE_AC_CD"
                                        :label="$t('revenue_acc_code')"                          
                                        readonly
                                        dense
                                        hide-details
                                      />
                                    </v-col>
                                    <v-col md="8" class="pt-0">
                                      <v-text-field
                                        v-model="modelMaster1.REVENUE_AC_NM"
                                        :label="$t('revenue_acc_name')"                                                     
                                        readonly                          
                                        dense
                                        hide-details
                                      >
                                      <template v-slot:append>
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-icon
                                              v-on="on"
                                              :color="currentTheme"
                                              @click="onClickLabel('ACCOUNT2')"
                                              >mdi-window-restore</v-icon
                                            >
                                          </template>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-icon
                                              v-on="on"
                                              :color="currentTheme"
                                              @click="onClearAccount('ACCOUNT2')"
                                              >mdi-eraser</v-icon
                                            >
                                          </template>
                                        </v-tooltip>
                                      </template>
                                      </v-text-field>
                                    </v-col>                                                        
                                  </v-row>      
                                  <v-row align="center" justify="space-between">                           
                                    <v-col md="4" class="pt-0">                  
                                      <v-text-field
                                        v-model="modelMaster1.AC_CD"
                                        :label="$t('wh_acc_code')"                          
                                        readonly
                                        dense
                                        hide-details
                                      />
                                    </v-col>
                                    <v-col md="8" class="pt-0">
                                      <v-text-field
                                        v-model="modelMaster1.AC_NM"
                                        :label="$t('wh_acc_name')"                                                     
                                        readonly                          
                                        dense
                                        hide-details
                                      >
                                      <template v-slot:append>
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-icon
                                              v-on="on"
                                              :color="currentTheme"
                                              @click="onClickLabel('ACCOUNT3')"
                                              >mdi-window-restore</v-icon
                                            >
                                          </template>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-icon
                                              v-on="on"
                                              :color="currentTheme"
                                              @click="onClearAccount('ACCOUNT3')"
                                              >mdi-eraser</v-icon
                                            >
                                          </template>
                                        </v-tooltip>
                                      </template>
                                      </v-text-field>
                                    </v-col>                                                        
                                  </v-row>                          
                                  <v-row align="center" justify="space-between">
                                    <v-col md="12" class="pt-0">
                                        <v-select
                                          v-model="modelMaster1.TLG_IN_WAREHOUSE_PK"
                                          :label="$t('w_h')"
                                          item-value="CODEKEY"
                                          item-text="CODEDESC"
                                          :items="dataList.lstWH"                   
                                          dense
                                          hide-details
                                        />
                                      </v-col>   
                                  </v-row>                                     
                                </v-card>  
                              </v-col> 
                            </v-row>  
                          </v-card>  
                        </v-col>
                      </v-row>
                    </v-card>                       
                  </v-col>
                </v-row>
              </v-col>
            </v-row>  
          </v-container>
        </v-card-text>
    </v-card>
  </v-dialog>      
    <account-dialog ref="accountDialog" :multiSelectMode="false" @returnAccountInfo="onMappingAll"></account-dialog>
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
    <spec-dialog ref="refSpecDialog" @returnSpecInfo="onReturnSpecInfo" />
    <item-group-dialog ref="refItemGroupDialog" @returnItemGroupInfo="onMappingAll" />
    <s-t-item-dialog ref="refSTItemDialog" @returnSTItemInfo="onMappingAll" />
    <alert-dialog ref="alertDialog"></alert-dialog>
  </v-container>
</template>

<script>
import CellGridTextField from "@/components/table/CellGridTextField";
import CellGridSelect from "@/components/table/CellGridSelect";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import CellGridDatePicker from "@/components/table/CellGridDatePicker";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import DatePicker from "@/components/control/DatePicker";
import SpecDialog from "@/pages/80/40/SpecDialog";
import ItemGroupDialog from "@/pages/80/40/ItemGroupDialog";
import STItemDialog from "@/pages/80/40/STItemDialog";
import DataGridView from "@/components/control/DataGridView";
import AccountDialog from "@/components/dialog/AccountDialog";

export default {
  layout: "default",
  middleware: "user",

  components: {
    "date-picker": DatePicker,
    'account-dialog': AccountDialog,
    ItemGroupDialog,
    STItemDialog,
    DataGridView,
    CellGridTextField,
    CellGridSelect,
    CellGridCheckbox,
    CellGridDatePicker,
    ConfirmDialog,
    AlertDialog,
    SpecDialog
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {
      lstUOM1: [],   
      lstSpecType: [{CODE: "ST",NAME: "STANDARD"},{CODE: "ITEM",NAME: "ITEM"}],
      lstWH: [],
      lstColumns: [],    
      selectList:[],
      selectedDatas:[]      
    },
    isRefesh: "N",
    isShowMess: "N",
    isReloadStock: "N",
    make_adjust_yn: "N",
    selectedTab: "1",
    isSTItemVisible:true,
    IsGrpSpec:true,

    txtCompanyPK: "",
    txtItemGroupPK2: "",
    txtItemPK: "",
    popup_type: "",
    item_type: "",
    txtCoppyPK: "",
    radSearchPage1: "1",
  
    modelMaster1: {
      _rowstatus: "",
      ACTION: "",
      PK: "",
      TLG_IT_ITEMGRP_PK: 0,
      GRP_CD: "",
      GRP_NM: "",
      TLG_IT_STITEM_PK: 0,
      ST_ITEMCODE: "",
      ST_ITEMNAME: "",
      ST_LNAME: "",
      ST_FNAME: "",
      ITEM_CODE: "",
      ITEM_NAME: "",
      UOM: "",
      USE_YN: "",
      ST_DATE: "",
      END_DATE: "",
      DESCRIPTION: "",
      TLG_IT_ITEMPHOTO_PK: 0,
      ITEM_LNAME: "",
      ITEM_FNAME: "",
      SPEC_PK_STRING: "",
      CODE_MANUAL: "N", 
      TLG_IN_WAREHOUSE_PK: 0,
      TAC_ABACCTCODE_PK: 0,
      AC_CD: "",
      AC_NM: "", 
      UOM_WT: "",
      WEIGHT: "",
      UOM_LOT: "",
      LOT_QTY: "",
      LOT_WEIGHT: "", 
      TAC_ABACCTCODE_PK_EXPENSE: 0, 
      EXPENSE_AC_CD: "", 
      EXPENSE_AC_NM: "",
      TAC_ABACCTCODE_PK_REVENUE: 0, 
      REVENUE_AC_CD: "", 
      REVENUE_AC_NM: ""
    },

    dataGrid1: [],
    dataGrid2: [],
    lstSpecHeader:[
        {  
             SPEC_1 : ""
            ,SPEC_2 : ""
            ,SPEC_3 : ""
            ,SPEC_4 : ""
            ,SPEC_5 : ""
            ,SPEC_6 : ""
            ,SPEC_7 : ""
            ,SPEC_8 : ""
            ,SPEC_9 : ""
            ,SPEC_10: ""
            ,SPEC_11: ""
            ,SPEC_12: ""
            ,SPEC_13: ""
            ,SPEC_14: ""
            ,SPEC_15: ""
        }

    ],
  
    objClick: "",
    oldGroupPK: 0,

    btnCopy: { disabled: true, visibled: true },
    gw_btnSave01: { disabled: false, visibled: true },
    gw_btnDelete01: { disabled: false, visibled: false },

    gw_btnFreeItem: { disabled: false, visibled: true },
    gw_btnProcCalcAdjQty: { disabled: true, visibled: true },
    gw_btnShowAllCol: { disabled: false, visibled: true, value: false },
    gw_btnMakeAdj: { disabled: false, visibled: true },

    cellDblClickgrdDetail11: {},
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
          if (this.popup_type == '1')
          {
            this.DSO_LG_8040010_POP01_4();
          }
          else if(this.popup_type == '2' || this.popup_type == '3')
          {
            this.modelMaster1.PK =  this.txtItemPK;
            this.DSO_LG_8040010_POP01_1("select");
            if (this.popup_type == '2')
            {
              this.txtCoppyPK = this.txtItemPK;
            }
          }
       }
       else
       {
         this.txtCoppyPK = "";
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
    resetInputData() {
      this.modelMaster1 = {
        ACTION: "",
        PK: "",
        SLIP_NO: "",
        STOCK_DATE: "",
        CHARGER_NM: this.user.USER_NAME,
        DESCRIPTION: "",
        ADJUST_YN: "N",
        acc_code: "",
        acc_name: "",
        STATUS: "",
        CHARGER_PK: this.user.THR_ABEMP_PK
      };

      let today = new Date();

      this.modelMaster1.STOCK_DATE = this._CurrentDate("-");
      this.dataGrid1 = [];

      // this.btnCopy.visibled = false;
      this.gw_btnSave01.visibled = true;
      this.gw_btnDelete01.visibled = false;
    },
    onSelectionChanged({selectedRowKeys, selectedRowsData }) {
        this.selectList = selectedRowKeys;
        this.selectedDatas = selectedRowsData;
      },
    
    valueChanged(e, colName, data) {        
        const newValue = e.value ? 'Y' : 'N'
        this.changeValue(newValue, colName, data.PK, true)
      },

      changeValue(value, key, pk, isModified) {
        this.dataGrid1.map((item, index) => {
          if(item.PK === pk) {
            this.$set(item, key, value)
            if(isModified && item.PK && item._rowstatus != 'i') {
              item._rowstatus = "u";
            }
          }
        })
      },

    //-----------------------------------------------------------------------
   
    onAddNew_Master()
    {
        this.modelMaster1._rowstatus = "INSERT";
        this.modelMaster1.PK= "";      
        this.modelMaster1.ITEM_CODE= "<< New Item >>";
        this.modelMaster1.ITEM_NAME= "";
        this.modelMaster1.TLG_IT_STITEM_PK= "",
        this.modelMaster1.ST_ITEMCODE= "",
        this.modelMaster1.ST_ITEMNAME= "",
        this.modelMaster1.ST_LNAME= "",
        this.modelMaster1.ST_FNAME= "",
        this.modelMaster1.USE_YN= "Y";
        this.modelMaster1.ST_DATE= "";
        this.modelMaster1.END_DATE= "";
        this.modelMaster1.DESCRIPTION= "";
        this.modelMaster1.TLG_IT_ITEMPHOTO_PK= "";
        this.modelMaster1.ITEM_LNAME= "";
        this.modelMaster1.ITEM_FNAME= "";
        this.modelMaster1.SPEC_PK_STRING= "";
        this.modelMaster1.CODE_MANUAL= "N"; 
        this.modelMaster1.TAC_ABACCTCODE_PK= "";
        this.modelMaster1.AC_CD= "";
        this.modelMaster1.AC_NM= ""; 
        this.modelMaster1.TAC_ABACCTCODE_PK_EXPENSE= ""; 
        this.modelMaster1.EXPENSE_AC_CD= ""; 
        this.modelMaster1.EXPENSE_AC_NM= "";
        this.modelMaster1.TAC_ABACCTCODE_PK_REVENUE= ""; 
        this.modelMaster1.REVENUE_AC_CD= ""; 
        this.modelMaster1.REVENUE_AC_NM= ""
        
        this.txtCoppyPK = "";

        this.$refs.grdDetail11.loadData();   
        
        

    }, 
 
    //-----------------------------------------------------------------------
   
    onCoppy()
    {
        this.modelMaster1._rowstatus = "INSERT";
        this.modelMaster1.PK= "";      
        this.modelMaster1.ITEM_CODE= "<< New Item >>";
        this.modelMaster1.ITEM_NAME= "";
        this.modelMaster1.USE_YN= "Y";
        this.modelMaster1.ST_DATE= "";
        this.modelMaster1.END_DATE= "";
        this.modelMaster1.DESCRIPTION= "";
        this.modelMaster1.TLG_IT_ITEMPHOTO_PK= 0;
        this.modelMaster1.ITEM_LNAME= "";
        this.modelMaster1.ITEM_FNAME= "";
        this.modelMaster1.SPEC_PK_STRING= "";
        this.modelMaster1.CODE_MANUAL= "N"; 
        this.modelMaster1.TAC_ABACCTCODE_PK= 0;
        this.modelMaster1.AC_CD= "";
        this.modelMaster1.AC_NM= ""; 
        this.modelMaster1.TAC_ABACCTCODE_PK_EXPENSE= 0; 
        this.modelMaster1.EXPENSE_AC_CD= ""; 
        this.modelMaster1.EXPENSE_AC_NM= "";
        this.modelMaster1.TAC_ABACCTCODE_PK_REVENUE= 0; 
        this.modelMaster1.REVENUE_AC_CD= ""; 
        this.modelMaster1.REVENUE_AC_NM= ""
        
        for(let i = 0; i < this.$refs.grdDetail11.getDataSource().length; i++){         
                this.$refs.grdDetail11.getDataSource()[i].TLG_IT_ITEM_PK = this.modelMaster1.PK ;
                this.$refs.grdDetail11.getDataSource()[i].TLG_IT_ITEMSPEC_PK = "" ;   
                this.$refs.grdDetail11.getDataSource()[i]._rowstatus = "u" ;         
        }
        this.popup_type = '0';
        
        //this.$refs.grdDetail11.loadData();                      

    }, 
 
    onClickLabel(obj) {    
      switch (obj) {
        case "ITEMGROUP":
          if (this._hasValue(this.modelMaster1.PK))
          {
            return;
          }
          this.objClick="ITEMGROUP";
          this.oldGroupPK = this.modelMaster1.TLG_IT_ITEMGRP_PK;
          this.$refs.refItemGroupDialog.P_TCO_COMPANY_PK = this.txtCompanyPK ;
          this.$refs.refItemGroupDialog.P_ITEM_TYPE = this.item_type ;
          this.$refs.refItemGroupDialog.dialogIsShow = true;
          break;  
        case "STITEM":
          if (this._hasValue(this.modelMaster1.PK))
          {
            return;
          }
          this.objClick="STITEM";          
          this.$refs.refSTItemDialog.P_TCO_COMPANY_PK = this.txtCompanyPK ;
           this.$refs.refSTItemDialog.P_TLG_IT_ITEMGRP_PK0 = this.modelMaster1.TLG_IT_ITEMGRP_PK;
          this.$refs.refSTItemDialog.P_ITEM_TYPE = this.item_type ;          
          this.$refs.refSTItemDialog.dialogIsShow = true;
         
          break;    
        case "ACCOUNT1":
        case "ACCOUNT2":
        case "ACCOUNT3":
          this.objClick=obj;
          this.$refs.accountDialog.dialogIsShow = true;
          break;       
      }
    },

    onMappingAll(item) {
      if (item) {        
        switch(this.objClick)
        {
          case "ITEMGROUP":
            this.modelMaster1.TLG_IT_ITEMGRP_PK = item.PK;
            this.modelMaster1.GRP_CD = item.GRP_CD;
            this.modelMaster1.GRP_NM = item.GRP_NM; 
            
            this.modelMaster1.UOM = item.ITEM_UOM;
            this.modelMaster1.UOM_WT = item.ITEM_UOMWT;
            this.modelMaster1.UOM_LOT = item.LOT_UOM;
            this.modelMaster1.TLG_IN_WAREHOUSE_PK = item.TLG_IN_WAREHOUSE_PK;
            
            if (this.oldGroupPK != this.modelMaster1.TLG_IT_ITEMGRP_PK)
            {
              this.modelMaster1.TLG_IT_STITEM_PK = "";
              this.modelMaster1.ST_ITEMCODE = "";
              this.modelMaster1.ST_ITEMNAME = "";
              this.modelMaster1.ST_LNAME = "";
              this.modelMaster1.ST_FNAME = "";
            }

            this.$refs.grdDetail11.loadData();   
          break;
          case "STITEM":            
            this.modelMaster1.TLG_IT_ITEMGRP_PK = item.TLG_IT_ITEMGRP_PK ;
            this.modelMaster1.GRP_CD = item.GRP_CD;
            this.modelMaster1.GRP_NM = item.GRP_NM; 

            this.modelMaster1.TLG_IT_STITEM_PK = item.PK;
            this.modelMaster1.ST_ITEMCODE = item.ITEM_CODE;
            this.modelMaster1.ST_ITEMNAME = item.ITEM_NAME;
            this.modelMaster1.ST_LNAME = item.ITEM_LNAME;
            this.modelMaster1.ST_FNAME = item.ITEM_FNAME;
            
            this.$refs.grdDetail11.loadData();   
          break;

          case "ACCOUNT1":
            this.modelMaster1.TAC_ABACCTCODE_PK_EXPENSE = item.PK;
            this.modelMaster1.EXPENSE_AC_CD = item.AC_CD;
            this.modelMaster1.EXPENSE_AC_NM = item.AC_NM;       
          break;
          case "ACCOUNT2":
            this.modelMaster1.TAC_ABACCTCODE_PK_REVENUE = item.PK;
            this.modelMaster1.REVENUE_AC_CD = item.AC_CD;
            this.modelMaster1.REVENUE_AC_NM = item.AC_NM;       
          break;
          case "ACCOUNT3":
            this.modelMaster1.TAC_ABACCTCODE_PK = item.PK;
            this.modelMaster1.AC_CD = item.AC_CD;
            this.modelMaster1.AC_NM = item.AC_NM;       
          break;                
        }
      }     
    },

    onClearAccount(obj) {
      switch(obj)
        {         
          case "ACCOUNT1":
            this.modelMaster1.TAC_ABACCTCODE_PK_EXPENSE = "";
            this.modelMaster1.EXPENSE_AC_CD = "";
            this.modelMaster1.EXPENSE_AC_NM = "";  
          break;
          case "ACCOUNT2":
            this.modelMaster1.TAC_ABACCTCODE_PK_REVENUE = "";
            this.modelMaster1.REVENUE_AC_CD = "";
            this.modelMaster1.REVENUE_AC_NM = "";       
          break;
          case "ACCOUNT3":
            this.modelMaster1.TAC_ABACCTCODE_PK = "";
            this.modelMaster1.AC_CD = "";
            this.modelMaster1.AC_NM = "";      
          break;                
        }             
    },
    

    onClickButton(obj) {
      switch (obj) {      
        case "btnSearch01":          
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
        case "btnDelete02":
          this.objClick = "btnDelete02";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_delete_this_spec"),"warning");
          break;
        case "btnUnDelete02":
          this.objClick = "btnUnDelete02";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_undelete_this_spec"),"warning");
          break;  
        case "btnAgreeCF":
         if (this.objClick == "btnSave01") {
           if (this.onValidate())
           {  
              this.isRefesh = "Y";
              let action = "";                                 
              if (this.modelMaster1.PK == "") {
                this.modelMaster1._rowstatus = "INSERT";
                action = "insert";
              } else {
                this.modelMaster1._rowstatus = "UPDATE";
                action = "update";
              }                                         
             this.DSO_LG_8040010_POP01_1(action);
           }        
          } else if (this.objClick == "btnDelete01") {
            this.isRefesh = "Y";
            this.modelMaster1._rowstatus = "DELETE";
            this.DSO_LG_8040010_POP01_1("delete");            
          } else if (this.objClick == "btnDelete02") {
              this.$refs.grdDetail11.deleteRows();
          } else if (this.objClick == "btnUnDelete02") {
              this.$refs.grdDetail11.unDeleteRows2();    
          } 
          break;       
      }
    },
    onAfterLoad()
    {
      if (this.popup_type == '2')
      {
        this.onCoppy();
      }
      if (this._hasValue(this.txtCoppyPK))
      {
        if (this.modelMaster1.CODE_MANUAL === "N" )
        {
          this.onGenerateItem();
        }     
      }
    },
  
    onCellDbClick(_event) { 
        this.cellDblClickgrdDetail11 = _event;
        switch (_event.column.dataField) {
        case "SPEC_ID":  
        case "SPEC_NM":                    
          this.$refs.refSpecDialog.dialogIsShow = true;                     
          this.$refs.refSpecDialog.P_TCO_SPECGRP_PK = _event.data.TLG_IT_SPECGRP_PK ;  
          this.$refs.refSpecDialog.P_SPEC =  _event.data.SPEC_ID;  
          this.$refs.refSpecDialog.L_SPECGRP_IN_TYPE =  _event.data.IN_TYPE; ;
          break;
        case "ITEM_NAME":
          break;
        }                 
    },      

    onReturnSpecInfo(item) {
      if (item) {        
        this.$refs.grdDetail11.setCellValue("TLG_IT_SPEC_PK",item.PK,this.cellDblClickgrdDetail11.data.SEQ, "SEQ");
        this.$refs.grdDetail11.setCellValue("SPEC_ID",item.SPEC_ID,this.cellDblClickgrdDetail11.data.SEQ, "SEQ");
        this.$refs.grdDetail11.setCellValue("SPEC_NM",item.SPEC_NM,this.cellDblClickgrdDetail11.data.SEQ, "SEQ");
        this.$refs.grdDetail11.setCellValue("SPEC_LNM",item.SPEC_LNM,this.cellDblClickgrdDetail11.data.SEQ, "SEQ"); 
        this.$refs.grdDetail11.setCellValue("SPEC_FNM",item.SPEC_FNM,this.cellDblClickgrdDetail11.data.SEQ, "SEQ");
        if (this.modelMaster1.CODE_MANUAL === "N" )
        {
          this.onGenerateItem();
        }        
      }
    },

    onGenerateItem()
    {
          let strCD = " ";
          let strNM = " ";
          let strLNM = " ";
          let strFNM = " ";
          let strPrefix = " ";

          let l_code_seq= this.modelMaster1.GRP_CD;
          let l_code_seq_use_yn='N';
          
          //---------------------------------
          strCD = (this._hasValue(this.modelMaster1.ST_ITEMCODE) ? this.modelMaster1.ST_ITEMCODE: "" );  
          strNM = (this._hasValue(this.modelMaster1.ST_ITEMNAME) ? this.modelMaster1.ST_ITEMNAME: "" ); 
          strLNM = this._hasValue(this.modelMaster1.ST_LNAME) ? this.modelMaster1.ST_LNAME:""; 
          strFNM = this._hasValue(this.modelMaster1.ST_FNAME) ? this.modelMaster1.ST_FNAME:"";  
          

          for(var i=0; i< this.$refs.grdDetail11.getDataSource().length; i++)
          {
                //=================================================================                   
                strPrefix =   this.$refs.grdDetail11.getDataSource()[i].PREFIX_SIGN_CD;      
                if ( this.$refs.grdDetail11.getDataSource()[i].DISPLAY_YN_CD === "Y"  && this.$refs.grdDetail11.getDataSource()[i].SPEC_TYPE != "ST" )
                {
                    //----- For Code -----------------------------
                    if ( !this._hasValue(this.$refs.grdDetail11.getDataSource()[i].PREFIX_SIGN_CD) )
                    {
                        strCD += (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_ID) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_ID : "" ); 
                    }
                    else if ( (this.$refs.grdDetail11.getDataSource()[i].PREFIX_SIGN_CD).toUpperCase() === "BLANK" )
                    {
                        strCD += ' ' + (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_ID) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_ID : "" ); 
                    }                   
                    else
                    {
                        strCD += (this.$refs.grdDetail11.getDataSource()[i].PREFIX_SIGN_CD).replace("BLANK", " ") + (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_ID) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_ID : "" );                  
                    }         
                } 
                //=================================================================           
                if ( this.$refs.grdDetail11.getDataSource()[i].DISPLAY_YN === "Y"  && this.$refs.grdDetail11.getDataSource()[i].SPEC_TYPE != "ST" )
                {                            
                    //----- For Name -----------------------------
                    if ( !this._hasValue(this.$refs.grdDetail11.getDataSource()[i].PREFIX_SIGN))
                    {
                        strNM += (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_NM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_NM : "");
                        strLNM += (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_LNM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_LNM : "");
                        strFNM += (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_FNM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_FNM : ""); 
                    }
                    else if ( (this.$refs.grdDetail11.getDataSource()[i].PREFIX_SIGN).toUpperCase() === "BLANK" )
                    {
                        strNM += ' ' + ( this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_NM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_NM : "");
                        strLNM += ' ' + (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_LNM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_LNM : "");
                        strFNM += ' ' + (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_FNM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_FNM : ""); 
                    }                    
                    else 
                    {
                        let PrefixName = (this.$refs.grdDetail11.getDataSource()[i].PREFIX_SIGN).replace("BLANK", " ");
                        strNM += PrefixName + (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_NM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_NM : "");
                        strLNM += PrefixName + (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_LNM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_LNM : "");
                        strFNM += PrefixName + (this._hasValue(this.$refs.grdDetail11.getDataSource()[i].SPEC_FNM) ? this.$refs.grdDetail11.getDataSource()[i].SPEC_FNM : ""); 
                    }                
                    //------------------------                
                }
                //=================================================================           
          }
 
          let l_spec_rows = this.$refs.grdDetail11.getDataSource().length - 1;
          l_code_seq = (this._hasValue(this.modelMaster1.ST_ITEMCODE) ? this.modelMaster1.ST_ITEMCODE: "") ;  

          for(var i=1; i<=l_spec_rows; i++)
          {
                //=================================================================  
                if(this._hasValue(this.$refs.grdDetail11.getDataSource()[i].ITEM_CODE_SEQ))  
                {
                  l_code_seq_use_yn='Y';    
                }                         

                l_code_seq+=this.get_code_seq(i);              
                //=================================================================           
          }

          if(l_code_seq_use_yn=='Y')
            this.modelMaster1.ITEM_CODE = l_code_seq;
          else
            this.modelMaster1.ITEM_CODE = strCD ; 

        //------------------
        
        //------------------
        this.modelMaster1.ITEM_NAME = strNM ;       
        this.modelMaster1.ITEM_LNAME = strLNM ;   
        this.modelMaster1.ITEM_FNAME = strFNM ;     
        //------------------
    },

    //----------------------------------------------------------
    get_code_seq(l_code_seq)
    {
        let l_result='';
        for(var i=0; i<this.$refs.grdDetail11.getDataSource().length; i++)
          {
                if(this.$refs.grdDetail11.getDataSource()[i].DISPLAY_YN_CD === "Y")
                {
                    if(this.$refs.grdDetail11.getDataSource()[i].ITEM_CODE_SEQ === l_code_seq)
                        l_result = this.$refs.grdDetail11.getDataSource()[i].SPEC_ID;
                }
          }
          return l_result;
    },
         
    
    getSpectType(paramsData) {      
      //this.isProcessing = true                 
      this.$axios.$post("dso/callproc", { proc: "lg_pro_8040010_1", para: paramsData })
        .then((res) => {
          if(res.data && res.data.p_rtn_cur.length) {
            this.IsGrpSpec = (res.data.p_rtn_cur[0]["VALUE1"] == 1);
            this.isSTItemVisible = (res.data.p_rtn_cur[0]["VALUE2"] == 1);
          } else {
            this.IsGrpSpec = true;
            this.isSTItemVisible = true;
          }                        
        })
        .catch((e) => {
          this.showNotification('danger', this.$t('error_occurs'), e.message)
        })
        .then(() => {
        // this.isProcessing = false
        })             
    },   
    /*NOTE: */
    async DSO_LG_8040010_1(action = "update") {
      //const dataIsModified = this.dataGrid1.some(x => x._rowstatus !== "")
      this.$refs.grdDetail01.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8040010_1",
        updpro: "LG_UPD_8040010_1",
        para: [this.modelMaster1.Company,this.modelMaster1.tlg_it_itemgrp_pk, this.modelMaster1.item_search01, this.modelMaster1.chk_Active  ? "Y" : "N", this.radSearchPage1 ],
        elname: [
          "_rowstatus",
          "PK","TLG_IT_ITEMGRP_PK","GRP_NM","ITEM_CODE","ITEM_NAME","TLG_IT_STITEM_PK","ST_ITEM_CODE","ST_ITEM_NAME","ITEM_LNAME","ITEM_FNAME","UOM","REF_UOM","REF_UOM_2",
          "TAC_ABACCTCODE_PK","ACCT_NM","TAC_ABACCTCODE_PK_EXPENSE","EXPENSE_NM","TAC_ABACCTCODE_PK_REVENUE","REVENUE_NM","BOM_YN","INV_YN","HS_CODE","USE_YN"          
        ],
        data: this.dataGrid1
      };
      this.dataGrid1 = await this._dsoCall(dso, action, true);
      this.$refs.grdDetail01.instance.clearSelection();      
    //   if (action == "update") {
    //     this.LG_SEL_8040010_1([this.modelMaster1.PK]);
    //   }
    },

    /*NOTE: */
        
    onValidate()
    {   
        if (!this._hasValue(this.modelMaster1.TLG_IT_ITEMGRP_PK))
        {
            this.showNotification("danger", this.$t('pls_select_group_first!'), "");                                
            return false;
        }
        else if ( !this._hasValue(this.modelMaster1.UOM) )
        {
            this.showNotification("danger", this.$t('pls_select_uom_first!'), "");                      
            return false;
        }

        //get speck_tring_pk
        if (this.item_type == '1')
        {
            let rows = this.$refs.grdDetail11.getDataSource().length;
            let spec_str = '';
            let tmp = '';
            for (var i = 0; i < rows; i++) {
                if (!this._hasValue(this.$refs.grdDetail11.getDataSource()[i].TLG_IT_SPEC_PK))
                    tmp = '0';
                else
                    tmp = this.$refs.grdDetail11.getDataSource()[i].TLG_IT_SPEC_PK;
                if (i == rows - 1)
                    spec_str += tmp;
                else
                    spec_str += tmp + '-';

            }
          
            if (this.modelMaster1.SPEC_PK_STRING != spec_str) {
                //alert(txtSpecStr.text);
                this.modelMaster1.SPEC_PK_STRING = spec_str;
            }
        }
        else
        {
            this.modelMaster1.SPEC_PK_STRING = '';
        }
        
        return true;
    },

    //-------------------------------------------------------------------------------------

    async DSO_LG_8040010_POP01_1(p_action) {
      this.modelMaster1._rowstatus = p_action.toString().toUpperCase();
      const dso = {
        type: "control",
        selpro: "LG_SEL_8040010_POP01_1",
        updpro: "LG_UPD_8040010_POP01_1",
        para: [this.modelMaster1.PK],
        elname: [
          "_rowstatus",
          "PK",
          "TLG_IT_ITEMGRP_PK",
          "GRP_CD",
          "GRP_NM",
          "TLG_IT_STITEM_PK",
          "ST_ITEMCODE",
          "ST_ITEMNAME",
          "ST_LNAME",
          "ST_FNAME",
          "ITEM_CODE",
          "ITEM_NAME",
          "UOM",
          "USE_YN",
          "ST_DATE",
          "END_DATE",
          "DESCRIPTION",
          "TLG_IT_ITEMPHOTO_PK",
          "ITEM_LNAME",
          "ITEM_FNAME",
          "SPEC_PK_STRING",
          "CODE_MANUAL", 
          "TLG_IN_WAREHOUSE_PK",
          "TAC_ABACCTCODE_PK",
          "AC_CD",
          "AC_NM", 
          "UOM_WT",
          "WEIGHT",
          "UOM_LOT",
          "LOT_QTY",
          "LOT_WEIGHT", 
          "TAC_ABACCTCODE_PK_EXPENSE", 
          "EXPENSE_AC_CD", 
          "EXPENSE_AC_NM",
          "TAC_ABACCTCODE_PK_REVENUE", 
          "REVENUE_AC_CD", 
          "REVENUE_AC_NM"
        ],
        data: this.modelMaster1,
      };
      let rows = await this._dsoCall(dso, p_action, false);
      if (rows) {
        if (p_action == "delete") {
          this.onAddNew_Master();          
        } else {
          this.modelMaster1 = { ...rows };
          if(p_action == 'update' || p_action == 'insert'){
            for(let i = 0; i < this.$refs.grdDetail11.getDataSource().length; i++){
              if (!this._hasValue(this.$refs.grdDetail11.getDataSource()[i].TLG_IT_ITEM_PK))
              {                
                this.$refs.grdDetail11.getDataSource()[i].TLG_IT_ITEM_PK = this.modelMaster1.PK ;
                this.$refs.grdDetail11.getDataSource()[i]._rowstatus = 'u' ;
              }                
            }
            this.$refs.grdDetail11.saveData();
          }
          else if(p_action == "select")
          {
            this.$refs.grdDetail11.loadData();            
          }
        }
      }
    },
    /*NOTE: */
    async DSO_LG_8040010_POP01_4() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_8040010_POP01_4",
        para: [this.txtCompanyPK, this.txtItemGroupPK2]
      };
      let result = await this._dsoCall(dso, "select", false);          
      if (result) {
        this.modelMaster1.TLG_IT_ITEMGRP_PK =  result[0].PK;  
        this.modelMaster1.GRP_CD            =  result[0].GRP_CD;  
        this.modelMaster1.GRP_NM            =  result[0].GRP_NM;  
        this.modelMaster1.UOM               =  result[0].ITEM_UOM;  
        this.modelMaster1.UOM_WT            =  result[0].ITEM_UOMWT;  
        this.modelMaster1.UOM_LOT           =  result[0].LOT_UOM;  
        this.modelMaster1.TLG_IN_WAREHOUSE_PK =  result[0].TLG_IN_WAREHOUSE_PK;  
      }   
      
      this.onAddNew_Master();
    },
    /*NOTE: */
    async LG_LST_8040010(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_8040010",
        para: _param
      };
      switch (_param[0]) {
        case "ITEMGROUP":
          this.dataList.lstItemGroup1 = await this._dsoCall(dso, "select", false);          
          if (this.dataList.lstItemGroup1.length > 0) {
            this.modelMaster1.tlg_it_itemgrp_pk = this.dataList.lstItemGroup1[0]["CODEKEY"];           
          }
          this.getSpectType([this.modelMaster1.tlg_it_itemgrp_pk]);
          //this.getListSpec([this.modelMaster1.tlg_it_itemgrp_pk]);
          break;     
        case "UOM":
          this.dataList.lstUOM1 = await this._dsoCall(dso, "select", false);          
          if (this.dataList.lstUOM1.length > 0) {
            this.modelMaster1.uom = this.dataList.lstUOM1[0]["CODEKEY"];
          }
          break;    
        case "COLUMNS":
            debugger
          this.dataList.lstColumns = await this._dsoCall(dso, "select", false);          
          if (this.dataList.lstColumns.length > 0) {
            this.modelMaster1.columns = this.dataList.lstColumns[0]["CODEKEY"];
          }
          break;        
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
