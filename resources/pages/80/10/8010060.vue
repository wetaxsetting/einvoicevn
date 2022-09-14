<template>
  <v-container fluid class="px-0 pt-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-btn-toggle dense
                      mandatory
                      :color="currentTheme"
                      v-model="selectedTab">
          <v-btn value="tab1">{{ $t('detail', _dictformid) }}</v-btn>
          <v-btn value="tab2">{{ $t('monthly_detail', _dictformid) }}</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row no-gutters v-show="selectedTab === 'tab1'">
      <v-col cols='12'>
        <v-card outlined tile v-resize="onResize">

          <v-row align="center" justify="center" no-gutters class="pt-2">
            <v-col cols="12" lg="3" class="pl-2">
              <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('org', 'common')" :items="orgList" v-model="selectedOrg"> </v-select>
            </v-col>
            <v-col cols="12" lg="3" class="pl-2">
              <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('work_group', 'common')" :items="wgList" v-model="selectedWg"> </v-select>
            </v-col>
            <v-col cols="12" lg="3" class="pl-2">
              <v-radio-group v-model="selectedType" class="py-0 my-0" hide-details>

                <v-row no-gutters>
                  <v-col cols="12" lg="6">
                    <v-radio :label="$t('schedule')" value="1" color="red" class="py-0 my-0"></v-radio>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-radio :label="$t('not_schedule')" value="2" color="red" class="py-0 my-0"></v-radio>
                  </v-col>
                </v-row>


              </v-radio-group>
            </v-col>
            <v-col cols="12" lg="3" class="text-right">
              <v-btn icon tile :color="currentTheme" @click="onSearch" v-bind:disabled.sync="isProcessing">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon tile :color="currentTheme" @click="onProcessConfirm('SAVE_DATA')" v-bind:disabled.sync="isProcessing">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>

            </v-col>
          </v-row>

          <v-row align="center" justify="center" no-gutters class="py-2">
            <v-col cols="12" lg="6" class="pl-2">
              <v-text-field clearable dense hide-details outlined :label="$t('name_id', _dictformid)" v-model="searchText" @keypress.enter="onSearch"></v-text-field>
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
              <v-chip class="ma-2" color="red" label text-color="white">
                <v-icon left>mdi-menu</v-icon>
                {{ rowNum }} {{ $t('records', 'common') }}
              </v-chip>
            </v-col>
          </v-row>



          <v-row align="center" no-gutters>
            <v-col cols="12">
              <v-card outlined tile>
                <hr-grid ref='idGrid'
                               :editable="true"
                               :height="limitHeight"
                               :header="header1" @rownum="setRowNum"></hr-grid>
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
              <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('org', 'common')" :items="orgList" v-model="selectedOrg2"> </v-select>
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
              <v-text-field clearable dense hide-details outlined :label="$t('name_id', _dictformid)" v-model="searchText2" @keypress.enter="onSearch2"></v-text-field>
            </v-col>
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
            <v-col cols="12" lg="1" class="pl-2">
              <v-btn v-bind:disabled.sync="isProcessing" small color="indigo darken-2" class='white--text mx-1' @click='onShowWS'>
                {{$t('work_shift_info')}}
              </v-btn>
            </v-col>

            <v-col cols="12" lg="2" class="text-right">
              <v-chip class="ma-2" color="red" label text-color="white">
                <v-icon left>mdi-menu</v-icon>
                {{ rowNum }} {{ $t('records', 'common') }}
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
  import ActionConfirm from '@/components/dialog/ActionConfirmDialog';
  import DateControlPicker from '@/components/control/DateControl';
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
      'date-control': DateControlPicker,
      'ws-dialog': WsDialog,

    },

    data: () => ({
      actionDialog: false,
      actionProcess: "",
      selectedTab: "tab1",
      header1: [],
      rowNum: 0,

      header2: [],
      rowNum2: 0,

      selectedCompany: '',

      workingDataRow: '',
      holTypeList: [],


      WsDialog: false,


      //tab1
      orgList: [],
      selectedOrg: '',
      wgList: [],
      selectedWg: 'ALL',
      shiftList: [],
      selectedWS: "",
      selectedType: "1",
      searchText: "",
      selectedFromDate: '',
      selectedToDate: "",
      records: 0,

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
    },


    computed:
    {
      user: function () {
        return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 300 },

    },

    created() {
      this.selectedCompany = this.user.TCO_COMPANY_PK;

      this.createHeader();
    },



    methods: {
      onShowWS() {
        this.$refs.WsDialog.dialogIsShow = true;
      },

      async prepareCommonData() {

        this.orgList = await this._getOrg(this.selectedCompany);
        this.wgList = await this._getWorkGroup(this.selectedCompany);
        this.wgList.unshift({ PK: "ALL", TEXT: this.$t("select_all") });
        this.shiftList = await this._getWorkShift(this.selectedCompany);

        this.holTypeList = await this._getCommonCode('COAB0140', this.user.TCO_COMPANY_PK);


        this.selectedOrg = this.orgList[0].PK;
        this.selectedOrg2 = this.orgList[0].PK;


      },

      async createHeader() {

        await this.prepareCommonData();

        this.header1 = [
          { title: this.$t("tco_org_pk"), field: "TCO_ORG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.orgList }, width: 200 },
          { title: this.$t("thr_wg_pk"), field: "THR_WG_PK", editable: true, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList }, width: 200 },
          { title: this.$t("emp_id"), field: "EMP_ID", editable: false, type: "" },
          { title: this.$t("full_name"), field: "FULL_NAME", editable: false, type: "", width: 200 },
          { title: this.$t("work_dt"), field: "WORK_DT", editable: false, type: "date" },
          { title: this.$t("hol_type"), field: "HOL_TYPE", editable: true, type: "list", datasource: { KEY: 'CODE', VALUE: 'NAME', data: this.holTypeList } },
          { title: this.$t("thr_ws_pk"), field: "THR_WS_PK", editable: true, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.shiftList }, width: 400 },
        ];

        this.header2 = [
          { title: this.$t("tco_org_pk"), field: "TCO_ORG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.orgList }, width: 200 },
          { title: this.$t("thr_wg_pk"), field: "THR_WG_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.wgList }, width: 200 },
          { title: this.$t("emp_id"), field: "EMP_ID", editable: false, type: "" },
          { title: this.$t("full_name"), field: "FULL_NAME", editable: false, type: "", width: 200 },


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
          selpro: 'hr_sel_8010060_get_period',
          para: [this.selectedOrg2]
        }

        const result = await this._dsoCall(dso, 'select', false)
        if (result) {
          //debugger;
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
          para: [this.selectedMonth2.replace(/[^0-9]/g, ''), this.selectedOrg2, this.selectedPeriod2]
        }

        const result = await this._dsoCall(dso, 'select', false)
        if (result) {
          this.selectedFromDate2 = result["FROM"];
          this.selectedToDate2 = result["TO"];
          this.changeHeader2();
        }
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

      async onSearch(p_search) {

        let pa = [this.selectedOrg, this.selectedWg, this.selectedFromDate, this.selectedToDate, this.searchText, this.selectedType];
        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010060_emp_shift',
          para: pa
        }

        this.$refs.idGrid.onSearch(dso);
      },

      async onSearch2(p_search) {

        let pa = [this.selectedOrg2, this.selectedWg2, this.selectedMonth2.replace(/[^0-9]/g, ''), this.selectedFromDate2, this.selectedToDate2, this.searchText2];
        const dso = {
          type: 'grid',
          selpro: 'HR_sel_8010060_mon_sch',
          para: pa
        }

        this.$refs.idGrid2.onSearch(dso);
      },




      async onSave() {
        let pa = [this.selectedOrg, this.selectedWg, this.selectedFromDate, this.selectedToDate, this.searchText, this.selectedType];

        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010060_emp_shift',
          updpro: 'hr_upd_8010060_emp_shift',
          para: pa,
          elname: [
            "_rowstatus", 'PK', 'THR_WG_PK', 'OLD_THR_WG_PK', 'WORK_DT', 'HOL_TYPE', 'THR_WS_PK', 'THR_EMP_PK'
          ],
          requirecol: [
            'THR_WG_PK', 'THR_WS_PK'
          ]
        }
        this.$refs.idGrid.onSave(dso);
      },

      async onSave2() {


        let pa = [this.selectedOrg2, this.selectedWg2, this.selectedMonth2.replace(/[^0-9]/g, ''), this.selectedFromDate2, this.selectedToDate2, this.searchText2];

        this.$refs.idGrid2.onSetAll("FROM", this.selectedFromDate2, false);
        this.$refs.idGrid2.onSetAll("TO", this.selectedToDate2, false);


        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010060_mon_sch',
          updpro: 'hr_upd_8010060_mon_sch',
          para: pa,
          elname: [
            "_rowstatus", 'THR_EMP_PK',
            "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10",
            "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20",
            "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30", "D31",
            "FROM", "TO"
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


    }


  }
</script>
