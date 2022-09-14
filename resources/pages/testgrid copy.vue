<template>
<div>
    <JqxButton @click="loadData()" :height="20">Load Data</JqxButton>
    <JqxButton @click="addRow()" :height="20">AddRow</JqxButton>
    <JqxButton @click="freshData()" :height="20">freshData</JqxButton>

    <BaseGridView ref="gridview" :showaggregates="true" :showstatusbar="true" @rowCount="onTotalRows" :header="header" sel_procedure="LG_SEL_8050030_NOCACHE" 
    upd_procedure="LG_UPD_8050030" :update_paras="['TCO_COMPANY_PK','STRG_ID','STRG_NAME','USE_YN','STORAGE_TYPE']" :filter_paras="[this.mCompany]"></BaseGridView>
    <p>Total rows:{{totalRows}}</p>

</div>
</template>

<script>
import JqxButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue";
export default {
    components: {
        JqxButton,
    },
    data: function () {
        return {
            totalRows: 0,
            mCompany: 22134,
            header: [
                {
                    dataField: 'TCO_COMPANY_PK',
                    caption: this.$t('company'),
                    allowEditing: true,
                    summaryType:'sum',
                    formatFloat:'3'
                },
                {
                    caption: this.$t('storage'),
                    columns: [{
                            dataField: 'STRG_ID',
                            caption: this.$t('storage_id'),
                            allowEditing: true,
                        },
                        {
                            dataField: 'STRG_NAME',
                            caption: this.$t('storage_nm'),
                            allowEditing: true,
                        },
                    ]
                },

                {
                    dataField: 'USE_YN',
                    caption: this.$t('active'),
                    allowEditing: true,
                    dataType: 'checkbox',
                },
                {
                    dataField: 'STORAGE_TYPE',
                    caption: this.$t('storage_type'),
                    allowEditing: true,
                },
                {
                    dataField: 'ADDR_NM',
                    caption: this.$t('full_addr'),
                    allowEditing: true,
                },
            ],
            getWidth: 1000,

        }
    },
    mounted() {
        // document.addEventListener('contextmenu', event => event.preventDefault());
    },
    methods: {
        addRow() {
            this.$refs.gridview.addRowStruct({
                TCO_COMPANY_PK:123,STRG_ID:'tring-id',STRG_NAME:'string name',USE_YN:'Y',STORAGE_TYPE:'type1'
            });
        },
        onTotalRows(p_rows) {
            this.totalRows = p_rows
        },
        cellBeginEditEvent: function (event) {
            let args = event.args;
            this.$refs.beginEdit.innerHTML = 'Event Type: cellbeginedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
        },
        cellEndEditEvent: function (event) {
            let args = event.args;
            this.$refs.endEdit.innerHTML = 'Event Type: cellendedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
        },
        myGridOnSort: function (event) {
            this.$refs.myPanel.clearcontent();
            let sortinformation = event.args.sortinformation;
            let sortdirection = sortinformation.sortdirection.ascending ? 'ascending' : 'descending';
            if (!sortinformation.sortdirection.ascending && !sortinformation.sortdirection.descending) {
                sortdirection = 'null';
            }
            let eventData = 'Triggered "sort" event <div>Column:' + sortinformation.sortcolumn + ', Direction: ' + sortdirection + '</div>';
            this.$refs.myPanel.prepend('<div style="margin-top: 5px;">' + eventData + '</div>');
        },

        loadData() {
            this.$refs.gridview.loadData();
        },
        freshData() {
            //this.$refs.gridview.Clear()
            //this.$refs.gridview.autoMakeSEQ('TCO_COMPANY_PK',1);
            //this.$refs.gridview.setCellValue('TCO_COMPANY_PK',1234567,64)
            //this.$refs.gridview.getCellValue('TCO_COMPANY_PK',0)
            //this.$refs.gridview.setCellSelected('STRG_NAME','new selected value')
            this.$refs.gridview.setValueColumn('STORAGE_TYPE','new selected value')
            //this.$refs.gridview.setValueColumnIfNull('STORAGE_TYPE','new selected value')
        }
    }
}
</script>

<style>
</style>
