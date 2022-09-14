<template>
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row dense>
      <v-col md="12">
        <BaseTabs>
          <BaseTab :name="$t('approve_setting')">
            <v-row dense>
              <v-col md="2">
                <BaseInput
                  :label="$t('form_id_or_form_name')"
                  v-model="txtFormTab1"
                  @keyPressEnter="onClick('searchTab1')"
                />
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="search"
                    :btn_text="$t('search')"
                    :disabled="isProcessing"
                    @onclick="onClick('searchTab1')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="add"
                    :btn_text="$t('add')"
                    :disabled="isProcessing"
                    @onclick="onClick('addRowTab1')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="delete"
                    :btn_text="$t('delete')"
                    :disabled="isProcessing"
                    @onclick="onClick('delRowTab1')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="undelete"
                    :btn_text="$t('undelete')"
                    :disabled="isProcessing"
                    @onclick="onClick('unDelRowTab1')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="save"
                    :btn_text="$t('save')"
                    :disabled="isProcessing"
                    @onclick="onClick('saveTab1')"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row dense>
              <BaseGridView
                column-resizing-mode="widget"
                ref="grdViewTab1"
                :setting="true"
                :multiselect="true"
                :height="limitHeightGrdTab1"
                :header="headerGrdViewTab1"
                sel_procedure="LG_SEL_8020040_TAB1_NOCACHE"
                upd_procedure="LG_UPD_8020040_TAB1"
                :filter_paras="[this.txtFormTab1]"
                :update_paras="[
                  'PK',
                  'SEQ',
                  'FORM_ID',
                  'FORM_NAME',
                  'AUTO_APPROVE',
                  'KEEP_CANCEL',
                  'USER_AUTHORITY',
                  'DESCRIPTION',
                  'USE_YN',
                  'CRT_BY',
                ]"
              >
              </BaseGridView>
            </v-row>
          </BaseTab>
          <BaseTab :name="$t('process_config')">
            <v-row dense>
              <v-col md="2">
                <BaseInput
                  :label="$t('form_id_or_form_name')"
                  v-model="txtFormTab2"
                  @keyPressEnter="onClick('searchTab2')"
                />
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="search"
                    :btn_text="$t('search')"
                    :disabled="isProcessing"
                    @onclick="onClick('searchTab2')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="add"
                    :btn_text="$t('add')"
                    :disabled="isProcessing"
                    @onclick="onClick('addRowTab2')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="delete"
                    :btn_text="$t('delete')"
                    :disabled="isProcessing"
                    @onclick="onClick('delRowTab2')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="undelete"
                    :btn_text="$t('undelete')"
                    :disabled="isProcessing"
                    @onclick="onClick('unDelRowTab2')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="save"
                    :btn_text="$t('save')"
                    :disabled="isProcessing"
                    @onclick="onClick('saveTab2')"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row dense>
              <BaseGridView
                column-resizing-mode="widget"
                ref="grdViewTab2"
                :setting="true"
                :multiselect="true"
                :height="limitHeightGrdTab2"
                :header="headerGrdViewTab2"
                sel_procedure="LG_SEL_8020040_TAB2_NOCACHE"
                upd_procedure="LG_UPD_8020040_TAB2"
                :filter_paras="[this.txtFormTab2]"
                :update_paras="[
                  'PK',
                  'FORM_ID',
                  'FORM_NAME',
                  'CHAR_VALUE',
                  'NUM_VALUE',
                  'DESCRIPTION',
                  'PROC_RELATE',
                  'USE_YN',
                  'CRT_BY',
                ]"
              >
              </BaseGridView>
            </v-row>
          </BaseTab>
          <BaseTab :name="$t('transaction_code')">
            <v-row dense>
              <v-col md="2">
                <BaseSelect
                  :label="$t('trans_type')"
                  v-model="itemTransType"
                  :lstData="lstTransType"
                  item-text="NAME"
                  item-value="VAL"
                  :text_all="$t('all')"
                />
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="search"
                    :btn_text="$t('search')"
                    :disabled="isProcessing"
                    @onclick="onClick('searchTab3')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="add"
                    :btn_text="$t('add')"
                    :disabled="isProcessing"
                    @onclick="onClick('addRowTab3')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="delete"
                    :btn_text="$t('delete')"
                    :disabled="isProcessing"
                    @onclick="onClick('delRowTab3')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="undelete"
                    :btn_text="$t('undelete')"
                    :disabled="isProcessing"
                    @onclick="onClick('unDelTab3')"
                  />
                </div>
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton
                    icon_type="save"
                    :btn_text="$t('save')"
                    :disabled="isProcessing"
                    @onclick="onClick('saveTab3')"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row dense>
              <BaseGridView
                column-resizing-mode="widget"
                ref="grdViewTab3"
                :setting="true"
                :multiselect="true"
                :height="limitHeightGrdTab3"
                :header="headerGrdViewTab3"
                sel_procedure="LG_SEL_8020040_TAB3_NOCACHE"
                upd_procedure="LG_UPD_8020040_TAB3"
                :filter_paras="[this.itemTransType]"
                :update_paras="[
                  'PK',
                  'TRANS_TYPE',
                  'TRANS_CODE',
                  'TRANS_NAME',
                  'TLG_IN_WAREHOUSE_PK',
                  'WH_NAME',
                  'COST',
                  'LOC_ID',
                  'CLOSE',
                  'DESCRIPTION',
                  'CRT_BY',
                ]"
                @cellDblClick="onDblClickCell"
              >
              </BaseGridView>
            </v-row>
          </BaseTab>
        </BaseTabs>
      </v-col>
    </v-row>
    <warehouse-dialog-two ref="dialogWH2" @callBackData="dataFromDialog2">
    </warehouse-dialog-two>
    <warehouse-location-dialog
      ref="dialogWHL1"
      @callBackData="dataFromDialog3"
    ></warehouse-location-dialog>
  </v-container>
</template>

<script>
import WarehouseDialogTwo from "@/components/dialog/WarehouseDialog";
import WarehouseLocationDialog from "@/components/dialog/WarehouseLocationDialog";

export default {
  layout: "default",
  middleware: "user",
  props: ["paras"],

  components: { WarehouseDialogTwo, WarehouseLocationDialog },

  data: () => ({
    txtFormTab1: "",
    txtFormTab2: "",
    txtFormTab3: "",
    itemTransType: "",
    lstTransType: [
      {
        NAME: "I * INCOMING TRANS",
        VAL: "I",
      },
      {
        NAME: "O * OUTGOING TRANS",
        VAL: "O",
      },
      {
        NAME: "A * ASSET TRANS",
        VAL: "A",
      },
      {
        NAME: "D * DEPRECIATION TRANS",
        VAL: "D",
      },
      {
        NAME: "C * COST TYPE",
        VAL: "C",
      },
      {
        NAME: "REVENUE TYPE",
        VAL: "R",
      },
    ],
    headerGrdViewTab1: [],
    headerGrdViewTab2: [],
    headerGrdViewTab3: [],
    cellItemTransType: "",
    pkClickCell: 0,
  }),

  async created() {
    // await this.getDataList();
    this.initHeader();
  },

  watch: {},

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrdTab1() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.79;
      }
    },
    limitHeightGrdTab2() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.79;
      }
    },
    limitHeightGrdTab3() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.79;
      }
    },
  },

  methods: {
    dataFromDialog3(data) {
      this.$refs.grdViewTab3.setCellValue(
        "LOC_ID",
        data.LOC_ID,
        this.pkClickCell,
        "PK"
      );
    },

    dataFromDialog2(data) {
      this.$refs.grdViewTab3.setCellValue(
        "TLG_IN_WAREHOUSE_PK",
        data.PK,
        this.pkClickCell,
        "PK"
      );
      this.$refs.grdViewTab3.setCellValue(
        "WH_NAME",
        data.WH_NAME,
        this.pkClickCell,
        "PK"
      );
    },

    onDblClickCell(cell) {
      if (cell.column.datafield == "WH_NAME") {
        this.pkClickCell = cell.data.PK;
        this.$refs.dialogWH2.dialogIsShow = true;
      }
      if (cell.column.datafield == "LOC_ID") {
        this.pkClickCell = cell.data.PK;
        this.$refs.dialogWHL1.dialogIsShow = true;
      }
    },

    changeBackground(row, columnfield, value, rowdata) {
      return "cellChanged8020040_01";
    },

    async onClick(action) {
      switch (action) {
        case "searchTab1":
          this.$refs.grdViewTab1.loadData();
          break;
        case "addRowTab1":
          this.$refs.grdViewTab1.addRowStruct({
            PK: "",
            SEQ: "",
            FORM_ID: "",
            FORM_NAME: "",
            AUTO_APPROVE: "N",
            KEEP_CANCEL: "N",
            USER_AUTHORITY: "N",
            DESCRIPTION: "",
            USE_YN: "Y",
            CRT_BY: this.user.USER_ID,
          });
          break;
        case "unDelRowTab1":
          this.$refs.grdViewTab1.unDeleteRows();
          break;
        case "delRowTab1":
          this.$refs.grdViewTab1.deleteRows();
          break;
        case "saveTab1":
          await this.$refs.grdViewTab1.saveData();
          break;
        case "searchTab2":
          this.$refs.grdViewTab2.loadData();
          break;
        case "addRowTab2":
          this.$refs.grdViewTab2.addRowStruct({
            PK: "",
            FORM_ID: "",
            FORM_NAME: "",
            CHAR_VALUE: "",
            NUM_VALUE: "",
            DESCRIPTION: "",
            PROC_RELATE: "",
            USE_YN: "Y",
            CRT_BY: this.user.USER_ID,
          });
          break;
        case "delRowTab2":
          this.$refs.grdViewTab2.deleteRows();
          break;
        case "unDelRowTab2":
          this.$refs.grdViewTab2.unDeleteRows();
          break;
        case "saveTab2":
          await this.$refs.grdViewTab2.saveData();
          break;
        case "searchTab3":
          this.$refs.grdViewTab3.loadData();
          break;
        case "addRowTab3":
          this.$refs.grdViewTab3.addRowStruct({
            PK: "",
            TRANS_TYPE: "",
            TRANS_CODE: "",
            TRANS_NAME: "",
            TLG_IN_WAREHOUSE_PK: "",
            WH_NAME: "",
            COST: "Y",
            LOC_ID: "",
            CLOSE: "",
            DESCRIPTION: "",
            CRT_BY: this.user.USER_ID,
          });
          break;
        case "delRowTab3":
          this.$refs.grdViewTab3.deleteRows();
          break;
        case "unDelTab3":
          this.$refs.grdViewTab3.unDeleteRows();
          break;
        case "saveTab3":
          await this.$refs.grdViewTab3.saveData();
          break;
      }
    },
    // async getDataList() {},
    initHeader() {
      this.headerGrdViewTab1 = [
        {
          dataField: "CRT_BY",
          caption: this.$t("CRT_BY"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "SEQ",
          caption: this.$t("seq"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "FORM_ID",
          caption: this.$t("form_id"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "FORM_NAME",
          caption: this.$t("form_name"),
          width: 240,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "AUTO_APPROVE",
          caption: this.$t("auto_approve"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "KEEP_CANCEL",
          caption: this.$t("keep_cancel"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "USER_AUTHORITY",
          caption: this.$t("user_authority"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("remark"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "USE_YN",
          caption: this.$t("use_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
          visible: true,
        },
      ];
      this.headerGrdViewTab2 = [
        {
          dataField: "CRT_BY",
          caption: this.$t("CRT_BY"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "SEQ",
          caption: this.$t("seq"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "FORM_ID",
          caption: this.$t("code"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "FORM_NAME",
          caption: this.$t("form_name"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "CHAR_VALUE",
          caption: this.$t("char_value"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "NUM_VALUE",
          caption: this.$t("num_value"),
          width: 120,
          allowEditing: false,
          visible: false,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "PROC_RELATE",
          caption: this.$t("proc_relate"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "USE_YN",
          caption: this.$t("use_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
          visible: true,
        },
      ];
      this.headerGrdViewTab3 = [
        {
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "TRANS_TYPE",
          caption: this.$t("trans_type"),
          lookup: {
            dataSource: this.lstTransType,
            displayExpr: "NAME",
            valueExpr: "VAL",
          },
          width: 240,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "TRANS_CODE",
          caption: this.$t("trans_code"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "TRANS_NAME",
          caption: this.$t("trans_name"),
          width: 280,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "TLG_IN_WAREHOUSE_PK",
          caption: this.$t("tlg_in_warehouse_pk"),
          width: 120,
          allowEditing: false,
          visible: false,
        },
        {
          dataField: "WH_NAME",
          caption: this.$t("wh_name"),
          cellclassname: this.changeBackground,
          width: 280,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "COST",
          caption: this.$t("cost"),
          dataType: "checkbox",
          cellclassname: this.changeBackground,
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "LOC_ID",
          caption: this.$t("loc_id"),
          cellclassname: this.changeBackground,
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "CLOSE",
          caption: this.$t("close"),
          dataType: "checkbox",
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          width: 120,
          allowEditing: true,
          visible: true,
        },
        {
          dataField: "CRT_BY",
          caption: this.$t("CRT_BY"),
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
.cellChanged8020040_01 {
  background-color: #ffffcc !important;
}
</style>
