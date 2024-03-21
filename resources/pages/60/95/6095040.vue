<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3">
        <BaseSelect outlined :label="$t('company')" :lstData="company_list" v-model="selected_company" item-value="VAL" item-text="NAME"/>
      </v-col>
      <v-col md="2">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" default />
      </v-col>
      <v-col md="2">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" default />
      </v-col>
      <v-col md="2">
        <BaseInput outlined :label="$t('template')" v-model="template"/>
      </v-col>
      <v-col md="3" class="d-flex justify-end">
        <BaseButton icon_type="search" :btn_text="$t('search')"  @onclick="onClickButton" />
        <BaseButton icon_type="preview" :btn_text="$t('preview')"  @onclick="onPreview" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BaseGridView
          ref="gridview"
          :header="this.headerGrid"
          :autoresize="false"
          :setting="true"
          :height="limitHeight"
          :headertype="1"
          @cellClick="onCellClick"
          sel_procedure="EI_SEL_6095040_DATA_NC"
          :filter_paras="[this.selected_company, this.from_date, this.to_date, this.template]"
        />
      </v-col>
    </v-row>
        <view-einvoice-pdf-dialog
      ref="ViewEInvoicePDFDialog"
      :src_pdfUrl="pdfUrl"
    ></view-einvoice-pdf-dialog>
  </v-container>
</template>

<script>
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  layout: "default",
  middleware: "user",

  components: { "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog },
  data: () => ({
    selected_company: null,
    company_list: [],
    from_date: "",
    to_date: "",
    headerGrid: [],
    template:"",

    pdfUrl: "",
    tei_einvoice_m_pk_row:""
  }),

  async created() {
    await this.getListCodes("company");
    this.onSetHeader();
  },

  watch: {},

  mounted() {},
// meo
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.69; //1366x768
      } else {
        return this.windowHeight * 0.82; //1920x18/080
      }
    },
  },
  methods: {
        async onPreview(){
      
      jQuery.support.cors = true;
      $.ajax({
        type: "POST",
        url: "http://genuclouding.com/wseinvoice/BSService.asmx/SendPDF_R",
        data: {
          tei_einvoice_m_pk: this.tei_einvoice_m_pk_row+ "|",
          tei_company_pk: this.selected_company,
        },
        dataType: "text",
        crossDomain: true,
        success: this.OnSuccessCallReUploadPDF,
        error: this.OnErrorCallReUploadPDF,
      });

    },
    async OnSuccessCallReUploadPDF(){
         let pdfFile = await this._callProcedure("EI_SEL_GET_PDF_FILE", [
            this.tei_einvoice_m_pk_row
          ]);
          let pdfFileBuffer=pdfFile[0].ATTACH_FILE_PDF.data
          const base64String = btoa(String.fromCharCode(...new Uint8Array(pdfFileBuffer)))
          let pdfUrl="data:application/pdf;base64, " + encodeURI(base64String) + ""
          this.pdfUrl = pdfUrl;

          this.$nextTick(() => {
          this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
          })

    },
    OnErrorCallReUploadPDF(response){
      alert(response.msg + " - " + response.statusText);
    },
     async onCellClick({ column, data, rowIndex, rowType }) {
       this.tei_einvoice_m_pk_row=data.PK
    },
    onClickButton() {
      this.$refs.gridview.loadData();
    },
    onSetHeader() {
      this.headerGrid = [
        {
          field: "TEMPLATE_LNM",
          title: this.$t("template_lname"),
          alignment: "center",
          type:"text",
          width:200,
        },
        {
          field: "TEMPLATE_FNM",
          title: this.$t("template_fname"),
          alignment: "left",
          type:"text",
          width:150,
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width:200,
          alignment: "left",
          type:"text",
        },
        {
          field: "REMARKS",
          title: this.$t("remarks"),
          width:100,
          alignment: "left",
          type:"text",
        },
        {
          field: "INV_CONTENT",
          title: this.$t("invoice_content"),
          width:300,
          alignment: "left",
          type:"text",
        },
        {
          field: "USE_YN",
          title: this.$t("use_yn"),
          alignment: "left",
          type:"checkbox",
          allowEditing: true,
          width:100,
        },
        {
          field: "VALID_DATE_FORM",
          title: this.$t("valid_from"),
          width:100,
          alignment: "left",
          type:"text",
        },
        {
          field: "TEL",
          title: this.$t("tel"),
          alignment: "left",
          type:"text",
          width:200,
        },
        {
          field: "FAX",
          title: this.$t("fax"),
          alignment: "left",
          type:"text",
          width:100,
        },
         {
          field: "ACC_NO",
          title: this.$t("acc_no"),
          alignment: "left",
          type:"text",
          width:100,
        },
         {
          field: "CCY",
          title: this.$t("ccy"),
          alignment: "left",
          type:"text",
          width:100,
        },
         {
          field: "ACC_HOLDER",
          title: this.$t("holder"),
          alignment: "left",
          type:"text",
          width:100,
        },
         {
          field: "BACK_NAME",
          title: this.$t("back_name"),
          alignment: "left",
          type:"text",
          width:100,
        },
         {
          field: "CONTACT_PERSON",
          title: this.$t("contact_person"),
          alignment: "left",
          type:"text",
          width:100,
        },
         {
          field: "REP_PERSON",
          title: this.$t("rep_person"),
          alignment: "left",
          type:"text",
          width:100,
        },
        {
          field: "TAX_NAME",
          title: this.$t("tax_name"),
          alignment: "left",
          type:"text",
          width:100,
        },
        {
          field: "REMARKS_v2",
          title: this.$t("remarks"),
          alignment: "left",
          type:"number",
          width:100,
        },
        {
          field: "WEB_SITE",
          title: this.$t("web_site"),
          alignment: "left",
          type:"text",
          width:100,
        },
        {
          field: "TAX_CODE_DISPLAY",
          title: this.$t("tax_code_display"),
          alignment: "left",
          type:"text",
          width:200,
        },
        {
          field: "CONTACT_COM_PHONE",
          title: this.$t("contact_com_phone"),
          alignment: "left",
          type:"text",
          width:200,
        },
        {
          field: "BEIEF_COM_NM",
          title: this.$t("brief_com_nm"),
          alignment: "left",
          type:"text",
          width:150,
        },
        {
          field: "CONTACT_ADDR",
          title: this.$t("contact_addr"),
          alignment: "left",
          type:"text",
          width:300,
        },
        {
          field: "CONTACT_EMAIL",
          title: this.$t("contact_email"),
          alignment: "left",
          type:"text",
          width:100,
        },
        {
          field: "CONTACT_MOBI",
          title: this.$t("contact_mobi"),
          alignment: "left",
          type:"text",
          width:100,
        },
        {
          field: "WEBSITE_EI",
          title: this.$t("website_EI"),
          alignment: "left",
          type:"text",
          width:100,
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "AC_SEL_6095040_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );
          break;
      }
    },
  },
};
</script>
