<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
        <v-col md="12" class="d-flex justify-end">
          <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('SEARCH')" />
          <BaseButton icon_type="add" :btn_text="$t('add')" @onclick="onClickButton('NEW')" />
          <BaseButton icon_type="save" :btn_text="$t('save')" @onclick="onClickButton('SAVE')" />
          <!-- <BaseButton icon_type="excel" :btn_text="$t('print')" @onclick="onReport('PRINT')"/> -->
        </v-col>
    </v-row>

    <v-row dense>
      <v-col md="2" class="pl-2 pr-3">
        <BaseSelect outlined :label="$t('company')" v-model="company" :lstData="companyList" item-text="TEXT" item-value="PK" />
      </v-col>
      <v-col md="2" class="pl-3 pr-3">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" start />
      </v-col>
      <v-col md="2" class="pl-3 pr-3">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" today />
      </v-col>
      <v-col md="2" class="pl-3 pr-3">
        <BaseInput outlined :label="$t('partner')" v-model="partner" />
      </v-col>
      <v-col md="2" class="pl-3 pr-3">
        <BaseInput outlined :label="$t('mail')" v-model="mail" />
      </v-col>
      <v-col md="2" class="pl-3 pr-2">
        <BaseInput outlined :label="$t('mail_cc')" v-model="mail_cc" />
      </v-col>
    </v-row>
    <v-row>

    </v-row>
    <v-row no-gutters align="center" justify="start" class="mb-2">
      <v-col cols="12">
        <BaseGridView ref="gridview" select_mode="Single" :max_height="limitHeight" column-resizing-mode="widget"
           sel_procedure="EI_SEL_6095070_S_02_NODE" 
           upd_procedure="EI_UPD_6095070_U_03_NODE"
           :header="this.headerQQ" :filter_paras="[
            this.company,
            this.from_date,
            this.to_date,
            this.partner,
            this.mail,
            this.mail_cc,
          ]" :update_paras="[
            'PK',
            'RN',
            'TCO_COMPANY_PK',
            'PARTNER_PK',
            'PARTNER_ID',
            'PARTNER_NAME',
            'PARTNER_LNAME',
            'PARTNER_FNAME',
            'EMAIL_ADDRESS',
            'TAX_CODE',
            'ADDR1',
            'PHONE_NO',
            'FAX_NO',
            'VALID_FROM',
            'VALID_TO',
            'USE_YN',
            'DESCRIPTION',
            'TEI_CUSTOMER_PK',
            'EMAIL_ADDRESS_CC',
            'CRT_BY',
            ]" />
      </v-col>
      <dynamic-dialog ref="refDynamicDialog" :companyPK="company" :header="dynamicHeader" :listData="listData"
        :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure" :moreParas="moreParas"
        :codeLabel="codeLabel" :autoSearch="autoSearch" :selectionmode="selectionmode"  :autocheckbox="true" 
        @returnData="onSelectItemInfoTO"></dynamic-dialog>
    </v-row>
  </v-container>
</template>

<script>
import GetDataODialog from "@/components/dialog/GetDataODialog";
import GetDataTODialog from "@/components/dialog/GetDataTODialog";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import FreeItemEIDialog from "@/components/dialog/FreeItemEiDialog";
import WarehouseDialog from "@/components/dialog/WarehouseDialog";
import DataGridView from "@/components/control/DataGridView";
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  components: {
    "get-data-o-dialog": GetDataODialog,
    "get-data-so-dialog": GetDataTODialog,
    "warehouse-dialog": WarehouseDialog,
    "free-item-ei-dialog": FreeItemEIDialog,
    "delete-dialog": DeleteDialog,
    DataGridView,
    accountDialog: () => import("@/components/dialog/AccountEiDialog"),
    DynamicDialog: () => import("@/components/dialog/DynamicDialog_B"),
  },

  data: () => ({
    TCO_BUSPLACE_PK: "",
    companyList: [],
    company: "",
    mstData: null,
    companyFornno: "",
    confirmDialog: false,
    dateList: [],
    from_date: "",
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    to_date: "",
    date: null,
    date_year: "",
    searchInput: null,
    // limitHeight: [],
    headerQQ: [],
    partner: "",
    mail: "",
    mail_cc: "",
    gridview: [],
    selectedAccount: "",
    dynamicHeader: [],
    cellDblClickgrdDetail: {},
    selectedTab: undefined,
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    listLabel: "",
    listData: [],
    selectionmode: "",
    moreParas: null,
    autoSearch: false,
    // tranCode: "",
    // cqtCode: "",
  }),

  async created() {
    await this.getListCodes("company");
    await this.initMasterData();
  },
  mounted() {
    this.onSetHeader();
    this.onResize();
    
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) { return 755 }
      //return 450
    },

  },
  watch: {
    selectedCompany(val) {
      if (val) {
        this.search();
      }
    },
    date_year(val) {
      if (val) {
        this.from_date = val + "01";
        this.to_date = val + this._maxDateOfMonth(val);
      }
    },
    mail(val){
      if(val){
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          // console.log(pattern.test(val));
      }
    }
  },
  methods: {
    async getListCodes(pos) {
      const result = await this._getCompanyByUser(this.user.PK);

      if (result) {
        this.companyList = result;
        this.company = this.companyList[0].PK;
      }
    },
    async initMasterData() {
      this.mstData = {
        _rowstatus: "i",
        PK: "",
        TCO_COMPANY_PK: "",
        PARTNER_ID: "",
        PARTNER_NAME: "",
        PARTNER_LNAME: "",
        PARTNER_FNAME: "",
        EMAIL_ADDRESS: "",
        TAX_CODE: "",
        ADDR1: "",
        PHONE_NO: "",
        FAX_NO: "",
        VALID_FROM: "",
        VALID_TO: "",
        USE_YN: "Y",
        DESCRIPTION: "",
        TEI_CUSTOMER_PK: "",
        EMAIL_ADDRESS_CC: "",
      };
    },
    onClickButton(obj) {
      switch (obj) {
        case "SEARCH":
          this.$refs.gridview.loadData();
          break;
        case "NEW":
          this.openDialog();
          break;
        case "SAVE":
          let data = this.$refs.gridview.getDataSource();
          for (let i = 0; i < data.length; i++) {
            if(!data[i].EMAIL_ADDRESS){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_email_at_" + (i+1)));
              return;
            }
          }
          this.$refs.gridview.saveData();
          break;
        case "PRINT":
          onReport();
          break;
        // case "OPTION":
        //   if (this.objClick == "btnSave") {
        //     this.$refs.gridview.saveData();
        //   } else if (this.objClick == "btnDelete") {
        //     this.$refs.gridview.deleteRows2();
        //   }
        //   break;
        // case "btnAgreeCF":
        //   this.confirmDialog = true;
        //   break;
      }
    },
    async onReport() { },

    BuildDynamicHeader() {
      let header = [];
      // if (p_table_nm == "TLG_IT_ITEM") {
      header = [
        {
          dataField: "PK",
          caption: this.$t("pk"),
        },
        {
          dataField: "PARTNER_ID",
          caption: this.$t("partner_id"),
        },
        {
          dataField: "PARTNER_NAME",
          caption: this.nameLabel,
        },
        {
          dataField: "PARTNER_LNAME",
          caption: this.codeLabel,
        },
        {
          dataField: "PARTNER_FNAME",
          caption: this.$t("partner_fname"),
        },
        {
          dataField: "ADDR1",
          caption: this.$t("address"),
        },
        {
          dataField: "PHONE_NO",
          caption: this.$t("phone_no"),
        },
        {
          dataField: "FAX_NO",
          caption: this.$t("fax_no"),
        },
      ];
      return header;
      // }
    },
    async openDialog() {
      this.dynamicHeader = this.BuildDynamicHeader();
      this.dialogTitle = this.$t("popup_get_partner");
      this.nameLabel = this.$t("partner_name");
      this.codeLabel = this.$t("partner_lname");

      this.procedure = "EI_SEL_6095070_S_03_NODE";
      this.moreParas = null;
      this.autoSearch = true;
      this.selectionmode = "checkbox";
      this.$refs.refDynamicDialog.dialogIsShow = true;



      this.$refs.refDynamicDialog.instance.selectAll()



    },
    openAccountDialog() {
      this.$refs.accountDialog.dialogIsShow = true;
    },
    onSetHeader() {
      let headerobj = [
        {
          dataField: "RN",
          caption: this.$t("no"),
          allowEditing: false,
          alignment: "right",
        },
        {
          dataField: "PARTNER_ID",
          caption: this.$t("partner_id"),
          allowEditing: false,
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "PARTNER_NAME",
          caption: this.$t("partner_name"),
          allowEditing: false,
          dataType: "string",
          alignment: "left",
        },
        {
          dataField: "PARTNER_FNAME",
          caption: this.$t("partner_fname"),
          allowEditing: false,
          dataType: "string",
          alignment: "left",
          hidden:  true,
        },
        {
          dataField: "EMAIL_ADDRESS",
          caption: this.$t("email"),
          allowEditing: true,
        },
        {
          dataField: "EMAIL_ADDRESS_CC",
          caption: this.$t("email_cc"),
          allowEditing: true,
        },
        {
          dataField: "TAX_CODE",
          caption: this.$t("tax_code"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "VALID_FROM",
          caption: this.$t("valid_from"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "VALID_TO",
          caption: this.$t("valid_to"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "USE_YN",
          caption: this.$t("user_yn"),
          allowEditing: true,
          dataType: "checkbox",
          alignment: "center",
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "CRT_DT",
          caption: this.$t("crt_date"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "MOD_DT",
          caption: this.$t("mode_date"),
          allowEditing: false,
          dataType: "string",
        },
        {
          dataField: "TEI_CUSTOMER_PK",
          caption: this.$t("tei_customer_pk"),
          allowEditing: false,
          dataType: "string",
          alignment: "right",
          hidden:  true,
        },
      ];
      this.headerQQ = headerobj;
    },
    onSelectItemInfoTO(item) {
      for (let i = 0; i < item.length; i++) {
        this.$refs.gridview.addRowStruct({
           _rowstatus:  "i",
          PK: item[i].PK,
          TCO_COMPANY_PK: item[i].TCO_COMPANY_PK,
          PARTNER_PK: item[i].PK,
          PARTNER_ID: item[i].PARTNER_ID,
          PARTNER_NAME: item[i].PARTNER_NAME,
          PARTNER_LNAME: item[i].PARTNER_LNAME,
          PARTNER_FNAME: item[i].PARTNER_FNAME,
          EMAIL_ADDRESS: !item[i].EMAIL_ADDRESS ? this.mail : item[i].EMAIL_ADDRESS  ,
          EMAIL_ADDRESS_CC: !item[i].EMAIL_ADDRESS_CC  ? this.mail_cc : item[i].EMAIL_ADDRESS_CC ,
          TAX_CODE: item[i].TAX_CODE,
          VALID_FROM: item[i].VALID_FROM,
          VALID_TO: item[i].VALID_TO,
          USE_YN: "Y",
          DESCRIPTION: item[i].DESCRIPTION,
          CRT_DT: item[i].CRT_DT,
          MOD_DT: item[i].MOD_DT,
          TEI_CUSTOMER_PK: item[i].TEI_CUSTOMER_PK,

        });
      }
    },
  },
};
</script>
