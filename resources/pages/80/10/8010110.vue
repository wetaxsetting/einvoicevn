<template>
  <v-container fluid class="px-0 pt-0">
      <v-row no-gutters>
        <v-col cols='12'>
            <v-row align="center" class="px-2 py-2" no-gutters>
                <v-col cols="12" lg="3" class="px-1">
                    <v-select dense cache-items hide-details outlined 
                            item-value="PK" item-text="TEXT" :label="$t('org')" 
                            :items="orgList" v-model="selectedOrg"
                    >
                    </v-select>
                </v-col>
                <v-col cols="12" lg="3" class="px-1">
                    <v-select dense cache-items hide-details outlined 
                            item-value="CODE"  item-text="NAME" :label="$t('nation')" 
                            :items="nationList" v-model="selectedNation"
                            >
                    </v-select>
                </v-col>
                <v-col cols="12" lg="3" class="px-1">
                    <v-select dense cache-items hide-details outlined 
                            item-value="CODE" item-text="NAME" :label="$t('status')" 
                            :items="statusList" v-model="selectedStatus" 
                            >
                    </v-select>
                </v-col>
                <v-col cols="12" lg="3" class="text-right">
                    <v-btn small raised hide-details color="#375875" class="white--text"  @click="reloadCalendar" v-bind:disabled.sync="isProcessing">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn small raised hide-details color="#2f3038" class="white--text" @click="openConfig" v-bind:disabled.sync="isProcessing" v-bind="attrs"  v-on="on" >
                            <v-icon>mdi-cog-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{$t('setting')}}</span>
                    </v-tooltip>

                    
                </v-col>
            </v-row>

            <v-row align="center" class="px-2" no-gutters>
                <v-col cols="12" lg="3" class="px-1">
                    <v-select dense cache-items hide-details outlined 
                            item-value="CODE" item-text="NAME" :label="$t('event_type')" 
                            :items="eventList" v-model="selectedEvent"
                            >
                    </v-select>
                </v-col>
                <v-col cols="12" lg="6" class="px-1">
                    <v-text-field clearable dense hide-details outlined  :label="$t('name_id')" v-model="searchText" @keypress.enter="reloadCalendar"></v-text-field>
                </v-col>
                <v-col cols="12" lg="1" class="px-1" align="right">

                </v-col>
                <v-col cols="12" lg="2" class="text-right">
                    <date-picker :outlined="true" :label="$t('month')" :type="'month'" @returnValue="selectedMonth = $event" ></date-picker>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    <v-row no-gutters class="pt-5">
        <v-col cols="12">
            <v-card outlined tile v-resize="onResize"   color="#5490ff" class="px-1 py-1"
            >
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

  export default {
    layout: 'default',
    middleware: 'user',

    components: { 
      'event-setting-dialog': eventSetting,
      'event-date-dialog' : eventByDate,
      'date-picker': DatePicker,
      'hr-employee-detail': empDetail
    },

    data: () => ({
      selectedCompany:'',
        orgList: [],
        selectedOrg: '',
        nationList:[],
        selectedNation: 'ALL',
        statusList:[],
        selectedStatus: 'A',
        eventList:[],
        selectedEvent:'ALL',
        searchText:'',
        selectedMonth: new Date().toISOString().substr(0, 7),


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
      this.selectedCompany = this.user.TCO_COMPANY_PK;
      this.getOrgList() ;
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
        }
    },

   
    methods: {

        async prepareCommonData(){

            let parentCodes = [
                "HR0009", "HR0022"
            ] ;

            let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );

            this.nationList = listCommonCode[0];
            this.statusList = listCommonCode[1];

            this.nationList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
            this.statusList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });

            await this.getEventList();


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

        async getOrgList() 
        {

            const dso={
                type:'list',
                selpro:'SYS_SEL_LIST_ORG',
                para: [ this.user.TCO_COMPANY_PK ],   //type array[]                   
            }

            const result  = await this._dsoCall(dso,'select',false);
            if(result) {
                this.orgList = result;
                this.selectedOrg = this.orgList[0].PK;
            } else {
                this.orgList = []
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
