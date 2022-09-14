<template>
<v-container fluid v-resize="onResize" class="pa-2">
  <v-row dense>
    <v-col md="5">
      <v-row class="d-flex align-center" dense>
        <v-col md="2"> </v-col>
        <v-col md="8">
          <BaseSelect :label="$t('company')" v-model="itemCompany" :lstData="lstCompany" item-text="PARTNER_NAME" item-value="PK" :text_all="$t('all')" />
        </v-col>
        <v-col md="2"> </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView column-resizing-mode="widget" ref="grdViewS" :setting="true" :multiselect="true" :height="limitHeightGrdViewS" :header="headerGrdViewS" sel_procedure="LG_SEL_8050050_1_NOCACHE" :filter_paras="[this.itemCompany]" @cellClick="cellClick">
        </BaseGridView>
      </v-row>
    </v-col>
    <v-col md="7">
      <v-row class="pb-2" dense>
        <v-col md="1"></v-col>
        <v-col md="3">
          <BaseInput :label="$t('account_code')" v-model="txtAccCode" @keyPressEnter="onClick('search')" readonly />
        </v-col>
        <v-col md="2"> </v-col>
        <v-col md="3">
          <BaseInput :label="$t('account_name_local')" v-model="txtAccNameLocal" @keyPressEnter="onClick('search')" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col md="1"></v-col>
        <v-col md="3">
          <BaseInput :label="$t('account_name_eng')" v-model="txtAccNameEng" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="2"></v-col>
        <v-col md="5">
          <div class="d-flex justify-start">
            <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onClick('add')" />
            <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick('delete')" />
            <BaseButton icon_type="undelete" :btn_text="$t('undelete')" :disabled="isProcessing" @onclick="onClick('undelete')" />
            <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick('save')" />
            <!-- tam ngung btn excel -->
            <!-- <BaseButton
                icon_type="print"
                :btn_text="$t('print')"
                :disabled="isProcessing"
                @onclick="onClick('print')"
              /> -->
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView column-resizing-mode="widget" ref="grdViewD" :setting="true" :multiselect="true" :height="limitHeightGrdViewD" :header="headerGrdViewD" sel_procedure="LG_SEL_8050050_2_NOCACHE" upd_procedure="LG_UPD_8050050_2" :filter_paras="[
              this.txtWHPK,
              this.txtAccCode,
              this.txtAccNameEng,
              this.txtAccNameLocal,
            ]" :update_paras="[
              'PK',
              'TLG_IN_WAREHOUSE_PK',
              'TAC_ABACCTCODE_PK',
              'AC_CD',
              'AC_NM',
              'AC_LNM',
              'TAC_ABPLCENTER_PK',
              'PL_CD',
              'PL_NM',
              'DESCRIPTION',
              'MAIN_ACC_YN',
              'CRT_BY',
            ]" @cellDblClick="onDblClickCell">
        </BaseGridView>
      </v-row>
    </v-col>
  </v-row>

  <get-account-code ref="dialogGAC" @callBackData="callBackData">
  </get-account-code>
</v-container>
</template>

<script>
import GetAccountCode from "@/pages/80/50/8050050_POPUP1";

export default {
  layout: "default",
  middleware: "user",
  props: ["paras"],

  components: {
    GetAccountCode,
  },

  data: () => ({
    itemCompany: "",
    lstCompany: [],
    lstItemClass: [],
    lstWHType: [],
    lstMainACCYN: [{
        NAME: "Yes",
        VAL: "Y",
      },
      {
        NAME: "No",
        VAL: "N",
      },
    ],
    headerGrdViewS: [],
    headerGrdViewD: [],
    txtAccCode: "",
    txtAccNameEng: "",
    txtAccNameLocal: "",
    txtWHPK: 0,
    rand: 0,
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
  },

  watch: {
    itemCompany(val) {
      this.$refs.grdViewD.Clear();
      this.$refs.grdViewS.loadData();
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrdViewS() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.83;
      }
    },
    limitHeightGrdViewD() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.79;
      }
    },
  },

  methods: {
    callBackData(data) {
      this.$refs.grdViewD.setCellValue("AC_CD", data[0].AC_CD, this.rand, "PK");
      this.$refs.grdViewD.setCellValue("AC_NM", data[0].AC_NM, this.rand, "PK");
      this.$refs.grdViewD.setCellValue(
        "AC_LNM",
        data[0].AC_LNM,
        this.rand,
        "PK"
      );
      this.$refs.grdViewD.setCellValue(
        "TAC_ABACCTCODE_PK",
        data[0].PK,
        this.rand,
        "PK"
      );
      // this.$refs.grdViewD.setCellValue("TAC_ABPLCENTER_PK",data[0].NOTAVAILABLE,this.rand,"PK") cot nay hien o trong popup 2 khi click vao cot PL_CD, PL_NM. Ma 2 cot nay hien dang hidden.
      // this.$refs.grdViewD.setCellValue("PL_CD",data[0].NOTAVAILABLE,this.rand,"PK") cot nay hien o trong popup 2 khi click vao cot PL_CD, PL_NM. Ma 2 cot nay hien dang hidden.
      // this.$refs.grdViewD.setCellValue("PL_NM",data[0].NOTAVAILABLE,this.rand,"PK") cot nay hien o trong popup 2 khi click vao cot PL_CD, PL_NM. Ma 2 cot nay hien dang hidden.
    },
    onDblClickCell(row) {
      this.$refs.dialogGAC.dialogIsShow = true;
    },
    cellClick(row) {
      this.txtWHPK = row.data.PK;
      this.$refs.grdViewD.loadData();
    },
    onClick(action) {
      switch (action) {
        case "add":
          this.rand = parseInt(Math.random(2) * 1000000000);
          this.$refs.grdViewD.addRowStruct({
            PK: this.rand,
            TLG_IN_WAREHOUSE_PK: this.txtWHPK,
            TAC_ABACCTCODE_PK: "",
            AC_CD: "",
            AC_NM: "",
            AC_LNM: "",
            TAC_ABPLCENTER_PK: "",
            PL_CD: "",
            PL_NM: "",
            DESCRIPTION: "",
            MAIN_ACC_YN: "N",
            CRT_BY: this.user.USER_ID,
          });
          break;
        case "save":
          this.$refs.grdViewD.saveData();
          break;
        case "delete":
          this.$refs.grdViewD.deleteRows();
          break;
        case "undelete":
          this.$refs.grdViewD.unDeleteRows();
          break;
        case "print":
          this.$refs.grdViewD.loadData();
          break;
      }
    },
    async getDataList() {
      const dsoCom = {
        type: "list",
        selpro: "LG_SEL_8050050_COM",
      };
      const resCom = await this._dsoCall(dsoCom, "select", false);
      if (resCom) {
        this.lstCompany = resCom;
        this.itemCompany = resCom[0].PK;
      }
      const dsoItemClass = {
        type: "list",
        selpro: "LG_SEL_8050050_ITEM_CLASS",
      };
      const resItemClass = await this._dsoCall(dsoItemClass, "select", false);
      if (resItemClass) {
        this.lstItemClass = resItemClass;
      }
      const dsoWHType = {
        type: "list",
        selpro: "LG_SEL_8050050_WH_TYPE",
      };
      const resWHType = await this._dsoCall(dsoWHType, "select", false);
      if (resWHType) {
        this.lstWHType = resWHType;
      }
    },
    initHeader() {
      this.headerGrdViewS = [{
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "WH_ID",
          caption: this.$t("wh_id"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "WH_NAME",
          caption: this.$t("wh_name"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "WH_ITEMCLASS",
          caption: this.$t("wh_itemclass"),
          width: 120,
          allowEditing: true,
          hidden: false,
          lookup: {
            dataSource: this.lstItemClass,
            displayExpr: "CODE_NM",
            valueExpr: "CODE",
          },
        },
        {
          dataField: "WH_TYPE",
          caption: this.$t("wh_type"),
          width: 120,
          allowEditing: true,
          hidden: false,
          lookup: {
            dataSource: this.lstWHType,
            displayExpr: "CODE_NM",
            valueExpr: "CODE",
          },
        },
        {
          dataField: "ITEM_GRADE",
          caption: this.$t("item_grade"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
      ];
      this.headerGrdViewD = [{
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "TLG_IN_WAREHOUSE_PK",
          caption: this.$t("tlg_in_warehouse_pk"),
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
          dataField: "AC_CD",
          caption: this.$t("ac_cd"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "AC_NM",
          caption: this.$t("ac_nm"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "AC_LNM",
          caption: this.$t("ac_lnm"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "TAC_ABPLCENTER_PK",
          caption: this.$t("tac_abplcenter_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PL_CD",
          caption: this.$t("pl_cd"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PL_NM",
          caption: this.$t("pl_nm"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "MAIN_ACC_YN",
          caption: this.$t("main_acc_yn"),
          width: 120,
          allowEditing: true,
          hidden: false,
          lookup: {
            dataSource: this.lstMainACCYN,
            displayExpr: "NAME",
            valueExpr: "VAL",
          },
        },
        {
          dataField: "CRT_BY",
          caption: this.$t("crt_by"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
      ];
    },
  },
};
</script>

<style>
</style>
