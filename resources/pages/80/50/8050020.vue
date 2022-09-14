<template>
  <v-container fluid class="px-0 pt-0">
    <v-row dense>
      <v-col md="8">
        <BaseSelect outlined :label="$t('company')" :lstData="dataSearchList.companyList" v-model="modelSearch.COMPANY" item-value="PK" item-text="TEXT" :text_all="$t('all')"/>
      </v-col>
      <v-col md="4" class="pt-0" style="text-align:right">
        <BaseButton icon_type="search" @onclick="onClick('search')"/>
        <BaseButton icon_type="new" @onclick="onClick('new')"/>
        <BaseButton icon_type="delete" @onclick="onClick('delete')"/>
        <BaseButton icon_type="save" @onclick="onClick('save')"/>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col md="12">
        <BaseGridView
          ref='grdData'
          :setting="true"
          :height="700"
          :header="headerList.grdData"
          sel_procedure="lg_sel_8050020"
          upd_procedure="lg_upd_8050020"
          :filter_paras="[
            modelSearch.COMPANY,
          ]"
          :update_paras="[
            'PK', 'TCO_COMPANY_PK', 'FACTORY_ID', 'FACTORY_NAME', 'FACTORY_LNM', 'FACTORY_FNM', 'USE_YN', 'DESCRIPTION',
          ]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",
  components: {
  },
  data: () => ({
    headerList:{
      grdData: [],
    },
    dataGridList:{
      companyList: [],
    },
    dataSearchList:{
      companyList: [],
    },
    modelSearch: {
      COMPANY: null,
    },
  }),
  async created() {
    await this.initDataList();
    // await this.initHeaderList();
  },
  mounted() {
  },
  watch: {
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  methods: {
    async onClick(pos) {
      switch(pos){
        case "search":
          this.$refs.grdData.loadData();
          break;
        case "new":
          if(this.modelSearch.COMPANY == null){
            this.showNotification("warning", this.$t("warning"), this.$t("pls_select_one_company"));
          }
          else{
            this.$refs.grdData.addRow({
              TCO_COMPANY_PK: this.modelSearch.COMPANY,
              USE_YN: "Y",
            });
          }
          break;
        case "delete":
          this.$refs.grdData.deleteRows();
          break;
        case "save":
            this.$refs.grdData.saveData();
          break;
      }
    },

    async initDataList(){
      const companyList = await this._getCompany();
      
      this.dataSearchList.companyList = [...companyList];
      this.dataGridList.companyList = [...companyList];
      this.initHeaderList();
    },

    async initHeaderList(){
      this.headerList.grdData = 
      [
        {
          dataField: "TCO_COMPANY_PK",
          caption: this.$t("company"),
          allowEditing: false,
          lookup: {
            displayExpr: "TEXT",
            valueExpr: "PK",
            dataSource: this.dataGridList.companyList,
          },
        },
        {
          dataField: "FACTORY_ID",
          caption: this.$t("factory_id"),
          allowEditing: true,
        },
          {
            dataField: "FACTORY_NAME",
            // caption: this.$t("factory_name"),
            allowEditing: true,
          },
        {
          dataField: "FACTORY_LNM",
          caption: this.$t("factory_lnm"),
          allowEditing: true,
        },
        {
          dataField: "FACTORY_FNM",
          caption: this.$t("factory_fnm"),
          allowEditing: true,
        },
        {
          dataField: "USE_YN",
          caption: this.$t("use"),
          allowEditing: true,
          dataType: "checkbox",
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          allowEditing: true,
        },
      ];
    },
  },
};
</script>
