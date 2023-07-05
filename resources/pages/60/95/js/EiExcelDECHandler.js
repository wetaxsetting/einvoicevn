import moment from "moment"
let EiExcelDECHandler = {
  getDeclariton: async (that, einvoicePk) => {

    console.log("getEinvoice");

    let exceljs = null;
    let resultExcel = null;
    let companyTaxcode = 0
    let masterDataArray = []
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
    let qrPath = require("@/assets/images/einvoices_logo/qr.png")//đường dẫn của dấu tick xanh
    let signPath = require("@/assets/images/einvoices_logo/greentick.png")//đường dẫn của dấu tick xanh
    let cancelPath = require("@/assets/images/einvoices_logo/Einvoice_cancel.png")//đường dẫn của hình cancel
    let bgPath = "" //đường dẫn của hình background
    let checked = ""
    let unchecked = ""

    let _sourceRow = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
    let _sourceRow_2 = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
    let _sourceRow_3 = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
    let headerRowCount = 0//chiều cao tính từ đầu trang tới dòng trên dòng đầu tiên của detail
    let countFromEndDetailToSignBox = 0//số đếm từ đầu footer tới ô đầu tiên của ô ký
    let dpi = 96
    let lastPageRowsHeight = 0
    let companyName = ""
    //     exec stacfdstac71_r_02_view_einv_nodejs ('255','', 'ENG', 'admingenuwin', :p_rtn_cur)
    //exec stacfdstac71_r_03_view_einv_nodejs ('255','', 'ENG', 'admingenuwin', :p_rtn_cur)

    const einvoiceMasterData = await that._callProcedure(
      "stacfrstac710037_s_02_r_nodejs",
      [einvoicePk,]
    );
    const einvoiceDetailData = await that._callProcedure(
      "stacfrstac710037_s_05_r_nodejs",
      [einvoicePk,]
    );
    //console.log(einvoiceDetailData)
    if (einvoiceMasterData.length <= 0) {
      return that.showNotification(
        "warning",
        that.$t("This Einvoice Doesn't Exist"),
        "",
        5000
      );
    } 

    masterDataArray = []

    reportPath = 'report/60/95/Declaration.xlsx'
    reportSheet = "Declaration"


    // bgPath = require("assets/images/einvoices_logo/Ottogi_CNBN_PXK/bg.png")
    // logos = [
    //   { start: 1, width: 0.99 * dpi, height: 0.99 * dpi, logoStartCount: 1.2, logoPath: require("assets/images/einvoices_logo/Ottogi_CNBN_PXK/companylogo.png") },

    // ]

    //mảng data của master
    // masterDataArray.push(
    //   { Cell: `AA12`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
    //   { Cell: `Z13`, Info: [`INVOICENUMBER`], Type: 1 },
    //   { Cell: `G14`, Info: [`dateString`], Type: 2 },
    //   { Cell: `X14`, Info: [`page`], Type: 2 },
    //   { Cell: `A43`, Info: [`footer`], Type: 2 },

    //   { Cell: `F2`, Info: [`SELLER_NAME`], Type: 1 },
    //   { Cell: `H3`, Info: [`SELLER_TAXCODE`], Type: 1 },
    //   { Cell: `H4`, Info: [`SELLER_ADDRESS`], Type: 1 },
    //   { Cell: `H5`, Info: [`SELLER_TEL`], Type: 1 },
    //   { Cell: `I6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },

    //   { Cell: `H16`, Info: [`ATTRIBUTE_01`], Type: 1 },
    //   { Cell: `Y16`, Info: [`ATTRIBUTE_02`], Type: 1 },
    //   { Cell: `C17`, Info: [`ATTRIBUTE_03`], Type: 1 },
    //   // { Cell: `I5`, Info: [`ATTRIBUTE_04`], Type: 1 },
    //   { Cell: `G18`, Info: [`ATTRIBUTE_05`], Type: 1 },
    //   { Cell: `Y18`, Info: [`ATTRIBUTE_06`], Type: 1 },
    //   { Cell: `G19`, Info: [`ATTRIBUTE_07`], Type: 1 },
    //   { Cell: `F20`, Info: [`ATTRIBUTE_08`], Type: 1 },
    //   { Cell: `F21`, Info: [`ATTRIBUTE_09`], Type: 1 },

    //   { Cell: `Z27`, Info: [`amount_total`], Type: 2 },

    //   { Cell: `D39`, Info: [`CQT_MCCQT_ID`], Type: 1 },
    //   { Cell: `W41`, Info: [`MATRACUU`], Type: 1 },

    //   { Cell: `V38`, Info: [`SIGNEDBY`], Type: 3 },
    //   { Cell: `V39`, Info: [`SIGNEDDATE`], Type: 3 },

    // )
    // // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
    // // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

    // //cấu trúc dòng detail
    // // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
    // detailCellFormat = [
    //   { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
    //   { startCell: 3, endCell: 14, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
    //   { startCell: 16, endCell: 17, cellType: 1, cellBorder: "dotted", field: "BLANK" },//type 1: còn lại
    //   { startCell: 18, endCell: 19, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
    //   { startCell: 20, endCell: 21, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
    //   { startCell: 22, endCell: 23, cellType: 1, cellBorder: "dotted", field: "BLANK" },//type 1: còn lại
    //   { startCell: 24, endCell: 25, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
    //   { startCell: 26, endCell: 28, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
    // ]
    // backgroundCell = 8
    // backgroundWidth = 300
    // backgroundHeight = 200

    // signCell = { start: 24, end: 26 }
    // signBoxCell = "V"
    // signByCell = { start: 22, end: 29 }
    // countFromEndDetailToSignBox = 10

    // _sourceRow = 26
    // _sourceRow_2 = 26
    // _sourceRow_3 = 26
    // headerRowCount = 25


    // lastPageRowsHeight = 18

    try {
      if (masterDataArray.length > 0)
        console.log("masterDataArray  ", masterDataArray.length);

      exceljs = require("./EiExcelDECConverter.js");
      if (!!exceljs) { exceljs = exceljs.default; }
      resultExcel = await exceljs.ExcelBuilder(
        that, einvoiceMasterData, einvoiceDetailData, einvoicePk,
        _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox,
        lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath,
        masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn,
        backgroundCell, backgroundWidth, backgroundHeight)
    } catch (error) {

    }

    return resultExcel


  }
  // await functionex(x, y);
}

export default EiExcelDECHandler;