<template>
<v-container fluid v-resize="onResize" class="pa-2">
  <v-dialog max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("account_code") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pa-2" v-resize="onResize">
        <v-row dense>
          <v-col md="3"> </v-col>
          <v-col md="4">
            <BaseInput :label="$t('account')" v-model="txtAccountCodeName" @keyPressEnter="onClick('search')" />
          </v-col>
          <v-col md="2"> </v-col>
          <v-col md="3">
            <div class="d-flex justity-center">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
              <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick('delete')" />
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <BaseGridView column-resizing-mode="widget" ref="grdView" :setting="true" :multiselect="true" :height="limitHeightGrd" :header="headerGrdView" sel_procedure="LG_SEL_8040070_POPUP_1" :filter_paras="[this.txtAccountCodeName]" @cellDblClick="onDblClickCell">
          </BaseGridView>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</v-container>
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
    txtAccountCodeName: "",
    headerGrdView: [],
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

  props() {},

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrd() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.83;
      }
    },
  },

  methods: {
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
        case "delete":
          let _data = [{
            PK: "",
            AC_CD: "",
            AC_NM: "",
          }, ];
          this.$emit("callBackData", _data);
          this.dialogIsShow = false;
          break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerGrdView = [{
          dataField: "PK",
          caption: this.$t("pk"),
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
      ];
      //  {
      //     dataField: "SEQ",
      //     caption: this.$t("seq"),
      //     dataType: "date",
      //     width: 120,
      //     allowEditing: false,
      //     hidden: true,
      //     lookup: {
      //       dataSource: this.lstST,
      //       displayExpr: "NAME",
      //       valueExpr: "CODE",
      //     },
      //     formatFloat: 2,
      //     dataType: "number",
      //   },
    },
  },
};
</script>

<style>
</style>
