<template>
  <div>
    <v-card flat tile :color="!breakpoint.isDesktop ? 'primary-radial-gradient' : 'transparent'" :height="windowHeight">
      <v-img 
        contain 
        :aspect-ratio="16/9" :height="windowHeight" :width="windowWidth" :src="imgBg" 
        style="position: absolute; top: 0; left: 0;"
        v-if="breakpoint.isDesktop"
      ></v-img>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card shaped class="pa-4 mx-auto" :width="_calculateHeight(windowWidth, (breakpoint.isDesktop ? 60 : 90))">
              <v-container>
                <v-row dense align="center" justify="center">
                  <v-col cols="12" class="text-center">
                    <div class="font-weight-bold text-uppercase" :class="!breakpoint.isMobile ? 'text-h4' : 'text-h6'">Tra cứu biên bản điện tử</div>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field 
                      ref="invoiceNo"
                      outlined
                      single-line
                      validate-on-blur                    
                      label="Nhập mã tra cứu hóa đơn"
                      :color="currentTheme"
                      :dense="!breakpoint.isDesktop"
                      :disabled="isProcessing"
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
                      :append-icon="!isProcessing ? 'mdi-refresh' : ''"
                      :color="currentTheme"
                      :dense="!breakpoint.isDesktop"
                      :disabled="isProcessing"             
                      v-model="captcha"
                      @click:append="_handleGenerateCaptcha"
                      @keypress.enter="search"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <div v-html="captchaSvg" v-if="captchaSvg"></div>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn block depressed :color="currentTheme" :class="currentTextColor"  :disabled="isProcessing" :loading="isProcessing" @click="search">Search</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-dialog eager :persistent="isProcessing" :max-width="Math.floor(windowWidth*0.75)" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>Thông tin hóa đơn</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid>
          <v-row no-gutters>
            <v-col lg="8" cols="12">
              <v-card flat tile :height="dialogHeight" v-if="invoiceInfo && invoiceInfo.url_pdf">
                <iframe :src="invoiceInfo.url_pdf" height="100%" width="100%" ></iframe>
              </v-card>
            </v-col>
            <v-col lg="4" cols="12">
              <v-card flat tile>
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="12">
                      <div class="text-h5 font-weight-bold pb-2">Thông tin biên bản</div>
                      <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12 pt-2">
                      <v-sheet tile color="transparent" class="d-flex align-center justify-space-between" width="100%">
                        <span class="mr-auto">Mã khách hàng:</span>
                        <span class="font-weight-bold">{{ invoiceInfo.buyer_code }}</span>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <v-sheet tile color="transparent" class="d-flex align-center justify-space-between" width="100%">
                        <span class="mr-auto">Tên khách hàng:</span>
                        <span class="font-weight-bold">{{ invoiceInfo.buyer_name }}</span>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <v-sheet tile color="transparent" class="d-flex align-center justify-space-between" width="100%">
                        <span class="mr-auto">Mã số thuế:</span>
                        <span class="font-weight-bold">{{ invoiceInfo.buyer_taxcode }}</span>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <v-sheet tile color="transparent" class="d-flex align-center justify-space-between" width="100%">
                        <span class="mr-auto">Thông tin hóa đơn sai sót:</span>
                        <span class="font-weight-bold">{{ invoiceInfo.info_inv }}</span>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <v-sheet tile color="transparent" class="d-flex align-center justify-space-between" width="100%">
                        <span class="mr-auto">Trạng thái biên bản:</span>
                        <span class="font-weight-bold">{{ invoiceInfo.seller_status }}</span>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <v-sheet tile color="transparent" class="d-flex align-center justify-space-between" width="100%">
                        <span class="mr-auto">Ngày lập biên bản:</span>
                        <span class="font-weight-bold">{{ invoiceInfo.seller_inv_dt }}</span>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <v-btn dark depressed small :color="currentTheme" @click="onSignXML" :disabled="invoiceInfo.buyer_sign_yn=='Y'" >
                        <v-icon left>mdi-file-pdf-box</v-icon>
                        <span class="ml-2">Ký biên bản</span>
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-btn dark depressed small color="#EA7700" target="_blank" @click="onDownloadXML">
                        <v-icon left>mdi-file-xml-box</v-icon>
                        <span class="ml-2">Tải về định dạng XML</span>
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-btn dark depressed small color="#AD0B00" @click="onDownloadPDF">
                        <v-icon left>mdi-file-pdf-box</v-icon>
                        <span class="ml-2">Tải về định dạng PDF</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog eager :persistent="isProcessing" :width="Math.floor(windowWidth*0.25)" v-model="dialog2IsShow">
      <v-card>
        <v-card-title class="text-h5 d-flex align-center justify-center">CHUYỂN THÀNH HÓA ĐƠN GIẤY</v-card-title>
        <v-card-text class="pb-0">
          <v-form
            lazy-validation
            ref="form"
          >
            <v-text-field dense outlined validate-on-blur ref="converterInputRefs" label="Họ tên người chuyển đổi" :color="currentTheme" :disabled="isProcessing" :rules="inputRule" v-model="inputName"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed :color="currentTheme" :class="currentTextColor"  :disabled="isProcessing" :loading="isProcessing" @click="convert">Tiếp tục</v-btn>
          <v-btn outlined color="grey darken-2" :disabled="isProcessing" @click="dialog2IsShow = false">Hủy bỏ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  layout: "monitoring",

  data: () => ({
    imgBg: require("@/assets/images/lookup_einvoice.jpg"),
    invoiceNo: "",
    captcha: "",
    captchaSvg: "",
    sessionID: "",
    isProcessing: false,
    inputRule: [(v) => !!v || "Please fill in this field!"],
    dialogIsShow: false,
    invoiceInfo: "",
    dialog2IsShow: false,
    inputName: ""
  }),

   async created() {
    //console.log("this.$route?.query?.trade_code ",this.$route?.query?.trade_code)
    if(this.$route?.query?.trade_code) {
        this.invoiceNo = this.$route?.query?.trade_code;
      }
  }, 

  async mounted() {    
    await this._handleGenerateCaptcha();
  },

  computed: {
    dialogHeight() {
      return Math.floor(this._calculateHeight(this.windowHeight, (this.breakpoint.isDesktop ? 90 : 50)) - 48 - 24);
    }
  },

  watch: {
    async dialogIsShow(val) {
      if(!val) {
        await this._handleGenerateCaptcha();
      }
    },
    dialog2IsShow(val) {
      if(val) {
        this.$refs.form.resetValidation()
      }
    }
  },

  methods: {
    async _handleGenerateCaptcha() {
      try {
        if(this.isProcessing) return;      
        // console.log("_handleGenerateCaptcha")
        const { sessionid, captcha } = await this.$axios.$post("user/captchar", { req_sessionid: this.sessionID });

        this.$nextTick(() => {
          this.sessionID = sessionid;
          this.captchaSvg = captcha;
          this.captcha = "";
        });
      } catch (error) {
        console.log("_handleGenerateCaptcha-catch exception:", error.message)       
      }      
    },

    async search() {
       //console.log("route:", this.$route)
      if(!this.invoiceNo) {
        //console.log("trade_code not found!");
        this.showNotification("warning", "Notification", "trade_code not found!");
        return;
      }
      if (this.invoiceNo === "" || this.invoiceNo === undefined) {
        this.$refs.invoiceNo.focus();
        return;
      } else if ((this.captcha === "" || this.captcha === undefined)) {
        this.$refs.captcha.focus();
        this.showNotification("warning", "Notification", "captcha_is_exptdate");
        return;
      }
      try {
        this.isProcessing = true; 
        const { success, data, message } = await this.$axios.$post("/einvoice/lookup-minutes", { captcha: this.captcha, sessionid: this.sessionID, lookupcode: this.invoiceNo })
        if(success) {
          //console.log("data:", data)
          this.invoiceInfo = data;
          this.isProcessing = false;
          this.dialogIsShow = true;
        } else {
          this.isProcessing = false;
          this.showNotification("warning", message, "", 3000);
          await this._handleGenerateCaptcha();
        }
      } catch (error) {
        this.isProcessing = false;
        //console.log("search-catch exception:", error.message);
        this.showNotification("warning", "Error Occurs!", error.message, "", 3000);
        await this._handleGenerateCaptcha();
      }
    },

    onDownloadXML()
    {
      let _blob = new Blob([this.invoiceInfo.buyer_sign_xml], {
                type: "application/xml",
            });
            let _url = window.URL.createObjectURL(_blob);
            var tag_a = document.createElement("a");
            document.body.appendChild(tag_a);
            tag_a.style = "display: none";
            tag_a.href = _url;
            tag_a.download = this.invoiceInfo.voucher_no; 
            tag_a.click();
            window.URL.revokeObjectURL(_url);
            tag_a.remove();
    },

    onDownloadPDF() {
      try {
        var link = document.createElement('a');
        link.href = this.invoiceInfo.url_pdf;
        link.download = `${this.invoiceInfo.voucher_no}.pdf`;
        link.dispatchEvent(new MouseEvent('click'));
      } catch (error) {
        this.showNotification("danger", "onDownload-catch exception:", error.message, "", 3000);
        console.log("onDownload-catch exception:", error.message)
      }
    },

    async onSignXML()
    {
      if(this.invoiceInfo.seller_sign_xml)
      {
        var DOMParser = new (require('xmldom')).DOMParser;
        var document = DOMParser.parseFromString(this.invoiceInfo.seller_sign_xml);
        var nodesByName = document.getElementsByTagName('DLieu');
        // console.log("nodesByName  ", nodesByName);
        // console.log("nodesByName  ", nodesByName[0]);
        // console.log("nodesByName  ", nodesByName[0].attributes[0].value);
        var id_signing = nodesByName[0].attributes[0].value;
        let objXml = [
          {
            req_key: this.invoiceInfo.req_key,
            xml: this.invoiceInfo.seller_sign_xml,
            id_signing: id_signing,
            url_signing: "BBan/DSCKS/NMua"
          }
        ]
        //console.log("objXml  ", objXml);
       
        jQuery.support.cors = true;
        $.ajax({
          url: "http://localhost:1080/signXML",
          dataType: "json",
          method: "POST",
          data: {
            crt_by: this.invoiceInfo.buyer_name,
            xml: JSON.stringify(objXml).toString(),
          },
          error: this.onErrorissueXmlList,
          success: this.onSuccessissueXmlList,
        });
      }
      
    },

    async onErrorissueXmlList(json, textStatus, errorThrown) {
      return this.showNotification("warning", this.$t("error_occurs"), errorThrown);//   alert(" Error :" + errorThrown);
    },

    async onSuccessissueXmlList(data) {
      //console.log("data  ", data);
      
      // if(this.invoiceInfo.buyer_taxcode != data.dn_mst)
      // {
      //   this.showNotification("warning", "Notification", "mst_is_wrong");
      //   return;
      // }

      var date_token = new Date(data.not_after);
      var date_current = new Date();
     
      if(date_token < date_current)
      {
        this.showNotification("warning", "Notification", "token_is_exptdate");
        return;
      }
      var parseXML = require('xml-parse-from-string')
      var doc = parseXML(data.result[0].xml)
      var SigningTime = doc.getElementsByTagName('SigningTime')[1].innerHTML;
      
      
      let res = await this.$axios.$post("/einvoice/lookup-minutes-update", {
          responseType: "json",
          xml_signed : data.result[0].xml,
          buyer_sign_by: data.dn_name, 
          buyer_sign_dt: SigningTime, 
          req_key: data.result[0].req_key,
          lookupcode: this.invoiceNo
        });

          //console.log("res",res);
        if (res.success) {
          this.invoiceInfo = "";
          this.showNotification("success", res.message, "" ); 
          this.invoiceInfo = res.data;
          this.isProcessing = false;
          this.dialogIsShow = true;
          
        } else {
          this.showNotification("danger", res.message, "");
        }

    },

    async convert() {
      if (this.inputName === "" || this.inputName === undefined) {
        this.$refs.converterInputRefs.focus();
        return;
      }
      try {
        this.isProcessing = true;
        const { success, data, message } = await this.$axios.$post("/einvoice/general-convert-einvoice", {
          converter: this.inputName,
          lookupcode: this.invoiceNo
        })
        if(success) {
          //console.log("data:", data);
          this.showNotification("success", message, "", 3000);

          this.isProcessing = false;
          this.dialog2IsShow = false;
          this.$refs.converterInputRefs.reset();
        } else {
          this.isProcessing = false;
          this.showNotification("danger", message, "", 3000);
        }
      } catch (error) {
        //console.log("convert-catch exception:", error.message);
        this.isProcessing = false;
      }
    }
  }
}
</script>