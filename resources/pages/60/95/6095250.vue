<template>
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row dense>
      Hello World :)
    </v-row>
    <v-row dense>
      
    </v-row>
  </v-container>
</template>

<script>
export default {
  // form tham khảo 4025000, 5070010, 8040070
  layout: "default",
  middleware: "user",
  props: ["paras"],

  components: {},

  data: () => ({
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
  },

  watch: {
  },

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
    onClick(action) {
      switch (action) {
        case "search":
          this.$refs.grdView.loadData();
          break;
        case "select":
          this.$refs.grdView.loadData();
          break;
        case "excel":
          this.$refs.grdView.loadData();
          break;
      }
    },
    async getDataList() {
    },
    initHeader() {
      
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
