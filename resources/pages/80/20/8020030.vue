<template>
  <v-container fluid class="px-0 pt-0">
    <v-row align="center" justify="space-between" no-gutters >


      <v-col md="12" class="pa-1">
        <BaseTabs>
          <BaseTab name="warehouse">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="8" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch01" />                                                 
                      </v-col>            
                      <v-col md="4" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser01')"/>
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser01"                   
                            sel_procedure="LG_SEL_8020030_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellClick="onCellCickgrdUser01"

                            :filter_paras="[this.txtUserSearch01]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },                                                         
                            ]"                        
                        />               
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="5" class="px-2 py-1">
                        <BaseInput :label="$t('warehouse')" v-model="txtFilter01_1" />                 
                      </v-col>              
                      <v-col md="7" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry01')"/>
                          <BaseButton icon_type="view" :btn_text="$t('view')" :disabled="isProcessing" @onclick="onPopup('grdEntry01')" v-show="false"/>
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry01')"/>                                                              
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry01"                   
                            sel_procedure="LG_SEL_8020030_WH_NOCACHE"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellDblClick="onCellDblCickgrdEntry01" 
                            :filter_paras="[ this.txtFilter01_1,this.txtGRD1PK01]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'CODE',caption: this.$t('wh_id'), allowEditing: false }, 
                              {dataField: 'NAME',caption: this.$t('wh_name'), allowEditing: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('User_ID')" v-model="txtUserID01" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Employee')" v-model="txtEmp01" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp01')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp01')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp01')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp01')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp01"                   
                            sel_procedure="LG_SEL_8020030_1_NOCACHE"
                            upd_procedure="LG_UPD_8020030_1"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp"  
                            @setDataSource="onAfterLoadGrid('grdMapp01')"                              
                            :filter_paras="[this.txtGRD1PK01]"                   
                            :update_paras="[
                                'PK',
                                'TLG_IN_WAREHOUSE_PK',
                                'CODE',
                                'NAME',
                                'USER_PK',
                                'IN_WH_YN',
                                'OUT_WH_YN',
                                'REQ_WH_YN',
                                'CLOSE_WH_YN',
                                'CHECKING_WH_YN'
                            ]"
                            :header="[  
                              {dataField: 'CODE',caption: this.$t('wh_id'), allowEditing: false }, 
                              {dataField: 'NAME',caption: this.$t('wh_name'), allowEditing: false },   
                              {dataField: 'IN_WH_YN',caption: this.$t('from_wh'), allowEditing: false, dataType: 'checkbox' }, 
                              {dataField: 'OUT_WH_YN',caption: this.$t('to_wh'), allowEditing: false, dataType: 'checkbox' }, 
                              {dataField: 'REQ_WH_YN',caption: this.$t('req_wh'), allowEditing: false, dataType: 'checkbox' }, 
                              {dataField: 'CLOSE_WH_YN',caption: this.$t('close_wh'), allowEditing: false, dataType: 'checkbox' }, 
                              {dataField: 'CHECKING_WH_YN',caption: this.$t('checking_wh'), allowEditing: false, dataType: 'checkbox' }, 
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            </v-row>
          </BaseTab>
          <BaseTab name="line">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="8" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch02" />                                                 
                      </v-col>            
                      <v-col md="4" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser02')"/>
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser02"                   
                            sel_procedure="LG_SEL_8020030_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellClick="onCellCickgrdUser02"

                            :filter_paras="[this.txtUserSearch02]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },                                                         
                            ]"                        
                        />               
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="5" class="px-2 py-1">
                        <BaseInput :label="$t('line')" v-model="txtFilter02_1" />                 
                      </v-col>              
                      <v-col md="7" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry02')"/>
                          <BaseButton icon_type="view" :btn_text="$t('view')" :disabled="isProcessing" @onclick="onPopup('grdEntry02')" v-show="false"/>
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry02')"/>                                                              
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry02"                   
                            sel_procedure="LG_SEL_8020030_LINE_NOCACHE"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellDblClick="onCellDblCickgrdEntry02" 
                            :filter_paras="[ this.txtFilter02_1, this.txtGRD1PK02]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'LINE_ID',caption: this.$t('line_id'), allowEditing: false }, 
                              {dataField: 'LINE_NAME',caption: this.$t('line_name'), allowEditing: false }, 
                              {dataField: 'USE_YN',caption: this.$t('use_yn'), allowEditing: false, dataType: 'checkbox', visible: false}, 
                              {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: false, visible: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                     <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('User_ID')" v-model="txtUserID02" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Employee')" v-model="txtEmp02" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp02')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp02')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp02')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp02')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>

                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="7" class="px-2 py-1">
                        <BaseSelect
                          :label="$t('pop_function')"
                          v-model="lstFunction"
                          :lstData="dsFunction"
                          item-text="TEXT"
                          item-value="PK" 
                          @change="onSearch('grdMapp02')"                      
                        />                         
                      </v-col>
                      <v-col md="5" class="px-2 py-1">
                       
                      </v-col>                    
                    </v-row>
                    
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp02"                   
                            sel_procedure="LG_SEL_8020030_2_NOCACHE"
                            upd_procedure="LG_UPD_8020030_2"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp - 30"  
                            @setDataSource="onAfterLoadGrid('grdMapp02')"
                            :filter_paras="[this.txtGRD1PK02, lstFunction]"                   
                            :update_paras="[
                                'PK',
                                'TLG_PB_LINE_PK',
                                'LINE_ID',
                                'LINE_NAME',
                                'USE_YN',
                                'DESCRIPTION',
                                'USER_PK',
                                'FUNCTION_ID',
                                'FUNCTION_NAME'
                            ]"
                            :header="[  
                              {dataField: 'PK',caption: 'MAP_PK', allowEditing: false, visible: false }, 
                              {dataField: 'TLG_PB_LINE_PK',caption: 'TLG_PB_LINE_PK', allowEditing: false, visible: false }, 
                              {dataField: 'LINE_ID',caption: this.$t('line_id'), allowEditing: false }, 
                              {dataField: 'LINE_NAME',caption: this.$t('line_name'), allowEditing: false },   
                              {dataField: 'USE_YN',caption: this.$t('use_yn'), allowEditing: false, dataType: 'checkbox', visible: false}, 
                              {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: false, visible: false }, 
                              {dataField: 'USER_PK',caption: 'user_pk', allowEditing: false, visible: false, visible: false  }, 
                              {dataField: 'FUNCTION_ID',caption: this.$t('function_id'), allowEditing: false, visible: false }, 
                              {dataField: 'FUNCTION_NAME',caption: this.$t('function_name'), allowEditing: false}, 
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            </v-row>
          </BaseTab>
          <BaseTab name="item_group">
            <v-row align="center" justify="space-between" no-gutters >
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="8" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch03" />                                                 
                      </v-col>            
                      <v-col md="4" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser03')"/>
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser03"                   
                            sel_procedure="LG_SEL_8020030_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellClick="onCellCickgrdUser03"

                            :filter_paras="[this.txtUserSearch03]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },                                                         
                            ]"                        
                        />               
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="6" class="px-2 py-1">
                        <BaseInput :label="$t('Group')" v-model="txtFilter03_1" />                 
                      </v-col>              
                      <v-col md="6" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry03')"/>                
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry03')"/>                                                              
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry03"                   
                            sel_procedure="LG_SEL_8020030_ITEMGRP_NOCACHE"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellDblClick="onCellDblCickgrdEntry03" 
                            :filter_paras="[ this.txtFilter03_1,this.txtGRD1PK03]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'CODE',caption: this.$t('GROUP_CODE'), allowEditing: false }, 
                              {dataField: 'NAME',caption: this.$t('GROUP_NAME'), allowEditing: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('User_ID')" v-model="txtUserID03" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Employee')" v-model="txtEmp03" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp03')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp03')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp03')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp03')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp03"                   
                            sel_procedure="LG_SEL_8020030_3_NOCACHE"
                            upd_procedure="LG_UPD_8020030_3"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp"  
                            @setDataSource="onAfterLoadGrid('grdMapp03')"                             
                            :filter_paras="[this.txtGRD1PK03]"                   
                            :update_paras="[
                                'PK',
                                'TLG_IT_ITEMGRP_PK',
                                'CODE',
                                'NAME',                       
                                'MODIFY_ITEM_CODE_YN',
                                'MODIFY_ACC_CODE_YN',
                                'MODIFY_INV_YN',
                                'USER_PK'
                            ]"
                            :header="[  
                              {dataField: 'CODE',caption: this.$t('group_code'), allowEditing: false }, 
                              {dataField: 'NAME',caption: this.$t('group_name'), allowEditing: false },   
                              {dataField: 'MODIFY_ITEM_CODE_YN',caption: this.$t('mod_item'), allowEditing: false, dataType: 'checkbox' }, 
                              {dataField: 'MODIFY_ACC_CODE_YN',caption: this.$t('mod_acc'), allowEditing: false, dataType: 'checkbox' }, 
                              {dataField: 'MODIFY_INV_YN',caption: this.$t('mod_inv'), allowEditing: false, dataType: 'checkbox' }                      
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            
            </v-row>
          </BaseTab>
          <BaseTab name="maintenance_process_type">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="8" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch04" />                                                 
                      </v-col>            
                      <v-col md="4" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser04')"/>
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser04"                   
                            sel_procedure="LG_SEL_8020030_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellClick="onCellCickgrdUser04"

                            :filter_paras="[this.txtUserSearch04]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },                                                         
                            ]"                        
                        />               
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="5" class="px-2 py-1">
                        <BaseInput :label="$t('process_type')" v-model="txtFilter04_1" />                 
                      </v-col>              
                      <v-col md="7" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry04')"/>
                          <BaseButton icon_type="view" :btn_text="$t('view')" :disabled="isProcessing" @onclick="onPopup('grdEntry04')" v-show="false"/>
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry04')"/>                                                              
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry04"                   
                            sel_procedure="LG_SEL_8020030_MA_PTYPE"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellDblClick="onCellDblCickgrdEntry04" 
                            :filter_paras="[ this.txtFilter04_1,this.txtGRD1PK04]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'CODE',caption: this.$t('code'), allowEditing: false }, 
                              {dataField: 'NAME',caption: this.$t('name'), allowEditing: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('User_ID')" v-model="txtUserID04" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Employee')" v-model="txtEmp04" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp04')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp04')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp04')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp04')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp04"                   
                            sel_procedure="LG_SEL_8020030_4_NOCACHE"
                            upd_procedure="LG_UPD_8020030_4"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp"  
                            @setDataSource="onAfterLoadGrid('grdMapp04')"                              
                            :filter_paras="[this.txtGRD1PK04]"                   
                            :update_paras="[
                                'PK',
                                'CODE',
                                'NAME',
                                'USER_PK'                             
                            ]"
                            :header="[  
                              {dataField: 'PK',caption: 'PK', allowEditing: false, visible: false}, 
                              {dataField: 'CODE',caption: this.$t('code'), allowEditing: false }, 
                              {dataField: 'NAME',caption: this.$t('name'), allowEditing: false },   
                              {dataField: 'USER_PK',caption: 'USER_PK', allowEditing: false, visible: false}, 
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            </v-row>
          </BaseTab>
          <BaseTab name="commpany">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="6" class="px-2 py-1">
                        <BaseInput :label="$t('Company')" v-model="txtFilter05_1" />                 
                      </v-col>              
                      <v-col md="6" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry05')"/>                                                                                              
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry05"                   
                            sel_procedure="LG_SEL_8020030_5_COM_NOCACHE"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"           
                            @cellClick="onCellCickgrdEntry05"              
                            :filter_paras="[ this.txtFilter05_1]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'PARTNER_ID',caption: this.$t('company_id'), allowEditing: false }, 
                              {dataField: 'PARTNER_NAME',caption: this.$t('company_name'), allowEditing: false },                                                                         
                              {dataField: 'ADDR1',caption: this.$t('Address'), allowEditing: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="6" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch05" />                                                 
                      </v-col>            
                      <v-col md="6" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser05')"/>
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry05')"/> 
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser05"                   
                            sel_procedure="LG_SEL_8020030_5_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"  
                            @cellDblClick="onCellDblCickgrdUser05"                                            
                            :filter_paras="[this.txtUserSearch05, this.txtGRD1PK05]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },
                              {dataField: 'FULL_NAME',caption: this.$t('EMPLOYEE_NAME'), allowEditing: false },                                                         
                            ]"                        
                        />               
                      </v-col>
                    </v-row>                        
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('Company_ID')" v-model="txtUserID05" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Company_Name')" v-model="txtEmp05" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp05')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp05')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp05')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp05')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp05"                   
                            sel_procedure="LG_SEL_8020030_5_NOCACHE"
                            upd_procedure="LG_UPD_8020030_5"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp"  
                            @setDataSource="onAfterLoadGrid('grdMapp05')"                             
                            :filter_paras="[this.txtGRD1PK05]"                   
                            :update_paras="[
                                'PK',
                                'TCO_COMPANY_PK',
                                'TCO_BSUSER_PK',
                                'THR_EMPLOYEE_PK',
                                'USER_ID',
                                'USER_NAME',
                                'DEPT_NAME',
                                'POSITION_NAME',
                                'FULL_NAME'
                            ]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('user_id'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('user_name'), allowEditing: false },   
                              {dataField: 'DEPT_NAME',caption: this.$t('dept_name'), allowEditing: false },                       
                              {dataField: 'POSITION_NAME',caption: this.$t('position_name'), allowEditing: false },                    
                              {dataField: 'FULL_NAME',caption: this.$t('employee_name'), allowEditing: false },
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            </v-row>
          </BaseTab>
          <BaseTab name="department">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="8" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch06" />                                                 
                      </v-col>            
                      <v-col md="4" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser06')"/>
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser06"                   
                            sel_procedure="LG_SEL_8020030_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellClick="onCellCickgrdUser06"

                            :filter_paras="[this.txtUserSearch06]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },                                                         
                            ]"                        
                        />               
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="5" class="px-2 py-1">
                        <BaseInput :label="$t('dept')" v-model="txtFilter06_1" />                 
                      </v-col>              
                      <v-col md="7" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry06')"/>
                          <BaseButton icon_type="view" :btn_text="$t('view')" :disabled="isProcessing" @onclick="onPopup('grdEntry06')" v-show="false"/>
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry06')"/>                                                              
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry06"                   
                            sel_procedure="LG_SEL_8020030_DEPT"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellDblClick="onCellDblCickgrdEntry06" 
                            :filter_paras="[ this.txtFilter06_1,this.txtGRD1PK06]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'DEPT_ID',caption: this.$t('dept_id'), allowEditing: false }, 
                              {dataField: 'DEPT_NAME',caption: this.$t('dept_name'), allowEditing: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('User_ID')" v-model="txtUserID06" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Employee')" v-model="txtEmp06" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp06')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp06')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp06')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp06')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp06"                   
                            sel_procedure="LG_SEL_8020030_6_NOCACHE"
                            upd_procedure="LG_UPD_8020030_6"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp"  
                            @setDataSource="onAfterLoadGrid('grdMapp06')"                              
                            :filter_paras="[this.txtGRD1PK06]"                   
                            :update_paras="[
                                'PK',
                                'TLG_PO_DEPT_PK',
                                'DEPT_ID',
                                'DEPT_NAME',
                                'DESCRIPTION',
                                'USER_PK'                             
                            ]"
                            :header="[  
                              {dataField: 'PK',caption: 'pk', allowEditing: false, visible: false}, 
                              {dataField: 'TLG_PO_DEPT_PK',caption: 'tlg_po_dept_pk', allowEditing: false, visible: false}, 
                              {dataField: 'DEPT_ID',caption: this.$t('dept_id'), allowEditing: false }, 
                              {dataField: 'DEPT_NAME',caption: this.$t('dept_name'), allowEditing: false },
                              {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: true },   
                              {dataField: 'USER_PK',caption: 'USER_PK', allowEditing: false, visible: false}, 
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            </v-row>
          </BaseTab>
          <BaseTab name="process">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="8" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch07" />                                                 
                      </v-col>            
                      <v-col md="4" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser07')"/>
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser07"                   
                            sel_procedure="LG_SEL_8020030_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellClick="onCellCickgrdUser07"

                            :filter_paras="[this.txtUserSearch07]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },                                                          
                            ]"                        
                        />               
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="5" class="px-2 py-1">
                        <BaseInput :label="$t('process')" v-model="txtFilter07_1" />                 
                      </v-col>              
                      <v-col md="7" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry07')"/>
                          <BaseButton icon_type="view" :btn_text="$t('view')" :disabled="isProcessing" @onclick="onPopup('grdEntry07')" v-show="false"/>
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry07')"/>                                                              
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry07"                   
                            sel_procedure="LG_SEL_8020030_PROCESS"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"                         
                            @cellDblClick="onCellDblCickgrdEntry07" 
                            :filter_paras="[ this.txtFilter07_1,this.txtGRD1PK07]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'PROCESS_ID',caption: this.$t('process_id'), allowEditing: false }, 
                              {dataField: 'PROCESS_NAME',caption: this.$t('process_name'), allowEditing: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('User_ID')" v-model="txtUserID07" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Employee')" v-model="txtEmp07" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp07')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp07')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp07')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp07')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp07"                   
                            sel_procedure="LG_SEL_8020030_7_NOCACHE"
                            upd_procedure="LG_UPD_8020030_7"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp"  
                            @setDataSource="onAfterLoadGrid('grdMapp07')"                              
                            :filter_paras="[this.txtGRD1PK07]"                   
                            :update_paras="[
                                'PK',
                                'TLG_PB_PROCESS_PK',
                                'PROCESS_ID',
                                'PROCESS_NAME',
                                'DESCRIPTION',
                                'USER_PK'                             
                            ]"
                            :header="[  
                              {dataField: 'PK',caption: 'pk', allowEditing: false, visible: false}, 
                              {dataField: 'TLG_PB_PROCESS_PK',caption: 'TLG_PB_PROCESS_PK', allowEditing: false, visible: false}, 
                              {dataField: 'PROCESS_ID',caption: this.$t('process_id'), allowEditing: false }, 
                              {dataField: 'PROCESS_NAME',caption: this.$t('process_name'), allowEditing: false }, 
                              {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: true },   
                              {dataField: 'USER_PK',caption: 'USER_PK', allowEditing: false, visible: false}, 
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            </v-row>
          </BaseTab>
          <BaseTab name="factory">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pa-1 py-0">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft" >
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="6" class="px-2 py-1">
                        <BaseInput :label="$t('factory')" v-model="txtFilter08_1" />                 
                      </v-col>
                      <v-col md="6" class="px-2 py-1" align="right">                  
                        <v-row justify="end" class="mr-1">
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdEntry08')"/>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdEntry08"
                            sel_procedure="LG_SEL_8020030_8_FAC_NOCACHE"
                            upd_procedure=""
                            select_mode="Single"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"           
                            @cellClick="onCellCickgrdEntry08"              
                            :filter_paras="[ this.txtFilter08_1]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'FACTORY_ID',caption: this.$t('factory_id'), allowEditing: false }, 
                              {dataField: 'FACTORY_NAME',caption: this.$t('factory_name'), allowEditing: false },                                                                         
                              {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: false },                                                                         
                            ]"                        
                        />          
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="6" class="px-2 py-1">               
                          <BaseInput :label="$t('User')" v-model="txtUserSearch08" />                                                 
                      </v-col>            
                      <v-col md="6" class="px-2 py-1" align="right">
                        <v-row justify="end" class="mr-1">
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdUser08')"/>
                          <BaseButton icon_type="confirm" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onMSelect('grdEntry08')"/> 
                        </v-row>   
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdUser08"                   
                            sel_procedure="LG_SEL_8020030_8_USER_NOCACHE"
                            upd_procedure=""
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdUser"  
                            @cellDblClick="onCellDblCickgrdUser08"                                            
                            :filter_paras="[this.txtUserSearch08, this.txtGRD1PK08]"                   
                            :update_paras="[]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('User_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('Employee_Name'), allowEditing: false },  
                              {dataField: 'DEPT_NAME',caption: this.$t('department'), allowEditing: false },  
                              {dataField: 'POSITION_NAME',caption: this.$t('position'), allowEditing: false },
                            ]"                        
                        />               
                      </v-col>
                    </v-row>                        
                  </v-card>
                </v-col>
                <v-col md="8" class="pa-1">
                  <v-card class="pa-1 py-0" outlined tile :height="heightLeft">
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="3" class="px-2 py-1">
                        <BaseInput :label="$t('Factory_ID')" v-model="txtUserID08" readonly />
                      </v-col>
                      <v-col md="4" class="px-2 py-1">
                        <BaseInput :label="$t('Factory_Name')" v-model="txtEmp08" readonly />
                      </v-col>
                      <v-col md="5" class="px-2 py-1" align="right">
                          <v-row justify="end" class="mr-1">          
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch('grdMapp08')"/>
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('grdMapp08')"/>
                          <BaseButton icon_type="undelete" :btn_text="$t('Un_delete')" :disabled="isProcessing" @onclick="onUnDelete('grdMapp08')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveMap('grdMapp08')"/>                                                              
                        </v-row> 
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-between" no-gutters class="py-1">
                      <v-col md="12" class="py-1">
                        <DataGridView
                            column-resizing-mode="widget"
                            ref="grdMapp08"                   
                            sel_procedure="LG_SEL_8020030_8_NOCACHE"
                            upd_procedure="LG_UPD_8020030_8"
                            select_mode="MultipleHideBox"
                            :auto_load="false"                  
                            :max_height="heightGrdMapp"  
                            @setDataSource="onAfterLoadGrid('grdMapp08')"                             
                            :filter_paras="[this.txtGRD1PK08]"                   
                            :update_paras="[
                                'PK',
                                'TCO_FACTORY_PK',
                                'TCO_BSUSER_PK',
                                'THR_EMPLOYEE_PK',
                                'USER_ID',
                                'USER_NAME',
                                'DEPT_NAME',
                                'FULL_NAME',
                            ]"
                            :header="[  
                              {dataField: 'USER_ID',caption: this.$t('USER_ID'), allowEditing: false }, 
                              {dataField: 'USER_NAME',caption: this.$t('USER_NAME'), allowEditing: false },   
                              {dataField: 'DEPT_NAME',caption: this.$t('DEPT_NAME'), allowEditing: false },                       
                              {dataField: 'FULL_NAME',caption: this.$t('EMPLOYEE_NAME'), allowEditing: false },
                            ]"                     
                        />        
                      
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
            </v-row>
          </BaseTab>
        </BaseTabs>
      </v-col>
    </v-row>
  </v-container>  
</template> 

<script>

export default {
  layout: 'default',
  middleware: 'user',

  components: {},

  data: () => ({
    toggleForm: 'WH',
    dsGrdUser: [],
    dsGrdWarehouse: [],
    dsGrdMapping: [],
    dsFunction: [],
   
    lstFunction: "",
   
    txtGRD1PK01: "",
    txtGRD1PK02: "",
    txtGRD1PK03: "",
    txtGRD1PK04: "",
    txtGRD1PK05: "",
    txtGRD1PK06: "",
    txtGRD1PK07: "",
    txtGRD1PK08: "",
    txtGRD1PK09: "",

    txtUserSearch01: "",
    txtUserSearch02: "",
    txtUserSearch03: "",
    txtUserSearch04: "",
    txtUserSearch05: "",
    txtUserSearch06: "",
    txtUserSearch07: "",
    txtUserSearch08: "",
    txtUserSearch09: "",

    txtUserID01: "",
    txtUserID02: "",
    txtUserID03: "",
    txtUserID04: "",
    txtUserID05: "",
    txtUserID06: "",
    txtUserID07: "",
    txtUserID08: "",
    txtUserID09: "",

    txtEmp01: "",
    txtEmp02: "",
    txtEmp03: "",
    txtEmp04: "",
    txtEmp05: "",
    txtEmp06: "",
    txtEmp07: "",
    txtEmp08: "",
    txtEmp09: "",

    txtFilter01_1: "",
    txtFilter02_1: "",
    txtFilter03_1: "",
    txtFilter04_1: "",
    txtFilter05_1: "",
    txtFilter06_1: "",
    txtFilter07_1: "",
    txtFilter08_1: "",
    txtFilter09_1: "",


    txtRefresh: 0
  }),

  created() {
    /*TODO: */ 
       this.onBodyInit();

   },

   mounted() {
    this.onResize();
  },

  computed: {
    heightGrdUser() { return this.windowHeight * 0.33 },
    heightGrdEntry() { return this.windowHeight * 0.33 },
    heightGrdMapp() { return this.windowHeight * 0.745 },
    heightLeft() { return this.windowHeight * 0.81  },    
  },

  watch: {
    
  },
  methods: {

    //==================================================================================
    async onBodyInit() {
 
      this.dsFunction = await this._execSQL("select p.FUNCTION_ID PK, p.FUNCTION_NAME TEXT from TLG_POP_FUNCTION p where p.DEL_IF =0 order by p.FUNCTION_ID");
      this.dsFunction.unshift({PK: "", TEXT: ""});
      //this.lstFunction = "";
     
    },

    onCellCickgrdUser01(e) {      
      this.txtGRD1PK01 = e.data.PK;
      this.txtUserID01 = e.data.USER_ID;
      this.txtEmp01 = e.data.USER_NAME;
      this.onSearch('grdMapp01');
      this.onSearch('grdEntry01');
    },
    onCellCickgrdUser02(e) {      
      this.txtGRD1PK02 = e.data.PK;
      this.txtUserID02 = e.data.USER_ID;
      this.txtEmp02 = e.data.USER_NAME;
      this.onSearch('grdMapp02');
      this.onSearch('grdEntry02');
    },
    onCellCickgrdUser03(e) {      
      this.txtGRD1PK03 = e.data.PK;
      this.txtUserID03 = e.data.USER_ID;
      this.txtEmp03 = e.data.USER_NAME;
      this.onSearch('grdMapp03');
      this.onSearch('grdEntry03');
    },
    onCellCickgrdUser04(e) {      
      this.txtGRD1PK04 = e.data.PK;
      this.txtUserID04 = e.data.USER_ID;
      this.txtEmp04 = e.data.USER_NAME;
      this.onSearch('grdMapp04');
      this.onSearch('grdEntry04');
    },
    

    onCellCickgrdEntry05(e) {      
      this.txtGRD1PK05 = e.data.PK;
      this.txtUserID05 = e.data.PARTNER_ID;
      this.txtEmp05 = e.data.PARTNER_NAME;
      this.onSearch('grdMapp05');
      this.onSearch('grdUser05');
    },

    
    onCellCickgrdUser06(e) {      
      this.txtGRD1PK06 = e.data.PK;
      this.txtUserID06 = e.data.PARTNER_ID;
      this.txtEmp06 = e.data.PARTNER_NAME;
      this.onSearch('grdMapp06');
      this.onSearch('grdUser06');
    },

    onCellCickgrdUser07(e) {      
      this.txtGRD1PK07 = e.data.PK;
      this.txtUserID07 = e.data.PARTNER_ID;
      this.txtEmp07 = e.data.PARTNER_NAME;
      this.onSearch('grdMapp07');
      this.onSearch('grdUser07');
    },

    onCellCickgrdEntry08(e) {      
      this.txtGRD1PK08 = e.data.PK;
      this.txtUserID08 = e.data.PARTNER_ID;
      this.txtEmp08 = e.data.PARTNER_NAME;
      this.onSearch('grdMapp08');
      this.onSearch('grdUser08');
    },


    onCellDblCickgrdEntry01(e)
    {
      this.onMSelect('grdEntry01');
    },

    onCellDblCickgrdEntry02(e)
    {
      this.onMSelect('grdEntry02');
    },


    onCellDblCickgrdEntry03(e)
    {
      this.onMSelect('grdEntry03');
    },

    onCellDblCickgrdEntry04(e)
    {
      this.onMSelect('grdEntry04');
    },

    onCellDblCickgrdUser05(e)
    {
      this.onMSelect('grdEntry05');
    },
    onCellDblCickgrdEntry06(e)
    {
      this.onMSelect('grdEntry06');
    },
    onCellDblCickgrdEntry07(e)
    {
      this.onMSelect('grdEntry07');
    },
    onCellDblCickgrdUser08(e)
    {
      this.onMSelect('grdEntry08');
    },

    onAfterLoadGrid(pos)
    {    
      switch(pos)
      {
          case'grdMapp01':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdEntry01.loadData() ;
            }              
          break;
          case'grdMapp02':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdEntry02.loadData() ;
            }              
          break;
          case'grdMapp03':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdEntry03.loadData() ;
            }              
          break;
          case'grdMapp04':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdEntry04.loadData() ;
            }              
          break;
          case'grdMapp05':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdUser05.loadData() ;
            }              
          break;
          case'grdMapp06':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdEntry06.loadData() ;
            }              
          break;
          case'grdMapp07':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdEntry07.loadData() ;
            }              
          break;
          case'grdMapp08':
            if (this.txtRefresh == 1);
            {
              this.txtRefresh = 0;
              this.$refs.grdUser08.loadData() ;
            }              
          break;
      }
    },
    //============================================
    onSearch(pos)
    {
      switch(pos)
      {
          case'grdUser01':
              this.$refs.grdUser01.loadData() ;
          break;
          case'grdEntry01':
              this.$refs.grdEntry01.loadData() ;
          break; 
          case'grdMapp01':
              this.$refs.grdMapp01.loadData() ;
          break; 
          
          case'grdUser02':
              this.$refs.grdUser02.loadData() ;
          break;
          case'grdEntry02':
              this.$refs.grdEntry02.loadData() ;
          break; 
          case'grdMapp02':
              this.$refs.grdMapp02.loadData() ;
          break; 
          
          case'grdUser03':
              this.$refs.grdUser03.loadData() ;
          break;
          case'grdEntry03':
              this.$refs.grdEntry03.loadData() ;
          break; 
          case'grdMapp03':
              this.$refs.grdMapp03.loadData() ;
          break;  
          
          case'grdUser04':
              this.$refs.grdUser04.loadData() ;
          break;
          case'grdEntry04':
              this.$refs.grdEntry04.loadData() ;
          break; 
          case'grdMapp04':
              this.$refs.grdMapp04.loadData() ;
          break;   

          case'grdUser05':
              this.$refs.grdUser05.loadData() ;
          break;
          case'grdEntry05':
              this.$refs.grdEntry05.loadData() ;
          break; 
          case'grdMapp05':
              this.$refs.grdMapp05.loadData() ;
          break;  

          case'grdUser06':
              this.$refs.grdUser06.loadData() ;
          break;
          case'grdEntry06':
              this.$refs.grdEntry06.loadData() ;
          break; 
          case'grdMapp06':
              this.$refs.grdMapp06.loadData() ;
          break;   

          case'grdUser07':
              this.$refs.grdUser07.loadData() ;
          break;
          case'grdEntry07':
              this.$refs.grdEntry07.loadData() ;
          break; 
          case'grdMapp07':
              this.$refs.grdMapp07.loadData() ;
          break;   

          case'grdUser08':
              this.$refs.grdUser08.loadData() ;
          break;
          case'grdEntry08':
              this.$refs.grdEntry08.loadData() ;
          break; 
          case'grdMapp08':
              this.$refs.grdMapp08.loadData() ;
          break;   


      }
    },
    //============================================
    onMSelect(obj)
    {
        let selectRows = 0;
        if(obj=='grdEntry01')
        {
          if (this._hasValue(this.txtGRD1PK01))
          {
              selectRows = this.$refs.grdEntry01.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdEntry01.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = ""; 
              insertRow.TLG_IN_WAREHOUSE_PK = item.PK ; 
              insertRow.CODE = item.CODE;                              
              insertRow.NAME = item.NAME;
              insertRow.USER_PK = this.txtGRD1PK01;                   
              insertRow.IN_WH_YN = "Y";
              insertRow.OUT_WH_YN =  "Y";
              insertRow.REQ_WH_YN =  "Y";
              insertRow.CLOSE_WH_YN =  "Y";
              insertRow.CHECKING_WH_YN =  "Y";            
              this.$refs.grdMapp01.addRowStruct(insertRow);              
            }); 
            this.$refs.grdEntry01.deleteRows3();
          }  
          else
          {
              this.showNotification("danger", this.$t("pls_select_user_first"), "");
          }
        }

        if(obj=='grdEntry02')
        {
          if (this._hasValue(this.txtGRD1PK02))
          {
              selectRows = this.$refs.grdEntry02.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdEntry02.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = ""; 
              insertRow.TLG_PB_LINE_PK = item.PK ; 
              insertRow.LINE_ID = item.LINE_ID;                              
              insertRow.LINE_NAME = item.LINE_NAME;
              insertRow.USER_PK = this.txtGRD1PK02;                   
              insertRow.USER_YN = "Y";
              insertRow.FUNCTION_ID =  this.lstFunction;
              insertRow.FUNCTION_NAME =  this.lstFunction;   
              this.$refs.grdMapp02.addRowStruct(insertRow);              
            }); 
            this.$refs.grdEntry02.deleteRows3();
          }  
          else
          {
              this.showNotification("danger", this.$t("pls_select_user_first"), "");
          }
        }

        else if(obj=='grdEntry03')
        {
          if (this._hasValue(this.txtGRD1PK03))
          {
              selectRows = this.$refs.grdEntry03.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdEntry03.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = ""; 
              insertRow.TLG_IT_ITEMGRP_PK = item.PK ; 
              insertRow.CODE = item.CODE;                              
              insertRow.NAME = item.NAME;
              insertRow.USER_PK = this.txtGRD1PK03;                   
              insertRow.MODIFY_ITEM_CODE_YN = "Y";
              insertRow.MODIFY_ACC_CODE_YN =  "Y";
              insertRow.MODIFY_INV_YN =  "Y";          
              this.$refs.grdMapp03.addRowStruct(insertRow);              
            }); 
            this.$refs.grdEntry03.deleteRows3();
          }  
          else
          {
              this.showNotification("danger", this.$t("pls_select_user_first"), "");
          }
        }

        else if(obj=='grdEntry04')
        {
          if (this._hasValue(this.txtGRD1PK04))
          {
              selectRows = this.$refs.grdEntry04.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdEntry04.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = "";               
              insertRow.CODE = item.CODE;                              
              insertRow.NAME = item.NAME;
              insertRow.USER_PK = this.txtGRD1PK04;                             
              this.$refs.grdMapp04.addRowStruct(insertRow);              
            }); 
            this.$refs.grdEntry04.deleteRows3();
          }  
          else
          {
              this.showNotification("danger", this.$t("pls_select_user_first"), "");
          }
        }

        else if(obj=='grdEntry05')
        {
          if (this._hasValue(this.txtGRD1PK05))
          {
              selectRows = this.$refs.grdUser05.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdUser05.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = "";
              insertRow.TCO_COMPANY_PK = this.txtGRD1PK05;  
              insertRow.TCO_BSUSER_PK = item.PK ; 
              insertRow.THR_EMPLOYEE_PK = item.THR_ABEMP_PK ; 
              insertRow.USER_ID = item.USER_ID;                              
              insertRow.USER_NAME = item.USER_NAME;                               
              insertRow.DEPT_NAME = item.DEPT_NAME; 
              insertRow.POSITION_NAME = item.POSITION_NAME; 
              insertRow.FULL_NAME =  item.FULL_FNAME;        
              this.$refs.grdMapp05.addRowStruct(insertRow);              
            }); 
            this.$refs.grdUser05.deleteRows3();
          }           
          else
          {
              this.showNotification("danger", this.$t("pls_select_company_first"), "");
          }
        }

        else if(obj=='grdEntry06')
        {
          if (this._hasValue(this.txtGRD1PK06))
          {
              selectRows = this.$refs.grdEntry06.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdEntry06.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = ""; 
              insertRow.TLG_PO_DEPT_PK = item.PK ; 
              insertRow.DEPT_ID = item.DEPT_ID;                              
              insertRow.DEPT_NAME = item.DEPT_NAME;
              insertRow.USER_PK = this.txtGRD1PK06;                             
              this.$refs.grdMapp06.addRowStruct(insertRow);              
            }); 
            this.$refs.grdEntry06.deleteRows3();
          }  
          else
          {
              this.showNotification("danger", this.$t("pls_select_user_first"), "");
          }
        }

        else if(obj=='grdEntry07')
        {
          if (this._hasValue(this.txtGRD1PK07))
          {
              selectRows = this.$refs.grdEntry07.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdEntry07.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = ""; 
              insertRow.TLG_PB_PROCESS_PK = item.PK ; 
              insertRow.PROCESS_ID = item.PROCESS_ID;                              
              insertRow.PROCESS_NAME = item.PROCESS_NAME;
              insertRow.USER_PK = this.txtGRD1PK07;                             
              this.$refs.grdMapp07.addRowStruct(insertRow);              
            }); 
            this.$refs.grdEntry07.deleteRows3();
          }  
          else
          {
              this.showNotification("danger", this.$t("pls_select_user_first"), "");
          }
        }
        
        else if(obj=='grdEntry08')
        {
          if (this._hasValue(this.txtGRD1PK08))
          {
              selectRows = this.$refs.grdUser08.getSelectRowsData().length;
              if (selectRows == 0)
              {
                this.showNotification("danger", this.$t("pls_choose_one_detail_first"), "");
                return;
              }   
              this.$refs.grdUser08.getSelectRowsData().forEach(item => {
              let insertRow = {};                     
              insertRow.PK = "";
              insertRow.TCO_FACTORY_PK = this.txtGRD1PK08;  
              insertRow.TCO_BSUSER_PK = item.PK ; 
              insertRow.THR_EMPLOYEE_PK = item.THR_ABEMP_PK ; 
              insertRow.USER_ID = item.USER_ID;                              
              insertRow.USER_NAME = item.USER_NAME;                               
              insertRow.DEPT_NAME = item.DEPT_NAME; 
              insertRow.FULL_NAME =  item.FULL_FNAME;        
              this.$refs.grdMapp08.addRowStruct(insertRow);              
            }); 
            this.$refs.grdUser08.deleteRows3();
          }           
          else
          {
              this.showNotification("danger", this.$t("pls_select_company_first"), "");
          }
        }
        
    },
    //============================================
    
    onDelete(p_obj)
    {
        let selectRows = 0;
        if(p_obj=='grdMapp01')
        {        
              selectRows = this.$refs.grdMapp01.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp01.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                     
                  insertRow.PK = item.TLG_IN_WAREHOUSE_PK ;                 
                  insertRow.CODE = item.CODE;                              
                  insertRow.NAME = item.NAME;                       
                  this.$refs.grdEntry01.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp01.deleteRows();        
        }
        else if(p_obj=='grdMapp02')
        {        
              selectRows = this.$refs.grdMapp02.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp02.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                     
                  insertRow.PK = item.TLG_PB_LINE_PK ;                 
                  insertRow.LINE_ID = item.LINE_ID;                              
                  insertRow.LINE_NAME = item.LINE_NAME;                   
                  this.$refs.grdEntry02.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp02.deleteRows();        
        }

        else if(p_obj=='grdMapp03')
        {        
              selectRows = this.$refs.grdMapp03.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp03.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                     
                  insertRow.PK = item.TLG_IT_ITEMGRP_PK ;                 
                  insertRow.CODE = item.CODE;                              
                  insertRow.NAME = item.NAME;                       
                  this.$refs.grdEntry03.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp03.deleteRows();        
        }

        else if(p_obj=='grdMapp04')
        {        
              selectRows = this.$refs.grdMapp04.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp04.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                                    
                  insertRow.CODE = item.CODE;                              
                  insertRow.NAME = item.NAME;                       
                  this.$refs.grdEntry04.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp04.deleteRows();        
        }

        else if(p_obj=='grdMapp05')
        {        
              selectRows = this.$refs.grdMapp05.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp05.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                      
                  insertRow.PK = item.TCO_BSUSER_PK ; 
                  insertRow.THR_ABEMP_PK = item.THR_EMPLOYEE_PK ; 
                  insertRow.USER_ID = item.USER_ID;                              
                  insertRow.USER_NAME = item.USER_NAME;                               
                  insertRow.DEPT_NAME = item.DEPT_NAME; 
                  this.$refs.grdUser05.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp05.deleteRows();        
        }

        else if(p_obj=='grdMapp06')
        {        
              selectRows = this.$refs.grdMapp06.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp06.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                     
                  insertRow.PK = item.TLG_PO_DEPT_PK ;                 
                  insertRow.DEPT_ID = item.DEPT_ID;                              
                  insertRow.DEPT_NAME = item.DEPT_NAME;                       
                  this.$refs.grdEntry06.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp06.deleteRows();        
        }

        else if(p_obj=='grdMapp07')
        {        
              selectRows = this.$refs.grdMapp07.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp07.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                     
                  insertRow.PK = item.TLG_PB_PROCESS_PK ;                 
                  insertRow.PROCESS_ID = item.PROCESS_ID;                              
                  insertRow.PROCESS_NAME = item.PROCESS_NAME;                       
                  this.$refs.grdEntry07.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp07.deleteRows();        
        }

        else if(p_obj=='grdMapp08')
        {        
              selectRows = this.$refs.grdMapp08.getSelectRowsData().length;
              if (selectRows == 0)
              {               
                return;
              }   
              this.$refs.grdMapp08.getSelectRowsData().forEach(item => {
                if (!this._hasValue(item.PK))
                {
                  let insertRow = {};                      
                  insertRow.PK = item.TCO_BSUSER_PK ; 
                  insertRow.THR_ABEMP_PK = item.THR_EMPLOYEE_PK ; 
                  insertRow.USER_ID = item.USER_ID;                              
                  insertRow.USER_NAME = item.USER_NAME;                               
                  insertRow.DEPT_NAME = item.DEPT_NAME; 
                  insertRow.POSITION_NAME = item.POSITION_NAME; 
                  this.$refs.grdUser08.addRowStruct(insertRow);  
                }                         
              }); 
              this.$refs.grdMapp08.deleteRows();        
        }    
    
    },
    //==================================================
    onUnDelete(p_obj)
    {
        if(p_obj=='grdMapp01')
        {
            this.$refs.grdMapp01.unDeleteRows();
        }
        else if(p_obj=='grdMapp02')
        {
            this.$refs.grdMapp02.unDeleteRows();
        }
        else if(p_obj=='grdMapp03')
        {
            this.$refs.grdMapp03.unDeleteRows();
        }
        else if(p_obj=='grdMapp04')
        {
            this.$refs.grdMapp04.unDeleteRows();
        }
        else if(p_obj=='grdMapp05')
        {
            this.$refs.grdMapp05.unDeleteRows();
        }
        else if(p_obj=='grdMapp06')
        {
            this.$refs.grdMapp06.unDeleteRows();
        }
        else if(p_obj=='grdMapp07')
        {
            this.$refs.grdMapp07.unDeleteRows();
        }
        else if(p_obj=='grdMapp08')
        {
            this.$refs.grdMapp08.unDeleteRows();
        }
       
    },
    //===============================================
    onSaveMap(p_obj)
    {
        if(p_obj=='grdMapp01')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp01.saveData();
        }
        else if(p_obj=='grdMapp02')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp02.saveData();
        }
        else if(p_obj=='grdMapp03')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp03.saveData();
        }
        else if(p_obj=='grdMapp04')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp04.saveData();
        }
        else if(p_obj=='grdMapp06')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp06.saveData();
        }
        else if(p_obj=='grdMapp03')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp03.saveData();
        }
        else if(p_obj=='grdMapp07')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp07.saveData();
        }
        else if(p_obj=='grdMapp08')
        {
          this.txtRefresh = 1;
          this.$refs.grdMapp08.saveData();
        }
               
    },
//============================================
  }
}
</script>
