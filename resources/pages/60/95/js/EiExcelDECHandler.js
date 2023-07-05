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
    let checked = require("@/assets/images/einvoices_logo/checked.png")
    let unchecked = require("@/assets/images/einvoices_logo/unchecked.png")

    let _sourceRow = 47//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
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
    try {
      masterDataArray = []

      reportPath = 'report/60/95/Declaration.xlsx';
      reportSheet = "Declaration";
  
      //mảng data của master
      masterDataArray.push(
        { Cell: `B7`, Info: [`TEN`], Type: 1 },
        { Cell: `C8`, Info: [`HTHUC`], Type: 1 },
  
        { Cell: `F11`, Info: [`TNNT`], Type: 1 },
        { Cell: `E12`, Info: [`MST`], Type: 1 },
        { Cell: `B13`, Info: [`CQTQLY`], Type: 1 },
  
        { Cell: `B14`, Info: [`NLHE`], Type: 1 },
        { Cell: `H14`, Info: [`DTLHE`], Type: 1 },
        { Cell: `B15`, Info: [`DCLHE`], Type: 1 },
        { Cell: `H15`, Info: [`DCTDTU`], Type: 1 },
        { Cell: `G49`, Info: [`DDANHTIME`], Type: 1 },
  
      )
      if (einvoiceMasterData[0]["STATUS"] == "Y") {
        masterDataArray.push(
          { Cell: `G52`, Info: [`TNNT`], Type: 1 },
        )
      }
      // // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      // // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
  
      // //cấu trúc dòng detail
      // // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
      detailCellFormat = [
        { startCell: 2, endCell: 3, cellType: 2, cellBorder: "solid", field: "NO" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
        { startCell: 4, endCell: 6, cellType: 3, cellBorder: "solid", field: "TTCHUC" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
        { startCell: 7, endCell: 7, cellType: 2, cellBorder: "solid", field: "SERI" },//type 1: còn lại
        { startCell: 8, endCell: 8, cellType: 2, cellBorder: "solid", field: "TNGAY" },//type 1: còn lại
        { startCell: 9, endCell: 9, cellType: 2, cellBorder: "solid", field: "DNGAY" },//type 1: còn lại
        { startCell: 10, endCell: 10, cellType: 2, cellBorder: "solid", field: "HTHUC" },//type 1: còn lại
      ]
    } catch (error) {
      console.log("error ",error)
    }

   
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
      resultExcel = await exceljs.ExcelBuilder( that, einvoiceMasterData, einvoiceDetailData, einvoicePk,
        _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox,
        lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath,
        masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn,
        backgroundCell, backgroundWidth, backgroundHeight,checked, unchecked
        )
    } catch (error) {

    }

    return resultExcel


  }
  // await functionex(x, y);
}

export default EiExcelDECHandler;