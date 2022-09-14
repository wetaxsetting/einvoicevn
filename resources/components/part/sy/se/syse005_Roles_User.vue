<template>
<v-card outlined v-resize="onResize">
    <v-row no-gutters>
        <v-col cols="5">
            <v-row no-gutters class="pt-1">
                <v-col  cols="8" >
                    <BaseInput :label="$t('role_name')" v-model="inputRoleName" @keyPressEnter="OnSearchRole" />
                </v-col>
                <v-col cols="4">
                    <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing" @onclick="OnSearchRole" />
                </v-col>
            </v-row>
             <v-row no-gutters>
                <v-col cols="12">
                    <BaseGridView column-resizing-mode="widget" ref="refRoleGrid" sel_procedure="SYS_SEL_SYSE005_ROLE_USER_01" 
                    select_mode="MultipleHideBox" :auto_load="false" :max_height="halfHeight_2+50" @cellClick="selectionChanged" :filter_paras="[this.inputRoleName]" :header="[  
                          {dataField: 'ROLE_NM',caption: this.$t('role_name'), allowEditing: false,  },                          
                      ]" />
                </v-col>
            </v-row>
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
                    <BaseGridView column-resizing-mode="widget" ref="refUserGrid" sel_procedure="SYS_SEL_SYSE005_ROLE_USER_02" select_mode="MultipleHideBox" :auto_load="false" :max_height="halfHeight+50" @cellDblClick="onSelectSingle" :filter_paras="[this.inputEmpName,this.inputEmpID,this.v_role_pk]" :header="[  
                          {dataField: 'USER_ID',caption: this.$t('user_id'), allowEditing: false,  },     
                          {dataField: 'USER_NAME',caption: this.$t('user_name'), allowEditing: false,  },
                          {dataField: 'EMP_ID',caption: this.$t('emp_id'), allowEditing: false,  },                     
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
                    <BaseGridView column-resizing-mode="widget" ref="refRoleUserGrid" sel_procedure="SYS_SEL_SYSE005_ROLE_USER_03" 
                    upd_procedure="SYS_UPD_SYSE005_ROLE_USER_03" select_mode="MultipleHideBox" :auto_load="false" 
                    :max_height="limitHeight+50" :filter_paras="[this.v_role_pk]" 
                    :update_paras="['PK','ROLE_NAME','USER_ID','EMP_NAME','USE_YN','ST_DATE','END_DATE','USER_PK','ROLE_PK']" :header="[  
                          {dataField: 'ROLE_NAME',caption: this.$t('role_name'), allowEditing: true, },                          
                          {dataField: 'USER_ID',caption: this.$t('user_id'), allowEditing: true, },
                          {dataField: 'EMP_NAME',caption: this.$t('emp_name'), allowEditing: true },
                          {dataField: 'USE_YN',caption: this.$t('use_yn'), allowEditing: true,dataType:'checkbox' },
                          {dataField: 'ST_DATE',caption: this.$t('st_date'), allowEditing: true, dataType: 'date', },
                          {dataField: 'END_DATE',caption: this.$t('end_date'), allowEditing: true, dataType: 'date', },
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
        inputRoleName: "",
    }),

    mounted() {
        this.OnSearchRole();
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
      async OnSearchRole(){
            this.$refs.refRoleGrid.loadData()
        },
        async getUserList() {
            this.$refs.refUserGrid.loadData()
        },  
        onSelectSingle(e) {
            this.v_user_pk = e.data.PK
            this.v_user_id = e.data.USER_ID
            this.$refs.refRoleUserGrid.addRowStruct({
                PK: "",
                ROLE_NAME: this.v_role_name,
                USER_ID: this.v_user_id,
                EMP_NAME: "",
                USE_YN: "Y",
                ST_DATE: "",
                END_DATE: "",
                USER_PK: this.v_user_pk,
                ROLE_PK: this.v_role_pk
            });
            this.$nextTick(() => {
                this.save()
            });
        },
        async save() {
          this.$refs.refRoleUserGrid.saveData()
          this.$nextTick(() => {
                this.getUserList()
            });          
        },
        OnDeleteRoleMapping() {
            this.$refs.refRoleUserGrid.deleteRows()
        }, 
        async  selectionChanged(e) {
            this.v_role_pk = e.data.PK
            this.v_role_name = e.data.ROLE_NM
            this.$refs.refRoleUserGrid.loadData()
            this.getUserList()
        },
    }
};
</script>
