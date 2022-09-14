<template>
    <v-container fluid class="px-0 py-3"   v-resize="onResize">
        <v-row no-gutters>
            <v-col cols="12" lg="4" class="px-1">
                <v-card class="px-0 py-0 100vh " :height="limitHeight">
                    <v-row no-gutters class="flex-row" align="center" justify="center">
                        <v-col cols="11" class="px-1 py-1">
                            <v-sheet class="d-flex">
                                <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" > </BaseSelect>
                            </v-sheet>
                        </v-col>
                        <v-col cols="1" class="px-1 py-1">
                            <v-sheet class="d-flex">
                                <v-badge  offset-x='50'  color="green" :content="$t('show_all')" style="font-size: 0.35rem">
                                    <v-checkbox  v-model="showAll"   color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                                </v-badge>
                            </v-sheet>
                            
                        </v-col>
                    </v-row>

                    <!-- <v-row no-gutters class="flex-row">
                        <v-col cols="11" class="px-1 py-1">
                            <v-sheet class="d-flex">
                                <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('biz_place')" :lstData="bizPlaceList" v-model="selectedBizPlace" > </BaseSelect>
                            </v-sheet>
                        </v-col>
                    </v-row> -->

                    <v-row no-gutters class="flex-row" v-if="report1 && report1.length > 0">
                        <v-col cols="11" class="px-1 py-1">
                            <v-sheet class="d-flex">
                                <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('report')" :lstData="report1" v-model="selectedReport" > </BaseSelect>
                            </v-sheet>
                        </v-col>
                        <v-col cols="1" class="px-1 py-1">
                            <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('excel')" @onclick="onReport"/>
                        </v-col>
                    </v-row>

                    <v-row no-gutters class="flex-row">
                        <BaseTreeView ref="myTree"
                            :label="'organization_tree'" :value="orgList"
                            :height="limitHeight*0.95"
                            :expand="true"
                            :childrenKey="'items'" :keyExpr="'PK'" :displayExpr="'ORG_NM'"
                            @itemClick="itemClick"
                        >
                        </BaseTreeView>
                    </v-row>

                </v-card>
            </v-col>
            <v-col cols="12" lg="8" class="px-1">
                <v-form lazy-validation ref="entryForm" v-model="formIsValid">
                    <v-card class="px-0 py-0 100vh" :height="limitHeight">
                        <v-card-actions >
                            <v-row no-gutters class="py-1">
                                <BaseButton btn_type="default" icon_type="move_emp" :btn_text="$t('move_employee')"    mdi-icon="mdi-account-switch" @onclick="onMoveEmployee"  v-bind:disabled.sync="isProcessing" />
                                <BaseButton btn_type="default" icon_type="move_org" :btn_text="$t('move_department')"  mdi-icon="mdi-folder-sync"    @onclick="onMoveOrg" v-bind:disabled.sync="isProcessing" />
                                <v-spacer></v-spacer>
                                <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')"      @onclick="onProcessConfirm('ADD',onAdd)" v-bind:disabled.sync="isProcessing" />
                                <BaseButton btn_type="default" icon_type="addsub" :btn_text="$t('add_sub')"      @onclick="onProcessConfirm('ADDSUB',onAddSub)" v-bind:disabled.sync="isProcessing" mdi-icon="mdi-folder-plus"/>
                                <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')"      @onclick="onProcessConfirm('SAVE', onSave)" v-bind:disabled.sync="isProcessing" />
                                <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')"      @onclick="onProcessConfirm('DELETE',onDelete)" v-bind:disabled.sync="isProcessing" />
                            </v-row>
                        </v-card-actions>
                        <v-card-title class="subtitle-1 primary-gradient white--text py-1">
                            <span>{{$t("organization_info")}}</span>
                        </v-card-title>
                        <v-card-text class="px-0">
                            <v-row no-gutters>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput outlined :label="$t('upper_org')" v-model="data.UPPER_ORG"></BaseInput>
                                </v-col>
                                <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('department_type')" :lstData="companytypeList" v-model="data.COMPANY_TYPE"  :rules="validationRule.selectRules" > </BaseSelect>
                                    <!-- <BaseSelect null :outlined="true" item-value="PK" item-text="TEXT" :label="$t('biz_place')" :lstData="bizPlaceListData" v-model="data.TCO_BUSPLACE_PK" > </BaseSelect> -->
                                </v-col>
                               
                            </v-row>

                            <v-row no-gutters>
                                <v-col cols="12" lg="6" class="px-0 py-0">
                                    <v-row no-gutters align="center" justify="center">
                                        <!-- <v-col cols="6" class="px-1 py-1">
                                            <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('department_type')" :lstData="companytypeList" v-model="data.COMPANY_TYPE"  :rules="validationRule.selectRules" > </BaseSelect>
                                        </v-col> -->
                                        <v-col cols="12" class="px-1 py-1">
                                            <BaseInput outlined :label="$t('org_id')" v-model="data.ORG_ID" :rules="validationRule.nameRules"></BaseInput>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput outlined :label="$t('local_name')" v-model="data.LOCAL_NAME"></BaseInput>
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput outlined :label="$t('org_name')" v-model="data.ORG_NAME" :rules="validationRule.nameRules"></BaseInput>
                                </v-col>
                                <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput outlined :label="$t('foreign_name')" v-model="data.FOREIGN_NAME"></BaseInput>
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                <v-col cols="12" lg="6" class="px-0 py-0">
                                    <v-row no-gutters align="center" justify="center">
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseInput outlined :label="$t('short_name')" v-model="data.SHORT_NAME"></BaseInput>
                                        </v-col>
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseInput outlined :label="$t('seq')" v-model="data.SEQ" number></BaseInput>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" lg="6" class="px-0 py-0">
                                    <v-row no-gutters align="center" justify="center">
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseDatePicker outlined default :label="$t('start_dt')" v-model="data.START_DT" :rules="validationRule.nameRules"></BaseDatePicker>
                                        </v-col>
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseDatePicker null outlined :label="$t('end_dt')" v-model="data.END_DT"></BaseDatePicker>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>


                            <v-row no-gutters>
                                <v-col cols="12" lg="6" class="px-0 py-0">
                                    <v-row no-gutters align="center" justify="center">
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseInput outlined :label="$t('manager')" v-model="data.MANAGER"  @click="openEmployee" readonly></BaseInput>
                                        </v-col>
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('manager_kind')" :lstData="managerkindList" v-model="data.MANAGER_KIND" > </BaseSelect>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" lg="6" class="px-0 py-0">
                                    <v-row no-gutters align="center" justify="center">
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('pay_salary')" :lstData="paysalaryList" v-model="data.PAY_SALARY" > </BaseSelect>
                                        </v-col>
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('out_side')" :lstData="outsidelList" v-model="data.OUTSIDE" > </BaseSelect>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                <v-col cols="12" lg="6" class="px-0 py-0">
                                    <v-row no-gutters align="center" justify="center">
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('cost_group')" :lstData="costgroupList" v-model="data.COST_GROUP" > </BaseSelect>
                                        </v-col>
                                        <v-col cols="6" class="px-1 py-1">
                                            <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('cost_type')" :lstData="costtypeList" v-model="data.COST_TYPE" > </BaseSelect>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput outlined :label="$t('cost_center')" v-model="data.PL_NM" readonly @click='openCostCenter'></BaseInput>
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                <v-col cols="12" class="px-1 py-1">
                                    <BaseTextarea :outlined="true" :label="$t('remark')" rows="5" v-model="data.REMARK" no-resize>  </BaseTextarea>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>


        <v-dialog v-model="orgDialog" max-width="600" persistent>
            <v-card>
                <v-card-title class="headline primary-gradient white--text py-2 px-2">
                    <span>{{ $t(orgFunction) }}</span>
                    <v-spacer></v-spacer>
                    <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="orgDialog = false"  />
                </v-card-title>
                <v-container fluid>
                    <v-row no-gutters align="center" justify="center">
                        <v-col cols="12" lg="5" class="px-1 py-1">
                            <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('from_org')" :lstData="orgListFrom" v-model="selectedOrgFrom" > </BaseSelect>
                        </v-col>
                        <v-col cols="12" lg="5" class="px-1 py-1">
                            <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('to_org')" :lstData="orgListTo" v-model="selectedOrgTo" > </BaseSelect>
                        </v-col>
                        <v-col cols="12" lg="2">
                            <v-row no-gutters>
                                <BaseButton btn_type="default" icon_type="process" :btn_text="$t('change')" @onclick="onProcessConfirm(orgFunction,onProcessChange)" />
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>


        <cost-center-dialog ref='costcenterdialog' :companyPK="selectedCompany" @returnData='onSelectCostCenter'></cost-center-dialog>
        <employee-dialog ref="employeeDialog" @closeEmployeeDialog="employeeDialog = false" @callBack="onSelectEmployee"></employee-dialog>
    </v-container>
</template>


<script>

import CostCenter from '@/components/dialog/CostCenterDialog';
import EmployeeDialog from '@/components/part/10/controls/hr_employee_dialog.vue';
import listToTree from "list-to-tree-lite";

export default {
    layout: 'default',
    middleware: 'user',

    components: {
        'cost-center-dialog': CostCenter,
        'employee-dialog': EmployeeDialog,
    },

    data: () => ({
        companyList: [],
        bizPlaceList: [],
        bizPlaceListData: [],
        report1: [],
        orgList:[],
        orgListFrom:[],
        orgListTo:[],
        companytypeList:[],
        managerkindList:[],
        costgroupList:[],
        costtypeList:[],
        paysalaryList:[],
        outsidelList:[],

        formIsValid:undefined,
        showAll: 'Y',
        selectedCompany: null,
        selectedBizPlace: null,
        selectedReport: null,
        selectedOrgFrom:null,
        selectedOrgTo:null,
        data:{},
        params: null,
        P_PK_N: null,
        UPPER_ORG_N: null,
        orgDialog:false,
        orgFunction:null,
        dso: {
            type: 'control',
            selpro: 'HR_SEL_8011070_ORG_INFO',
            updpro: 'HR_UPD_8011070_ORG_INFO',
        }
    }),
    computed:
    {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() { return this.windowHeight - 150 },
        ynList: function (){
            return [
                { CODE: 'Y', NAME: this.$t('yes') },
                { CODE: 'N', NAME: this.$t('no') },
            ]
        }
    }, 

    watch: {
        selectedCompany: function(val) {
            this.prepareCommonData();
        },
        showAll(val){
            this.getOrgList();
        },
        selectedBizPlace(val){
            if(val) this.getOrgList();
        }
    },

    async created() {
        this.companyList = await this._getCompany();
        this.selectedCompany = this.user.TCO_COMPANY_PK;
        this.initOject();
    },

    methods: {
        initOject() {
            this.params = [
                "_rowstatus", "PK", "P_PK", "UPPER_ORG", "ORG_NAME", "ORG_ID", "LOCAL_NAME", "FOREIGN_NAME"
                , "LEAF_YN", "SHORT_NAME", "SEQ", "START_DT", "END_DT", "COMPANY_TYPE", "MANAGER", "MANAGER_ID"
                , "MANAGER_PK", "MANAGER_KIND", "PAY_SALARY", "OUTSIDE", "COST_GROUP", "COST_TYPE", "PL_NM", "TAC_ABPL_PK"
                , "REMARK", "TCO_COMPANY_PK", "TCO_BUSPLACE_PK"            
            ];
            this.data = this._initObject(this.params, this.selectedCompany);
            this.data.PK = null;
            this.data.START_DT = this._formatDateToSave(new Date());
        },
        
        async prepareCommonData() {
            
            this.report1 = await this._getReportList('8011070', 'ORGANIZATION', this.selectedCompany);
            this.orgListFrom = await this._getOrg(this.selectedCompany);
            this.orgListTo= [...this.orgListFrom];
            
            let parentCodes = [
                "COEO0030", "HR0071", "HR0092", 'HR0093',
            ] ;

            let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany  );
            this.companytypeList = listCommonCode[0];
            this.managerkindList = listCommonCode[1];
            this.costgroupList = listCommonCode[2];
            this.costtypeList = listCommonCode[3];
            this.paysalaryList = this.ynList;
            this.outsidelList = this.ynList;

            this.bizPlaceList = await this._getBizPlaceByCompany(this.selectedCompany);
            this.bizPlaceListData = [...this.bizPlaceList];
            this.bizPlaceList.unshift( { PK: 'ALL', TEXT: this.$t('select_all') }, );
            this.selectedBizPlace = 'ALL';

            await this.getOrgList();

        },

        openCostCenter() {
            this.costcenterprop = { companyPK: this.selectedCompany, plcPK: '' };
            this.$refs.costcenterdialog.dialogIsShow = true;
        },

        onSelectCostCenter(data) {
            this.data.TAC_ABPL_PK = data.PK;
            this.data.PL_NM = data.CODE;
        },

        openEmployee() {
            this.$refs.employeeDialog.dialogIsShow = true;
        },

        onSelectEmployee(datas) {
            this.data.MANAGER = datas.EMP_ID + "-" + datas.FULL_NAME;
            this.data.MANAGER_PK = datas.PK;
            this.data.MANAGER_ID = datas.EMP_ID;
        },

        async getOrgList() {
            const dso = {
                type: 'list',
                selpro: 'HR_SEL_8011070_ORG',
                para: [this.selectedCompany, this.selectedBizPlace, this.showAll]
            }
            const result = await this._dsoCall(dso, 'select', false);
            if(result) {
                this.orgList = listToTree(result, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'items' });
            } else {
                this.orgList = [];
            }
        },

        async itemClick(event, data) {
            this.data.PK = data.PK
            this.P_PK = data.PK;
            this.UPPER_ORG = data.ORG_NAME;

            this.P_PK_N = data.P_PK;
            this.UPPER_ORG_N = data.UPPER_ORG;
            this.getOrgInfo();
        },
        
        async getOrgInfo() {
            const dso = {
                type: 'control',
                selpro: 'HR_SEL_8011070_ORG_INFO',
                para: [this.data.PK]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result) {
                this.data = result;
                this.data["_rowstatus"] = "";
            }
        },

        async onAdd() {
            this.initOject();
            this.data.P_PK = this.P_PK_N;
            this.data.UPPER_ORG = this.UPPER_ORG_N;
        },

        async onAddSub() {
            if (!this.P_PK) {
                this.showNotification('danger', this.$t('please_select_the_parent_node_first'), '');
            }
            this.initOject();
            this.data.P_PK = this.P_PK;
            this.data.UPPER_ORG = this.UPPER_ORG;
        },

        async onSave() {
            if(this.$refs.entryForm.validate() )
            {
                this.formIsValid = true;
                if (this.data._rowstatus !== 'i' && this.data._rowstatus !== 'd') {
                    this.data._rowstatus = 'u';
                }
                this.dso.para = [this.data.PK];
                this.dso.elname = this.params;
                this.dso.data = this.data;
                
                const result = await this._dsoCall(this.dso, 'update', true)
                if (result) {
                    this.data = result;
                } 
                await this.getOrgList();

                this.formIsValid = false;
            }
        },

        async onDelete() {
            this.data._rowstatus = 'd';
            //debugger;
            this.dso.para = [this.data.PK];
            this.dso.elname = this.params;
            this.dso.data = this.data;
            
            const result = await this._dsoCall(this.dso, 'update', true)
            if (result) {
                this.data = result;
            } 
            await this.getOrgList();
        },

        async onMoveEmployee() {
            this.orgFunction = "move_employee";
            this.orgDialog = true;
        },

        async onMoveOrg() {
            this.orgFunction = "move_department";
            this.orgDialog = true;
        },

        async onProcessChange(){
            const dso = {
                type: 'process',
                updpro: 'HR_PRO_8011070_ORG_INFO_V2',
                para: [this.selectedOrgFrom, this.selectedOrgTo, this.orgFunction == 'move_department' ? '0' : '1']
            }

            const result = await this._dsoCall(dso, 'process', true)
            if (result) {
                this.orgListFrom = await this._getOrg(this.selectedCompany);
                this.orgListTo= [...this.orgListFrom];
                await this.getOrgList();
            }
        },

        async onReport() {
            let excel = [];
            let reportInfo = this.report1.find(x => x.CODE === this.selectedReport);
            let report_path = reportInfo.REPORT_PATH;
            let report_name = reportInfo.NAME + ".xlsx";
            let pa = [this.selectedCompany, this.user.PK];
            switch (this.selectedReport) {
                case "01"://template 1
                    {
                        excel = [
                            {
                                sheet: 1,
                                insertRows: [
                                    {
                                        startRow: 6, proc: "rpt_8010070_org_tree_t1_nocache", params: pa,
                                    },
                                ],
                            },
                        ];

                        break;
                    }
                case "02"://template 2
                    {
                        excel = [
                            {
                                sheet: 1,
                                insertRows: [
                                    {
                                        startRow: 7, proc: "rpt_8010070_org_tree_t2_nocache", params: pa,
                                    },
                                ],
                            },
                        ];

                        break;
                    }

                default: report_path = ""; break;
            }

            const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });
            if (res && res.size > 0) {
                this._ExcelSaveAs(res, report_name);
            } else {
                this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
            }

        },
    }
}

</script>