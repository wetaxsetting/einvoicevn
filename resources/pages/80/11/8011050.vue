<template>
  <v-container fluid class="px-0 pt-0">
    <BaseTabs>
      <BaseTab :name="$t('schedule')" :eager="false">

        <v-row class="px-4 py-1" justify="center" align="center" >
            <v-col cols="12" lg="3" class="py-1 px-1">
              <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" > </BaseSelect>
            </v-col>

            <v-col cols="12" lg="3" class="px-1 py-1">
              <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('work_group')" :lstData="wgList" v-model="selectedWg" > </BaseSelect>
            </v-col>

            <v-col cols="12" lg="3" class="px-0 py-1">
              <v-row no-gutters >
                  <v-col cols="12" lg="6" class="px-1 ">
                    <BaseDatePicker start v-model="selectedFromDate" outlined  :label="$t('from')"  class="px-0"></BaseDatePicker>
                  </v-col>
                  <v-col cols="12" lg="6" class="px-1 ">
                    <BaseDatePicker end v-model="selectedToDate" outlined  :label="$t('to')"  class="px-0"></BaseDatePicker>
                  </v-col>
              </v-row>
            </v-col>

            
            <v-col cols="12" lg="3" class="py-1 px-1">
              <v-row no-gutters>
                <v-spacer></v-spacer>
                <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch" v-bind:disabled.sync="isProcessing" />
                <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onSave" v-bind:disabled.sync="isProcessing" />
                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onDelete" v-bind:disabled.sync="isProcessing" />
              </v-row>
              
            </v-col>
        </v-row>

        <v-row class="px-4 py-0"  >
            <v-col cols="12" :lg="detailYN ? 6 : 12" class="py-1 px-0">
              <v-row class="px-4 py-1" >
                <v-col cols="12" lg="6" class="py-1 px-1">
                  <BaseSelect outlined item-value="PK" item-text="TEXT" :label="$t('work_shift')" :lstData="shiftList" v-model="selectedWS" > </BaseSelect>
                </v-col>

                <v-col cols="12" lg="3" class="px-1 py-1">
                  <table style="width:100%; height:100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>
                            <BaseSelect :outlined="true"   item-value="CODE" item-text="NAME" :label="$t('set_holiday')" :lstData="holTypeList" v-model="selectedSetHol" > </BaseSelect>
                        </td>
                        <td style="width: 15px"><BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="onSet" v-bind:disabled.sync="isProcessing" /></td>
                    </tr>
                  </table>
                </v-col>

                <v-col cols="12" lg="3" class="px-1 py-1">
                  <v-row no-gutters>
                    <v-spacer></v-spacer>
                    <BaseButton btn_type="icon" icon_type="process" :btn_text="$t('manual')" @onclick="actionProcess='MANUAL'; onProcessConfirm('MANUAL', processSchedule)" v-bind:disabled.sync="isProcessing" />
                    <BaseButton btn_type="icon" icon_type="auto" :btn_text="$t('auto')" @onclick="actionProcess='AUTO'; onProcessConfirm('AUTO', processSchedule)" v-bind:disabled.sync="isProcessing" mdi-icon="mdi-cog-play-outline"/>
                    <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="actionProcess='DELETE'; onProcessConfirm('DELETE', processSchedule)" v-bind:disabled.sync="isProcessing" />

                  </v-row>
                </v-col>
              </v-row>

              <BaseGridView ref='idGrid' :headertype="1"
              :editable="true"
              :height="limitHeight"
              :header="header1" 
              @cellClick="onGetDetail"></BaseGridView>
            </v-col>

            <v-col cols="12" :lg="detailYN ? 6 : 0" class="py-1 px-0" >
              <v-row class="px-4 py-1">
                <v-col cols="12" lg="12" class="py-2 px-2">
                  <v-row no-gutters>
                    <v-spacer></v-spacer>
                    <BaseButton btn_type="icon" :btn_text="' '"  v-bind:disabled.sync="isProcessing" mdi-icon="mdi-" />
                  </v-row>
                </v-col>

              </v-row>
              <BaseGridView ref='idGrid12'  :headertype="1" 
                :height="limitHeight"
                :header="header12" ></BaseGridView>
            </v-col>
        </v-row>

        

      </BaseTab>

      <BaseTab :name="$t('month_schedule')" :eager="false">

        <v-row class="px-4 py-1" justify="center" align="center" >
          <v-col cols="12" lg="3" class="py-1 px-1">
            <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany2" > </BaseSelect>
          </v-col>

          <v-col cols="12" lg="3" class="px-1 py-1">
            <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('work_group')" :lstData="wgList2" v-model="selectedWg2" > </BaseSelect>
          </v-col>

          <v-col cols="12" lg="3" class="px-1 py-1">
            <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('period')" :lstData="periodList" v-model="selectPeriod2" > </BaseSelect>
          </v-col>
          
          <v-col cols="12" lg="3" class="py-1 px-1">
            <v-row no-gutters>
              <v-spacer></v-spacer>
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch2" v-bind:disabled.sync="isProcessing" />
              <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onSave2" v-bind:disabled.sync="isProcessing" />
            </v-row>
          </v-col>
        </v-row>

        <v-row class="px-4 py-1" justify="center" align="center" >
          <v-col cols="12" lg="3" class="py-1 px-1">
            <BaseDatePicker default month v-model="selectedMonth2" outlined :clearable="false" :label="$t('work_month')"  class="px-0"></BaseDatePicker>
          </v-col>

          <v-col cols="12" lg="3" class="px-0 py-1">
              <v-row no-gutters >
                  <v-col cols="12" lg="6" class="px-1 ">
                    <BaseDatePicker start v-model="selectedFromDate2" outlined  :label="$t('from')"  class="px-0" readonly></BaseDatePicker>
                  </v-col>
                  <v-col cols="12" lg="6" class="px-1 ">
                    <BaseDatePicker end v-model="selectedToDate2" outlined  :label="$t('to')"  class="px-0" readonly></BaseDatePicker>
                  </v-col>
              </v-row>
            </v-col>

          <v-col cols="12" lg="3" class="px-1 py-1">
            <BaseButton btn_type="text" icon_type="text" :btn_text="$t('work_shift_info')" @onclick="onShowWS" v-bind:disabled.sync="isProcessing" />
          </v-col>
          
          <v-col cols="12" lg="3" class="py-1 px-1">
           
          </v-col>
        </v-row>

        <BaseGridView ref='idGrid2'
            :editable="true" :headertype="1" 
            :height="limitHeight"
            :header="header2" ></BaseGridView>
      
      </BaseTab>
    </BaseTabs>

    <ws-dialog ref="WsDialog" @closewsDialog="WsDialog = false" :multiSelectMode="false"></ws-dialog>
  </v-container>
</template>






<script>
  import WsDialog from '@/components/dialog/WorkshiftDialog';
  import moment from "moment"

  export default {
    layout: 'default',
    middleware: 'user',

    components: {
      'ws-dialog': WsDialog,
    },

    data: () => ({
      detailYN: true,

      companyList:[],
      wgList:[],
      wgList2:[],
      shiftList: [],
      orgList:[],
      holTypeList:[],
      header1:[],
      header12:[],
      header2:[],
      periodList:[],

      selectedCompany:null,
      selectedCompany2:null,
      selectedWg:'ALL',
      selectedWg2:'ALL',
      selectedFromDate:null,
      selectedToDate:null,
      selectedWS: null,
      actionProcess:"",
      selectedSetHol:'SUN',
      selectPeriod2:null,
      selectedMonth2:null,
      selectedFromDate2:null,
      selectedToDate2:null,


      dsoSch: {
        type: 'grid',
        selpro: 'hr_sel_8010050_sch_master',
        updpro: 'hr_upd_8010050_sch_master',
        elname: [
          "_rowstatus", 'PK', 'WORK_DT', 'THR_WS_PK', 'THR_WG_PK', 'HOL_TYPE'
        ],
      },
    }),

    computed:
    {
      user: function () {
        return this.$store.getters["auth/user"];
      },
      limitHeight() { return 650 },
      limitHeight12() { return 680 },

    },

    created() {
      this.prepareCommonData();
    },


    watch: {
      selectedCompany:function(value) {
        if(value) {
          this.changeCompany1();
        }
      },
      selectedCompany2:function(value) {
        if(value) {
          this.changeCompany2();
        }
      },
      selectPeriod2(value) {
        if (value && this.selectedMonth2) {
          this.getMonthInfo();
        }
      },
      selectedMonth2(value) {
        if (value && this.selectPeriod2) {
          this.getMonthInfo();
        }
      },
    },



    methods: {
      async prepareCommonData() {
            this.companyList = await this._getCompanyByUser(this.user.PK);
        
      },

      async changeCompany1() {
        this.orgList = await this._getOrg(this.selectedCompany);
        this.wgList = await this._getWorkGroup(this.selectedCompany);
        this.wgList.unshift({ PK: "ALL", TEXT: this.$t("select_all") });
        this.shiftList = await this._getWorkShift(this.selectedCompany);
        this.holTypeList = await this._getCommonCode('COAB0140', this.selectedCompany);

        this.header1 = [
          { title: ("thr_wg_pk"), field: "THR_WG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList }, width: 150 },
          { title: ("work_dt"), field: "WORK_DT", editable: false, type: "date", width: 150 },
          { title: ("thr_ws_pk"), field: "THR_WS_PK", editable: true, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.shiftList }, width: 400 },
          { title: ("hol_type"), field: "HOL_TYPE", editable: true, type: "list", datasource: { KEY: 'CODE', VALUE: 'NAME', data: this.holTypeList } , cellclassname: this.cellClassName},
          { title: ("day_type"), field: "DAY_TYPE", editable: false, type: "" },

        ];

        this.header12 = [
          { title: ("tco_org_pk"), field: "TCO_ORG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.orgList }, width: 200 },
          { title: ("emp_id"), field: "EMP_ID", editable: false, type: "" },
          { title: ("full_name"), field: "FULL_NAME", editable: false, type: "", width: 300 },

        ];

        this.$refs.idGrid.Clear();
        this.$refs.idGrid12.Clear();

      },

      async changeCompany2() {
        this.wgList2 = await this._getWorkGroup(this.selectedCompany2);
        this.wgList2.unshift({ PK: "ALL", TEXT: this.$t("select_all") });
        await this.getSalaryPeriod();
        await this.getMonthInfo();
        
      },

      async changeHeader2(){
        this.header2 = [
          { title: ("thr_wg_pk"), field: "THR_WG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList2 }, width: 200, fixed:true },
        ];

        let startDate = moment(String(this.selectedFromDate2), "YYYYMMDD");
        let endDate = (moment(String(this.selectedToDate2), "YYYYMMDD")).add(1, 'days');
        let i = 1;

        for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
          this.header2.push({ title: d.date() + "", field: "D"+i, editable: true, type: "number", width: 50, cellclassname: this.cellClassName2 });
          i++;
        }
      },
      
      cellClassName  (row, columnfield, value,rowdata) {
          if(rowdata.HOL_TYPE == "HOL") {
              return "cellHolCar";
          }
          if(rowdata.HOL_TYPE == "SUN") {
              return "cellSunCar";
          }
          return this.cellClassStatus(rowdata);
      },

      cellClassName2  (row, columnfield, value,rowdata) {
        console.log(columnfield);
        if(rowdata[columnfield+"_TYPE"] == "HOL") {
            return "cellHolCar";
        }
        if(rowdata[columnfield+"_TYPE"] == "SUN") {
            return "cellSunCar";
        }
        return this.cellClassStatus(rowdata);
      },

      onShowWS() {
        this.$refs.WsDialog.dialogIsShow = true;
      },

      async getSalaryPeriod() {
        const dso = {
            type: 'list',
            selpro: 'hr_sel_1030010_sal_period',
            para: [ this.selectedCompany2 ]
        }
        const result = await this._dsoCall(dso, 'select', false)
        if(result) {
            this.periodList = result;
        } else {
            this.periodList = []
        }
      },

      async getMonthInfo() {
        const dso = {
          type: 'control',
          selpro: 'hr_sel_8011050_month_info',
          para: [ this.selectedCompany2 , this.selectPeriod2, this.selectedMonth2]
        }

        const result = await this._dsoCall(dso, 'select', false)
        if (result) {
          //debugger;
          this.selectedFromDate2 = result["FROM"];
          this.selectedToDate2 = result["TO"];
        }
        this.changeHeader2();
      },

      async onSearch() {
        let pa = [this.selectedCompany, this.selectedWg, this.selectedFromDate, this.selectedToDate];
        this.dsoSch.para = pa;

        this.$refs.idGrid.onSearch(this.dsoSch);
        this.$refs.idGrid12.Clear();
      },


      async onSave() {
        let pa = [this.selectedCompany, this.selectedWg, this.selectedFromDate, this.selectedToDate];
        this.dsoSch.para = pa;

        this.$refs.idGrid.onSave(this.dsoSch);
      },

      async onDelete() {
        let pa = [this.selectedCompany, this.selectedWg, this.selectedFromDate, this.selectedToDate];
        this.dsoSch.para = pa;

        this.$refs.idGrid.onDelete(this.dsoSch);
      },

      async onGetDetail(data) {
        if(data) {
          let pa = [data.data.PK];
          const dso = {
            type: 'grid',
            selpro: 'hr_sel_8010050_sch_detail',
            para: pa
          }

          this.$refs.idGrid12.onSearch(dso);
        }
        

      },

      async processSchedule() {

        const dso = {
          type: 'process',
          updpro: 'hr_pro_8010050_sch',
          para: [this.selectedCompany, this.selectedWg, this.selectedWS, this.selectedFromDate, this.selectedToDate, this.actionProcess]
        }

        const result = await this._dsoCall(dso, 'process', false)
        if (result) {
          this.showNotification("success", this.$t("process_complete"), '');
          this.onSearch();
        }

      },

      onSet(){
        let setValue = this.selectedSetHol ;
        this.$refs.idGrid.onSet('HOL_TYPE', setValue);
      },



      async onSearch2() {

        let pa = [this.selectedWg2, this.selectedMonth2.replace(/[^0-9]/g, ''), this.selectedFromDate2, this.selectedToDate2, this.selectedCompany2];
        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010050_mon_sch',
          para: pa
        }

        this.$refs.idGrid2.onSearch(dso);
      },


      async onSave2() {


        let pa = [this.selectedWg2, this.selectedMonth2.replace(/[^0-9]/g, ''), this.selectedFromDate2, this.selectedToDate2, this.selectedCompany2];

        this.$refs.idGrid2.onSetAll("FROM", this.selectedFromDate2, false);
        this.$refs.idGrid2.onSetAll("TO", this.selectedToDate2, false);


        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010050_mon_sch',
          updpro: 'hr_upd_8010050_mon_sch',
          para: pa,
          elname: [
            "_rowstatus",
            "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10",
            "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20",
            "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30", "D31",
            "THR_WG_PK", "FROM", "TO"
          ]
        }
        this.$refs.idGrid2.onSave(dso);
      },
      

    }


  }
</script>
<style >
    .cellHolCar{
        background-color: #eb8c34 !important;
    }
    .cellSunCar{
        background-color: #3bb7ff !important;
    }
</style>