<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col lg="6" cols="12">
        <BaseInput outlined :label="$t('data_search')" v-model="data_search" />
      </v-col>
      <v-col lg="6" cols="12" class="text-right d-flex justify-end">
        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
          @onclick="onClickButton('SEARCH')" />
      </v-col>
      <v-col cols="12">
        <BaseGridView column-resizing-mode="widget" ref="grdCompany" :auto_load="false" select_mode="Single"
          :max_height="limitHeight" :header="headerGrid" :onCellPrepared="onCellPrepared" @row-updated="checkUpdatedItem"
          sel_procedure="IPOS_SEL_6095910_SHOP_NC"
          :filter_paras="[this.data_search]" />
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
          dataField: "ID",
          width: 200,
          caption: this.$t('id'),
        },
        {
          dataField: "NAME",
          caption: this.$t('name'),
          width: 600,
        },
        {
          dataField: "IS_SEND_MAIL",
          caption: this.$t('is_send_mail'),
          cssClass: "cell-align-center",
          dataType: "checkbox",
          width: 100,
        },
        {
          dataField: "LOGO_IMAGE",
          caption: this.$t('logo_image'),
          width: 600,
        }
      ]
    },
  },
}
</script>
