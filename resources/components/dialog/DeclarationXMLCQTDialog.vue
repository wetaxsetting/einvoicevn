<template>
  <v-dialog id="view-einvoicedialog" width="1000" v-model="dialogIsShow" overlay-opacity="0.1" :origin="origin" :transition="transition" :fullscreen="isMaximized">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("view-einvoice-dialog") }}</span>
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
            :filter_paras="[pk]"
          />
        </v-row>
      </v-container>
    </v-card>
    <view-einvoice-xml-dialog
      ref="ViewEInvoiceXMLDialog"
      :src_xmlUrl="xmlUrl"
      :xmlFileNm="xmlFileNm"
      dwnFile
      @minimizeDialog="manualIsMinimized = true"
      @closeManualDialog="manualIsMinimized = false"
    ></view-einvoice-xml-dialog>
    <button type="button" v-show="false" :id="`Declaration-btnPrviewHD`" @click="previewCellFile"></button>
    <input type="textbox" id="Declaration-tempPK_HD" v-show="false" />

  </v-dialog>
</template>
<script>
import ViewEInvoiceXMLDialog from "@/components/dialog/ViewEInvoiceXMLDialog.vue";
export default {
  name: "view-einvoice-xml-cqt-dialog",
  props: {},
  components: {
    "view-einvoice-xml-dialog": ViewEInvoiceXMLDialog,
  },
  data: () => ({
    dialogIsShow: false,
    isMaximized: false,
    origin: "center center",
    transition: "dialog-transition",
    pk: null,
    xmlUrl: "",
    xmlFileNm: "",
    currentRow: "",
  }),
  created() {
    //console.clear();
    // this.onSearch();
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
          caption: this.$t("noti_no"),
          width:200
        },
        {
          dataField: "NOTE_TIME",
          caption: this.$t("note_time"),
          type: "number",
          width:100
        },
        {
          dataField: "NOTE_SIGN",
          caption: this.$t("note_sign"),
        },
        {
          dataField: "CQT_RESULT",
          caption: this.$t("cqt_result"),
          width:250
        },
        { dataField: ("CQT_DATA_RESULT"),  caption: "thao_tac",  type: "html", width: 150, fixed: true, cellsrenderer: this.myCellHTML},
      ];
    },
  },
  watch: {
    dialogIsShow(val) {
        if (val === true) {
          this.search();
        }
      },
      
  },

  methods: {
    previewCellFile() {
      this.currentRow = document.getElementById("Declaration-tempPK_HD").value;

      const ds = this.$refs.grdKQCQT.getDataSource();
        this.xmlUrl = ds[0].CQT_DATA_RESULT;
        this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
      // if (ds.length) {
      //   const found = ds.find((item) => item.PK == this.currentRow);
      //   console.log("found", found);
      //   if (found) {
      //     this.xmlUrl = found.CQT_DATA_RESULT;
      //     this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
      //   }
      // }
    },
    myCellHTML(row, column, value, cellhtml) {
      let gridC = this.$refs.grdKQCQT.getControl();
      let rowData = gridC.getrowdata(row);
      let previewXML = `document.getElementById('Declaration-btnPrviewHD').click()`;

      let html = `<button class="v-icon mdi mdi-eye light-blue--text px-16" onclick="document.getElementById('Declaration-tempPK_HD').value = '${rowData.PK}';${previewXML}"></button>`;
      return html;
    },



    async search() {
            setTimeout(() => {
                this.onSearch();
            }, 500); 
        },
    async onSearch() {
      await  this.$refs.grdKQCQT.loadData();
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
