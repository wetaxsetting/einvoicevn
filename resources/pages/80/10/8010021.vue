<template>
  <v-container fluid class="px-1 pt-1" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="12" lg="4" class="px-1 py-1">
        <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" > </BaseSelect>
      </v-col>
      <v-col cols="12" lg="4" class="px-1 py-1">
        <BaseSelect outlined :label="$t('biz_place')" v-model="selectedBizPlace" multiple :lstData="bizPlaceListDisplay" item-text="TEXT" item-value="PK"  />
      </v-col>
      <v-col cols="12" lg="4" class="px-1 py-1">
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')"  @onclick="onAdd" />
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"  @onclick="onProcessConfirm('SAVE', onSave)" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"  @onclick="onProcessConfirm('DELETE', onDelete)" />
          </v-row>
        </v-col>
    </v-row>
    <BaseGridView :headertype="1" ref='idGridWG' :height="limitHeight" :header="headerWG" :editable="true" :multiselect="false"
       @cellClick="cellClick"
    ></BaseGridView>

    <BizPlaceDialog ref="bizPlaceDialog" :companyPK="selectedCompanyDetail" @returnBizPlaceEiInfo="callBackBizPlace"></BizPlaceDialog>
  </v-container>
</template>

<script>
import moment from "moment";
import BizPlaceDialog from "@/components/dialog/BizPlaceDialog"

  export default {
    layout: 'default',
    middleware: 'user',
    components: {BizPlaceDialog},

    data: () => ({
      companyList: [],
      selectedCompany: null,
      headerWG: [],
      bizPlaceList:[],
      bizPlaceListDisplay:[],
      selectedBizPlace:null,
      selectedRowDetail:null,
      selectedCompanyDetail:null,

      dso:{
          type: 'grid',
        selpro: 'HR_SEL_8010021_WORKGROUP_BIZ',
        updpro: 'HR_UPD_8010021_WORKGROUP_BIZ',
        elname: [
          "_rowstatus", "PK", "WORKGROUP_ID", "WORKGROUP_NAME", "REMARK", "SEQ"
          , "TCO_COMPANY_PK", "TCO_BUSPLACE_PK"
        ],
        requirecol: ["WORKGROUP_ID", "WORKGROUP_NAME"]
      }

    }),

    created() {
      this.prepareCommonData();
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
          this.filterBizByCompany();
        }
      },
      selectedBizPlace:{
        immediate:true,
        handler: function (value) {
          if(value && value.length >0) {
            this.onSearch();
          }
        }
      }
    },

    mounted() {
      this.createHeader();
    },

    methods:
    {
      async prepareCommonData(){
        this.bizPlaceList = await this._getBizPlaceBuUser(this.user.PK);
        this.selectedBizPlace = this.bizPlaceList.map( q => { return q["PK"]});
        this.companyList =  await this._getCompanyByUser(this.user.PK);
      },

      async createHeader() {
        this.headerWG =  [
          { title: ("workgroup_id"), field: "WORKGROUP_ID", editable: true, type: "", width: 200 },
          { title: ("workgroup_name"), field: "WORKGROUP_NAME", editable: true, type: "", width: 400 },
          { title: ("remark"), field: "REMARK", editable: true, type: "", width: 400 },
          { title: ("biz_place"),  field: "TCO_BUSPLACE_NM",  type: "",  editable: false, width: 200},
          { title: ("seq"), field: "SEQ", editable: true, type: "" },
          { title: ("biz_place_pk"),  field: "TCO_BUSPLACE_PK",  type: "",  editable: false, visible: false}
        ];
      },

      filterBizByCompany(){
        this.bizPlaceListDisplay = this.bizPlaceList.filter( q => q["TCO_COMPANY_PK"] == this.selectedCompany);
        this.selectedBizPlace = this.bizPlaceListDisplay.map( q => { return q["PK"]});
      },

      filterOrgByBiz( selectedBiz ){
        if(selectedBiz && Array.isArray(selectedBiz)) {
          this.orgListDisplay = this.orgList.filter( q => {
            if(q["ORG_TYPE"] == '01' ) return true; //head center ko co biz
            else {
                return selectedBiz.some( a => a == q["TCO_BUSPLACE_PK"]);
            }
          });
        }
      },

      cellClick(data, col){
        if(data) {
          let col = data.column.datafield;
          if(col == "TCO_BUSPLACE_NM") {
            this.selectedCompanyDetail = data.data.TCO_COMPANY_PK;
            if(!!!this.selectedCompanyDetail || this.selectedCompanyDetail <= 0) {
              this.showNotification("warning", this.$t("warning"), this.$t("please_select_company_first"))
            } else {
              this.selectedRowDetail = data.rowindex;
              this.$refs.bizPlaceDialog.dialogIsShow = true;
            }
          }
        }
      },

      callBackBizPlace(data){
        if(data) {
          this.$refs.idGridWG.onSet("TCO_BUSPLACE_NM", data.LOC_NM,true, this.selectedRowDetail);
          this.$refs.idGridWG.onSet("TCO_BUSPLACE_PK", data.PK,true, this.selectedRowDetail);
        }
      },

      async onSearch() {
        this.dso.para =  [this.selectedCompany, this.selectedBizPlace ? this.selectedBizPlace.join(',') :''];
        this.$refs.idGridWG.onSearch(this.dso);
      },

      async onAdd() {
        let newData = { PK: new Date(), _rowstatus: 'i', USE_YN: "Y" };
        this.$refs.idGridWG.onAdd(newData);
      },

      async onSave() {
        this.$refs.idGridWG.onSetAll("TCO_COMPANY_PK", this.selectedCompany, false);
        this.dso.para =  [this.selectedCompany, this.selectedBizPlace ? this.selectedBizPlace.join(',') :''];

        this.$refs.idGridWG.onSave(this.dso);
      },

      async onDelete() {
        this.$refs.idGridWG.onSetAll("TCO_COMPANY_PK", this.selectedCompany, false);
        this.dso.para =  [this.selectedCompany, this.selectedBizPlace ? this.selectedBizPlace.join(',') :''];
        this.$refs.idGridWG.onDelete(this.dso);
      },

    }
  }
</script>
