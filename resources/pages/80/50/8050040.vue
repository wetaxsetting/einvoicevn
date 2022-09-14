<template>
<v-row no-gutters>
  <v-col md="4" sm="12">
    <v-container fluid class="py-0 my-0">
      <v-row no-gutters>
        <v-col md="12" sm="12">
          <!-- Search Panel -->
          <v-row align="center" justify="center">
            <v-col md="12" sm="12">
              <v-card tile>
                <v-container fluid class="py-0 my-0">
                  <v-row align="center" justify="space-between">
                    <v-col md="12" sm="12">
                      <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('wh_type')" :items="whTypeList" v-model="inputWHType"></v-select>
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="space-between">
                    <v-col md="12" sm="12">
                      <v-text-field clearable dense hide-details :label="$t('wh_name')" v-model="inputWHName"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="space-between">
                    <v-col md="12" sm="12" class="text-right">
                      <v-btn class="btn" tile dark :color="currentTheme" @click="onClick('btnSearch')">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
          <!-- Data Table -->
          <v-row align="center" justify="center">
            <v-col md="12" sm="12" class="p-5">
              <v-card tile v-resize="onResize">
                <DxDataGrid column-resizing-mode="widget" ref="whMasterDataGrid" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="whMasterList" :height="limitHeightMaster" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="selectionChangedMaster">
                  <DxColumn data-field="WH_ID" :caption="$t('wh_id')"></DxColumn>
                  <DxColumn data-field="WH_NAME" :caption="$t('wh_name')"></DxColumn>
                  <DxColumn data-field="STRG_NAME" :caption="$t('wh_type')"></DxColumn>
                  <DxSelection mode="single" show-check-boxes-mode="none" />
                </DxDataGrid>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-col>

  <v-col md="8" sm="12">
    <v-container fluid class="py-0 my-0">
      <v-row no-gutters>
        <v-col md="12" sm="12">
          <!-- Search Panel -->
          <v-row align="center" justify="center">
            <v-col md="12" sm="12">
              <v-card tile>
                <v-container fluid class="py-0 my-0">
                  <v-row align="center" justify="center">
                    <v-col md="8" sm="12">
                      <span class="red--text lighten-1">{{warehouse}}</span>
                    </v-col>
                    <v-col md="4" sm="12" class="text-right">
                      <v-btn icon tile color="success" :disabled="isProcessing" @click="onClick('btnAddNew')">
                        <v-icon>mdi-plus-thick</v-icon>
                      </v-btn>
                      <v-btn icon tile color="error" :disabled="isProcessing" @click="onClick('btnDelete')">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClick('btnSave')">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
          <!-- Data Table -->
          <v-row align="center" justify="center">
            <v-col md="12" sm="12">
              <v-card tile v-resize="onResize">
                <DxDataGrid column-resizing-mode="widget" ref="whDetailDataGrid" :allow-column-resizing="true" :cache-enabled="false" :data-source="whDetailList" :height="limitHeightDetail" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @init-new-row="initNewRow" @row-inserted="rowInserted" @row-updated="checkUpdated" @selection-changed="selectionChangedDetail">
                  <DxColumn data-field="LOC_ID" :caption="$t('loc_id')"></DxColumn>
                  <DxColumn data-field="LOC_NAME" :caption="$t('loc_name')"></DxColumn>
                  <DxColumn data-field="ROW_NO" :caption="$t('row_no')"></DxColumn>
                  <DxColumn data-field="STAIR_NO" :caption="$t('stair_no')"></DxColumn>
                  <DxColumn data-field="LOC_ID_MAP" :caption="$t('loc_id_map')"></DxColumn>
                  <DxColumn data-field="STORE_QTY" :caption="$t('store_qty')"></DxColumn>
                  <DxColumn data-field="USE_YN" :caption="$t('use_yn')" cell-template="active-yn-template"></DxColumn>
                  <DxColumn data-field="LOC_TYPE" :caption="$t('loc_type')">
                    <DxLookup display-expr="CODEDESC" value-expr="CODEKEY" :data-source="lstLocIdMap" />
                  </DxColumn>
                  <DxColumn data-field="DESCRIPTION" :caption="$t('description')"></DxColumn>
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" :confirmDelete="false" />

                  <template #active-yn-template="{ data }">
                    <input type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event, data.column.dataField, data.data)" />
                  </template>
                  <DxKeyboardNavigation :edit-on-key-press="true" />
                </DxDataGrid>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</v-row>
</template>

<script>
import CellGridTextField from "@/components/table/CellGridTextField";
import CellGridSelect from "@/components/table/CellGridSelect";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import CellGridDatePicker from "@/components/table/CellGridDatePicker";

export default {
  components: {
    CellGridTextField,
    CellGridSelect,
    CellGridCheckbox,
    CellGridDatePicker,
  },

  data: () => ({
    lstLocIdMap: [],
    inputWHType: null,
    inputWHName: "",
    whTypeList: [],
    selectedItemDataMaster: [],
    selectedItemDataDetail: [],
    warehouse: null,
    whMasterList: [],
    whDetailList: [],
  }),

  computed: {
    limitHeightMaster() {
      return this.windowHeight - 353;
    },
    limitHeightDetail() {
      return this.windowHeight - 232;
    },
  },

  methods: {
    onClick(obj) {
      switch (obj) {
        case "btnSearch":
          this.$refs.whMasterDataGrid.instance.deselectAll();
          this.getWHMasterList([
            this.inputWHType ? this.inputWHType : "",
            this.inputWHName ? this.inputWHName : "",
          ]);
          this.refreshDetail();
          break;
        case "btnAddNew":
          if (this.selectedItemDataMaster[0].PK) {
            this.$refs.whDetailDataGrid.instance.addRow();
          }
          break;

        case "btnDelete":
          if (!this.selectedItemDataDetail.length) {
            this.whDetailList.forEach((item, index) => {
              if (item._rowstatus === "d") {
                item._rowstatus = "";
                this.setMarkedDeleteRowColor(false, index);
              }
            });
          } else {
            for (let i = this.whDetailList.length - 1; i >= 0; i--) {
              const row = this.whDetailList[i];
              for (
                let j = this.selectedItemDataDetail.length - 1; j >= 0; j--
              ) {
                const item = this.selectedItemDataDetail[j];
                if (item.PK === row.PK) {
                  if (row._rowstatus !== "d") {
                    if (row._rowstatus === "i") {
                      this.$refs.whDetailDataGrid.instance.deleteRow(
                        this.$refs.whDetailDataGrid.instance.getRowIndexByKey(
                          item
                        )
                      );
                    } else {
                      row._rowstatus = "d";
                      this.setMarkedDeleteRowColor(true, i);
                    }
                  } else {
                    row._rowstatus = "";
                    this.setMarkedDeleteRowColor(false, i);
                  }
                }
              }
            }
          }
          this.$refs.whDetailDataGrid.instance.refresh();
          break;
        case "btnSave":
          this.save("update");
          break;
      }
    },

    getWH() {
      this.$axios
        .$post("dso/callproc", {
          proc: "SYS_SEL_IN_STORAGE",
          para: ["TEMP"],
        })
        .then((res) => {
          if (res.data && res.data.p_rtn_cur.length) {
            this.whTypeList = res.data.p_rtn_cur;
          }
        });
    },

    refreshDetail() {
      this.whDetailList = [];
      this.warehouse = null;
    },

    changeValue(value, key, pk, isModified) {
      this.dataList.map((item, index) => {
        if (item.PK === pk) {
          this.$set(item, key, value);
          if (isModified && item.PK && item._rowstatus != "i") {
            item._rowstatus = "u";
          }
        }
      });
    },

    setMarkedDeleteRowColor(isMarked, idx) {
      const element = this.$refs.whDetailDataGrid.instance.getRowElement(idx);
      if (element) {
        if (isMarked) {
          // element[0].classList.add('mark-delete')
          element[0].style.background = "#ff5252";
          element[0].style.color = "#fff";
        } else {
          // element[0].classList.remove('mark-delete')
          element[0].style.background = "";
          element[0].style.color = "";
        }
      }
    },

    getRowPK() {
      return new Date().getTime().toString();
    },

    async save(_action) {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8050040_D",
        para: [this.selectedItemDataMaster[0].PK],
        updpro: "LG_UPD_8050040_D",
        elname: [
          "_rowstatus",
          "PK",
          "TLG_IN_WH_PK",
          "LOC_ID",
          "LOC_NAME",
          "ROW_NO",
          "STAIR_NO",
          "LOC_ID_MAP",
          "STORE_QTY",
          "USE_YN",
          "LOC_TYPE",
          "DESCRIPTION",
        ],
        data: this.whDetailList,
      };
      this.whDetailList = await this._dsoCall(dso, _action, false);
    },

    async getWHMasterList(params) {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8050040_M",
        para: params,
      };
      this.whMasterList = await this._dsoCall(dso, "select", false);
    },

    valueChanged(e, colName, data) {
      const newValue = e.value ? "Y" : "N";
      this.changeValue(newValue, colName, data.PK, true);
    },

    initNewRow(e) {
      e.data._rowstatus = "i";
      e.data.TLG_IN_WH_PK = this.selectedItemDataMaster[0].PK;
      e.data.USE_YN = "Y";
    },

    rowInserted(e) {
      this.whDetailList.unshift(e.data);
      this.whDetailList.pop();
    },

    checkUpdated(e) {
      if (!e.cancel) {
        if (e.data._rowstatus !== "i") {
          e.data._rowstatus = "u";
        }
      }
    },

    selectionChangedDetail(e) {
      this.selectedItemDataDetail = e.selectedRowsData;
    },

    selectionChangedMaster(e) {
      this.selectedItemDataMaster = e.selectedRowsData;
      //this.getWHDetailList([this.selectedItemDataMaster[0].PK]);
      this.save("select");
      this.warehouse =
        "Warehouse: " +
        this.selectedItemDataMaster[0].WH_ID +
        " - " +
        this.selectedItemDataMaster[0].WH_NAME;
    },
  },

  created() {
    this.getWH();
    this.lstLocIdMap = [{
        CODEKEY: "C",
        CODEDESC: "COM",
      },
      {
        CODEKEY: "A",
        CODEDESC: "ACTUAL",
      },
      {
        CODEKEY: "",
        CODEDESC: "",
      },
    ];
  },
};
</script>
