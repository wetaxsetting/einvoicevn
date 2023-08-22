import moment from "moment"
let EiExcelHandler = {
  getEinvoiceERP_V2: async (that, einvoicePk) => {
    let exceljs = null;
    let resultExcel = null;
    let masterDataArray = []
  
    let reportPath = ""//đường dẫn của template 
    let reportSheet = "Invoice"//tên của sheet trong template

   
    //exec stacfdstac71_r_02_view_einv_nodejs ('255','', 'ENG', 'admingenuwin', :p_rtn_cur)
    //exec stacfdstac71_r_03_view_einv_nodejs ('255','', 'ENG', 'admingenuwin', :p_rtn_cur)

    const einvoiceMasterData = await that._callProcedure(
      "EI_SEL_6095055_TEMPLATE",
      [einvoicePk, '',]
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
   
    //let url_file_excel = "report/60/95/einvoices_template/Bornga/Bornga.xlsx";

    masterDataArray = []
    reportPath = einvoiceMasterData[0].URL_FILE_EXCEL;

    try {
      if (einvoiceMasterData.length > 0)
        exceljs = require("./EiExcelConverterERPTemplate.js");
      if (!!exceljs) { exceljs = exceljs.default; }
              resultExcel = await exceljs.ExcelBuilder( that, einvoiceMasterData, einvoicePk, reportPath, reportSheet )
    } catch (error) {

    }
    return resultExcel

  }
  // await functionex(x, y);
}




export default EiExcelHandler;