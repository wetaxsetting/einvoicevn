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
          <BaseGridView :headertype="1" ref='idGridWG' :height="limitHeight" :header="headerWG" :editable="true" :multiselect="false"></BaseGridView>
        </v-col>
      </v-row>

    </v-card>
  </v-container>
</template>






<script>

  import moment from "moment";
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
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

      selectedCompany: 'ALL',
      activeTab: null,

      headerWG: [],

      reverseList: [],
      wtplusList: [],


      dso:{
          type: 'grid',
        selpro: 'HR_SEL_8010020_WORKGROUP',
        updpro: 'HR_UPD_8010020_WORKGROUP',
        elname: [
          "_rowstatus", "PK", "WORKGROUP_ID", "WORKGROUP_NAME", "REMARK", "SEQ"
          , "TCO_COMPANY_PK"
        ],
        requirecol: ["WORKGROUP_ID", "WORKGROUP_NAME"]
      }

    }),

    created() {
      this.selectedCompany = this.user.TCO_COMPANY_PK;
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
          this.onSearch();
        }
      },


    },


    mounted() {
      this.createHeader();
    },

    methods:
    {
      async createHeader() {

        this.headerWG =
          [
            { title: ("workgroup_id"), field: "WORKGROUP_ID", editable: true, type: "", width: 200 },
            { title: ("workgroup_name"), field: "WORKGROUP_NAME", editable: true, type: "", width: 400 },
            { title: ("remark"), field: "REMARK", editable: true, type: "", width: 400 },
            { title: ("seq"), field: "SEQ", editable: true, type: "", width: 250 },

          ];

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
        this.dso.para =  [this.selectedCompany];
        this.$refs.idGridWG.onSearch(this.dso);
      },

      async onAdd() {
        let newData = { PK: new Date(), _rowstatus: 'i', USE_YN: "Y" };
        this.$refs.idGridWG.onAdd(newData);
      },

      async onSave() {
        this.$refs.idGridWG.onSetAll("TCO_COMPANY_PK", this.selectedCompany, false);

        this.dso.para =  [this.selectedCompany];

        this.$refs.idGridWG.onSave(this.dso);
      },

      async onDelete() {
        this.$refs.idGridWG.onSetAll("TCO_COMPANY_PK", this.selectedCompany, false);
        this.dso.para =  [this.selectedCompany];
        this.$refs.idGridWG.onDelete(this.dso);
      },

    }
  }
</script>
