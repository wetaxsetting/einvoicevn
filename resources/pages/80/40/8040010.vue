<template>
<v-container fluid class="px-0 pt-0" v-resize="onResize">

  <v-row no-gutters>
    <v-col cols="12" class="pt-1">
      <v-row no-gutters>
        <v-col cols='12'>
          <v-btn-toggle dense mandatory :color="currentTheme" v-model="selectIndex">
            <v-btn value="0">{{ $t('tab_item') }}</v-btn>
            <v-btn value="1">{{ $t('tab_stitem') }}</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row no-gutters v-show="selectIndex == 0">
        <v-col cols="12">
          <v-card class="pa-2 pt-0">
            <v-row class="pt-2">
              <v-col md="2" class="pt-0">
                <v-select id="lstCompany1" v-model="tab01.Company" :label="$t('company')" :items="dataList.lstCompany1" item-value="PK" item-text="TEXT" @change="onChangeField('lstCompany1')" dense cache-items hide-details />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-radio-group v-model="radSearchPage1" row class="mt-0" dense hide-details>
                  <v-radio :label="$t('product')" value="1"></v-radio>
                  <v-radio :label="$t('material')" value="2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col md="2" class="pt-0">
                <v-select v-model="tab01.tlg_it_itemgrp_pk" :label="$t('group')" item-value="CODEKEY" item-text="CODEDESC" :items="dataList.lstItemGroup1" @change="onChangeField('lstItemGroup1')" dense hide-details />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-text-field :label="$t('item_search01')" v-model="tab01.item_search01" clearable dense hide-details @keypress.enter="onClickButton('btnSearch01')" />
              </v-col>
              <v-col md="1" class="pt-0">
                <v-checkbox dense hide-details class="mt-0" :color="currentTheme" :label="$t('active')" v-model="tab01.chk_Active" />
              </v-col>

              <v-col md="3" class="pt-0" style="text-align:right">
                <v-row justify="end" class="mr-1">                   
                   <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch01')"/>                                                                   
                   <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" :disabled="isProcessing" @onclick="onAddNew(1)"/>
                   <BaseButton btn_type="icon" icon_type="copy" :btn_text="$t('copy')" :disabled="isProcessing" @onclick="onAddNew(2)"/>
                   <BaseButton btn_type="icon" icon_type="edit" :btn_text="$t('edit')" :disabled="isProcessing" @onclick="onAddNew(3)"/>  
                   <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClickButton('btnDelete01')"/>   
                   <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSave01')"/>                                               
                 </v-row>                  
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between">
              <v-col md="1" class="pt-0">
                <v-text-field v-model="tab01.acc_code" :label="$t('account_code')" readonly dense hide-details @keypress.enter="onClickButton('btnSearch01')" />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-text-field v-model="tab01.acc_name" :label="$t('account_name')" readonly dense hide-details>
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" :color="currentTheme" @click="onClickLabel('ACCOUNT')">mdi-window-restore</v-icon>
                      </template>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" :color="currentTheme" @click="onClearAccount">mdi-eraser</v-icon>
                      </template>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="2" class="pt-0">
                <v-select v-model="tab01.uom" :label="$t('uom')" item-value="CODEKEY" item-text="CODEDESC" :items="dataList.lstUOM1" dense hide-details />
              </v-col>
              <v-col md="1" class="pt-0">
                <BaseInput :label="$t('weight_unit')" v-model="tab01.weight_unit" number />
              </v-col>
              <v-col md="1" class="pt-0">
                 <BaseInput :label="$t('pallet_qty')" v-model="tab01.temp" number />
              </v-col>
             
               <v-col md="1" class="pt-0">
                <BaseInput :label="$t('item_price')" v-model="tab01.market_price" number="3" />
              </v-col> 
               <v-col md="2" class="pt-0">
                <v-select v-model="tab01.columns" :label="$t('set_columns')" item-value="CODEKEY" item-text="CODEDESC" :items="dataList.lstColumns" dense hide-details />
              </v-col>
              <v-col md="1" class="pt-0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon tile :color="currentTheme" @click="onClickButton('btnSetData')" v-on="on">
                      <v-icon>mdi-arrow-down-bold-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("set") }}</span>
                </v-tooltip>
              </v-col>
              <v-col class="pt-0" md="1" align="center">
                <i style="color:red; ">{{$t('rows')}} : {{this.dataGrid1.length }} </i>
              </v-col>
            </v-row>

            <v-row align="center" justify="space-between" class="pa-0">
              <v-col cols="12" class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdDetail01" key-expr="PK" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" :height="limitHeight" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onCellDblClick="onCellDblClickGrdDetail01" @init-new-row="initNewRow" @row-inserted="rowInserted" @row-updated="checkUpdated" :onCellPrepared="onCellPrepared" :onRowUpdating="onEndEditGrid">
                  <DxColumn data-field="PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="TLG_IT_ITEMGRP_PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="GRP_NM" :caption="$t('grd1_group')" data-type="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_CODE" :caption="$t('grd1_item_code')" data-type="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('grd1_item_name')" data-type="string" :allow-editing="false" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_IT_STITEM_PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="ST_ITEM_CODE" :caption="$t('grd1_st_item_code')" data-type="string" :visible="isSTItemVisible" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ST_ITEM_NAME" :caption="$t('grd1_st_item_name')" data-type="string" :allow-editing="false" :visible="isSTItemVisible" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_LNAME" :caption="$t('grd1_f_name_01')" data-type="string" :allow-editing="false" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_FNAME" :caption="$t('grd1_f_name_02')" data-type="string" :allow-editing="false" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="UOM" :caption="$t('grd1_uom')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM" :caption="$t('grd1_ref_uom_1')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_2" :caption="$t('grd1_ref_uom_2')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="WEIGHT_UNIT" :caption="$t('weight_unit')" data-type="number" format="###,###,###.###" :allow-editing="true" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="TEMP" :caption="$t('pallet_qty')" data-type="number" :allow-editing="true" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="TAC_ABACCTCODE_PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="ACCT_NM" :caption="$t('grd1_wh_acc')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="TAC_ABACCTCODE_PK_EXPENSE" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="EXPENSE_NM" :caption="$t('grd1_expense_acc')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="TAC_ABACCTCODE_PK_REVENUE" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="REVENUE_NM" :caption="$t('grd1_revenue_acc')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="MARKET_PRICE" :caption="$t('item_price')" data-type="number" format="###,###,###.###" :allow-editing="true" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="BOM_YN" :caption="$t('grd1_bom_yn')" cell-template="check-yn-template" width="50" css-class="cell-align-center" />
                  <DxColumn data-field="INV_YN" :caption="$t('grd1_inv_yn')" cell-template="check-yn-template" width="50" css-class="cell-align-center" />
                  <DxColumn data-field="HS_CODE" :caption="$t('grd1_hs_code')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="USE_YN" :caption="$t('grd1_use_yn')" cell-template="check-yn-template" width="50" css-class="cell-align-center" />

                  <DxColumn data-field="SPEC01_NM" :caption="lstSpecHeader[0]['SPEC_1']" :visible="(lstSpecHeader[0]['SPEC_1']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC02_NM" :caption="lstSpecHeader[0]['SPEC_2']" :visible="(lstSpecHeader[0]['SPEC_2']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC03_NM" :caption="lstSpecHeader[0]['SPEC_3']" :visible="(lstSpecHeader[0]['SPEC_3']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC04_NM" :caption="lstSpecHeader[0]['SPEC_4']" :visible="(lstSpecHeader[0]['SPEC_4']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC05_NM" :caption="lstSpecHeader[0]['SPEC_5']" :visible="(lstSpecHeader[0]['SPEC_5']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC06_NM" :caption="lstSpecHeader[0]['SPEC_6']" :visible="(lstSpecHeader[0]['SPEC_6']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC07_NM" :caption="lstSpecHeader[0]['SPEC_7']" :visible="(lstSpecHeader[0]['SPEC_7']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC08_NM" :caption="lstSpecHeader[0]['SPEC_8']" :visible="(lstSpecHeader[0]['SPEC_8']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC09_NM" :caption="lstSpecHeader[0]['SPEC_9']" :visible="(lstSpecHeader[0]['SPEC_9']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC10_NM" :caption="lstSpecHeader[0]['SPEC_10']" :visible="(lstSpecHeader[0]['SPEC_10']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC11_NM" :caption="lstSpecHeader[0]['SPEC_11']" :visible="(lstSpecHeader[0]['SPEC_11']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC12_NM" :caption="lstSpecHeader[0]['SPEC_12']" :visible="(lstSpecHeader[0]['SPEC_12']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC13_NM" :caption="lstSpecHeader[0]['SPEC_13']" :visible="(lstSpecHeader[0]['SPEC_13']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC14_NM" :caption="lstSpecHeader[0]['SPEC_14']" :visible="(lstSpecHeader[0]['SPEC_14']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC15_NM" :caption="lstSpecHeader[0]['SPEC_15']" :visible="(lstSpecHeader[0]['SPEC_15']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="CRT_BY" :caption="$t('grd1_crt_by')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="MOD_BY" :caption="$t('grd1_mod_by')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxKeyboardNavigation :edit-on-key-press="true" />
                  <template #check-yn-template="{ data }">
                    <DxCheckBox :value="data.value === 'Y' ? true : false" @valueChanged="valueChanged($event, data.column.dataField, data.data)" />
                  </template>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-show="selectIndex == 1">
        <v-col cols="12">
          <v-card class="pa-2 pt-0">
            <v-row class="pt-2">
              <v-col md="2" class="pt-0">
                <v-select id="lstCompany2" v-model="tab02.Company" :label="$t('company')" :items="dataList.lstCompany2" item-value="PK" item-text="TEXT" @change="onChangeField('lstCompany2')" dense cache-items hide-details />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-radio-group v-model="radSearchPage2" row class="mt-0" dense hide-details>
                  <v-radio :label="$t('product')" value="1"></v-radio>
                  <v-radio :label="$t('material')" value="2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col md="2" class="pt-0">                
                <v-select v-model="tab02.tlg_it_itemgrp_pk" :label="$t('group')" item-value="CODEKEY" item-text="CODEDESC" :items="dataList.lstItemGroup2" @change="onChangeField('lstItemGroup2')" dense hide-details />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-text-field :label="$t('item_search01')" v-model="tab02.item_search01" clearable dense hide-details @keypress.enter="onClickButton('btnSearch02')" />
              </v-col>
              <v-col md="1" class="pt-0">
                <v-checkbox dense hide-details class="mt-0" :color="currentTheme" :label="$t('active')" v-model="tab02.chk_Active" />
              </v-col>
              <v-col class="pt-0" md="1" align="center">
                <i style="color:red; ">{{$t('rows')}} : {{this.dataGrid2.length }} </i>
              </v-col>
              <v-col md="2" class="pt-0" style="text-align:right">
                <v-row justify="end" class="mr-1">                   
                   <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch02')"/>                                                                   
                   <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" :disabled="isProcessing" @onclick="onAddNew2(1)"/>
                   <BaseButton btn_type="icon" icon_type="copy" :btn_text="$t('copy')" :disabled="isProcessing" @onclick="onAddNew2(2)"/>
                   <BaseButton btn_type="icon" icon_type="edit" :btn_text="$t('edit')" :disabled="isProcessing" @onclick="onAddNew2(3)"/>  
                   <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClickButton('btnDelete02')"/>   
                   <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSave02')"/>                                               
                 </v-row>               
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between">
              <v-col md="4" class="pt-0">
               
              </v-col>
            
              <v-col md="2" class="pt-0">
                <BaseInput :label="$t('st_item_price')" v-model="tab02.market_price" number="3" @keyPressEnter="onClickButton('btnSearch02')" />
              </v-col>              
              <v-col md="3" class="pt-0">
                <v-row justify="begin" class="mr-1">                   
                   <BaseButton icon_type="down" :btn_text="$t('set_price')" :disabled="isProcessing" @onclick="onClickButton('btnSetSTPrice')"/>                                                                   
                   <BaseButton icon_type="process" :btn_text="$t('apply_price_to_item')" :disabled="isProcessing" @onclick="onClickButton('btnApllySTPrice')"/>                                               
                 </v-row> 
              </v-col>
               <v-col md="3" class="pt-0">
               
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between" class="pa-0">
              <v-col cols="12" class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdDetail02" key-expr="PK" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid2" :height="limitHeight2" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                  <DxColumn data-field="PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="TLG_IT_ITEMGRP_PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="GRP_NM" :caption="$t('grd1_group')" data-type="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_CODE" :caption="$t('grd1_item_code')" data-type="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('grd1_item_name')" data-type="string" :allow-editing="false" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_IT_STITEM_PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="ST_ITEM_CODE" :caption="$t('grd1_st_item_code')" data-type="string" :visible="isSTItemVisible" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ST_ITEM_NAME" :caption="$t('grd1_st_item_name')" data-type="string" :allow-editing="false" :visible="isSTItemVisible" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_LNAME" :caption="$t('grd1_f_name_01')" data-type="string" :allow-editing="false" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_FNAME" :caption="$t('grd1_f_name_02')" data-type="string" :allow-editing="false" width="220" css-class="cell-align-left" />
                  <DxColumn data-field="UOM" :caption="$t('grd1_uom')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM" :caption="$t('grd1_ref_uom_1')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_2" :caption="$t('grd1_ref_uom_2')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="TAC_ABACCTCODE_PK" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="ACCT_NM" :caption="$t('grd1_wh_acc')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="TAC_ABACCTCODE_PK_EXPENSE" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="EXPENSE_NM" :caption="$t('grd1_expense_acc')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="TAC_ABACCTCODE_PK_REVENUE" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="REVENUE_NM" :caption="$t('grd1_revenue_acc')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="MARKET_PRICE" :caption="$t('st_item_price')" data-type="number" format="###,###,###.###" :allow-editing="true" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="BOM_YN" :caption="$t('grd1_bom_yn')" cell-template="check-yn-template" width="50" css-class="cell-align-center" />
                  <DxColumn data-field="INV_YN" :caption="$t('grd1_inv_yn')" cell-template="check-yn-template" width="50" css-class="cell-align-center" />
                  <DxColumn data-field="HS_CODE" :caption="$t('grd1_hs_code')" data-type="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="USE_YN" :caption="$t('grd1_use_yn')" cell-template="check-yn-template" width="50" css-class="cell-align-center" />

                  <DxColumn data-field="SPEC01_NM" :caption="lstSTSpecHeader[0]['SPEC_1']" :visible="(lstSTSpecHeader[0]['SPEC_1']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC02_NM" :caption="lstSTSpecHeader[0]['SPEC_2']" :visible="(lstSTSpecHeader[0]['SPEC_2']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC03_NM" :caption="lstSTSpecHeader[0]['SPEC_3']" :visible="(lstSTSpecHeader[0]['SPEC_3']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC04_NM" :caption="lstSTSpecHeader[0]['SPEC_4']" :visible="(lstSTSpecHeader[0]['SPEC_4']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC05_NM" :caption="lstSTSpecHeader[0]['SPEC_5']" :visible="(lstSTSpecHeader[0]['SPEC_5']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC06_NM" :caption="lstSTSpecHeader[0]['SPEC_6']" :visible="(lstSTSpecHeader[0]['SPEC_6']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC07_NM" :caption="lstSTSpecHeader[0]['SPEC_7']" :visible="(lstSTSpecHeader[0]['SPEC_7']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC08_NM" :caption="lstSTSpecHeader[0]['SPEC_8']" :visible="(lstSTSpecHeader[0]['SPEC_8']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC09_NM" :caption="lstSTSpecHeader[0]['SPEC_9']" :visible="(lstSTSpecHeader[0]['SPEC_9']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC10_NM" :caption="lstSTSpecHeader[0]['SPEC_10']" :visible="(lstSTSpecHeader[0]['SPEC_10']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC11_NM" :caption="lstSTSpecHeader[0]['SPEC_11']" :visible="(lstSTSpecHeader[0]['SPEC_11']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC12_NM" :caption="lstSTSpecHeader[0]['SPEC_12']" :visible="(lstSTSpecHeader[0]['SPEC_12']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC13_NM" :caption="lstSTSpecHeader[0]['SPEC_13']" :visible="(lstSTSpecHeader[0]['SPEC_13']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC14_NM" :caption="lstSTSpecHeader[0]['SPEC_14']" :visible="(lstSTSpecHeader[0]['SPEC_14']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="SPEC15_NM" :caption="lstSTSpecHeader[0]['SPEC_15']" :visible="(lstSTSpecHeader[0]['SPEC_15']!=null)" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="CRT_BY" :caption="$t('grd1_crt_by')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="MOD_BY" :caption="$t('grd1_mod_by')" data-type="string" :allow-editing="false" width="80" css-class="cell-align-left" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxKeyboardNavigation :edit-on-key-press="true" />
                  <template #check-yn-template="{ data }">
                    <DxCheckBox :value="data.value === 'Y' ? true : false" @valueChanged="valueChanged2($event, data.column.dataField, data.data)" />
                  </template>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
  <alert-dialog ref="alertDialog"></alert-dialog>
  <account-dialog ref="accountDialog" :multiSelectMode="false" @returnAccountInfo="mappingAccount"></account-dialog>
  <item-dialog ref="refItemDialog" :multiSelectMode="false" @returnAccountInfo="mappingAccount"></item-dialog>
  <s-t-item-dialog ref="refSTItemDialog" :multiSelectMode="false" @returnAccountInfo="mappingAccount"></s-t-item-dialog>
  <item-w-o-spec-dialog ref="refItemWOSpecDialog" :multiSelectMode="false" @returnAccountInfo="mappingAccount" />
</v-container>
</template>

<script>
import CellGridTextField from "@/components/table/CellGridTextField";
import CellGridSelect from "@/components/table/CellGridSelect";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import CellGridDatePicker from "@/components/table/CellGridDatePicker";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import CostCenterDialog from "@/components/dialog/CostCenterDialog";
import AccountDialog from "@/components/dialog/AccountDialog";
import ItemDialog from "@/pages/80/40/8040010_pop01";
import STItemDialog from "@/pages/80/40/8040010_pop02";
import ItemWOSpecDialog from "@/pages/80/40/8040010_pop03";
import DxTabs from "devextreme-vue/tabs";
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  components: {
    'account-dialog': AccountDialog,
    DxTabs,
    CellGridTextField,
    CellGridSelect,
    CellGridCheckbox,
    CellGridDatePicker,
    ConfirmDialog,
    AlertDialog,
    CostCenterDialog,
    ItemDialog,
    STItemDialog,
    ItemWOSpecDialog
  },
  data: () => ({
    selectIndex: 0,
    txtMasterPK1: "",
    txtMasterPK2: "",
    dataList: {
      lstCompany1: [],
      lstItemGroup1: [],
      lstUOM1: [],
      lstColumns: [],
      selectList: [],
      selectedDatas: []
    },
    isShowMess: "N",
    isReloadStock: "N",
    make_adjust_yn: "N",
    selectedTab: "1",
    isSTItemVisible: true,
    IsGrpSpec: true,
    tab01: {
      Company: "",
      tlg_it_itemgrp_pk: "",
      item_search01: "",
      chk_Active: true,
      acc_pk: "",
      acc_code: "",
      acc_name: "",
      uom: "",
      colums: "",
      weight_unit: 0,
      market_price: 0,
      temp: 0
    },
    IsGrpSpec2: true,
    tab02: {
      Company: "",
      tlg_it_itemgrp_pk: "",
      item_search01: "",
      chk_Active: true,
      uom: "",
      colums: "",
      market_price: 0,
      listPK: ""
    },

    radSearchPage1: "1",
    radSearchPage2: "1",
    f_firstload: 0,

    dataGrid1: [],
    dataGrid2: [],
    lstSpecHeader: [{
      SPEC_1: "",
      SPEC_2: "",
      SPEC_3: "",
      SPEC_4: "",
      SPEC_5: "",
      SPEC_6: "",
      SPEC_7: "",
      SPEC_8: "",
      SPEC_9: "",
      SPEC_10: "",
      SPEC_11: "",
      SPEC_12: "",
      SPEC_13: "",
      SPEC_14: "",
      SPEC_15: ""
    }],
    lstSTSpecHeader: [{
      SPEC_1: "",
      SPEC_2: "",
      SPEC_3: "",
      SPEC_4: "",
      SPEC_5: "",
      SPEC_6: "",
      SPEC_7: "",
      SPEC_8: "",
      SPEC_9: "",
      SPEC_10: "",
      SPEC_11: "",
      SPEC_12: "",
      SPEC_13: "",
      SPEC_14: "",
      SPEC_15: ""
    }],

    objClick: "",

    btnCopy: {
      disabled: true,
      visibled: true
    },
    gw_btnSave01: {
      disabled: false,
      visibled: true
    },
    gw_btnDelete01: {
      disabled: false,
      visibled: false
    },

    gw_btnFreeItem: {
      disabled: false,
      visibled: true
    },
    gw_btnProcCalcAdjQty: {
      disabled: true,
      visibled: true
    },
    gw_btnShowAllCol: {
      disabled: false,
      visibled: true,
      value: false
    },
    gw_btnMakeAdj: {
      disabled: false,
      visibled: true
    },

    CellDblClickGrdDetail01: {}
  }),
  created() {
    /*TODO: */
    this.SYS_SEL_LIST_COMPANY([this.user.PK]);
    //this.getListSpec([this.tab01.tlg_it_itemgrp_pk]);
    this.LG_LST_8040010(["ITEMGROUP", this.tab01.Company, this.radSearchPage1]);
    this.LG_LST_8040010(["UOM", "", ""]);
    this.LG_LST_8040010(["COLUMNS", "", ""]);
  },

  watch: {
    radSearchPage1(value) {
      this.onChangeField('lstCompany1');
    },
    radSearchPage2(value) {
      this.onChangeField('lstCompany2');
    },
    "this.$refs.refItemDialog.dialogIsShow"(value) {
      if (!value) {
        if (this.$refs.refItemDialog.isRefresh = "Y") {

        }
      }
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
      return this.windowHeight - 300;
    },
    limitHeight2() {
      return this.windowHeight - 260;
    },
    longtabs() {
      return [{
          id: 0,
          text: this.$t("tab_item"),
        },
        {
          id: 1,
          text: this.$t("tab_stitem"),
        },
      ];
    },
  },
  methods: {

    onSelectionChanged({
      selectedRowKeys,
      selectedRowsData
    }) {
      this.selectList = selectedRowKeys;
      this.selectedDatas = selectedRowsData;
    },

    valueChanged(e, colName, data) {
      const newValue = e.value ? 'Y' : 'N'
      this.changeValue(newValue, colName, data.PK, true)
    },

    changeValue(value, key, pk, isModified) {
      this.dataGrid1.map((item, index) => {
        if (item.PK === pk) {
          this.$set(item, key, value)
          if (isModified && item.PK && item._rowstatus != 'i') {
            item._rowstatus = "u";
          }
        }
      })
    },

    valueChanged2(e, colName, data) {
      const newValue = e.value ? 'Y' : 'N'
      this.changeValue2(newValue, colName, data.PK, true)
    },

    changeValue2(value, key, pk, isModified) {
      this.dataGrid2.map((item, index) => {
        if (item.PK === pk) {
          this.$set(item, key, value)
          if (isModified && item.PK && item._rowstatus != 'i') {
            item._rowstatus = "u";
          }
        }
      })
    },

    //-----------------------------------------------------------------------
    onAddNew(value) {
      this.txtMasterPK1 = "";
      if (value == '2' || value == '3') {
        let arrRowSelected = this.$refs.grdDetail01.instance.getSelectedRowsData();
        if (arrRowSelected.length <= 0) {
          this.showNotification("danger", this.$t('you_must_select_one_item_beforce_copy_or_edit!'), "");
          return;
        }
        this.txtMasterPK1 = arrRowSelected[0].PK;
      }

      if (this.IsGrpSpec) {

        this.$refs.refItemDialog.txtCompanyPK = this.tab01.Company;
        this.$refs.refItemDialog.txtItemGroupPK2 = this.tab01.tlg_it_itemgrp_pk;
        this.$refs.refItemDialog.txtItemPK = this.txtMasterPK1;
        this.$refs.refItemDialog.popup_type = value;
        this.$refs.refItemDialog.item_type = this.radSearchPage1;
        this.$refs.refItemDialog.selectedTab = 1;
        this.$refs.refItemDialog.isRefresh = "N";
        this.$refs.refItemDialog.dialogIsShow = true;
      } else {
        this.$refs.refItemWOSpecDialog.txtCompanyPK = this.tab01.Company;
        this.$refs.refItemWOSpecDialog.txtItemGroupPK2 = this.tab01.tlg_it_itemgrp_pk;
        this.$refs.refItemWOSpecDialog.txtItemPK = this.txtMasterPK1;
        this.$refs.refItemWOSpecDialog.popup_type = value;
        this.$refs.refItemWOSpecDialog.item_type = this.radSearchPage1;
        this.$refs.refItemWOSpecDialog.dataList.lstUOM1 = [...this.dataList.lstUOM1];
        this.$refs.refItemWOSpecDialog.isRefresh = "N";
        this.$refs.refItemWOSpecDialog.dialogIsShow = true;
      }
      /*
      txtRefesh_yn.text = '';
      if (cboIsGrpSpec.value == 1) {
          var path = System.RootURL + '/form/ag/ci/agci00251.aspx?company_pk=' + cboCompany.value + '&group_pk=' + cboGroupQuery.value + '&item_type=' + radSearchPage.value + '&item_pk=' + txtMasterPK1.text + '&popup_type=' + value;
          var object = System.OpenModal( path ,1500 , 700 ,  'resizable:yes;status:yes', this);
          //var object = window.showModalDialog(path, this, 'titleb:0;resizable:yes;status:yes;dialogWidth:1200;dialogHeight:700;dialogLeft:10;dialogTop:330;edge:sunken;scroll:yes;unadorned:yes;help:yes');
      }
      else {
          var path = System.RootURL + '/form/ag/ci/agci00255.aspx?company_pk=' + cboCompany.value + '&group_pk=' + cboGroupQuery.value + '&item_type=' + radSearchPage.value + '&item_pk=' + txtMasterPK1.text + '&popup_type=' + value;
          var object = System.OpenModal( path ,1500 , 700 ,  'resizable:yes;status:yes', this);    
      }

      if (txtRefesh_yn.text == 'Y')
          data_agci00250.Call("SELECT");
      }
      */
    },
    //-----------------------------------------------------------------------
    onAddNew2(value) {
      this.txtMasterPK2 = "";
      if (value == '2' || value == '3') {
        let arrRowSelected = this.$refs.grdDetail02.instance.getSelectedRowsData();
        if (arrRowSelected.length <= 0) {
          this.showNotification("danger", this.$t('you_must_select_one_item_beforce_copy_or_edit!'), "");
          return;
        }
        this.txtMasterPK2 = arrRowSelected[0].PK;
      }

      if (this.IsGrpSpec2) {
        this.$refs.refSTItemDialog.dialogIsShow = true;
        this.$refs.refSTItemDialog.txtCompanyPK = this.tab02.Company;
        this.$refs.refSTItemDialog.txtItemGroupPK2 = this.tab02.tlg_it_itemgrp_pk;
        this.$refs.refSTItemDialog.txtItemPK = this.txtMasterPK2;
        this.$refs.refSTItemDialog.popup_type = value;
        this.$refs.refSTItemDialog.item_type = this.radSearchPage2;
        this.$refs.refSTItemDialog.selectedTab = 1;
        this.$refs.refSTItemDialog.isRefresh = "N";
      }
      // this.txtMasterPK2 = "";
      // if (value == '2' || value == '3') {
      //     if (grdSTItem.row > 0) {
      //         this.txtMasterPK2 = grdSTItem.GetGridData(grdSTItem.row, G2_TCO_ITEM_PK);
      //     }
      //     else {
      //         alert('You must select one Item beforce Copy or Edit!');
      //         return;
      //     }
      // }
      // txtRefesh_yn.text = '';
      // var path = System.RootURL + '/form/ag/ci/agci00252.aspx?company_pk=' + cboCompany2.value + '&group_pk=' + cboGroupQuery2.value + '&item_type=' + radSearchPage2.value + '&item_pk=' + txtMasterPK12.text + '&popup_type=' + value;
      // var object = System.OpenModal( path ,1500 , 700 ,  'resizable:yes;status:yes', this);
      // //var object = window.showModalDialog(path, this, 'titleb:0;resizable:yes;status:yes;dialogWidth:1200;dialogHeight:700;dialogLeft:10;dialogTop:330;edge:sunken;scroll:yes;unadorned:yes;help:yes');    
      // if (txtRefesh_yn.text == 'Y')
      //     data_agci00250_2.Call("SELECT");

    },

    onClickButton(obj) {
      switch (obj) {
        case "btnSearch01":
          this.getListSpec([this.tab01.tlg_it_itemgrp_pk]);
          this.DSO_LG_8040010_1("select");
          break;
        case "btnSearch02":
          this.getSTListSpec([this.tab02.tlg_it_itemgrp_pk]);
          this.DSO_LG_8040010_2("select");
          break;
        case "btnSetData":

          let arrRowSelected = this.$refs.grdDetail01.instance.getSelectedRowsData();
          let isUpdate = false;
          if (this.tab01.columns == 1 || this.tab01.columns == 2) {
            let colname = (this.tab01.columns == 1 ? "REF_UOM" : "REF_UOM_2");
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid1.findIndex(
                  e => e.PK == arrRowSelected[i].PK
                );
                this.dataGrid1[arrIdx][colname] = this.tab01.uom;
                this.dataGrid1[arrIdx]._rowstatus = "u";
              }
            }
          } else if (this.tab01.columns == 3 || this.tab01.columns == 4 || this.tab01.columns == 5) {
            if (this.tab01.acc_pk == '') {
              this.showNotification("danger", this.$t('please_choose_account_beforce_set!'), "");
              return;
            }
            let colindex1 = (this.tab01.columns == 3 ? "TAC_ABACCTCODE_PK" : (this.tab01.columns == 4 ? "TAC_ABACCTCODE_PK_EXPENSE" : "TAC_ABACCTCODE_PK_REVENUE"));
            let colindex2 = (this.tab01.columns == 3 ? "ACCT_NM" : (this.tab01.columns == 4 ? "EXPENSE_NM" : "REVENUE_NM"))
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid1.findIndex(
                  e => e.PK == arrRowSelected[i].PK
                );
                this.dataGrid1[arrIdx][colindex1] = this.tab01.acc_pk;
                this.dataGrid1[arrIdx][colindex1] = this.tab01.acc_code + ' - ' + this.tab01.acc_name;
                this.dataGrid1[arrIdx]._rowstatus = "u";
              }
            }
          } else if (this.tab01.columns == 6) {
            let colname = "WEIGHT_UNIT";
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid1.findIndex(
                  e => e.PK == arrRowSelected[i].PK
                );
                this.dataGrid1[arrIdx][colname] = this.tab01.weight_unit;
                this.dataGrid1[arrIdx]._rowstatus = "u";
              }
            }
          } else if (this.tab01.columns == 7) {
            let colname = "TEMP";
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid1.findIndex(
                  e => e.PK == arrRowSelected[i].PK
                );
                this.dataGrid1[arrIdx][colname] = this.tab01.temp;
                this.dataGrid1[arrIdx]._rowstatus = "u";
              }
            }
          } else if (this.tab01.columns == 8) {
            let colname = "MARKET_PRICE";
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid1.findIndex(
                  e => e.PK == arrRowSelected[i].PK
                );
                this.dataGrid1[arrIdx][colname] = this.tab01.market_price;
                this.dataGrid1[arrIdx]._rowstatus = "u";
              }
            }
          }

          break;

        case "btnSave01":
          this.objClick = "btnSave01";
          this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_save'));
          break;

        case "btnDelete01":
          this.objClick = "btnDelete01";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
          break;
        case "btnDelete02":
          this.objClick = "btnDelete02";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
          break;
        case "btnSave02":
          this.objClick = "btnSave02";
          this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_save'));
          break;  

        case "btnSetSTPrice":

          let arrRowSelected1 = this.$refs.grdDetail02.instance.getSelectedRowsData();             
          for (let i = 0; i < arrRowSelected1.length; i++) {
            if (this._hasValue(arrRowSelected1[i].PK)) {
              let arrIdx = this.dataGrid2.findIndex(
                e => e.PK == arrRowSelected1[i].PK
              );
              this.dataGrid2[arrIdx]["MARKET_PRICE"] = this.tab02.market_price;
              this.dataGrid2[arrIdx]._rowstatus = "u";
            }
          }                   
          break;
        case "btnApllySTPrice":
          let listPK = "";
          let arrRowSelected12 = this.$refs.grdDetail02.instance.getSelectedRowsData();             
          for (let i = 0; i < arrRowSelected12.length; i++) {
            if (this._hasValue(arrRowSelected12[i].PK)) {
              if (this._hasValue(listPK))
              {
                listPK = listPK + "," + arrRowSelected12[i].PK;
              }
              else{
                listPK = arrRowSelected12[i].PK;
              }
            }
          }   
          if (this._hasValue(listPK))
          {
            this.tab02.listPK = listPK;
            this.objClick = "btnApplySTPrice";
            this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_allpy_st_item_price_to_item'));
          }
        break;

        case "btnAgreeCF":
          if (this.objClick == "btnSave01") {
            this.DSO_LG_8040010_1('update');
          } else if (this.objClick == "btnDelete01All") {

          } else if (this.objClick == "btnDelete01") {
            let arrRowSelected = this.$refs.grdDetail01.instance.getSelectedRowsData();
            let isUpdate = false;
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid1.findIndex(e => e.PK == arrRowSelected[i].PK);
                this.dataGrid1[arrIdx]._rowstatus = "d";
                isUpdate = true;
              } else {
                let arrIdx = this.dataGrid1.findIndex(e => e.RowID == arrRowSelected[i].RowID);
                this.dataGrid1.splice(arrIdx, 1);
              }
            }
            if (isUpdate) {
              this.DSO_LG_8040010_1();
            }
          } else if (this.objClick == "btnDelete02") {
            let arrRowSelected = this.$refs.grdDetail02.instance.getSelectedRowsData();
            let isUpdate = false;
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid2.findIndex(e => e.PK == arrRowSelected[i].PK);
                this.dataGrid2[arrIdx]._rowstatus = "d";
                isUpdate = true;
              } else {
                let arrIdx = this.dataGrid2.findIndex(e => e.RowID == arrRowSelected[i].RowID);
                this.dataGrid2.splice(arrIdx, 1);
              }
            }
            
            if (isUpdate) {
              this.DSO_LG_8040010_2();
            }
          }
          else if (this.objClick == "btnSave02") {
            this.DSO_LG_8040010_2('update');
          } 
          else if (this.objClick == "btnApplySTPrice") {
            this.onApllySTPrice('update');
          } 
          break;
      }
    },

    onClickLabel(obj) {
      switch (obj) {
        case "ACCOUNT":
          this.objClick = "ACCT_SET";
          this.$refs.accountDialog.dialogIsShow = true;
          break;
      }
    },

    mappingAccount(item) {
      if (item) {

        switch (this.objClick) {
          case "ACCT_SET":
            this.tab01.acc_pk = item.PK;
            this.tab01.acc_code = item.AC_CD;
            this.tab01.acc_name = item.AC_NM;
            break;
          case "ACCT_NM":
            this.$refs.grdDetail01.instance.cellValue(this.CellDblClickGrdDetail01.rowIndex, "TAC_ABACCTCODE_PK", item.PK);
            this.$refs.grdDetail01.instance.cellValue(this.CellDblClickGrdDetail01.rowIndex, "ACCT_NM", item.AC_NM);
            this.$refs.grdDetail01.instance.saveEditData();
            break;
          case "EXPENSE_NM":
            this.$refs.grdDetail01.instance.cellValue(this.CellDblClickGrdDetail01.rowIndex, "TAC_ABACCTCODE_PK_EXPENSE", item.PK);
            this.$refs.grdDetail01.instance.cellValue(this.CellDblClickGrdDetail01.rowIndex, "EXPENSE_NM", item.AC_NM);
            this.$refs.grdDetail01.instance.saveEditData();
            break;
          case "REVENUE_NM":
            this.$refs.grdDetail01.instance.cellValue(this.CellDblClickGrdDetail01.rowIndex, "TAC_ABACCTCODE_PK_REVENUE", item.PK);
            this.$refs.grdDetail01.instance.cellValue(this.CellDblClickGrdDetail01.rowIndex, "REVENUE_NM", item.AC_NM);
            this.$refs.grdDetail01.instance.saveEditData();
            break;
        }
      }
    },

    onClearAccount() {
      this.tab01.acc_pk = "";
      this.tab01.acc_code = "";
      this.tab01.acc_name = "";
    },

    onChangeField(obj) {
      switch (obj) {
        case "lstCompany1":
          this.LG_LST_8040010(["ITEMGROUP", this.tab01.Company, this.radSearchPage1]);
          break;
        case "lstCompany2":
          this.LG_LST_8040010(["ITEMGROUP2", this.tab02.Company, this.radSearchPage2]);
          break;
        case "lstItemGroup1":
          this.getSpectType([this.tab01.tlg_it_itemgrp_pk]);
          //this.getListSpec([this.tab01.tlg_it_itemgrp_pk]);
          break;
        case "lstItemGroup2":
          this.getSpectType2([this.tab02.tlg_it_itemgrp_pk]);         
          break;  
      }
    },

    onCellDblClickGrdDetail01(_event) {
      this.CellDblClickGrdDetail01 = _event;
      switch (_event.column.dataField) {
        case "ACCT_NM":
          this.objClick = "ACCT_NM";
          this.$refs.accountDialog.dialogIsShow = true;
          break;
        case "EXPENSE_NM":
          this.objClick = "EXPENSE_NM";
          this.$refs.accountDialog.dialogIsShow = true;
          break;
        case "REVENUE_NM":
          this.objClick = "REVENUE_NM";
          this.$refs.accountDialog.dialogIsShow = true;
          break;

      }
    },

    initNewRow(e) {
      e.data._rowstatus = "i";
    },

    rowInserted(e) {
      this.dataGrid1.unshift(e.data);
      this.dataGrid1.pop();
    },
    checkUpdated(e) {
      if (!e.cancel) {
        if (e.data._rowstatus !== "i") {
          e.data._rowstatus = "u";
        }
        // if (this.hasValue(e.data.CHECK_QTY)) {
        //   e.data.ADJUST_QTY = e.data.CHECK_QTY - e.data.STOCK_QTY;
        // } else {

        // }
      }
    },

    /*NOTE: */
    async SYS_SEL_LIST_COMPANY(_param) {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY_ALL",
        para: _param,
      };
      this.dataList.lstCompany1 = await this._dsoCall(dso, "select", false);
      this.dataList.lstCompany2 = [...this.dataList.lstCompany1] ;
      if (this.dataList.lstCompany1.length > 0) {
        this.tab01.Company = this.dataList.lstCompany1[0]["PK"];
        this.tab02.Company = this.dataList.lstCompany1[0]["PK"];
      }
      this.onChangeField("lstCompany1");
      this.onChangeField("lstCompany2");
    },
    /*NOTE: */
    async getListSpec(_param) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_8040010_6",
        para: _param,
      };
      this.lstSpecHeader = await this._dsoCall(dso, "select", false);
    },
    /*NOTE: */
    async getSTListSpec(_param) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_8040010_8",
        para: _param,
      };
      this.lstSTSpecHeader = await this._dsoCall(dso, "select", false);
    },
    /*NOTE: */
    async getSpectType(_param) {
      const dso = {
        type: "list",
        selpro: "lg_pro_8040010_1",
        para: _param,
      };
      let res = await this._dsoCall(dso, "select", false);
      if (res.length > 0) {
        this.IsGrpSpec = (res[0]["VALUE1"] == 1);
        this.isSTItemVisible = (res[0]["VALUE2"] == 1);
      } else {
        this.IsGrpSpec = false;
        this.isSTItemVisible = false;
      }
    },

      async getSpectType2(_param) {
      const dso = {
        type: "list",
        selpro: "lg_pro_8040010_1",
        para: _param,
      };
      let res = await this._dsoCall(dso, "select", false);
      if (res.length > 0) {
        this.IsGrpSpec2 = (res[0]["VALUE1"] == 1);       
      } else {
        this.IsGrpSpec2 = false;
      }
    },

    /*NOTE: */
    async DSO_LG_8040010_1(action = "update") {
      this.$refs.grdDetail01.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8040010_1",
        updpro: "LG_UPD_8040010_1",
        para: [this.tab01.Company, this.tab01.tlg_it_itemgrp_pk, this.tab01.item_search01, this.tab01.chk_Active ? "Y" : "N", this.radSearchPage1],
        elname: [
          "_rowstatus",
          "PK", "TLG_IT_ITEMGRP_PK", "GRP_NM", "ITEM_CODE", "ITEM_NAME", "TLG_IT_STITEM_PK", "ST_ITEM_CODE", "ST_ITEM_NAME", "ITEM_LNAME", "ITEM_FNAME", "UOM", "REF_UOM", "REF_UOM_2",
          "WEIGHT_UNIT", "TEMP", "TAC_ABACCTCODE_PK", "ACCT_NM", "TAC_ABACCTCODE_PK_EXPENSE", "EXPENSE_NM", "TAC_ABACCTCODE_PK_REVENUE", "REVENUE_NM", "BOM_YN", "INV_YN", "HS_CODE", "USE_YN",
          "MARKET_PRICE"
        ],
        data: this.dataGrid1
      };
      this.dataGrid1 = await this._dsoCall(dso, action, true);
      this.$refs.grdDetail01.instance.clearSelection();
    },
    async DSO_LG_8040010_2(action = "update") {
      this.$refs.grdDetail02.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8040010_2",
        updpro: "LG_UPD_8040010_2",
        para: [this.tab02.Company, this.tab02.tlg_it_itemgrp_pk, this.tab02.item_search01, this.tab02.chk_Active ? "Y" : "N"],
        elname: [
          "_rowstatus",
          "PK", "TLG_IT_ITEMGRP_PK", "MARKET_PRICE"
        ],
        data: this.dataGrid2
      };
      this.dataGrid2 = await this._dsoCall(dso, action, true);
      this.$refs.grdDetail02.instance.clearSelection();
    },

    onEndEditGrid(e) {},
    onEndEditGrid3(e) {},
    onCellPrepared(e) {
      if (e.rowType == "data" && e.column.dataField == "CHECK_QTY") {}
    },

    onRowPrepared(e) {
      if (e.rowType == "data") {}
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
            this.tab01.tlg_it_itemgrp_pk = this.dataList.lstItemGroup1[0]["CODEKEY"];
            if (this.f_firstload == 0) {
              this.f_firstload = 1;
              this.dataList.lstItemGroup2 = [...this.dataList.lstItemGroup1];
              this.tab02.tlg_it_itemgrp_pk = this.dataList.lstItemGroup2[0]["CODEKEY"];
            }
          }
          this.getSpectType([this.tab01.tlg_it_itemgrp_pk]);
          //this.getListSpec([this.tab01.tlg_it_itemgrp_pk]);
          break;
        case "ITEMGROUP2":
          this.dataList.lstItemGroup2 = await this._dsoCall(dso, "select", false);
          if (this.dataList.lstItemGroup2.length > 0) {
            this.tab02.tlg_it_itemgrp_pk = this.dataList.lstItemGroup2[0]["CODEKEY"];
          }
          this.getSpectType2([this.tab02.tlg_it_itemgrp_pk]);         
          break;
        case "UOM":
          this.dataList.lstUOM1 = await this._dsoCall(dso, "select", false);
          if (this.dataList.lstUOM1.length > 0) {
            this.tab01.uom = this.dataList.lstUOM1[0]["CODEKEY"];
          }
          this.$refs.refItemDialog.dataList.lstUOM1 = [...this.dataList.lstUOM1];
          this.$refs.refSTItemDialog.dataList.lstUOM1 = [...this.dataList.lstUOM1];
          this.$refs.refItemWOSpecDialog.dataList.lstUOM1 = [...this.dataList.lstUOM1];
          break;
        case "COLUMNS":
          this.dataList.lstColumns = await this._dsoCall(dso, "select", false);
          if (this.dataList.lstColumns.length > 0) {
            this.tab01.columns = this.dataList.lstColumns[0]["CODEKEY"];
          }
          break;
      }
    },

    async onApllySTPrice(action) {
      const dso = {
        type: "process",
        updpro: "LG_PRO_8040010_2",
        para: [this.tab02.listPK],
      };
      let row = await this._dsoCall(dso, action, false);
      if (row) {
        this.showNotification("success","Information",this.$t("success"));       
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
