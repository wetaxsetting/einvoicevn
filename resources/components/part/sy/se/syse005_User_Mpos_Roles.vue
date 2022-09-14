<template>
<v-card outlined v-resize="onResize">
    <v-row no-gutters>
        <!-- Left Col -->
        <v-col cols="5">
            <!-- Role Name List -->
            <v-row no-gutters class="pt-1">
                <v-col lg="5" sm="2" cols="8" class="pa-0">
                    <BaseInput :label="$t('emp_name')" v-model="inputEmpName" @keyPressEnter="getUserList" />
                </v-col>
                <v-col lg="4" sm="4" cols="8">
                    <BaseInput :label="$t('emp_id')" v-model="inputEmpID" @keyPressEnter="getUserList" />
                </v-col>
                <v-col>
                    <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing" @onclick="getUserList" />
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12">
                    <BaseGridView column-resizing-mode="widget" ref="refUserGrid" sel_procedure="SYS_SEL_SYSE005_USER_ROLE_01" select_mode="MultipleHideBox" :auto_load="false" :max_height="halfHeight+50" @cellClick="selectionChanged" :filter_paras="[this.inputEmpName,this.inputEmpID]" :header="[  
                          {dataField: 'USER_ID',caption: this.$t('user_id'), allowEditing: false,  },     
                          {dataField: 'USER_NAME',caption: this.$t('user_name'), allowEditing: false,  },
                          {dataField: 'EMP_ID',caption: this.$t('emp_id'), allowEditing: false,  },                     
                      ]" />
                </v-col>
            </v-row>
            <v-row no-gutters class="pt-1">
                <v-col lg="9" sm="2" cols="8" class="pa-2 pt-0">
                    <BaseInput :label="$t('function_name')" v-model="txtFunctionName" @keyPressEnter="OnSearchFunction" />
                </v-col>
                <v-col class="pa-0 pt-0">
                    <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing" @onclick="OnSearchFunction" />
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12">
                    <BaseGridView column-resizing-mode="widget" ref="refFunctionGrid" sel_procedure="SYS_SEL_SYSE005_USER_ROLE_M_02" select_mode="MultipleHideBox" :auto_load="false" :max_height="halfHeight_2+50" @cellDblClick="onSelectSingle" :filter_paras="[this.txtFunctionName, this.v_user_pk]" :header="[  
                          {dataField: 'FUNCTION_NAME',caption: this.$t('function_name'), allowEditing: false,  },                          
                      ]" />
                </v-col>
            </v-row>
        </v-col>
        <!-- Right Col -->
        <v-col cols="7">
            <v-row no-gutters class="pt-1" justify="end">
                <v-col lg="2" cols="12" class="d-flex text-right">
                    <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="save" />
                    <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="OnDeleteRoleMapping" />
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12">
                    <BaseGridView column-resizing-mode="widget" ref="refUserFunctionGrid" sel_procedure="SYS_SEL_SYSE005_USER_ROLE_M_03" upd_procedure="SYS_UPD_SYSE005_USER_ROLE_M_03" select_mode="MultipleHideBox" :auto_load="false" :max_height="limitHeight+50" :filter_paras="[this.v_user_pk]" :update_paras="['PK','FUNCTION_NAME','USER_ID','EMP_NAME','USE_YN','USER_PK','TLG_MPOS_FUNCTION_PK']" :header="[  
                          {dataField: 'FUNCTION_NAME',caption: this.$t('function_name'), allowEditing: true, },                          
                          {dataField: 'USER_ID',caption: this.$t('user_id'), allowEditing: true, },
                          {dataField: 'EMP_NAME',caption: this.$t('emp_name'), allowEditing: true },
                          {dataField: 'USE_YN',caption: this.$t('use_yn'), allowEditing: true,dataType:'checkbox' },
                      ]" />
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</v-card>
</template>

<script>
export default {
    layout: "default",
    middleware: "user",
    name: "role-object-mapping",

    props: ["searchParams"],
    data: () => ({
        inputEmpName: "",
        inputEmpID: "",
        v_user_pk: "",
        v_user_id: "",
        v_role_pk: "",
        v_role_name: "",
        txtFunctionName: "",
    }),

    mounted() {
        this.getUserList();
        this.onResize();
    },

    computed: {
        limitHeight() {
            if (this.$vuetify.breakpoint.mdAndUp) {
                return this.windowHeight - 240;
            }
        },
        halfHeight() {
            return Math.ceil(this.limitHeight / 2 - 64);
        },
        halfHeight_2() {
            return Math.ceil((this.limitHeight / 2) - 48);
        },
    },
    methods: {
        async OnSearchFunction(){
            this.$refs.refFunctionGrid.loadData()
        },
        onSelectSingle(e) {
            this.v_role_pk = e.data.PK
            this.v_role_name = e.data.FUNCTION_NAME
            this.$refs.refUserFunctionGrid.addRowStruct({
                PK: "",
                FUNCTION_NAME: this.v_role_name,
                USER_ID: this.v_user_id,
                EMP_NAME: "",
                USE_YN: "Y",
                USER_PK: this.v_user_pk,
                TLG_MPOS_FUNCTION_PK: this.v_role_pk
            });
            this.$nextTick(() => {
                this.save()
            });

        },
        async save() {
            this.$refs.refUserFunctionGrid.saveData()
            this.$nextTick(() => {
                this.$refs.refFunctionGrid.loadData()
            });
        },
        OnDeleteRoleMapping() {
            this.$refs.refUserFunctionGrid.deleteRows()
        },
        async getUserList() {
            this.$refs.refUserGrid.loadData()
        },
        selectionChanged(e) {
            this.v_user_pk = e.data.PK
            this.v_user_id = e.data.USER_ID
            this.$refs.refUserFunctionGrid.loadData()
            this.$refs.refFunctionGrid.loadData()
        },
    }
};
</script>
