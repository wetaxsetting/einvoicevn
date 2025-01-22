'use strict';
const DBService = use('DBService');
const Helpers = use('Helpers');
const fs = require('fs');
const EiExcelConverter = use('App/Helpers/EiExcelConverterAuto');

class EiExcelHandler {
  constructor() {}
  masterDataArray = [];

  async getEinvoice(tradecode, p_language, p_crt_by, _db2 = 'N') {
    try {
      let exceljs = new EiExcelConverter();
      let resultExcel = null;
      let companyTaxcode = 0;

      let detailCellFormat = [];
      let convertYn = 'N';
      let cancelYn = 'N';

      let backgroundCell = 0; //ô chen background'
      let backgroundWidth = 300;
      let backgroundHeight = 200;
      let signCell = {}; //điểm bắt đầu và kết thúc trên trục X của hình dấu tick ký
      let signBoxCell = ''; //Cell bắt đầu của signBy ví dụ:"L"
      let signByCell = {}; //điểm bắt đầu và kết thúc trên trục X của signBy

      let taxSignCell = {}; //điểm bắt đầu và kết thúc trên trục X của hình dấu tick ký
      let taxSignBoxCell = ''; //Cell bắt đầu của signBy ví dụ:"L"
      let taxSignByCell = {}; //điểm bắt đầu và kết thúc trên trục X của signBy

      let reportPath = ''; //đường dẫn của template
      let reportSheet = ''; //tên của sheet trong template

      let logos = [];
      let qrPath = 'assets/images/einvoices_logo/qr.png'; //đường dẫn của dấu tick xanh
      let signPath = 'assets/images/einvoices_logo/greentick.png'; //đường dẫn của dấu tick xanh

      let cancelPath = 'assets/images/einvoices_logo/Cancle.png'; //đường dẫn của hình cancel
      let adjustPath = 'assets/images/einvoices_logo/Adjust.png'; //đường dẫn của hình cancel
      let replacePath = 'assets/images/einvoices_logo/Replace.png'; //đường dẫn của hình cancel
      let bgPath = ''; //đường dẫn của hình background

      let _sourceRow = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_2 = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_3 = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let headerRowCount = 0; //chiều cao tính từ đầu trang tới dòng trên dòng đầu tiên của detail
      let countFromEndDetailToSignBox = 0; //số đếm từ đầu footer tới ô đầu tiên của ô ký
      let dpi = 96;
      let lastPageRowsHeight = 0;
      let companyName = '';
      let backgroundRow = 0;
      let num_of_pages = 0;
      let num_of_more_pages = 0;
      let num_of_more_pages_max = 0;

      const einvoiceMasterData = await DBService.callProcCursor('ei_sel_einvoice_m_pdf', [tradecode], p_language, p_crt_by, _db2);

      //console.log('einvoiceMasterData ', einvoiceMasterData);
      const einvoiceDetailData = await DBService.callProcCursor('ei_sel_einvoice_d_pdf', [tradecode], p_language, p_crt_by, _db2);

      const einvoiceMasterParam = await DBService.callProcCursor(
        'ei_sel_einvoice_m_param',
        [tradecode, einvoiceMasterData[0].FORM_NO, einvoiceMasterData[0].SERIAL_NO, ''],
        p_language,
        p_crt_by,
        _db2,
      );

      const einvoiceDetailsParam = await DBService.callProcCursor(
        'ei_sel_einvoice_d_param',
        [tradecode, einvoiceMasterData[0].FORM_NO, einvoiceMasterData[0].SERIAL_NO, ''],
        p_language,
        p_crt_by,
        _db2,
      );

      //console.log(einvoiceDetailData)
      if (einvoiceMasterData.length <= 0) {
        return that.showNotification('warning', that.$t("This Einvoice Doesn't Exist"), '', 5000);
      } else {
        companyTaxcode = einvoiceMasterData[0].SELLER_TAXCODE.replace(/\s+/g, '');
        convertYn = einvoiceMasterData[0].CONVERT_YN == 'Y' ? 'Y' : 'N';
        cancelYn = einvoiceMasterData[0].CANCEL_YN == 'Y' ? 'Y' : 'N';
      }
      //console.log('einvoiceMasterData[0].ETAX_STATUS ', einvoiceMasterData[0].ETAX_STATUS);
      if (einvoiceMasterData[0].ETAX_STATUS == '1') {
        cancelPath = 'assets/images/einvoices_logo/Cancle.png';
      } else if (einvoiceMasterData[0].ETAX_STATUS == '3') {
        cancelPath = 'assets/images/einvoices_logo/Adjust.png';
      } else if (einvoiceMasterData[0].ETAX_STATUS == '2') {
        cancelPath = 'assets/images/einvoices_logo/Replace.png';
      }

      let msThueCutter = async (msothueArray, taxCode, taxRow) => {
        for (let i = 0; i < taxCode.length; i++) {
          const e = taxCode[i];
          this.masterDataArray.push({Cell: `${msothueArray[i] + taxRow}`, Info: [e], Type: 2}); //so thue
        }
      };
      // console.log("companyTaxcode ", companyTaxcode);

      //let url_file_excel = "report/60/95/einvoices_template/Bornga/Bornga.xlsx";

      this.masterDataArray = [];
      if (convertYn == 'Y') {
        reportPath = einvoiceMasterData[0].URL_FILE_EXCEL_C_IMP; //  url_file_excel;//'report/60/95/einvoices_template/Bornga/Bornga.xlsx'
        reportSheet = 'Invoice';
        // this.masterDataArray.push(
        //   { Cell: `H4`, Info: [`CONVERT_TITLE`], Type: '1' },
        //   { Cell: `C39`, Info: [`CONVERT_NAME`], Type: '1' },
        //   { Cell: `B40`, Info: [`CONVERT_DATE`], Type: '1' },
        // )
      } else {
        reportPath = einvoiceMasterData[0].URL_FILE_EXCEL_IMP; //'report/60/95/einvoices_template/Bornga/Bornga.xlsx'
        reportSheet = 'Invoice';
      }

      for (let i = 0; i < einvoiceMasterParam.length; i++) {
        //console.log(" Cell: einvoiceMasterParam[i].CELL_CODE ", einvoiceMasterParam[i].CELL_CODE + " - " + einvoiceMasterParam[i].DATA_MAPPING + "  - " + einvoiceMasterParam[i].TYPE );
        this.masterDataArray.push({
          Cell: einvoiceMasterParam[i].CELL_CODE,
          Info: [einvoiceMasterParam[i].DATA_MAPPING],
          Type: einvoiceMasterParam[i].TYPE,
        });
      }
      if (einvoiceMasterData[0].URL_IMG_BG != '' && einvoiceMasterData[0].URL_IMG_BG != null) {
        bgPath = `${einvoiceMasterData[0].URL_IMG_BG}`;
      } else {
        bgPath = '';
      }

      try {
        let savePath = await Helpers.appRoot(`${einvoiceMasterData[0].URL_IMG_LOGO}`);
        if (fs.existsSync(savePath)) {
          logos = [
            {
              start: einvoiceMasterData[0].LOGO_START_COL,
              width: einvoiceMasterData[0].LOGO_WIDTH, //   0.99 * dpi,
              height: einvoiceMasterData[0].LOGO_HEIGHT, // 0.99 * dpi,
              logoStartCount: einvoiceMasterData[0].LOGO_START_ROW,
              logoPath: `${einvoiceMasterData[0].URL_IMG_LOGO}`, //logoPath: '/../' + `${einvoiceMasterData[0].URL_IMG_LOGO}`,
            },
          ];
        } else {
          logos = [];
        }
      } catch (error) {
        logos = [];
        console.log('error  require url ', error);
      }

      for (let i = 0; i < einvoiceDetailsParam.length; i++) {
        detailCellFormat.push({
          startCell: einvoiceDetailsParam[i].STARTCELL,
          endCell: einvoiceDetailsParam[i].ENDCELL,
          cellType: einvoiceDetailsParam[i].TYPE,
          cellBorder: einvoiceDetailsParam[i].CELLBORDER,
          field: einvoiceDetailsParam[i].FIELD,
        });
      }
      // // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",

      //console.log('this.masterDataArray  ', this.masterDataArray);
      backgroundCell = einvoiceMasterData[0].BG_START_ROW;
      backgroundRow = einvoiceMasterData[0].BG_END_ROW;
      backgroundWidth = einvoiceMasterData[0].BG_WIDTH;
      backgroundHeight = einvoiceMasterData[0].BG_HEIGHT;

      signCell = {start: einvoiceMasterData[0].SIGN_START_CELL, end: einvoiceMasterData[0].SIGN_END_CELL};
      signBoxCell = einvoiceMasterData[0].SIGN_CELL_BOX;
      signByCell = {start: einvoiceMasterData[0].SIGN_BY_START_CELL, end: einvoiceMasterData[0].SIGN_BY_END_CELL};
      countFromEndDetailToSignBox = einvoiceMasterData[0].SIGN_RANGE_DETAILS;

      taxSignCell = {start: einvoiceMasterData[0].TAX_SIGN_BY_START_CELL, end: einvoiceMasterData[0].TAX_SIGN_BY_END_CELL};
      taxSignBoxCell = einvoiceMasterData[0].TAX_SIGN_CELL_BOX;
      taxSignByCell = {start: einvoiceMasterData[0].TAX_SIGN_BY_START_CELL, end: einvoiceMasterData[0].TAX_SIGN_BY_END_CELL};

      _sourceRow = einvoiceMasterData[0].DETAILS_START_ROW; //26
      _sourceRow_2 = einvoiceMasterData[0].DETAILS_START_ROW; //26
      _sourceRow_3 = einvoiceMasterData[0].DETAILS_START_ROW; //26

      headerRowCount = einvoiceMasterData[0].DETAILS_START_ROW == null ? 0 : einvoiceMasterData[0].DETAILS_START_ROW;
      lastPageRowsHeight = 18;

      num_of_pages = einvoiceMasterData[0].NUM_OF_PAGE;
      num_of_more_pages = einvoiceMasterData[0].NUM_OF_MORE_PAGE;
      num_of_more_pages_max = einvoiceMasterData[0].NUM_OF_MORE_PAGE_MAX;

      // console.log("this.masterDataArray ", this.masterDataArray);

      if (this.masterDataArray.length > 0) {
        // console.log("masterDataArray ", this.masterDataArray);
        resultExcel = await exceljs.ExcelBuilder(
          p_crt_by,
          einvoiceMasterData,
          einvoiceDetailData,
          '',
          _sourceRow,
          _sourceRow_2,
          _sourceRow_3,
          headerRowCount,
          countFromEndDetailToSignBox,
          lastPageRowsHeight,
          reportPath,
          reportSheet,
          signPath,
          cancelPath,
          bgPath,
          this.masterDataArray,
          detailCellFormat,
          logos,
          signCell,
          signBoxCell,
          signByCell,
          cancelYn,
          backgroundCell,
          backgroundRow,
          backgroundWidth,
          backgroundHeight,
          num_of_pages,
          num_of_more_pages,
          num_of_more_pages_max,
          taxSignCell,
          taxSignBoxCell,
          taxSignByCell,
        );
      }

      return resultExcel;
    } catch (error) {
      console.log(error);
    }
  }

  msThueCutter(msothueArray, taxCode, taxRow) {
    for (let i = 0; i < taxCode.length; i++) {
      const e = taxCode[i];
      this.masterDataArray.push({Cell: `${msothueArray[i] + taxRow}`, Info: [e], Type: 2}); //so thue
    }
  }
}

module.exports = EiExcelHandler;
