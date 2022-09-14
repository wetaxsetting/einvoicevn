<template>
  <v-container fluid class="px-0 pt-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-btn-toggle dense
                      mandatory
                      :color="currentTheme"
                      v-model="selectedTab">
          <v-btn value="tab1">{{ $t('schedule', _dictformid) }}</v-btn>
          <v-btn value="tab2">{{ $t('monthly_schedule', _dictformid) }}</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row no-gutters v-show="selectedTab === 'tab1'">
      <v-col cols='12'>
        <v-card outlined tile v-resize="onResize">
          <v-row no-gutters class="pt-2">
            <v-col cols="12" lg="3" class="pl-2">
              <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="selectedCompany"> </v-select>
            </v-col>
            <v-col cols="12" lg="3" class="pl-2">
              <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('work_group', 'common')" :items="wgList" v-model="selectedWg"> </v-select>
            </v-col>

            <v-col cols="12" lg="3" class="pl-2">

              <v-row no-gutters>
                <v-col cols="12" lg="6" class="pr-1">
                  <date-picker :outlined="true" :label="$t('from', 'common')" :inputValue="selectedFromDate" @returnValue="selectedFromDate = $event"></date-picker>
                </v-col>
                <v-col cols="12" lg="6" class="pl-1">
                  <date-picker :outlined="true" :label="$t('to', 'common')" :inputValue="selectedToDate" @returnValue="selectedToDate = $event"></date-picker>
                </v-col>
              </v-row>

            </v-col>

            <v-col cols="12" lg="3" class="text-right">
              <v-btn icon tile :color="currentTheme" @click="onSearch" v-bind:disabled.sync="isProcessing">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon tile color="red" @click="onProcessConfirm('DELETE_DATA')" v-bind:disabled.sync="isProcessing">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
              <v-btn icon tile :color="currentTheme" @click="onProcessConfirm('SAVE_DATA')" v-bind:disabled.sync="isProcessing">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row class="pt-8" no-gutters>
            <v-col cols="12" :lg="detailYN ? 8 : 12" class="pl-2">
              <v-card>
                <v-row no-gutters align="center" justify="center" class="pb-2">
                  <v-col cols="12" lg="4" class="pr-1">
                    <v-select dense hide-details outlined item-value="PK" item-text="TEXT" :label="$t('work_shift', 'common')" :items="shiftList" v-model="selectedWS"> </v-select>
                  </v-col>
                  <v-col cols="12" lg="8" class="pl-1 text-right">

                    <v-btn v-bind:disabled.sync="isProcessing" small color="indigo darken-2" class='white--text mx-1' @click="onProcessConfirm('MANUAL')">
                      {{$t('manual')}}
                    </v-btn>
                    <v-btn v-bind:disabled.sync="isProcessing" small color="indigo darken-2" class='white--text mx-1' @click="onProcessConfirm('AUTO')">
                      {{$t('auto')}}
                    </v-btn>
                    <v-btn v-bind:disabled.sync="isProcessing" small color="indigo darken-2" class='white--text mx-1' @click="onProcessConfirm('DELETE')">
                      {{$t('delete')}}
                    </v-btn>

                    <v-chip class="ma-2" color="red" label text-color="white">
                      <v-icon left>mdi-menu</v-icon>
                      {{ rowNum }} {{ $t('records', 'common') }}
                    </v-chip>

                    <v-btn small icon color='primary' class="ml-1 px-0">
                      <v-icon large v-if="detailYN" @click='onShowDetail'>mdi-code-greater-than</v-icon>
                      <v-icon large v-else @click='onShowDetail'>mdi-code-less-than</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row align="center" no-gutters>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <hr-grid ref='idGrid'
                                     :editable="true"
                                     :height="limitHeight"
                                     :header="header1" @rownum="setRowNum"
                                     @cellClick="onGetDetail"></hr-grid>
                    </v-card>
                  </v-col>
                </v-row>


              </v-card>
            </v-col>
            <v-col cols="12" :lg="detailYN ? 4 : 0" v-show="detailYN" class="pl-2">
              <v-card>
                <v-row no-gutters align="center" justify="center" class="pb-2">
                  <v-col cols="12" lg="12" class=" text-right ">
                    <v-chip class="ma-2" color="red" label text-color="white">
                      <v-icon left>mdi-menu</v-icon>
                      {{ rowNum12 }} {{ $t('records', 'common') }}
                    </v-chip>
                  </v-col>
                </v-row>

                <v-row align="center" no-gutters>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <hr-grid ref='idGrid12'
                                     :height="limitHeight"
                                     :header="header12" @rownum="setRowNum12"></hr-grid>
                    </v-card>
                  </v-col>
                </v-row>


              </v-card>
            </v-col>
          </v-row>


        </v-card>
      </v-col>
    </v-row>


    <v-row no-gutters v-show="selectedTab === 'tab2'">
      <v-col cols='12'>
        <v-card outlined tile v-resize="onResize">

          <v-row align="center" justify="center" no-gutters class="pt-2">
            <v-col cols="12" lg="3" class="pl-2">
              <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="selectedCompany2"> </v-select>
            </v-col>
            <v-col cols="12" lg="3" class="pl-2">
              <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('work_group', 'common')" :items="wgList" v-model="selectedWg2"> </v-select>
            </v-col>
            <v-col cols="12" lg="3" class="pl-2">

              <v-select dense hide-details outlined item-value="CODE" item-text="NAME" :label="$t('period', 'common')" :items="periodList2" v-model="selectedPeriod2"> </v-select>

            </v-col>
            <v-col cols="12" lg="3" class="text-right">
              <v-btn icon tile :color="currentTheme" @click="onSearch2" v-bind:disabled.sync="isProcessing">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon tile :color="currentTheme" @click="onProcessConfirm('SAVE_DATA')" v-bind:disabled.sync="isProcessing">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>

            </v-col>
          </v-row>



          <v-row align="center" justify="center" no-gutters class="py-2">

            <v-col cols="12" lg="3" class="pl-2">
              <date-picker :outlined="true" :type="'month'" @returnValue="selectedMonth2 = $event" ></date-picker>
            </v-col>


            <v-col cols="12" lg="3" class="pl-2">

              <v-row no-gutters>
                <v-col cols="12" lg="6" class="pr-1">
                  <date-picker :outlined="true" :label="$t('from', 'common')" :inputValue="selectedFromDate2" @returnValue="selectedFromDate2 = $event" :isDisabled="true"></date-picker>
                </v-col>
                <v-col cols="12" lg="6" class="pl-1">
                  <date-picker :outlined="true" :label="$t('to', 'common')" :inputValue="selectedToDate2" @returnValue="selectedToDate2 = $event" :isDisabled="true"></date-picker>
                </v-col>

              </v-row>

            </v-col>

            <v-col cols="12" lg="3" class="pl-2">
              <v-btn v-bind:disabled.sync="isProcessing" small color="indigo darken-2" class='white--text mx-1' @click='onShowWS'>
                {{$t('work_shift_info')}}
              </v-btn>
            </v-col>



            <v-col cols="12" lg="3" class="text-right">
              <v-chip class="ma-2" color="red" label text-color="white">
                <v-icon left>mdi-menu</v-icon>
                {{ rowNum2 }} {{ $t('records', 'common') }}
              </v-chip>
            </v-col>

          </v-row>




          <v-row align="center" no-gutters>
            <v-col cols="12">
              <v-card outlined tile>
                <hr-grid ref='idGrid2'
                               :editable="true"
                               :height="limitHeight"
                               :header="header2" @rownum="setRowNum2"></hr-grid>
              </v-card>
            </v-col>
          </v-row>



        </v-card>
      </v-col>
    </v-row>
    <action-confirm v-if="actionDialog" @onCloseDialog="actionDialog = false" @onConfirm="onProcess" :action='actionProcess'></action-confirm>
    <ws-dialog ref="WsDialog" @closewsDialog="WsDialog = false" :multiSelectMode="false"></ws-dialog>
  </v-container>
</template>






<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
  import DatePicker from '@/components/control/DatePicker';
  import DateControlPicker from '@/components/control/DateControl';
  import ActionConfirm from '@/components/dialog/ActionConfirmDialog';
  import WsDialog from '@/components/dialog/WorkshiftDialog';
  import moment from "moment"
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'

  export default {
    layout: 'default',
    middleware: 'user',

    components: {
      'hr-grid': HRBasicGrid,
      'date-picker': DatePicker,
      'action-confirm': ActionConfirm,
      'ws-dialog': WsDialog,
    },

    data: () => ({
      selectedCompany: null,
      selectedCompany2: null,
      companyList: [],

      wgList: [],
      selectedWg: 'ALL',

      shiftList: [],
      selectedWS: "",

      detailYN: true,

      actionDialog: false,
      actionProcess: "",
      selectedTab: "tab1",
      header1: [],
      rowNum: 0,

      header12: [],
      rowNum12: 0,

      header2: [],
      rowNum2: 0,

      holTypeList: [],

      WsDialog: false,

      //tab1
      selectedFromDate: '',
      selectedToDate: "",


      //tab2
      periodList2: [],
      selectedPeriod2: "",
      selectedOrg2: '',
      selectedWg2: 'ALL',
      searchText2: "",
      selectedFromDate2: '',
      selectedToDate2: "",
      selectedMonth2: new Date().toISOString().substr(0, 7),
    }),

    computed:
    {
      user: function () {
        return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 300 },

    },

    created() {
      this.selectedCompany = this.user.TCO_COMPANY_PK;
      this.selectedCompany2 = this.user.TCO_COMPANY_PK;

      this.createHeader();
    },


    watch: {
      selectedPeriod2(value) {
        if (value && this.selectedMonth2) {
          this.getMonthInfo();
        }
      },
      selectedMonth2(value) {
        if (value && this.selectedPeriod2) {
          this.getMonthInfo();
        }
      },
      // selectedCompany2(value){
      //   if(value){
      //     this.getPeriod();
      //   }
      // },
    },



    methods: {

      onShowWS() {
        this.$refs.WsDialog.dialogIsShow = true;
      },

      async prepareCommonData() {
        this.orgList = await this._getOrg(this.selectedCompany);
        this.companyList = await this._getCompany();
        this.wgList = await this._getWorkGroup(this.selectedCompany);
        this.wgList.unshift({ PK: "ALL", TEXT: this.$t("select_all") });
        this.shiftList = await this._getWorkShift(this.selectedCompany);
        this.holTypeList = await this._getCommonCode('COAB0140', this.user.TCO_COMPANY_PK);
        //this.holTypeList.unshift({ CODE: "", NAME: " " });
        this.selectedWS = this.shiftList[0].PK;



      },

      async createHeader() {

        await this.prepareCommonData();

        this.header1 = [
          { title: this.$t("thr_wg_pk"), field: "THR_WG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList }, width: 200 },
          { title: this.$t("work_dt"), field: "WORK_DT", editable: false, type: "date", width: 200 },
          { title: this.$t("thr_ws_pk"), field: "THR_WS_PK", editable: true, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.shiftList }, width: 400 },
          { title: this.$t("hol_type"), field: "HOL_TYPE", editable: true, type: "list", datasource: { KEY: 'CODE', VALUE: 'NAME', data: this.holTypeList } },
          { title: this.$t("day_type"), field: "DAY_TYPE", editable: true, type: "" },

        ];

        this.header12 = [
          { title: this.$t("tco_org_pk"), field: "TCO_ORG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.orgList }, width: 200 },
          { title: this.$t("emp_id"), field: "EMP_ID", editable: false, type: "" },
          { title: this.$t("full_name"), field: "FULL_NAME", editable: false, type: "", width: 200 },

        ];



        this.header2 = [
          { title: this.$t("thr_wg_pk"), field: "THR_WG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList }, width: 200 },
          { title: this.$t("d1"), field: "D1", editable: true, type: "number", width: 50 },
          { title: this.$t("d2"), field: "D2", editable: true, type: "number", width: 50 },
          { title: this.$t("d3"), field: "D3", editable: true, type: "number", width: 50 },
          { title: this.$t("d4"), field: "D4", editable: true, type: "number", width: 50 },
          { title: this.$t("d5"), field: "D5", editable: true, type: "number", width: 50 },
          { title: this.$t("d6"), field: "D6", editable: true, type: "number", width: 50 },
          { title: this.$t("d7"), field: "D7", editable: true, type: "number", width: 50 },
          { title: this.$t("d8"), field: "D8", editable: true, type: "number", width: 50 },
          { title: this.$t("d9"), field: "D9", editable: true, type: "number", width: 50 },
          { title: this.$t("d10"), field: "D10", editable: true, type: "number", width: 50 },
          { title: this.$t("d11"), field: "D11", editable: true, type: "number", width: 50 },
          { title: this.$t("d12"), field: "D12", editable: true, type: "number", width: 50 },
          { title: this.$t("d13"), field: "D13", editable: true, type: "number", width: 50 },
          { title: this.$t("d14"), field: "D14", editable: true, type: "number", width: 50 },
          { title: this.$t("d15"), field: "D15", editable: true, type: "number", width: 50 },
          { title: this.$t("d16"), field: "D16", editable: true, type: "number", width: 50 },
          { title: this.$t("d17"), field: "D17", editable: true, type: "number", width: 50 },
          { title: this.$t("d18"), field: "D18", editable: true, type: "number", width: 50 },
          { title: this.$t("d19"), field: "D19", editable: true, type: "number", width: 50 },
          { title: this.$t("d20"), field: "D20", editable: true, type: "number", width: 50 },
          { title: this.$t("d21"), field: "D21", editable: true, type: "number", width: 50 },
          { title: this.$t("d22"), field: "D22", editable: true, type: "number", width: 50 },
          { title: this.$t("d23"), field: "D23", editable: true, type: "number", width: 50 },
          { title: this.$t("d24"), field: "D24", editable: true, type: "number", width: 50 },
          { title: this.$t("d25"), field: "D25", editable: true, type: "number", width: 50 },
          { title: this.$t("d26"), field: "D26", editable: true, type: "number", width: 50 },
          { title: this.$t("d27"), field: "D27", editable: true, type: "number", width: 50 },
          { title: this.$t("d28"), field: "D28", editable: true, type: "number", width: 50 },
          { title: this.$t("d29"), field: "D29", editable: true, type: "number", width: 50 },
          { title: this.$t("d30"), field: "D30", editable: true, type: "number", width: 50 },
          { title: this.$t("d31"), field: "D31", editable: true, type: "number", width: 50 },

        ];


        await this.getPeriod();
      },


      async getPeriod() {
        this.periodList2 = [];
        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010050_get_period',
          para: [this.selectedCompany2]
        }

        const result = await this._dsoCall(dso, 'select', false)
        if (result) {
          this.periodList2 = result;
          this.selectedPeriod2 = this.periodList2[0].CODE;
        } else {
          this.periodList2 = [];
        }
      },

      async getMonthInfo() {
        const dso = {
          type: 'control',
          selpro: 'hr_sel_1030040_get_info',
          para: [this.selectedMonth2.replace(/[^0-9]/g, ''), "ALL", this.selectedPeriod2]
        }

        const result = await this._dsoCall(dso, 'select', false)
        if (result) {
          //debugger;
          this.selectedFromDate2 = result["FROM"];
          this.selectedToDate2 = result["TO"];

          this.changeHeader2();
        }
      },

      changeHeader2() {
        let startDate = moment(String(this.selectedFromDate2), "YYYYMMDD");
        let endDate = (moment(String(this.selectedToDate2), "YYYYMMDD")).add(1, 'days');
        let i = 1;

        let hideColumns = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30", "D31"];
        let showColumns = [];

        for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
          const idxHeader = this.header2.findIndex(x => x.field === ("D" + i));

          if (idxHeader >= 0) {
            this.$refs.idGrid2.setColumnOption( ("D" + i), "caption", d.date() + "") ;
            showColumns.push("D" + d.date());
          }

          i++;
        }


        hideColumns = hideColumns.filter(x => !showColumns.includes(x));

        this.$refs.idGrid2.setColumnsHidden(hideColumns, true);
        this.$refs.idGrid2.setColumnsHidden(showColumns, false);
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
            this.onProcess();
          }
        });

        await promise;
      },

      onProcess() {
        if (this.actionProcess === "SAVE_DATA") {

          if (this.selectedTab === "tab1") {
            this.onSave();
          }

          if (this.selectedTab === "tab2") {
            this.onSave2();
          }
        } else if (this.actionProcess === "DELETE_DATA") {

          if (this.selectedTab === "tab1") {

            this.onDelete();
          }
        }
        else {
          this.processSchedule();
        }
      },

      onShowDetail() {
        this.detailYN = !this.detailYN;
      },


      //tab1============================================================
      async onSearch() {

        let pa = [this.selectedCompany, this.selectedWg, this.selectedFromDate, this.selectedToDate];
        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010050_sch_master',
          para: pa
        }

        this.$refs.idGrid.onSearch(dso);
      },


      async onSave() {
        let pa = [this.selectedCompany, this.selectedWg, this.selectedFromDate, this.selectedToDate];

        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010050_sch_master',
          updpro: 'hr_upd_8010050_sch_master',
          para: pa,
          elname: [
            "_rowstatus", 'PK', 'WORK_DT', 'THR_WS_PK', 'THR_WG_PK', 'HOL_TYPE'
          ],
          requirecol: [
            "THR_WS_PK"
          ]
        }

        this.$refs.idGrid.onSave(dso);
      },

      async onDelete() {
        let pa = [this.selectedCompany, this.selectedWg, this.selectedFromDate, this.selectedToDate];

        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010050_sch_master',
          updpro: 'hr_upd_8010050_sch_master',
          para: pa,
          elname: [
            "_rowstatus", 'PK', 'WORK_DT', 'THR_WS_PK', 'THR_WG_PK', 'HOL_TYPE'
          ],
        }

        this.$refs.idGrid.onDelete(dso);
      },



      async onGetDetail(data) {
        if(data) {
          let pa = [data.PK];
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

        this.$refs.idGrid.block();

        const result = await this._dsoCall(dso, 'process', false)
        if (result) {
          this.showNotification("success", this.$t("process_complete"), '');
          this.onSearch();
        }
        this.$refs.idGrid.unBlock();
      },




      //tab 2==============================================================
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
      






      setRowNum(value) {
        this.rowNum = value;
      },

      setRowNum2(value) {
        this.rowNum2 = value;
      },
      setRowNum12(value) {
        this.rowNum12 = value;
      },

    }


  }
</script>
