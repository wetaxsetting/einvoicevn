<template>
  <v-container fluid class="px-0 pt-0">
    <v-row no-gutters>
      <v-col cols="12">
        <BaseTabs>
          <BaseTab :name="$t('salary_view')">
            <v-row no-gutters >
              <v-col cols='12'>
                <v-card outlined tile v-resize="onResize">
                  
                    <v-row align="center" no-gutters>
                      <v-col cols='12' lg="6" class="px-1 py-1">
                          <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="companyType2" > </BaseSelect>
                      </v-col>
                        <v-col cols="12" lg="6" align="right">
                          <font color=red>VHR_SAL_CUSTOM</font>
                        </v-col>
                    </v-row>

                    <v-row align="center" no-gutters>
                      <BaseGridView :headertype="1" ref='idGrid1'
                                      :editable="false" :multiselect='true'
                                      :gridfilter='true' :height="limitHeight"
                                      :header="header1"
                      ></BaseGridView>

                    </v-row>

                </v-card>
              </v-col>
            </v-row>
          </BaseTab>
          <BaseTab :name="$t('salary_column')">
            <v-row no-gutters >
              <v-col cols='12' lg="4">
                    <v-row justify="center" align="center">
                        <v-col cols='12' lg="4" valign="middle">
                          <font color="black">{{ $t('original_column') }}</font>
                        </v-col>
                        <v-col cols='12' lg="6" class="px-1 py-1">
                          <BaseInput :outlined="true"  :clearable="false"  :label="$t('column_name')" v-model="tab2_input_col_name" ></BaseInput>
                        </v-col>
                        <v-col cols='12' lg="2" class="px-1 py-1">
                          <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearchTab2_1"  />
                            <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('save')" @onclick="onSearchTab2_1"  />
                            
                          </v-row>
                        </v-col>
                      
                    </v-row>
                    <v-row no-gutters>
                        <BaseGridView :headertype="1" ref='idGridTab2_1'
                                      :editable="true" :multiselect='true'
                                      :gridfilter='true' :height="limitHeight"
                                      :header="tab2_header1" 
                        ></BaseGridView>
                    </v-row>
                  
              </v-col>
              <v-col cols='12' lg="8" class="px-1">
                    <v-row no-gutters>
                       <v-col cols='12' lg="6">
                          <BaseInput :outlined="true"  :clearable="false"  :label="$t('column_name')" v-model="tab2_input_col_name2" ></BaseInput>
                        </v-col>
                        <v-col cols='12' lg="6">
                          <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearchTab2_2"  />
                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onProcessConfirm('SAVE_DATA_SALARY')"  />
                            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onProcessConfirm('DELETE_DATA_SALARY')"  />
                          </v-row>
                        </v-col>
                      
                    </v-row>

                    <v-row no-gutters>
                        <BaseGridView :headertype="1" ref='idGridTab2_2'
                                      :editable="true" :multiselect='true'
                                      :gridfilter='true' :height="limitHeight"
                                      :header="tab2_header2" 
                                      :selectionmode="'checkbox'"
                        ></BaseGridView>
                    </v-row>
               
              </v-col>
            </v-row>
          </BaseTab>
          <BaseTab :name="$t('create_vew')">
            <v-row no-gutters>
              <v-col cols='12' lg="4">
                  <v-row  justify="center" align="center">
                      <v-col cols='12' lg="4" valign="middle">
                        <font color="black">{{ $t('salary_column') }}</font>
                      </v-col>
                      <v-col cols='12' lg="6" class="px-1 py-1">
                        <BaseInput :outlined="true"  :clearable="false"  :label="$t('column_name')" v-model="tab3_input_col_name" ></BaseInput>
                      </v-col>
                      <v-col cols='12' lg="2" class="px-1 py-1">
                        <v-row no-gutters>
                          <v-spacer></v-spacer>
                          <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearchTab3_1"  />
                          <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('add')" @onclick="onSelectTab3_1"  />
                        </v-row>
                      </v-col>
                    
                  </v-row>
                  <v-row no-gutters>
                      <BaseGridView :headertype="1" ref='idGridTab3_1'
                                    :editable="true" :multiselect='true'
                                    :gridfilter='true' :height="limitHeight"
                                    :header="tab3_header1" 
                                    :selectionmode="'checkbox'"
                      ></BaseGridView>
                  </v-row>
              </v-col>
              <v-col cols='12' lg="8" class="px-1">
                  
                  <v-row  no-gutters>
                      <v-col cols='12' lg="4" class="px-1 py-1">
                          <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="companyType" > </BaseSelect>
                      </v-col>
                      <v-col cols='12' lg="4" class="px-1 py-1">
                          <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('salary_view_column')" :lstData="lstColumnOfView" v-model="tab3_input_col_name2" > </BaseSelect>
                      </v-col>
                      <v-col cols='12' lg="4" class="px-1 py-1">
                        <v-row no-gutters>
                          <v-spacer></v-spacer>
                          <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearchTab3_2"  />
                          <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onProcessConfirm('SAVE_DATA_CREATE')"  />
                          <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onProcessConfirm('DELETE_DATA_CREATE')"  />
                          <BaseButton btn_type="icon"  icon_type="process" :btn_text="$t('process')"  @onclick="onProcessConfirm('PROCESS')"  />
                        </v-row>
                      </v-col>
                    
                  </v-row>

                  <v-row no-gutters>
                      <BaseGridView :headertype="1" ref='idGridTab3_2'
                                    :editable="true" :multiselect='true'
                                    :gridfilter='true' :height="limitHeight"
                                    :header="tab3_header2"
                      ></BaseGridView>
                  </v-row>
              </v-col>
            </v-row>
          </BaseTab>
        </BaseTabs>
      </v-col>
    </v-row>






    


  </v-container>
</template>






<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
  import moment from "moment"
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'

  export default {
    layout: 'default',
    middleware: 'user',

    components: {
      'hr-grid': HRBasicGrid,
    },

    data: () => ({
      selectedTab: "tab1",
      actionProcess:"",

       lstColumnOfView:[],
       lstColumnOfViewGrid3:[],
       companyList:[],

      header1:[],
      tab2_header1:[],
      tab2_header2:[],

      tab3_header1:[],
      tab3_header2:[],

      data: null,
      tab2_input_col_name:"",
      tab2_input_col_name2:"",

      tab3_input_col_name:"",
      tab3_input_col_name2:"",
      
      companyType:'',
      companyType2:'',
      search_yn: true,
    }),

    computed:
    {
      user: function () {
        return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 220 },

    },

    created() {
      this.getCompanyList();
      this.createHeader();
    },


    watch: {
      companyType(value){
        if (value) {
           this.loadData();
        }
      },
      companyType2(value){
        if (value) {
           this.onSearch();
        }
      }
      
    },



    methods: {
      async getCompanyList() {
        const dso_company_list  = {
        type: 'list',
        selpro: 'SYS_SEL_LIST_COMPANY',
        para: [this.user.PK]
        }
        this.companyList = await this._dsoCall(dso_company_list, 'select', false)
        
        this.onSearch();
      },

      async prepareCommonData() {
        
        let parentCodes = [  "HR0094"  ] ; // HR0173
        let listCommonCode = await this._getCommonCode2( parentCodes,  this.companyType , true );

        this.lstColumnOfViewGrid3 = listCommonCode[0];
        this.lstColumnOfView = listCommonCode[0];
        this.lstColumnOfView.unshift({CODE:'ALL', NAME: this.$t("select_all")});
      },


      async createHeader() {

        await this.prepareCommonData();

       
        this.headerTab1();
       this.tab2_header1 = [
           { title: this.$t("column_name"), field: "COLUMN_NAME", editable: false, type: "", width: 200 },
           { title: this.$t("data_type"), field: "DATA_TYPE", editable: false, type: "", width: 150 },
       ]

       this.tab2_header2 = [
           { title: this.$t("thr_month_salary_column"), field: "THR_MONTH_SALARY_COLUMN", editable: false, type: "", width: 200 },
           { title: this.$t("thr_month_salary_name"), field: "THR_MONTH_SALARY_NAME", editable: true, type: "", width: 200 },
           { title: this.$t("description"), field: "DESCRIPTION", editable: true, type: "", width: 200 },
           { title: this.$t("data_type"), field: "DATA_TYPE", editable: false, type: "", width: 150 },
       ]


       this.tab3_header1 = [
           { title: this.$t("thr_month_salary_name"), field: "THR_MONTH_SALARY_NAME", editable: false, type: "", width: 200 },
           { title: this.$t("data_type"), field: "DATA_TYPE", editable: false, type: "", width: 150 },
       ];

       this.headerTab3()
        await this.checkViewExisted();
      },

      headerTab1(){
        this.header1 = [
          { title: this.$t("salary_view_column"), field: "SALARY_VIEW_COLUMN", editable: false, type: "", width: 200 },
          { title: this.$t("description"), field: "DESCRIPTION", editable: false, type: "", width: 200 },
          { title: this.$t("col_in_salary"), field: "COL_IN_SALARY",editable: false, type: "", width: 200 },
        ];
      },

      headerTab3(){
        this.tab3_header2 = [
           { title: this.$t("thr_month_salary_column"), field: "THR_MONTH_SALARY_COLUMN", editable: false, type: "", width: 200 },
           { title: this.$t("salary_col_nm"), field: "SALARY_COL_NM", editable: false, type: "", width: 200 },
           { title: this.$t("salary_view_column"), field: "SALARY_VIEW_COLUMN", editable: true, type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.lstColumnOfViewGrid3}, width: 200 },
           { title: this.$t("data_type"), field: "DATA_TYPE", editable: false, type: "", width: 150 },
       ]
      },

       async loadData(){
        await this.prepareCommonData();
        this.headerTab3();
        await this.onSearchTab3_2();
       },

      async checkViewExisted() {
        let obj = {};

        const dso = {
            type: 'process',
            updpro: 'HR_SEL_8010100_VIEW_EXISTED',
            para: [this.companyType2]
        }  ;
        
        const result = await this._dsoCall(dso, 'process', false)
        if(result) {
          obj = result[0];

            if(obj["EX"]  === 1  ) {
                await this.getGrid1();
            }
        } 
      },

      async getGrid1() {
        // console.log("getGrid1");
        // const dso = {
        //     type: 'grid',
        //     selpro: 'HR_SEL_8010100_COL_VIEW2',
        //     para: null
        // };

        // this.$refs.idGrid1.onSearch(dso);
      },


     
      async onProcessConfirm(action) {

        this.actionProcess = action;

        let promise = Swal.fire({
          icon: 'question',
          title: this.$t('do_you_want_to' + '_' + action.toLowerCase()),
          showCancelButton: true,
          confirmButtonText: this.$t("yes"),
          cancelButtonText: this.$t("no")
        }).then((result) => {
          if (result.isConfirmed) {
            switch (action) {
              case 'SAVE_DATA_CREATE':
                this.onSaveTab3_2();
              break;
              case 'DELETE_DATA_CREATE':
                this.onDeleteTab3_2();
              break;
              case 'PROCESS':
                this.onCreateView();
              break;
              case'SAVE_DATA_SALARY':
                this.onSaveTab2_2();
              break;
               case'DELETE_DATA_SALARY':
                this.onDeleteTab2_2();
              break;
              default:
              break;
            }
          }
        });

        await promise;
      },

     

      //tab1============================================================
      async onSearch() {
        const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_COL_VIEW2',
            para: [this.companyType2]
        };

        this.$refs.idGrid1.onSearch(dso);
        //this.header1();
      },


      async onSave() {
        
      },

      async onDelete() {
       
      },
      openSearch(){
        this.search_yn = !this.search_yn;
      },



      //tab 2==============================================================
      onSelectTab2_1(){
        let selectedData = this.$refs.idGridTab2_1.selectedData();

        selectedData.forEach(x => {
            let newRow = {
                THR_MONTH_SALARY_COLUMN: x.COLUMN_NAME,
                DATA_TYPE: x.DATA_TYPE
            };

            this.$refs.idGridTab2_2.onAdd(newRow);

        });
        let selectedIndex = this.$refs.idGridTab2_1.onSelectedIndex();

        if (selectedIndex && !Array.isArray(selectedIndex)) {
            selectedIndex = [selectedIndex];
        }
        let gridControl = this.$refs.idGridTab2_1.getControl();
        gridControl.deleterow(selectedIndex);

      },

      async onSearchTab2_1() {
        const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_THR_SAL_COLS',
            para: [this.tab2_input_col_name]
        };

        this.$refs.idGridTab2_1.onSearch(dso);
      
      },



      async onSearchTab2_2() {
          const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_COL_SALARY',
            para: [this.tab2_input_col_name2]
        };

        this.$refs.idGridTab2_2.onSearch(dso);
      
      },


      async onSaveTab2_2() {
        const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_COL_SALARY',
            updpro: 'HR_UPD_8010100_COL_SALARY',
            para: [this.tab2_input_col_name2],
            elname:[
                "_rowstatus", "PK", "THR_MONTH_SALARY_COLUMN", "THR_MONTH_SALARY_NAME", "DESCRIPTION", "DATA_TYPE"
            ],
        };

        this.$refs.idGridTab2_2.onSave(dso, true);
      },

      async onDeleteTab2_2() {
        const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_COL_SALARY',
            updpro: 'HR_UPD_8010100_COL_SALARY',
            para: [this.tab2_input_col_name2],
            elname:[
                "_rowstatus", "PK", "THR_MONTH_SALARY_COLUMN", "THR_MONTH_SALARY_NAME", "DESCRIPTION", "DATA_TYPE"
            ],
        };

        this.$refs.idGridTab2_2.onDelete(dso, true);
      },


    //tab 3==============================================================
     onSelectTab3_1(){
      let selectedData = this.$refs.idGridTab3_1.onSelectedData();
      selectedData.forEach(x => {
             let newRow = {
                THR_MONTH_SALARY_COLUMN: x.THR_MONTH_SALARY_COLUMN,
                SALARY_COL_NM:x.THR_MONTH_SALARY_NAME,
                DATA_TYPE:x.DATA_TYPE, TCO_COMPANY_PK: this.companyType
             };
             this.$refs.idGridTab3_2.onAdd(newRow);


        });
        let selectedIndex = this.$refs.idGridTab3_1.onSelectedIndex();

        if (selectedIndex && !Array.isArray(selectedIndex)) {
            selectedIndex = [selectedIndex];
        }
        let gridControl = this.$refs.idGridTab3_1.getControl();
        gridControl.deleterow(selectedIndex);
       
    },

      async onSearchTab3_1() {
          const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_COL_SALARY',
            para: [this.tab3_input_col_name]
        };

        this.$refs.idGridTab3_1.onSearch(dso);
      
      },






       async onSearchTab3_2() {
          const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_VIEW2_COL',
            para: [this.tab3_input_col_name2, this.companyType]
        };

        this.$refs.idGridTab3_2.onSearch(dso);
      
      },


      async onSaveTab3_2() {

        const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_VIEW2_COL',
            updpro: 'HR_UPD_8010100_VIEW2_COL',
            para:[this.tab3_input_col_name2, this.companyType],
            elname:[
                "_rowstatus", "PK","TCO_COMPANY_PK", "THR_MONTH_SALARY_COLUMN", "SALARY_COL_NM", "SALARY_VIEW_COLUMN", "DATA_TYPE"
            ],
            requirecol: ["SALARY_VIEW_COLUMN" ]
        };

        this.$refs.idGridTab3_2.onSave(dso, false);
      },

      async onDeleteTab3_2() {
        const dso = {
            type: 'grid',
            selpro: 'HR_SEL_8010100_VIEW2_COL',
            updpro: 'HR_UPD_8010100_VIEW2_COL',
            para:[this.tab3_input_col_name2],
            elname:[
                "_rowstatus", "PK", "THR_MONTH_SALARY_COLUMN", "SALARY_COL_NM", "SALARY_VIEW_COLUMN", "DATA_TYPE"
            ],
        };

        this.$refs.idGridTab3_2.onDelete(dso, true);
      },

      async onCreateView() {
        let obj = {};

        const dso = {
            type: 'process',
            updpro: 'HR_PRO_8010100_AUTO_SAL_V',
            para: null
        }  ;
        
        const result = await this._dsoCall(dso, 'process', true)
        if(result) {
          obj = result[0];

            if(obj["RTN"]  === 0  ) { //success
                await this.getGrid1();
            }
        } 
    }

    },

    

  }
</script>
