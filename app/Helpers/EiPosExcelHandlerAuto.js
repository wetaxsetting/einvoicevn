'use strict';
const Helpers = use('Helpers');
const fs = require('fs');
const DBService = use('DBService');
const EiExcelConverter = use('App/Helpers/EiPosExcelConverterAuto');
class EiExcelHandler {
  constructor() {}
  masterDataArray = [];

  async getEinvoice(pk, p_language, p_crt_by, _db2 = 'N') {
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

      let reportPath = ''; //đường dẫn của template
      let reportSheet = ''; //tên của sheet trong template

      let logos = [];
      let qrPath = 'assets/images/einvoices_logo/qr.png'; //đường dẫn của dấu tick xanh
      let signPath = 'assets/images/einvoices_logo/greentick.png'; //đường dẫn của dấu tick xanh
      let cancelPath = 'assets/images/einvoices_logo/Einvoice_cancel.png'; //đường dẫn của hình cancel
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

      const einvoiceMasterData = await DBService.callProcCursor('EI_SEL_POS_EINVOICE_M_PDF', [pk], p_language, p_crt_by, _db2);
      //console.log("file: EiPosExcelHandlerAuto.js:57 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceMasterData:", einvoiceMasterData)
      const einvoiceDetailData = await DBService.callProcCursor('EI_SEL_POS_EINVOICE_D_PDF', [pk], p_language, p_crt_by, _db2);

      const einvoiceMasterParam = await DBService.callProcCursor(
        'EI_SEL_POS_EINVOICE_M_PARAM',
        [pk, einvoiceMasterData[0].FORM_NO, einvoiceMasterData[0].SERIAL_NO, ''],
        p_language,
        p_crt_by,
        _db2,
      );

      const einvoiceDetailsParam = await DBService.callProcCursor(
        'EI_SEL_POS_EINVOICE_D_PARAM',
        [pk, einvoiceMasterData[0].FORM_NO, einvoiceMasterData[0].SERIAL_NO, ''],
        p_language,
        p_crt_by,
        _db2,
      );

      const einvoiceVAT_Bill = await DBService.callProcCursor('EI_SEL_POS_EINVOICE_VAT_PDF', [pk], p_language, p_crt_by, _db2);
      //console.log("file: EiPosExcelHandlerAuto.js:86 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceVAT_Bill:", einvoiceVAT_Bill)

      if (einvoiceMasterData.length <= 0) {
        return that.showNotification('warning', that.$t("This Einvoice Doesn't Exist"), '', 5000);
      } else {
        companyTaxcode = einvoiceMasterData[0].SELLER_TAXCODE.replace(/\s+/g, '');
        convertYn = einvoiceMasterData[0].CONVERT_YN == 'Y' ? 'Y' : 'N';
        cancelYn = einvoiceMasterData[0].CANCEL_YN == 'Y' ? 'Y' : 'N';
      }

      let msThueCutter = async (msothueArray, taxCode, taxRow) => {
        for (let i = 0; i < taxCode.length; i++) {
          const e = taxCode[i];
          this.masterDataArray.push({Cell: `${msothueArray[i] + taxRow}`, Info: [e], Type: 2}); //so thue
        }
      };
      // console.log("companyTaxcode ", companyTaxcode);
      // console.log("einvoiceMasterData ", einvoiceMasterData);
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
      //console.log('this.masterDataArray  ', this.masterDataArray);
      //reportPath = einvoiceMasterData[0].URL_FILE_EXCEL_IMP;//'report/60/95/einvoices_template/Bornga/Bornga.xlsx'
      //reportSheet = "Invoice"

      for (let i = 0; i < einvoiceMasterParam.length; i++) {
        //console.log(" Cell: einvoiceMasterParam[i].CELL_CODE ", einvoiceMasterParam[i].CELL_CODE + " - " + einvoiceMasterParam[i].DATA_MAPPING + "  - " + einvoiceMasterParam[i].TYPE );
        this.masterDataArray.push({
          Cell: einvoiceMasterParam[i].CELL_CODE,
          Info: [einvoiceMasterParam[i].DATA_MAPPING],
          Type: einvoiceMasterParam[i].TYPE,
        });
      }
      if (einvoiceMasterData.length && einvoiceMasterData[0].URL_IMG_BG) {
        bgPath = `${einvoiceMasterData[0].URL_IMG_BG}`;
      } else {
        bgPath = '';
      }
      //let checkYN = "N";
      //console.log("EiPosExcelHandlerAuto ==> einvoiceMasterData[0].URL_IMG_LOGO  line 128", einvoiceMasterData[0].URL_IMG_LOGO)
      // try {
      //   checkYN = "Y";
      //   //let savePath = await Helpers.appRoot(`resources/${einvoiceMasterData[0].URL_IMG_LOGO}`);
      //   let savePath = await Helpers.appRoot(`${einvoiceMasterData[0].URL_IMG_LOGO}`);

      //     if (fs.existsSync(savePath)) {
      //       console.log('file exists');
      //       checkYN = "Y";
      //     } else {
      //       console.log('file not found!');
      //       checkYN = "N";
      //     }
      // } catch (error) {
      //   checkYN = "N";
      //   console.log("error  require url ", error);
      // }

      // if (einvoiceMasterData.length && einvoiceMasterData[0].URL_IMG_LOGO && checkYN == "Y") {
      //   logos = [
      //     {
      //       start: einvoiceMasterData[0].LOGO_START_ROW,
      //       width: 0.99 * dpi,
      //       height: 0.99 * dpi,
      //       logoStartCount: einvoiceMasterData[0].LOGO_START_COL,
      //       logoPath:  "/../" + `${einvoiceMasterData[0].URL_IMG_LOGO}`
      //     },
      //   ];
      // }
      // else {
      //   logos = [];
      // }
      //console.log(" bgPath  ", bgPath, "logos  ", logos);
      logos = [
        {
          start: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_START_COL ? einvoiceMasterData[0].LOGO_START_COL : 1,
          logoStartCount: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_START_ROW ? einvoiceMasterData[0].LOGO_START_ROW : 1,
          width: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_WIDTH ? einvoiceMasterData[0].LOGO_WIDTH : 1,
          height: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_HEIGHT ? einvoiceMasterData[0].LOGO_HEIGHT : 1,
          logoPath: `${
            einvoiceMasterData[0] && einvoiceMasterData[0].URL_IMG_LOGO
              ? einvoiceMasterData[0].URL_IMG_LOGO
              : '/data/einvoices_logo/0104128565-999/2024/07/1721906430005_1721906430005.png'
          }`, ///assets/images/einvoices_logo/abc/
        },
      ];

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
      // // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

      //cấu trúc dòng detail
      // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
      // detailCellFormat = [
      //   { startCell: 2, endCell: 2, cellType: 1, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
      //   { startCell: 3, endCell: 7, cellType: 2, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,

      //   { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
      //   { startCell: 9, endCell: 9, cellType: 2, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
      //   //{ startCell: 10, endCell: 11, cellType: 2, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
      //   { startCell: 14, endCell: 14, cellType: 2, cellBorder: "dotted", field: "VAT_AMOUNT" },//type 1: còn lại
      //   //{ startCell: 15, endCell: 17, cellType: 2, cellBorder: "dotted", field: "TOTAL_AMOUNT" },//type 1: còn lại
      //   { startCell: 12, endCell: 12, cellType: 2, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
      //   // { startCell: 13, endCell: 13, cellType: 2, cellBorder: "dotted", field: "VAT_RATE" },//type 1: còn lại
      // ]

      backgroundCell = einvoiceMasterData[0].BG_END_ROW;
      backgroundRow = einvoiceMasterData[0].BG_START_ROW;
      backgroundWidth = einvoiceMasterData[0].BG_WIDTH;
      backgroundHeight = einvoiceMasterData[0].BG_HEIGHT;

      signCell = {start: einvoiceMasterData[0].SIGN_START_CELL, end: einvoiceMasterData[0].SIGN_END_CELL};
      signBoxCell = einvoiceMasterData[0].SIGN_CELL_BOX;
      signByCell = {start: einvoiceMasterData[0].SIGN_BY_START_CELL, end: einvoiceMasterData[0].SIGN_BY_END_CELL};
      countFromEndDetailToSignBox = einvoiceMasterData[0].RANGE_DETAILS_SIGN;

      _sourceRow = einvoiceMasterData[0].DETAILS_START_ROW; //26
      _sourceRow_2 = einvoiceMasterData[0].DETAILS_START_ROW; //26
      _sourceRow_3 = einvoiceMasterData[0].DETAILS_START_ROW; //26
      headerRowCount = einvoiceMasterData[0].DETAILS_START_ROW == null ? 0 : einvoiceMasterData[0].DETAILS_START_ROW;
      lastPageRowsHeight = 18;

      // console.log("this.masterDataArray ", this.masterDataArray);

      if (this.masterDataArray.length > 0) {
        // console.log("masterDataArray ", this.masterDataArray);
        resultExcel = await exceljs.ExcelBuilder(
          p_crt_by,
          einvoiceMasterData,
          einvoiceDetailData,
          einvoiceVAT_Bill,
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
