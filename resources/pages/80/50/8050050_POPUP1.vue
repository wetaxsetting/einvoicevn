<template>
  <v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("get_account_code") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pa-2" v-resize="onResize">
        <v-row dense>
          <v-col md="2">
            <BaseInput
              :label="$t('account_code')"
              v-model="txtAccountCode"
              @keyPressEnter="onClick('search')"
            />
          </v-col>
          <v-col md="2">
            <BaseInput
              :label="$t('account_name')"
              v-model="txtAccountName"
              @keyPressEnter="onClick('search')"
            />
          </v-col>
          <v-col md="2">
            <BaseInput
              :label="$t('upper_account_name')"
              v-model="txtUpperAccountCode"
              @keyPressEnter="onClick('search')"
            />
          </v-col>
          <v-col md="2">
            <BaseDatePicker :label="$t('year')" v-model="txtYear" today year />
          </v-col>
          <v-col md="1">
            <div class="d-flex justify-center">
              <BaseButton
                icon_type="search"
                :btn_text="$t('search')"
                :disabled="isProcessing"
                @onclick="onClick('search')"
              />
            </div>
          </v-col>
          <v-col md="1">
            <div class="d-flex justify-center">
              <BaseButton
                icon_type="select"
                :btn_text="$t('select')"
                :disabled="isProcessing"
                @onclick="onClick('select')"
              />
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <BaseGridView
            column-resizing-mode="widget"
            ref="grdView"
            :setting="true"
            :multiselect="true"
            :height="limitHeightGrdView"
            :header="headerGrdView"
            sel_procedure="LG_SEL_8050050_POPUP_1"
            :filter_paras="[
              this.txtAccountCode,
              this.txtAccountName,
              this.txtUpperAccountCode,
              this.para,
              'ENG',
              this.txtYear,
            ]"
            @cellDblClick="onDblClickCell"
            @cellClick="onClickCell"
          >
          </BaseGridView>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",
  props: {
    callBackData: {
      type: Array,
      default: [],
    },
  },

  components: {},

  data: () => ({
    dialogIsShow: false,
    txtAccountCode: "",
    txtAccountName: "",
    txtUpperAccountCode: "",
    txtYear: "",
    itemCell: {},
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
  },

  watch: {
    dialogIsShow(val) {
      if (val) {
        // bi loi delay nen phai setimeout, code chay nhanh nen chua kip load ref cua popup.
        setTimeout(() => {
          this.$refs.grdView.loadData();
        }, 10);
      }
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrdView() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.38;
      } else {
        return this.windowHeight * 0.8;
      }
    },
  },

  methods: {
    onClickCell(cell) {
      this.itemCell = cell.data;
    },
    onDblClickCell(row) {
      let _data = [row.data];
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    onClick(action) {
      switch (action) {
        case "search":
          this.$refs.grdView.loadData();
          break;
        case "select":
          let _data = [this.itemCell];
          this.$emit("callBackData", _data);
          this.dialogIsShow = false;
          break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerGrdView = [
        {
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: false,
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
          dataField: "OAC_NM",
          caption: this.$t("oac_nm"),
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
          dataField: "AC_LEVEL",
          caption: this.$t("ac_level"),
          width: 120,
          allowEditing: false,
          hidden: false,
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
