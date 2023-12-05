'use strict'
const DBService = use("DBService");
const EiExcelConverter = use("App/Helpers/EiWTExcelConverterAuto");
class EiExcelHandler {

  constructor() {

  }
  masterDataArray = []

  async getEinvoice(pk, p_language, p_crt_by, _db2 = "N") {

    try {


      let exceljs = new EiExcelConverter();
      let resultExcel = null;
      let companyTaxcode = 0

      let detailCellFormat = []
      let convertYn = "N"
      let cancelYn = "N"


      let backgroundCell = 0//ô chen background'
      let backgroundWidth = 300
      let backgroundHeight = 200
      let signCell = {}//điểm bắt đầu và kết thúc trên trục X của hình dấu tick ký
      let signBoxCell = ""//Cell bắt đầu của signBy ví dụ:"L"
      let signByCell = {}//điểm bắt đầu và kết thúc trên trục X của signBy

      let reportPath = ""//đường dẫn của template 
      let reportSheet = ""//tên của sheet trong template

      let logos = []
      let qrPath = "assets/images/einvoices_logo/qr.png"//đường dẫn của dấu tick xanh
      let signPath = "assets/images/einvoices_logo/greentick.png"//đường dẫn của dấu tick xanh
      let cancelPath = "assets/images/einvoices_logo/Einvoice_cancel.png"//đường dẫn của hình cancel
      let bgPath = "" //đường dẫn của hình background

      let _sourceRow = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_2 = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_3 = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let headerRowCount = 0//chiều cao tính từ đầu trang tới dòng trên dòng đầu tiên của detail
      let countFromEndDetailToSignBox = 0//số đếm từ đầu footer tới ô đầu tiên của ô ký
      let dpi = 96
      let lastPageRowsHeight = 0
      let companyName = ""
      let backgroundRow = 0

      const einvoiceMasterData = await DBService.callProcCursor(
        "EI_SEL_WT_EINVOICE_M_PDF", [pk],
        p_language,
        p_crt_by,
        _db2
      );
      // console.log("file: EiWTExcelHandlerAuto.js:57 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceMasterData:", einvoiceMasterData)


      const einvoiceDetailData = await DBService.callProcCursor(
        "EI_SEL_WT_EINVOICE_D_PDF", [pk],
        p_language,
        p_crt_by,
        _db2
      );
      // console.log("file: EiWTExcelHandlerAuto.js:64 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceDetailData:", einvoiceDetailData)


      const einvoiceMasterParam = await DBService.callProcCursor(
        "AC_SEL_WT_EINVOICE_M_PARAM", [pk, einvoiceMasterData[0].FORM_NO, einvoiceMasterData[0].SERIAL_NO, ''],
        p_language,
        p_crt_by,
        _db2
      );
      // console.log("file: EiWTExcelHandlerAuto.js:72 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceMasterParam:", einvoiceMasterParam)


      const einvoiceDetailsParam = await DBService.callProcCursor(
        "AC_SEL_WT_EINVOICE_D_PARAM", [pk, einvoiceMasterData[0].FORM_NO, einvoiceMasterData[0].SERIAL_NO, ''],
        p_language,
        p_crt_by,
        _db2
      );
      // console.log("file: EiWTExcelHandlerAuto.js:80 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceDetailsParam:", einvoiceDetailsParam)


      
      if (einvoiceMasterData.length <= 0) {
        return this.showNotification(
          "warning",
          this.$t("This Einvoice Doesn't Exist"),
          "",
          5000
        );
      } else {
        companyTaxcode = einvoiceMasterData[0].SELLER_TAXCODE.replace(/\s+/g, '')
        convertYn = einvoiceMasterData[0].CONVERT_YN == "Y" ? "Y" : "N"
        cancelYn = einvoiceMasterData[0].CANCEL_YN == "Y" ? "Y" : "N"
      }

      let msThueCutter = async (msothueArray, taxCode, taxRow) => {
        for (let i = 0; i < taxCode.length; i++) {
          const e = taxCode[i];
          this.masterDataArray.push({ Cell: `${msothueArray[i] + taxRow}`, Info: [e], Type: 2 }) //so thue
        }
      }
      // console.log("companyTaxcode ", companyTaxcode);
      // console.log("einvoiceMasterData ", einvoiceMasterData);
      //let url_file_excel = "report/60/95/einvoices_template/Bornga/Bornga.xlsx";

      this.masterDataArray = []

      reportPath = einvoiceMasterData[0].URL_FILE_EXCEL_IMP;//'report/60/95/einvoices_template/Bornga/Bornga.xlsx'
      reportSheet = "Invoice"

      
      for (let i = 0; i < einvoiceMasterParam.length; i++) {
        //console.log(" Cell: einvoiceMasterParam[i].CELL_CODE ", einvoiceMasterParam[i].CELL_CODE + " - " + einvoiceMasterParam[i].DATA_MAPPING + "  - " + einvoiceMasterParam[i].TYPE );
        this.masterDataArray.push({ Cell: einvoiceMasterParam[i].CELL_CODE, Info: [einvoiceMasterParam[i].DATA_MAPPING], Type: einvoiceMasterParam[i].TYPE },)
      }
      if (einvoiceMasterData.length && einvoiceMasterData[0].URL_IMG_BG) {
        bgPath = `${einvoiceMasterData[0].URL_IMG_BG}`;
      } else {
        bgPath = "";
      }

      // if (einvoiceMasterData.length && einvoiceMasterData[0].URL_IMG_LOGO) {
      //   logos = [
      //     {
      //       start: einvoiceMasterData[0].LOGO_START_ROW,
      //       width: 0.99 * dpi,
      //       height: 0.99 * dpi,
      //       logoStartCount: einvoiceMasterData[0].LOGO_START_COL,
      //       logoPath: `${einvoiceMasterData[0].URL_IMG_LOGO}`
      //     },
      //   ];
      // }
      // else {
      //   logos = [];
      // }

      // console.log(" bgPath  ", bgPath, "logos  ", logos);

      for (let i = 0; i < einvoiceDetailsParam.length; i++) {
        detailCellFormat.push({
          startCell: einvoiceDetailsParam[i].STARTCELL,
          endCell: einvoiceDetailsParam[i].ENDCELL,
          cellType: einvoiceDetailsParam[i].TYPE,
          cellBorder: einvoiceDetailsParam[i].CELLBORDER,
          field: einvoiceDetailsParam[i].FIELD
        })

      }
      // // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      // // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

      //cấu trúc dòng detail
      // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
      // detailCellFormat = [
      //   { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
      //   { startCell: 3, endCell: 9, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,

      //   { startCell: 10, endCell: 10, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
      //   { startCell: 11, endCell: 13, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
      //   //{ startCell: 13, endCell: 14, cellType: 1, cellBorder: "dotted", field: "BLANK" },//type 1: còn lại
      //   { startCell: 14, endCell: 16, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
      //   //{ startCell: 17, endCell: 1, cellType: 1, cellBorder: "dotted", field: "BLANK" },//type 1: còn lại
      //   { startCell: 17, endCell: 18, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
      //   // { startCell: 21, endCell: 22, cellType: 1, cellBorder: "dotted", field: "BLANK" },//type 1: còn lại
      // ]


      backgroundCell = einvoiceMasterData[0].BG_END_ROW
      backgroundRow = einvoiceMasterData[0].BG_START_ROW
      backgroundWidth = einvoiceMasterData[0].BG_WIDTH
      backgroundHeight = einvoiceMasterData[0].BG_HEIGHT

      signCell = { start: einvoiceMasterData[0].SIGN_START_CELL, end: einvoiceMasterData[0].SIGN_END_CELL }
      signBoxCell = einvoiceMasterData[0].SIGN_CELL_BOX
      signByCell = { start: einvoiceMasterData[0].SIGN_BY_START_CELL, end: einvoiceMasterData[0].SIGN_BY_END_CELL }
      countFromEndDetailToSignBox = einvoiceMasterData[0].RANGE_DETAILS_SIGN

      _sourceRow = einvoiceMasterData[0].DETAILS_START_ROW//26
      _sourceRow_2 = einvoiceMasterData[0].DETAILS_START_ROW//26
      _sourceRow_3 = einvoiceMasterData[0].DETAILS_START_ROW//26

      headerRowCount = einvoiceMasterData[0].DETAILS_START_ROW == null ? 0 : einvoiceMasterData[0].DETAILS_START_ROW
      lastPageRowsHeight = 18

      // console.log("this.masterDataArray ", this.masterDataArray);


      if (this.masterDataArray.length > 0) {
        // console.log("masterDataArray ", this.masterDataArray);
        resultExcel = await exceljs.ExcelBuilder(
          p_crt_by, einvoiceMasterData, einvoiceDetailData, '',
          _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox,
          lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath,
          this.masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn,
          backgroundCell, backgroundRow, backgroundWidth, backgroundHeight)
      }


      return resultExcel

    } catch (error) {
      console.log(error)
    }

  }


  msThueCutter(msothueArray, taxCode, taxRow) {
    for (let i = 0; i < taxCode.length; i++) {
      const e = taxCode[i];
      this.masterDataArray.push({ Cell: `${msothueArray[i] + taxRow}`, Info: [e], Type: 2 }) //so thue
    }
  }


}

module.exports = EiExcelHandler