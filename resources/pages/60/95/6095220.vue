<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card tile>
              <v-container fluid class="py-1">
                <v-row dense align="center" justify="space-between">
                  <!-- Company -->

                  <v-col v-if="checkSearch" lg="6" sm="6" cols="12">
                    <v-text-field
                      outlined
                      clearable
                      dense
                      hide-details
                      v-model="txtSearchCode"
                      :label="$t('search_code')"
                    ></v-text-field>
                  </v-col>

                  <v-col v-else lg="6" sm="6" cols="12">
                    <v-file-input
                      outlined
                      clearable
                      dense
                      hide-details
                      :accept="'image/png, image/jpeg, image/bmp, text/xml'"
                      :label="$t('attach_File')"
                      @change="onFilePicked"
                      v-model="txtFile"
                    ></v-file-input>
                  </v-col>

                  <v-col lg="3" sm="6" cols="12">
                    <v-select
                      dense
                      hide-details
                      outlined
                      item-value="VAL"
                      item-text="NAME"
                      @change="searchChangeHandler"
                      :label="$t('search_view')"
                      :items="searchView"
                      v-model="lstSearchView"
                    ></v-select>
                  </v-col>

                  <v-col lg="3" sm="6" cols="12" class="py-1">
                    <div class="d-flex justify-end">
                      <BaseButton
                        btn_type="icon"
                        icon_type="search"
                        :btn_text="$t('search')"
                        :disabled="false"
                        @onclick="onSearch()"
                      />
                      <BaseButton
                        btn_type="text"
                        :btn_text="$t('preview')"
                        @onclick="onPreview()"
                        :disabled="isProcessing"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Tabs & Tab Contents -->
        <v-row no-gutters align="center" justify="start" class="mb-2">
          <v-col cols="12">
            <BaseGridView
              column-resizing-mode="widget"
              ref="grdInvoiceSearch"
              :auto_load="false"
              :multiselect="true"
              :headertype="1"
              :max_height="limitHeight"
              :header="headerGrid"
              @cellClick="onCellClick"
              sel_procedure="AC_SEL_6095220_View"
              :filter_paras="[this.txtSearchCode]"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- <confirm-dialog
      ref="confirmDialog"
      @onConfirm="onClickButton('OPTION')"
    ></confirm-dialog> -->
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

  components: {
    "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
  },
  data: () => ({
    txtFile: [],
    searchView: [],
    selectedRow: {},
    lstSearchView: "",
    txtSearchCode: "",
    txtXml_Search: "",
    checkSearch: true,

    pdfUrl: "",
    tei_einvoice_m_pk_row: "",
  }),

  async created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.getSelectLists();
  },
  mounted() {},
  watch: {},
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 650;
      }
    }, // this.windowHeight },
    headerGrid() {
      const self = this;
      return [
        {
          field: "PK",
          width: 0,
          title: "PK",
          alignment: "center",
        },
        {
          field: "CUSTOMER_NM",
          title: "Customer",
          width: 180,
          alignment: "center",
        },
        {
          field: "TAX_CODE",
          title: "Tax Code",
          width: 100,
          alignment: "center",
        },
        {
          field: "FORM_NO",
          title: "Form No",
          width: 120,
          alignment: "center",
        },
        {
          field: "SERIAL_NO",
          title: "Serial No",
          width: 180,
          alignment: "center",
        },
        {
          field: "INVOICE_NO",
          title: "Invoice No",
          width: 180,
          alignment: "center",
        },
        {
          field: "TOT_NET_TR_AMT",
          title: "amount_trans",
          type: "number",
          width: 130,
          alignment: "right",
        },
        {
          field: "TOT_NET_BK_AMT",
          title: "amount_books",
          type: "number",
          width: 130,
          alignment: "right",
        },
        {
          field: "REMARK",
          title: "description",
          width: 210,
        },
        {
          field: "REMARK2",
          title: "local_description",
          width: 210,
        },

        {
          field: "REPORT_CODE",
          title: "report_code",
          width: 150,
          alignment: "left",
        },
        {
          field: "TR_TYPE",
          title: "tr_type",
          width: 150,
          alignment: "left",
        },

        {
          field: "EI_STATUS",
          title: "e_status",
          width: 150,
          alignment: "left",
        },
        {
          field: "TEI_COMPANY_PK",
          title: "tei_company_pk",
          width: 150,
          alignment: "left",
        },
        {
          field: "COMPANY_NM",
          title: "company_name",
          width: 150,
          alignment: "left",
        },
      ];
    },
  },
  methods: {
    async getSelectLists() {
      const results = await this._callProcedure("AC_SEL_6095220_SelectList", [
        "",
      ]);
      if (results.length) {
        this.searchView = results;

        this.lstSearchView = this.searchView[0].VAL;
      }
    },
    searchChangeHandler() {
      if (this.lstSearchView == "01") {
        this.checkSearch = true;
      } else {
        this.checkSearch = false;
      }
    },
    async onSearch() {
      if (this.checkSearch == true) {
        this.$refs.grdInvoiceSearch.loadData();
        //    const results = await this._callProcedure("AC_SEL_6095220_View", [
        //   this.txtSearchCode
        // ]);
        //   console.log(results)
      } else {
        if (this.txtXml_Search == "") {
          this.showNotification(
            "warning",
            "Information",
            this.$t("msg_please_select_a_file")
          );
          return;
        } else {
          this.UploadFile().then(() => {
            this.txtXml_Search = "";
          });
        }
      }
    },
    async onPreview() {
      this.isProcessing = true;
      this.pdfUrl = await this.pdfUrlGetter(this.tei_einvoice_m_pk_row);
      this.$nextTick(() => {
        this.isProcessing = false;
        this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      });
    },
    async pdfUrlGetter(pk) {
      const pdfUrlExcel = await this.getEinvoice(this, pk);
      return pdfUrlExcel;
    },
    async onCellClick({ column, data, rowIndex, rowType }) {
      this.tei_einvoice_m_pk_row = data.PK;
    },
    onFilePicked(file) {
      this.file = file;
      let reader = new FileReader();
      reader.readAsText(this.file);
      reader.addEventListener(
        "load",
        function () {
          //this.html = reader.result;
          this.txtXml_Search = reader.result;
          // console.log(reader.result);
        }.bind(this),
        false
      );

      // this.UploadFile();
    },
    async UploadFile() {
      jQuery.support.cors = true;
      $.ajax({
        type: "POST",
        url: "http://genuclouding.com/wseinvoice/BSService.asmx/ReadXML",
        //url:"http://localhost:39236/BSService.asmx/ReadXML",
        data: { data: this.txtXml_Search },
        dataType: "jsonp",
        crossDomain: true,
        success: function (response) {
          var xmlDoc = $.parseXML(response);
          var xml = $(xmlDoc);

          var obj = $.parseJSON(xml.text());
          if (obj.msg == "OK") {
            console.log("obj", obj);
          } else {
            alert("Không phải file xml !!");
            return;
          }
        },
        error: function (response) {
          alert(response.status + " - " + response.statusText);
        },
      });
      // .then(response => console.log("response",response));
    },
  },
};
</script>
