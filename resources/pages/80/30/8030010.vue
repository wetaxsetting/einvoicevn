<template>
	<v-container fluid class="pa-0" v-resize="onResize">
    <v-row lign="center" justify="space-between" no-gutters>
      <v-col md="4" fluid class="pa-1">
				<v-card  class="pa-1" outlined tile>
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="10" class="px-1 py-2">
							<BaseSelect :label="$t('company')" v-model="modelSearch.v_Company" :lstData="lstCompany" item-text="CODEDESC" item-value="CODEKEY"  />		
						</v-col>
						<v-col md="2" class="px-1 py-2">
							<v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('searchGrd1')">
								<v-icon>mdi-magnify</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="12" class="px-1 py-2">
							<v-text-field :label="$t('spec_grp')" v-model="modelSearch.v_SpecGrp" 
										placeholder=" " clearable dense hide-details append-icon=""
										@keypress.enter="onClickButton('searchGrd1')"
										/>
						</v-col>
					</v-row>
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="12" class="pa-1">
							<DxDataGrid column-resizing-mode="widget" ref="grdSearch" 
								:allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
								:height="limitHeightGrd1" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" :no-data-text="$t('no_data', 'common')"
								:show-borders="true" :show-column-lines="true" :show-row-lines="true" @cell-click="onCellClickGrd1" >

								<DxColumn data-field="TCO_COMPANY_PK" :allow-editing="false" :caption="$t('company')" >
									<DxLookup display-expr="CODEDESC" value-expr="CODEKEY" :data-source="lstCompany" />
									<DxRequiredRule />
								</DxColumn>
								<DxColumn data-field="SPECGRP_NM"  :caption="$t('specgrp_nm')"  :allow-editing="false" />
								<DxColumn data-field="SPECGRP_LNM" :caption="$t('specgrp_lnm')" :allow-editing="false" />
								<DxColumn data-field="SPECGRP_FNM" :caption="$t('specgrp_fnm')" :allow-editing="false" />

								<DxSelection mode="single" show-check-boxes-mode="none" />
								<DxPaging :enabled="false" />
							</DxDataGrid>
						</v-col>
					</v-row>
				</v-card>
      </v-col>
      <v-col md="8" fluid class="pa-1">
				<v-row align="center" justify="center">
					<v-col md="12" class="py-0 pb-2">
						<v-card class="pa-0" outlined tile >
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="4" class="px-1 py-2">
									<v-select :label="$t('company')" v-model="modelMaster.TCO_COMPANY_PK" :items="lstCompany" item-value="CODEKEY" item-text="CODEDESC"
												placeholder=" " dense hide-details/>
								</v-col>
								<v-col md="2" class="px-1 py-2">
									<span @click="modelMaster.ACTIVE_YN = (modelMaster.ACTIVE_YN == 'Y' ? 'N' : 'Y')">
										<v-icon >
											{{ modelMaster.ACTIVE_YN == 'Y' ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}
										</v-icon>{{$t('active_yn')}}
									</span>
								</v-col>
								<v-col md="2" class="px-1 py-2">
									
								</v-col>
								<v-col md="4" class="px-1 py-2" align="right">
									<v-btn icon tile color="success" :disabled="isDisable.btnAddNew" @click="onClickButton('btnAddNew')">
										<v-icon>mdi-plus-thick</v-icon>
									</v-btn>
									<v-btn icon tile :color="currentTheme" :disabled="isDisable.btnSave" @click="onClickButton('btnSave')">
										<v-icon>mdi-content-save</v-icon>
									</v-btn>
									<v-btn icon tile color="error" :disabled="isDisable.btnDelete" @click="onClickButton('btnDelete')">
										<v-icon>mdi-delete</v-icon>
									</v-btn>
								</v-col>
							</v-row>
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="6" class="px-1 py-2">
									<v-text-field :label="$t('specgrp_nm')" v-model="modelMaster.SPECGRP_NM"
												placeholder=" " clearable dense hide-details/>
								</v-col>
								<v-col md="6" class="px-1 py-2">
										<v-text-field  :label="$t('specgrp_lnm')" v-model="modelMaster.SPECGRP_LNM" 
												placeholder=" " clearable dense hide-details/>
								</v-col>
							</v-row>
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="6"  class="px-1 py-2">
									<v-text-field :label="$t('specgrp_fnm')" v-model="modelMaster.SPECGRP_FNM" 
											placeholder=" " clearable dense hide-details />
								</v-col>
								<v-col md="6"  class="px-1 py-2">
									<v-text-field :label="$t('description')" v-model="modelMaster.DESCRIPTION" 
											placeholder=" " clearable dense hide-details/>
								</v-col>
							</v-row>
						</v-card>
					</v-col>
				</v-row>
				<v-row align="center" justify="center">
					<v-col md="12" class="py-0 pb-2">
						<v-card class="pa-0" outlined tile >
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="6"  class="pa-0" >
									<v-row align="center" justify="space-between" no-gutters>
										<v-col md="2" class="px-1 py-2" align="right">
											<v-btn icon tile color="blue" @click="onClickLabel('MAP_SPECGRP_NM_1')" dark>
												<v-icon>mdi-information-outline</v-icon>
											</v-btn>
										</v-col>
										<v-col md="10" class="px-1 py-2" align="left">
											<v-text-field :label="$t('map_spec1')"  v-model="modelMaster.MAP_SPECGRP_NM_1" @dblclick="onClickLabel('MAP_SPECGRP_NM_1')" 
														@click:clear="modelMaster.MAP_SPECGRP_PK_1 = ''" :placeholder="$t('doubleclick_to_get_data')" readonly clearable dense hide-details/>
										</v-col>
									</v-row>
								</v-col>
								<v-col md="6"  class="pa-0">
									<v-row align="center" justify="space-between" no-gutters>
										<v-col md="2" class="px-1 py-2" align="right">
											<v-btn icon tile color="blue" @click="onClickLabel('MAP_SPECGRP_NM_2')" dark>
												<v-icon>mdi-information-outline</v-icon>
											</v-btn>
										</v-col>
										<v-col md="10" class="px-1 py-2" align="left">
											<v-text-field :label="$t('map_spec2')"  v-model="modelMaster.MAP_SPECGRP_NM_2" @dblclick="onClickLabel('MAP_SPECGRP_NM_2')" 
														@click:clear="modelMaster.MAP_SPECGRP_PK_2 = ''" :placeholder="$t('doubleclick_to_get_data')" readonly clearable dense hide-details/>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="6"  class="pa-0">
									<v-row align="center" justify="space-between" no-gutters>
										<v-col md="2" class="px-1 py-2" align="right">
											<v-btn icon tile color="blue" @click="onClickLabel('MAP_SPECGRP_NM_3')" dark>
												<v-icon>mdi-information-outline</v-icon>
											</v-btn>
										</v-col>
										<v-col md="10" class="px-1 py-2" align="left">
											<v-text-field :label="$t('map_spec3')"  v-model="modelMaster.MAP_SPECGRP_NM_3" @dblclick="onClickLabel('MAP_SPECGRP_NM_3')" 
														@click:clear="modelMaster.MAP_SPECGRP_PK_3 = ''" :placeholder="$t('doubleclick_to_get_data')" readonly clearable dense hide-details/>
										</v-col>
									</v-row>
								</v-col>
								<v-col md="6"  class="pa-0">
									<v-row align="center" justify="space-between" no-gutters>
										<v-col md="2" class="px-1 py-2" align="right">
											<v-btn icon tile color="blue" @click="onClickLabel('MAP_SPECGRP_NM_4')" dark>
												<v-icon>mdi-information-outline</v-icon>
											</v-btn>
										</v-col>
										<v-col md="10" class="px-1 py-2" align="left">
											<v-text-field :label="$t('map_spec4')"  v-model="modelMaster.MAP_SPECGRP_NM_4" @dblclick="onClickLabel('MAP_SPECGRP_NM_4')" 
														@click:clear="modelMaster.MAP_SPECGRP_PK_4 = ''" :placeholder="$t('doubleclick_to_get_data')" readonly clearable dense hide-details/>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="6"  class="pa-0">
									<v-row align="center" justify="space-between" no-gutters>
										<v-col md="2" class="px-1 py-2" align="right">
											<v-btn icon tile color="red" @click="onClickLabel('SPECGRP_TYPE')" dark>
												<v-icon>mdi-information-outline</v-icon>
											</v-btn>
										</v-col>
										<v-col md="10" class="px-1 py-2" align="left">
											<v-select :label="$t('spec_grp_type')" v-model="modelMaster.SPECGRP_TYPE" :items="lstSpecGrpType" item-value="CODEKEY" item-text="CODEDESC" 
														placeholder=" " dense hide-details />
										</v-col>
									</v-row>
								</v-col>
								<v-col md="6"  class="pa-0">
									<v-row align="center" justify="space-between" no-gutters>
										<v-col md="2" class="px-1 py-2" align="right">
											<v-btn icon tile color="red" @click="onClickLabel('GRP_TYPE')" dark>
												<v-icon>mdi-information-outline</v-icon>
											</v-btn>
										</v-col>
										<v-col md="10" class="px-1 py-2" align="left">
											<v-select :label="$t('grp_type')" v-model="modelMaster.GRP_TYPE" :items="lstGrpType" item-value="CODEKEY" item-text="CODEDESC" 
														placeholder=" " dense hide-details />
										</v-col>
									</v-row>
								</v-col>
							</v-row>
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="3"  class="px-1 py-2" style="text-align:left">
									<span @click="modelMaster.AUTO_SPEC_ID_YN = (modelMaster.AUTO_SPEC_ID_YN == 'Y' ? 'N' : 'Y')">
										<v-icon >
											{{ modelMaster.AUTO_SPEC_ID_YN == 'Y' ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}
										</v-icon>{{$t('auto_specid_yn')}}
									</span>
								</v-col>
								<v-col md="3"  class="px-1 py-2" style="text-align:left;">
									<v-text-field clearable dense hide-details :label="$t('spec_length')" v-model="modelMaster.SPEC_ID_LENGTH" type="number"/>
								</v-col>
								<v-col md="2"  class="px-1 py-2">
									
								</v-col>
								<v-col md="4"  class="px-1 py-2">
									<span @click="modelMaster.AUTO_GET_VALUE_YN = (modelMaster.AUTO_GET_VALUE_YN == 'Y' ? 'N' : 'Y')">
										<v-icon >
											{{ modelMaster.AUTO_GET_VALUE_YN == 'Y' ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}
										</v-icon>{{$t('auto_get_value_yn')}}
									</span>
								</v-col>
							</v-row>
						</v-card>
					</v-col>
				</v-row>
				<v-row align="center" justify="center">
					<v-col md="12" class="py-0 pb-2">
						<v-card class="pa-0" outlined tile >
							<v-row align="center" justify="space-between" no-gutters>
								<v-col md="6" class="px-1 py-2">
									<v-select :label="$t('input_type')" v-model="modelMaster.IN_TYPE" :items="lstInputType" item-value="CODEKEY" item-text="CODEDESC" 
											placeholder=" " dense hide-details />
								</v-col>
								<v-col md="6" class="pa-0">
									<v-row align="center" justify="space-between" no-gutters>
										<v-col md="2" class="px-1 py-2" align="right">
											<v-btn icon tile color="blue" @click="onClickLabel('PARENT_SPECGRP_NM')" dark>
												<v-icon>mdi-information-outline</v-icon>
											</v-btn>
										</v-col>
										<v-col md="10" class="px-1 py-2" align="left">
											<v-text-field :label="$t('parent_code')"  v-model="modelMaster.PARENT_SPECGRP_NM" @dblclick="onClickLabel('PARENT_SPECGRP_NM')" 
														@click:clear="modelMaster.PARENT_SPECGRP_PK = ''" :placeholder="$t('doubleclick_to_get_data')" readonly clearable dense hide-details/>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
							<v-row align="center" justify="space-between" no-gutters >
								<v-col md="12" class="px-1 py-2" >
									<v-textarea :label="$t('sql_text')" v-model="modelMaster.SQL_TEXT" :height="this.windowHeight-535" rows="3"
													placeholder=" " clearable outlined  dense hide-details />
								</v-col>
							</v-row>
						</v-card>
					</v-col>
				</v-row>
      </v-col>
    </v-row>
		<spec-group-dialog ref="specGroup"  @returnData="returnSpecGroupData"></spec-group-dialog>
		<confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
		<alert-dialog ref="alertDialog"></alert-dialog>
  </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import CellGridSelect from '@/components/table/CellGridSelect'
import CellGridCheckbox from '@/components/table/CellGridCheckbox'
import CellGridDatePicker from '@/components/table/CellGridDatePicker'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import SpecGroupDialog from '@/components/dialog/SpecGroupDialog'
import AlertDialog from '@/components/dialog/AlertDialog'
export default{
	layout: "default",
	middleware: "user",
	components: { CellGridTextField, CellGridSelect, CellGridCheckbox, CellGridDatePicker, ConfirmDialog, SpecGroupDialog, AlertDialog },
	data: () => ({
		dialogSpecGroup: {isShow: false},
		lstCompany: [],
		lstSpecGrpType: [],
		lstGrpType: [],
		lstInputType: [],
		modelSearch: { v_Company : "", v_SpecGrp: "", v_SpecGrp_pk: ""},
		modelMaster:{ ACTION: "", PK: "", TCO_COMPANY_PK: "", SPECGRP_NM: "", SPECGRP_LNM: "", SPECGRP_FNM: "", ACTIVE_YN: 'Y', DESCRIPTION: "",
									MAP_SPECGRP_NM_1: "", MAP_SPECGRP_NM_2: "", MAP_SPECGRP_NM_3: "", MAP_SPECGRP_NM_4: "", SPECGRP_TYPE: "", GRP_TYPE: "",
									MAP_SPECGRP_PK_1: "", MAP_SPECGRP_PK_2: "", MAP_SPECGRP_PK_3: "", MAP_SPECGRP_PK_4: "", 
									AUTO_SPEC_ID_YN: 'N', SPEC_ID_LENGTH: 0, AUTO_GET_VALUE_YN: 'N',
									IN_TYPE: "", PARENT_SPECGRP_NM: "", PARENT_SPECGRP_PK: "", SQL_TEXT: ""},
		dataGrid1: [],
		objClick: "",
		isDisable: {btnAddNew: false, btnSave: false, btnDelete: true},
		itemSpecGrpDialog: [],
	}),
	created() {
		/*TODO: */

  },
	computed: {
    user() { return this.$store.getters["auth/user"] },
		limitHeightGrd1() { return this.windowHeight-210 },
	},
	mounted() {
		/*TODO: */
		this.DSO_LST_8030010( ["COMPANY",""]);
		this.DSO_LST_8030010( ["SPECGRP_TYPE",""]);
		this.DSO_LST_8030010( ["INPUT_TYPE",""]);
		this.DSO_LST_8030010( ["GRP_TYPE",""]);
	},
	methods: {
		/*NOTE: */
		resetInputData(){
			this.isDisable.btnDelete = true;
			this.modelMaster = { ACTION: "", PK: "", TCO_COMPANY_PK: "", SPECGRP_NM: "", SPECGRP_LNM: "", SPECGRP_FNM: "", ACTIVE_YN: 'Y', DESCRIPTION: "",
									IN_TYPE: "", SQL_TEXT: "", PARENT_SPECGRP_PK: "", PARENT_SPECGRP_NM: "", SPECGRP_TYPE: "", MAP_SPECGRP_PK_1: "", MAP_SPECGRP_NM_1: "",
									MAP_SPECGRP_PK_2: "", MAP_SPECGRP_NM_2: "", MAP_SPECGRP_PK_3: "", MAP_SPECGRP_NM_3: "", MAP_SPECGRP_PK_4: "", MAP_SPECGRP_NM_4: "",
									GRP_TYPE: "",  AUTO_GET_VALUE_YN: 'N', AUTO_SPEC_ID_YN: 'N', SPEC_ID_LENGTH: 0
			};
		},
		returnSpecGroupData(_obj){
			if(_obj){
				switch(this.objClick){
					case 'MAP_SPECGRP_NM_1':
							this.modelMaster.MAP_SPECGRP_PK_1 = _obj.PK;
							this.modelMaster.MAP_SPECGRP_NM_1 = _obj.SPECGRP_NM;
						break;
					case 'MAP_SPECGRP_NM_2':
							this.modelMaster.MAP_SPECGRP_PK_2 = _obj.PK;
							this.modelMaster.MAP_SPECGRP_NM_2 = _obj.SPECGRP_NM;
						break;
					case 'MAP_SPECGRP_NM_3':
							this.modelMaster.MAP_SPECGRP_PK_3 = _obj.PK;
							this.modelMaster.MAP_SPECGRP_NM_3 = _obj.SPECGRP_NM;
						break;
					case 'MAP_SPECGRP_NM_4':
							this.modelMaster.MAP_SPECGRP_PK_4 = _obj.PK;
							this.modelMaster.MAP_SPECGRP_NM_4 = _obj.SPECGRP_NM;
						break;
					case 'PARENT_SPECGRP_NM':
							this.modelMaster.PARENT_SPECGRP_PK = _obj.PK;
							this.modelMaster.PARENT_SPECGRP_NM = _obj.SPECGRP_NM;
						break;
				}
			} 
		},
		/*NOTE: */
		onClickButton(obj){
			switch(obj){
				case 'searchGrd1':
						this.$refs.grdSearch.instance.deselectAll();
						this.DSO_GRD_8030010([ this.modelSearch.v_Company, this.modelSearch.v_SpecGrp]);
						
					break;
				case 'btnAddNew':
						this.resetInputData();
						this.modelMaster.ACTION = "INSERT";
					break;
				case 'btnSave':
					this.objClick = "btnSave";
					this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
					
				break;
				case 'btnDelete':
					this.objClick = "btnDelete";
					this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
					
				break;
				case 'btnAgreeCF':
					if(this.objClick == "btnSave"){
						if(this.modelMaster.PK == ""){
							this.modelMaster._rowstatus = "INSERT";
						}else{
							this.modelMaster._rowstatus = "UPDATE";
						}
						this.LG_DSO_8030010_1("update");
					}else if(this.objClick == "btnDelete"){
						this.modelMaster._rowstatus = "DELETE";
						this.LG_DSO_8030010_1("update");
					}
					break;
			}
		},
		onClickLabel(obj){
			switch(obj){
				case 'MAP_SPECGRP_NM_1':
						this.objClick = "MAP_SPECGRP_NM_1";
						this.$refs.specGroup.dialogIsShow = true;
					break;
				case 'MAP_SPECGRP_NM_2':
						this.objClick = "MAP_SPECGRP_NM_2";
						this.$refs.specGroup.dialogIsShow = true;
					break;
				case 'MAP_SPECGRP_NM_3':
						this.objClick = "MAP_SPECGRP_NM_3";
						this.$refs.specGroup.dialogIsShow = true;
					break;
				case 'MAP_SPECGRP_NM_4':
						this.objClick = "MAP_SPECGRP_NM_4";
						this.$refs.specGroup.dialogIsShow = true;
					break;
				case 'MAP_SPECGRP_NM_4':
						this.objClick = "MAP_SPECGRP_NM_4";
						this.$refs.specGroup.dialogIsShow = true;
					break;
				case 'PARENT_SPECGRP_NM':
						this.objClick = "PARENT_SPECGRP_NM";
						this.$refs.specGroup.dialogIsShow = true;
					break;
			}
		},
		/*NOTE: */
		async DSO_GRD_8030010(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_8030010',
        para: _param
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
		},
		/*NOTE: */
		async LG_DSO_8030010_1(action= 'update') {
			const dso = {
        type: "control",
        selpro: "LG_SEL_8030010_1",
        updpro: "LG_UPD_8030010_1",
        para: [this.modelMaster.PK],
        elname: ["_rowstatus", "PK", "TCO_COMPANY_PK", "SPECGRP_NM", "SPECGRP_LNM",
									"SPECGRP_FNM", "ACTIVE_YN", "DESCRIPTION", "IN_TYPE", "SQL_TEXT", 
									"PARENT_SPECGRP_PK", "PARENT_SPECGRP_NM", "SPECGRP_TYPE", "MAP_SPECGRP_PK_1", "MAP_SPECGRP_NM_1", 
									"MAP_SPECGRP_PK_2", "MAP_SPECGRP_NM_2", "MAP_SPECGRP_PK_3", "MAP_SPECGRP_NM_3", "MAP_SPECGRP_PK_4", 
									"MAP_SPECGRP_NM_4", "GRP_TYPE", "AUTO_GET_VALUE_YN", "AUTO_SPEC_ID_YN", "SPEC_ID_LENGTH"],
        data: this.modelMaster
      };
      const row = await this._dsoCall(dso, action, false);
      
      if (row) {
        if(this.modelMaster._rowstatus == "DELETE"){
          this.resetInputData();
        }else{
					this.modelMaster = { ...row };
        }
      }
		},
		/*NOTE: */
		async DSO_LST_8030010(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_8030010',
        para: _param
			}
			switch(_param[0]){
        case "COMPANY":
					this.lstCompany = await this._dsoCall(dso, 'select', false);
				break;
				case 'INPUT_TYPE':
					this.lstInputType = await this._dsoCall(dso, 'select', false);
				break;
				case 'SPECGRP_TYPE':
					this.lstSpecGrpType = await this._dsoCall(dso, 'select', false);
				break;
				case 'GRP_TYPE':
					this.lstGrpType = await this._dsoCall(dso, 'select', false);
				break;
      }
		},
		/*NOTE: */
		onCellClickGrd1(_event) {
			if(_event.data){
				this.modelMaster.PK = _event.data.PK;
				this.isDisable.btnDelete = false;
				this.LG_DSO_8030010_1("select");
			}
			
		},
	}
}
</script>
