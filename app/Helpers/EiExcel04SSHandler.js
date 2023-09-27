"use strict";
const DBService = use("DBService");
const EiExcelConverter = use("App/Helpers/EiExcel04SSConverter");
class EiExcelHandler {
  constructor() {}
  masterDataArray = [];

  async getEinvoice(pk, p_language, p_crt_by, _db2 = "N") {
    try {
      let exceljs = new EiExcelConverter();
      let resultExcel = null;
      let companyTaxcode = 0;

      let detailCellFormat = [];
      let convertYn = "N";
      let cancelYn = "N";

      let backgroundCell = 0; //ô chen background'
      let backgroundWidth = 300;
      let backgroundHeight = 200;
      let signCell = {}; //điểm bắt đầu và kết thúc trên trục X của hình dấu tick ký
      let signBoxCell = ""; //Cell bắt đầu của signBy ví dụ:"L"
      let signByCell = {}; //điểm bắt đầu và kết thúc trên trục X của signBy

      let reportPath = ""; //đường dẫn của template
      let reportSheet = ""; //tên của sheet trong template

      let logos = [];
      let qrPath = "assets/images/einvoices_logo/qr.png"; //đường dẫn của dấu tick xanh
      let signPath = "assets/images/einvoices_logo/greentick.png"; //đường dẫn của dấu tick xanh
      let cancelPath = "assets/images/einvoices_logo/Einvoice_cancel.png"; //đường dẫn của hình cancel
      let bgPath = ""; //đường dẫn của hình background

      let _sourceRow = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_2 = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_3 = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let headerRowCount = 0; //chiều cao tính từ đầu trang tới dòng trên dòng đầu tiên của detail
      let countFromEndDetailToSignBox = 0; //số đếm từ đầu footer tới ô đầu tiên của ô ký
      let dpi = 96;
      let lastPageRowsHeight = 0;
      let companyName = "";
      let backgroundRow = 0;

      const einvoiceMasterData = await DBService.callProcCursor("AC_SEL_EINVOICE_M_04SS", [pk], p_language, p_crt_by, _db2);
      console.log("file: EiExcel04SSHandler.js:59 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceMasterData:", einvoiceMasterData);
      const einvoiceDetailData = await DBService.callProcCursor("AC_SEL_EINVOICE_D_04SS", [pk], p_language, p_crt_by, _db2);
      console.log("file: EiExcel04SSHandler.js:66 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceDetailData:", einvoiceDetailData);

      // const einvoiceMasterParam = await DBService.callProcCursor(
      //   "ac_sel_einvoice_m_param", [tradecode, einvoiceMasterData[0].FORM_NO , einvoiceMasterData[0].SERIAL_NO,''],
      //   p_language,
      //   p_crt_by,
      //   _db2
      // );

      // const einvoiceDetailsParam = await DBService.callProcCursor(
      //   "ac_sel_einvoice_d_param", [tradecode, einvoiceMasterData[0].FORM_NO , einvoiceMasterData[0].SERIAL_NO,''],
      //   p_language,
      //   p_crt_by,
      //   _db2
      // );

      if (einvoiceMasterData.length <= 0) {
        return that.showNotification("warning", "This Einvoice Doesn't Exist", "", 5000);
      }
      //let url_file_excel = "report/60/95/einvoices_template/Bornga/Bornga.xlsx";

      this.masterDataArray = [];
      reportPath = "report/60/95/ex_04ss/HD_04SS.xlsx";
      reportSheet = "Invoice";
      //mảng data của master
      this.masterDataArray.push(
        // { Cell: `B6`, Info: [`TEN_BIEN_BAN`], Type: 1 },
        // { Cell: `B7`, Info: [`VOUCHER_NO`], Type: 1 },
        // { Cell: `B15`, Info: [`NOW`], Type: 1 },

        { Cell: `E10`, Info: [`MST`], Type: 1 },
        { Cell: `F9`, Info: [`TNNT`], Type: 1 },
        { Cell: `B7`, Info: [`TCQT`], Type: 1 },
        { Cell: `K2`, Info: [`MSO`], Type: 1 },

        { Cell: `I17`, Info: [`NOW`], Type: 1 },
        { Cell: `J22`, Info: [`COMPANY_SIGN`], Type: 1 },
        { Cell: `J23`, Info: [`NGAY_SIGN`], Type: 1 },
        
      );
      console.log("file: EiExcel04SSHandler.js:87 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] detailCellFormat:", detailCellFormat)

      detailCellFormat = [
        { startCell: 2, endCell: 3, cellType: 2, cellBorder: "thin", field: "STT" }, //từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
        { startCell: 4, endCell: 6, cellType: 3, cellBorder: "thin", field: "MCQTCAP" }, //từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
        { startCell: 7, endCell: 7, cellType: 1, cellBorder: "thin", field: "KHHDON" }, //type 1: còn lại
        { startCell: 8, endCell: 8, cellType: 1, cellBorder: "thin", field: "SHDON" }, //type 1: còn lại
        { startCell: 9, endCell: 9, cellType: 1, cellBorder: "thin", field: "NGAY" }, //type 1: còn lại
        { startCell: 10, endCell: 10, cellType: 1, cellBorder: "thin", field: "LADHDDT" }, //type 1: còn lại
        { startCell: 11, endCell: 11, cellType: 1, cellBorder: "thin", field: "TCTBAO" },
        { startCell: 12, endCell: 12, cellType: 1, cellBorder: "thin", field: "LDO" },
      ];

      signCell = { start: einvoiceMasterData[0].SIGN_START_CELL, end: einvoiceMasterData[0].SIGN_END_CELL };
      signBoxCell = einvoiceMasterData[0].SIGN_CELL_BOX;
      signByCell = { start: einvoiceMasterData[0].SIGN_BY_START_CELL, end: einvoiceMasterData[0].SIGN_BY_END_CELL };
      countFromEndDetailToSignBox = 8;

      _sourceRow = 14;
      _sourceRow_2 = 14;
      _sourceRow_3 = 14;

      headerRowCount = einvoiceMasterData[0].DETAILS_START_ROW == null ? 0 : einvoiceMasterData[0].DETAILS_START_ROW;
      lastPageRowsHeight = 18;

      // console.log("this.masterDataArray ", this.masterDataArray);

      if (this.masterDataArray.length > 0) {
        resultExcel = await exceljs.ExcelBuilder(
          p_crt_by,
          einvoiceMasterData,
          einvoiceDetailData,
          "",
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
          backgroundHeight
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
      this.masterDataArray.push({ Cell: `${msothueArray[i] + taxRow}`, Info: [e], Type: 2 }); //so thue
    }
  }
}

module.exports = EiExcelHandler;
