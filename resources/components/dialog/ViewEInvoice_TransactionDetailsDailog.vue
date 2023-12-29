<template>
  <v-dialog id="view-einvoicedialog" width="1000" v-model="dialogIsShow" overlay-opacity="0.1" :origin="origin" :transition="transition" :fullscreen="isMaximized">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("transaction_processing_details") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark class="mr-2" @click="minimizeDialog">mdi-window-minimize</v-icon>
        <v-icon dark class="mr-2" @click="isMaximized = !isMaximized">{{ isMaximized ? "mdi-window-restore" : "mdi-window-maximize" }}</v-icon>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-btn icon tile :color="currentTheme" :disabled="true" @click="onSearch">
        </v-btn>
        <v-row no-gutters>
          <BaseGridView
            ref="grdKQCQT"
            :auto_load="true"
            sel_procedure="EI_SEL_6095710_KQCQT_NC"
            select_mode="Single"
            :max_height="limitHeight"
            :header="headerGrid"
            :filter_paras="[]"
          />
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "view-einvoice-transaction-details-dialog",
  props: {},
  components: {},
  data: () => ({
    dialogIsShow: false,
    isMaximized: false,
    origin: "center center",
    transition: "dialog-transition",
  }),
  created() {
    console.clear();
    this.onSearch();
  },
  computed: {
    limitHeight() { 
            if(this.isMaximized) { return this.windowHeight - 150 }
            if(this.$vuetify.breakpoint.smAndUp) { return this.windowHeight - 280 }
            return this.windowHeight - 350
    },
    headerGrid() {
      const self = this;
      return [
      {
          dataField: "NO",
          caption: this.$t("stt"),
        },
        {
          dataField: "NOTI_NO",
          caption: this.$t("don_vi"),
          width:200
        },
        {
          dataField: "NOTI_DT",
          caption: this.$t("MST"),
          type: "number",
          width:100
        },
        {
          dataField: "SIGN_DT",
          caption: this.$t("ma_giao_dich"),
          width:250
        },
        {
          dataField: "CQT_RESULT",
          caption: this.$t("form_no"),
        },
        { dataField: ("CQT_DATA_RESULT"),  caption: "thao_tac",  type: "html", width: 150, fixed: true, cellsrenderer: this.myCellHTML},
      ];
    },
  },
  watch: {},

  methods: {
    async onSearch() {
      // await  this.$refs.grdKQCQT.loadData();
    },
    minimizeDialog() {
      this.origin = "right bottom";
      this.transition = "scale-transition";
      setTimeout(() => {
        this.dialogIsShow = false;
        this.$emit("minimizeDialog");
      }, 100);
    },
  },
};
</script>
