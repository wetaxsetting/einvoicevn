<template>
  <div>
    <v-card flat tile class="primary-radial-gradient" :height="windowHeight">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card outlined class="pa-4 mx-auto" :width="_calculateHeight(windowWidth, 60)">
              <v-container>
                <v-row align="center" justify="center">
                  <v-col cols="12" class="text-center">
                    <div class="text-h4 font-weight-bold text-uppercase">Tra cứu hóa đơn điện tử</div>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field 
                      ref="invoiceNo"                  
                      outlined
                      single-line
                      validate-on-blur                    
                      label="Nhập mã tra cứu hóa đơn"
                      :color="currentTheme"
                      :rules="inputRule"
                      v-model="invoiceNo"
                      @keypress.enter="search"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      ref="captcha"
                      outlined
                      single-line
                      hide-details
                      label="Captcha"
                      append-icon="mdi-refresh"
                      :color="currentTheme"                        
                      v-model="captcha"
                      @click:append="_handleGenerateCaptcha"
                      @keypress.enter="search"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <div v-html="captchaSvg" v-if="captchaSvg"></div>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn block depressed class="white--text" :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="search">Search</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-dialog :max-width="Math.floor(windowWidth*0.75)" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("einvoice_information") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid>
          <v-row no-gutters>
            <v-col cols="6">
              <v-card flat tile class="overflow-y-overlay" :height="_calculateHeight(windowHeight, 70)" v-if="invoiceInfo && invoiceInfo.url_pdf">
                <iframe :src="invoiceInfo.url_pdf" height="100%" width="100%" ></iframe>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card flat tile color="grey darken-1" class="overflow-y-overlay" :height="_calculateHeight(windowHeight, 70)"></v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  layout: "monitoring",

  data: () => ({
    invoiceNo: "LO+SYhpwjt8=",
    captcha: "",
    captchaSvg: "",
    sessionID: "",
    isProcessing: false,
    inputRule: [(v) => !!v || "Please fill in this field!"],
    dialogIsShow: false,
    invoiceInfo: ""
  }),

  async mounted() {
    await this._handleGenerateCaptcha();
  },

  methods: {
    async _handleGenerateCaptcha() {
      console.log("_handleGenerateCaptcha")
      const { sessionid, captcha } = await this.$axios.$post("user/captchar", { req_sessionid: this.sessionID });

      this.$nextTick(() => {
        this.sessionID = sessionid;
        this.captchaSvg = captcha;
        this.captcha = "";
      });
    },

    async search() {
      if (this.invoiceNo === "" || this.invoiceNo === undefined) {
        this.$refs.invoiceNo.focus();
        return;
      } else if ((this.captcha === "" || this.captcha === undefined)) {
        this.$refs.captcha.focus();
        return;
      }
      try {
        this.isProcessing = true; 
        const { success, data, message } = await this.$axios.$post("/einvoice/lookup-code", { captcha: this.captcha, sessionid: this.sessionID, lookupcode: this.invoiceNo })
        if(success) {
          console.log("data:", data)
          this.invoiceInfo = data;
          this.isProcessing = false;
          this.dialogIsShow = true;
        } else {
          this.isProcessing = false;
          this.showNotification("danger", message, "", 3000);
        }
      } catch (error) {
        this.isProcessing = false;
        console.log("search-catch exception:", error.message);
        this.showNotification("danger", "Error Occurs!", error.message, "", 3000);
      }
    }
  }
}
</script>

<style>

</style>