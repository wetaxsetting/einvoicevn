<template>
	<v-container fluid class="pa-0" v-resize="onResize">
    <v-row lign="center" justify="space-between" no-gutters>
			<v-col :md="isShowLeft ? 4 : 0" class="pa-1" v-show="isShowLeft">
				<v-card  class="pa-0" outlined tile>
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="10" class="px-1 py-2">
							<BaseSelect :label="$t('company')" v-model="modelSearch.COMPANY" :lstData="lstCompany" item-text="CODEDESC" item-value="CODEKEY"  />			
						</v-col>
						<v-col md="2" class="px-1 py-2">
							<v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSearch')">
								<v-icon>mdi-magnify</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row align="center" justify="space-between" no-gutters>						
						<v-col md="12" class="px-1 py-2">
							<BaseSelect :label="$t('specgrp_type')" v-model="modelSearch.SPECGRP_TYPE" :lstData="lstSpecGrpType" item-text="CODEDESC" item-value="CODEKEY"  />	
						</v-col>
					</v-row>
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="12" class="px-1 py-2">
							<v-text-field :label="$t('specgrp_nm')" v-model="modelSearch.SPECGRP_NM" 
										placeholder=" " clearable dense hide-details/>
						</v-col>
					</v-row>
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="12" class="pa-1">
							<DxDataGrid column-resizing-mode="widget" ref="refGrdSearch" 
								:allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdSearch" 
								:height="limitHeightGrdSearh" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" :no-data-text="$t('no_data', 'common')"
								:show-borders="true" :show-column-lines="true" :show-row-lines="true" @cell-click="onCellClickGrd1" >
								<DxColumn data-field="PK" :allow-editing="false" :visible="false" />
								<DxColumn data-field="TCO_COMPANY_PK" :allow-editing="false" :caption="$t('company')" >
									<DxLookup display-expr="CODEDESC" value-expr="CODEKEY" :data-source="lstCompany" />
									<DxRequiredRule />
								</DxColumn>
								<DxColumn data-field="SPECGRP_NM"  :caption="$t('specgrp_nm')"  :allow-editing="false" />
								<DxColumn data-field="SPECGRP_LNM" :caption="$t('specgrp_lnm')" :allow-editing="false" :visible="false"/>
								<DxColumn data-field="SPECGRP_FNM" :caption="$t('specgrp_fnm')" :allow-editing="false" :visible="false"/>
								<DxColumn data-field="IN_TYPE"  :caption="$t('in_type')"  :allow-editing="false" :visible="false"/>

								<DxSelection mode="single" show-check-boxes-mode="none" />
								<DxPaging :enabled="false" />
							</DxDataGrid>
						</v-col>
					</v-row>
				</v-card>
      </v-col>
			<v-col :md="isShowLeft ? 8 : 12" class="pa-1">
				<v-card class="pa-0" outlined tile >
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="1" class="px-1 py-2" align="left">
							<v-btn icon tile color="success" @click="isShowLeft = !isShowLeft" >
								<v-icon>{{ isShowLeft == true ? 'mdi-menu-left' : 'mdi-menu-right' }} </v-icon>
							</v-btn>
						</v-col>
						<v-col md="5" class="px-1 py-2">
							<v-text-field :label="$t('spec_code')" v-model="modelSearch.SPEC_CODE" placeholder=" " dense hide-details  />
						</v-col>
						<v-col md="2" class="px-1 py-2">
							<span @click="modelSearch.ACTIVE_YN = (modelSearch.ACTIVE_YN == 'Y' ? 'N' : 'Y')">
								<v-icon >
									{{ modelSearch.ACTIVE_YN == 'Y' ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}
								</v-icon>{{$t('active_yn')}}
							</span>
						</v-col>
						<v-col class="px-1 py-2" md="1" align="center">
							<v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnGetData')">
								<v-icon>mdi-pen</v-icon>
							</v-btn>
						</v-col>
						<v-col md="3" class="px-1 py-2" align="right">
							<v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSearchDetail')">
								<v-icon>mdi-magnify</v-icon>
							</v-btn>
							<v-btn icon tile color="success" :disabled="isProcessing" @click="onClickButton('btnAddNew')" dark>
								<v-icon>mdi-plus-thick</v-icon>
							</v-btn>
							<v-btn icon tile color="success" :disabled="isProcessing" @click="onClickButton('btnSave')" dark>
								<v-icon>mdi-content-save</v-icon>
							</v-btn>
							<v-btn icon tile color="error" :disabled="isProcessing" @click="onClickButton('btnDelete')" dark>
								<v-icon>mdi-delete</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row align="center" justify="space-between" no-gutters>
						<v-col md="12" class="pa-1">
							<!-- <DxDataGrid column-resizing-mode="widget" ref="refGrdDetail" 
								:allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdDetail" 
								 

								<DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
								<DxSelection mode="multiple" show-check-boxes-mode="none" />
                				<DxPaging :enabled="false"/>
								<DxKeyboardNavigation :edit-on-key-press="true" />
								<template #check-yn-template="{ data }">
									<DxCheckBox :value="data.value === 'Y' ? true : false" @valueChanged="valueChanged($event, data.column.dataField, data.data)" />
								</template>
							</DxDataGrid> -->
							<BaseGridView
								ref='refGrdDetail'
								:setting="true"
								:height="windowHeight - 160"
								:header="headerGrdDetail"
								@cellDblClick="cellDblClickDetail"
								@onCellPrepared="onCellPreparedDetail"
								sel_procedure="LG_SEL_8030020_2"
								upd_procedure="LG_UPD_8030020_2"
								:filter_paras="[
									modelSearch.SPEC_CODE, modelSearch.ACTIVE_YN, modelSearch.SPECGRP_PK
								]"
								:update_paras="[
									'PK', 'SPEC_SEQ', 'SPEC_ID', 'SPEC_NM', 'SPEC_LNM', 'SPEC_FNM', 'SPEC_VALUE', 'ST_PRICE', 
									'USE_YN', 'TLG_IT_ITEMGRP_PK', 'PARTNER_NAME', 'TCO_BUSPARTNER_PK', 'PARENT_SPEC_ID', 'PARENT_SPEC_PK',
									'MAP_SPECGRP1_PK', 'SPEC_MAP1_PK', 'SPEC_MAP1_NM', 'MAP_SPECGRP2_PK', 'SPEC_MAP2_PK', 'SPEC_MAP2_NM',
									'MAP_SPECGRP3_PK', 'SPEC_MAP3_PK', 'SPEC_MAP3_NM', 'MAP_SPECGRP4_PK', 'SPEC_MAP4_PK', 'SPEC_MAP4_NM',
									'RGB', 'COLOR_CODE', 'DESCRIPTION', 'TLG_IT_SPECGRP_PK', 'TCO_COMPANY_PK'
								]"
							/>
						</v-col>
					</v-row>
				</v-card>
      </v-col>
    </v-row>
		
		<partner-dialog ref="refPartnerDialog" @callBackData="callBackPartner" />
		<color-dialog ref="refColorDialog" @callBackData="callBackColor" />
		<parent-spec-group ref="refParentSpecGrp"  @callBackData="callBackParentSpecGrp" />
		<parent-spec-group ref="refParentSpecGrp1"  @callBackData="callBackParentSpecGrp1" />
		<parent-spec-group ref="refParentSpecGrp2"  @callBackData="callBackParentSpecGrp2" />
		<parent-spec-group ref="refParentSpecGrp3"  @callBackData="callBackParentSpecGrp3" />
		<parent-spec-group ref="refParentSpecGrp4"  @callBackData="callBackParentSpecGrp4" />
		<delete-confirm-dialog ref="refDeleteConfirm" :dialogInfo="[$t('do_you_want_delete'),'warning']" @onConfirm="onDelete()" />
  </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import CellGridSelect from '@/components/table/CellGridSelect'
import CellGridCheckbox from '@/components/table/CellGridCheckbox'
import CellGridDatePicker from '@/components/table/CellGridDatePicker'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import PartnerDialog from '@/components/dialog/PartnerDialog'
import ColorDialog from '@/components/dialog/ColorDialog'
import ParentSpecGroup from '@/components/part/80/30/8030020_parent_sgrp'
export default{
	layout: "default",
	middleware: "user",
	components: { CellGridTextField, CellGridSelect, CellGridCheckbox, CellGridDatePicker,
								'delete-confirm-dialog': ConfirmDialog,
								'partner-dialog': PartnerDialog,
								'color-dialog': ColorDialog,
								'parent-spec-group': ParentSpecGroup},
	data: () => ({color : "",
		lstCompany: [],
		lstSpecGrpType: [],
		lstItemGrp: [],
		modelSearch: { COMPANY : null, SPECGRP_NM: "", SPECGRP_TYPE: "", SPEC_CODE: "", ACTIVE_YN: "Y", SPECGRP_PK: "", TCO_COMPANY_PK: ""},
		
		dsGrdSearch: [],
		dsGrdDetail: [],
		isShowLeft: true,
	}),
	created() {
		/*TODO: */

  },
	computed: {
    user() { return this.$store.getters["auth/user"] },
	limitHeightGrdSearh() { return this.windowHeight-250 },
	headerGrdDetail() {
		return [
			{dataField: "SPEC_SEQ", caption: this.$t("spec_seq"), allowEditing: true, alignment: "center",},
			{dataField: "SPEC_ID", caption: this.$t("spec_id"), allowEditing: true,},
			{dataField: "SPEC_NM", caption: this.$t("spec_nm"), allowEditing: true,},
			{dataField: "SPEC_LNM", caption: this.$t("spec_lnm"), allowEditing: true,},
			{dataField: "SPEC_FNM", caption: this.$t("spec_fnm"), allowEditing: true,},
			{dataField: "SPEC_VALUE", caption: this.$t("spec_value"), allowEditing: true, alignment: "right", dataType: "number", formatFloat: 0,},
			{dataField: "ST_PRICE", caption: this.$t("st_price"), allowEditing: true, alignment: "right", dataType: "number", formatFloat: 0,},
			{dataField: "USE_YN", caption: this.$t("use_yn"), allowEditing: true, dataType: "checkbox"},
			{dataField: "TLG_IT_ITEMGRP_PK", allowEditing: true, caption: this.$t("itemgrp"), lookup: {displayExpr: 'CODEDESC', valueExpr: 'CODEKEY', dataSource: this.lstItemGrp,},},
			{dataField: "PARTNER_NAME", caption: this.$t("partner_name"), allowEditing: false,},
			{dataField: "PARENT_SPEC_ID", caption: this.$t("parent_spec_code"), allowEditing: false,},
			{dataField: "SPEC_MAP1_NM", caption: this.$t("spec_map_1"), allowEditing: false,},
			{dataField: "SPEC_MAP2_NM", caption: this.$t("spec_map_2"), allowEditing: false,},
			{dataField: "SPEC_MAP3_NM", caption: this.$t("spec_map_3"), allowEditing: false,},
			{dataField: "SPEC_MAP4_NM", caption: this.$t("spec_map_4"), allowEditing: false,},
			{dataField: "RGB", caption: this.$t("rgb"), allowEditing: false,},
			{dataField: "DESCRIPTION", caption: this.$t("description"), allowEditing: true,},
		]
	  },
	},
	mounted() {
		/*TODO: */
		this.DSO_LST_8030020( ["COMPANY",this.user.TCO_COMPANY_PK]);
		this.DSO_LST_8030020( ["SPECGRP_TYPE",this.user.TCO_COMPANY_PK]);
		this.DSO_LST_8030020( ["ITEMGRP",this.user.TCO_COMPANY_PK]);
	},
	methods: {

		valueChanged(e, colName, data) {
		const newValue = e.value ? 'Y' : 'N'
		this.changeValue(newValue, colName, data.PK, true)
		},

		changeValue(value, key, pk, isModified) {
		this.dsGrdDetail.map((item, index) => {
			if (item.PK === pk) {
			this.$set(item, key, value)
			if (isModified && item.PK && item._rowstatus != 'i') {
				item._rowstatus = "u";
			}
			}
		})
		},
		
		cellDblClickDetail(data){
			console.log(data);
			switch(data.column.datafield){
				case 'PARTNER_NAME':
					this.$refs.refPartnerDialog.dialogIsShow = true;
					break;
				case 'PARENT_SPEC_ID':
					if(this._hasValue(data.data.PARENT_SPEC_PK)){
						this.$refs.refParentSpecGrp.gw_P_PK = data.data.PARENT_SPEC_PK;
						this.$refs.refParentSpecGrp.dialogIsShow = true;
					}else{
						this.showNotification("warning", this.$t("information"), this.$t('msg_do_not_have_parent_spec_code'));
						return;
					}
					break;
				case 'SPEC_MAP1_NM':
					if(this._hasValue(data.data.MAP_SPECGRP1_PK)){
						this.$refs.refParentSpecGrp1.gw_P_PK = data.data.MAP_SPECGRP1_PK;
						this.$refs.refParentSpecGrp1.dialogIsShow = true;
					}else{
						this.showNotification("warning", this.$t("information"), this.$t('msg_do_not_have_map_spec_1'));
						return;
					}
					break;
				case 'SPEC_MAP2_NM':
					if(this._hasValue(data.data.MAP_SPECGRP2_PK)){
						this.$refs.refParentSpecGrp2.gw_P_PK = data.data.MAP_SPECGRP2_PK;
						this.$refs.refParentSpecGrp2.dialogIsShow = true;
					}else{
						this.showNotification("warning", this.$t("information"), this.$t('msg_do_not_have_map_spec_2'));
						return;
					}
					break;
				case 'SPEC_MAP3_NM':
					if(this._hasValue(data.data.MAP_SPECGRP3_PK)){
						this.$refs.refParentSpecGrp3.gw_P_PK = data.data.MAP_SPECGRP3_PK;
						this.$refs.refParentSpecGrp3.dialogIsShow = true;
					}else{
						this.showNotification("warning", this.$t("information"), this.$t('msg_do_not_have_map_spec_3'));
						return;
					}
					break;
				case 'SPEC_MAP4_NM':
					if(this._hasValue(data.data.MAP_SPECGRP4_PK)){
						this.$refs.refParentSpecGrp4.gw_P_PK = data.data.MAP_SPECGRP4_PK;
						this.$refs.refParentSpecGrp4.dialogIsShow = true;
					}else{
						this.showNotification("warning", this.$t("information"), this.$t('msg_do_not_have_map_spec_4'));
						return;
					}
					break;
				case 'RGB':
					this.$refs.refColorDialog.dialogIsShow = true;
					break;
			}
		},
		onCellPreparedDetail(data){
			console.log(data);
			if (data.column.datafield == "RGB") {
        		data.cellElement.style.backgroundColor = data.data.COLOR_CODE;
      		}
		},

		onClickButton(obj){
			switch(obj){
				case 'btnSearch':
					this.modelSearch.SPECGRP_PK = "";
					this.modelSearch.TCO_COMPANY_PK = "";
					this.$refs.refGrdSearch.instance.deselectAll();
					this.DSO_GRD_8030020_1('select');
					break;
				case 'btnSearchDetail':
					if(this._hasValue(this.modelSearch.SPECGRP_PK)){
						this.$refs.refGrdDetail.loadData();
					}
					break;
				case 'btnAddNew':
					this.$refs.refGrdDetail.addRowStruct({
						TLG_IT_SPECGRP_PK: this.modelSearch.SPECGRP_PK,
						TCO_COMPANY_PK: this.modelSearch.TCO_COMPANY_PK
					})
					break;
				case 'btnSave':
					this.$refs.refGrdDetail.saveData();
				break;
				case 'btnDelete':
					this.$refs.refDeleteConfirm.dialogIsShow = true;
				break;
			}
		},
		onDelete(){
			this.$refs.refGrdDetail.deleteRows();
    },
		/*NOTE: */
		onCellClickGrd1(_event) {
			if(_event.data){
				this.modelSearch.SPECGRP_PK = _event.data.PK;
				this.modelSearch.TCO_COMPANY_PK = _event.data.TCO_COMPANY_PK;
				this.$refs.refGrdDetail.loadData();;
			}
			
		},

		callBackPartner(objData){
			if(objData){
				this.$refs.refGrdDetail.setCellSelected("PARTNER_NAME", objData.PARTNER_ID+" * "+objData.PARTNER_NAME);
				this.$refs.refGrdDetail.setCellSelected("TCO_BUSPARTNER_PK", objData.PK);
			}
		},
		callBackColor(objData){
			this.$refs.refGrdDetail.setCellSelected("COLOR_CODE", objData.COLOR_CODE);
		},
		callBackParentSpecGrp(objData){
			if(objData){
				this.$refs.refGrdDetail.setCellSelected("PARENT_SPEC_ID", objData.SPEC_ID);
			}
		},
		callBackParentSpecGrp1(objData){
			if(objData){
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP1_PK", objData.PK);
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP1_NM", objData.SPEC_ID);
			}
		},
		callBackParentSpecGrp2(objData){
			if(objData){
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP2_PK", objData.PK);
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP2_NM", objData.SPEC_ID);
			}
		},
		callBackParentSpecGrp3(objData){
			if(objData){
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP3_PK", objData.PK);
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP3_NM", objData.SPEC_ID);
			}
		},
		callBackParentSpecGrp4(objData){
			if(objData){
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP4_PK", objData.PK);
				this.$refs.refGrdDetail.setCellSelected("SPEC_MAP4_NM", objData.SPEC_ID);
			}
		},
		/*NOTE: */
		async DSO_GRD_8030020_1(action="select") {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_8030020_1',
        para: [this.modelSearch.COMPANY, this.modelSearch.SPECGRP_NM, this.modelSearch.SPECGRP_TYPE]
      }
      this.dsGrdSearch = await this._dsoCall(dso, 'select', false);
		},
		/*NOTE: */
		async DSO_LST_8030020(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_8030020',
        para: _param
			}
			switch(_param[0]){
        case "COMPANY":
					this.lstCompany = await this._dsoCall(dso, 'select', false);
					//this.lstCompany.unshift({CODEKEY: '', CODEDESC: this.$t("option_all")});
				break;
				case 'SPECGRP_TYPE':
					this.lstSpecGrpType = await this._dsoCall(dso, 'select', false);
					this.lstSpecGrpType.unshift({CODEKEY: '', CODEDESC: this.$t('option_all')});
				break;
				case 'ITEMGRP':
					this.lstItemGrp = await this._dsoCall(dso, 'select', false);
					this.lstItemGrp.unshift({CODEKEY: '', CODEDESC: ''});
				break;
      }
		},
		
	}
}
</script>
