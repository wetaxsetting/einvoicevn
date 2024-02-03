<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col lg="3" cols="12">
        <BaseInput outlined :label="$t('store_id')" v-model="store_id" />
      </v-col>
      <v-col lg="3" cols="12">
        <BaseSelect outlined :label="$t('type')" :lstData="typeList" v-model="type" item-value="VAL" item-text="NAME"/>
      </v-col>
      <v-col lg="6" cols="12" class="text-right d-flex justify-end">
        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
          @onclick="onClickButton('SEARCH')" />
      </v-col>
      <v-col cols="12">
        <BaseGridView column-resizing-mode="widget" ref="grdCompany" :auto_load="false" select_mode="Single"
          :max_height="limitHeight" :header="headerGrid" :onCellPrepared="onCellPrepared" @row-updated="checkUpdatedItem"
          sel_procedure="IPOS_SEL_6095920_ITEM_NC"
          :filter_paras="[this.store_id, this.type ]" />
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
    tax_code: "",
    typeList : [
      { VAL : "ALL", NAME : "ALL" },
      { VAL : "ACTIVE", NAME : "ACTIVE" },
      { VAL : "DELI", NAME : "DELI" },
      { VAL : "STORE", NAME : "STORE" }
      
    ],
    type:""
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
          width: 100,
          caption: this.$t('id'),
        },
        {
          dataField: "NAME",
          caption: this.$t('name'),
          width: 200,
        },
        {
          dataField: "TA_PRICE",
          caption: this.$t('ta_price'),
          width: 200,
          dataType: 'number',
          formatFloat: 0
        },
        {
          dataField: "OTS_PRICE",
          caption: this.$t('ots_price'),
          width: 200,
          dataType: 'number',
          formatFloat: 0
        },
        {
          dataField: "SORT",
          caption: this.$t('sort'),
          width: 100,
        },
        {
          dataField: "STORE_ID",
          caption: this.$t('store_id'),
          
          width: 100,
        },
        {
          dataField: "STORE_ITEM_ID",
          caption: this.$t('store_item_id'),
          width: 100,
        },
        {
          dataField: "TYPE_ID",
          caption: this.$t('type_id'),
          width: 100,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t('description'),
          width: 200,
        },
        {
          dataField: "STATUS",
          caption: this.$t('status'),
          width: 100,
        },
        {
          dataField: "IS_FEATURED",
          caption: this.$t('is_featured'),
          cssClass: "cell-align-center",
          dataType: "checkbox",
          width: 100,
        },
        {
          dataField: "ALLOW_TAKE_AWAY",
          caption: this.$t('allow_take_away'),
          cssClass: "cell-align-center",
          dataType: "checkbox",
          width: 100,
        },
        {
          dataField: "ALLOW_SELF_ORDER",
          caption: this.$t('allow_self_order'),
          cssClass: "cell-align-center",
          dataType: "checkbox",
          width: 100,
        },
        {
          dataField: "UPDATE_AT",
          caption: this.$t('update_at'),
          width: 150,
        },
        {
          dataField: "IS_EAT_WITH",
          caption: this.$t('is_eat_with'),
          cssClass: "cell-align-center",
          dataType: "checkbox",
          width: 100,
        },
        {
          dataField: "TIME_SALE_DATE_WEEK",
          caption: this.$t('time_sale_date_week'),
          width: 100,
          dataType: 'number',
          formatFloat: 0
        },
        {
          dataField: "TIME_SALE_HOUR_DAY",
          caption: this.$t('time_sale_hour_day'),
          width: 100,
          dataType: 'number',
          formatFloat: 0
        }
      ]
    },
  },
}
</script>
