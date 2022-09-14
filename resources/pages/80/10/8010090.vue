<template>
  <v-container fluid class="px-0 pt-0">
    <v-card outlined tile v-resize="onResize">
      <v-row align="center" justify="center">

        <v-col cols='12' lg='4' class="pl-4">
          <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" > </BaseSelect>
        </v-col>

        <v-col lg="2" cols="12" class="text-right pr-4">
          <v-row no-gutters>
            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onAdd" v-bind:disabled.sync="isProcessing" />
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onProcessConfirm('SAVE')" v-bind:disabled.sync="isProcessing" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onProcessConfirm('DELETE')" v-bind:disabled.sync="isProcessing" />
          </v-row>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="12">
          <BaseGridView :headertype="1" ref='idGrid' :height="limitHeight" :header="header1" :editable="true" :multiselect="false"></BaseGridView>
        </v-col>
      </v-row>

    </v-card>

  </v-container>
</template>






<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'

  export default {
    layout: 'default',
    middleware: 'user',

    components: {
      'hr-grid': HRBasicGrid,
    },

    data: () => ({
        header1:[],
        companyList: [],
        selectedCompany: null,

        allowList:[],
        dso:{}
    }),

    computed:
    {
      user: function () {
        return this.$store.getters["auth/user"];
      },
      limitHeight() { return 650 },

    },

    async created() {
      this.companyList = await this._getCompany();
    },

    mounted() {
      
    },


    watch: {
      selectedCompany(value) {
        if (value ) {
          this.createHeader();
        }
      },
    },



    methods: {

     

      async prepareCommonData() {
        let parentCodes = [  "HR0035"  ] ;

        let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany , true );

        this.allowList = listCommonCode[0];

        this.dso = {
          type: 'grid',
          selpro: 'hr_sel_8010090_master',
          updpro: 'hr_upd_8010090_master',
          elname: [
            "_rowstatus", "PK", "ALLOWANCE_KIND", "NAME", "AMOUNT", "TCO_COMPANY_PK"
          ],
        };

      },

      async createHeader() {

        await this.prepareCommonData();

        this.header1 = [
          { title: ("allowance_kind"), field: "ALLOWANCE_KIND", editable: true, type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.allowList}, width: 400 },
          { title: ("allow_name"), field: "NAME", editable: true, type: "", width: 400 },
          { title: ("amount"), field: "AMOUNT", editable: true, type: "number" , width: 400},
        //   { title: ("amount_type"), field: "AMOUNT_TYPE", editable: true, type: "" , width: 400},
        ];

        await this.onSearch();
        
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


      async onSearch() {
        this.dso.para= [this.selectedCompany],
        this.$refs.idGrid.onSearch(this.dso);
      },

      async onAdd() {
        let newData = { PK: new Date(), _rowstatus: 'i', USE_YN: "Y" };
        this.$refs.idGrid.onAdd(newData);
      },

      async onSave() {
        this.dso.para= [this.selectedCompany],
        this.$refs.idGrid.onSetAll("TCO_COMPANY_PK", this.selectedCompany, false);
        this.$refs.idGrid.onSave(this.dso);
      },

      async onDelete() { 
        this.dso.para= [this.selectedCompany],
        this.$refs.idGrid.onDelete(this.dso);
      },


    },

    

  }
</script>
