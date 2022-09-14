<template>
    <v-container fluid class="px-0 pt-0">

        <BaseTabs>
            <BaseTab :name="$t('schedule')" :eager="false">

                <v-row class="px-4 py-1" justify="center" align="center">
                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <HROrg :lstData="orgList" v-model="selectedOrg"></HROrg>
                    </v-col>

                    <v-col cols="12" lg="3" class="px-1 py-1">
                        <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('work_group')" :lstData="wgList" v-model="selectedWg"> </BaseSelect>
                    </v-col>

                    <v-col cols="12" lg="3" class="px-0 py-1">
                        <v-radio-group v-model="selectedType" class="py-0 my-0" hide-details>
                            <v-row no-gutters>
                                <v-col cols="12" lg="6" class="px-1 ">
                                    <v-radio :label="$t('schedule')" value="1" color="blue" class="py-0 my-0"></v-radio>
                                </v-col>
                                <v-col cols="12" lg="6" class="px-1 ">
                                    <v-radio :label="$t('not_schedule')" value="2" color="blue" class="py-0 my-0"></v-radio>
                                </v-col>
                            </v-row>
                        </v-radio-group>
                    </v-col>


                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch" v-bind:disabled.sync="isProcessing" />
                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onSave" v-bind:disabled.sync="isProcessing" />
                        </v-row>

                    </v-col>
                </v-row>

                <v-row class="px-4 py-1" justify="center" align="center">
                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <BaseInput :outlined="true" :label="$t('name_id')" v-model="searchText" @keyPressEnter="onSearch" />
                    </v-col>


                    <v-col cols="12" lg="3" class="px-0 py-1">
                        <v-radio-group v-model="selectedType" class="py-0 my-0" hide-details>
                            <v-row no-gutters>
                                <v-row no-gutters>
                                    <v-col cols="12" lg="6" class="px-1 ">
                                        <BaseDatePicker default :clearable="false" v-model="selectedFromDate" outlined :label="$t('from')" class="px-0"></BaseDatePicker>
                                    </v-col>
                                    <v-col cols="12" lg="6" class="px-1 ">
                                        <BaseDatePicker default :clearable="false" v-model="selectedToDate" outlined :label="$t('to')" class="px-0"></BaseDatePicker>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-radio-group>
                    </v-col>


                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <table style="width:100%; height:100%" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <BaseSelect :outlined="true" item-value="CODE" item-text="NAME" :label="$t('set_holiday')" :lstData="holTypeList" v-model="selectedSetHol"> </BaseSelect>
                                </td>
                                <td style="width: 15px"><BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="onSet" v-bind:disabled.sync="isProcessing" /></td>
                            </tr>
                        </table>
                    </v-col>

                    <v-col cols="12" lg="3" class="px-1 py-1">
                        <hr-import :label="$t('import')"
                                   :tempfile="'report/80/11/tmp_8011060_import_workshift.xlsx'"
                                   :proc="'HR_IMP_8011060_WORKSHIFT'"
                                   :start_row="3"
                                   :add_param="imp_add_param"
                                   :validate="imp_validate"></hr-import>
                    </v-col>

                </v-row>

                <BaseGridView ref='idGrid' :headertype="1"
                              :editable="true"
                              :height="limitHeight"
                              :header="header1"></BaseGridView>

            </BaseTab>

            <BaseTab :name="$t('month_schedule')" :eager="false">
                <v-row class="px-4 py-1" justify="center" align="center">
                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <HROrg :lstData="orgList" v-model="selectedOrg2"></HROrg>
                    </v-col>

                    <v-col cols="12" lg="3" class="px-1 py-1">
                        <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('work_group')" :lstData="wgList2" v-model="selectedWg2"> </BaseSelect>
                    </v-col>

                    <v-col cols="12" lg="3" class="px-1 py-1">
                        <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('period')" :lstData="periodList" v-model="selectPeriod2"> </BaseSelect>
                    </v-col>

                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch2" v-bind:disabled.sync="isProcessing" />
                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onSave2" v-bind:disabled.sync="isProcessing" />
                        </v-row>

                    </v-col>
                </v-row>

                <v-row class="px-4 py-1" justify="center" align="center">
                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <BaseInput :outlined="true" :label="$t('name_id')" v-model="searchText2" @keyPressEnter="onSearch2" />
                    </v-col>

                    <v-col cols="12" lg="3" class="px-1 py-1">
                        <BaseDatePicker default month v-model="selectedMonth2" outlined :clearable="false" :label="$t('work_month')" class="px-0"></BaseDatePicker>
                    </v-col>

                    <v-col cols="12" lg="3" class="px-1 py-1">
                        <v-row no-gutters>
                            <v-col cols="12" lg="6" class="px-1 ">
                                <BaseDatePicker start v-model="selectedFromDate2" outlined :label="$t('from')" class="px-0" readonly></BaseDatePicker>
                            </v-col>
                            <v-col cols="12" lg="6" class="px-1 ">
                                <BaseDatePicker end v-model="selectedToDate2" outlined :label="$t('to')" class="px-0" readonly></BaseDatePicker>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" lg="3" class="py-1 px-1">
                        <BaseButton btn_type="text" icon_type="text" :btn_text="$t('work_shift_info')" @onclick="onShowWS" v-bind:disabled.sync="isProcessing" />
                    </v-col>
                </v-row>

                <BaseGridView ref='idGrid2' :headertype="1"
                              :editable="true"
                              :height="limitHeight"
                              :header="header2"></BaseGridView>


            </BaseTab>
        </BaseTabs>

        <ws-dialog ref="WsDialog" @closewsDialog="WsDialog = false" :multiSelectMode="false"></ws-dialog>
    </v-container>
</template>






<script>
    import WsDialog from '@/components/dialog/WorkshiftDialog';
    import HROrg from '@/components/part/10/controls/hr_organization.vue';
    import moment from "moment"
    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import 'sweetalert2/src/sweetalert2.scss'
    import HRImport from '@/components/part/10/controls/hr_import.vue';

    export default {
        layout: 'default',
        middleware: 'user',

        components: {
            'ws-dialog': WsDialog,
            HROrg
            , 'hr-import': HRImport,
        },

        data: () => ({
            orgList: [],
            wgList: [],
            wgList2: [],
            holTypeList: [],
            shiftList: [],
            header1: [],
            header2: [],
            periodList: [],

            selectedCompany: null,
            selectedCompany2: null,
            selectedOrg: null,
            selectedOrg2: null,
            selectedWg: 'ALL',
            selectedWg2: 'ALL',
            selectedType: "1",
            searchText: '',
            searchText2: '',
            selectedSetHol: 'SUN',
            selectPeriod2: null,

            selectedMonth2: null,
            selectedFromDate: null,
            selectedToDate: null,

            selectedFromDate2: null,
            selectedToDate2: null,
            selectedImport: '01',
            import_template: '',
            importStatus: '',
            //import
            imp_validate: "",
            imp_add_param: []
        }),

        watch: {
            selectedOrg: function (value) {
                if (value) {
                    let selOrg = this.orgList.find(q => q["PK"] == value);
                    if (this.selectedCompany == selOrg["TCO_COMPANY_PK"]) return;
                    this.selectedCompany = selOrg["TCO_COMPANY_PK"];
                    this.changeOrg1();
                }
            },
            selectedOrg2: function (value) {
                if (value) {
                    let selOrg = this.orgList.find(q => q["PK"] == value);
                    if (this.selectedCompany2 == selOrg["TCO_COMPANY_PK"]) return;
                    this.selectedCompany2 = selOrg["TCO_COMPANY_PK"];
                    this.changeOrg2();
                }
            },
            selectPeriod2(value) {
                if (value && this.selectedMonth2) {
                    this.getMonthInfo();
                }
            },
            selectedMonth2(value) {
                if (value && this.selectPeriod2) {
                    this.getMonthInfo();
                }
            },
        },


        computed:
        {
            user: function () {
                return this.$store.getters["auth/user"];
            },
            limitHeight() { return this.windowHeight - 310 },

        },

        created() {
            this.prepareCommonData();
        },



        methods: {
            async prepareCommonData() {
                this.orgList = await this._getOrgByUser(this.user.PK);
            },

            async changeOrg1() {
                this.wgList = await this._getWorkGroup(this.selectedCompany);
                this.wgList.unshift({ PK: "ALL", TEXT: this.$t("select_all") });
                this.shiftList = await this._getWorkShift(this.selectedCompany);
                this.holTypeList = await this._getCommonCode('COAB0140', this.selectedCompany);

                this.header1 = [
                    { title: ("organization"), field: "TCO_ORG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.orgList }, width: 200 },
                    { title: ("work_group"), field: "THR_WG_PK", editable: true, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList }, width: 200 },
                    { title: ("emp_id"), field: "EMP_ID", editable: false, type: "" },
                    { title: ("full_name"), field: "FULL_NAME", editable: false, type: "", width: 200 },
                    { title: ("work_dt"), field: "WORK_DT", editable: false, type: "date" },
                    { title: ("hol_type"), field: "HOL_TYPE", editable: true, type: "list", datasource: { KEY: 'CODE', VALUE: 'NAME', data: this.holTypeList }, cellclassname: this.cellClassName },
                    { title: ("work_shift"), field: "THR_WS_PK", editable: true, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.shiftList }, width: 400 },
                ];

                this.$refs.idGrid.Clear();

            },

            async changeOrg2() {
                this.wgList2 = await this._getWorkGroup(this.selectedCompany2);
                this.wgList2.unshift({ PK: "ALL", TEXT: this.$t("select_all") });

                await this.getSalaryPeriod();
                await this.getMonthInfo();

                this.$refs.idGrid2.Clear();

            },

            async getSalaryPeriod() {
                const dso = {
                    type: 'list',
                    selpro: 'hr_sel_1030010_sal_period',
                    para: [this.selectedCompany2]
                }
                const result = await this._dsoCall(dso, 'select', false)
                if (result) {
                    this.periodList = result;
                } else {
                    this.periodList = []
                }
            },

            async getMonthInfo() {
                const dso = {
                    type: 'control',
                    selpro: 'hr_sel_8011050_month_info',
                    para: [this.selectedCompany2, this.selectPeriod2, this.selectedMonth2]
                }

                const result = await this._dsoCall(dso, 'select', false)
                if (result) {
                    //debugger;
                    this.selectedFromDate2 = result["FROM"];
                    this.selectedToDate2 = result["TO"];
                }
                this.changeHeader2();
            },

            async changeHeader2() {
                this.header2 = [
                    { title: ("tco_org_pk"), field: "TCO_ORG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.orgList }, width: 200 },
                    { title: ("thr_wg_pk"), field: "THR_WG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList2 }, width: 200 },
                    { title: ("emp_id"), field: "EMP_ID", editable: false, type: "" },
                    { title: ("full_name"), field: "FULL_NAME", editable: false, type: "", width: 200 },
                ];

                let startDate = moment(String(this.selectedFromDate2), "YYYYMMDD");
                let endDate = (moment(String(this.selectedToDate2), "YYYYMMDD")).add(1, 'days');
                let i = 1;

                for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
                    this.header2.push({ title: d.date() + "", field: "D" + i, editable: true, type: "", alignment: "center", width: 50, cellclassname: this.cellClassName2 });
                    i++;
                }
            },

            cellClassName(row, columnfield, value, rowdata) {
                if (rowdata.HOL_TYPE == "HOL") {
                    return "cellHolCar";
                }
                if (rowdata.HOL_TYPE == "SUN") {
                    return "cellSunCar";
                }
                return this.cellClassStatus(rowdata);
            },

            cellClassName2(row, columnfield, value, rowdata) {
                //console.log(columnfield);
                if (rowdata[columnfield + "_TYPE"] == "HOL") {
                    return "cellHolCar";
                }
                if (rowdata[columnfield + "_TYPE"] == "SUN") {
                    return "cellSunCar";
                }
                return this.cellClassStatus(rowdata);
            },

            onShowWS() {
                this.$refs.WsDialog.dialogIsShow = true;
            },

            onSet() {
                let setValue = this.selectedSetHol;
                this.$refs.idGrid.onSet('HOL_TYPE', setValue);
            },



            async onSearch(p_search) {

                let pa = [this.selectedOrg, this.selectedWg, this.selectedFromDate, this.selectedToDate, this.searchText, this.selectedType];
                const dso = {
                    type: 'grid',
                    selpro: 'HR_sel_8010060_empsh_nocache',
                    para: pa
                }

                this.$refs.idGrid.onSearch(dso);
            },

            async onSave() {
                let pa = [this.selectedOrg, this.selectedWg, this.selectedFromDate, this.selectedToDate, this.searchText, this.selectedType];

                const dso = {
                    type: 'grid',
                    selpro: 'HR_sel_8010060_empsh_nocache',
                    updpro: 'hr_upd_8010060_emp_shift',
                    para: pa,
                    elname: [
                        "_rowstatus", 'PK', 'THR_WG_PK', 'OLD_THR_WG_PK', 'WORK_DT', 'HOL_TYPE', 'THR_WS_PK', 'THR_EMP_PK'
                    ],
                    requirecol: [
                        'THR_WG_PK', 'THR_WS_PK'
                    ]
                }
                this.$refs.idGrid.onSave(dso);
            },

            async onSearch2(p_search) {

                let pa = [this.selectedOrg2, this.selectedWg2, this.selectedMonth2.replace(/[^0-9]/g, ''), this.selectedFromDate2, this.selectedToDate2, this.searchText2];
                const dso = {
                    type: 'grid',
                    selpro: 'HR_sel_8010060_mon_sch',
                    para: pa
                }

                this.$refs.idGrid2.onSearch(dso);
            },

            async onSave2() {
                let pa = [this.selectedOrg2, this.selectedWg2, this.selectedMonth2.replace(/[^0-9]/g, ''), this.selectedFromDate2, this.selectedToDate2, this.searchText2];

                this.$refs.idGrid2.onSetAll("FROM", this.selectedFromDate2, false);
                this.$refs.idGrid2.onSetAll("TO", this.selectedToDate2, false);


                const dso = {
                    type: 'grid',
                    selpro: 'hr_sel_8010060_mon_sch',
                    updpro: 'hr_upd_8010060_mon_sch',
                    para: pa,
                    elname: [
                        "_rowstatus", 'THR_EMP_PK',
                        "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10",
                        "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20",
                        "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30", "D31",
                        "FROM", "TO"
                    ]
                }
                this.$refs.idGrid2.onSave(dso);
            },
        },





    }
</script>
<style>
    .cellHolCar {
        background-color: #eb8c34 !important;
    }

    .cellSunCar {
        background-color: #3bb7ff !important;
    }
</style>