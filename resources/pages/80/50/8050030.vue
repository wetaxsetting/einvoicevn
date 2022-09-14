<template>
	<v-container fluid class="px-0 pt-0">
		<v-row no-gutters>
			<v-col cols="12">
				<v-card outlined tile>
					<v-container fluid class="py-0">
						<v-row align="center" justify="space-between">
              <v-col md="4" >
								<v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :items="lstCompany" v-model="mCompany" label="Company"></v-select>
              </v-col>
              <v-col md="3" >
              </v-col>
              <v-col md="5" class="text-right">
                <v-row justify="end" class="mr-1"> 
                                  <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('searchGrd1')"/>                                   
                                  <BaseButton icon_type="add_new" :btn_text="$t('btn_add')" :disabled="isProcessing" @onclick="onClickButton('addNew1')"/>                                                                                
                                  <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSave1')"/>
                                  <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"  @onclick="onClickButton('btnDelete1')"/>
                </v-row>    
              </v-col>
            </v-row>
					</v-container>
				</v-card>
			</v-col>
		</v-row>
		<v-row align="center" justify="center">
      <v-col cols="12" class="py-0">
        <v-card outlined tile v-resize="onResize">
           <DataGridView
                    column-resizing-mode="widget"
                    ref="grdDetail01"                   
                    sel_procedure="LG_SEL_8050030_NOCACHE"
                    upd_procedure="LG_UPD_8050030"
                    select_mode="MultipleHideBox"
                    :auto_load="false"
                    :max_height="limitHeightGrd1"
                    @cellClick="onCellCickGrdDetail01" 
                    :filter_paras="[
                          this.mCompany                          
                      ]"                   
                    :update_paras="[
                        'PK',
                        'TCO_COMPANY_PK',
                        'STRG_ID',
                        'STRG_NAME',
                        'STRG_LNAME',
                        'STRG_FNAME',
                        'USE_YN',
                        'STORAGE_TYPE',
                        'ADDR_NM',
                        'ADDR_LNM',
                        'ADDR_FNM',
                        'PHONE_NO',
                        'FAX_NO',
                        'DESCRIPTION',
                        'ST_DATE',
                        'END_DATE',
                        'ROW_NO',
                        'COLUMN_NO',
                        'FLOOR_NO'                      
                      ]"
                  :header="[  
                    {dataField: 'TCO_COMPANY_PK',caption: this.$t('company'), allowEditing: true,
                      lookup: { dataSource: this.lstCompany, displayExpr:'TEXT', valueExpr: 'PK' } 
                    }, 
                                       
                    {dataField: 'STRG_ID',caption: this.$t('storage_id'), allowEditing: true },   
                    {dataField: 'STRG_NAME',caption: this.$t('storage_nm'), allowEditing: true }, 
                    {dataField: 'USE_YN',caption: this.$t('active'), allowEditing: true, dataType:'checkbox'},  
                    {dataField: 'STORAGE_TYPE',caption: this.$t('storage_type'), allowEditing: true,
                      lookup: { dataSource: this.lstStorageType, displayExpr:'CODEDESC', valueExpr: 'CODEKEY' } 
                     }, 
                    {dataField: 'ADDR_NM',caption: this.$t('full_addr'), allowEditing: true },                                                         
                    {dataField: 'ADDR_LNM',caption: this.$t('addr_lnm'), allowEditing: true }, 
                    {dataField: 'ADDR_FNM',caption: this.$t('addr_fnm'), allowEditing: true }, 
                    {dataField: 'PHONE_NO',caption: this.$t('phone_no'), allowEditing: true }, 
                    {dataField: 'FAX_NO',caption: this.$t('fax_no'), allowEditing: true },
                    {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: true },  
                    {dataField: 'ST_DATE',caption: this.$t('st_date'), allowEditing: true,     dataType:'date' },                                                                      
                    {dataField: 'END_DATE',caption: this.$t('end_date'), allowEditing: true,     dataType:'date' }  ,

                    {dataField: 'ROW_NO',caption: this.$t('row_no'), allowEditing: true },                      
                    {dataField: 'COLUMN_NO',caption: this.$t('column_no'), allowEditing: true },                      
                    {dataField: 'FLOOR_NO',caption: this.$t('floor_no'), allowEditing: true }                                                           
                  ]"           
                  />
        </v-card>
      </v-col>
    </v-row>
		<v-row no-gutters>
			<v-col cols="12">
				<v-card outlined tile>
					<v-container fluid class="py-0">
						<v-row align="center" justify="space-between">
              <v-col md="4">
								<v-text-field clearable dense hide-details outlined :label="$t('warehouse')" v-model="WHSearch"></v-text-field>
              </v-col>
              <v-col md="3">
								<v-checkbox dense hide-details class="mt-0" :color="currentTheme" :label="$t('use_yn')" v-model="use_yn"></v-checkbox>
              </v-col>
              <v-col md="5" >
                <v-row justify="end" class="mr-1"> 
                                  <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('searchGrd2')"/>                                   
                                  <BaseButton icon_type="add_new" :btn_text="$t('btn_add')" :disabled="isProcessing" @onclick="onClickButton('addNew2')"/>                                                                                
                                  <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSave2')"/>
                                  <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"  @onclick="onClickButton('btnDelete2')"/>
                </v-row>  
						
              </v-col>
            </v-row>
					</v-container>
				</v-card>
			</v-col>
		</v-row>
		<v-row align="center" justify="center">
      <v-col cols="12" class="py-0">
        <v-card outlined tile >
            <DataGridView
                    column-resizing-mode="widget"
                    ref="grdDetail02"                   
                    sel_procedure="LG_SEL_8050030_1_NOCACHE"
                    upd_procedure="LG_UPD_8050030_1"
                    select_mode="MultipleHideBox"
                    :auto_load="false"
                    :max_height="limitHeightGrd2"
                    
                    :filter_paras="[
                          this.Storage_PK, this.WHSearch, this.use_yn ? 'Y' : 'N'          
                      ]"                   
                    :update_paras="[
                        'L_LEVEL',
                        'PK',
                        'TLG_PR_FACTORY_PK',
                        'TLG_IN_STORAGE_PK',
                        'SOURCE_WH_ID',
                        'SOURCE_WH_PK',
                        'WH_ID',
                        'WH_NAME',
                        'PARENT_CODE',
                        'PL_PK',
                        'PL_NAME',
                        'WH_TYPE',
                        'MATERIAL_YN',
                        'PRODUCT_YN',
                        'SUB_MAT_YN',
                        'ACC_YN',
                        'CHECK_QTY_YN',
                        'CHECK_REF_QTY_YN',
                        'PRICE_YN',
                        'ROW_LOC',
                        'COL_LOC',
                        'NUM_OF_ROW',
                        'NUM_OF_COL',
                        'DESCRIPTION',
                        'USE_YN',
                        'TLG_PO_DEPT_PK',
                        'DEPT_NAME',
                        'TCO_BUSPARTNER_PK',
                        'PARTNER_NAME',
                        'PARENT_PK',
                        'WH_LNAME',
                        'WH_FNAME',
                        'BC_CHECK_YN',
                        'LOGISTIC_YN',
                        'MOLD_YN',
                        'TCO_BUSPLACE_PK'                        
                      ]"
                  :header="[  
                    {dataField: 'L_LEVEL',caption: this.$t('level'), allowEditing: false }, 
                    {dataField: 'TLG_PR_FACTORY_PK',caption: this.$t('factory'), allowEditing: true,
                      lookup: { dataSource: this.lstFactory, displayExpr:'CODEDESC', valueExpr: 'CODEKEY' } 
                    },
                    {dataField: 'TLG_IN_STORAGE_PK',caption: this.$t('storage'), allowEditing: true,
                      lookup: { dataSource: this.lstStorage, displayExpr:'CODEDESC', valueExpr: 'CODEKEY' } 
                    }, 
                                       
                    {dataField: 'SOURCE_WH_ID',caption: this.$t('source_wh_id'), allowEditing: true },   
                    {dataField: 'WH_ID',caption: this.$t('wh_id'), allowEditing: true }, 
                    {dataField: 'WH_NAME',caption: this.$t('wh_nm'), allowEditing: true },
                    {dataField: 'GET_PRICE_FROM',caption: this.$t('get_price_from'), allowEditing: true },
                    {dataField: 'PL_NAME',caption: this.$t('pl'), allowEditing: true },
                  
                    {dataField: 'WH_TYPE',caption: this.$t('wh_type'), allowEditing: true,
                      lookup: { dataSource: this.lstWHType, displayExpr:'NAME', valueExpr: 'CODE' } 
                     }, 

                    {dataField: 'MATERIAL_YN',caption: this.$t('mat_yn'), allowEditing: true, dataType:'checkbox'},  
                    {dataField: 'PRODUCT_YN',caption: this.$t('prod_yn'), allowEditing: true, dataType:'checkbox'}, 
                    {dataField: 'SUB_MAT_YN',caption: this.$t('submat_yn'), allowEditing: true, dataType:'checkbox'}, 
                    {dataField: 'ACC_YN',caption: this.$t('acc_yn'), allowEditing: true, dataType:'checkbox'}, 
                    {dataField: 'CHECK_QTY_YN',caption: this.$t('qty_yn'), allowEditing: true, dataType:'checkbox'}, 
                    {dataField: 'CHECK_REF_QTY_YN',caption: this.$t('ref_qty_yn'), allowEditing: true, dataType:'checkbox'}, 
                    {dataField: 'PRICE_YN',caption: this.$t('price_yn'), allowEditing: true, dataType:'checkbox'}, 

                    {dataField: 'ROW_LOC',caption: this.$t('row_loc'), allowEditing: true },                                                         
                    {dataField: 'COL_LOC',caption: this.$t('column_loc'), allowEditing: true }, 
                    {dataField: 'NUM_OF_ROW',caption: this.$t('num_row'), allowEditing: true }, 
                    {dataField: 'NUM_OF_COL',caption: this.$t('num_col'), allowEditing: true },                   
                    {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: true },  

                    {dataField: 'USE_YN',caption: this.$t('use_yn'), allowEditing: true, dataType:'checkbox'},
                    {dataField: 'DEPT_NAME',caption: this.$t('dept_name'), allowEditing: true },                      
                    {dataField: 'PARTNER_NAME',caption: this.$t('partner_name'), allowEditing: true },                      
                    {dataField: 'WH_LNAME',caption: this.$t('lname'), allowEditing: true } ,    
                    {dataField: 'WH_FNAME',caption: this.$t('fname'), allowEditing: true } ,    
                    {dataField: 'BC_CHECK_YN',caption: this.$t('barcode_yn'), allowEditing: true, dataType:'checkbox'},
                    {dataField: 'LOGISTIC_YN',caption: this.$t('logistic_yn'), allowEditing: true, dataType:'checkbox'},
                    {dataField: 'MOLD_YN',caption: this.$t('mold_yn'), allowEditing: true, dataType:'checkbox'},
                    {dataField: 'TCO_BUSPLACE_PK',caption: this.$t('Biz_Place'), allowEditing: true,
                      lookup: { dataSource: this.bizPlaceList, displayExpr:'TEXT', valueExpr: 'PK' } , 
                      width: '300'
                     }, 
                  
                  ]"           
                  />				
        </v-card>
      </v-col>
    </v-row>
	</v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import CellGridSelect from '@/components/table/CellGridSelect'
import CellGridCheckbox from '@/components/table/CellGridCheckbox'
import CellGridDatePicker from '@/components/table/CellGridDatePicker'
export default {
	layout: "default",
	middleware: "user",
	components: { CellGridTextField, CellGridSelect, CellGridCheckbox, CellGridDatePicker },
	data: () => ({
		mCompany: "",
		lstCompany: [],
    lstStorageType: [],
    lstWHType: [],
    lstFactory: [],
    lstStorage: [],
		use_yn : true,
    Storage_PK: "",
    WHSearch: "",
		dataGrid1: [],
    dataGrid2: [],
    bizPlaceList:[],
    
	}),
	async created() {
    this.SYS_SEL_LIST_COMPANY([this.user.PK]); 
    this.lstStorageType = [{CODEKEY: '', CODEDESC: this.$t('')}, {CODEKEY: '1', CODEDESC: this.$t('so')}, {CODEKEY: '2', CODEDESC: this.$t('wh_loc')}, {CODEKEY: '13', CODEDESC: this.$t('mold_production')}];
    
  },
  watch: {
      mCompany(val) {
        if (val) {
          this.getCommonCode("STORAGE_TYPE");
          this.LG_LST_8050030(["FACTORY", val]);
          this.LG_LST_8050030(["STORAGE", val]);
          this.GetBizPlaceList(val);
        }
      }
  },
	computed: {
    user() { return this.$store.getters["auth/user"] },
		limitHeightGrd1() { return this.windowHeight/3 },
		limitHeightGrd2() { return this.windowHeight/3 }
	},
	mounted() {
    /*TODO: */
    //this.LG_LST_8050030( ["COMPANY",""]);
    
  },
	methods: {
    onCellCickGrdDetail01(_event){
    
      this.Storage_PK = _event.data.PK;
      if(this._hasValue(this.Storage_PK) ){
        if (_event.data._rowstatus == 'i')
        {
          return;
        }
        this.$refs.grdDetail02.loadData() ;
      }
    },
		onClickButton(obj) {
      switch (obj) {
        case "searchGrd1":
            this.$refs.grdDetail01.loadData() ;
          break;        
        case "addNew1":
          let insertRow = {};                     
          insertRow.PK = this._uniqueID();         
          insertRow.TCO_COMPANY_PK = this.mCompany ; 
         
          this.$refs.grdDetail01.addRowStruct(insertRow); 
          break;
        case "btnSave1":       
          this.$refs.grdDetail01.saveData();   
          break;
        case "btnDelete1":
            this.$refs.grdDetail01.deleteRows();  
          break;
        case "searchGrd2":
            this.$refs.grdDetail02.loadData() ;            
          break;  
        case "addNew2":
          let insertRow2 = {};                     
          insertRow2.PK = this._uniqueID();         
          insertRow2.TLG_IN_STORAGE_PK =  this.Storage_PK ;
          
          this.$refs.grdDetail02.addRowStruct(insertRow2); 
          break;
        case "btnSave2":       
          this.$refs.grdDetail02.saveData();   
          break;
        case "btnDelete2":
            this.$refs.grdDetail02.deleteRows();  
          break;  
      }
		},
     async getCommonCode(obj) {
        var Param = [];
        switch (obj) {
          case "STORAGE_TYPE":
            this.Param = "LGIN0210";
            break;  

        }
        const result = await this._getCommonCode(this.Param, this.mCompany);
        var para = {
          CODE: "",
          NAME: ""
        };
        //console.log(result)
        if (result.length > 0) {
          switch (obj) {           
            case "STORAGE_TYPE":              
              result.unshift(para);
              this.lstWHType = result;                          
            break;
          }
        }
         this.$refs.grdDetail01.reRender() ; 
      },
    async GetBizPlaceList(val)
    {
          const dso_bizplace_list = {
                        type: 'list',
                        selpro: 'SYS_SEL_BIZ_PLACE',
                        para: [val]
                          }
    this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
    },
    async SYS_SEL_LIST_COMPANY(_param) {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: _param,
      };
      this.lstCompany = await this._dsoCall(dso, "select", false);
      if (this.lstCompany.length > 0) {
        this.mCompany = this.lstCompany[0]["PK"];        
      }
      this.$refs.grdDetail01.reRender() ;
     // this.onChangeField("lstCompany1");
    },
    async LG_LST_8050030(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_8050030",
        para: _param
      };
     
      switch (_param[0]) {
        case "COMPANY":
            this.lstCompany = await this._dsoCall(dso, "select", false);
          break;
        case "FACTORY":
            this.lstFactory = await this._dsoCall(dso, "select", false);
          break;
        case "STORAGE":
            this.lstStorage = await this._dsoCall(dso, "select", false);
          break;                
      }
      this.$refs.grdDetail01.reRender() ;
    },
		checkUpdatedItem(data) {
      console.log('checkUpdatedItem')
      console.log(data)
      if(!data.cancel) {
        data.key.isModified = true
      }
		},
		changeValue(value, key, idx, isModified) {
      this.userList.map((item, index) => {
        if(index === idx) {
          this.$set(item, key, value)
          item.isModified = isModified
        }
      })
    },

	},
}
</script>
