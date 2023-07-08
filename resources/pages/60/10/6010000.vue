<!--===[B][template]============================================================ [B][template] =========================================================[B][template]===-->
<template>
<div>
    <!--===[B][layout]===-->
    <GwGridLayout dense colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event" eager>
        <GwGridLayout colspan="3" dense containerHeight="auto" colsPerRow="1" @callBackHeight="childrenHeight = $event" eager>
            <BaseInput colspan="8" :label="$t('menucd_menunm')" v-model="txtMenuCd" @keyPressEnter="onClick('grdSearchSel')" />
            <GwFlexBox colspan="4">
                <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClick('grdSearchSel')" :disabled="isProcessing" />
            </GwFlexBox>
            <BaseGridView colspan="12" ref="grdSearch" :max_height="grdInitSHeight" select_mode="Single" :header="grdInitSHeader" @cellClick="onGrdSCellClick" :sel_procedure="grdProcSSel" :filter_paras="grdFilterSParas" />
        </GwGridLayout>
        <GwGridLayout dense colspan="9" containerHeight="auto" colsPerRow="1" @callBackHeight="childrenHeight = $event" eager>
            <GwFlexBox colspan="1">
                <BaseButton :icon_type="btnIconType" :disabled="isProcessing" btn_type='icon' @onclick="toggleLeft" />
            </GwFlexBox>
            <div colspan="4"><span v-show="this.txtParentCode!=''">{{$t('commcode')}}&nbsp;:&nbsp;{{ this.txtParentCode }}</span></div>
            <GwFlexBox colspan="7">
                <BaseButton icon_type="view" :btn_text="$t('show_commcode')" @onclick="onClick('SHOW_COMMCODE')" :disabled="isProcessing" v-show="this.txtParentCode!=''" />
                <BaseButton icon_type="add" :btn_text="$t('addnew')" @onclick="onClick('grdDataNew')" :disabled="isProcessing" v-show='true' />
                <BaseButton icon_type="delete" :btn_text="$t('delete')" @onclick="onClick('grdDataDel')" :disabled="isProcessing" v-show='true' />
                <BaseButton icon_type="save" :btn_text="$t('save')" @onclick="onClick('grdDataUpd')" :disabled="isProcessing" v-show='true' />
            </GwFlexBox>
            <BaseGridView colspan="12" :autoresize="true" ref="grdData" :max_height="grdInitSHeight" :header="grdInitDHeader" :sel_procedure="grdProcDSel" :filter_paras="grdFilterDParas" :upd_procedure="grdProcDUpd" :editable="true" :update_paras="grdUpdDParas" @cellClick="onGrdDCellClick" />
        </GwGridLayout>
    </GwGridLayout>
    <!--===[E][layout]===-->
    <!--===[B][include component tag]===-->
    <confirm-dialog ref="dlgConfirm" @onConfirm="onrtnConfirm"></confirm-dialog>
    <v-dialog eager v-model="dlgCommcode" :width="windowWidth/2+40">
        <v-card>
            <v-card-title class="headline primary-gradient white--text pa-1">
                <span>{{ $t("common_code") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dlgCommcode = false" />
            </v-card-title>
            <syco001 ref="dlgCom" :parentCode="txtParentCode" />
        </v-card>
    </v-dialog>
    <!--===[E][include component tag]===-->
</div>
</template>

<!--===[E][template]============================================================ [E][template] =========================================================[E][template]===-->
<!--===[B][script]============================================================== [B][script] ===========================================================[B][script]===-->

<script>
/*===[B][import components address]==================*/
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import syco001 from "@/pages/sy/co/syco001";
/*===[E][import components address]==================*/
export default {
    layout: "default",
    middleware: "user",
    /*===[B][props]===================*/
    props: {
        menuCD: {
            type: String,
            default: ''
        }
    },
    /*===[B][components]===================*/
    components: {
        ConfirmDialog,
        syco001
    },
    /*===[B][data]=========================*/
    data: () =>
        ({
            actClick: 'Action CLick',
            actGrid: 'Action grid',
            btnIconType: "skip_prev",
            colsLeft: 4,
            showLeft: true,
            txtMenuCd: "",
            txtMenuCdD: "",
            _rowdata: {},
            dlgCommcode: false,
            txtParentCode: ''

        }),
    /*===[B][created]======================*/
    async created() {
        // console.clear();
        this.txtParentCode = "";
        this.txtMenuCd = this.menuCD;
        this.txtMenuCdD = this.menuCD;
        setTimeout(() => {
            this.onClick('grdSearchSel');
            this.onClick('grdDataSel');
        }, 500);
        this.toggleLeft();
    },
    /*===[B][watch]========================*/
    watch: {
        menuCD(val) {
            //console.log('[vng-154/dvg] > file: 6010000.vue:110 > menuCD > val:', val);
            this.txtMenuCd = val;
            this.txtMenuCdD = val;
            setTimeout(() => {
                this.onClick('grdSearchSel');
                this.onClick('grdDataSel');
            }, 500);
        }
    },
    /*===[B][computed]======================*/
    computed: {
        cboProcedureType() {
            let _cboProcedureType = [{
                CODE: 'SEL',
                NAME: 'SELECT'
            }, {
                CODE: 'UPD',
                NAME: 'UPDDATE'
            }, {
                CODE: 'PRO',
                NAME: 'PROCESS'
            }, {
                CODE: 'RPT',
                NAME: 'REPORT'
            }, {
                CODE: 'IMP',
                NAME: 'IMPORT'
            }, {
                CODE: 'FNC',
                NAME: 'FUNCTION'
            }, {
                CODE: 'COMMCODE',
                NAME: 'COMMCODE_COMP'
            }, {
                CODE: 'COMMCODE_CLOUD',
                NAME: 'COMMCODE CLOUD'
            }];
            return _cboProcedureType;
        },
        user() {
            return this.$store.getters["auth/user"]
        },
        grdInitDHeight() {
            return this._calculateHeight(this.formContainerHeight, 85)
        },
        grdProcDSel() {
            const _grdProcDSel = 'AC_SEL_6010000_02';
            return _grdProcDSel;
        },
        grdProcDUpd() {
            const _grdProcDUpd = 'AC_UPD_6010000_03';
            return _grdProcDUpd;
        },
        grdUpdDParas() {
            const _grdUpdDParas = ['PK', 'MENU_CD', 'MENU_NAME', 'MENU_URL', 'PROCEDURE_TYPE', 'PROCEDURE_NAME', 'CRT_ID', 'USE_YN', 'CONTENT_DATA', 'PROCEDURE_REMARK', 'PROCEDURE_NAME_OLD', 'SEQ']

            return _grdUpdDParas;
        },
        grdFilterDParas() {
            const _grdFilterDParas = [this.txtMenuCdD];
            return _grdFilterDParas;
        },
        grdInitDHeader() {
            const _grdInitDHeader = [{
                    dataField: "SEQ",
                    caption: this.$t("seq"),
                    allowEditing: true,
                }, {
                    dataField: "USE_YN",
                    caption: this.$t("use_yn"),
                    dataType: "checkbox",
                    allowEditing: true,
                }, {
                    dataField: "CRT_ID",
                    caption: this.$t("crt_id"),
                    allowEditing: true,
                    width:200
                }, {
                    dataField: "PROCEDURE_TYPE",
                    caption: this.$t("procedure_type"),

                    lookup: {
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                        dataSource: this.cboProcedureType
                    },
                    allowEditing: true,
                },
                {
                    dataField: "PROCEDURE_NAME",
                    caption: this.$t("PROCEDURE_NAME"),
                    allowEditing: true,
                },
                {
                    dataField: "PROCEDURE_NAME_OLD",
                    caption: this.$t("procedure_name_old"),
                    allowEditing: true,
                },
                {
                    dataField: "CONTENT_DATA",
                    caption: this.$t("CONTENT_DATA"),
                    allowEditing: true,
                },
                {
                    dataField: "PROCEDURE_REMARK",
                    caption: this.$t("PROCEDURE_REMARK"),
                    allowEditing: true,
                }
            ];
            return _grdInitDHeader;
        },
        grdInitSHeight() {
            return this._calculateHeight(this.formContainerHeight, 70)
        },
        grdProcSSel() {
            const _grdProcSSel = "AC_SEL_6010000_01";
            return _grdProcSSel;
        },
        grdFilterSParas() {
            const _grdFilterSParas = [this.txtMenuCd];
            return _grdFilterSParas;
        },
        grdInitSHeader() {
            const _grdInitSHeader = [{
                dataField: "NO",
                caption: this.$t("no"),

                allowEditing: false
            }, {
                dataField: "MENU_CD_NODEJS",
                caption: this.$t("menu_cd_nodejs"),

                allowEditing: false
            }, {
                dataField: "FORM_NM",
                caption: this.$t("form_nm"),

                allowEditing: false
            }, {
                dataField: "FORM_URL_NODEJS",
                caption: this.$t("form_url_nodejs"),

                allowEditing: false
            }];
            return _grdInitSHeader;
        },
    },
    /*===[B][mounted]======================*/
    mounted() {},
    /*===[B][methods]======================*/
    methods: {
        /*===[show hidde] left search====== */
        toggleLeft() {
            if (this.show_left == true) {
                this.show_left = false;
                this.colsLeft = 0;
                this.btnIconType = "skip_next";
            } else {
                this.show_left = true;
                this.colsLeft = 4;
                this.btnIconType = "skip_prev";
            }
        },
        /*===[B][event click]==============*/
        async onClick(_action, _obj = "") {
            await this._clearCache("N"); // có hiện notification
            this.actClick = _action;
            switch (_action) {
                case 'grdDataSel':
                    this.txtParentCode = "";
                    this.onGrdAct('grdDataSel');
                    break;
                case 'grdDataNew':
                    this.txtParentCode = "";
                    this.onGrdDataNew();
                    break;
                case 'grdDataUpd':
                    this.txtParentCode = "";
                    this.$refs.grdData.saveData();
                    break;
                case 'grdDataDel':
                    this.txtParentCode = "";
                    this.$refs.dlgConfirm.showConfirm(this.$t("do_you_want_to_delete"), null, false);
                    break;
                case 'grdDataExcel':
                    break;
                case 'grdDataDown':

                    break;
                case 'grdSearchSel':
                    this.txtParentCode = "";
                    this.$refs.grdSearch.loadData();
                    break;
                case 'SHOW_COMMCODE':
                    if (this.txtParentCode == "") {
                        this.showNotification("warning", this.$t("pls_select_row_data_commcode"), "", 5000);
                        return;
                    }
                    // this.$refs.dlgCom.parentCode = this.txtParentCode;
                    this.dlgCommcode = true;
                    break;
            }
        },
        /*===[B][return dlg]==============*/
        onrtnConfirm() {
            switch (this.actClick) {
                case 'grdDataUpd':
                    this.onGrdAct('grdDataUpd');
                    break;
                case 'grdDataDel':
                    this.$refs.grdData.deleteRows();
                    this.onGrdAct('grdDataUpd');
                    break;
            }
        },
        /*===[B][event grid]==============*/
        onGrdAct(_action) {
            this.actGrid = _action;
            switch (_action) {
                case 'grdDataSel':
                    this.$refs.grdData.loadData();
                    break;
                case 'grdDataUpd':
                    this.$refs.grdData.saveData();
                    break;
            }
        },
        /*[cell click][grdSearch]*/
        onGrdSCellClick(row) {
            if (row.data.MENU_CD_NODEJS && row.data.MENU_CD_NODEJS != undefined) {
                this.txtMenuCdD = row.data.MENU_CD_NODEJS;
                this._rowdata = row.data;
                this.onClick('grdDataSel');
            }
        },
        onGrdDCellClick(row) {
            if (row.data.PROCEDURE_TYPE && (row.data.PROCEDURE_TYPE == 'COMMCODE' || row.data.PROCEDURE_TYPE == 'COMMCODE_CLOUD') && row.data.PROCEDURE_NAME != '') {
                this.txtParentCode = row.data.PROCEDURE_NAME;
            } else {
                this.txtParentCode = "";
            }
        },
        /*[grdData] add new row]*/
        onGrdDataNew() {
            if (this.txtMenuCdD == null || this.txtMenuCdD == undefined || this.txtMenuCdD == '') {
                this.showNotification("warning", this.$t("pls_select_data_to_add"), "", 2000);
                return;
            }
                // console.log('[vng-154/dvg] > file: 6010000.vue:339 > onGrdDataNew > this._rowdata:', this._rowdata);
            if (this._rowdata == undefined || this._rowdata.MENU_CD_NODEJS == undefined || this._rowdata.MENU_CD_NODEJS == '') {
                this.showNotification("warning", this.$t("pls_select_master_first"), "", 2000);
                return;
            }
            let seq =  (this.$refs.grdData.getDataSource()?this.$refs.grdData.getDataSource().length:0)+1;
            const _newRow = {
                PK: "",
                MENU_CD: this._rowdata.MENU_CD_NODEJS,
                MENU_NAME: this._rowdata.FORM_NM,
                MENU_URL: this._rowdata.FORM_URL_NODEJS,
                PROCEDURE_TYPE: 'SEL',
                PROCEDURE_NAME: '',
                CRT_ID: '',
                USE_YN: 'Y',
                CONTENT_DATA: '',
                PROCEDURE_REMARK: '',
                PROCEDURE_NAME_OLD: '',
                SEQ: seq
            };
            this.$refs.grdData.addRowStruct(_newRow);
        }
        /*===[E]][event grid]==============*/
    }
};
</script>
<!--===[E][script]============================================================== [E][script] ===========================================================[E][script]===-->
<!--=================================================================
[Form info: 603080 RPA Bank Transaction]
[crate][vng-154/dvg 2023.02.22] 
*********************Modify info********************** 

******************************************************
Notes: 
=====================================================================-->
