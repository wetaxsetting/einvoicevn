<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
<v-container fluid class="pa-0" v-resize="onResize">
    <v-row dense class="pa-2">
        <v-col cols="12" c>
            <v-card>
                <v-row dense>
                    <v-spacer />
                    <div class="d-flex">
                        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('SEARCH')" />
                        <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick('SAVE')" />
                    </div>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
    <v-row dense class="pa-2">
        <v-col cols="12">
            <DataGridView ref="grdData" :max_height="limitHeight" :header="[
                                    {  dataField: 'PRN_LEVEL',  caption: this.$t('prn_level')  , allowEditing: false },
                                    {  dataField: 'CODE_DIGIT', caption: this.$t('code_digit') , allowEditing: false }, 
                                    {  dataField: 'PRN_COLOR',  caption: this.$t('prn_color')  , allowEditing: true, 
                                       lookup: { displayExpr: 'NAME', valueExpr: 'CODE', dataSource: cbo_Color, }, 
                                    },
                                    {  dataField: 'PRN_CHK',    caption: this.$t('prn_chk')     , allowEditing: false },
                                    {  dataField: 'BAL_CHK',    caption: this.$t('bal_chk')     , allowEditing: false },
                                    {  dataField: 'REM_CHK',    caption: this.$t('rem_chk')     , allowEditing: false }, 
                                    {  dataField: 'FONT_STYPE', caption: this.$t('font_stype')  , allowEditing: true,
                                        lookup: { displayExpr: 'NAME', valueExpr: 'CODE', dataSource: cbo_Style, },  }, 
                                    {  dataField: 'PRE_EMPTY',  caption: this.$t('pre_empty')   , allowEditing: false }, 
                                    {  dataField: 'POST_EMPTY', caption: this.$t('post_empty')  , allowEditing: false },  
                                 ]" select_mode="Single" sel_procedure="AC_SEL_6010060_01_NOCACHE" :filter_paras="[user.TCO_COMPANY_PK]" upd_procedure="AC_UPD_6010060_02" :update_paras="[ 'PK', 'PRN_COLOR', 'FONT_STYPE' ]" @onRowPrepared="onRowPrepared" />
        </v-col>
    </v-row>
</v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
/*==================================================================== END IMPORT COMPONENT & BEGIN export default==================================================================*/
export default {
    /*############### DEFAULT #######################*/
    layout: "default",
    middleware: "user",
    /*############### components ####################*/
    components: {},
    /*############### data ##########################*/
    data: () =>
        ({
            cbo_Color: [],
            cbo_Style: [],
        }),
    /*############### created #######################*/
    created() {
        this.getCommonCode("COLOR_LIST");
        this.getCommonCode("FONT_STYLE");
    },
    /*############### watch ######################*/
    watch: {},
    /*############### computed ######################*/
    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            return Math.floor(this.formContainerHeight * 0.8);
        },
    },
    /*############### mounted #######################*/
    mounted() {
        this.sel_Company = this.user.TCO_COMPANY_PK;
    },
    /*############### methods #######################*/
    methods: {
        async getCommonCode(obj) {
            var Param = [],
                dso = {};;
            switch (obj) {
                case "COLOR_LIST":
                    Param = "ACAB0240"
                    break;
                case "FONT_STYLE":
                    Param = "ACAB0270"
                    break;
            }
            const result = (obj == 'BIZ_PLACE') ? await this._dsoCall(dso, "select", false) : await this._getCommonCode(Param, this.user.TCO_COMPANY_PK);
            if (result.length > 0) {
                switch (obj) {
                    case "COLOR_LIST":
                        this.cbo_Color = result;
                        break;
                    case "FONT_STYLE":
                        this.cbo_Style = result;
                        break;
                }
            }
        },
        onClick(obj) {
            switch (obj) {
                case "SEARCH":
                    this.$refs.grdData.loadData();
                    break;
                case 'SAVE':
                    this.$refs.grdData.saveData();
                    break;
            }
        },
        onRowPrepared(e) {
            if (e.rowType == "data") {
                e.rowElement.style.backgroundColor = "#" + e.data.PRN_COLOR.toString().replace('0X', '');
                if(e.data.FONT_STYPE == 'B')
                {
                    e.rowElement.style.fontWeight = "bold";
                }
                if(e.data.FONT_STYPE == 'I')
                {
                    e.rowElement.style.fontStyle = "italic";
                }
                
                // console.log('vng-154-dvg^_^: > file: 6045030.vue > line 474 > onRowPrepared > e.data.COLOR_CD', e.data.COLOR_CD.toString().replace('0x', ''));
            }
        },
    }
};
/*==================================================================== END export default  ========================================================================================*/
</script><!-- === vng-154 dvg ===-->
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
<s
