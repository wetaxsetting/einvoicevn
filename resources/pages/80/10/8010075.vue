<template>
  <v-container fluid class="px-0 pt-0">
        <v-row no-gutters class="py-2" align="center" justify="center">
          <v-col cols="12" lg="4">
              <table style="width: 100%; height:100%" cellspacing="0" cellspading="0">
                  <tr>
                      <td><BaseSelect :outlined="true"   item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" > </BaseSelect></td>
                      <td width="25px"><BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"      @onclick="onSave" v-bind:disabled.sync="isProcessing" /></td>
                  </tr>
              </table>
              
          </v-col>
        </v-row>
        <v-row no-gutters class="py-2 px-2">
            <v-col cols="12">
                <v-card-title class="subtitle-1 primary-gradient white--text py-1"  >
                <span >{{ $t('salary_option')}}</span>
                </v-card-title>
            </v-col>
        </v-row>

        <BaseGridView :headertype="1" ref='idGrid'  
            :height="250" :header="headerOption" :editable="true" :multiselect="false" @row-updated="cellChanged"
        ></BaseGridView>


        <v-row no-gutters class="py-2 px-2">
            <v-col cols="12">
                <v-card-title class="subtitle-1 primary-gradient white--text py-1"  >
                <span >{{ $t('salary_allowance')}}</span>
                </v-card-title>
            </v-col>
        </v-row>

        <BaseGridView :headertype="1" ref='idGrid2'  
            :height="400" :header="headerAllowance" :editable="true" :multiselect="false"
        ></BaseGridView>
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
        companyList:[],
        headerOption:[],
        headerAllowance:[],
        dataOption:[],

        selectedCompany: null,

        dsoSalaryOption: {
            type: 'grid',
            selpro: 'hr_sel_8010075_salary_opt',
            updpro: 'hr_upd_8010075_salary_opt',
            elname:[ ]
        },

        dsoSalaryAllowance: {
            type: 'grid',
            selpro: 'hr_sel_8010075_salary_allow',
            updpro: 'hr_upd_8010075_salary_allow',
            elname:[  
                "_rowstatus", "PK", "MASTER_PK", "OPTION_CHOOSE", "CODE", "CAL_WT_YN", "CAL_OT_YN", "CAL_INS_YN", "ALLOWANCE_PRO_RATE", "NO_WITH_NET_YN", "REMARK", "TCO_COMPANY_PK"
            ]
        },

    }),

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 180 },
     
    },

    created() {
      this.selectedCompany = this.user.TCO_COMPANY_PK;
      this.createHeader();
    },

    watch: {
        selectedCompany(val) {
            this.onSearchOption();
            this.onSearchAllow();
        }
    },

   
    methods: {

     
      
        async prepareCommonData(){
            this.getCompanyList();
        },

        async createHeader(){

            await this.prepareCommonData();

            this.headerOption =[
                { title: ("select"),  field: "OPTION_CHOOSE",  editable: true, type: "boolean", width: 100},
                { title: ("name"),  field: "NAME",  editable: false, type: "", width: 200},
                { title: ("description"),  field: "DESCRIPTION",  editable: false, type: "", width: 1000},
            ]

            this.dataOption = [
                {_rowstatus: "", OPTION_CHOOSE: 'N', IDX: 1, NAME: this.$t('day_salary'), DESCRIPTION: `${this.$t('salary')} / 26 * ${this.$t('working_days')}` },
                {_rowstatus: "", OPTION_CHOOSE: 'N', IDX: 2, NAME: this.$t('month_salary'), DESCRIPTION: `${this.$t('salary')} / ${this.$t('days_in_month')} * ${this.$t('working_days')}` },
                {_rowstatus: "", OPTION_CHOOSE: 'N', IDX: 3, NAME: this.$t('month_salary 2'), DESCRIPTION: `${this.$t('salary')} / 26 * ${this.$t('working_days')} (${this.$t('if_working_days<=13')}) | ${this.$t('salary')} - ${this.$t('salary')}/26*(${this.$t('days_in_month')} - ${this.$t('working_days')}) (${this.$t('if_working_days>13')})` },
            ];

            this.headerAllowance =[
                { title: ("select"),  field: "OPTION_CHOOSE",  editable: true, type: "boolean", width: 100},
                { title: ("code"),  field: "CODE",  editable: false, type: "", width: 200},
                { title: ("name"),  field: "NAME",  editable: false, type: "", width: 200},
                
                { title: ("cal_wt_yn")           ,  field: "CAL_WT_YN",  editable: true, type: "boolean", width: 100},
                { title: ("cal_ot_yn")           ,  field: "CAL_OT_YN",  editable: true, type: "boolean", width: 100},
                { title: ("cal_ins_yn")          ,  field: "CAL_INS_YN",  editable: true, type: "boolean", width: 100},
                { title: ("allowance_pro_rate")  ,  field: "ALLOWANCE_PRO_RATE",  editable: true, type: "", width: 200},
                { title: ("remark")              ,  field: "REMARK",  editable: true, type: "", width: 400},
            ]
            
            setTimeout(() => {
                this.onSearchOption();
                this.onSearchAllow();
            }, 1000);
            


        },

        async getCompanyList() {
            const dso = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [ this.user.PK ]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if(result) {
                this.companyList = result;
            } else {
                this.companyList = []
            }
        },

        cellChanged(args, data){
            let rowIdx = args.rowindex;
            let value = args.value;
            let datas = this.$refs.idGrid.getData();
            if(value == true || value == 'Y') {
                for(let i =0; i< datas.length; i++) {
                    if(i!=rowIdx) {
                        datas[i]["OPTION_CHOOSE"] = false;
                        datas[i]["_rowstatus"] = '';
                    } else {
                        datas[i]["_rowstatus"] = 'u';
                    }
                }
            } else {
                for(let i =0; i< datas.length; i++) {
                    if(i==rowIdx) {
                        datas[i]["_rowstatus"] = 'u';
                    } 
                }
            }
            this.$refs.idGrid.setDataSource(datas);
        },

        async onSearchOption() {
            let pa = [this.selectedCompany];
            this.dsoSalaryOption.para = pa;
            const result = await this._dsoCall(this.dsoSalaryOption, 'select', false)
            if(result && result.length > 0) {
                let opt = result[0]["OPTION_CHOOSE"];
                for(let i =0; i< this.dataOption.length; i++)  {
                    if(this.dataOption[i]["IDX"] == opt) {
                        this.dataOption[i]["OPTION_CHOOSE"] = 'Y';
                    }
                }
            } 
            this.$refs.idGrid.setDataSource(this.dataOption);
        },

        async onSearchAllow(){
            let pa = [this.selectedCompany];
            this.dsoSalaryAllowance.para = pa;

            this.$refs.idGrid2.onSearch(this.dsoSalaryAllowance);
        },
      
        async onSave(){
            let datas = this.$refs.idGrid.getData();
            let opt = datas.find(q => q["_rowstatus"] == 'u' || ( q["OPTION_CHOOSE"] == true || q["OPTION_CHOOSE"] == 'Y' ));
            
            if(opt && opt["_rowstatus"] == 'u') {
                let dso = {...this.dsoSalaryOption};
                dso.type = 'process';
                dso.para = [ opt["IDX"], this.selectedCompany ];
                const result = await this._dsoCall(dso, 'process', true)
                if(result && result.length > 0) {
                    await this.onSearchOption();
                }
            }

            await this.onSaveAllow();
        },

        async onSaveAllow(){
            let pa = [this.selectedCompany];
            this.dsoSalaryAllowance.para = pa;

            await this.$refs.idGrid2.onSave(this.dsoSalaryAllowance);
        },

     


    } 


  }
</script>
