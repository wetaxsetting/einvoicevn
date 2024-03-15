<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col md="3">
        <v-select clearable dense hide-details outlined :label="$t('company')" v-model="lstCompany" :items="companyGroup"
          item-text="TEXT" item-value="PK" :text_all="$t('all')"></v-select>
      </v-col>
      <v-col lg="2" sm="6" cols="12">
        <v-text-field clearable dense hide-details outlined :label="$t('customer_name')"
          v-model="customer_name"></v-text-field>
      </v-col>
      <v-col lg="2" cols="12">
        <BaseInput outlined :label="$t('tax_code')" v-model="tax_code" />
      </v-col>
      <v-col lg="5" cols="12" class="text-right d-flex justify-end">
        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
          @onclick="onClickButton('SEARCH')" />
      </v-col>
      <v-col cols="12">
        <DataGridView column-resizing-mode="widget" ref="grdCompany" :auto_load="false" select_mode="Single"
          :max_height="limitHeight" :header="headerGrid" :onCellPrepared="onCellPrepared" @row-updated="checkUpdatedItem"
          sel_procedure="EI_SEL_6095060_CUSTOMER_NC"
          :filter_paras="[this.lstCompany, this.customer_name, this.tax_code]" />
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('OPTION')"></confirm-dialog>
  </v-container>
</template>

<script>
const findValueDeep = require('deepdash/findValueDeep');
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
export default {
  layout: 'default',
  middleware: 'user',

  components: {
    DatePicker: () => import("@/components/control/DatePicker"),
    ConfirmDialog
  },
  data: () => ({
    txtCompanyName: "",
    dxg_gridCompany: [],
    objClick: "",
    lstCompany: "",
    companyGroup: [],
    transDateFrom: "",
    transDateTo: "",
    lstStatus: "",
    statusGroup: [],
    customer_name: "",
    tax_code: ""
  }),

  created() {
    this.getListCodes();
    this.initHeaderList();
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this._calculateHeight(this.formContainerHeight, 90) },
    // headerGrid() {
    //   const self = this;
    //   return [
    //     {
    //       dataField: "PK",
    //       width: 0,
    //       caption: this.$t('pk')
    //     },
    //     {
    //       dataField: "CUS_CD",
    //       width: 80,
    //       caption: this.$t('cus_cd'),
    //     },
    //     {
    //       dataField: "CUS_NM",
    //       caption: this.$t('cus_nm')
    //     },
    //     {
    //       dataField: "CUS_LNM",
    //       caption: this.$t('cus_lnm'),
    //       hidden: true,
    //     },
    //     {
    //       dataField: "CUS_FNM",
    //       caption: this.$t('CUS_FNM'),
    //       hidden: true,
    //     },
    //     {
    //       dataField: "TAX_CODE",
    //       caption: this.$t('tax_code')
    //     },
    //     {
    //       dataField: "ADDR",
    //       caption: this.$t('addr')
    //     },
    //     {
    //       dataField: "ADDR_L",
    //       caption: this.$t('addr_l'),
    //       hidden: true,
    //     },
    //     {
    //       dataField: "ADDR_F",
    //       caption: this.$t('addr_f'),
    //       hidden: true,
    //     },
    //     {
    //       dataField: "TEL",
    //       caption: this.$t('tel'),

    //     },
    //     {
    //       dataField: "EMAIL",
    //       caption: this.$t('email'),
    //     },
    //     {
    //       dataField: "FAX",
    //       caption: this.$t('FAX'),
    //     },
    //     {
    //       dataField: "WEB_SITE",
    //       caption: this.$t('web_site'),
    //     },
    //     {
    //       dataField: "USE_YN",
    //       caption: this.$t('use_yn'),
    //       cssClass: "cell-align-center",
    //       dataType: "checkbox"
    //     },
    //     {
    //       dataField: "REMARKS",
    //       caption: this.$t('remarks'),

    //     }
    //   ]
    // }
  },

  methods: {
    onSearch() {
      this.$refs.grdCompany.loadData();
    },
    addNewMaster(item) {
      this.$refs.grdCompany.addRowStruct({
        PK: '',
        COMPANY_CD: '',
        COMPANY_NM: '',
        COMPANY_LNM: '',
        COMPANY_FNM: '',
        TAX_CODE: '',
        ADDR: '',
        ADDR_L: '',
        ADDR_F: '',
        TEL: '',
        FAX: '',
        ACC_NO: '',
        ACC_CCY: '',
        ACC_HOLDER: '',
        BANK_NAME: '',
        CONTACT_PERSON: '',
        REP_PERSON: '',
        TAX_NAME: '',
        REMARKS: '',
        ERP_COMPANY_PK: '',
        ERP_COMPANY_NAME: '',
        USE_YN: 'Y',
        WEB_SITE: '',
        TAX_CODE_DISPLAY: '',
        CONTACT_COM_PHONE: '',
        BRIEF_COM_NM: '',
        CONTACT_ADDR: '',
        CONTACT_EMAIL: '',
        CONTACT_MOBI: '',
        WEBSITE_EI: ''
      },
        0
      );
      this.selectedItemAcc = { ...item };
    },

    onSaveMaster() {
      this.save()
    },

    onCellPrepared({ column, cellElement, rowType }) {
      if (this.txtInvoice_type === "E") {
        if (rowType === "data" && (column.dataField === "ATTRIBUTE1" || column.dataField === "ATTRIBUTE2" || column.dataField === "ATTRIBUTE3" || column.dataField === "ATTRIBUTE4" || column.dataField === "ATTRIBUTE5" || column.dataField === "SEQ_DIS" || column.dataField === "SEQ")) {
          cellElement.style.width = 100;
        }
      }
    },
    checkUpdatedItem(data, colName) {
      if (!data.cancel) {
        if (data.data._rowstatus !== "i") {
          data.data._rowstatus = "u";
        }
      }
      if (colName === 'NET_TR_AMT') {

        data.data.NET_BK_AMT = data.data.NET_TR_AMT * this.txtTrans_Rate / this.txtBook_Rate;
      }
      if (colName === 'U_PRICE' || colName === 'QTY') {
        data.data.EXT_PRICE = data.data.QTY * data.data.U_PRICE;
        data.data.NET_TR_AMT = data.data.QTY * data.data.U_PRICE;
        data.data.NET_BK_AMT = data.data.NET_TR_AMT * this.txtTrans_Rate / this.txtBook_Rate;
        data.data.ORDER_TRAMT = data.data.QTY * data.data.U_PRICE;
        data.data.ORDER_UPRICE = data.data.QTY * data.data.U_PRICE;
      }

    },
    async getListCodes() {
      const dso_company_list = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: [this.user.PK],
      };
      this.companyGroup = await this._dsoCall(dso_company_list, "select", false);
      this.lstCompany = this.companyGroup[0].PK;

      const dso_status_list = {
        type: "list",
        selpro: "SYS_SEL_LIST_STATUS",
        para: [this.user.PK],
      };
      this.statusGroup = await this._dsoCall(dso_status_list, "select", false);
      this.lstStatus = this.statusGroup[0].PK;

    },
    openDeleteDialog() {
      this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"), "warning");
    },
    onClickButton(obj) {
      switch (obj) {
        case "SEARCH":
          this.$refs.grdCompany.loadData();
          break;
        case "NEW":
          this.addNewMaster();//    
          break;
        case "SAVE":
          this.objClick = "btnSave";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
          break;
        case "DELETE":
          this.objClick = "btnDelete";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"), "warning");
          break;
        case "OPTION":
          if (this.objClick == "btnSave") {
            this.$refs.grdCompany.saveData();
          }
          else if (this.objClick == "btnDelete") {
            this.$refs.grdCompany.deleteRows2();
          }
          break;

      }
    },

    initHeaderList() {
      this.headerGrid = [
        {
          dataField: "PK",
          width: 0,
          caption: this.$t('pk')
        },
        {
          dataField: "CUS_CD",
          width: 80,
          caption: this.$t('cus_cd'),
        },
        {
          dataField: "CUS_NM",
          caption: this.$t('cus_nm')
        },
        {
          field: "CUS_LNM",
          caption: this.$t('cus_lnm'),
          visible: false
        },
        {
          dataField: "CUS_FNM",
          caption: this.$t('CUS_FNM'),
          visible: false
        },
        {
          dataField: "TAX_CODE",
          caption: this.$t('tax_code')
        },
        {
          dataField: "ADDR",
          caption: this.$t('addr')
        },
        {
          dataField: "ADDR_L",
          caption: this.$t('addr_l'),
          visible: false
        },
        {
          dataField: "ADDR_F",
          caption: this.$t('addr_f'),
          visible: false
        },
        {
          dataField: "TEL",
          caption: this.$t('tel'),

        },
        {
          dataField: "EMAIL",
          caption: this.$t('email'),
        },
        {
          dataField: "FAX",
          caption: this.$t('FAX'),
        },
        {
          dataField: "WEB_SITE",
          caption: this.$t('web_site'),
        },
        {
          dataField: "USE_YN",
          caption: this.$t('use_yn'),
          cssClass: "cell-align-center",
          dataType: "checkbox"
        },
        {
          dataField: "REMARKS",
          caption: this.$t('remarks'),

        }
      ]
    },
  },
}
</script>
