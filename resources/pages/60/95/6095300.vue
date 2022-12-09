  <!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
  <template>
  <v-container fluid v-resize="onResize">
    <v-row no-gutters>
      <v-col :cols="12 - RightCols">
        <GwGridLayout
          dense
          flat
          containerClass="py-0"
          @callBackHeight="parentLayoutHeight = $event"
        >
          <!-- <BaseTabs @changed="tabChanged">
      <BaseTab :name="$t('leak')" tabname="leak" :eager="true"> -->
          <GwGridLayout
            child
            dense
            flat
            align="start"
            colsPerRow="1"
            containerClass="py-0 px-1"
            percentHeight="95"
            @callBackHeight="childrenLayoutHeight = $event"
          >
            <BaseSelect
              colspan="4"
              :label="$t('company')"
              v-model="selected_company"
              :lstData="company_list"
              item-text="PARTNER_NAME"
              item-value="TCO_COMPANY_PK"
            />

            <GwFlexBox colspan="4" class="d-flex justify-start align-center">
              <v-sheet width="30%" class="mr-2">
                <BaseSelect
                  :label="$t('date_type')"
                  v-model="date_type"
                  :lstData="date_type_list"
                  item-text="NAME"
                  item-value="CODE"
                />
              </v-sheet>
              <v-sheet width="32%" class="mr-2">
                <BaseDatePicker
                  default
                  :label="$t('date_from')"
                  v-model="dt_from"
                />
              </v-sheet>
              <v-sheet width="32%">
                <BaseDatePicker
                  default
                  :label="$t('date_to')"
                  v-model="dt_to"
                />
              </v-sheet>
            </GwFlexBox>
            <GwFlexBox colspan="4" class="d-flex justify-end align-center">
              <BaseButton
                icon_type="search"
                btn_type="icon"
                :btn_text="$t('search')"
                :disabled="isProcessing"
                @onclick="onSearch"
              />
              <BaseButton
                icon_type="pdf"
                btn_type="icon"
                :btn_text="$t('view_pdf')"
                :disabled="isProcessing"
                @onclick="onClickButton()"
              />
              <BaseButton
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
              />
              <BaseButton
                btn_type="icon"
                icon_type="print"
                :btn_text="$t('detail_report')"
                @onclick="onReportDetails"
              />
              <BaseButton
                btn_type="icon"
                icon_type="excel"
                :btn_text="$t('master_report')"
                @onclick="onReportMaster"
              />
              <v-btn icon tile :color="currentTheme" @click="toggleRight">
                <v-icon v-if="!showRight">mdi-skip-previous</v-icon>
                <v-icon v-if="showRight">mdi-skip-next</v-icon>
              </v-btn>
            </GwFlexBox>

            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('serial_no')"
              v-model="SERIAL_NO"
            ></BaseInput>
            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('invoice_no')"
              v-model="INVOICE_NO"
            ></BaseInput>
            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('Seller_code')"
              v-model="seller_no"
            ></BaseInput>
            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('Seller_name')"
              v-model="seller_name"
            ></BaseInput>
            <BaseSelect
              colspan="2"
              :label="$t('form_no')"
              v-model="selected_form_no"
              :lstData="form_no_list"
              item-text="NAME"
              item-value="CODE"
            />
            <BaseSelect
              colspan="2"
              :label="$t('ei_status')"
              v-model="selected_status"
              :lstData="status_list"
              item-text="NAME"
              item-value="CODE"
            />
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('mtc')"
              v-model="matracuu"
            ></BaseInput>
            <v-file-input
              class="pt-0 mt-0"
              colspan="3"
              ref="refFile"
              prepend-icon="mdi-paperclip"
              :label="$t('attach_file')"
              @change="changeFile"
              v-model="file"
            ></v-file-input>
            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('website')"
              v-model="WEB_SITE"
            ></BaseInput>
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('mcqt')"
              v-model="macqt"
            ></BaseInput>
            <BaseSelect
              colspan="1"
              :label="$t('file_integrity')"
              v-model="file_integrity"
              :lstData="file_integrity_list"
              item-text="NAME"
              item-value="CODE"
            />
            <BaseGridView
              colspan="12"
              :header="grd_header_m"
              :setting="true"
              :headertype="1"
              sel_procedure="EI_SEL_6090300_SEL_TEI_EINVOICE_CLOUD"
              @onSelectionDataChanged="onGridSelectionChanged"
              ref="grdAPInvoiceReview"
              :height="gridHeight"
              :selectionmode="'singlerow'"
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
                this.file_integrity,
                this.date_type,
              ]"
              @cellDblClick="onDblClickCell"
              @cellClick="onCellClick"
              upd_procedure="EI_UPD_6090300_EINVOICE_CLOUD"
              :editable="true"
              :update_paras="['PK']"
              :menu_cd="'6095300'"
              :id="'grdAPInvoiceReview'"
              allow-cookie
            /> </GwGridLayout
        ></GwGridLayout>
      </v-col>
      <v-col v-show="showRight" :cols="RightCols">
        <GwGridLayout
          dense
          flat
          containerClass="py-0"
          @callBackHeight="parentLayoutHeight = $event"
        >
          <!-- <BaseTabs @changed="tabChanged">
      <BaseTab :name="$t('leak')" tabname="leak" :eager="true"> -->
          <GwGridLayout
            child
            dense
            flat
            align="start"
            colsPerRow="1"
            containerClass="py-0 px-1"
            percentHeight="95"
            @callBackHeight="childrenLayoutHeight = $event"
          >
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('item_serial_no')"
              v-model="item_serial_no"
            ></BaseInput>
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('item_invoice_no')"
              v-model="item_invoice_no"
            ></BaseInput>
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('invoice_date')"
              v-model="item_invoice_date"
            ></BaseInput>
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('sale_taxcode')"
              v-model="item_sale_taxcode"
            ></BaseInput>

            <BaseInput
              colspan="6"
              clearable
              dense
              hide-details
              :label="$t('sale_company_name')"
              v-model="item_sale_company_name"
            ></BaseInput>
            <BaseInput
              colspan="6"
              clearable
              dense
              hide-details
              :label="$t('sale_address')"
              v-model="item_sale_address"
            ></BaseInput>

            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('amt_exclude_vat')"
              number="0"
              v-model="item_exclude_vat"
            ></BaseInput>
            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('amt_vat')"
              number="0"
              v-model="item_amt_vat"
            ></BaseInput>
            <BaseInput
              colspan="2"
              clearable
              dense
              hide-details
              :label="$t('amt_include_vat')"
              number="0"
              v-model="item_include_vat"
            ></BaseInput>
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('so_hoa_don')"
              v-model="item_so_hoa_don"
            ></BaseInput>
            <BaseInput
              colspan="3"
              clearable
              dense
              hide-details
              :label="$t('ngay_lap_hoa_don')"
              v-model="item_nlhd"
            ></BaseInput>
            <BaseGridView
              colspan="12"
              ref="gridview"
              :autoresize="false"
              :header="grd_header_d"
              :setting="true"
              :multiselect="true"
              :headertype="1"
              :height="gridHeight"
              sel_procedure="EI_SEL_6090300_SEL_TEI_EINVOICED_LOUD"
              :filter_paras="[this.item_pk]"
              :menu_cd="'6095300'"
              :id="'gridview'"
              allow-cookie
            /> </GwGridLayout
        ></GwGridLayout>
      </v-col>
    </v-row>
    <view-einvoice-pdf-dialog
      ref="ViewEInvoicePDFDialog"
      :src_pdfUrl="pdfUrl"
    ></view-einvoice-pdf-dialog>

    <GwLoading :visible="showLoading" />
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
    parentLayoutHeight: 0,
    childrenLayoutHeight: 0,
    date_type: "invoice_date",
    date_type_list: [
      { CODE: "invoice_date", NAME: "Invoice" },
      { CODE: "upload_date", NAME: "Upload" },
    ],
    file_integrity: "",
    file_integrity_list: [
      { CODE: "", NAME: "None" },
      { CODE: "Yes", NAME: "Yes" },
      { CODE: "No", NAME: "No" },
    ],
    grd_header_m: [],
    grd_header_d: [],
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
    RightCols: 5,
    selected_rows: [],
    showRight: true,
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

    html_handler: null,
    showLoading: false,
  }),
  /*############### created #######################*/
  async created() {
    this.grdHeader();
    this.grdHeader_detail();
    this.getListCodes("company");
    this.getListCodes("form_no");
    this.getListCodes("ei_status");

    // this.html_handler = require("./js/EiExcelHandler.js");
    // if(!!this.html_handler) {
    //     Object.assign(this, this.html_handler.default);
    // }
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
    gridHeight() {
      return this._calculateHeight(this.childrenLayoutHeight, 50);
    },
    cardHeight() {
      return this._calculateHeight(this.childrenLayoutHeight, 90);
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
  },
  /*############### mounted #######################*/
  mounted() {
    //this.$refs.grdAPInvoiceReview.loadData();
  },

  /*############### methods #######################*/
  methods: {
    async onReportMaster() {
      let exceljs = require("@/plugins/exceljs.js");
      if (!!exceljs) {
        exceljs = exceljs.default;
      }
      let report_path = "report/60/95/rpt_6095300_2.xlsx";

      this.showLoading = true;
      let dso = {
        type: "grid",
        selpro: "AC_RPT_6095300_M_2",
        para: [
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
          this.date_type,
        ],
      };
      let datas = await this._dsoCall(dso, "select", false);

      if (datas && datas.length <= 0) {
        this.showNotification("warning", this.$t("no_data_found"), "", 4000);
        return;
      }
      await exceljs.createWorkbook(this, report_path);
      let worksheet = exceljs.worksheet();
      exceljs.setWorksheet("Total");

      let startRow = 3;
      let totalRow = startRow + datas.length;
      let totalData = { TOTAL_TEXT: "GRAND TOTAL" };

      let noneSumCols = ["AMT_INCLUDE_VAT", "AMT_VAT"];
      let keys = Object.keys(datas[0]);

      keys.forEach((key) => {
        let vals = datas.map((q) =>
          isNaN(q[key]) || q[key] == null ? 0 : q[key]
        );
        let sumVal = 0;
        let check = true;
        noneSumCols.forEach((e) => {
          if (key == e) {
            let uniq = [...new Set(vals)];
            sumVal = this._Total(uniq);
            check = false;
          }
        });
        if (check) {
          sumVal = this._Total(vals);
        }
        totalData[key] = sumVal;
      });
      // console.log(totalData)
      exceljs.insertRows(this, startRow, datas);
      exceljs.insertRowData(this, totalRow, totalData);
      //worksheet.mergeCells(`A${totalRow}:O${totalRow}`);

      exceljs.dowloadWorkbook(
        this,
        "report_" + this.dt_from + "-" + this.dt_to + ".xlsx"
      );
      this.showLoading = false;
    },
    async onReportDetails() {
      let exceljs = require("@/plugins/exceljs.js");
      if (!!exceljs) {
        exceljs = exceljs.default;
      }
      let report_path = "report/60/95/rpt_6095300.xlsx";
      this.showLoading = true;
      let dso = {
        type: "grid",
        selpro: "AC_RPT_6095300_M",
        para: [
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
          this.date_type,
        ],
      };
      let datas = await this._dsoCall(dso, "select", false);

      if (datas && datas.length <= 0) {
        this.showNotification("warning", this.$t("no_data_found"), "", 4000);
        return;
      }
      let _arr = [];
      let _start = 1;
      let _end = 0;
      let pos = 1;
      for (let i = 0; i < datas.length + 1; i++) {
        const e = datas[i];
        const _e = datas[i + 1];
        if (i + 1 < datas.length) {
          if (e.TEI_EINVOICE_CLOUD_PK == _e.TEI_EINVOICE_CLOUD_PK) {
            pos++;
          } else {
            _end = pos;
            _arr.push({ start: _start, end: _end });
            _start = _end + 1;
            pos++;
          }
        } else if (i == datas.length) {
          _end = pos;
          _arr.push({ start: _start, end: _end });
        }
      }

      await exceljs.createWorkbook(this, report_path);
      let worksheet = exceljs.worksheet();
      exceljs.setWorksheet("Sheet1");

      let startRow = 3;
      let totalRow = startRow + datas.length;
      let totalData = { TOTAL_TEXT: "GRAND TOTAL" };
      // let netValues = datas.map( q =>  (  isNaN(q["TOTAL_FINAL_NET_RECEIVE_USD"]) ||  q["TOTAL_FINAL_NET_RECEIVE_USD"]== null  ) ? 0 :  q["TOTAL_FINAL_NET_RECEIVE_USD"]  );
      //  let sumNet = this._Total(netValues);
      // let sumNetEng = this._num2EngText(String(sumNet), "USD");
      // let header = { NET_ENG: sumNetEng, ...dataComp[0] };
      let noneSumCols = ["AMT_INCLUDE_VAT", "AMT_VAT"];
      let keys = Object.keys(datas[0]);

      keys.forEach((key) => {
        let vals = datas.map((q) =>
          isNaN(q[key]) || q[key] == null ? 0 : q[key]
        );
        let sumVal = 0;
        let check = true;
        noneSumCols.forEach((e) => {
          if (key == e) {
            let uniq = [...new Set(vals)];
            sumVal = this._Total(uniq);
            check = false;
          }
        });
        if (check) {
          sumVal = this._Total(vals);
        }
        totalData[key] = sumVal;
      });
      // console.log(totalData)
      exceljs.insertRows(this, startRow, datas);
      exceljs.insertRowData(this, totalRow, totalData);
      worksheet.mergeCells(`A${totalRow}:O${totalRow}`);
      _arr.forEach((e) => {
        for (let i = e.start + 1; i <= e.end; i++) {
          exceljs.getCellByAddress(this, `W${i + startRow - 1}`).value = "";
          exceljs.getCellByAddress(this, `X${i + startRow - 1}`).value = "";
        }
        //  worksheet.mergeCells(`C${e.start+startRow-1}:C${e.end+startRow-1}`);
        //  worksheet.mergeCells(`D${e.start+startRow-1}:D${e.end+startRow-1}`);
        //  worksheet.mergeCells(`E${e.start+startRow-1}:E${e.end+startRow-1}`);
        //  worksheet.mergeCells(`F${e.start+startRow-1}:F${e.end+startRow-1}`);
        //  worksheet.mergeCells(`G${e.start+startRow-1}:G${e.end+startRow-1}`);
        //  worksheet.mergeCells(`H${e.start+startRow-1}:H${e.end+startRow-1}`);
        //  worksheet.mergeCells(`I${e.start+startRow-1}:I${e.end+startRow-1}`);
        //  worksheet.mergeCells(`J${e.start+startRow-1}:J${e.end+startRow-1}`);
        //  worksheet.mergeCells(`K${e.start+startRow-1}:K${e.end+startRow-1}`);
        //  worksheet.mergeCells(`L${e.start+startRow-1}:L${e.end+startRow-1}`);
        //  worksheet.mergeCells(`W${e.start+startRow-1}:W${e.end+startRow-1}`);
        //worksheet.mergeCells(`X${e.start+startRow-1}:X${e.end+startRow-1}`);
        //worksheet.mergeCells(`Y${e.start+startRow-1}:Y${e.end+startRow-1}`);
        //  worksheet.mergeCells(`Z${e.start+startRow-1}:Z${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AA${e.start+startRow-1}:AA${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AB${e.start+startRow-1}:AB${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AC${e.start+startRow-1}:AC${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AD${e.start+startRow-1}:AD${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AE${e.start+startRow-1}:AE${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AF${e.start+startRow-1}:AF${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AG${e.start+startRow-1}:AG${e.end+startRow-1}`);
        //  worksheet.mergeCells(`AH${e.start+startRow-1}:AH${e.end+startRow-1}`);
      });
      exceljs.dowloadWorkbook(
        this,
        "report_" + this.dt_from + "-" + this.dt_to + ".xlsx"
      );
      this.showLoading = false;
    },
    onDblClickCell(cell) {
      // console.log(cell);
    },
    toggleRight() {
      this.showRight = this.showRight ? false : true;
      this.RightCols = !this.showRight ? 0 : 5;
      this.btnIconType = !this.showRight ? "skip_next" : "skip_prev";
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
          "please_select_your_company_firstly",
          "",
          5000
        );
      }
      if (this.file.type == "application/pdf") {
        if (!this.tei_einvoice_cloud_pk) {
          return this.showNotification(
            "warning",
            "please_upload_file_xml_firstly",
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
          "upload_file_successfull",
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
          "please_insert_pdf_file_first",
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
      // this.pdfUrl = pdfUrlExcel;
      // this.$nextTick(() => {
      //   this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      // });
      //  this.$refs.ViewEInvoicePDFDialog2.dialogIsShow = true;
      //console.log(this.$refs.ViewEInvoicePDFDialog.dialogIsShow )
    },
    async onCellClick({ column, data, rowIndex, rowType }) {
      //  console.log(column);
      console.log(data);
      if (data.PDF_URL == null || data.PDF_URL == "") {
        this.tei_einvoice_cloud_pk = data.PK;
      } else {
        this.pdfUrlRow = data.PDF_URL;
      }

      this.item_serial_no = data.SERIAL_NO;
      this.item_invoice_no = data.INVOICE_NO;
      this.item_invoice_date = data.SERIAL_NO;
      this.item_sale_taxcode = data.SALE_TAXCODE;
      this.item_sale_company_name = data.SALE_COMPANY_NAME;
      this.item_sale_address = data.SALE_ADDRESS;
      this.item_exclude_vat = data.AMT_EXCLUDE_VAT;
      this.item_amt_vat = data.AMT_VAT;
      this.item_include_vat = data.AMT_INCLUDE_VAT;
      this.item_nlhd = data.NLHDCLQUAN;
      this.item_so_hoa_don = data.SHDCLQUAN;
      this.item_pk = data.PK;
      this.$refs.gridview.loadData();
    },

    async onSearch() {
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
        case "form_no":
          const dso_form_no_list = await this._getCommonCode("ACEIS010");
          //  console.log(dso_form_no_list)
          if (dso_form_no_list != null) {
            this.form_no_list = dso_form_no_list;
            this.selected_form_no = dso_form_no_list[0].CODE;
          }

          break;
        case "ei_status":
          const dso_status_list = {
            type: "list",
            selpro: "AC_SEL_6095300_STATUS",
            para: [this.selected_company],
          };
          this.status_list = await this._dsoCall(
            dso_status_list,
            "select",
            false
          );
          if (this.status_list != null) {
            this.selected_status = this.status_list[0].VAL;
          }
          break;
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
    grdHeader() {
      this.grd_header_m = [
        {
          field: "INDEX",
          width: 80,
          title: this.$t("stt"),
          alignment: "right",
          type: "number",
          visible: false,
        },
        {
          field: "PDFYN",
          width: 100,
          title: this.$t("pdf_yn"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SO_NUMBER",
          width: 80,
          title: this.$t("so_number"),
          alignment: "right",
          type: "number",
        },
        {
          field: "SERIAL_NO",
          width: 100,
          title: this.$t("serial_no"),
          alignment: "left",
          type: "text",
        },
        {
          field: "INVOICE_NO",
          width: 100,
          title: this.$t("invoice_no"),
          alignment: "left",
          type: "text",
        },
        {
          field: "INVOICE_DATE",
          width: 100,
          title: this.$t("invoice_date"),
          alignment: "left",
          type: "date",
        },
        {
          field: "SALE_TAXCODE",
          width: 100,
          title: this.$t("sale_taxcode"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SALE_COMPANY_NAME",
          width: 300,
          title: this.$t("sale_company_name"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SALE_ADDRESS",
          width: 300,
          title: this.$t("sale_address"),
          alignment: "left",
          type: "text",
        },
        {
          field: "AMT_EXCLUDE_VAT",
          width: 100,
          title: this.$t("amt_exclude_vat"),
          alignment: "right",
          type: "number",
        },
        {
          field: "AMT_VAT",
          width: 100,
          title: this.$t("amt_vat"),
          alignment: "right",
          type: "number",
        },
        {
          field: "item11",
          width: 100,
          title: "Chiết khấu thương mai",
          alignment: "right",
          type: "number",
        },
        {
          field: "item12",
          width: 100,
          title: "Tổng phí",
          alignment: "right",
          type: "number",
        },
        {
          field: "AMT_INCLUDE_VAT",
          width: 100,
          title: this.$t("amt_include_vat"),
          alignment: "right",
          type: "number",
        },
        {
          field: "CURRENCY",
          width: 100,
          title: this.$t("currency"),
          alignment: "left",
          type: "text",
        },
        {
          field: "item15",
          width: 100,
          title: "Trạng thái hóa đơn",
          alignment: "left",
          type: "text",
        },
        {
          field: "item16",
          width: 100,
          title: "Kết qủa kiểm tra",
          alignment: "left",
          type: "text",
        },
        {
          field: "item17",
          width: 100,
          title: "Hóa đơn liên quan",
          alignment: "left",
          type: "text",
        },
        {
          field: "EX_RATE",
          width: 100,
          title: this.$t("ex_rate"),
          alignment: "right",
          type: "number",
        },
        {
          field: "item19",
          width: 100,
          title: "Tổng tiền qui đổi",
          alignment: "left",
          type: "text",
        },
        {
          field: "item20",
          width: 100,
          title: this.$t("website"),
          alignment: "left",
          type: "text",
        },
        {
          field: "MCCQT",
          width: 300,
          title: this.$t("mccqt"),
          alignment: "left",
          type: "text",
        },
        {
          field: "item22",
          width: 100,
          title: "Mã tra cứu",
          alignment: "left",
          type: "text",
        },
        {
          field: "TCHDON",
          width: 100,
          title: this.$t("tchdon"),
          alignment: "right",
          type: "number",
          group1: "Reference",
        },
        {
          field: "LHDCLQUAN",
          width: 100,
          title: this.$t("lhdclquan"),
          alignment: "right",
          type: "number",
          group1: "Reference",
        },
        {
          field: "KHMSHDCLQUAN",
          width: 100,
          title: this.$t("khmshdclquan"),
          alignment: "right",
          type: "number",
          group1: "Reference",
        },
        {
          field: "KHHDCLQUAN",
          width: 100,
          title: this.$t("khhdclquan"),
          alignment: "right",
          type: "number",
          group1: "Reference",
        },
        {
          field: "SHDCLQUAN",
          width: 100,
          title: this.$t("shdclquan"),
          alignment: "left",
          type: "text",
          group1: "Reference",
        },
        {
          field: "NLHDCLQUAN",
          width: 100,
          title: this.$t("nlhdclquan"),
          alignment: "left",
          type: "text",
          group1: "Reference",
        },
        {
          field: "GCHU",
          width: 100,
          title: this.$t("gchu"),
          alignment: "left",
          type: "text",
          group1: "Reference",
        },
        {
          field: "FILE_INTEGRITY",
          width: 100,
          title: this.$t("file_integrity"),
          alignment: "center",
          type: "text",
        },
        {
          field: "SIGNINGTIME_NBAN",
          width: 300,
          title: this.$t("signingtime_nban"),
          alignment: "left",
          type: "text",
        },
        {
          field: "SIGNINGTIME_CQT",
          width: 300,
          title: this.$t("signingtime_cqt"),
          alignment: "left",
          type: "text",
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
          title: this.$t("customfield5"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD6",
          width: 300,
          title: this.$t("customfield6"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD7",
          width: 300,
          title: this.$t("customfield7"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD8",
          width: 100,
          title: this.$t("customfield8"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD9",
          width: 100,
          title: this.$t("customfield9"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CUSTOMFIELD10",
          width: 100,
          title: this.$t("customfield10"),
          alignment: "left",
          type: "text",
        },
      ];
    },
    grdHeader_detail() {
      this.grd_header_d = [
        {
          field: "STT",
          width: 80,
          title: this.$t("no"),
          alignment: "center",
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
          alignment: "left",
          type: "text",
        },
        {
          field: "THHDVU",
          width: 250,
          title: this.$t("thhdvu"),
          alignment: "left",
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
          alignment: "right",
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
          alignment: "right",
          type: "number",
        },
        {
          field: "TSUAT",
          width: 80,
          title: this.$t("tsuat"),
          alignment: "right",
          type: "number",
        },
        {
          field: "STCKHAU",
          width: 80,
          title: this.$t("stckhau"),
          alignment: "right",
          type: "number",
        },
        {
          field: "THTIEN",
          width: 80,
          title: this.$t("ThTien"),
          alignment: "right",
          type: "number",
        },
        //   {  field: "DEL_IF",  width: 80,  title: this.$t("del_if"),  alignment: "center",  type: "number",},
        //   {  field: "CRT_BY",  width: 100,  title: this.$t("crt_by"),  alignment: "left",  type: "text",},
        //   {  field: "CRT_DT",  width: 150,  title: this.$t("crt_dt"),  alignment: "left",  type: "date",},
        //   {  field: "MOD_BY",  width: 100,  title: this.$t("mod_by"),  alignment: "right",  type: "number",},
        //   {  field: "MOD_DT",  width: 100,  title: this.$t("mod_dt"),  alignment: "right",  type: "number",},
      ];
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
  <!-- ================================================================= END SCRIPT  ============================================================================================== -->
