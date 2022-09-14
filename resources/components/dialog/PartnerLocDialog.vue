<template>
<v-dialog id="partnerloc-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("bussiness partner location list") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters>
                <v-col cols="12">
                    <!-- Search Panel -->
                    <v-row align="center" justify="space-between">
                        <v-col cols="12">
                            <v-card outlined tile>
                                <v-container fluid>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col cols="4">
                                            <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="selectedCompany"></v-select>
                                        </v-col>

                                        <v-col>
                                            <v-text-field clearable dense hide-details outlined :label="$t('location name')" @keypress.enter="onSearch" v-model="txtLocName"></v-text-field>
                                        </v-col>

                                        <v-col cols="2" class="text-right">
                                            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onSearch">
                                                <v-icon>mdi-magnify</v-icon>
                                            </v-btn>
                                            <v-btn icon tile color="success" @click="onSelectMultiple" v-if="multiSelectMode">
                                                <v-icon>mdi-check-bold</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Table -->
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DxDataGrid column-resizing-mode="widget" key-expr="PK" :allow-column-resizing="true" :columnAutoWidth="$vuetify.breakpoint.smAndDown" :data-source="dataList" :height="limitHeight" :row-alternation-enabled="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelectionChanged" :onRowDblClick="onSelectSingle">
                                    <DxColumn data-field="LOC_NM" :caption="$t('loc name', 'common')"></DxColumn>
                                    <DxColumn data-field="S_O_DEF" :caption="$t('s_o_def', 'common')"></DxColumn>
                                    <DxColumn data-field="ADDR" :caption="$t('addr1', 'common')"></DxColumn>
                                    <DxColumn data-field="IE_TYPE" :caption="$t('ie type', 'common')"></DxColumn>
                                    <DxColumn data-field="PHONE_NO" :caption="$t('phone', 'common')"></DxColumn>
                                    <DxColumn data-field="FAX_NO" :caption="$t('fax', 'common')"></DxColumn>
                                    <DxColumn data-field="EMAIL" :caption="$t('email', 'common')"></DxColumn>
                                    <DxColumn data-field="DESCRIPTION" :caption="$t('remark', 'common')"></DxColumn>
                                    <DxFilterRow :visible="true" />
                                    <DxPaging :page-size="dataList.length" />
                                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                                    <DxSelection mode="single" v-if="!multiSelectMode" />
                                </DxDataGrid>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "partnerloc-dialog",
    // props: ["empSelectProbs", "multiSelectMode"],
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],
        companyList: [],
        selectedCompany: "",
        txtLocName: "",
        partnerPK: ""
    }),

    created() {
        this.selectedCompany = this.user.TCO_COMPANY_PK
        this.getCompanyList()
    },

    mounted() {

    },

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            return this.windowHeight - 320
        }
    },

    watch: {
        dialogIsShow(val) {},
        selectedCompany(val) {
            if (val) {
                this.onSearch()
            }
        },
    },

    methods: {
        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "SYS_SEL_LIST_COMPANY",
                para: [this.user.PK]
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.companyList = result
            } else {
                this.companyList = []
            }
        },

        async onSearch() {
            const dso = {
                type: "grid",
                selpro: "SYS_SEL_BUSPARTNER_LOC_DIALOG",
                para: [
                    this.selectedCompany,
                    this.partnerPK ? this.partnerPK : '',
                    this.txtLocName ? this.txtLocName : ''
                ]
            }
            this.dataList = await this._dsoCall(dso, "select", false)
        },

        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData
        },

        onSelectSingle({
            data
        }) {
            this.returnPartnerLocInfo(data)
        },

        onSelectMultiple() {
            let rtn_data = this.multiSelectMode ?
                this.selectedDatas :
                this.selectedDatas[0]
            this.returnPartnerLocInfo(rtn_data)
        },

        returnPartnerLocInfo(datas) {
            this.$emit("returnPartnerLocInfo", datas)
            this.dialogIsShow = false
        }
    }
};
</script>
