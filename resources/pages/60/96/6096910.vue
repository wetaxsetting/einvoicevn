<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col lg="6" cols="12">
        <BaseInput outlined :label="$t('data_search')" v-model="data_search" />
      </v-col>
      <v-col lg="6" cols="12" class="text-right d-flex justify-end">
        <BaseButton
          icon_type="search"
          :btn_text="$t('search')"
          :disabled="isProcessing"
          @onclick="onSearch"
        />
      </v-col>
      <v-col cols="12">
        <BaseGridView
          column-resizing-mode="widget"
          ref="grdShop"
          :auto_load="false"
          select_mode="Single"
          :max_height="limitHeight"
          :header="headerGrid"
          sel_procedure="SEL_6096910_SHOP_NC"
          :filter_paras="[this.data_search]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  data: () => ({
    data_search: "",
    headerGrid: [],
  }),

  created() {
    this.initHeaderList();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this._calculateHeight(this.formContainerHeight, 90);
    },
  },

  methods: {
    onSearch() {
      this.$refs.grdShop.loadData();
    },

    initHeaderList() {
      this.headerGrid = [
        {
          dataField: "SID",
          width: 0,
          caption: this.$t("SID"),
        },
        {
          dataField: "COMP_ID",
          caption: this.$t("COMP_ID"),
        },
        {
          dataField: "POS_SHOP_CD",
          caption: this.$t("POS_SHOP_CD"),
        },
        {
          dataField: "SHOP_NM",
          caption: this.$t("SHOP_NM"),
          width: 300,
        },
        {
          dataField: "SHOP_ADD",
          caption: this.$t("SHOP_ADD"),
        },
        {
          dataField: "TEL_NO",
          caption: this.$t("TEL_NO"),
        },
        {
          dataField: "FAX_NO",
          caption: this.$t("FAX_NO"),
        },
        {
          dataField: "SHOP_EML",
          caption: this.$t("SHOP_EML"),
        },
        {
          dataField: "SHOP_LOGO",
          caption: this.$t("SHOP_LOGO"),
        },
        {
          dataField: "REG_ID",
          caption: this.$t("REG_ID"),
        },
        {
          dataField: "REG_DTM",
          caption: this.$t("REG_DTM"),
        },
        {
          dataField: "EDIT_ID",
          caption: this.$t("EDIT_ID"),
        },
        {
          dataField: "EDIT_DTM",
          caption: this.$t("EDIT_DTM"),
        },
        {
          dataField: "PRO_YN",
          caption: this.$t("PRO_YN"),
        },
        {
          dataField: "POS_ID",
          caption: this.$t("POS_ID"),
        },
      ];
    },
  },
};
</script>
