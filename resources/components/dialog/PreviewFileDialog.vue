<template>
    <v-dialog max-width="800" v-model="previewFile">
        <v-card outlined tile :height="limitHeight" :max-height="limitHeight" style="overflow-y: scroll;" v-resize="onResize">
            <iframe :src="fileUrl" height="100%" width="100%" ></iframe>
        </v-card>
    </v-dialog>
</template>


<script>


export default {
  name: "preview-file-dialog",
  props: {
    input: {
      type: String,
      default: ""
    },
    inputinfo: {
        type: File
    }
  },

  data: () => ({
    previewFile: false,
  }),

  computed: {
    limitHeight() { 
      if(this.isMaximized) { return this.windowHeight - 150 }
      if(this.$vuetify.breakpoint.smAndUp) { return this.windowHeight - 280 }
      return this.windowHeight - 350
    },
    fileUrl: {
        get() {
            if(this.input) {
                let blob = this._base64ToBlob(this.input, this.inputinfo.type);
                let url = "https://docs.google.com/gview?url=" + window.URL.createObjectURL(blob)+"&embedded=true";
                console.log(this.inputinfo);
                return url;
            }
            return null;
        }
    }
  },

  mounted() {

  },

  watch: {
    
  },

  methods: {
   
  }
};
</script>
