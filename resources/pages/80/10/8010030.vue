<template>
  <v-container fluid class="px-1 pt-1">
    <v-card outlined tile v-resize="onResize">
      <v-row align="center">

        <v-col cols='12' lg='6' class="pl-4">
          <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" > </BaseSelect>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')"  @onclick="onAdd" />
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"  @onclick="onProcessConfirm('SAVE')" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"  @onclick="onProcessConfirm('DELETE')" />
          </v-row>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="12">
          <BaseGridView :headertype="1" 
                        ref='idGridSHIFT' 
                        :height="limitHeight" 
                        :header="headerSHIFT" 
                        :editable="true" 
                        :id="'idGridSHIFT'" :customTables="['THR_WORK_SHIFT']" :menu_cd="'8010030'" allow-save-custom
                        :multiselect="false">

          </BaseGridView>
        </v-col>
      </v-row>

    </v-card>
  </v-container>
</template>






<script>

  import moment from "moment";
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'


  export default {
    layout: 'default',
    middleware: 'user',

    components: {
    },

    data: () => ({
      actionProcess: '',
      companyList: [],

      selectedCompany:null,
      activeTab: null,

      headerSHIFT: [],

      reverseList: [],
      wtplusList: [],

      dso:{
        type: 'grid',
        selpro: 'HR_SEL_8010030_GRID_SHIFT_PLAN',
        updpro: 'HR_UPD_8010030_GRID_SHIFT_PLAN',
        elname: [
          "_rowstatus", "PK", "USE_YN", "SHIFT", "DAYS", "START_TIME", "END_TIME", "WT", "OT", "NT", "WT_PLUS", "WT_PLUS_RATE", "MAX_OT", "REVERSE_OT_YN", "MAX_REVERSE_OT", "REVERSE_OT_RATE", "START_MEAL1", "END_MEAL1", "HOURS_MEAL1", "START_MEAL2", "END_MEAL2", "HOURS_MEAL2", "START_OT", "START_NT", "DESCRIPTION", "NOTE"
          , "TCO_COMPANY_PK"
        ],
        requirecol: ["SHIFT", "START_TIME", "END_TIME", "WT", "OT", "NT", "START_OT", "START_NT"]
      }
    }),

    created() {
      //this.selectedCompany = this.user.TCO_COMPANY_PK;
      this.getCompanyList();
    },



    computed:
    {
      user: function () {
        return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 220 }
    },

    watch:
    {
      selectedCompany(value) {
        if (value) {
          this.createHeader();
        }
      },


    },


    mounted() {
      //this.createHeader();
    },

    methods:
    {
      async prepareCommonData() {
        //this.wtplusList = await this._getCommonCode('HR0260', this.user.TCO_COMPANY_PK);
        //this.reverseList = await this._getCommonCode('HR0261', this.user.TCO_COMPANY_PK);

      },

      async createHeader() {
        await this.prepareCommonData();

        this.headerSHIFT =
          [
            { title: ("use_yn"), field: "USE_YN", editable: false, type: "boolean", width: 50 },
            { title: ("shift"), field: "SHIFT", editable: true, type: "", width: 50 },
            { title: ("days"), field: "DAYS", editable: true, type: "", width: 50 },
            { title: ("start"), field: "START_TIME", editable:true , type: "time" },
            { title: ("end"), field: "END_TIME", editable: true, type: "time" },
            { title: ("wt"), field: "WT", editable: true, type: "", width: 50 },
            { title: ("ot"), field: "OT", editable: true, type: "", width: 50 },
            { title: ("nt"), field: "NT", editable: true, type: "", width: 50 },
            { title: ("wt_plus"), field: "WT_PLUS", editable: true, type: "", width: 100 },
            { title: ("wt_plus_rate"), field: "WT_PLUS_RATE", editable: true, type: "boolean", width: 100 },
            { title: ("max_ot"), field: "MAX_OT", editable: true, type: "", width: 100 },
            { title: ("reverse_ot_yn"), field: "REVERSE_OT_YN", editable: true, type: "boolean", width: 120 },
            { title: ("max_reverse_ot"), field: "MAX_REVERSE_OT", editable: true, type: "", width: 120 },
            { title: ("reverse_ot_rate"), field: "REVERSE_OT_RATE", editable: true, type: "", width: 120 },

            { title: ("start_meal1"), field: "START_MEAL1", editable: true, type: "time", width: 90 },
            { title: ("end_meal1"), field: "END_MEAL1", editable: true, type: "time", width: 90 },
            { title: ("hours_meal1"), field: "HOURS_MEAL1", editable: true, type: "", width: 100 },
            { title: ("start_meal2"), field: "START_MEAL2", editable: true, type: "time", width: 90 },
            { title: ("end_meal2"), field: "END_MEAL2", editable: true, type: "time", width: 90 },
            { title: ("hours_meal2"), field: "HOURS_MEAL2", editable: true, type: "", width: 100 },

            { title: ("start_ot"), field: "START_OT", editable: true, type: "time", width: 90 },
            { title: ("start_nt"), field: "START_NT", editable: true, type: "time", width: 90 },
            { title: ("descritption"), field: "DESCRIPTION", editable: true, type: "", width: 400 },
            { title: ("note"), field: "NOTE", editable: true, type: "", width: 200 },
          ];
          //console.log(this.headerSHIFT);

          setTimeout(() => {
              this.onSearch();
          }, 1000);
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

        if (this.actionProcess === 'ADD') {
          this.onAdd();
        }

        if (this.actionProcess === 'SAVE') {
          this.onSave();
        }

        if (this.actionProcess === 'DELETE') {

          this.onDelete();
        }

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

      async onSearch() {
        this.dso.para = [this.selectedCompany];
        this.$refs.idGridSHIFT.onSearch(this.dso);
      },

      async onAdd() {
        let newData = { PK: new Date(), _rowstatus: 'i', USE_YN: "Y" };
        this.$refs.idGridSHIFT.onAdd(newData);
      },

      async onSave() {
        this.$refs.idGridSHIFT.onSetAll("TCO_COMPANY_PK", this.selectedCompany, false);
        this.dso.para = [this.selectedCompany];
        this.$refs.idGridSHIFT.onSave(this.dso);
      },

      async onDelete() {
        this.$refs.idGridSHIFT.onSetAll("TCO_COMPANY_PK", this.selectedCompany, false);
        this.dso.para = [this.selectedCompany];
        this.$refs.idGridSHIFT.onDelete(this.dso);
      },

    }
  }
</script>
