<template>
  <v-dialog id="view-einvoice-json-dialog" max-width="1000" v-model="dialogIsShow" overlay-opacity="0.1" :origin="origin" :transition="transition" :fullscreen="isMaximized">
    <v-card >
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("view-einvoice-json-dialog") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark class="mr-2" @click="minimizeDialog">mdi-window-minimize</v-icon>
        <v-icon dark class="mr-2" @click="isMaximized = !isMaximized;">{{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'}}</v-icon>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <v-card outlined :height="limitHeight1" :max-height="limitHeight1" style="overflow-y: scroll;" v-resize="onResize">
              <!-- <iframe :src="src_pdfUrl" height="100%" width="100%" ></iframe> -->
              <json-viewer :value="jsonData"></json-viewer>
            </v-card>
          </v-col>
        </v-row>        
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import JsonViewer from 'vue-json-viewer'

export default {
  name: "view-einvoice-json-dialog",
  props: {
    data_json: { type: String, default: "" },
  },
  components: {
    'json-viewer' : JsonViewer

  },
  data: () => ({
    dialogIsShow: false,
    isMaximized: false,
    origin: "center center",
    transition: "dialog-transition",
    jsonData: {}
  }),
  created() {
    // this.getMachineTags()
  
  },
  computed: {
    limitHeight1() {
      if(this.isMaximized) { 
        console.log("isMaximized  ++==>", this.isMaximized);
        return Math.floor(this._calculateHeight(this.windowHeight, 90)); 
      }
      return Math.floor(this._calculateHeight(this.windowHeight,80));
    },
    limitHeight2() {
      if(this.isMaximized) { 
        console.log("isMaximized  ++==>", this.isMaximized);
        return Math.floor(this._calculateHeight(this.limitHeight1, 85)); 
      }
      return Math.floor(this._calculateHeight(this.limitHeight1,90));
    }
  },
  watch: {
    data_json(val) {
            if (val && this.dialogIsShow) {
              this.jsonData = JSON.parse(val);
            }
        },
  },

  methods: {
    minimizeDialog() {
      this.origin = "right bottom"
      this.transition = "scale-transition"
      setTimeout(() => {
        this.dialogIsShow = false
        this.$emit("minimizeDialogPDF")
      }, 100)
    },
    closeDialog() {
      this.dialogIsShow = false
      this.$emit("closeManualDialog")
    },
  },
};
</script>
