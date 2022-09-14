<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">       
            <v-row no-gutters>
              <v-col cols="3" class="pa-1">
                <v-card outlined class="overflow-y-80vh-container" :disabled="isRendering" :loading="isRendering">
                  <v-card-text class="pa-1">
                    <v-row align="center" justify="space-between">
                      <v-col md = "12"  class="pt-2">     
                        <v-select dense cache-items hide-details 
                                  item-value="PK" item-text="TEXT" :label="$t('company')"
                                  :items="companyList" v-model="selectedCompany"
                                  class="white"></v-select>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between">
                      <v-col md = "10"  class="pt-0">     
                        <v-text-field
                                v-model="searchGroup"
                                :label="$t('group')"                          
                                dense
                                hide-details
                                @keypress.enter="onClickButton('btnSearch01')" 
                              />
                      </v-col>
                      <v-col md = "0" class="pt-0">                                        
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
                      </v-col>
                    </v-row>

                    <v-row align="center" justify="space-between">
                      <v-col  md = "10"  class="pt-0"> 
                        <v-slide-y-transition hide-on-leave>
                          <v-skeleton-loader type="list-item@10" v-if="!menuList.length"></v-skeleton-loader>
                          <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="GRP" item-children="childMenu"
                                      open-all :active.sync="active" :color="currentTheme" :items="menuList" @update:active="getSelectedMenu" v-else>
                            <template v-slot:prepend="{ item, open }">
                              <v-icon v-if="item.LEAF === 0">
                                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                              </v-icon>
                              <v-icon v-else>mdi-file</v-icon>
                            </template>
                          </v-treeview>
                        </v-slide-y-transition>
                      </v-col>
                    </v-row>

                  </v-card-text>
                </v-card>
              </v-col>  
              <v-col cols="9" class="pa-1">        
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-card class="pa-2">                         
                          <v-row class="pt-1" align="center" justify="space-between">
                            <v-col md="4" class="pt-0">
                              <v-select
                                  id="lstCompany1"
                                  v-model="modelMaster1.TCO_COMPANY_PK"
                                  :label="$t('company')"
                                  :items="companyList"
                                  item-value="PK"
                                  item-text="TEXT"                                
                                  dense
                                  cache-items
                                  hide-details
                              />
                            </v-col>
                            <v-col md="1" class="pt-0"> 
                              <v-btn
                                ripple
                                text
                                small
                                v-show="true"
                                @click="onAddNew(2)"
                                :color="currentTheme"
                                >{{this.$t('new_parent')}}
                              </v-btn>                                                
                            </v-col>
                            <v-col md="3" class="pt-0">                                               
                            </v-col>
                            <v-col md="2" class="pt-0"> 
                              <v-btn
                                ripple
                                text
                                small
                                v-show="true"
                                @click="onClickButton('btnApply')"
                                :color="currentTheme"                              
                                >{{this.$t('apply_for_items')}}
                              </v-btn>                                                      
                            </v-col>
                            <v-col md="2" class="pt-0" style="text-align:right">                                                                                                                                                  
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    icon
                                    tile
                                    :color="currentTheme"
                                    :disabled="isProcessing"
                                    @click="onAddNew(0)"
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
                          </v-row>
                          <v-row align="center" justify="space-between">                                                      
                            <v-col md="4" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.GRP_CD"
                                :label="$t('group_code')"                                                          
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="8" class="pt-0">
                              <v-text-field
                                v-model="modelMaster1.GRP_NM"
                                :label="$t('group_name')"                                                                                                               
                                dense
                                hide-details
                              >                             
                              </v-text-field>
                            </v-col>                                                                                                                                 
                          </v-row>
                       
                          <v-row align="center" justify="space-between" >                                                 
                            <v-col md="5" class="pt-0">
                              <v-row no-gutters>          
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('sale')"  v-model="modelMaster1.SALE_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('pure')"  v-model="modelMaster1.PUR_YN"  true-value="Y" false-value="N" />                               
                                 </v-col>
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('prod')"  v-model="modelMaster1.PROD_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                              </v-row>  
                            </v-col>      
                            <v-col md="5" class="pt-0">
                              <v-row no-gutters>         
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('semi_prod')"  v-model="modelMaster1.SEMI_PROD_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('mat')"  v-model="modelMaster1.MAT_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('sub_mat')"  v-model="modelMaster1.SUB_MAT_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                              </v-row>                                                              
                            </v-col>    
                            <v-col md="2" class="pt-0">
                              <v-row no-gutters>         
                                 <v-col md="12" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('bom_leaf_yn')"  v-model="modelMaster1.BOM_LEAF_YN"  true-value="Y" false-value="N" />
                                 </v-col>                                
                              </v-row>                                                              
                            </v-col>                                                                                                                                           
                          </v-row>
                          <v-row align="center" justify="space-between">                           
                            <v-col md="2" class="pt-0">
                              <v-select
                                v-model="modelMaster1.ITEM_UOM"
                                :label="$t('uom')"
                                item-value="CODEKEY"
                                item-text="CODEDESC"
                                :items="dataList.lstUOM1"                   
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <v-select
                                v-model="modelMaster1.ITEM_UOMWT"
                                :label="$t('wt_uom')"
                                item-value="CODEKEY"
                                item-text="CODEDESC"
                                :items="dataList.lstUOM1"                   
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <v-select
                                v-model="modelMaster1.LOT_UOM"
                                :label="$t('lot_uom')"
                                item-value="CODEKEY"
                                item-text="CODEDESC"
                                :items="dataList.lstUOM1"                   
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <v-select
                                v-model="modelMaster1.BOM_UOM_TYPE"
                                :label="$t('bom_type')"
                                item-value="CODE"
                                item-text="NAME"
                                :items="dataList.lstBomType"                   
                                dense
                                hide-details
                              />
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <v-select
                                v-model="modelMaster1.GROUP_TYPE"
                                :label="$t('group_type')"
                                item-value="CODE"
                                item-text="NAME"
                                :items="dataList.lstGroupType"                   
                                dense
                                hide-details
                              />
                            </v-col>
                            
                            <v-col md="1" class="pt-0">
                              <date-picker
                                :inputValue="modelMaster1.ST_DATE"
                                :label="$t('from_date')"
                                @returnValue="modelMaster1.ST_DATE = $event"
                                placeholder=" "
                              ></date-picker>
                            </v-col>                           
                            <v-col md="1" class="pt-0">
                              <date-picker
                                :inputValue="modelMaster1.END_DATE"
                                :label="$t('to_date')"
                                @returnValue="modelMaster1.END_DATE = $event"
                                placeholder=" "
                              ></date-picker>  
                             </v-col>                                                          
                          </v-row>
                          <v-row align="center" justify="space-between">
                            <v-col md="2" class="pt-0">
                              <number-control :outlined="false" :disabled="false" :inputValue="modelMaster1.GRAVITY" @returnValue="modelMaster1.GRAVITY = $event" :label="$t('gravity')" :precision="0"></number-control>
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <number-control :outlined="false" :disabled="false" :inputValue="modelMaster1.LOT_QTY" @returnValue="modelMaster1.LOT_QTY = $event" :label="$t('lot_qty')" :precision="0"></number-control>
                            </v-col>
                            <v-col md="2" class="pt-0" align-self="center">
                              <v-checkbox  dense hide-details :color="currentTheme" :label="$t('grpcd_display')"  v-model="modelMaster1.GRPCODE_DISPLAY_YN"  true-value="Y" false-value="N" />
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <number-control :outlined="false" :disabled="false" :inputValue="modelMaster1.STSEQ_LENGTH" @returnValue="modelMaster1.STSEQ_LENGTH = $event" :label="$t('seq_length_st')" :precision="0"></number-control>
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <number-control :outlined="false" :disabled="false" :inputValue="modelMaster1.ITEMSEQ_LENGTH" @returnValue="modelMaster1.ITEMSEQ_LENGTH = $event" :label="$t('seq_length_item')" :precision="0"></number-control>
                            </v-col>
                            <v-col md="2" class="pt-0">
                              <v-select
                                v-model="modelMaster1.SEQ_IS_END_YN"
                                :label="$t('seq_pos')"
                                item-value="CODE"
                                item-text="NAME"
                                :items="dataList.lstSeqPos"                   
                                dense
                                hide-details
                              />
                            </v-col>                                                                                                                                               
                          </v-row>
                          <v-row align="center" justify="space-between">   
                            <v-col md="6" class="pt-0">                  
                              <v-text-field
                                v-model="modelMaster1.DESCRIPTION"
                                :label="$t('remark')"                                                          
                                dense
                                hide-details
                              />
                            </v-col>  
                            <v-col md="2" class="pt-0">
                              <v-select
                                v-model="modelMaster1.TEMP_TYPE"
                                :label="$t('temperature_type')"
                                item-value="CODE"
                                item-text="NAME"
                                :items="dataList.lstTempType"                   
                                dense
                                hide-details
                              />
                            </v-col>                                                               
                            <v-col md="4" class="pt-0">
                              <v-row no-gutters>          
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('leaf')"  v-model="modelMaster1.LEAF_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('user_limit')"  v-model="modelMaster1.USER_LIMIT_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                                 <v-col md="4" class="pt-0">
                                   <v-checkbox  dense hide-details :color="currentTheme" :label="$t('active')"  v-model="modelMaster1.USE_YN"  true-value="Y" false-value="N" />
                                 </v-col>
                              </v-row>                                     
                            </v-col>                                                                                            
                          </v-row>                                      
                    </v-card>
                    <v-card>  
                      <v-row no-gutters>
                        <v-col cols='12'>
                          <v-btn-toggle dense  mandatory :color="currentTheme"  v-model="selectedTab">
                            <v-btn value="1">{{ $t('spec') }}</v-btn>
                            <v-btn value="2">{{ $t('account') }}</v-btn>                        
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                      <v-row align="center" justify="space-between" class="pt-0">
                        <v-col cols="12" class="pt-0">
                          <v-card  v-show="selectedTab === '1'"  :height="limitHeight2"  class="pt-0 px-4">
                            <v-row align="center" justify="space-between" class="pt-0">
                              <v-col  md="10" class="pt-0"> 
                              </v-col>
                              <v-col  md="2" class="pt-0"  style="text-align:right">  
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-btn
                                          icon
                                          tile
                                          :color="currentTheme"
                                          :disabled="isProcessing"
                                          @click="onAddNew(1)"
                                          v-on="on"
                                        >
                                          <v-icon>mdi-plus-box</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>{{ $t("new_detail") }}</span>
                                    </v-tooltip>                                                                                         
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
                            <v-row align="center" justify="space-between" class="pt-0 px-1">
                              <v-col cols="12" class="pa-0">
                                <DataGridView
                                  column-resizing-mode="widget"
                                  ref="grdDetail11"                   
                                  sel_procedure="LG_SEL_8030030_4"
                                  upd_procedure="LG_UPD_8030030_4"
                                  select_mode="MultipleHideBox"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                  @setDataSource="onAfterLoad"
                                  @cellDblClick="onCellDbClick"
                                  :filter_paras="[this.modelMaster1.PK]"                   
                                  :update_paras="[
                                      'PK', 
                                      'SEQ', 
                                      'TLG_IT_ITEMGRP_PK', 
                                      'TLG_IT_SPECGRP_PK',                                     
                                      'MANDATORY', 
                                      'NULL_01',
                                      'IDAUTO_YN',
                                      'SPEC_TYPE',
                                      'GRAVITY_YN',
                                      'PREFIX_SIGN_CD',
                                      'PREFIX_SIGN',
                                      'NULL_02',
                                      'SUB_CODE_YN',
                                      'DISPLAY_YN_CD',
                                      'DISPLAY_YN',
                                      'CONS_YN',
                                      'POP_SPEC_SEQ',
                                      'PLAN_SPEC_SEQ',
                                      'F_SEQ',
                                      'ITEM_CODE_SEQ'
                                    ]"
                                :header="[       
                                  {dataField: 'SEQ',  caption: this.$t('no'),   allowEditing: true},
                                  {dataField: 'SPECGRP_NM',caption: this.$t('group_spec_name'), allowEditing: false },   
                                  {dataField: 'MANDATORY',caption: this.$t('mandatory'), allowEditing: true,  dataType: 'checkbox' },       
                                  {dataField: 'IDAUTO_YN',caption: this.$t('spec_auto'), allowEditing: true,  dataType: 'checkbox' },                                        
                                  {dataField: 'SPEC_TYPE',caption: this.$t('spec_type'), allowEditing: true,
                                    lookup: { dataSource: this.dataList.lstSpecType, displayExpr:'NAME', valueExpr: 'CODE' } 
                                   },   
                                  {dataField: 'GRAVITY_YN',caption: this.$t('spec_auto'), allowEditing: true,  dataType: 'checkbox' },  
                                  {dataField: 'PREFIX_SIGN_CD',caption: this.$t('prefix_sign_code'), allowEditing: true },   
                                  {dataField: 'PREFIX_SIGN',caption: this.$t('prefix_sign_name'), allowEditing: true },    
                                  {dataField: 'DISPLAY_YN_CD',caption: this.$t('display_cd'), allowEditing: true, dataType: 'checkbox' },   
                                  {dataField: 'DISPLAY_YN',caption: this.$t('display_nm'), allowEditing: true, dataType: 'checkbox'  },   
                                  {dataField: 'CONS_YN',caption: this.$t('cons'), allowEditing: true, dataType: 'checkbox'  },   
                                  {dataField: 'POP_SPEC_SEQ',caption: this.$t('pop_spec_seq'), allowEditing: true ,
                                    lookup: { dataSource: this.dataList.lstPopSeq, displayExpr:'NAME', valueExpr: 'CODE' } 
                                  },   
                                  {dataField: 'PLAN_SPEC_SEQ',caption: this.$t('plan_spec_seq'), allowEditing: true,
                                    lookup: { dataSource: this.dataList.lstPlanSeq, displayExpr:'NAME', valueExpr: 'CODE' } 
                                  },   
                                  {dataField: 'F_SEQ',caption: this.$t('f_seq'), allowEditing: true },   
                                  {dataField: 'ITEM_CODE_SEQ',caption: this.$t('item_code_seq'), allowEditing: true },   
                                                                      
                                ]"           
                                />
                               </v-col>
                            </v-row>  
                          </v-card>  
                          <v-card  v-show="selectedTab === '2'" :height="limitHeight2" class="pa-0"   > 
                            <v-row align="center" justify="space-between" class="pt-2">                             
                              <v-col cols="12" class="pt-0">
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
                                    <v-col md="6" class="pt-0">
                                        <v-select
                                          v-model="modelMaster1.TLG_IN_WAREHOUSE_PK"
                                          :label="$t('virtual_wh')"
                                          item-value="CODEKEY"
                                          item-text="CODEDESC"
                                          :items="dataList.lstWH"                   
                                          dense
                                          hide-details
                                        />
                                    </v-col>   
                                    <v-col md="4" class="pt-0">                  
                                      <v-text-field
                                        v-model="modelMaster1.HS_CODE"
                                        :label="$t('hs_code')"                          
                                        readonly
                                        dense
                                        hide-details
                                      />
                                    </v-col>
                                    <v-col md="2" class="pt-0">
                                       <v-checkbox  dense hide-details :color="currentTheme" :label="$t('acc')"  v-model="modelMaster1.ACC_YN"  true-value="Y" false-value="N" />
                                    </v-col>
                                  </v-row>                                     
                                </v-card>  
                              </v-col> 
                            </v-row>  
                          </v-card>  
                          <v-card  v-show="selectedTab === '4'" :height="limitHeight2" class="pa-0"  >                           
                          </v-card>  
                        </v-col>
                      </v-row>
                    </v-card>                       
                  </v-col>
                </v-row>
              </v-col>
            </v-row>  
     
    <account-dialog ref="accountDialog" :multiSelectMode="false" @returnAccountInfo="onMappingAll"></account-dialog>
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
    <confirm-dialog ref="confirmDialog2" @onConfirm="onConfirmDialog"></confirm-dialog>
    <confirm-dialog ref="confirmDialog3" @onConfirm="onConfirmDialog"></confirm-dialog>
    <spec-group-dialog ref="refSpecGroupDialog" @returnData="onReturnSpecGrpInfo" />
    <alert-dialog ref="alertDialog"></alert-dialog>
  </v-container>
</template>

<script>

import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import DatePicker from "@/components/control/DatePicker";
import DataGridView from "@/components/control/DataGridView";
import AccountDialog from "@/components/dialog/AccountDialog";
import SpecGroupDialog from '@/components/dialog/SpecGroupDialog'

import NumberControl from '@/components/control/NumberControl.vue';

import listToTree from "list-to-tree-lite";

export default {
  layout: "default",
  middleware: "user",

  components: {
    "date-picker": DatePicker,
    'account-dialog': AccountDialog,
    'number-control': NumberControl,
    SpecGroupDialog,
    DataGridView,
    ConfirmDialog,
    AlertDialog
  },
  data: () => ({

    dialogIsShow: true,
    companyList: [],
    selectedCompany: 'ALL',
    searchGroup: "",
    ParentPK: "",
    active: [],
    menuList: [],

    selectedMenu: {},
    isRendering: false,
    ConfirmStatus: false,

    dataList: {
      lstUOM1: [],   
      lstSpecType: [],
      lstPopSeq: [],
      lstPlanSeq: [],
      lstBomType: [],
      lstSeqPos: [],
      lstGroupType: [],
      lstWH: [],
      lstColumns: [], 
      lstTempType: [],   
      selectList:[],
      selectedDatas:[]      
    },

    selectedTab: "1",


    txtCompanyPK: "",
    txtItemGroupPK2: "",
    txtItemPK: "",
    popup_type: "",
    item_type: "",
    txtInputPK: "",
    
  
    modelMaster1: {
      _rowstatus: "",
      ACTION: "",
      PK: "",
      P_PK: "",
      GRP_CD: "",
      GRP_NM: "",
      GRP_LNM: "",
      GRP_FNM: "",
      ITEM_FORMAT: "",
      ITEM_UOM: "",
      ITEM_UOMWT: "",
      ITEM_UOMVOL: "",
      ITEM_UOMDIM: "",
      ITEM_UOMSUR: "",
      LEAF_YN: "",
      HS_CODE_PK: "",
      HS_CODE: "",
      HS_LEVEL: "",
      TLG_IN_WAREHOUSE_PK: "",
      TAC_ABACCTCODE_PK: "",
      PUR_TYPE: "",
      WEIGHT_FORMULA: "",
      VOLUME_FORMULA: "",
      SURFACE_FORMULA: "",
      ID_FORMULA: "",
      USER_LIMIT_YN: "",
      STSEQ_LENGTH: null,
      ITEMSEQ_LENGTH: null,
      DESCRIPTION: "",
      USE_YN: "",
      ST_DATE: "",
      END_DATE: "",
      AC_CD: "",
      AC_NM: "",
      TCO_COMPANY_PK: "",
      GRAVITY: 0,
      BOM_UOM_TYPE: "",
      GRPCODE_DISPLAY_YN: "",
      LOT_UOM: "",
      LOT_QTY: 0,
      GROUP_TYPE: "",
      SALE_YN: "", 
      PROD_YN: "",
      MAT_YN: "",
      SUB_MAT_YN: "",
      SEMI_PROD_YN: "",
      PUR_YN: "",
      ACC_YN: "",
      BOM_LEAF_YN: "",
      TAC_ABACCTCODE_PK_EXPENSE: "",
      EXPENSE_AC_CD: "",
      EXPENSE_AC_NM: "",
      TAC_ABACCTCODE_PK_REVENUE: "",
      REVENUE_AC_CD: "",
      REVENUE_AC_NM: "",
      TLG_IT_STITEMPHOTO_PK: "",
      TCO_BUSPARTNER_PK: "",
      PARTNER_ID: "",
      PARTNER_NAME: "",
      SEQ_IS_END_YN: "",
      TEMP_TYPE: ""
    },

    objClick: "",
    oldGroupPK: 0,

    cellDblClickgrdDetail11: {},
    seft: this
  }),
  created() {
    /*TODO: */
    this.getCompanyList();
    //this.getCompany([this.user.PK]);    
    this.LG_LST_8030030(["UOM", "", ""]);
    this.LG_LST_8030030(["WH", "", ""]);
    this.getListCodes();    
  },

 watch: {
   selectedCompany(value) {
        if (value) {
          //this.isProcess = true;
          this.getMenuList();
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
    limitHeight2() {
      return this.windowHeight - 500;
    },
  },
  methods: {     
    //=================================================================================
    onAddNew(index)
    {
      switch(index)
      {
          case 0:
              if(!this._hasValue(this.txtInputPK))
              {           
                this.onAddNew_Master();                                                           
                this.modelMaster1.P_PK = "";
                return;
              }
              
              if( this.modelMaster1.LEAF_YN=='Y')
              {
                 this.showNotification("danger", this.$t('you_can_not_add_sub_group_to_a_leaf_group'), "");                 
                return;
              }
              this.onAddNew_Master(); 
              this.modelMaster1.P_PK = this.txtInputPK;                             
          break;
          case 1:
            this.onAddNew_Detail();
            // grdAttribute.AddRow();
            // grdAttribute.SetGridText(grdAttribute.rows - 1,G1_tco_itemgrp_pk,txtInputPK.GetData()); 
            // grdAttribute.SetGridText(grdAttribute.rows - 1,G1_mandatory,"-1"); 
          break;
          case 2:
              this.onAddNew_Master();                                                           
              this.modelMaster1.P_PK = "";
          break;
      }
    },
    onAddNew_Master()
    {
      this.modelMaster1 = {
        _rowstatus:  "INSERT",
        PK: "",       
        STSEQ_LENGTH: null,
        ITEMSEQ_LENGTH: null,              
        GRAVITY: 0,
        LOT_QTY: 0,
        ACC_YN: "N",
        USE_YN: "Y"         
      };

      if (this.dataList.lstBomType.length > 0) {
            this.modelMaster1.BOM_UOM_TYPE = this.dataList.lstBomType[0]["CODE"];
      }
      if (this.dataList.lstSeqPos.length > 0) {
            this.modelMaster1.SEQ_IS_END_YN = this.dataList.lstSeqPos[0]["CODE"];
      }  
      this.modelMaster1.TCO_COMPANY_PK = this.companyList[0]["PK"];
      this.$refs.grdDetail11.loadData();                      

    }, 
    onAddNew_Detail() {     
        let insertRow = {};
        insertRow.PK=this._uniqueID();
        insertRow.SEQ = this.$refs.grdDetail11.getDataSource().length + 1; 
        insertRow.TLG_IT_ITEMGRP_PK = ""; 
        insertRow.TLG_IT_SPECGRP_PK = ""; 
        insertRow.SPECGRP_NM = "";
        insertRow.SPECGRP_LNM = ""; 
        insertRow.MANDATORY = "Y"; 
        insertRow.NULL_01 = "";
        insertRow.IDAUTO_YN = "N";
        insertRow.SPEC_TYPE =  this.dataList.lstSpecType[0]["CODE"] ;
        insertRow.GRAVITY_YN = "N";
        insertRow.PREFIX_SIGN_CD = "";
        insertRow.PREFIX_SIGN = "";
        insertRow.NULL_02 = "";
        insertRow.SUB_CODE_YN = "N";
        insertRow.DISPLAY_YN_CD = "N";
        insertRow.DISPLAY_YN = "N";
        insertRow.CONS_YN = "N";      
        insertRow.POP_SPEC_SEQ = "";
        insertRow.PLAN_SPEC_SEQ = "";
        insertRow.F_SEQ = "";
        insertRow.ITEM_CODE_SEQ = "";
  
        this.$refs.grdDetail11.addRowStruct(insertRow);              
    },
    //-----------------------------------------------------------------------
   
 
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

            this.modelMaster1.ST_ITEMCODE = item.PK;
            this.modelMaster1.ST_ITEMNAME = item.ITEM_CODE;
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
          this.getMenuList();       
        break;          
        case "btnAddNew01":
          break;          
        case "btnSave01":
          this.objClick = "btnSave01";
          //this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_save'));
          this.onValidate();         
          break;  
        case "btnDelete01":
          this.objClick = "btnDelete01";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_delete_this_item"),"warning");
          break;          
        case "btnDelete02":
          this.objClick = "btnDelete02";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_delete_this_group_spec"),"warning");
          break;
        case "btnUnDelete02":
          this.objClick = "btnUnDelete02";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_undelete_this_group_spec"),"warning");
          break;  
         case "btnApply":
          this.objClick = "btnApply";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_apply_for_all_stitem_and_item"),"warning");
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
             this.DSO_LG_8030030_2(action);
           }        
          } else if (this.objClick == "btnDelete01") {
            this.LG_PRO_8030030_5();
            //this.modelMaster1._rowstatus = "DELETE";
            //this.DSO_LG_8030030_2("delete");            
          } else if (this.objClick == "btnDelete02") {
              this.$refs.grdDetail11.deleteRows();
          } else if (this.objClick == "btnUnDelete02") {
              this.$refs.grdDetail11.unDeleteRows2();    
          } else if (this.objClick == "btnApply") {
              this.LG_PRO_8030030();     
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
    },
  
    onCellDbClick(_event) { 
        this.cellDblClickgrdDetail11 = _event;
        switch (_event.column.dataField) {
        case "SPECGRP_LNM":  
        case "SPECGRP_NM":                    
          this.$refs.refSpecGroupDialog.dialogIsShow = true;                             
          break;     
        }                 
    },      

    onReturnSpecGrpInfo(item) {
      if (item) {        
        this.$refs.grdDetail11.setCellValue("TLG_IT_SPECGRP_PK",item.PK,this.cellDblClickgrdDetail11.data.PK);
        this.$refs.grdDetail11.setCellValue("SPECGRP_NM",item.SPECGRP_NM,this.cellDblClickgrdDetail11.data.PK);            
      }
    },

    
    /*NOTE: */
    onValidate()
    {   
            if (!this._hasValue(this.modelMaster1.GRP_CD)  || !this._hasValue(this.modelMaster1.GRP_NM))
            {
                this.showNotification("danger", this.$t('group_initial_and_description_can_not_be_empty'), "");                                
                this.isCont =  false;
            }
            else
            {
              let rows = this.$refs.grdDetail11.getDataSource().length;
              let showConfirm = false;
              if (!this._hasValue(this.modelMaster1.STSEQ_LENGTH) || this.modelMaster1.STSEQ_LENGTH === 0)  {
                for (var i = 0; i < rows; i++) {
                    if (this.$refs.grdDetail11.getDataSource()[i].IDAUTO_YN === "Y")
                    {
                      showConfirm = true; 
                      break;                   
                    }
                } 
              }
              if (showConfirm)
              {
                this.objClick = "confirm1";
                this.$refs.confirmDialog2.showConfirm(this.$t('do_you_want_to_save_without_input_st_item_sequence_length?'));
              }
              else
              {
                this.onValidate2();
              }
            }  
    },

    onValidate2()
    {             
             let rows = this.$refs.grdDetail11.getDataSource().length;
              let showConfirm = false;
              if (!this._hasValue(this.modelMaster1.ITEMSEQ_LENGTH) || this.modelMaster1.ITEMSEQ_LENGTH === 0) 
              {
                for (var i = 0; i < rows; i++) {
                    if (this.$refs.grdDetail11.getDataSource()[i].IDAUTO_YN === "Y")
                    {
                      showConfirm = true;      
                      break;              
                    }
                } 
              }
              if (showConfirm)
              {
                this.objClick = "confirm2";
                this.$refs.confirmDialog3.showConfirm(this.$t('do_you_want_to_save_without_input_item_sequence_length?'));
              }  
              else
              {
                this.onSave_Master();
              }         
    },

    onConfirmDialog(strMes, isConfirm)
    {
        if (this.objClick == "confirm1")
        {
          if (!isConfirm)
          {
            this.showNotification("danger", this.$t('please_input_st_item_sequence_length'), "");                               
          }
          else{
            this.onValidate2();
          }
        }
        else if (this.objClick == "confirm2")
        {
          if (!isConfirm)
          {
            this.showNotification("danger", this.$t('please_input_item_sequence_length'), "");                               
          }    
          else
          {
            this.onSave_Master();
             
          }     
        }
    },

    onSave_Master()
    {
              let action = "";                                 
              if (this.modelMaster1.PK == "") {
                this.modelMaster1._rowstatus = "INSERT";
                action = "insert";
              } else {
                this.modelMaster1._rowstatus = "UPDATE";
                action = "update";
              }                                         
             this.DSO_LG_8030030_2(action);
    },
   
    //-------------------------------------------------------------------------------------
     async LG_PRO_8030030(action = 'update') {
      const dso = {
        type: 'process',
        updpro: 'LG_PRO_8030030',
        para: [this.modelMaster1.PK],
      }
      let row = await this._dsoCall(dso, action, false);
      if (row) {
        this.showNotification("success", "Information", this.$t('success'));       
      }
    },

    async LG_PRO_8030030_5(action = 'update') {
      const dso = {
        type: 'process',
        updpro: 'LG_PRO_8030030_5',
        para: [this.modelMaster1.PK],
      }
      let row = await this._dsoCall(dso, action, false);
      if (row) {
        if (row[0]["VAL"] === 0 )
        {
            this.modelMaster1._rowstatus = "DELETE";
            this.DSO_LG_8030030_2("delete");          
        }
        else
        {
          this.showNotification('danger', this.$t('you_must_delete_leaf_node_first'), "")
        }
      }
    },

    async DSO_LG_8030030_2(p_action) {
      this.modelMaster1._rowstatus = p_action.toString().toUpperCase();
      const dso = {
        type: "control",
        selpro: "LG_SEL_8030030_2",
        updpro: "LG_UPD_8030030_2",
        para: [this.modelMaster1.PK],
        elname: [
          "_rowstatus",
          "PK",
          "P_PK",
          "GRP_CD",
          "GRP_NM",
          "GRP_LNM",
          "GRP_FNM",
          "ITEM_FORMAT",
          "ITEM_UOM",
          "ITEM_UOMWT",
          "ITEM_UOMVOL",
          "ITEM_UOMDIM",
          "ITEM_UOMSUR",
          "LEAF_YN",
          "HS_CODE_PK",
          "HS_CODE",
          "HS_LEVEL",
          "TLG_IN_WAREHOUSE_PK",
          "TAC_ABACCTCODE_PK",
          "PUR_TYPE",
          "WEIGHT_FORMULA",
          "VOLUME_FORMULA",
          "SURFACE_FORMULA",
          "ID_FORMULA",
          "USER_LIMIT_YN",
          "STSEQ_LENGTH",
          "ITEMSEQ_LENGTH",
          "DESCRIPTION",
          "USE_YN",
          "ST_DATE",
          "END_DATE",
          "AC_CD",
          "AC_NM",
          "TCO_COMPANY_PK",
          "GRAVITY",
          "BOM_UOM_TYPE",
          "GRPCODE_DISPLAY_YN",
          "LOT_UOM",
          "LOT_QTY",
          "GROUP_TYPE",
          "SALE_YN", 
          "PROD_YN",
          "MAT_YN",
          "SUB_MAT_YN",
          "SEMI_PROD_YN",
          "PUR_YN",
          "ACC_YN",
          "BOM_LEAF_YN",
          "TAC_ABACCTCODE_PK_EXPENSE",
          "EXPENSE_AC_CD",
          "EXPENSE_AC_NM",
          "TAC_ABACCTCODE_PK_REVENUE",
          "REVENUE_AC_CD",
          "REVENUE_AC_NM",
          "TLG_IT_STITEMPHOTO_PK",
          "TCO_BUSPARTNER_PK",
          "PARTNER_ID",
          "PARTNER_NAME",
          "SEQ_IS_END_YN",
          "TEMP_TYPE"
        ],
        data: this.modelMaster1,
      };
      let rows = await this._dsoCall(dso, p_action, false);
      if (rows) {
        if (p_action == "delete") {
          this.getMenuList();
          //this.onAddNew_Master();          
        } else {
          this.modelMaster1 = { ...rows };
          if(p_action == 'update' || p_action == 'insert'){
            if (p_action == 'insert'){
              this.getMenuList();
            }
             
            for(let i = 0; i < this.$refs.grdDetail11.getDataSource().length; i++){
              if (!this._hasValue(this.$refs.grdDetail11.getDataSource()[i].TLG_IT_ITEMGRP_PK))
              {
                this.$refs.grdDetail11.getDataSource()[i].TLG_IT_ITEMGRP_PK = this.modelMaster1.PK ;
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
   
     getSelectedMenu() {
        if (!this.active.length) {
          this.selectedMenu = ''
        } else {
          this.selectedMenu = { ...this.active[0] };
          this.modelMaster1.PK = this.active[0].PK;
          this.txtInputPK = this.active[0].PK;
          // this.UPPER_GRP = this.active[0].GRP_NM;

          // this.P_PK_N = this.active[0].P_PK;
          // this.UPPER_GRP_N = this.active[0].UPPER_GRP;
          this.DSO_LG_8030030_2("select");
          //this.getOrgInfo();
          //console.log(this.P_PK_N);
        }
      },
    /*NOTE: */    
    async getCompanyList() {
        const dso = {
          type: 'list',
          selpro: 'SYS_SEL_LIST_COMPANY_ALL',
          para: [this.user.PK]
        }
        const result = await this._dsoCall(dso, 'select', false)
        if (result) {
          this.companyList = result;
          this.selectedCompany = this.companyList[0]["PK"];
          this.modelMaster1.TCO_COMPANY_PK = this.companyList[0]["PK"];

        } else {
          this.companyList = []
        }
      },
    /*NOTE: */
   async getMenuList() {
        try {
          this.isRendering = true
          this.ParentPK = "";
          let { data, success, message } = await this.$axios.$post("dso/callproc", { proc: "LG_SEL_8030030_1", para: [this.selectedCompany, this.ParentPK, this.searchGroup] })
          if (data) {
            const filteredMenu = listToTree(data, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'childMenu' })
            this.menuList = [...filteredMenu]
            //console.log(filteredMenu);
          } else {
            this.menuList = []
            this.showNotification('danger', this.$t('error_occurs'), message)
          }
        } catch (e) {
          this.showNotification('danger', this.$t('error_occurs'), e.message)
        } finally {
          this.isRendering = false
        }
      },
    async getListCodes() {
      let lstCommoncode = await this._getCommonCode2( ['8030030_01','8030030_02','8030030_03','8030030_04',     
                                                      '8030030_05','8030030_06', 'CS0037'],  0 );
      this.dataList.lstSpecType = lstCommoncode[0];
      this.dataList.lstPopSeq = lstCommoncode[1];
      this.dataList.lstPlanSeq = lstCommoncode[2];
      this.dataList.lstBomType = lstCommoncode[3];

      this.dataList.lstSeqPos = lstCommoncode[4];
      this.dataList.lstGroupType = lstCommoncode[5]; 
      this.dataList.lstTempType = lstCommoncode[6]; 
      
      this.dataList.lstGroupType.unshift({ CODE: "", NAME: "" }); 
      this.dataList.lstTempType.unshift({ CODE: "", NAME: "" });  
      if (this.dataList.lstGroupType.length > 0) {
            this.modelMaster1.GROUP_TYPE = this.dataList.lstGroupType[0]["CODE"];
      }
      if (this.dataList.lstBomType.length > 0) {
            this.modelMaster1.BOM_UOM_TYPE = this.dataList.lstBomType[0]["CODE"];
      }
      if (this.dataList.lstSeqPos.length > 0) {
            this.modelMaster1.SEQ_IS_END_YN = this.dataList.lstSeqPos[0]["CODE"];
      }
    },
     /*NOTE: */
    async LG_LST_8030030(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_8030030",
        para: _param
      };
      switch (_param[0]) {      
        case "UOM":
          this.dataList.lstUOM1 = await this._dsoCall(dso, "select", false);  
          this.dataList.lstUOM1.unshift({ CODEKEY: "", CODEDESC: "" });        
          // if (this.dataList.lstUOM1.length > 0) {
          //   this.tab01.uom = this.dataList.lstUOM1[0]["CODEKEY"];
          // }         
          break; 
         case "WH":
          this.dataList.lstWH = await this._dsoCall(dso, "select", false);  
          this.dataList.lstWH.unshift({ CODEKEY: "", CODEDESC: "" });        
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
