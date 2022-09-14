<template>
<v-container fluid v-resize="onResize" class="pa-2">
  <v-row class="pa-2" dense>
    <v-col md="4" v-show="isShowHideCols1">
      <v-row dense>
        <v-col md="12">
          <BaseSelect :label="$t('item_group')" v-model="itemCompany" :lstData="lstCompany" item-text="NAME" item-value="PK" :text_all="$t('all')" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col md="10">
          <BaseInput :label="$t('search')" v-model="txtSearch" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="2">
          <div class="d-flex justity-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClick('search')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <BaseInput :label="$t('parent')" v-model="txtParent" @keyPressEnter="onClick('search')" readonly />
        </v-col>
      </v-row>
      <v-row class="pb-2" dense>
        <v-col md="4">
          <BaseInput :label="$t('group_code')" v-model="txtGroupCode" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="8">
          <BaseInput :label="$t('group_name')" v-model="txtGroupName" @keyPressEnter="onClick('search')" />
        </v-col>
      </v-row>
      <v-row dense>
        <BaseTreeView ref="treeItemWO" :label="'item_wo_tree'" :value="orgList" :height="limitHeight" :expand="true" :childrenKey="'items'" :keyExpr="'PK'" :displayExpr="'GRP'" :search="false" @itemClick="itemTreeClick">
        </BaseTreeView>
      </v-row>
    </v-col>
    <v-col md="txtColRight" class="pl-4">
      <v-row dense>
        <v-col md="4">
          <BaseInput :label="$t('item')" v-model="txtItem" @keyPressEnter="onClick('searchD')" />
        </v-col>
        <v-col md="4"></v-col>
        <v-col md="4">
          <div class="d-flex justity-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClick('searchD')" />
            <BaseButton icon_type="save" :btn_text="$t('save')" @onclick="onClick('saveD')" />
            <BaseButton icon_type="print" :btn_text="$t('print')" @onclick="onClick('printD')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col md="1">
          <BaseButton btn_type="icon" :icon_type="isShowHideCols1 ? 'left' : 'right'" :btn_text="isShowHideCols1 ? $t('hide_left') : $t('show_left')" @onclick="onShowHideSearchTree" />
        </v-col>
        <v-col md="10">
          <b class="d-flex justify-center align-center">
            {{ this.txtGroupNameShow }}
          </b>
        </v-col>
        <v-col md="1">
          <BaseButton btn_type="icon" :icon_type="isShowHideColsGrdD ? 'eye_off' : 'eye_on'" :btn_text="isShowHideColsGrdD ? $t('hide_cols') : $t('show_cols')" @onclick="onShowHideColsGrdD" />
        </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView ref="grdViewD" :header="headerGrdViewD" :max_height="limitHeightGrdViewD" :setting="true" :auto_load="false" sel_procedure="LG_SEL_8040070_2" :filter_paras="[this.txtItem, this.txtGroupPK]" upd_procedure="LG_UPD_8040070_2" :update_paras="paraUpdGrd2" @cellDblClick="onDblClickCell">
        </BaseGridView>
      </v-row>
    </v-col>
  </v-row>
  <popup-account-code ref="refAcountCode" @callBackData="dataFromPopup"></popup-account-code>
</v-container>
</template>

<script>
import listToTree from "list-to-tree-lite";
import popupAccountCode from "@/pages/80/40/8040070_POPUP1";

export default {
  layout: "default",
  middleware: "user",
  props: ["paras"],

  components: {
    popupAccountCode
  },

  data: () => ({
    itemCompany: "",
    lstCompany: [],
    txtSearch: "",
    txtParent: "",
    txtGroupName: "",
    txtGroupCode: "",
    isShowHideCols1: true,
    isShowHideColsGrdD: true,
    orgList: [],
    txtGroupNameShow: "",
    txtColRight: 8,
    headerGrdViewD: [],
    txtItem: "",
    txtGroupPK: 0,
    paraUpdGrd2: [
      "PK",
      "ITEM_SEQ",
      "ITEM_CODE",
      "ECUST_ITEM_CODE",
      "VIRTUAL_CODE",
      "VIRTUAL_NAME",
      "ITEM_NAME",
      "ITEM_LNAME",
      "ITEM_FNAME",
      "UOM",
      "SPEC01_NM",
      "SPEC02_NM",
      "SPEC03_NM",
      "SPEC04_NM",
      "SPEC05_NM",
      "UNIT_PRICE",
      "REF_UOM",
      "RATE_UOM",
      "PRICE_UOM",
      "REF_UOM_2",
      "RATE_UOM_2",
      "PRICE_UOM_2",
      "PUR_PRICE",
      "PROD_PRICE",
      "VAT_RATE",
      "SERVICE_CHARGE_RATE",
      "COEFFICIENT_RATE",
      "CCY",
      "USE_YN",
      "DESCRIPTION",
      "TLG_IT_ITEMPHOTO_PK",
      "TLG_IT_ITEMGRP_PK",
      "TAC_ABACCTCODE_PK",
      "ACCT_CDNM",
      "TAC_ABACCTCODE_PK_EXPENSE",
      "EXPENSE_CDNM",
      "TAC_ABACCTCODE_PK_REVENUE",
      "REVENUE_CDNM",
      "BOM_YN",
      "INVENTORY_YN",
      "PCS_PER_SKID",
      "CBM_PER_SKID",
      "WEIGHT_PER_SKID",
      "ATT04",
      "ATT05",
      "VAL01",
      "VAL02",
      "VAL03",
      "VAL04",
      "VAL05",
      "HS_CODE",
      "DF_WIDTH",
      "LOT_WEIGHT",
      "F_SEQ_1",
      "F_SEQ_2",
      "F_SEQ_3",
      "F_SEQ_4",
      "F_SEQ_5",
      "F_SEQ_6",
      "F_SEQ_7",
      "ACC_ITEM_CODE",
      "ACC_ITEM_NAME",
      "ERP_ITEM_CODE",
      "ERP_ITEM_NAME",
      "SAP_ITEM_CODE",
      "SAP_ITEM_NAME",
      "CRT_BY",
    ],
    lstUOM: [],
    lstCCY: [],
    txtNameColSel: "",
    txtPKColSel: 0,
    showCols: true,
  }),

  async created() {
    await this.getDataList();
    await this.getOrgList();
    this.initHeader();
  },

  watch: {
    isShowHideCols1(val) {
      if (!val) {
        this.txtColRight = 12;
        this.$refs.grdViewD.loadData();
      } else {
        this.txtColRight = 8;
      }
    },
    isShowHideColsGrdD(val) {
      if (val) {
        this.showCols = true;
      } else {
        this.showCols = false;
      }
      this.initHeader();
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrdViewD() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.78;
      }
    },
    limitHeight() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.688;
      }
    },
  },

  methods: {
    async onReport() {
      let report = "rpt_8040070_01";
      try {
        this._ExcelSaveAs(
          await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: "report/80/40/rpt_8040070_01.xlsx",
              excel: JSON.stringify([{
                sheet: 1,
                insertRows: [{
                  startRow: 5,
                  proc: "LG_RPT_8040070_1",
                  params: [this.txtItem, this.txtGroupPK],
                }, ],
              }, ]),
              convert: "xlsx",
            },
          }),
          report + "." + "xlsx"
        );
      } catch (e) {
        this.showNotification(
          "danger",
          this.$t("fail_to_export_report"),
          "",
          4000
        );
      }
    },

    onDblClickCell(row) {
      if (
        row.column.datafield == "ACCT_CDNM" ||
        row.column.datafield == "EXPENSE_CDNM" ||
        row.column.datafield == "REVENUE_CDNM"
      ) {
        this.txtNameColSel = row.column.datafield;
        this.txtPKColSel = row.data.PK;
        this.$refs.refAcountCode.dialogIsShow = true;
      }
    },

    dataFromPopup(obj) {
      //
      switch (this.txtNameColSel) {
        case "ACCT_CDNM":
          this.$refs.grdViewD.setCellValue(
            "TAC_ABACCTCODE_PK",
            obj[0].PK,
            this.txtPKColSel,
            "PK"
          );
          this.$refs.grdViewD.setCellValue(
            "ACCT_CDNM",
            obj[0].AC_CD + " - " + obj[0].AC_NM,
            this.txtPKColSel,
            "PK"
          );
          break;
        case "EXPENSE_CDNM":
          this.$refs.grdViewD.setCellValue(
            "TAC_ABACCTCODE_PK_EXPENSE",
            obj[0].PK,
            this.txtPKColSel,
            "PK"
          );
          this.$refs.grdViewD.setCellValue(
            "EXPENSE_CDNM",
            obj[0].AC_CD + " - " + obj[0].AC_NM,
            this.txtPKColSel,
            "PK"
          );
          break;
        case "REVENUE_CDNM":
          this.$refs.grdViewD.setCellValue(
            "TAC_ABACCTCODE_PK_REVENUE",
            obj[0].PK,
            this.txtPKColSel,
            "PK"
          );
          this.$refs.grdViewD.setCellValue(
            "REVENUE_CDNM",
            obj[0].AC_CD + " - " + obj[0].AC_NM,
            this.txtPKColSel,
            "PK"
          );
          break;
      }
    },

    async itemTreeClick(event, data) {
      if (data.GRP.length <= 73) {
        this.txtGroupNameShow = data.GRP;
      } else {
        this.txtGroupNameShow = data.GRP.slice(0, 73) + "...";
      }
      this.txtGroupPK = data.PK;
      this.$refs.grdViewD.loadData();
    },

    async getOrgList() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_8040070",
        para: [this.itemCompany, this.txtSearch],
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.orgList = listToTree(result, {
          idKey: "PK",
          parentKey: "P_PK",
          childrenKey: "items",
        });
      } else {
        this.orgList = [];
      }
    },

    onShowHideColsGrdD() {
      this.isShowHideColsGrdD = !this.isShowHideColsGrdD;
      this.showCols = !this.showCols;
    },
    onShowHideSearchTree() {
      this.isShowHideCols1 = !this.isShowHideCols1;
    },

    onClick(action) {
      switch (action) {
        case "search":
          this.$refs.treeItemWO.onSearch(this.txtSearch);
          this.$refs.grdViewD.Clear();
          break;
        case "searchD":
          if (this.txtGroupPK != 0) {
            this.$refs.grdViewD.loadData();
          } else {
            this.showNotification(
              "warning",
              this.$t("please_select_item_group_first"),
              ""
            );
          }
          break;
        case "saveD":
          this.$refs.grdViewD.saveData();
          break;
        case "printD":
          if (this.txtGroupPK != 0) {
            this.onReport();
          } else {
            this.showNotification("warning", "please_select_item_group_first");
          }
          break;
      }
    },

    async getDataList() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_8040070_4",
        para: [this.user.PK],
      };
      const res1 = await this._dsoCall(dso, "select", false);
      if (res1.length > 0) {
        this.lstCompany = res1;
      }
      const dsoUOM = {
        type: "list",
        selpro: "LG_SEL_8040070_UOM",
        para: [this.user.PK],
      };
      const resUOM = await this._dsoCall(dsoUOM, "select", false);
      if (resUOM.length > 0) {
        this.lstUOM = resUOM;
      }
      const dsoCCY = {
        type: "list",
        selpro: "LG_SEL_8040070_CCY",
        para: [this.user.PK],
      };
      const resCCY = await this._dsoCall(dsoCCY, "select", false);
      if (resCCY.length > 0) {
        this.lstCCY = resCCY;
      }
    },

    initHeader() {
      this.headerGrdViewD = [{
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "ITEM_SEQ",
          caption: this.$t("seq"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "ITEM_CODE",
          caption: this.$t("item_code"),
          width: 120,
          allowEditing: false,
        },
        {
          dataField: "ECUST_ITEM_CODE",
          caption: this.$t("ecust_item_code"),
          width: 120,
          allowEditing: true,
          hidden: true,
        },
        {
          dataField: "VIRTUAL_CODE",
          caption: this.$t("virtual_code"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "VIRTUAL_NAME",
          caption: this.$t("virtual_name"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("item_name"),
          width: 120,
          allowEditing: false,
        },
        {
          dataField: "ITEM_LNAME",
          caption: this.$t("f_name_01"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "ITEM_FNAME",
          caption: this.$t("f_name_02"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "UOM",
          caption: this.$t("uom"),
          width: 120,
          allowEditing: true,
          lookup: {
            dataSource: this.lstUOM,
            displayExpr: "NAME",
            valueExpr: "VAL",
          },
        },
        {
          dataField: "SPEC01_NM",
          caption: this.$t("spec_01"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "SPEC02_NM",
          caption: this.$t("spec_02"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "SPEC03_NM",
          caption: this.$t("spec_03"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "SPEC04_NM",
          caption: this.$t("spec_04"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "SPEC05_NM",
          caption: this.$t("spec_05"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "UNIT_PRICE",
          caption: this.$t("sale_price"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
        },
        {
          dataField: "REF_UOM",
          caption: this.$t("ref_uom"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "RATE_UOM",
          caption: this.$t("rate_uom"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PRICE_UOM",
          caption: this.$t("price_uom"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "REF_UOM_2",
          caption: this.$t("ref_uom_2"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "RATE_UOM_2",
          caption: this.$t("rate_uom_2"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PRICE_UOM_2",
          caption: this.$t("price_uom_2"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PUR_PRICE",
          caption: this.$t("pur_price"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
        },
        {
          dataField: "PROD_PRICE",
          caption: this.$t("prod_price"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
        },
        {
          dataField: "VAT_RATE",
          caption: this.$t("vat_rate"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "SERVICE_CHARGE_RATE",
          caption: this.$t("svc_rate"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "COEFFICIENT_RATE",
          caption: this.$t("coc_rate"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "CCY",
          caption: this.$t("ccy"),
          width: 120,
          allowEditing: true,
          lookup: {
            dataSource: this.lstCCY,
            displayExpr: "NAME",
            valueExpr: "VAL",
          },
        },
        {
          dataField: "USE_YN",
          caption: this.$t("use_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("remark"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "TLG_IT_ITEMPHOTO_PK",
          caption: this.$t("tlg_it_itemphoto_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "TLG_IT_ITEMGRP_PK",
          caption: this.$t("tlg_it_itemgrp_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "TAC_ABACCTCODE_PK",
          caption: this.$t("tac_abacctcode_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "ACCT_CDNM",
          caption: this.$t("wh_acc"),
          width: 120,
          allowEditing: false,
        },
        {
          dataField: "TAC_ABACCTCODE_PK_EXPENSE",
          caption: this.$t("tac_abacctcode_pk_expense"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "EXPENSE_CDNM",
          caption: this.$t("expense_acc"),
          width: 120,
          allowEditing: false,
        },
        {
          dataField: "TAC_ABACCTCODE_PK_REVENUE",
          caption: this.$t("tac_abacctcode_pk_revenue"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "REVENUE_CDNM",
          caption: this.$t("revenue_acc"),
          width: 120,
          allowEditing: false,
        },
        {
          dataField: "BOM_YN",
          caption: this.$t("bom_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "INVENTORY_YN",
          caption: this.$t("inv_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "PCS_PER_SKID",
          caption: this.$t("pcs_per_skid"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "CBM_PER_SKID",
          caption: this.$t("cbm_per_skid"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "WEIGHT_PER_SKID",
          caption: this.$t("weight_per_skid"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "ATT04",
          caption: this.$t("att04"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "ATT05",
          caption: this.$t("att05"),
          width: 120,
          allowEditing: true,
          hidden: this.showCols,
        },
        {
          dataField: "VAL01",
          caption: this.$t("val01"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "VAL02",
          caption: this.$t("val02"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "VAL03",
          caption: this.$t("val03"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "VAL04",
          caption: this.$t("val04"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "VAL05",
          caption: this.$t("val05"),
          width: 120,
          allowEditing: true,
          formatFloat: 5,
          dataType: "number",
          hidden: this.showCols,
        },
        {
          dataField: "HS_CODE",
          caption: this.$t("hs_code"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "DF_WIDTH",
          caption: this.$t("df_width"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "LOT_WEIGHT",
          caption: this.$t("lot_weight"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "F_SEQ_1",
          caption: this.$t("f_seq_1"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "F_SEQ_2",
          caption: this.$t("f_seq_2"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "F_SEQ_3",
          caption: this.$t("f_seq_3"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "F_SEQ_4",
          caption: this.$t("f_seq_4"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "F_SEQ_5",
          caption: this.$t("f_seq_5"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "F_SEQ_6",
          caption: this.$t("f_seq_6"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "F_SEQ_7",
          caption: this.$t("f_seq_7"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "ACC_ITEM_CODE",
          caption: this.$t("acc_item_code"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "ACC_ITEM_NAME",
          caption: this.$t("acc_item_name"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "ERP_ITEM_CODE",
          caption: this.$t("erp_item_code"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "ERP_ITEM_NAME",
          caption: this.$t("erp_item_name"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "SAP_ITEM_CODE",
          caption: this.$t("sap_item_code"),
          width: 120,
          allowEditing: true,
        },
        {
          dataField: "SAP_ITEM_NAME",
          caption: this.$t("sap_item_name"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
      ];
      //  {
      //     dataField: "SEQ",
      //     caption: this.$t("seq"),
      //     width: 120,
      //     allowEditing: false,
      //     hidden: true,
      //   },
    },
  },
};
</script>

<style>
</style>
