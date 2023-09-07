'use strict'
const DBService = use("DBService");
const EiExcelConverter = use("App/Helpers/EiExcelTemplateConverter");
class EiExcelHandler {

  constructor() {

  }
  masterDataArray = []

  async getEinvoice(tradecode, p_language, p_crt_by, _db2 = "N") {

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
        "EI_SEL_6095057_TEMPLATES", [tradecode],
        p_language,
        p_crt_by,
        _db2
      );
     
    
     
    console.log(einvoiceMasterData)
    if (einvoiceMasterData.length <= 0) {
      return that.showNotification(
        "warning",
        that.$t("This Einvoice Doesn't Exist"),
        "",
        5000
      );
    }

   

    this.masterDataArray = []
      reportPath = einvoiceMasterData[0].URL_FILE_EXCEL;//'report/60/95/einvoices_template/Bornga/Bornga.xlsx'
      reportSheet = "Invoice"    
   
        console.log("masterDataArray ", this.masterDataArray);
        resultExcel = await exceljs.ExcelBuilder(
          p_crt_by, 
          reportPath, 
          reportSheet
          )
      
      
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