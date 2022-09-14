<template>
  <v-container fluid class="px-0 pt-0">
      <v-row no-gutters class="px-1 " align="center" justify="center">
          <v-col cols="12" lg="3"  class="px-1 py-1">
             
          </v-col>
          <v-col cols="12" lg="2" class="px-1 py-1">
              <BaseSelect  item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" :outlined="true" > </BaseSelect>
          </v-col>
          <v-col cols="12" lg="2"  class="px-1 py-1">
                <BaseDatePicker v-model="selectedMonth" month default :label="$t('month')" :outlined="true"></BaseDatePicker>
          </v-col>
          <v-col cols="12" lg="2"  class="px-1 py-1">
              <table width="100%" cellspacing="0" cellspading="0">
                <tr>
                    <td><BaseDatePicker v-model="selectedMaxDate"  default :label="$t('max_calendar_date')" :outlined="true"></BaseDatePicker></td>
                    <td width="25px"><BaseButton btn_type="icon" icon_type="process" :btn_text="$t('process')"  @onclick="processPlan" /></td>
                    <td width="25px"><BaseButton btn_type="icon" icon_type="popup" :btn_text="$t('detail')"  @onclick="popupDetail" /></td>
                </tr>
              </table>
          </v-col>
          <v-col cols="12" lg="3"  class="px-1 py-1">
             
          </v-col>
      </v-row>

      <v-row no-gutters class="pt-5">
        <v-col cols="12">
            <v-card   v-resize="onResize"   >
                <v-sheet height="670">
                    <v-calendar 
                        ref="calendar"
                        color="success"
                        type="month"
                        v-model="calendarValue"
                        @change="updateRange"
                    >
                    <template v-slot:day="{  date }">
                        <v-row class="fill-height"  justify="center">
                        <v-sheet
                            :color="tracked.find( q => q['date'] == date) ? tracked.find( q => q['date'] == date)['color'] :'transparent'"
                            :title="tracked.find( q => q['date'] == date) ? tracked.find( q => q['date'] == date)['title'] :''"
                            width="100%"
                            height="50%"
                            tile
                        >
                            <v-row class="fill-height" align="center" justify="center">
                                {{tracked.find( q => q['date'] == date) ? tracked.find( q => q['date'] == date)['remark'] :''}}
                            </v-row>
                           
                        </v-sheet>
                        </v-row>
                    </template>
                    
                    </v-calendar>
                </v-sheet>
            </v-card>
        </v-col>
    </v-row>

    <CalendarDialog ref="calendarDialog" :tco_company_pk="selectedCompany" :month="selectedMonth"></CalendarDialog>
  </v-container>  
</template> 






<script>

    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import 'sweetalert2/src/sweetalert2.scss'
    import moment from "moment";
    import CalendarDialog from '@/components/dialog/CalendarDetailDialog.vue';

  export default {
    layout: 'default',
    middleware: 'user',

    components: { 
        CalendarDialog
    },

    data: () => ({

        companyList:[],


        selectedCompany: null,
        selectedMonth:null,
        selectedMaxDate:null,
        calendarValue: "",

        tracked: [],
        
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
      this.prepareCommonData();
    },

    watch: {
        selectedMonth(val) {
            if(val) {
                let yy = this.selectedMonth.substring(0,4);
                let mm = this.selectedMonth.substring(4,6);
                let dd = "01";

                this.calendarValue = yy + "-" + mm + "-" + dd;
            }
        },
        selectedCompany(val) {
            if(val) {
                let tmp = JSON.stringify(this.selectedMonth) ;
                this.selectedMonth = "197012";
                this.getMaxCalendarDate();

                setTimeout( () => {
                    this.selectedMonth = JSON.parse(tmp);
                }, 10 )
            }
        }
    },

   
    methods: {

        async prepareCommonData(){
            this.getCompanyList();
            this.getMaxCalendarDate();
        },
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

        async getMaxCalendarDate(){
            let pa = [this.selectedCompany]
            const dso = {
                type: 'process',
                updpro: 'hr_pro_8010130_max_calendar',
                para: pa
            };

            const result = await this._dsoCall(dso, 'process', false)
            if(result) {
                try {
                    let max_dt = result[0].CAR_DATE;
                    this.selectedMaxDate = max_dt;
                } catch{}
            } 
        },

        async processPlan(){
            let pa = [this.selectedMaxDate, this.selectedCompany]
            const dso = {
                type: 'process',
                updpro: 'hr_pro_8010130_create_car',
                para: pa
            };

            const result = await this._dsoCall(dso, 'process', true)
            if(result) {
               this.onSearch();
               this.getMaxCalendarDate();
            } 
        },

        async onSearch(){
            this.tracked=[];

            let pa = [this.selectedMonth, this.selectedCompany]
            const dso = {
                type: 'process',
                updpro: 'hr_sel_8010130_off_day',
                para: pa
            };

            const result = await this._dsoCall(dso, 'process', false)
            if(result) {
                
                for(let i = 0; i< result.length; i++) {
                    let dt = result[i];
                    if(!!dt["HOL_TYPE"]) {
                        this.tracked.push( { date: dt["CAR_DATE"],   title: this.$t(dt["HOL_TYPE"].toLowerCase()) , color:  dt["COLOR"],   remark: dt["HOL_COMMENT"]   })
                    }
                }
            } 
        },

        popupDetail(){
            this.$refs.calendarDialog.dialogIsShow = true;
        },

        async updateRange ({ start, end }) {
            if (this.selectedMonth === "197012") return;
            await this.onSearch();
        },
    } 


  }
</script>
<style scoped>
.v-calendar-monthly.v-calendar-weekly.v-calendar :deep() div.v-calendar-weekly__head > div.v-calendar-weekly__head-weekday{
    font-weight: 550 !important;
    font-size: 125% !important;
    color: white  !important;
    background: rgb(1,196,254);
}
</style>