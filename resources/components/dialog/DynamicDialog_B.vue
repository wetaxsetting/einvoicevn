<template>
  <v-dialog id="dynamic-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ dialogTitle }}</span>
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
                      <v-col lg="2" sm="5" cols="12">
                        <!-- <BaseSelect
                          dense
                          hide-details
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('company')"
                          :lstData="companyList"
                          v-model="selectedCompany"
                          @change="onSearch"
                        ></BaseSelect> -->
                        <BaseSelect outlined :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" @change="onSearch" />

                      </v-col>
                      <v-col lg="2" sm="5" cols="12" v-if="from_date">
                        <BaseDatePicker
                          :label="$t('from')"
                          :inputValue="from_date"
                          @returnValue="from_date = $event"
                        ></BaseDatePicker>
                      </v-col>
                      <v-col lg="2" sm="5" cols="12" v-if="from_date">
                        <BaseDatePicker
                          :label="$t('to')"
                          @returnValue="to_date = $event"
                        ></BaseDatePicker>
                      </v-col>
                      <v-col lg="2" sm="5" cols="12" v-if="listLabel">
                        <!-- <BaseSelect
                          dense
                          clearable
                          hide-details
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t(listLabel)"
                          :lstData="listData"
                          v-model="selectedListData"
                        ></BaseSelect> -->

                        <BaseSelect outlined :label="$t('company')" v-model="selectedListData" :lstData="listData" item-text="TEXT" item-value="PK"  />

                      </v-col>

                      <v-col lg="2" sm="3" cols="12">
                        <!-- <BaseInput
                          clearable
                          dense
                          hide-details
                          :label="codeLabel"
                          @keypress.enter="onSearch"
                          v-model="txtCode"
                        ></BaseInput> -->
                        <BaseInput outlined @keypress.enter="onSearch" :label="codeLabel" v-model="txtCode" />

                      </v-col>
                      <v-col lg="2" sm="3" cols="10">
                        <!-- <BaseInput
                          clearable
                          dense
                          hide-details
                          :label="nameLabel"
                          @keypress.enter="onSearch"
                          v-model="txtName"
                        ></BaseInput> -->

                        <BaseInput outlined @keypress.enter="onSearch" :label="nameLabel" v-model="txtName" />

                      </v-col>
                      <v-col lg="2" sm="3" cols="3" class="d-flex justify-end">
                        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
                        <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onSelectMultiple" />

                        <!-- <div class="d-flex">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                tile
                                :color="currentTheme"
                                :disabled="isProcessing"
                                @click="onSearch"
                                v-on="on"
                              >
                                <v-icon>mdi-magnify</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("search") }}</span>
                          </v-tooltip>
                          <div v-show="multiSelectMode == true">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  icon
                                  tile
                                  color="success"
                                  :disabled="isProcessing"
                                  @click="onSelectMultiple"
                                  v-on="on"
                                >
                                  <v-icon>mdi-check-bold</v-icon>
                                </v-btn>
                              </template>
                              <span>{{ $t("select") }}</span>
                            </v-tooltip>
                          </div>
                        </div> -->

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
                  <BaseGridView
                    ref="grdView"
                    :header="defaultHeader"
                    :sel_procedure="procedure"
                    :select_mode="selectMode"
                    :selection_mode="selection_mode"
                    :filter_paras="searchParas"
                    :is_allow_paste="false"
                    :autocheckbox="autocheckbox"
                    :max_height="limitHeight"
                    @cellDblClick="onSelectSingle"
                    :selectionmode="selectionmode"
                    @onSelectionChanged="onGridSelectionChanged"
                    :multiselect="true"
                    :headertype="1"
                    :showaggregatestop="showaggregatestop"
                  />
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
  name: "dynamic-dialog",
  props: {
    header: {
      type: Array,
    },
    autoSearch: {
      type: Boolean,
      default: false,
    },
    from_date: {
      type: String,
    },
    to_date: {
      type: String,
    },
    procedure: {
      type: String,
    },
    selectionmode: {
      type: String,
    },
    moreParas: {
      type: Array,
    },
    listLabel: {
      type: String,
    },
    listData: {
      type: Array,
    },
    codeLabel: {
      type: String,
    },
    nameLabel: {
      type: String,
    },
    dialogTitle: {
      type: String,
    },
    multiSelectMode: {
      type: Boolean,
      default: false,
    },
    companyPK: {
      type: Number,
      default: 0,
    },
    dialogKey: {
      type: Number,
      default: -1,
    },
    showaggregatestop: {
      type: Boolean,
      default: false,
    },
    autocheckbox: {
      type: Boolean,
      default: false,
    },
    selection_mode: {
      type: String,
      default: "singlecell",
    },
  },
  components: {
    DataGridView: () => import("@/components/control/DataGridView"),
    datePicker: () => import("@/components/control/DatePicker"),
  },
  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    searchParas: [],
    selectMode: "",
    companyList: [],
    selectedCompany: "",
    selectedListData: "",
    txtCode: "",
    txtName: "",
  }),

  created() {
    this.selectedCompany =
      this.companyPK == 0 ? this.user.TCO_COMPANY_PK : this.companyPK;
    this.getCompanyList();
  },

  computed: {
    defaultHeader() {
      if (this.header) return this.header;
      return [
        {
          dataField: "CODE",
          caption: this.$t("code"),
          width: "150",
        },
        {
          dataField: "NAME",
          caption: this.$t("name"),
          width: "300",
        },
      ];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) return this.windowHeight - 320;
    },
  },

  watch: {
    multiSelectMode: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectMode = "Multiple";
        } else {
          this.selectMode = "Single";
        }
      },
    },
    dialogIsShow(val) {
      if (val === true) {
        this.selectedCompany =
          this.companyPK == 0 ? this.user.TCO_COMPANY_PK : this.companyPK;
        if (this.autoSearch) {
          setTimeout(() => {
            this.onSearch();
          }, 200);
        }
      }
    },
  },
  methods: {
    async getCompanyList() {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: [this.user.PK],
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.companyList = result;
      } else {
        this.companyList = [];
      }
    },
    async onSearch() {
      if (!this.dialogIsShow) return;

      if (this.from_date && this.listData && this.listData.length > 0) {
        this.searchParas = [
          this.selectedCompany,
          this.txtCode ? this.txtCode : "",
          this.txtName ? this.txtName : "",
          this.from_date,
          this.to_date,
          this.selectedListData,
        ];
      } else if (this.from_date) {
        this.searchParas = [
          this.selectedCompany,
          this.txtCode ? this.txtCode : "",
          this.txtName ? this.txtName : "",
          this.from_date,
          this.to_date,
        ];
      } else if (this.listData && this.listData.length > 0) {
        this.searchParas = [
          this.selectedCompany,
          this.txtCode ? this.txtCode : "",
          this.txtName ? this.txtName : "",
          this.selectedListData,
        ];
      } else {
        this.searchParas = [
          this.selectedCompany,
          this.txtCode ? this.txtCode : "",
          this.txtName ? this.txtName : "",
        ];
      }

      if (this.moreParas) {
        this.searchParas = this.searchParas.concat(this.moreParas);
      }
      this.$refs.grdView.loadData();
    },

    onGridSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      //this.returnData(data);
      this.onSelectMultiple();
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnData(rtn_data);
    },

    returnData(datas) {
      this.$emit("returnData", datas, this.dialogKey);
      this.dialogIsShow = false;
    },
  },
};
</script>
