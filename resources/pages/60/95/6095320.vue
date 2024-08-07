  <!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
  <template>
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row no-gutters class="pl-2">
      <v-col v-show="showLeft" :cols="leftCols">
        <v-card class="pa-2">
          <v-row dense>
            <v-col md="4">
              <BaseSelect
                :label="$t('company')"
                v-model="selected_company"
                :lstData="company_list"
                item-text="PARTNER_NAME"
                item-value="TCO_COMPANY_PK"
              />
            </v-col>
            <v-col md="2">
              <BaseDatePicker
                default
                :label="$t('date_from')"
                v-model="dt_from"
              />
            </v-col>
            <v-col md="2">
              <BaseDatePicker default :label="$t('date_to')" v-model="dt_to" />
            </v-col>
            <v-col md="4" class="d-flex justify-end">
              <BaseButton
                icon_type="search"
                btn_type="icon"
                :btn_text="$t('search')"
                :disabled="isProcessing"
                @onclick="onSearch"
              />
              <BaseButton
                icon_type="view"
                btn_type="icon"
                :btn_text="$t('view')"
                :disabled="isProcessing"
                @onclick="onClickButton()"
              />
              <!-- <BaseButton
                btn_type="icon"
                icon_type="delete"
                :btn_text="$t('delete')"
                @onclick="onDelete()"
              />
              <BaseButton
                btn_type="icon"
                icon_type="save"
                :btn_text="$t('save')"
                @onclick="onSave()"
              /> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('serial_no')"
                v-model="SERIAL_NO"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('invoice_no')"
                v-model="INVOICE_NO"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('Seller_code')"
                v-model="seller_no"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('Seller_name')"
                v-model="seller_name"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <BaseSelect
                :label="$t('form_no')"
                v-model="selected_form_no"
                :lstData="form_no_list"
                item-text="NAME"
                item-value="VAL"
              />
            </v-col>
            <v-col md="2">
              <BaseSelect
                :label="$t('ei_status')"
                v-model="selected_status"
                :lstData="status_list"
                item-text="NAME"
                item-value="VAL"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('mtc')"
                v-model="matracuu"
              ></v-text-field>
            </v-col>
            <!-- <v-col sm="3" md="3">
              <v-file-input
                ref="refFile"
                prepend-icon="mdi-paperclip"
                :label="$t('attach_file')"
                @change="changeFile"
                v-model="file"
              ></v-file-input>
            </v-col> -->
            <v-col md="3">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('website')"
                v-model="WEB_SITE"
              ></v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('mcqt')"
                v-model="macqt"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <BaseGridView
                :header="grdHeader"
                :setting="true"
                :multiselect="true"
                :headertype="1"
                sel_procedure="EI_SEL_6090300_SEL_TEI_EINVOICE_CLOUD"
                @onSelectionDataChanged="onGridSelectionChanged"
                ref="grdAPInvoiceReview"
                :height="limitHeight"
                :autoresize="false"
                :filter_paras="[
                  this.selected_company,
                  this.dt_from,
                  this.dt_to,
                  this.selected_form_no,
                  this.SERIAL_NO,
                  this.INVOICE_NO,
                  this.seller_name,
                  this.seller_no,
                  this.matracuu, // khong sai
                  this.macqt,
                  this.selected_status, // khong sai
                  this.WEB_SITE, // khong sai
                ]"
                @cellDblClick="onDblClickCell"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col class="pa-1" :cols="12 - leftCols">
        <v-card class="pa-1">
          <v-row>
            <v-col md="2" cols="12" class="text-right">
              <div class="d-flex">
                <v-btn icon tile :color="currentTheme" @click="toggleLeft">
                  <v-icon v-if="showLeft">mdi-skip-previous</v-icon>
                  <v-icon v-if="!showLeft">mdi-skip-next</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('item_serial_no')"
                v-model="item_serial_no"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('item_invoice_no')"
                v-model="item_invoice_no"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('invoice_date')"
                v-model="item_invoice_date"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('sale_taxcode')"
                v-model="item_sale_taxcode"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('sale_company_name')"
                v-model="item_sale_company_name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('sale_address')"
                v-model="item_sale_address"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('amt_exclude_vat')"
                v-model="item_exclude_vat"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('amt_vat')"
                v-model="item_amt_vat"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('amt_include_vat')"
                v-model="item_include_vat"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('so_hoa_don')"
                v-model="item_so_hoa_don"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                clearable
                dense
                hide-details
                :label="$t('ngay_lap_hoa_son')"
                v-model="item_nlhd"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col>
              <BaseGridView
                ref="gridview"
                :autoresize="false"
                :header="grdHeader_detail"
                :setting="true"
                :multiselect="true"
                :headertype="1"
                :height="limitHeightmin"
                sel_procedure="EI_SEL_6090300_SEL_TEI_EINVOICED_LOUD"
                :filter_paras="[this.item_pk]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

  <!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

  <script>
import moment from "moment";
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: { "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog },
  /*############### data ##########################*/
  data: () => ({
    item_pk: 0,
    file: null,
    selected_company: "",
    company_list: [],
    selected_form_no: "",
    form_no_list: [],
    SERIAL_NO: "",
    INVOICE_NO: "",
    WEB_SITE: "",
    selected_status: "",
    status_list: [],
    seller_no: "",
    seller_name: "",
    matracuu: "",
    macqt: "",
    date_from: new Date(),
    date_to: new Date(),
    dt_from: "",
    dt_to: "",
    pdfUrl: "",
    tei_einvoice_cloud_pk: "",
    form_no: "",
    pdfUrlRow: "",
    leftCols: 6,
    selected_rows: [],
    showLeft: true,
    isShowReportDialog: false,
    item_serial_no: "",
    item_invoice_no: "",
    item_invoice_date: "",
    item_sale_taxcode: "",
    item_sale_company_name: "",
    item_sale_address: "",
    item_exclude_vat: "",
    item_amt_vat: "",
    item_include_vat: "",
    item_nlhd: "",
    item_so_hoa_don: "",
  }),
  /*############### created #######################*/
  async created() {
    await this.getListCodes("company");
    await this.getListCodes("form_no");
    await this.getListCodes("ei_status");
  },
  /*############### watch ######################*/
  watch: {
    selected_company(val) {
      this.getListCodes("form_no");
      this.getListCodes("ei_status");
    },
  },
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.515; //1366x768
      } else {
        return this.windowHeight * 0.64; //1920x1080
      }
    },
    limitHeightmin() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.62; //1366x768
      } else {
        return this.windowHeight * 0.7; //1920x1080
      }
    },
    gridHeight() {
      return this.formContainerHeight - 250;
    },
    masterContainerHeight() {
      return this.formContainerHeight - 250;
    },
    grdHeader() {
      return [
        {
          field: "INDEX",
          width: 80,
          title: this.$t("STT"),
          alignment: "right",
          type: "number",
        },
        {
          field: "SO_NUMBER",
          width: 80,
          title: this.$t("SO_NUMBER"),
          alignment: "right",
          type: "number",
        },
        {
          field: "SERIAL_NO",
          width: 100,
          title: this.$t("SERIAL_NO"),
          alignment: "left",
          type: "text",
        },
        {
          field: "INVOICE_NO",
          width: 100,
          title: this.$t("INVOICE_NO"),
          alignment: "left",
          type: "number",
        },
        {
          field: "INVOICE_DATE",
          width: 100,
          title: this.$t("INVOICE_DATE"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SALE_TAXCODE",
          width: 100,
          title: this.$t("SALE_TAXCODE"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SALE_COMPANY_NAME",
          width: 300,
          title: this.$t("SALE_COMPANY_NAME"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SALE_ADDRESS",
          width: 300,
          title: this.$t("SALE_ADDRESS"),
          alignment: "left",
          type: "text",
        },
        {
          field: "AMT_EXCLUDE_VAT",
          width: 100,
          title: this.$t("AMT_EXCLUDE_VAT"),
          alignment: "right",
          type: "number",
        },
        {
          field: "AMT_VAT",
          width: 100,
          title: this.$t("AMT_VAT"),
          alignment: "right",
          type: "number",
        },
        {
          field: "item11",
          width: 100,
          title: this.$t("Chiết khấu thương mai"),
          alignment: "right",
          type: "number",
        },
        {
          field: "item12",
          width: 100,
          title: this.$t("Tổng phí"),
          alignment: "right",
          type: "number",
        },
        {
          field: "AMT_INCLUDE_VAT",
          width: 100,
          title: this.$t("AMT_INCLUDE_VAT"),
          alignment: "right",
          type: "number",
        },
        {
          field: "CURRENCY",
          width: 100,
          title: this.$t("CURRENCY"),
          alignment: "left",
          type: "text",
        },
        {
          field: "item15",
          width: 100,
          title: this.$t("Trạng thái hóa đơn"),
          alignment: "left",
          type: "text",
        },
        {
          field: "item16",
          width: 100,
          title: this.$t("Kết qủa kiểm tra"),
          alignment: "left",
          type: "text",
        },
        {
          field: "item17",
          width: 100,
          title: this.$t("Hóa đơn liên quan"),
          alignment: "left",
          type: "text",
        },
        {
          field: "EX_RATE",
          width: 100,
          title: this.$t("Tỷ giá"),
          alignment: "right",
          type: "number",
        },
        {
          field: "item19",
          width: 100,
          title: this.$t("Tổng tiền qui đổi"),
          alignment: "left",
          type: "text",
        },
        {
          field: "item20",
          width: 100,
          title: this.$t("Website"),
          alignment: "left",
          type: "text",
        },
        {
          field: "MCCQT",
          width: 300,
          title: this.$t("Mã CQT"),
          alignment: "left",
          type: "text",
        },
        {
          field: "item22",
          width: 100,
          title: this.$t("Mã tra cứu"),
          alignment: "left",
          type: "text",
        },
        {
          field: "TCHDON",
          width: 100,
          title: this.$t("TCHDON"),
          alignment: "right",
          type: "number",
          group1: this.$t("Reference"),
        },
        {
          field: "LHDCLQUAN",
          width: 100,
          title: this.$t("LHDCLQUAN"),
          alignment: "right",
          type: "number",
          group1: this.$t("Reference"),
        },
        {
          field: "KHMSHDCLQUAN",
          width: 100,
          title: this.$t("Ký hiệu mẫu hóa đơn"),
          alignment: "right",
          type: "number",
          group1: this.$t("Reference"),
        },
        {
          field: "KHHDCLQUAN",
          width: 100,
          title: this.$t("Ký hiệu hóa đơn"),
          alignment: "right",
          type: "number",
          group1: this.$t("Reference"),
        },
        {
          field: "SHDCLQUAN",
          width: 100,
          title: this.$t("Số hóa đơn"),
          alignment: "left",
          type: "text",
          group1: this.$t("Reference"),
        },
        {
          field: "NLHDCLQUAN",
          width: 100,
          title: this.$t("Ngày lập hóa đơn"),
          alignment: "left",
          type: "text",
          group1: this.$t("Reference"),
        },
        {
          field: "GCHU",
          width: 100,
          title: this.$t("Lý do"),
          alignment: "left",
          type: "text",
          group1: this.$t("Reference"),
        },
        {
          field: "CUSTOMFIELD1",
          width: 300,
          title: this.$t("customfield1"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD2",
          width: 300,
          title: this.$t("customfield2"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD3",
          width: 100,
          title: this.$t("customfield3"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD4",
          width: 100,
          title: this.$t("customfield4"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD5",
          width: 100,
          title: this.$t("customfield6"),
          alignment: "left",
          type: "text",
        },
      ];
    },
    grdHeader_detail() {
      return [
        {
          field: "STT",
          width: 80,
          title: this.$t("no"),
          alignment: "center",
          type: "number",
        },
        {
          field: "TAI_EINVOICE_CLOUD_PK",
          width: 150,
          title: this.$t("tai_einvoce_cloud_pk"),
          alignment: "left",
          type: "number",
        },
        {
          field: "TCHAT",
          width: 80,
          title: this.$t("tchat"),
          alignment: "center",
          type: "number",
        },
        {
          field: "MHHDVU",
          width: 200,
          title: this.$t("mhhdvu"),
          alignment: "right",
          type: "text",
        },
        {
          field: "THHDVU",
          width: 250,
          title: this.$t("thhdvu"),
          alignment: "right",
          type: "text",
        },
        {
          field: "DVTINH",
          width: 100,
          title: this.$t("dvtinh"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SLUONG",
          width: 90,
          title: this.$t("so_luong"),
          alignment: "center",
          type: "number",
        },
        {
          field: "DGIA",
          width: 100,
          title: this.$t("dgia"),
          alignment: "right",
          type: "number",
        },
        {
          field: "TLCKHAU",
          width: 80,
          title: this.$t("tlckhau"),
          alignment: "center",
          type: "number",
        },
        {
          field: "TSUAT",
          width: 80,
          title: this.$t("tsuat"),
          alignment: "center",
          type: "number",
        },
        //  {
        //   field: "TIEN_THUE",
        //   width: 80,
        //   title: this.$t("tien_thue"),
        //   alignment: "center",
        //   type: "number",
        // },
        {
          field: "DEL_IF",
          width: 80,
          title: this.$t("del_if"),
          alignment: "center",
          type: "number",
        },
        {
          field: "CRT_BY",
          width: 100,
          title: this.$t("crt_by"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CRT_DT",
          width: 150,
          title: this.$t("crt_dt"),
          alignment: "left",
          type: "date",
        },
        {
          field: "MOD_BY",
          width: 100,
          title: this.$t("mod_by"),
          alignment: "right",
          type: "number",
        },
        {
          field: "MOD_DT",
          width: 100,
          title: this.$t("mod_dt"),
          alignment: "right",
          type: "number",
        },
      ];
    },
  },
  /*############### mounted #######################*/
  mounted() {
    //this.$refs.grdAPInvoiceReview.loadData();
  },

  /*############### methods #######################*/
  methods: {
    onDblClickCell(cell) {
      this.item_serial_no = cell.data.SERIAL_NO;
      this.item_invoice_no = cell.data.INVOICE_NO;
      this.item_invoice_date = cell.data.SERIAL_NO;
      this.item_sale_taxcode = cell.data.SALE_TAXCODE;
      this.item_sale_company_name = cell.data.SALE_COMPANY_NAME;
      this.item_sale_address = cell.data.SALE_ADDRESS;
      this.item_exclude_vat = cell.data.AMT_EXCLUDE_VAT;
      this.item_amt_vat = cell.data.AMT_VAT;
      this.item_include_vat = cell.data.AMT_INCLUDE_VAT;
      this.item_nlhd = cell.data.NLHDCLQUAN;
      this.item_so_hoa_don = cell.data.SHDCLQUAN;
      this.item_pk = cell.data.PK;
      this.$refs.gridview.loadData();
      console.log(cell);
    },
    toggleLeft() {
      this.showLeft = this.showLeft ? false : true;
      this.leftCols = !this.showLeft ? 0 : 6;
      this.btnIconType = !this.showLeft ? "skip_next" : "skip_prev";
    },
    onDownloadPdf() {},
    onDownloadXml() {
      for (var i = 0; i < this.selected_rows.length; i++) {
        let txtPK = this.selected_rows[i].PK;
        if (txtPK != "") {
          var url =
            "http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/Download_File_XML_v4?pk=" +
            txtPK;
          url += "&key=" + this.selected_company;
          window.open(url);
        }
      }
    },

    async onGridSelectionChanged(data) {
      // console.log(data)
      this.selected_rows = data;
    },

    async changeFile(file) {
      // console.log("file",file)
      if (file == "" || file == "undefined" || file == null) {
        return;
      }
      this.file = file;
      if (!this.selected_company) {
        return this.showNotification(
          "warning",
          this.$t("please_select_your_company_firstly"),
          "",
          5000
        );
      }
      if (this.file.type == "application/pdf") {
        if (!this.tei_einvoice_cloud_pk) {
          return this.showNotification(
            "warning",
            this.$t("please_upload_file_xml_firstly"),
            "",
            5000
          );
        }
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tei_company_pk", this.selected_company);
      formData.append("tei_einvoice_cloud_pk", this.tei_einvoice_cloud_pk);
      const res = await this.$axios({
        method: "post",
        url: "/dso/importeivfile",
        data: formData,
      });
      // console.log(res.data)
      if (res.data.success) {
        if (res.data.data && res.data.data.tei_einvoice_cloud_pk > 0) {
          this.tei_einvoice_cloud_pk = res.data.data.tei_einvoice_cloud_pk;
        }
        if (this.file.type == "application/pdf") {
          this.tei_einvoice_cloud_pk = null;
        }
        this.onSearch();
        //console.log(this.tei_einvoice_cloud_pk)
        return this.showNotification(
          "success",
          this.$t("upload_file_successfull"),
          "",
          5000
        );
      }

      return this.showNotification("error", res.message, "", 5000);
    },
    async onClickButton() {
      if (this.pdfUrlRow == "") {
        this.showNotification(
          "warning",
          this.$t("please_insert_pdf_file_first"),
          "",
          5000
        );
      } else {
        const res = await this.$axios.$get(
          "/dso/getfile?file_name=" + this.pdfUrlRow + "",
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([res], {
          type: "application/pdf",
        });
        const pdfUrl = window.URL.createObjectURL(blob);
        this.pdfUrl = pdfUrl;
        this.$nextTick(() => {
          this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
        });
      }

      //  this.$refs.ViewEInvoicePDFDialog2.dialogIsShow = true;
      //console.log(this.$refs.ViewEInvoicePDFDialog.dialogIsShow )
    },
    async onCellClick({ column, data, rowIndex, rowType }) {
      //  console.log(column);
      // console.log(data);
      if (data.PDF_URL == null || data.PDF_URL == "") {
        this.tei_einvoice_cloud_pk = data.PK;
      } else {
        this.pdfUrlRow = data.PDF_URL;
      }
    },

    onSearch() {
      this.$refs.grdAPInvoiceReview.loadData();
    },
    onDelete() {
      this.$refs.grdAPInvoiceReview.onSetMarkedDelete(true);
    },
    async onSave() {
      let requireCol = [];
      let validate = this.$refs.grdAPInvoiceReview.onCheckValid(requireCol);
      if (validate) {
        this.$refs.grdAPInvoiceReview.saveData();
      }
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "ac_sel_6010025_compbyuser_v2",
            para: [this.user.USER_ID],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );

          break;
        // case "form_no":
        //   const dso_form_no_list = {
        //     type: "list",
        //     selpro: "AC_SEL_6095300_FORM_NO",
        //     para: [this.selected_company],
        //   };
        //   this.form_no_list = await this._dsoCall(dso_form_no_list, "select", false);
        //   if (this.form_no_list != null) {
        //     this.selected_form_no = this.form_no_list[0].VAL;
        //   }

        //   break;
        // case "ei_status":
        //   const dso_status_list = {
        //     type: "list",
        //     selpro: "AC_SEL_6095300_STATUS",
        //     para: [this.selected_company],
        //   };
        //   this.status_list = await this._dsoCall(
        //     dso_status_list,
        //     "select",
        //     false
        //   );
        //   if (this.status_list != null) {
        //     this.selected_status = this.status_list[0].VAL;
        //   }
        //   break;
      }
    },
    changedFromDate(obj) {
      let date_from = moment(obj.value).format("YYYYMMDD");
      this.dt_from = date_from;
    },
    changedToDate(obj) {
      let date_to = moment(obj.value).format("YYYYMMDD");
      this.dt_to = date_to;
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
  <!-- ================================================================= END SCRIPT  ============================================================================================== -->
