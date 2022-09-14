<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize" >

    <v-row  class="px-2">
        <v-col cols="12" :lg="userTabSize" >

            <v-row no-gutters align="center" justify="center" >
                <v-col cols="8" class="px-1 py-1">
                   <BaseInput outlined  :label="$t('name_id')" v-model="searchText" @keyPressEnter="onSearchUser" class="w-100"></BaseInput>
                </v-col>
                <v-col cols="4" class="px-1 py-1" >
                    <v-row no-gutters >
                        <v-spacer></v-spacer>
                        <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')"  @onclick="onProcessConfirm('SAVE_USER', onSaveUser)" v-bind:disabled.sync="isProcessing" />
                        <BaseButton btn_type="default" icon_type="show_org_panel" :btn_text="$t('show_org_panel')"   v-if="!orgPanel" mdi-icon="mdi-forwardburger" @onclick="orgPanel = !orgPanel" />
                    </v-row>
                </v-col>
            </v-row>
            <BaseGridView :headertype="1" ref='idGrid' :height="limitHeight"  :header="header1"  @cellClick="onSearchOrg" :autocheckbox="false" :selectionmode="'singlerow'" ></BaseGridView>
        </v-col>

        <v-col cols="12" :lg="6" align="right" v-show="orgPanel">
            <v-row no-gutters  class="px-1 py-1">
                <BaseButton btn_type="default" icon_type="hide_org_panel" :btn_text="$t('hide_org_panel')" v-if="orgPanel" mdi-icon="mdi-backburger" @onclick="orgPanel = !orgPanel" />
                
                <v-spacer></v-spacer>
                <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')"  @onclick="onProcessConfirm('SAVE_ORG', onSaveOrg)" v-bind:disabled.sync="isProcessing" />
            </v-row>
            <BaseGridView :headertype="1" ref='idGrid2' :height="limitHeight2"  :header="header2" :editable="true" :autocheckbox="false"></BaseGridView>
        </v-col>
    </v-row>

  </v-container>  
</template> 






<script>
    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import 'sweetalert2/src/sweetalert2.scss'

  export default {
    layout: 'default',
    middleware: 'user',

    components: { 
    },

    data: () => ({
        selectedCompany:'',
        selectedTab: 'tab1',
        searchText:'',
        lstOrg:[],
        selectedUser1:null,
        actionProcess: null,
        orgPanel:true,
        bizPanel:false,

        header1:[],
        header2:[],

    }),

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 195 },
      limitHeight2() { return this.windowHeight - 195 },
      userTabSize: function(){
        
        if( this.orgPanel && !this.bizPanel || !this.orgPanel && this.bizPanel ) return 6;
        //else if( this.orgPanel && this.bizPanel) return 4;
        else return 12;
      }
    },

    created() {
      this.selectedCompany = this.user.TCO_COMPANY_PK;
    
      this.prepareCommonData()
      
    },


   
    methods: {

        async prepareCommonData(){

            this.lstOrg = await  this._getOrg(this.selectedCompany);

            this.header1 = [
                { title: ("user_id") , field:"USER_ID" , editable: false  , type: ""},
                { title: ("emp_id") , field:"EMP_ID" , editable: false  , type: ""},
                { title: ("full_name") , field:"FULL_NAME" , editable: false  , type: "", width: 150},
                { title: ("organization"     ) , field:"TCO_ORG_PK"       , editable: false  , type: "list", datasource: { KEY: 'PK', VALUE:'TEXT', data: this.lstOrg}, width: 150},
                { title: ("salary_security") , field:"SALARY_SECURITY" , editable: true  , type: "boolean"},
            ];


            this.header2 = [
                { title: ("sel") , field:"SEL" , editable: true  , type: "boolean"},
                { title: ("org_id") , field:"ORG_ID" , editable: false  , type: ""},
                { title: ("org_nm") , field:"ORG_NM" , editable: false  , type: "", width: 180},
                // { title: ("st_date") , field:"ST_DATE" , editable: false  , type: "date"},
                // { title: ("end_date") , field:"END_DATE" , editable: false  , type: "date"},
                { title: ("remark") , field:"REMARK" , editable: true  , type: "", width: 300},
            ];

            this.onSearchUser();
        },

        async onProcessConfirm(action){

            this.actionProcess = action;
            //this.actionDialog = true;

            let promise = Swal.fire({
                icon: 'question',
                title: this.$t(`do_you_want_to_${action.toLowerCase()}`) ,
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

        onProcess(){
            if(this.actionProcess === 'SAVE_ORG')
            {
                this.onSaveOrg();
            }

            if(this.actionProcess === 'SAVE_USER')
            {
                this.onSaveUser();
            }
        },

        

        async onSearchUser(){
            const dso = {
                type: 'grid',
                selpro: 'hr_sel_8010120_user_list',
                para: [this.selectedCompany ?this.selectedCompany :'ALL' , this.searchText]
            }

            this.$refs.idGrid.onSearch(dso);
        },

        async onSaveUser(){

            const dso = {
                type: 'grid',
                selpro: 'hr_sel_8010120_user_list',
                updpro: 'hr_upd_8010120_user_list',
                para: [this.selectedCompany ?this.selectedCompany :'ALL' , this.searchText],
                elname:[
                    "_rowstatus", "PK", "SALARY_SECURITY"
                ],
            };

            this.$refs.idGrid.onSave(dso, false);
        },

        async onSearchOrg(data) {

            this.selectedUser1 = data.data.PK;

            const dso = {
                type: 'grid',
                selpro: 'hr_sel_8010120_user_role',
                para: [this.selectedCompany ?this.selectedCompany :'ALL' , this.selectedUser1]
            }

            await this.$refs.idGrid2.onSearch(dso);
        },

        async onSaveOrg(){

            this.$refs.idGrid2.onSetAll("USER_PK", this.selectedUser1, false);

            const dso = {
                type: 'grid',
                selpro: 'hr_sel_8010120_user_role',
                updpro: 'hr_upd_8010120_user_role',
                para: [this.selectedCompany ?this.selectedCompany :'ALL' , this.selectedUser1],
                elname:[
                    "_rowstatus", "SEL", "TCO_ORG_PK", "USER_PK", "REMARK"
                ],
            };

            this.$refs.idGrid2.onSave(dso, false);
        },

        
        

    } 


  }
</script>
