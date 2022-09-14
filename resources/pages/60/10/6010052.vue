<template>
<v-container fluid class="px-0 pt-0" v-resize="onResize">
    <v-row no-gutters v-resize="onResize">
        <v-col cols="12">
            <v-tabs v-model="tab" left background-color="#6886b9" color="white">
                <v-tab ref="accCdEntry">{{ $t("cost_center_entry") }}</v-tab>
                <v-tab ref="accCdInquiry">{{ $t("cost_center_inquiry") }}</v-tab>
                <!--Tab Account Code Entry-->
                <v-tab-item>
                    <template>
                        <v-container fluid class="pa-0">
                            <v-row no-gutters>
                                <v-col lg="4" md="4" sm="5" cols="12">
                                    <v-card outlined tile :height="limitHeight" :style="`overflow-y: scroll;`">
                                        <v-container fluid>
                                            <!-- Search Panel -->
                                            <v-row dense align="center" justify="center">
                                                <v-col cols="12">
                                                    <v-select dense hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany"></v-select>
                                                </v-col>
                                            </v-row>

                                            <v-row dense align="center" justify="center">
                                                <v-col cols="11">
                                                    <v-text-field dense v-model="txt_SPLC_CD" clearable :label="$t('biz_center_code')" hide-details></v-text-field>
                                                </v-col>
                                                <v-col cols="1">
                                                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onTab1Search">
                                                        <v-icon>mdi-magnify</v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                            <v-row dense align="center" justify="center">
                                                <v-col cols="12">
                                                    <v-text-field dense v-model="txt_SPLC_NM" clearable :label="$t('biz_center_name')" hide-details></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row dense align="center" justify="center">
                                                <v-col cols="12">
                                                    <v-card v-resize="onResize" :disabled="isRendering" outlined class="overflow-y-80vh-container">
                                                        <v-card-text class="pa-0">
                                                            <v-treeview dense open-all :open="listTreeAcc" hoverable class="pointer flex-shrink-1 text-caption" :active.sync="active" item-key="PK" item-text="FORM_NM" :items="listTreeAcc" item-children="childMenu" activatable transition return-object @update:active="onSelectAccNode">
                                                                <template v-slot:prepend="{ item, open }">
                                                                    <v-icon v-if="item.LEAF === 0">{{
                                    open ? "mdi-folder-plus" : "mdi-folder-plus"
                                  }}</v-icon>
                                                                    <v-icon v-else>mdi-folder</v-icon>
                                                                </template>
                                                            </v-treeview>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                                <!--Free form Account Code Entry-->
                                <v-col lg="8" md="8" sm="7" cols="12">
                                    <v-container fluid class="py-0">
                                        <v-row dense align="start" justify="space-between">
                                            <v-col cols="12">
                                                <v-row dense align="center">
                                                    <v-col cols="4">
                                                        <v-text-field dense v-model="txt_PL_CD" :label="$t('cost_center_code')" @keypress.enter="searchMaster" hide-details></v-text-field>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-text-field dense v-model="txt_PL_NM" :label="$t('cost_center_name')" hide-details @keypress.enter="searchMaster"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="2">
                                                        <v-checkbox class="pt-0 mt-0" v-model="chkActive" :label="$t('active')" dense hide-details v-show="false"></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                                <v-row dense align="center" justify="space-between" class="pa-2">
                                                    <v-col cols="12" class="pt-2 px-2">
                                                        <DataGirdView ref="idGridInfo" :header="[
                                    { dataField: 'P_PK',    caption: this.$t('p_pk'),  visible: false  , allowEditing: true },
                                    { dataField: 'PK',      caption: this.$t('pk') , allowEditing: true ,visible: false},
                                    { dataField: 'PL_CD',   caption: this.$t('pl_cd') , allowEditing: true },
                                    { dataField: 'PL_NM',   caption: this.$t('pl_nm') , allowEditing: true },
                                    { dataField: 'PL_LNM',  caption: this.$t('pl_lnm') , allowEditing: true},
                                    { dataField: 'PL_FNM',  caption: this.$t('pl_fnm') , allowEditing: true},
                                    { dataField: 'PK_R',    caption: this.$t('pk_r') , allowEditing: true,visible: false},
                                    { dataField: 'CODE',    caption: this.$t('code') , allowEditing: true},
                                    { dataField: 'NAME',    caption: this.$t('name') , allowEditing: true}   
                                  ]" sel_procedure="AC_SEL_6010052_ABPLC_INFO" upd_procedure="" 
                                  :struct_obj="['P_PK','PK','PL_CD','PL_NM','PL_LNM','PL_FNM','PK_R','CODE','NAME']" 
                                  select_mode="Multiple" 
                                  :update_paras="['P_PK','PK','PL_CD','PL_NM','PL_LNM','PL_FNM','PK_R','CODE','NAME']" 
                                  :paste_cols="['P_PK','PK','PL_CD','PL_NM','PL_LNM','PL_FNM','PK_R','CODE','NAME']"
                                   :auto_load="false" :max_height="limitHeightD" 
                                   :default_value="{TCO_COMPANY_PK:this.selectedCompany2}" 
                                   :filter_paras="[this.selectedCompany,this.pLC_PK,this.txt_PL_CD,this.txt_PL_NM]"
                                    @onSelectionChanged="selectionGridInfo" 
                                    @onRowPrepared="onFillBackgroundAccCodeInq" />
                                                    </v-col>
                                                </v-row>
                                                <v-row dense>
                                                    <v-col cols="12">
                                                        <v-btn icon tile dark color="success" @click="onSelect" :title="$t('btn_get')">
                                                            <v-icon>mdi-check</v-icon>
                                                        </v-btn>
                                                        <v-btn icon depressed tile color="error" :disabled="isProcessing" @click="onDelete">
                                                            <v-icon>{{
                                  selectionMode === "none"
                                    ? "mdi-delete-outline"
                                    : "mdi-delete-empty"
                                }}</v-icon>
                                                        </v-btn>
                                                        <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onSave">
                                                            <v-icon>mdi-content-save</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-row dense align="center" justify="space-between" class="pa-2">
                                                    <v-col cols="12">
                                                        <v-card outlined tile v-resize="onResize">
                                                            <DataGirdView ref="idGridUse" :header="[
                                    { dataField: 'PK',              caption: this.$t('pk'),  width: '100'  , allowEditing: true,visible: false },
                                    { dataField: 'TAC_ABPL_PK',     caption: this.$t('tac_abpl_pk') , allowEditing: true,visible: false },
                                    { dataField: 'TAC_ABCENTER_PK', caption: this.$t('tac_abcenter_pk') , allowEditing: true,visible: false },
                                    { dataField: 'PL_CD',           caption: this.$t('pl_cd') , allowEditing: true },
                                    { dataField: 'PL_NM',           caption: this.$t('pl_nm') , allowEditing: true},
                                    { dataField: 'REMARK',          caption: this.$t('remark') , allowEditing: true},
                                    { dataField: 'PLC_CD',          caption: this.$t('plc_cd') , allowEditing: true},
                                    { dataField: 'PLC_NM',          caption: this.$t('plc_nm') , allowEditing: true}  
                                  ]" sel_procedure="AC_SEL_6010052_PLCL_INFO" upd_procedure="AC_UPD_6010052_PLCL_INFO" 
                                  :struct_obj="['PK','TAC_ABPL_PK','TAC_ABCENTER_PK','PL_CD','PL_NM','REMARK','PLC_CD','PLC_NM']" 
                                  select_mode="MultipleHideBox" 
                                  :update_paras="['PK','TAC_ABPL_PK','TAC_ABCENTER_PK','PL_CD','PL_NM','REMARK','PLC_CD','PLC_NM']" 
                                  :paste_cols="['PK','TAC_ABPL_PK','TAC_ABCENTER_PK','PL_CD','PL_NM','REMARK','PLC_CD','PLC_NM']" 
                                  :auto_load="false" :max_height="limitHeightD"
                                   @callSaveResult="afterSave" 
                                   :default_value="{TCO_COMPANY_PK:this.selectedCompany2}" 
                                   :filter_paras="[this.pLC_PK]" 
                                   @onSelectionChanged="selectionGridTab2" @onRowPrepared="onFillBackgroundAccCodeInq" />
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>
                </v-tab-item>
                <!--Tab Account Code Inquiry-->
                <v-tab-item>
                    <template>
                        <v-container fluid class="pa-0">
                            <v-row no-gutters>
                                <v-col cols="12" class="pt-2">
                                    <v-row dense justify="start">
                                        <v-col cols="2">
                                            <v-select dense hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany2"></v-select>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field dense v-model="txt_PL_CD_L" clearable :label="$t('cost_center_code')" hide-details @keypress.enter="onTab2Search"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field dense v-model="txt_PL_NM_L" :label="$t('cost_center_name')" hide-details @keypress.enter="onTab2Search"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field dense v-model="txt_PLC_CD_L" :label="$t('biz_center_code')" hide-details @keypress.enter="onTab2Search"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field dense v-model="txt_PLC_NM_L" :label="$t('biz_center_name')" hide-details @keypress.enter="onTab2Search"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onTab2Search">
                                                <v-icon>mdi-magnify</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row dense>
                                        <v-col cols="12">
                                            <v-card outlined tile v-resize="onResize">
                                                <DataGirdView ref="gridTab2" :header="[
                            { dataField: 'PL_CD', caption: this.$t('pl_cd'),  width: '100'  , allowEditing: true },
                            { dataField: 'PL_NM',  caption: this.$t('pl_nm') , allowEditing: true },
                            { dataField: 'PLC_CD',  caption: this.$t('plc_cd') , allowEditing: true },
                            { dataField: 'PLC_NM',  caption: this.$t('plc_nm') , allowEditing: true }   
                           ]" sel_procedure="AC_SEL_6010052_PLCL_LIST" upd_procedure="" :struct_obj="['PL_CD', 'PL_NM','PLC_CD', 'PLC_NM']" select_mode="MultipleHideBox" :update_paras="['PL_CD', 'PL_NM','PLC_CD', 'PLC_NM']" :paste_cols="['PL_CD', 'PL_NM','PLC_CD', 'PLC_NM']" :auto_load="false" :default_value="{TCO_COMPANY_PK:this.selectedCompany2}" :filter_paras="[this.selectedCompany2, this.txt_PL_CD_L,this.txt_PL_NM_L,this.txt_PLC_CD_L,this.txt_PLC_NM_L]" @onSelectionChanged="selectionGridTab2" @onRowPrepared="onFillBackgroundAccCodeInq" />
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>
                </v-tab-item>
            </v-tabs>
        </v-col>
    </v-row>
    <account-dialog ref="accountDialog" @returnAccountInfo="getUppAccDialog"></account-dialog>

    <account-dialog ref="accountDialog3" @returnAccountInfo="getAccCodeAccCodeIFRS"></account-dialog>

    <itemaccount-dialog ref="dlgItemAcc" @returnItemAccountInfo="onSelectItemAccount"></itemaccount-dialog>

    <delete-dialog ref="deleteDialog1" :deleteProps="deleteProps1" @returnDeletedItem="removeDeletedItem1"></delete-dialog>
    <delete-dialog ref="deleteAccCodeInq" :deleteProps="deletePropsTab2" @returnDeletedItem="removeAccCodeInq"></delete-dialog>
    <delete-dialog ref="deleteDialog3" :deleteProps="deleteProps3" @returnDeletedItem="removeDeletedItem3"></delete-dialog>
</v-container>
</template>

<script>
import listToTree from "list-to-tree-lite";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import DeleteDialog from "@/components/dialog/DeleteDialog.vue";
import AccountDialog from "@/components/dialog/StandardAccountDialog.vue";
import ItemAccountDialog from "@/components/dialog/ItemAccountDialog.vue";
import DatePicker from "@/components/control/DatePicker.vue";
import DataGirdView from '@/components/control/DataGridView.vue';
export default {
    layout: "default",
    middleware: "user",

    components: {
        CellGridCheckbox,
        "account-dialog": AccountDialog,
        "delete-dialog": DeleteDialog,
        "itemaccount-dialog": ItemAccountDialog,
        "date-picker": DatePicker,
        DataGirdView
    },

    data: () => ({
        //account dialog
        accountDialog: false,
        itemAccountDialog: false,

        // Tab 1
        // searched fields
        date: "",
        menu: false,
        selectedCompany: "",
        txt_SPLC_CD: "",
        txt_SPLC_NM: "",
        listTreeAcc: [],
        selectedAccNode: [],
        active: [],

        //data source
        companyList: [],
        listLevel: [],
        listCcy: [],
        listDrCrItemAcc: [],

        listPostSum: [{
                CODE: "Y",
                NAME: "Posting"
            },
            {
                CODE: "N",
                NAME: "Summary"
            }
        ],
        listRptType: [{
                CODE: "Y",
                NAME: "Balance Sheet"
            },
            {
                CODE: "N",
                NAME: "Profit & Loss"
            }
        ],

        //data source grids
        listItemAcc: [],
        listGridTab2: [],
        listGridTab3: [],

        //Process
        //selected tab Parent
        tab: "",
        //select tab Sub
        tabSub: "",

        //render treeview
        isRendering: false,
        //Processing button
        isProcessing: false,
        //Selection mode
        selectionMode: "single",

        //Models
        pLC_PK: "",
        txt_PLC_PK: "",
        accountCodeDtl: [],
        upperAccPK: "",
        chkActive: true,
        chkCustomer: false,
        chkCustBal: false,
        chkProfCost: false,
        chkBudget: false,
        chkBudgetCtrl: false,
        chkEmpCtrl: false,
        chkBankCtrl: false,
        chkOffBalSheetAcc: false,
        chkCardCtrl: false,
        itemTypeDesc: "",
        currBal: "",
        selPLType: "",
        selBudgetType: "",
        selAcType: "",
        selAcGrp: "",

        //Tab Item Account selected PK
        selItemAccPK: "",
        selectedItemAccRowIdx: "",

        //selected row tab Item Account
        selectedItemAcc: [],
        selectedItemAccKeys: [],
        disabledItemAcc: false,

        //selected account code entry tab 1
        selectedAccCodeEntry: [],

        // tab 2 Account Code Inquiry
        defaultParas: null,
        selectedCompany2: "",
        txt_PL_CD_L: "",
        txt_PL_NM_L: "",
        txt_PLC_CD_L: "",
        txt_PLC_NM_L: "",
        selectedAccCodeInqKeys: [],
        selectedGridInfo: [],
        cbo_ReportExcel: [],

        // tab 3
        selectedCompany3: "",
        accCode3: "",
        accName3: "",

        // tab Item Type from date and to date
        menu1: false,
        date1: "",
        menu2: false,
        date2: "",

        //Delete Dialog
        deleteProps1: [],
        deletePropsTab2: [],
        deleteProps3: [],

        selectedAcCDTab1: [],
        bookCcy: "VND",
        txt_PL_NM: "",
        txt_PL_CD: ""
    }),

    created() {
        this.getCompanyList();
        // get user logged in Information

        this.selectedAccCodeEntry._rowstatus = 'i';

    },

    computed: {
        getUser: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 220;
        },
        limitHeightD() {
            return (this.windowHeight - 250) / 2;
        }
    },

    mounted() {
        const user = this.getUser;

        this.selectedCompany = user.TCO_COMPANY_PK;

        this.selectedCompany2 = user.TCO_COMPANY_PK;

        this.selectedCompany3 = user.TCO_COMPANY_PK;

        // this.onTab1Search();
    },

    methods: {

        selectionGridTab3() {},

        addNewAccCdInq() {

        },
        async onExcel() {
            const cbo_ReportExcel = await this._getCommonCode('ACRPT01', this.selectedCompany2);
            var company_info = this.companyList.find(x => x.PK == this.selectedCompany2);
            var report_info = cbo_ReportExcel.find(x => x.CODE == "6015010_T2");
            if (report_info.VAL1 == "" || report_info.VAL1 == "null" || report_info.VAL1 == null || report_info.VAL1 == undefined) {
                var MSG_ERR = "PLS_REGISTER_REPORT_ID_WITH_COMONCODE_" + "ACRPT01";
                this.$refs.alertDialog.showAlert("error", "Error", MSG_ERR);
                return;
            }

            var param = [{
                P_RPT_ID: report_info.VAL1,
                P_RPT_URL: report_info.VAL2,
                P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID,
                P_COMP_NM: company_info.TEXT,
                P_COMP_TAX: company_info.TAX_CODE,
                P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany2,
                P_ACC_CODE: this.txt_PL_CD_L,
                P_ACC_NAME: this.txt_PL_NM_L
            }];
            var file_nm = 'RPT' + "_" + report_info.CODE + "_" + this.getUser.USER_ID + ".xlsx";
            var url_path = "/report/" + report_info.VAL1 + "/" + report_info.VAL3;

            try {
                const result = await this.$axios.$get(url_path, {
                    responseType: "blob",
                    params: {
                        para: param
                    }
                });
                if (result) {

                    this._ExcelSaveAs(result, file_nm);
                } else {
                    this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
                }
            } catch (e) {
                this.showNotification("danger", e.message, "", 4000);
            }
        },
        //***************************************Tab Account Code VAS-IFRS********************************************* */
        onResetSearchTab3() {
            this.accCode3 = "";
            this.accName3 = "";
        },

        openAccDialogTab3() {
            this.$refs.accountDialog3.dialogIsShow = true;
        },

        getAccCodeAccCodeIFRS(item) {
            this.accCode3 = item.AC_CD;
            this.accName3 = item.AC_NM;
        },

        onRowPreparedAccCodeIFRS(e) {
            if (e.rowType == "data") {
                if (e.data.AC_LEVEL === "1") {
                    e.rowElement.style.backgroundColor = "#E9967A";
                } else if (e.data.LEAF_YN === "N") {
                    e.rowElement.style.backgroundColor = "#00FF87";
                }
            }
        },

        onTab3Search() {
            this.getAccCodeInq();
        },

        removeDeletedItem3() {},

        async getAccCodeInq() {
            let pa = [];

            let p_com_pk = this.selectedCompany3 ? this.selectedCompany3 : "";

            let p_accd = this.accCode3 ? this.accCode3.trim() : "";

            pa = [p_com_pk, p_accd];

            const dso = {
                type: "grid",
                selpro: "ac_sel_6015016_accifrs_inqui",
                para: pa //type array[]
            };
            this.listGridTab3 = await this._dsoCall(dso, "select", false);
        },

        //***************************************Tab Account Code Inquiry******************************/

        getAccCodeItem(item) {
            this.txt_PL_CD_L = item.AC_CD;
            this.txt_PL_NM_L = item.AC_NM;
        },

        selectionGridInfo({
            selectedRowsData
        }) {
            this.selectedGridInfo = selectedRowsData;
        },
        selectionGridTab2({
            selectedRowsData
        }) {
            this.selectedAccCodeInqKeys = selectedRowsData.map(x => x.PK);
        },

        checkUpdGridTab2(data) {
            if (!data.cancel) {
                if (data.data._rowstatus !== "i") {
                    data.data._rowstatus = "u";
                }
            }
        },

        removeAccCodeInq(deletedItemPK, arrayName) {
            this.onSave();
        },

        onDelete() {
            this.$refs.idGridUse.deleteRows()
        },

        onAddTab2() {
            this.$refs.gridTab2.addRowStruct({
                PK: "",
                UAC_CD: "",
                AC_CD: '',
                AC_NM: "",
                AC_LNM: "",
                AC_KNM: "",
                DRCR_TYPE: "",
                LEAF_YN: "",
                CARRY_YN: "",
                AC_LEVEL: "",
                CUST_YN: "",
                CUST_REMYN: "",
                PL_YN: "",
                PL_TYPE: "",
                BUDGET_YN: "",
                BUDGET_TYPE: "",
                BGCON_YN: "",
                TCO_COMPANY_PK: this.selectedCompany2
            }, 1);

        },

        onSave() {
            this.$refs.idGridUse.saveData()
        },

        onFillBackgroundAccCodeInq(e) {
            if (e.rowType == "data") {
                if (e.data.AC_LEVEL === "1") {
                    e.rowElement.style.backgroundColor = "#E9967A";
                } else if (e.data.LEAF_YN === "N") {
                    e.rowElement.style.backgroundColor = "#00FF87";
                }
            }
        },

        onTab2Search() {
            this.$refs.gridTab2.loadData();
        },

        async getListAccCodeInq(paramsData) {
            const dso = {
                type: "grid",
                selpro: "AC_SEL_6015016_ACC_INQUIRY",
                para: paramsData
            };
            this.listGridTab2 = await this._dsoCall(dso, "select", false);

            this.$refs.gridTab2.instance.clearSelection();
        },

        //****************************************Tab Account Code Entry *****************************

        partListToTree(dataList) {
            let v_treeView = [];

            for (var i = 0; i < 1; i++) {
                let v_Item = dataList[i];
                let v_Node = {
                    PK: v_Item.PK,
                    FORM_NM: v_Item.FORM_NM,
                    P_PK: v_Item.P_PK,
                    LVL: v_Item.LVL,
                    childMenu: []
                };
                v_treeView.push(v_Node);
            }
            //console.log(v_treeView)

            for (var i = 1; i < dataList.length; i++) {
                let v_Pac_PK = dataList[i].P_PK;
                let v_PK = dataList[i].PK;

                let v_Parent = v_treeView.find(x => x.PK === v_Pac_PK);

                if (v_Parent) {
                    v_Parent.childMenu.push({
                        PK: v_PK,
                        FORM_NM: dataList[i].FORM_NM,
                        P_PK: v_Pac_PK,
                        LVL: dataList[i].LVL,
                        childMenu: []
                    });
                }
            }

            return v_treeView;
        },

        //selectionChanged grid Item Account
        selectionItemAcc({
            selectedRowsData
        }) {
            this.selectedItemAccKeys = selectedRowsData.map(x => x.PK);
        },

        async onSaveItemAccount() {
            const dataIsModified = this.listItemAcc.some(x => x._rowstatus !== "");

            if (dataIsModified) {
                this.$refs.gridItemAcc.instance.saveEditData();

                const dso = {
                    type: "grid",
                    selpro: "ac_sel_6015016_abacctitem",
                    updpro: "ac_upd_6015016_abacctitem",
                    para: [this.pLC_PK],
                    elname: [
                        "_rowstatus",
                        "PK",
                        "TAC_ABACCTCODE_PK",
                        "TAC_ABITEM_PK",
                        "TAC_ABITEM_ALIAS",
                        "TAC_ABITEM_LALIAS",
                        "DRCR_TYPE",
                        "MANDATORY_YN",
                        "REMAINED_YN",
                        "PRINTABLE_YN"
                    ],
                    requirecol: ["DRCR_TYPE"],
                    data: this.listItemAcc
                };
                const result = await this._dsoCall(dso, "update", true);
                if (result) {
                    this.listItemAcc = result;
                }
                this.$refs.gridItemAcc.instance.clearSelection();
            }
        },

        onDeleteItemAccount() {
            //alert('test')

            for (let i = 0; i < this.listItemAcc.length; i++) {
                const v_row = this.listItemAcc[i];

                for (let j = 0; j < this.selectedItemAccKeys.length; j++) {
                    const v_PK = this.selectedItemAccKeys[j];

                    if (v_PK === v_row.PK) {
                        if (v_row._rowstatus !== "d") {
                            v_row._rowstatus = "d";

                            this.setMarkedDeleteRowColor("gridItemAcc", true, i);
                        }
                    }
                }
            }
        },

        // open Item Account Dialog
        openItemAccDialog(item) {
            this.$refs.dlgItemAcc.dialogIsShow = true;

            this.selectedItemAcc = {
                ...item
            };
        },

        // select itemAccount va set tren grid Item Account
        onSelectItemAccount(item) {
            //console.log(this.selectedItemAcc)
            const selItem = this.selectedItemAcc;

            const itemAccIdx = this.listItemAcc.findIndex(x => x.PK === selItem.PK);
            if (itemAccIdx > -1) {
                if (!this.listItemAcc[itemAccIdx]._rowstatus) {
                    this.listItemAcc[itemAccIdx]._rowstatus = "u";
                }
                this.listItemAcc[itemAccIdx].ITEM_NM = item.ITEM_NM;
                this.listItemAcc[itemAccIdx].ITEM_LNM = item.ITEM_LNM;
                this.listItemAcc[itemAccIdx].TAC_ABITEM_PK = item.PK;
                this.listItemAcc[itemAccIdx].TAC_ABITEM_ALIAS = item.ITEM_NM;
                this.listItemAcc[itemAccIdx].TAC_ABITEM_LALIAS = item.ITEM_LNM;
            }
        },

        // add item account tren grid
        onAddItemAccount() {
            this.listItemAcc.unshift({
                _rowstatus: "i",
                PK: Date.now(),
                TAC_ABACCTCODE_PK: this.pLC_PK,
                TAC_ABITEM_PK: "",
                ITEM_NM: "",
                ITEM_LNM: "",
                TAC_ABITEM_ALIAS: "",
                TAC_ABITEM_LALIAS: "",
                DRCR_TYPE: "A",
                MANDATORY_YN: "N",
                REMAINED_YN: "N",
                PRINTABLE_YN: "Y"
            });

            //this.$refs.gridItemAcc.instance.addRow()
        },

        // Check tren grid va set row status la u
        checkUpdItemAcc(data) {
            if (!data.cancel) {
                if (data.data._rowstatus !== "i") {
                    data.data._rowstatus = "u";
                }
            }
        },

        valueChanged(e, colName, rowPK) {
            const newValue = e ? "Y" : "N";
            this.changeValue(newValue, colName, rowPK, true);
            if (colName === "REMAINED_YN") {
                if (e) {
                    this.changeValue("Y", "MANDATORY_YN", rowPK, true);
                }
            }
        },

        changeValue(value, key, pk, isModified) {
            this.listItemAcc.map((item, index) => {
                if (item.PK === pk) {
                    this.$set(item, key, value);
                    if (isModified && item.PK) {
                        if (item._rowstatus === "") {
                            item._rowstatus = "u";
                        }
                    }
                }
            });
        },

        onSelectAccNode() {
            if (!this.active.length) {
                this.selectedAccNode = [];
                this.pLC_PK = "";
            } else {
                this.selectedAccNode = {
                    ...this.active[0]
                };
                this.pLC_PK = this.selectedAccNode.PK;
                this.$refs.idGridInfo.loadData();
                this.$refs.idGridUse.loadData();
            }
        },

        //Get thong tin tu AccountDialog
        getUppAccDialog(item) {
            if (item) {
                this.upperAccPK = item.PK;
                this.chkCustomer = item.CUST_YN === "Y" ? true : false;
                this.chkCustBal = item.CUST_REMYN === "Y" ? true : false;
                this.chkProfCost = item.PL_YN === "Y" ? true : false;

                this.selPLType = item.PL_TYPE ? item.PL_TYPE : "";
                this.selBudgetType = item.BUDGET_TYPE ? item.BUDGET_TYPE : "";
                this.selAcType = item.AC_TYPE ? item.AC_TYPE : "";
                this.selAcGrp = item.AC_GRP ? item.AC_GRP : "";
            } else {
                this.upperAccPK = "";
                this.chkCustomer = false;
                this.chkCustBal = false;
                this.chkProfCost = false;

                this.selPLType = "";
                this.selBudgetType = "";
                this.selAcType = "";
                this.selAcGrp = "";
            }
        },

        //Mo accountDialog
        openItemTypeAccDialog() {
            this.$refs.accountDialog.dialogIsShow = true;
        },

        onDeleteTab1() {
            //alert('1')
            this.$refs.deleteDialog1.dialogIsShow = true;

            //this.deleteProps1 = []
            this.deleteProps1 = {
                proc: "ac_upd_6015016_acc_entry",
                para: [
                    "d",
                    this.pLC_PK,
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ],
                arrayName: "ok"
            };
        },

        removeDeletedItem1(deletedItemPK, arrayName) {
            if (deletedItemPK > 0) {
                this.getTreeViewList();
            }
        },

        onTab1Search() {
            this.getTreeViewList();
        },

        //Save data
        async onSaveTab1() {
            let v_invalid = false;
            let v_count = 0;

            v_count++;
            if (l_accd == "") {
                this.showNotification(
                    "danger",
                    this.$t("req_accd"),
                    ""
                );
                v_invalid = true;
            } else {
                v_count++;
                if (l_ac_level == "") {
                    this.showNotification(
                        "danger",
                        this.$t("red_ac_level"),
                        ""
                    );
                    v_invalid = true;
                } else {
                    v_count++;
                    if (l_acnm == "") {
                        this.showNotification(
                            "danger",
                            this.$t("req_acnm"),
                            ""
                        );
                        v_invalid = true;
                    } else {
                        v_count++;

                        if (v_acsnm == "") {
                            this.showNotification(
                                "danger",
                                this.$t("req_sacnm"),
                                ""
                            );
                            v_invalid = true;
                        } else {
                            v_count++;

                            if (v_drcr_type == "") {
                                this.showNotification(
                                    "danger",
                                    this.$t("req_baltype"),
                                    ""
                                );
                                v_invalid = true;
                            }
                        }
                    }
                }
            }

            if (!v_invalid && v_count == 5) {
                this.isProcessing = true;

                let pa = [];

                let p_tac_abacctcode_pk = this.selectedAccCodeEntry.PK ?
                    this.selectedAccCodeEntry.PK :
                    "";

                let p_cust_yn = this.chkCustomer === true ? "Y" : "N";
                let p_cust_remyn = this.chkCustBal === true ? "Y" : "N";
                let p_pl_yn = this.chkProfCost === true ? "Y" : "N";
                let p_budget_yn = this.chkBudget === true ? "Y" : "N";

                let p_bgcon_yn = this.chkBudgetCtrl === true ? "Y" : "N";
                let p_remark = this.itemTypeDesc ? this.itemTypeDesc : "";
                let p_bal = "0";

                let p_std_dt = this.date1 ? this.date1 : "";
                p_std_dt = p_std_dt.replace(/-/g, "");
                let p_end_dt = this.date2 ? this.date2 : "";
                p_end_dt = p_end_dt.replace(/-/g, "");

                let p_use_yn = this.chkActive === true ? "Y" : "N";

                let p_pac_pk = this.upperAccPK ? this.upperAccPK : "";
                let p_level_temp = "";
                let p_com_pk = this.selectedCompany;

                let p_emp_ctl = this.chkEmpCtrl === true ? "Y" : "N";
                let p_bank_ctl = this.chkBankCtrl === true ? "Y" : "N";
                let p_tac_abacctcode_ifrs_pk = "";
                //alert(p_description2)
                let p_ac_cd11 = this.txt_ACCD11 ?
                    this.txt_ACCD11.trim().toUpperCase() :
                    "";
                let p_ac_table_io = this.chkOffBalSheetAcc === true ? "O" : "I";
                let p_comcard_yn = this.chkCardCtrl === true ? "Y" : "N";

                if (this.selectedAccCodeEntry._rowstatus === "") {
                    this.selectedAccCodeEntry._rowstatus = "u";
                }
                console.log(this.selectedAccCodeEntry._rowstatus, );
                pa = [
                    this.selectedAccCodeEntry._rowstatus,
                    p_tac_abacctcode_pk,
                    p_pac_cd,
                    p_pac_nm,
                    p_accd,
                    p_acnm,
                    p_acsnm,
                    p_aclnm,
                    p_acknm,
                    p_drcr_type,
                    p_leaf_yn,
                    p_carry_yn,
                    p_cust_yn,
                    p_cust_remyn,
                    p_pl_yn,
                    p_budget_yn,
                    p_bgcon_yn,
                    p_ac_level,
                    p_remark,
                    p_bal,
                    p_std_dt,
                    p_end_dt,
                    p_use_yn,
                    p_pac_pk,
                    p_level_temp,
                    p_com_pk,
                    p_emp_ctl,
                    p_bank_ctl,
                    p_ccy,
                    p_accd1,
                    p_accd2,
                    p_accd3,
                    p_tac_abacctcode_ifrs_pk,
                    p_description,
                    p_description1,
                    p_description2,
                    p_ac_cd4,
                    p_ac_cd5,
                    p_ac_cd6,
                    p_ac_cd7,
                    p_ac_cd8,
                    p_ac_cd9,
                    p_ac_cd10,
                    p_ac_cd11,
                    p_ac_table_io,
                    p_comcard_yn,
                    this.selPLType,
                    this.selBudgetType,
                    this.selAcType,
                    this.selAcGrp
                ];

                const dso = {
                    type: "form",
                    updpro: "ac_upd_6015016_acc_entry",
                    para: pa
                };
                const result = await this._dsoCall(dso, "update", false);

                if (result) {
                    //console.log(result)
                    const errNo = result[0].ERRCODE ? result[0].ERRCODE : "";
                    if (errNo !== "") {
                        this.showNotification(
                            "danger",
                            this.$t(errNo, "COMMON"),
                            ""
                        );
                    } else {
                        this.showNotification(
                            "success",
                            this.$t("process_success", "common"),
                            ""
                        );
                    }
                }
            }
        },

        //**************************************************/

        async getTreeViewList() {
            try {
                this.isRendering = true;
                let pa = [];
                let p_ac_cd = this.txt_SPLC_CD ? this.txt_SPLC_CD : "";
                let p_ac_nm = this.txt_SPLC_NM ? this.txt_SPLC_NM : "";
                let p_com_pk = this.selectedCompany ? this.selectedCompany : "";
                pa = [p_com_pk, p_ac_cd, p_ac_nm];
                const dso = {
                    type: 'list',
                    selpro: 'AC_SEL_6010052_ABCENTER_TREE',
                    para: pa
                }
                const result = await this._dsoCall(dso, 'select', false)
                if (result) {
                    this.listTreeAcc = listToTree(result, {
                        idKey: 'PK',
                        parentKey: 'P_PK',
                        childrenKey: 'childMenu'
                    })
                    this.action = null;
                } else {
                    this.listTreeAcc = []
                }
            } catch (e) {
                this.showNotification(
                    "danger",
                    this.$t("error_occurs", "common"),
                    e.message
                );
            } finally {
                this.isRendering = false;
            }
        },

        async getCompanyList() {
            const v_User = this.getUser;
            const dso = {
                type: "list",
                selpro: "sys_sel_list_company",
                para: [v_User.PK]
            };
            const result = await this._dsoCall(dso, "select", false);
            // console.log(result)
            if (result) {
                this.companyList = result;
            } else {
                this.companyList = [];
            }
        },
        onSelect() {
            console.log(this.selectedGridInfo);
            if (this.selectedGridInfo.length > 0) {
                for (let i = 0; i < this.selectedGridInfo.length; i++) {
                    this.$refs.idGridUse.addRowStruct({
                        PK: "",
                        TAC_ABPL_PK: this.selectedGridInfo[i].PK,
                        TAC_ABCENTER_PK: this.selectedGridInfo[i].PK_R,
                        PL_CD: this.selectedGridInfo[i].PL_CD,
                        PL_NM: this.selectedGridInfo[i].PL_NM,
                        REMARK: "",
                        PLC_CD: this.selectedGridInfo[i].CODE,
                        PLC_NM: this.selectedGridInfo[i].NAME
                    });
                }
            }
        },
        afterSave(data) {
            if (data) {
                this.showNotification('success', this.$t('alert'), 'UPDATE_SUSCESS');
                this.$refs.idGridInfo.loadData();
                this.$refs.idGridUse.loadData();
            }
        },
        searchMaster() {
            this.$refs.idGridInfo.loadData();
        }
    }
};
</script>
