<template>
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row dense>
      <v-col md="3" v-show="showTree">
        <!-- thanh search NodeJS tam an vi chua hoan thien.  -->
        <!-- <v-row dense>
          <v-col md="8">
            <BaseInput :label="$t('group_code')" v-model="txtGroupCodeS" />
          </v-col>
          <v-col md="4">
            <div class="d-flex justify-center">
              <BaseButton
                icon_type="search"
                :btn_text="$t('search')"
                :disabled="isProcessing"
                @onclick="onClick('searchGrdS')"
              />
            </div>
          </v-col>
        </v-row> -->
        <v-row class="pr-2" dense>
          <!-- <BaseTreeView
            ref="myTree"
            :label="'organization_tree'"
            :value="menuList"
            :height="limitHeightLeft * 0.8"
            :expand="true"
            :childrenKey="'childMenu'"
            :keyExpr="'PK'"
            :displayExpr="'FORM_NM'"
            @itemClick="getSelectedMenu2"
          >
          </BaseTreeView> -->

          <v-card
            outlined
            :disabled="isRendering"
            :loading="isRendering"
            :style="`width: 100%; max-height: ${limitHeightLeft}px; overflow-y: scroll;`"
            v-resize="onResize"
          >
            <v-card-text class="px-0 py-1">
              <v-slide-y-transition hide-on-leave>
                <v-skeleton-loader
                  type="list-item@10"
                  v-if="!menuList.length"
                ></v-skeleton-loader>
                <v-treeview
                  activatable
                  dense
                  hoverable
                  return-object
                  transition
                  class="pointer"
                  item-key="PK"
                  item-text="FORM_NM"
                  item-children="childMenu"
                  :active.sync="active"
                  :color="currentTheme"
                  :items="menuList"
                  @update:active="getSelectedMenu"
                  v-else
                >
                  <template v-slot:label="{ item, active }">
                    <div @click="active ? $event.stopPropagation() : null">
                      {{ item.FORM_NM }}
                    </div>
                  </template>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon
                      v-if="item.LEAF === 0"
                      :color="open ? 'darkBlue' : ''"
                    >
                      {{ open ? "mdi-folder-open" : "mdi-folder" }}
                    </v-icon>
                    <v-icon v-else>mdi-file</v-icon>
                  </template>
                </v-treeview>
              </v-slide-y-transition>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col md="9">
        <v-row class="pb-1" dense>
          <v-col md="3">
            <BaseInput
              :label="$t('upper_group_code')"
              v-model="txtUpperGroupCode"
              readonly
            />
          </v-col>
          <v-col md="3"> </v-col>
          <v-col md="6">
            <div class="d-flex justify-start">
              <BaseButton
                icon_type="reset"
                :btn_text="$t('reset')"
                :disabled="isProcessing"
                @onclick="onClick('reset')"
              />
              <BaseButton
                icon_type="new"
                :btn_text="$t('new')"
                :disabled="isProcessing"
                @onclick="onClick('new')"
              />
              <BaseButton
                icon_type="new"
                :btn_text="$t('newSub')"
                :disabled="isProcessing"
                @onclick="onClick('newSub')"
              />
              <BaseButton
                icon_type="delete"
                :btn_text="$t('delete')"
                :disabled="isProcessing"
                @onclick="onClick('deleteGrdS')"
              />
              <BaseButton
                icon_type="save"
                :btn_text="$t('save')"
                :disabled="isProcessing"
                @onclick="onClick('saveGrdS')"
              />
              <BaseButton
                icon_type="print"
                :btn_text="$t('print')"
                :disabled="isProcessing"
                @onclick="onClick('print')"
              />
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-1" dense>
          <v-col md="3">
            <BaseInput :label="$t('group_code')" v-model="txtGroupCodeD" />
          </v-col>
          <v-col md="3">
            <BaseInput :label="$t('group_name')" v-model="txtGroupNameD" />
          </v-col>
          <v-col md="2">
            <BaseInput :label="$t('seq')" v-model="txtSeqD" />
          </v-col>
          <v-col md="1">
            <BaseCheckbox
              :label="$t('use_yn')"
              v-model="chkUseYN"
              true-value="Y"
              false-value="N"
            />
          </v-col>
        </v-row>
        <v-row class="pb-1" dense>
          <v-col md="2">
            <b> WareHouse Mapping </b>
          </v-col>
          <v-col md="7"> </v-col>
          <v-col md="3">
            <div class="d-flex justify-start">
              <BaseButton
                icon_type="delete"
                :btn_text="$t('delete')"
                :disabled="isProcessing"
                @onclick="onClick('deleteGrdD')"
              />
              <BaseButton
                icon_type="undelete"
                :btn_text="$t('undelete')"
                :disabled="isProcessing"
                @onclick="onClick('undeleteGrdD')"
              />
              <BaseButton
                icon_type="save"
                :btn_text="$t('save')"
                :disabled="isProcessing"
                @onclick="onClick('saveGrdD')"
              />
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-1" dense>
          <BaseGridView
            column-resizing-mode="widget"
            ref="grdViewD"
            :setting="true"
            :multiselect="true"
            :height="limitHeightGrdViewD"
            :header="headerGrdViewD"
            sel_procedure="LG_SEL_8050060_MAPPING"
            :filter_paras="[this.txtPKGridS]"
            upd_procedure="LG_UPD_8050060_MAPPING"
            :update_paras="[
              'PK',
              'TLG_WH_GROUP_PK',
              'CODE_TYPE',
              'NAME_TYPE',
              'TLG_IN_WAREHOUSE_PK',
              'WH_ID',
              'WH_NAME',
              'P_PK',
              'TREE_TYPE',
              'CRT_BY',
            ]"
          >
          </BaseGridView>
        </v-row>
        <v-row class="pb-1" dense>
          <v-col md="3">
            <BaseInput
              :label="$t('w_h')"
              v-model="txtWH"
              @keyPressEnter="onClick('searchWH')"
            />
          </v-col>
          <v-col md="1">
            <BaseCheckbox
              :label="$t('in_use')"
              v-model="chkInUseYN"
              true-value="Y"
              false-value="N"
            />
          </v-col>
          <v-col md="3">
            <BaseSelect
              :label="$t('mapped_group')"
              v-model="itemMappedGrp"
              :lstData="lstMappedGrp"
              item-text="NAME"
              item-value="VAL"
              :text_all="$t('all')"
            />
          </v-col>
          <v-col md="1">
            <div class="d-flex justify-start">
              <BaseButton
                icon_type="search"
                :btn_text="$t('search_wh')"
                :disabled="isProcessing"
                @onclick="onClick('searchGrdWH')"
              />
            </div>
          </v-col>
          <v-col md="2"> </v-col>
          <v-col md="2">
            <b>List WareHouse</b>
          </v-col>
        </v-row>
        <v-row dense>
          <BaseGridView
            column-resizing-mode="widget"
            ref="grdViewWH"
            :setting="true"
            :multiselect="true"
            :height="limitHeightGrdViewWH"
            :header="headerGrdViewWH"
            sel_procedure="LG_SEL_8050060_ALLWH"
            :filter_paras="[
              '',
              this.txtWH,
              this.chkInUseYN,
              this.itemMappedGrp,
            ]"
            @cellDblClick="cellDblClickWH"
          >
          </BaseGridView>
        </v-row>
      </v-col>
    </v-row>
    <confirm-dialog
      ref="confirmDialog"
      @onConfirm="onClick('AgreeDel')"
    ></confirm-dialog>
  </v-container>
</template>

<script>
import listToTree from "list-to-tree-lite";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";

export default {
  layout: "default",
  middleware: "user",
  props: ["paras"],

  components: {
    ConfirmDialog,
  },

  data: () => ({
    txtGroupCodeS: "",
    txtUpperGroupCode: "",
    txtGroupCodeD: "",
    txtGroupNameD: "",
    txtSeqD: "",
    chkUseYN: "N",
    headerGrdViewD: [],
    txtPKGridS: "",
    txtWH: "",
    chkInUseYN: "Y",
    lstMappedGrp: [
      {
        NAME: "Yes",
        VAL: "Y",
      },
      {
        NAME: "No",
        VAL: "N",
      },
    ],
    itemMappedGrp: "",
    //
    menuList: [],
    isRendering: false,
    active: [],
    selectedMenu: "",
    checkStatusChoose: 0,
    showTree: false,
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
  },

  watch: {},

  mounted() {
    this.getMenuList();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrdViewD() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.27;
      } else {
        return this.windowHeight * 0.35;
      }
    },
    limitHeightGrdViewWH() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.27;
      } else {
        return this.windowHeight * 0.36;
      }
    },
    limitHeightLeft() {
      return this.windowHeight - 150;
    },
  },

  methods: {
    cellDblClickWH(cell) {
      if (this.txtPKGridS > 0) {
        this.$refs.grdViewD.addRowStruct({
          PK: "",
          TLG_WH_GROUP_PK: "",
          CODE_TYPE: cell.data.WH_ID,
          NAME_TYPE: cell.data.WH_NAME,
          TLG_IN_WAREHOUSE_PK: cell.data.PK,
          WH_ID: cell.data.WH_ID,
          WH_NAME: cell.data.WH_NAME,
          P_PK: this.txtPKGridS,
          TREE_TYPE: "I",
          CRT_BY: this.user.USER_ID,
        });
      } else {
        this.showNotification("warning", this.$t("no_group_choose"));
      }
    },

    cellClickD(data) {},

    async onClick(action) {
      switch (action) {
        case "reset":
          this.initInput();
          this.checkStatusChoose = 0;
          break;
        case "new":
          if (this.checkStatusChoose == 1) {
            this.showNotification("warning", this.$t("new_created"));
          } else {
            this.initInput();
            this.checkStatusChoose = 1;
          }
          break;
        case "newSub":
          if (this.checkStatusChoose == 3) {
            this.showNotification("warning", this.$t("new_sub_created"));
          } else {
            if (this.txtGroupCodeD.length > 0) {
              this.checkStatusChoose = 3;
              this.txtUpperGroupCode = this.txtGroupCodeD;
              this.txtGroupCodeD = "";
              this.txtGroupNameD = "";
              this.chkUseYN = "N";
              this.$refs.grdViewD.Clear();
            } else {
              this.showNotification("warning", this.$t("parent_code_null"));
            }
          }
          break;
        case "deleteGrdS":
          this.$refs.confirmDialog.showConfirm(
            this.$t("do_you_want_to_delete")
          );
          break;
        case "AgreeDel":
          const rowStatus2 = "d";
          const dsoSaveGrdS2 = {
            type: "control",
            selpro: "LG_SEL_8050060_SEARCHTREE",
            updpro: "LG_UPD_8050060",
            para: [""],
            elname: [
              "_rowstatus",
              "TLG_WH_GROUP_PK",
              "P_PK",
              "U_CODE_TYPE",
              "CODE_TYPE",
              "TAC_ABPL_PK",
              "NAME_TYPE",
              "SEQ",
              "USE_YN",
              "TREE_TYPE",
              "CRT_BY",
            ],
            data: {
              _rowstatus: rowStatus2,
              TLG_WH_GROUP_PK: this.txtPKGridS,
              P_PK: "",
              U_CODE_TYPE: "",
              CODE_TYPE: this.txtGroupCodeD,
              TAC_ABPL_PK: "",
              NAME_TYPE: this.txtGroupNameD,
              SEQ: "",
              USE_YN: this.chkUseYN,
              TREE_TYPE: "M",
              CRT_BY: this.user.USER_ID,
            },
          };
          const resSaveGrdS2 = await this._dsoCall(
            dsoSaveGrdS2,
            "delete",
            false
          );
          if (resSaveGrdS2 != null) {
            this.showNotification("success", this.$t("delete_success"));
            this.getMenuList();
          }
          break;
        case "deleteGrdD":
          this.$refs.grdViewD.deleteRows();
          break;
        case "undeleteGrdD":
          this.$refs.grdViewD.unDeleteRows();
          break;
        case "saveGrdS":
          if (this.checkStatusChoose == 1) {
            let rowStatus = "i";
            const dsoSaveGrdS = {
              type: "control",
              selpro: "LG_SEL_8050060_SEARCHTREE",
              updpro: "LG_UPD_8050060",
              para: [""],
              elname: [
                "_rowstatus",
                "TLG_WH_GROUP_PK",
                "P_PK",
                "U_CODE_TYPE",
                "CODE_TYPE",
                "TAC_ABPL_PK",
                "NAME_TYPE",
                "SEQ",
                "USE_YN",
                "TREE_TYPE",
                "CRT_BY",
              ],
              data: {
                _rowstatus: rowStatus,
                TLG_WH_GROUP_PK: "",
                P_PK: "",
                U_CODE_TYPE: "",
                CODE_TYPE: this.txtGroupCodeD,
                TAC_ABPL_PK: "",
                NAME_TYPE: this.txtGroupNameD,
                SEQ: this.txtSeqD,
                USE_YN: this.chkUseYN,
                TREE_TYPE: "M",
                CRT_BY: this.user.USER_ID,
              },
            };
            const resSaveGrdS = await this._dsoCall(
              dsoSaveGrdS,
              "insert",
              false
            );
            if (resSaveGrdS != null) {
              this.showNotification("success", this.$t("insert_success"));
              this.initInput();
              this.getMenuList();
            }
          }
          if (this.checkStatusChoose == 2) {
            let rowStatus = "u";
            const dsoSaveGrdS = {
              type: "control",
              selpro: "LG_SEL_8050060_SEARCHTREE",
              updpro: "LG_UPD_8050060",
              para: [""],
              elname: [
                "_rowstatus",
                "TLG_WH_GROUP_PK",
                "P_PK",
                "U_CODE_TYPE",
                "CODE_TYPE",
                "TAC_ABPL_PK",
                "NAME_TYPE",
                "SEQ",
                "USE_YN",
                "TREE_TYPE",
                "CRT_BY",
              ],
              data: {
                _rowstatus: rowStatus,
                TLG_WH_GROUP_PK: this.txtPKGridS,
                P_PK: "",
                U_CODE_TYPE: "",
                CODE_TYPE: this.txtGroupCodeD,
                TAC_ABPL_PK: "",
                NAME_TYPE: this.txtGroupNameD,
                SEQ: this.txtSeqD,
                USE_YN: this.chkUseYN,
                TREE_TYPE: "M",
                CRT_BY: this.user.USER_ID,
              },
            };
            const resSaveGrdS = await this._dsoCall(
              dsoSaveGrdS,
              "update",
              false
            );
            if (resSaveGrdS != null) {
              this.showNotification("success", this.$t("update_success"));
              this.initInput();
              this.getMenuList();
            }
          }
          if (this.checkStatusChoose == 3) {
            let rowStatus = "i";
            const dsoSaveGrdS = {
              type: "control",
              selpro: "LG_SEL_8050060_SEARCHTREE",
              updpro: "LG_UPD_8050060",
              para: [""],
              elname: [
                "_rowstatus",
                "TLG_WH_GROUP_PK",
                "P_PK",
                "U_CODE_TYPE",
                "CODE_TYPE",
                "TAC_ABPL_PK",
                "NAME_TYPE",
                "SEQ",
                "USE_YN",
                "TREE_TYPE",
                "CRT_BY",
              ],
              data: {
                _rowstatus: rowStatus,
                TLG_WH_GROUP_PK: "",
                P_PK: this.txtPKGridS,
                U_CODE_TYPE: this.txtUpperGroupCode,
                CODE_TYPE: this.txtGroupCodeD,
                TAC_ABPL_PK: "",
                NAME_TYPE: this.txtGroupNameD,
                SEQ: "",
                USE_YN: this.chkUseYN,
                TREE_TYPE: "I",
                CRT_BY: this.user.USER_ID,
              },
            };
            const resSaveGrdS = await this._dsoCall(
              dsoSaveGrdS,
              "insert",
              false
            );

            if (resSaveGrdS != null) {
              this.showNotification("success", this.$t("insert_success"));
              this.initInput();
              this.getMenuList();
            }
          }
          if (this.checkStatusChoose == 4) {
            let rowStatus = "u";
            const dsoSaveGrdS = {
              type: "control",
              selpro: "LG_SEL_8050060_SEARCHTREE",
              updpro: "LG_UPD_8050060",
              para: [""],
              elname: [
                "_rowstatus",
                "TLG_WH_GROUP_PK",
                "P_PK",
                "U_CODE_TYPE",
                "CODE_TYPE",
                "TAC_ABPL_PK",
                "NAME_TYPE",
                "SEQ",
                "USE_YN",
                "TREE_TYPE",
                "CRT_BY",
              ],
              data: {
                _rowstatus: rowStatus,
                TLG_WH_GROUP_PK: this.txtPKGridS,
                P_PK: "",
                U_CODE_TYPE: this.txtUpperGroupCode,
                CODE_TYPE: this.txtGroupCodeD,
                TAC_ABPL_PK: "",
                NAME_TYPE: this.txtGroupNameD,
                SEQ: "",
                USE_YN: this.chkUseYN,
                TREE_TYPE: "I",
                CRT_BY: this.user.USER_ID,
              },
            };
            const resSaveGrdS = await this._dsoCall(
              dsoSaveGrdS,
              "update",
              false
            );
            if (resSaveGrdS != null) {
              this.showNotification("success", this.$t("update_success"));
              this.initInput();
              this.getMenuList();
            }
          }
          if (
            this.checkStatusChoose != 4 &&
            this.checkStatusChoose != 3 &&
            this.checkStatusChoose != 2 &&
            this.checkStatusChoose != 1
          ) {
            this.showNotification("warning", this.$t("no_action_choose"));
          }
          break;
        case "saveGrdD":
          this.$refs.grdViewD.saveData();
          setTimeout(() => {
            this.getMenuList();
          }, 400);
          break;
        case "print":
          // this.$refs.grdViewWH.loadData();
          break;
        case "searchGrdS":
          try {
            this.isRendering = true;
            const dsoMenu = {
              type: "list",
              selpro: "LG_SEL_8050060_SEARCHTREE",
              para: [this.txtGroupCodeS],
            };
            const resMenu = await this._dsoCall(dsoMenu, "select", false);
            if (resMenu) {
              const filteredMenu = listToTree(resMenu, {
                idKey: "PK",
                parentKey: "P_PK",
                childrenKey: "childMenu",
              });
              this.menuList = [...filteredMenu];
            } else {
              this.menuList = [];
              this.showNotification(
                "danger",
                this.$t("error_occurs", "common"),
                "message"
              );
            }
          } catch (e) {
            this.showNotification(
              "danger",
              this.$t("error_occurs", "common"),
              e.message
            );
          } finally {
            this.isRendering = false;
          }
          break;
        case "searchGrdWH":
          this.$refs.grdViewWH.loadData();
          break;
      }
    },

    async getSelectedMenu2(event, data) {
      // this.data.PK = data.PK;
      // this.P_PK = data.PK;
      // this.UPPER_ORG = data.CODE_TYPE;
      // this.P_PK_N = data.P_PK;
      // this.UPPER_ORG_N = data.NAME_TYPE;
      // this.getOrgInfo();
    },

    async getSelectedMenu(data) {
      let tmpPK = "";
      if (data.length > 0) {
        tmpPK = data[0].PK;
      }
      const dsoInfoD = {
        type: "list",
        selpro: "LG_SEL_8050060",
        para: [tmpPK],
      };
      const resInfoD = await this._dsoCall(dsoInfoD, "select", false);
      if (resInfoD) {
        this.txtUpperGroupCode = resInfoD[0].PAC_CD;
        this.txtGroupCodeD = resInfoD[0].CODE_TYPE;
        this.txtGroupNameD = resInfoD[0].NAME_TYPE;
        this.txtSeqD = resInfoD[0].SEQ;
        this.chkUseYN = resInfoD[0].USE_YN;
        // this.txtPKGridS = resInfoD[0].PK;
        if (resInfoD[0].P_PK == null) {
          this.checkStatusChoose = 2;
        } else {
          this.checkStatusChoose = 4;
        }
      }
      if (!this.active.length) {
        this.selectedMenu = "";
      } else {
        this.selectedMenu = {
          ...this.active[0],
        };
        this.txtPKGridS = this.selectedMenu.PK;
        this.$refs.grdViewD.loadData();
      }
      this.$refs.grdViewWH.loadData();
    },

    async getMenuList() {
      try {
        this.isRendering = true;
        const dsoMenu = {
          type: "list",
          selpro: "LG_SEL_8050060_SEARCHTREE",
          para: [this.txtGroupCodeS],
        };
        const resMenu = await this._dsoCall(dsoMenu, "select", false);
        if (resMenu.length > 0) {
          const filteredMenu = listToTree(resMenu, {
            idKey: "PK",
            parentKey: "P_PK",
            childrenKey: "childMenu",
          });
          this.menuList = [...filteredMenu];
          this.showTree = true;
        } else {
          this.menuList = [];
          this.showNotification("warning", this.$t("no_group_tree"));
          this.showTree = false;
        }
      } catch (e) {
        this.showNotification(
          "danger",
          this.$t("err_get_group_tree"),
          e.message
        );
      } finally {
        this.isRendering = false;
      }
    },

    async getDataList() {},

    initInput() {
      this.txtPKGridS = "";
      this.txtUpperGroupCode = "";
      this.txtGroupCodeD = "";
      this.txtGroupNameD = "";
      this.txtSeqD = "";
      this.chkUseYN = "N";
      this.$refs.grdViewD.Clear();
    },

    initHeader() {
      this.headerGrdViewD = [
        {
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "TLG_WH_GROUP_PK",
          caption: this.$t("tlg_wh_group_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "CODE_TYPE",
          caption: this.$t("code_type"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "NAME_TYPE",
          caption: this.$t("name_type"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "TLG_IN_WAREHOUSE_PK",
          caption: this.$t("tlg_in_warehouse_pk"),
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
          dataField: "P_PK",
          caption: this.$t("p_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "TREE_TYPE",
          caption: this.$t("tree_type"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
      ];
      this.headerGrdViewWH = [
        {
          dataField: "LEVEL",
          caption: this.$t("level"),
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
          dataField: "TLG_IN_STORAGE_PK",
          caption: this.$t("tlg_in_storage_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "SOURCE_WH_ID",
          caption: this.$t("source_wh_id"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "SOURCE_WH_PK",
          caption: this.$t("source_wh_pk"),
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
          dataField: "PARENT_CODE",
          caption: this.$t("parent_code"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "PL_PK",
          caption: this.$t("pl_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PL_NAME",
          caption: this.$t("pl_name"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "WH_TYPE",
          caption: this.$t("wh_type"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "MATERIAL_YN",
          caption: this.$t("material_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "PRODUCT_YN",
          caption: this.$t("product_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "ACC_YN",
          caption: this.$t("acc_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "CHECK_QTY_YN",
          caption: this.$t("check_qty_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "CHECK_REF_QTY_YN",
          caption: this.$t("check_ref_qty_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "ROW_LOC",
          caption: this.$t("row_loc"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "COL_LOC",
          caption: this.$t("col_loc"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "NUM_OF_ROW",
          caption: this.$t("num_of_row"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "NUM_OF_COL",
          caption: this.$t("num_of_col"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("remark"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "USE_YN",
          caption: this.$t("use_yn"),
          dataType: "checkbox",
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "TLG_PO_DEPT_PK",
          caption: this.$t("tlg_po_dept_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "DEPT_NAME",
          caption: this.$t("dept_name"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "PARENT_PK",
          caption: this.$t("parent_pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
      ];
      let abc = {
        dataField: "SEQ",
        caption: this.$t("seq"),
        dataType: "date", // checkbox,
        width: 120,
        allowEditing: false,
        hidden: false,
        lookup: {
          dataSource: this.lstMainACCYN,
          displayExpr: "NAME",
          valueExpr: "VAL",
        },
      };
    },
  },
};
</script>

<style>
</style>
