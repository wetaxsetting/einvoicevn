<template>
    <v-container fluid class="pa-1">
        <v-card outlined>
            <v-row class='my-0 py-0  font-weight-bold'>

                <v-col cols='12' lg='4' class="pl-4  font-weight-bold">
                    <v-row class="pl-3">
                        <v-row>
                            <v-col cols='12' lg='12' class="pl-4 pt-0 font-weight-bold">
                                <v-select dense cache-items hide-details outlined
                                          item-value="PK" item-text="TEXT" :label="$t('company')"
                                          :items="companyList" v-model="selectedCompany"
                                          class="white"></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols='9' lg='9' class="pt-0 pl-4  font-weight-bold">
                                <v-select dense cache-items hide-details outlined
                                          item-value="CODE" item-text="NAME" :label="$t('report_list')"
                                          :items="report1" v-model="selectedReport">
                                </v-select>
                            </v-col>
                            <v-col cols='3' lg='3' class="pt-2 font-weight-bold">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small raised color="success" @click="onReport()" class=" ml-1 px-0 white--text">
                                            <v-icon>mdi-file-excel</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('EXCEL') }}</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-row>
                    <v-row class="pl-3 pt-0">
                        <v-card outlined class="overflow-y-80vh-container" :disabled="isRendering" :loading="isRendering">
                            <v-card-text class="pa-0">



                                <v-row>
                                    <v-col cols='12' lg='12' class="pl-4  font-weight-bold">
                                        <v-slide-y-transition hide-on-leave>
                                            <v-skeleton-loader type="list-item@10" v-if="!menuList.length"></v-skeleton-loader>
                                            <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="ORG_NM" item-children="childMenu"
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
                    </v-row>
                </v-col>


                <v-col cols='12' lg='8' class="pl-4  font-weight-bold ">

                    <v-row class='my-0 py-0'>
                        <v-col cols='12' class='my-0 py-0'>
                            <v-card-title class="subtitle-1 primary-gradient white--text py-1">
                                <span>{{ $t('organization info') }}</span>
                                <v-spacer></v-spacer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small raised color="success" @click="onProcessConfirm('ADD')" class=" ml-1 px-0 white--text">
                                            <v-icon>mdi-plus-thick</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('add_new') }}</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small raised color="success" @click="onProcessConfirm('ADDSUB')" class=" ml-1 px-0 white--text">
                                            <v-icon>mdi-folder-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('add_new_sub') }}</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small raised color="purple" @click="onProcessConfirm('SAVE')" class=" ml-1 px-0 white--text">
                                            <v-icon>mdi-content-save</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('save') }}</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small raised color="red" @click="onProcessConfirm('DELETE')" class=" ml-1 px-0 white--text">
                                            <v-icon>mdi-trash-can</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('delete') }}</span>
                                </v-tooltip>
                            </v-card-title>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0 '>
                        <v-col cols='6' class='my-0 pb-0 red--text'>
                            <v-text-field clearable dense hide-details outlined :label="$t('upper_org')" v-model="data.UPPER_ORG"></v-text-field>
                        </v-col>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('org_id')" v-model="data.ORG_ID"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0'>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('org_name')" v-model="data.ORG_NAME"></v-text-field>
                        </v-col>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-select dense cache-items hide-details outlined item-value="CODE" item-text="NAME" :label="$t('company_type')" :items="companytypeList" v-model="data.COMPANY_TYPE"> </v-select>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0'>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('local_name')" v-model="data.LOCAL_NAME"></v-text-field>
                        </v-col>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('foreign_name')" v-model="data.FOREIGN_NAME"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0'>
                        <v-col cols='3' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('short_name')" v-model="data.SHORT_NAME"></v-text-field>
                        </v-col>
                        <v-col cols='3' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('seq')" v-model="data.SEQ"></v-text-field>
                        </v-col>
                        <v-col cols='3' class='my-0 pb-0'>
                            <date-picker :label="$t('start_dt')"
                                         outlined
                                         :defaultType="null"
                                         @returnValue="data.START_DT = $event"
                                         :inputValue='data.START_DT'>
                            </date-picker>
                        </v-col>

                        <v-col cols='3' class='my-0 pb-0'>
                            <date-picker :label="$t('end_dt')"
                                         outlined
                                         :defaultType="null"
                                         @returnValue="data.END_DT = $event"
                                         :inputValue='data.END_DT'>

                            </date-picker>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0'>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('mananger')" v-model="data.MANAGER" @dblclick='openEmployee'></v-text-field>
                        </v-col>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-select dense cache-items hide-details outlined item-value="CODE" item-text="NAME" :label="$t('manager_kind')" :items="managerkindList" v-model="data.MANAGER_KIND"> </v-select>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0'>
                        <v-col cols='3' class='my-0 pb-0'>
                            <v-select dense cache-items hide-details outlined item-value="CODE" item-text="NAME" :label="$t('pay_salary')" :items="paysalaryList" v-model="data.PAY_SALARY"> </v-select>
                        </v-col>
                        <v-col cols='3' class='my-0 pb-0'>
                            <v-select dense cache-items hide-details outlined item-value="CODE" item-text="NAME" :label="$t('outside')" :items="outsidelList" v-model="data.OUTSIDE"> </v-select>
                        </v-col>
                        <v-col cols='3' class='my-0 pb-0'>
                            <v-select dense cache-items hide-details outlined item-value="CODE" item-text="NAME" :label="$t('cost_group')" :items="costgroupList" v-model="data.COST_GROUP"> </v-select>
                        </v-col>
                        <v-col cols='3' class='my-0 pb-0'>
                            <v-select dense cache-items hide-details outlined item-value="CODE" item-text="NAME" :label="$t('cost_type')" :items="costtypeList" v-model="data.COST_TYPE"> </v-select>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0'>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-text-field dense hide-details outlined :label="$t('cost_center')" v-model="data.PL_NM" readonly @dblclick='openCostCenter'></v-text-field>
                        </v-col>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-text-field clearable dense hide-details outlined :label="$t('remark')" v-model="data.REMARK"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0 pt-3'>
                        <v-col cols='12' class='my-0 py-0'>
                            <v-card-title class="subtitle-1 primary-gradient white--text py-1">
                                <span>{{ $t('move organization') }}</span>
                                <v-spacer></v-spacer>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small raised color="success" @click="onProcessConfirm('MOVE_EMP')" class=" ml-1 px-0 white--text">
                                            <v-icon>mdi-account-switch</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('move_employee') }}</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small raised color="success" @click="onProcessConfirm('MOVE_ORG')" class=" ml-1 px-0 white--text">
                                            <v-icon>mdi-folder-sync</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('move_department') }}</span>
                                </v-tooltip>

                            </v-card-title>
                        </v-col>
                    </v-row>

                    <v-row class='my-0 py-0'>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-select dense hide-details outlined
                                      item-value="PK" item-text="TEXT" :label="$t('org_from')"
                                      :items="orgListFrom" v-model="data.selectedOrgFrom"
                                      :disabled="!disabled ? false : ( !disabled.orgListFrom ? false : disabled.orgListFrom )">
                            </v-select>
                        </v-col>
                        <v-col cols='6' class='my-0 pb-0'>
                            <v-select dense hide-details outlined
                                      item-value="PK" item-text="TEXT" :label="$t('org_to')"
                                      :items="orgListTo" v-model="data.selectedOrgTo"
                                      :disabled="!disabled ? false : ( !disabled.orgListTo ? false : disabled.orgListTo )">
                            </v-select>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
        </v-card>

        <cost-center-dialog ref='costcenterdialog' :companyPK="selectedCompany" @returnData='onSelectCostCenter'></cost-center-dialog>
        <employee-dialog ref="employeeDialog" @closeEmployeeDialog="employeeDialog = false" @callBackData="onSelectEmployee"></employee-dialog>
        <action-confirm v-if="actionDialog" @onCloseDialog="actionDialog = false" @onConfirm="onProcess" :action='actionProcess'></action-confirm>


    </v-container>
</template>


<script>
    import DeleteDialog from '@/components/dialog/DeleteDialog'
    import DatePicker from '@/components/control/DatePicker';
    import CostCenter from '@/components/dialog/CostCenterDialog';
    import listToTree from "list-to-tree-lite";
    import EmployeeDialog from '@/components/dialog/EmployeeDialog';
    import ActionConfirm from '@/components/dialog/ActionConfirmDialog';
    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import 'sweetalert2/src/sweetalert2.scss'


    export default {
        layout: 'default',
        middleware: 'user',
        props: {
            disabled: undefined,
        },

        components: {
            DeleteDialog,
            'date-picker': DatePicker,
            'cost-center-dialog': CostCenter,
            'employee-dialog': EmployeeDialog,
            ActionConfirm,
        },

        data: () => ({
            companyList: [],
            selectedCompany: 'ALL',
            selectedReport: 'ALL',
            report1: [],

            active: [],
            menuList: [],

            companytypeList: [],
            managerkindList: [],
            paysalaryList: [],
            outsidelList: [],
            costgroupList: [],
            costtypeList: [],

            selectedMenu: {},
            isRendering: false,

            costcenterprop: [],
            employeeprop: [],
            employeeDialog: false,

            actionDialog: false,
            actionProcess: '',

            data: { seletedOrgFrom: '', seletedOrgTo: '', UPPER_ORG: 'A' },
            params: null,
            P_PK: null,
            UPPER_ORG: '',

            P_PK_N: '',
            UPPER_ORG_N: '',

            orgListFrom: [],
            orgListTo: [],
            //selectedOrgFrom: '1',
            //selectedOrgTo: '',
        }),
        computed:
        {
            user: function () {
                return this.$store.getters["auth/user"];
            },
            limitHeight() { return this.windowHeight - 220 }
        },

        created() {
            this.selectedCompany = this.user.TCO_COMPANY_PK;
            this.data.selectedOrgFrom = !this.disabled ? this.data.selectedOrgFrom : (!this.disabled.data.selectedOrgFrom ? this.data.selectedOrgFrom : this.disabled.data.selectedOrgFrom);
            this.data.selectedOrgTo = !this.disabled ? this.data.selectedOrgTo : (!this.disabled.data.selectedOrgTo ? this.data.selectedOrgTo : this.disabled.data.selectedOrgTo);

        },
        mounted() {
            this.getMenuList()
            this.initOject();
            this.getCompanyList();
            this.prepareCommonData();
            this.getOrgList();
        },

        watch: {
            selectedCompany(value) {
                if (value) {
                    //this.isProcess = true;
                     this.getMenuList();
                     this.getOrgList();
                }
            },
        },

        methods: {

            initOject() {
                this.params = [
                    "_rowstatus"
                    , "PK"
                    , "P_PK"
                    , "UPPER_ORG"
                    , "ORG_NAME"
                    , "ORG_ID"
                    , "LOCAL_NAME"
                    , "FOREIGN_NAME"
                    , "LEAF_YN"
                    , "SHORT_NAME"
                    , "SEQ"
                    , "START_DT"
                    , "END_DT"
                    , "COMPANY_TYPE"
                    , "MANAGER"
                    , "MANAGER_ID"
                    , "MANAGER_PK"
                    , "MANAGER_KIND"
                    , "PAY_SALARY"
                    , "OUTSIDE"
                    , "COST_GROUP"
                    , "COST_TYPE"
                    , "PL_NM"
                    , "TAC_ABPL_PK"
                    , "REMARK"
                    , "TCO_COMPANY_PK"
                ];
                //let model = this._initObject(this.params);
                //this.data = { ...model };
                this.data = this._initObject(this.params, this.selectedCompany);
                //console.log(this.data);
            },

            async onProcessConfirm(action) {

                this.actionProcess = action;

                let promise = Swal.fire({
                    icon: 'question',
                    title: this.$t('do_you_want_to' + '_' + action.toLowerCase()),
                    showCancelButton: true,
                    confirmButtonText: this.$t("yes"),
                    cancelButtonText: this.$t("no")
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.onProcess();
                    }
                });

                await promise;
            },

            onProcess() {

                if (this.actionProcess === 'ADD') {
                    this.onAdd();
                }

                if (this.actionProcess === 'ADDSUB') {
                    this.onAddSub();
                }

                if (this.actionProcess === 'SAVE') {
                    this.onSave();
                }

                if (this.actionProcess === 'DELETE') {

                    this.onDelete();
                }

                if (this.actionProcess === 'MOVE_EMP') {

                    this.onMoveEmp();
                }

                if (this.actionProcess === 'MOVE_ORG') {

                    this.onMoveOrg();
                }

            },

            async getCompanyList() {
                const dso = {
                    type: 'list',
                    selpro: 'SYS_SEL_LIST_COMPANY',
                    para: [this.user.PK]
                }
                const result = await this._dsoCall(dso, 'select', false)
                if (result) {
                    this.companyList = result;
                } else {
                    this.companyList = []
                }
            },

            async getMenuList() {
                try {
                    this.isRendering = true
                    let { data, success, message } = await this.$axios.$post("dso/callproc", { proc: "HR_SEL_8010070_MENU", para: [this.selectedCompany] })
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

            getSelectedMenu() {
                if (!this.active.length) {
                    this.selectedMenu = ''
                } else {
                    this.selectedMenu = { ...this.active[0] };
                    this.P_PK = this.active[0].PK;
                    this.UPPER_ORG = this.active[0].ORG_NAME;

                    this.P_PK_N = this.active[0].P_PK;
                    this.UPPER_ORG_N = this.active[0].UPPER_ORG;

                    this.getOrgInfo();
                    //console.log(this.P_PK_N);
                }
            },

            async getOrgInfo() {
                const dso = {
                    type: 'control',
                    selpro: 'HR_SEL_8010070_ORG_INFO',
                    para: [this.selectedMenu.PK]
                }
                const result = await this._dsoCall(dso, 'select', false)
                if (result) {
                    this.data = result;
                }
            },

            async prepareCommonData() {
                this.companytypeList = await this._getCommonCode('COEO0030', this.user.TCO_COMPANY_PK);
                this.managerkindList = await this._getCommonCode('HR0071', this.user.TCO_COMPANY_PK);
                this.costgroupList = await this._getCommonCode('HR0092', this.user.TCO_COMPANY_PK);
                this.costtypeList = await this._getCommonCode('HR0093', this.user.TCO_COMPANY_PK);
                this.paysalaryList = await this._getCommonCode('HR0262', this.user.TCO_COMPANY_PK);
                this.outsidelList = await this._getCommonCode('HR0262', this.user.TCO_COMPANY_PK);
                this.report1 = await this._getReportList('8010070', 'ORGANIZATION', this.user.TCO_COMPANY_PK);
                this.selectedReport = this.report1[0].CODE;

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

            async onSave() {

                if (this.data._rowstatus !== 'i' && this.selectedMenu._rowstatus !== 'd') {
                    this.data._rowstatus = 'u';
                }
                //debugger;
                const dso = {
                    type: 'control',
                    selpro: 'HR_SEL_8010070_ORG_INFO',
                    updpro: 'HR_UPD_8010070_ORG_INFO',
                    para: [this.selectedMenu.PK],
                    elname: this.params,
                    data: this.data
                }
                const result = await this._dsoCall(dso, 'update', true)
                if (result) {
                    this.data = result;

                } else {
                    this.showNotification("danger", this.$t("error_occurs"), '');
                }
                this.getMenuList();
            },

            async onAdd() {
                this.initOject();
                this.data.P_PK = this.P_PK_N;
                this.data.UPPER_ORG = this.UPPER_ORG_N;
            },


            async onAddSub() {
                this.initOject();
                if (!this.P_PK) {
                    this.showNotification('danger', this.$t('please_select_the_parent_node_first'), '');
                }
                this.data.P_PK = this.P_PK;
                this.data.UPPER_ORG = this.UPPER_ORG;
                //console.log(this.UPPER_ORG);
            },

            async onDelete() {
                if (this.data._rowstatus !== 'i' && this.selectedMenu._rowstatus !== 'u') {
                    this.data._rowstatus = 'd';
                }
                //debugger;
                const dso = {
                    type: 'control',
                    selpro: 'HR_SEL_8010070_ORG_INFO',
                    updpro: 'HR_UPD_8010070_ORG_INFO',
                    para: [this.selectedMenu.PK],
                    elname: this.params,
                    data: this.data
                }
                const result = await this._dsoCall(dso, 'update', true)
                if (result) {
                    this.data = result;

                } else {
                    this.showNotification("danger", this.$t("error_occurs"), '');
                }
                this.getMenuList();
            },

            async getOrgList() {

                const dso = {
                    type: 'list',
                    selpro: 'HR_SEL_LIST_ORG_NOCACHE',
                    para: [this.selectedCompany],   //type array[]
                }

                const result = await this._dsoCall(dso, 'select', false);
                if (result) {
                    this.orgListFrom = [];
                    this.orgListTo = [];

                    this.orgListFrom = result;
                    this.selectedOrgFrom = this.orgListFrom[0].PK;

                    this.orgListTo = result;
                    this.selectedOrgTo = this.orgListTo[0].PK;
                } else {
                    this.orgListFrom = [];
                    this.orgListTo = [];
                }
            },

            async onMoveEmp() {

                const dso = {
                    type: 'process',
                    updpro: 'HR_PRO_8010070_ORG_INFO',
                    para: [this.data.selectedOrgFrom, this.data.selectedOrgTo, '1']
                }

                const result = await this._dsoCall(dso, 'process', false)
                if (result) {
                    const rtn = result[0];
                    if (rtn.PK > 0)
                        this.showNotification("success", this.$t("success"), rtn.PK + '-Employees');
                } else {
                    this.showNotification("danger", this.$t("error_occurs"), '');
                }
                this.getMenuList();
                this.getOrgList();
            },

            async onMoveOrg() {

                const dso = {
                    type: 'process',
                    updpro: 'HR_PRO_8010070_ORG_INFO',
                    para: [this.data.selectedOrgFrom, this.data.selectedOrgTo, '0']
                }

                const result = await this._dsoCall(dso, 'process', false)
                if (result) {
                    const rtn = result[0];
                    if (rtn.PK > 0)
                        this.showNotification("success", this.$t("success"), '');

                } else {
                    this.showNotification("danger", this.$t("error_occurs"), '');
                }
                this.getMenuList();
                this.getOrgList();
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
