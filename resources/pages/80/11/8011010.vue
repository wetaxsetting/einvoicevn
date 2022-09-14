<template>
  <v-container fluid class="px-0 pt-0">
    <v-row align="center" class="px-2">
      <v-col cols="12" lg="3" class="px-1">
        <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" > </BaseSelect>
      </v-col>
      <v-col cols="12" lg="3" class="px-1">
        <BaseInput :outlined="true"   :label="$t('form_name_id')" v-model="searchForm" @keyPressEnter="onSearch" ></BaseInput>
      </v-col>
      <v-col cols="12" lg="3" class="px-1">
        <BaseInput :outlined="true"   :label="$t('report_name')" v-model="searchReport" @keyPressEnter="onSearch" ></BaseInput>
      </v-col>
      <v-col cols="12" lg="3" class="text-right">
        <v-row no-gutters>
          <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch"  />
          <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onAdd"  />
          <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onProcessConfirm('SAVE_DATA')"  />
          <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onProcessConfirm('DELETE_DATA')"  />
        </v-row>
      </v-col>
    </v-row>

    <BaseGridView :headertype="1" ref='idGrid'
        :editable="true" :multiselect='true'
        :gridfilter='true' :height="limitHeight"
        :header="header1" 
      ></BaseGridView>
  </v-container>  
</template> 






<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
  import HRBasicFilter from '@/components/part/10/controls/hr_basic_filter.vue';
  import EmployeeDialog from '@/components/dialog/EmployeeDialog';

  import commonDialog from '@/components/dialog/CommonCodeDialog';
    import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'

  export default {
    layout: 'default',
    middleware: 'user',

    components: { 
      'hr-grid' :HRBasicGrid ,
      'hr-basic-filter' :HRBasicFilter ,
      'employee-dialog':EmployeeDialog,
      'common-code-dialog' : commonDialog
    },

    data: () => ({
      employeeDialog: false,
      commonCodeDialog:false,
      formList:[],
      header1:[],
      rowNum:0,

      companyList: [],
      selectedCompany:'',

      searchForm :'',
      searchReport:'',

      workingDataRow:'',
      parentCode:'',

      filterDatas:[],
      filterCommon:[],

      dso : {
          type: 'grid',
          selpro: 'HR_SEL_8011010_REPORT_MANAGE',
          updpro: 'HR_UPD_8011010_REPORT_MANAGE',
          elname:[
            "_rowstatus", 'PK', 'MENU_ID', 'USE_YN', 'CODE', 'TAB', 'REPORT_NM', 'REPORT_LNM', 'REPORT_FNM', 'PATH_STANDARD', 'PATH_ADVANCE', 'VERSION', 'EXCEL_JSON', 'TCO_COMPANY_PK', "EXTENSION"
          ],
          requirecol:[
            'MENU_ID', 'REPORT_NM', 'PATH_STANDARD'
          ]
        },

    }),

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 650 },
     
    },

    created() {
      this.selectedCompany = this.user.TCO_COMPANY_PK;
      //this.getCompanyList();

      this.createHeader();
    },


   
    methods: {

        async getCompanyList() {
            const dso = {
            type: 'list',
            selpro: 'SYS_SEL_LIST_COMPANY',
            para: [this.user.PK]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result) {
            this.companyList = result;
            } else {
            this.companyList = []
            }
        },
      
        async prepareCommonData(){
            await  this.getCompanyList();
        },

        async createHeader(){

            await this.prepareCommonData();

            this.header1 = [
                { title: ("menu_id"), field: "MENU_ID", editable: true, type: "", width: 100, fixed:true },
                { title: ("use_yn"), field: "USE_YN", editable: true, type: "boolean", width: 80, fixed:true },
                { title: ("code"), field: "CODE", editable: true, type: "", width: 80, fixed:true },
                { title: ("tab"), field: "TAB", editable: true, type: "", width: 150 },
                { title: ("report_name"), field: "REPORT_NM", editable: true, type: "", width: 250 },
                { title: ("report_lname"), field: "REPORT_LNM", editable: true, type: "", width: 250 },
                { title: ("report_fname"), field: "REPORT_FNM", editable: true, type: "", width: 250 },
                { title: ("extension"), field: "EXTENSION", editable: true, type: "", width: 100 },
                { title: ("standard_path"), field: "PATH_STANDARD", editable: true, type: "", width: 250 },
                { title: ("new_path"), field: "PATH_ADVANCE", editable: true, type: "", width: 250 },
                { title: ("version"), field: "VERSION", editable: true, type: "", width: 80 },
                //{ title: ("excel_json"), field: "EXCEL_JSON", editable: true, type: "textarea", width: 400 },
                { title: ("company"), field: "TCO_COMPANY_PK", editable: true, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.companyList }, width: 200 },
            ];

        },
      

        async onProcessConfirm(action) {
            // this.actionProcess = action;
            //this.actionDialog = true;

            let promise = Swal.fire({
            icon: 'question',
            title: this.$t('do_you_want_to' + '_' + action.toLowerCase()),
            showCancelButton: true,
            confirmButtonText: this.$t("yes"),
            cancelButtonText: this.$t("no")
            }).then((result) => {
            if (result.isConfirmed) {
                if(action === "SAVE_DATA") {
                    this.onSave();
                } else if(action === "DELETE_DATA") {
                    this.onDelete();
                }
            }
            });

            await promise;
        },

        async onSearch() {

            let pa = [this.selectedCompany, this.searchForm, this.searchReport];
            this.dso.para = pa;

            this.$refs.idGrid.onSearch(this.dso);
        },


      
        onAdd(){
            let newRow = {
                PK: 0,
                USE_YN: 'Y',
                TCO_COMPANY_PK: this.selectedCompany,
                _rowstatus: 'i'
            };

            this.$refs.idGrid.onAdd(newRow);
        },
      

        onDelete(){
            let pa = [this.selectedCompany, this.searchForm, this.searchReport];
            this.dso.para = pa;

            this.$refs.idGrid.onDelete(this.dso);
        },

        async onSave() {
            let pa = [this.selectedCompany, this.searchForm, this.searchReport];
            this.dso.para = pa;

            this.$refs.idGrid.onSave(this.dso);

        },
     


    } 


  }
</script>
