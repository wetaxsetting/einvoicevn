<template>
  <v-container fluid class="px-0 pt-0">
      <v-row no-gutters>
        <v-col cols='12'>
            <v-row align="center" class="px-2 py-2" no-gutters>
                <v-col cols="12" lg="3" class="px-1">
                    <HROrg :lstData="orgList" v-model="selectedOrg" @orgchanged="orgchanged"  ></HROrg>
                </v-col>
                <v-col cols="12" lg="3" class="px-1">
                    <BaseSelect :outlined="true"  item-value="CODE" item-text="NAME" :label="$t('nation')" :lstData="nationList" v-model="selectedNation"> </BaseSelect>
                </v-col>
                <v-col cols="12" lg="3" class="px-1">
                    <BaseSelect :outlined="true"  item-value="CODE" item-text="NAME" :label="$t('status')" :lstData="statusList" v-model="selectedStatus"> </BaseSelect>
                </v-col>
                <v-col cols="12" lg="3" class="text-right">
                    <v-row no-gutters>
                        <v-spacer></v-spacer>
                        <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="reloadCalendar" v-bind:disabled.sync="isProcessing"/>
                        <BaseButton btn_type="icon" icon_type="process" :btn_text="$t('setting')" @onclick="openConfig" v-bind:disabled.sync="isDisabled"/>
                    </v-row>
                </v-col>
            </v-row>

            <v-row align="center" class="px-2" no-gutters>
                <v-col cols="12" lg="3" class="px-1">
                    <BaseSelect :outlined="true"  item-value="CODE" item-text="NAME" :label="$t('event_type')" :lstData="eventList" v-model="selectedEvent"> </BaseSelect>
                </v-col>
                <v-col cols="12" lg="6" class="px-1">
                    <BaseInput :outlined="true" :clearable="true"  :label="$t('name_id')" v-model="searchText" @click='reloadCalendar'  ></BaseInput>
                </v-col>
                <v-col cols="12" lg="1" class="px-1" align="right">

                </v-col>
                <v-col cols="12" lg="2" class="text-right">
                    <BaseDatePicker default month v-model="selectedMonth" outlined  :label="$t('month')"  class="px-0" :clearable="false"></BaseDatePicker>
                </v-col>
            </v-row>
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
                        :events="events"
                        :event-color="getEventColor"
                        @change="updateRange"
                        @click:date="openDateDialog"
                        @click:more="openDateDialog"
                        @click:event="openEmployeeDetail"
                    ></v-calendar>
                </v-sheet>
            </v-card>
        </v-col>
    </v-row>



    <event-setting-dialog ref="eventSetting"></event-setting-dialog>
    <event-date-dialog ref="eventByDate" :date="selectedDate" :events="selectedDateEvents"></event-date-dialog>
    <hr-employee-detail ref="empDetail" :changeFlag="changeFlag" :employee="selectedEmp"></hr-employee-detail>
  </v-container>  
</template> 






<script>

    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import 'sweetalert2/src/sweetalert2.scss'
    import DatePicker from '@/components/control/DatePicker';
    import moment from "moment";

    import eventSetting from '@/components/part/80/10/8010110_EventSettingDialog.vue';
    import eventByDate from '@/components/part/80/10/8010110_EventByDateDialog.vue';
    import empDetail from '@/components/part/10/10/1010010_EmpDetailDialog.vue';

    import HROrg from '@/components/part/10/controls/hr_organization.vue';

  export default {
    layout: 'default',
    middleware: 'user',

    components: { 
      'event-setting-dialog': eventSetting,
      'event-date-dialog' : eventByDate,
      'date-picker': DatePicker,
      'hr-employee-detail': empDetail,
      HROrg
    },

    data: () => ({
        selectedCompany: null,
        orgList: [],
        selectedOrg: null,
        nationList:[],
        selectedNation: 'ALL',
        statusList:[],
        selectedStatus: 'A',
        eventList:[],
        selectedEvent:'ALL',
        searchText:'',
        selectedMonth: null,


        calendarValue: "",
        events: [],

        selectedDate:"",
        selectedDateEvents:[],
        dataEventList: [],

        dateFrom:"",
        dateTo:"",

        changeFlag:0,
        selectedEmp: null

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
        selectedOrg(val) {
            if(val)
                this.reloadCalendar();
        }
    },

   
    methods: {

        async prepareCommonData(){
            this.orgList = await this._getOrgByUser(this.user.PK);

            


        },

        async orgchanged(org_pk, org){
        if( this.selectedCompany != org["TCO_COMPANY_PK"] ) {
            this.selectedCompany = org["TCO_COMPANY_PK"];
            let parentCodes = [
                "HR0009", "HR0022"
            ] ;

            let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany  );

            this.nationList = listCommonCode[0];
            this.statusList = listCommonCode[1];

            this.nationList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
            this.statusList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });

            await this.getEventList();
        }
      },      

        async getEventList() {
            let pa = null;

            const dso = {
                type: 'grid',
                selpro: 'hr_sel_8010110_events',
                para: pa
            }

            const result  = await this._dsoCall(dso,'select',false);
            if(result) {
                this.eventList = result;
                this.eventList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
            } else {
                this.eventList = []
            }  

        },

    

        openConfig(){

            this.$refs.eventSetting.dialogIsShow = true;

        },

        openDateDialog(e){
            this.selectedDate =  moment(e.date, "YYYY-MM-DD").format("YYYYMMDD");
            this.selectedDateEvents = this.dataEventList.filter( x => x.DATE === this.selectedDate);
            this.$refs.eventByDate.dialogIsShow = true;
            
        },

        openEmployeeDetail(e) {

            console.log(e);

            let evt = e.event.data;

            this.$refs.empDetail.dialogIsShow = true;

            this.changeFlag = new Date().getTime();
            this.selectedEmp = evt.THR_EMP_PK;
        },

        async onSearch() {
            let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEvent, this.searchText, this.selectedMonth ];

            paramSearch.map( x => {
                x = typeof x === 'string' ? x.replace("'","''") : x;
            });

            const dso={
                type:'list',
                selpro:'hr_sel_8010110_event_list',
                para: paramSearch,   //type array[]                   
            }

            const result  = await this._dsoCall(dso,'select',false);

            if(result) {
                this.dataEventList = result;
            } else {
                this.dataEventList = []
            }  



        },



        reloadCalendar(){
            let tmp = JSON.stringify(this.selectedMonth) ;
            this.selectedMonth = "197012";

            setTimeout( () => {
                this.selectedMonth = JSON.parse(tmp);
            }, 10 )
            
        },



        // calendar setting
        getEventColor (event) {
            return event.color
        },

        async updateRange ({ start, end }) {
            if (this.selectedMonth === "197012") return;
            const events = [];

            const min = moment(start.date, "YYYY-MM-DD");
            this.dateFrom = min;

            const max = moment(end.date, "YYYY-MM-DD").add(1, 'days');
            this.dateTo = max;

            let listDate = [];

            await this.onSearch();

            if (this.dataEventList.length > 0) {

                for (let d = min; d.isBefore(max); d.add(1, 'days'))
                {
                    const eventListByDate = this.dataEventList.filter( x => x.DATE === d.format('YYYYMMDD'));
                    if(eventListByDate && eventListByDate.length > 0) {
                        const startTime = d.toDate();
                        const endTime = d.toDate();

                        eventListByDate.forEach( x => {
                            events.push({
                                name: x.TITLE,
                                start: startTime,
                                end: endTime,
                                color: x.COLOR,
                                timed: false,
                                data: x
                            });
                        })
                    }
                }
            }


            this.events = events
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