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
          sel_procedure="SEL_6096910_SHOP_NC"
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
          dataField: "SID",
          width: 0,
          caption: this.$t('SID')
        },
        {
          dataField: "COMP_ID",
          caption: this.$t('COMP_ID'),
        },
        {
          dataField: "POS_SHOP_CD",
          caption: this.$t('POS_SHOP_CD'),
        },
        {
          dataField: "SHOP_NM",
          caption: this.$t('SHOP_NM'),
          width: 300,
        },
        {
          dataField: "SHOP_ADD",
          caption: this.$t('SHOP_ADD'),
        },
        {
          dataField: "TEL_NO",
          caption: this.$t('TEL_NO'),
        },
        {
          dataField: "FAX_NO",
          caption: this.$t('FAX_NO'),
        },
        {
          dataField: "SHOP_EML",
          caption: this.$t('SHOP_EML'),
        },
        {
          dataField: "SHOP_LOGO",
          caption: this.$t('SHOP_LOGO'),
        },
        {
          dataField: "REG_ID",
          caption: this.$t('REG_ID'),
        },
        {
          dataField: "EDIT_ID",
          caption: this.$t('EDIT_ID'),
        },
        {
          dataField: "REG_DTM",
          caption: this.$t('REG_DTM'),
        },
        {
          dataField: "PRO_YN",
          caption: this.$t('PRO_YN'),
        },
        {
          dataField: "POS_ID",
          caption: this.$t('POS_ID'),
        },
      ]
    },
  },
}
</script>
