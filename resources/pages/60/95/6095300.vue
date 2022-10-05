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
              <BaseButton btn_type="icon" icon_type="print" :btn_text="$t('detail_report')" @onclick="onReport2"/>
              <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('master_report')" @onclick="onReport"/>
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
                item-value="CODE"
              />
            </v-col>
            <v-col md="2">
              <BaseSelect
                :label="$t('ei_status')"
                v-model="selected_status"
                :lstData="status_list"
                item-text="NAME"
                item-value="CODE"
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
            <v-col sm="3" md="3">
              <v-file-input
                ref="refFile"
                prepend-icon="mdi-paperclip"
                :label="$t('attach_file')"
                @change="changeFile"
                v-model="file"
              ></v-file-input>
            </v-col>
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
                :header="grd_header_m"
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
                @cellClick="onCellClick"
                upd_procedure="EI_UPD_6090300_EINVOICE_CLOUD"
                :editable="true"
                :update_paras="['PK']"
                :menu_cd="'6095300'"
                :id="'grdAPInvoiceReview'"
                allow-cookie
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
                :label="$t('ngay_lap_hoa_don')"
                v-model="item_nlhd"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col>
              <BaseGridView
                ref="gridview"
                :autoresize="false"
                :header="grd_header_d"
                :setting="true"
                :multiselect="true"
                :headertype="1"
                :height="limitHeightmin"
                sel_procedure="EI_SEL_6090300_SEL_TEI_EINVOICED_LOUD"
                :filter_paras="[this.item_pk]"
                :menu_cd="'6095300'"
                :id="'gridview'"
                allow-cookie
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
     <view-einvoice-pdf-dialog
      ref="ViewEInvoicePDFDialog"
      :src_pdfUrl="pdfUrl"
    ></view-einvoice-pdf-dialog>
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
    grd_header_m:[],
    grd_header_d:[],
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

    html_handler:null
  }),
  /*############### created #######################*/
  async created() {
    this.grdHeader()
    this.grdHeader_detail()
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
    async onReport() {
       let exceljs =  require("@/plugins/exceljs.js");
        if(!!exceljs) {
            exceljs = exceljs.default;
        }
         let report_path = "report/60/95/rpt_6095300_2.xlsx";

             let dso =  {type: 'grid', selpro: 'AC_RPT_6095300_M_2', para: [
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
              ] };
            let datas = await this._dsoCall(dso, 'select', false);
             if(datas && datas.length <= 0)  {
                this.showNotification("warning", this.$t("no_data_found"), "", 4000);
                return;
            }
            await exceljs.createWorkbook(this, report_path);
            let worksheet = exceljs.worksheet();
            exceljs.setWorksheet("Total");

            let startRow = 3;
            let totalRow = startRow + datas.length;
            let totalData = {TOTAL_TEXT: "GRAND TOTAL"};

            let noneSumCols=['AMT_INCLUDE_VAT','AMT_VAT']
            let keys = Object.keys(datas[0]);

            keys.forEach(key => {
                let vals = datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
                let sumVal=0
                let check=true
                noneSumCols.forEach(e => {
                  if(key==e){    
                    let uniq = [...new Set(vals)]
                     sumVal = this._Total(uniq);
                     check=false
                  }
                });
               if(check){
                 sumVal = this._Total(vals);
               }
                totalData[key] = sumVal;
            })
           // console.log(totalData)
            exceljs.insertRows(this,startRow, datas);
            exceljs.insertRowData(this, totalRow, totalData);
            //worksheet.mergeCells(`A${totalRow}:O${totalRow}`);

            exceljs.dowloadWorkbook(this, "report_"+this.dt_from+"-"+this.dt_to+ ".xlsx");
    },
    async onReport2(){
        let exceljs =  require("@/plugins/exceljs.js");
        if(!!exceljs) {
            exceljs = exceljs.default;
        }
         let report_path = "report/60/95/rpt_6095300.xlsx";

             let dso =  {type: 'grid', selpro: 'AC_RPT_6095300_M', para: [
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
              ] };
            let datas = await this._dsoCall(dso, 'select', false);

            if(datas && datas.length <= 0)  {
                this.showNotification("warning", this.$t("no_data_found"), "", 4000);
                return;
            }
            let _arr=[]
            let _start=1
            let _end= 0
            let pos=1
            for (let i = 0; i < datas.length+1; i++) {
              const e = datas[i];
              const _e = datas[i+1];
              if(i+1<datas.length){
                  if(e.TEI_EINVOICE_CLOUD_PK==_e.TEI_EINVOICE_CLOUD_PK){
                    pos++
                   }else{
                    _end=pos
                    _arr.push({start:_start,end:_end})
                    _start=_end+1
                    pos++
                    }
              }else if(i==datas.length){
                _end=pos
                _arr.push({start:_start,end:_end})
              }
            
            }
        
            await exceljs.createWorkbook(this, report_path);
            let worksheet = exceljs.worksheet();
            exceljs.setWorksheet("Sheet1");

            let startRow = 3;
            let totalRow = startRow + datas.length;
            let totalData = {TOTAL_TEXT: "GRAND TOTAL"};
           // let netValues = datas.map( q =>  (  isNaN(q["TOTAL_FINAL_NET_RECEIVE_USD"]) ||  q["TOTAL_FINAL_NET_RECEIVE_USD"]== null  ) ? 0 :  q["TOTAL_FINAL_NET_RECEIVE_USD"]  );
          //  let sumNet = this._Total(netValues);
           // let sumNetEng = this._num2EngText(String(sumNet), "USD");
           // let header = { NET_ENG: sumNetEng, ...dataComp[0] };
            let noneSumCols=['AMT_INCLUDE_VAT','AMT_VAT']
            let keys = Object.keys(datas[0]);
            
            keys.forEach(key => {
                let vals = datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
                let sumVal=0
                let check=true
                noneSumCols.forEach(e => {
                  if(key==e){    
                    let uniq = [...new Set(vals)]
                     sumVal = this._Total(uniq);
                     check=false
                  }
                });
               if(check){
                 sumVal = this._Total(vals);
               }
                totalData[key] = sumVal;
            })
           // console.log(totalData)
            exceljs.insertRows(this,startRow, datas);
            exceljs.insertRowData(this, totalRow, totalData);
            worksheet.mergeCells(`A${totalRow}:O${totalRow}`);
            _arr.forEach(e=>{
              for (let i = e.start+1; i <= e.end; i++) {
                exceljs.getCellByAddress(this, `W${i+startRow-1}`).value =''
                exceljs.getCellByAddress(this, `X${i+startRow-1}`).value =''
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
               })
            exceljs.dowloadWorkbook(this, "report_"+this.dt_from+"-"+this.dt_to+ ".xlsx");
    },
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
     // console.log(cell);
    },
    toggleLeft() {
      this.showLeft = this.showLeft ? false : true;
      this.leftCols = !this.showLeft ? 0 : 6;
      this.btnIconType = !this.showLeft ? "skip_next" : "skip_prev";
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
          ("please_select_your_company_firstly"),
          "",
          5000
        );
      }
      if (this.file.type == "application/pdf") {
        if (!this.tei_einvoice_cloud_pk) {
          return this.showNotification(
            "warning",
            ("please_upload_file_xml_firstly"),
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
          ("upload_file_successfull"),
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
          ("please_insert_pdf_file_first"),
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
    },

  async  onSearch() {
     this.$refs.grdAPInvoiceReview.loadData()
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
             this.form_no_list=dso_form_no_list
             this.selected_form_no = dso_form_no_list[0].CODE;
           }

           break;
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
      grdHeader() {
      this.grd_header_m=[
      	{  field: "INDEX",  width: 80,  title: ("stt"),  alignment: "right",  type: "number",}, 
       {  field: "PDFYN",  width: 100,  title: ("pdf_yn"),  alignment: "left",  type: "text",},
       {  field: "SO_NUMBER",  width: 80,  title: ("so_number"),  alignment: "right",  type: "number",},
       {  field: "SERIAL_NO",  width: 100,  title: ("serial_no"),  alignment: "left",  type: "text",},
       {  field: "INVOICE_NO",  width: 100,  title: ("invoice_no"),  alignment: "left",  type: "number",},
       {  field: "INVOICE_DATE",  width: 100,  title: ("invoice_date"),  alignment: "left",  type: "text",},
       {  field: "SALE_TAXCODE",  width: 100,  title: ("sale_taxcode"),  alignment: "left",  type: "text",},
       {  field: "SALE_COMPANY_NAME",  width: 300,  title: ("sale_company_name"),  alignment: "left",  type: "text",},
       {  field: "SALE_ADDRESS",  width: 300,  title: ("sale_address"),  alignment: "left",  type: "text",},
       {  field: "AMT_EXCLUDE_VAT",  width: 100,  title: ("amt_exclude_vat"),  alignment: "right",  type: "number",},
       {  field: "AMT_VAT",  width: 100,  title: ("amt_vat"),  alignment: "right",  type: "number",},
       {  field: "item11",  width: 100,  title: ("Chiết khấu thương mai"),  alignment: "right",  type: "number",},
       {  field: "item12",  width: 100,  title: ("Tổng phí"),  alignment: "right",  type: "number",},
       {  field: "AMT_INCLUDE_VAT",  width: 100,  title: ("amt_include_vat"),  alignment: "right",  type: "number",},
       {  field: "CURRENCY",  width: 100,  title: ("currency"),  alignment: "left",  type: "text",},
       {  field: "item15",  width: 100,  title: ("Trạng thái hóa đơn"),  alignment: "left",  type: "text",},
       {  field: "item16",  width: 100,  title: ("Kết qủa kiểm tra"),  alignment: "left",  type: "text",},
       {  field: "item17",  width: 100,  title: ("Hóa đơn liên quan"),  alignment: "left",  type: "text",},
       {  field: "EX_RATE",  width: 100,  title: ("Tỷ giá"),  alignment: "right",  type: "number",},
       {  field: "item19",  width: 100,  title: ("Tổng tiền qui đổi"),  alignment: "left",  type: "text",},
       {  field: "item20",  width: 100,  title: ("Website"),  alignment: "left",  type: "text",},
       {  field: "MCCQT",  width: 300,  title: ("mccqt"),  alignment: "left",  type: "text",},
       {  field: "item22",  width: 100,  title: ("Mã tra cứu"),  alignment: "left",  type: "text",},
       {  field: "TCHDON",  width: 100,  title: ("tchdon"),  alignment: "right",  type: "number",  group1: ("Reference"),},
       {  field: "LHDCLQUAN",  width: 100,  title: ("lhdclquan"),  alignment: "right",  type: "number",  group1: ("Reference"),},
       {  field: "KHMSHDCLQUAN",  width: 100,  title: ("Ký hiệu mẫu hóa đơn"),  alignment: "right",  type: "number",  group1: ("Reference"),},
       {  field: "KHHDCLQUAN",  width: 100,  title: ("Ký hiệu hóa đơn"),  alignment: "right",  type: "number",  group1: ("Reference"),},
       {  field: "SHDCLQUAN",  width: 100,  title: ("Số hóa đơn"),  alignment: "left",  type: "text",  group1: ("Reference"),},
       {  field: "NLHDCLQUAN",  width: 100,  title: ("Ngày lập hóa đơn"),  alignment: "left",  type: "text",  group1: ("Reference"),},
       {  field: "GCHU",  width: 100,  title: ("Lý do"),  alignment: "left",  type: "text",  group1: ("Reference"),},
       {  field: "FILE_INTEGRITY",  width: 100,  title: ("Cấu trúc file nguyên vẹn"),  alignment: "center",  type: "text",},
       {  field: "SIGNINGTIME_NBAN",  width: 300,  title: ("signingtime_nban"),  alignment: "left",  type: "text",},
       {  field: "SIGNINGTIME_CQT",  width: 300,  title: ("signingtime_cqt"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD1",  width: 300,  title: ("customfield1"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD2",  width: 300,  title: ("customfield2"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD3",  width: 100,  title: ("customfield3"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD4",  width: 100,  title: ("customfield4"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD5",  width: 100,  title: ("customfield5"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD6",  width: 300,  title: ("customfield6"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD7",  width: 300,  title: ("customfield7"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD8",  width: 100,  title: ("customfield8"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD9",  width: 100,  title: ("customfield9"),  alignment: "left",  type: "text",},
       {  field: "CUSTOMFIELD10", width: 100,  title: ("customfield10"),  alignment: "left",  type: "text",},
      ];
    },
    grdHeader_detail() {
      this.grd_header_d= [{  field: "STT",  width: 80,  title: ("no"),  alignment: "center",  type: "number",},
      {  field: "TAI_EINVOICE_CLOUD_PK",  width: 150,  title: ("tai_einvoce_cloud_pk"),  alignment: "left",  type: "number",},
      {  field: "TCHAT",  width: 80,  title: ("tchat"),  alignment: "center",  type: "number",},
      {  field: "MHHDVU",  width: 200,  title: ("mhhdvu"),  alignment: "right",  type: "text",},
      {  field: "THHDVU",  width: 250,  title: ("thhdvu"),  alignment: "right",  type: "text",},
      {  field: "DVTINH",  width: 100,  title: ("dvtinh"),  alignment: "left",  type: "text",},
      {  field: "SLUONG",  width: 90,  title: ("so_luong"),  alignment: "center",  type: "number",},
      {  field: "DGIA",  width: 100,  title: ("dgia"),  alignment: "right",  type: "number",},
      {  field: "TLCKHAU",  width: 80,  title: ("tlckhau"),  alignment: "center",  type: "number",},
      {  field: "TSUAT",  width: 80,  title: ("tsuat"),  alignment: "center",  type: "number",}, 
       {  field: "STCKHAU",  width: 80,  title: ("stckhau"),  alignment: "center",  type: "number",},
        {  field: "THTIEN",  width: 80,  title: ("ThTien"),  alignment: "center",  type: "number",},
      //   {  field: "DEL_IF",  width: 80,  title: ("del_if"),  alignment: "center",  type: "number",},
      //   {  field: "CRT_BY",  width: 100,  title: ("crt_by"),  alignment: "left",  type: "text",},
      //   {  field: "CRT_DT",  width: 150,  title: ("crt_dt"),  alignment: "left",  type: "date",},
      //   {  field: "MOD_BY",  width: 100,  title: ("mod_by"),  alignment: "right",  type: "number",},
      //   {  field: "MOD_DT",  width: 100,  title: ("mod_dt"),  alignment: "right",  type: "number",},
       ];
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
  <!-- ================================================================= END SCRIPT  ============================================================================================== -->
