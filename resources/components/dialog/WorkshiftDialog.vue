<template>
  <v-dialog id="ws-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("workshift infomation", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="4">
                        <v-select dense
                                  cache-items
                                  hide-details
                                  outlined
                                  item-value="PK"
                                  item-text="TEXT"
                                  :label="$t('company', 'common')"
                                  :items="companyList"
                                  v-model="selectedCompany"></v-select>
                      </v-col>

                      <v-col cols="2" class="text-right">
                        <!--<v-btn icon
                               tile
                               :color="currentTheme"
                               :disabled="isProcessing"
                               @click="onSearch">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn icon
                               tile
                               color="success"
                               @click="onSelectMultiple"
                               v-if="multiSelectMode">
                          <v-icon>mdi-check-bold</v-icon>
                        </v-btn>-->
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DxDataGrid ref="WSGrid"
                              column-resizing-mode="widget"
                              key-expr="PK"
                              :allow-column-resizing="true"
                              :column-auto-width="$vuetify.breakpoint.smAndDown"
                              :data-source="dataList"
                              :height="limitHeight"
                              :show-borders="true"
                              :show-column-lines="true"
                              :show-row-lines="true"
                              @selection-changed="onSelectionChanged"
                              :onRowDblClick="onSelectSingle">
                    <DxColumn v-for="(item, index) in defaultHeaders"
                              :data-field="item.field"
                              :caption="item.caption"
                              :key="index"></DxColumn>

                    <DxPaging :page-size="dataList.length" />
                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                    <DxSelection mode="single" v-if="!multiSelectMode" />
                  </DxDataGrid>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "employee-dialog",

    props: {
      headers: {
        type: Array
      },
      multiSelectMode: {
        type: Boolean,
        default: false
      }
    },

    data: () => ({
      dialogIsShow: false,
      dataList: [],
      selectedDatas: [],

      companyList: [],
      selectedCompany: "",

      p_trtype_pk: 0,
    }),

    computed: {
      defaultHeaders() {
        if (this.headers) return this.headers;

        return [
          {
            field: "SHIFT",
            caption: this.$t("shift"),
            width: "90"
          },
          {
            field: "START_TIME",
            caption: this.$t("start"),
            width: "90"
          },
          {
            field: "END_TIME",
            caption: this.$t("end"),
            width: "90"
          },
          {
            field: "START_MEAL1",
            caption: this.$t("start_meal"),
            width: "90"
          },
          {
            field: "END_MEAL1",
            caption: this.$t("end_meal"),
            width: "90"
          },
          {
            field: "DURING_DAY",
            caption: this.$t("during_day"),
            width: "90"
          },
          {
            field: "WT_PLUS",
            caption: this.$t("wt_plus"),
            width: "90"
          },
          {
            field: "START_OT",
            caption: this.$t("start_ot"),
            width: "90"
          },
        ];
      },
      user() {
        return this.$store.getters["auth/user"];
      },
      limitHeight() {
        return this.windowHeight - 320;
      }
    },

    watch: {
      dialogIsShow(val) {
        if (val === true) {
          this.selectedCompany = this.user.TCO_COMPANY_PK;
          this.getCompanyList();
        }
      },

      selectedCompany(val) {
        if (val) this.onSearch();
      },

      p_trtype_pk(val) {
        if (val == null || val == "" || val == undefined) {
          val = 0;
        }
      }
    },

    methods: {
      async getCompanyList() {
        const dso = {
          type: "list",
          selpro: "SYS_SEL_LIST_COMPANY",
          para: [this.user.PK]
        };
        const result = await this._dsoCall(dso, "select", false);
        if (result) {
          this.companyList = result;
        } else {
          this.companyList = [];
        }
      },


      async onSearch() {
        const dso = {
          type: "grid",
          selpro: "SYS_SEL_WS_DIALOG",
          para: [this.selectedCompany, this.p_trtype_pk]
        };
        this.dataList = await this._dsoCall(dso, "select", false);
      },

      onSelectionChanged({ selectedRowsData }) {
        this.selectedDatas = selectedRowsData;
      },

      onSelectSingle({ data }) {
        this.returnWSInfo(this.p_trtype_pk == 0 ? data : [data]);
      },

      onSelectMultiple() {
        let rtn_data = this.multiSelectMode
          ? this.selectedDatas
          : this.selectedDatas[0];
        this.returnWSInfo(rtn_data);
      },

      returnWSInfo(datas) {
        this.$emit("returnWSInfo", datas);
        this.$refs.WSGrid.instance.clearSelection()
        this.dialogIsShow = false;
      }
    }
  };
</script>
