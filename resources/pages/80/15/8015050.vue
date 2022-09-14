<template>
<v-container fluid class="pa-0" v-resize="onResize">
    <v-row dense align="center" justify="space-between">
        <v-col lg="3" cols="12">
            <BaseInput :label="$t('partner')" v-model="searchPartner.display" @dblClick="$refs.partnerDialog.dialogIsShow = true" />
        </v-col>
        <v-col lg="3" cols="12">
            <BaseSelect :label="$t('mail_type')" v-model="selectedMailType" :lstData="lstMailType" item-text="NAME" item-value="CODE" :text_all="$t('all')" />
        </v-col>
        <v-col lg="4" cols="12" align-self="end">
            <span>{{ `${$t('total_rows')}: ${totalRow}` }}</span>
        </v-col>
        <v-col cols="2" class="d-flex flex-nowrap">
            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onAdd" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onDelete" />
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onSave" />
        </v-col>
    </v-row>
    <v-row>
        <v-col lg="12" cols="12">
            <BaseGridView @cellDblClick="onCellDbClick" select_mode="Single" ref="dataGrid" :max_height="gridHeight" :header="headers" sel_procedure="sys_sel_sys_client_mail_config" upd_procedure="sys_upd_sys_client_mail_config" :filter_paras="[searchPartner.display, selectedMailType ]" :update_paras="['PK','TCO_BUSPARTNER_PK', 'MAIL_TYPE','SYS_MAIL_TEMPLATE_PK','SEND_TIME','SEND_TYPE']" @rowCount="totalRow = $event" overflowDiv="overlay" />
        </v-col>
    </v-row>
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
</v-container>
</template>

<script>
export default {
    layout: "detault",
    middleware: "user",

    components: {
        PartnerDialog: () => import("@/components/dialog/PartnerDialog"),
    },

    data: () => ({
        searchPartner: {
            PK: "",
            display: ""
        },
        lstTemplate: [],
        lstMailType: [],
        lstSendMailType: [],
        selectedMailType: "",
        selectedMailData: {},
        totalRow: 0,
        headers: [],
    }),
    created() {

        this.onLoad();
    },
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        // mailTypeList() {
        //     return [{
        //             value: "10",
        //             text: this.$t('daily_stock')
        //         },
        //         {
        //             value: "20",
        //             text: this.$t('billing')
        //         }
        //     ]
        // },
        dataGridRefs() {
            return this.$refs.dataGrid;
        },
        gridHeight() {
            return Math.floor((this.formContainerHeight * 90) / 100);
        },

    },

    methods: {
        createheaders() {
            this.headers = [{
                    dataField: "PARTNER_NAME",
                    caption: this.$t("partner"),
                    allowEditing: false
                },
                {
                    dataField: "MAIL_TYPE",
                    caption: this.$t("mail_type"),
                    allowEditing: true,
                    lookup: {
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                        dataSource: this.lstMailType
                    },
                },
                {
                    dataField: "SYS_MAIL_TEMPLATE_PK",
                    caption: this.$t("template"),
                    allowEditing: true,
                    lookup: {
                        displayExpr: "NAME",
                        valueExpr: "PK",
                        dataSource: this.lstTemplate
                    },
                },
                {
                    dataField: "SEND_TIME",
                    caption: this.$t("send_time"),
                    allowEditing: true
                },
                {
                    dataField: "SEND_TYPE",
                    caption: this.$t("send_type"),
                    allowEditing: true,
                    lookup: {
                        displayExpr: "NAME",
                        valueExpr: "CODE",
                        dataSource: this.lstSendMailType
                    },
                },
                {
                    dataField: "CRT_DT",
                    caption: this.$t("crt_dt"),
                    allowEditing: false
                },
                {
                    dataField: "CRT_BY",
                    caption: this.$t("crt_by"),
                    allowEditing: false
                },
                {
                    dataField: "MOD_BY",
                    caption: this.$t("mod_by"),
                    allowEditing: false
                },
            ]
        },
        async onLoad() {
            const commoncode = await this._getCommonCode2(
                ["SYS0010", "SYS0020"],
                this.user.TCO_COMPANY_PK
            );
            this.lstMailType = commoncode[0];
            this.lstSendMailType = commoncode[1];
            this.lstTemplate = await this._callProcedure(
                "sys_sel_sys_mail_template",
                [this.user.TCO_COMPANY_PK]
            );
            this.createheaders();
            try {
                await this.$nextTick(() => {
                    this.search();
                });

            } catch (e) {}
        },
        onAdd() {
            this.$refs.dataGrid.onAdd();
        },
        onDelete() {
            this.$refs.dataGrid.deleteRows();
        },
        onSave() {
            this.$refs.dataGrid.saveData();
        },
        handleReturnedPartner({
            PK,
            PARTNER_NAME
        }) {
            this.searchPartner.PK = PK;
            this.searchPartner.display = `${PARTNER_NAME}`;
        },
        search() {
            this.dataGridRefs.loadData();
        },
        onCellDbClick(event) {
            if (event.column.datafield == 'PARTNER_NAME') {
                this.$refs.partnerDialog.dialogIsShow = true;
            }
        },
        handleReturnedPartner(item) {
            if (item) {
                this.dataGridRefs.setCellSelected('TCO_BUSPARTNER_PK', item.PK)
                this.dataGridRefs.setCellSelected('PARTNER_NAME', item.PARTNER_ID + " - " + item.PARTNER_NAME)
            }
        },
    }
}
</script>
