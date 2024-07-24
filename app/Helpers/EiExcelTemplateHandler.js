'use strict';
const DBService = use('DBService');
const Helpers = use('Helpers');
const fs = use('fs');
const EiExcelConverter = use('App/Helpers/EiExcelTemplateConverter');
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
      let bg = []; //đường dẫn của hình background

      let _sourceRow = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_2 = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_3 = 0; //chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let headerRowCount = 0; //chiều cao tính từ đầu trang tới dòng trên dòng đầu tiên của detail
      let countFromEndDetailToSignBox = 0; //số đếm từ đầu footer tới ô đầu tiên của ô ký
      let dpi = 96;
      let lastPageRowsHeight = 0;
      let companyName = '';
      let backgroundRow = 0;

      const einvoiceMasterData = await DBService.callProcCursor('EI_SEL_6095057_TEMPLATES', [pk], p_language, p_crt_by, _db2);
      // console.log("file: EiExcelTemplateHandler.js:56 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceMasterData:", einvoiceMasterData)

      const einvoiceMasterParam = await DBService.callProcCursor('EI_SEL_6095057_PARAM', [pk], p_language, p_crt_by, _db2);
      //console.log("file: EiExcelTemplateHandler.js:56 [vng-304] EiExcelHandler [vng-304] getEinvoice [vng-304] einvoiceMasterParam:", einvoiceMasterData)

      try {
        //let savePath = await Helpers.appRoot(`resources/${einvoiceMasterData[0].URL_IMG_LOGO}`);
        //let savePath = await Helpers.appRoot(`${einvoiceMasterData[0].URL_IMG_LOGO}`);
        //console.log("savePath  ", savePath)
        if (fs.existsSync(einvoiceMasterData[0].URL_IMG_LOGO)) {
          logos = [
            {
              logo_start_col: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_START_COL ? einvoiceMasterData[0].LOGO_START_COL : 1,
              logo_start_row: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_START_ROW ? einvoiceMasterData[0].LOGO_START_ROW : 1,
              logo_width: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_WIDTH ? einvoiceMasterData[0].LOGO_WIDTH : 1,
              logo_height: einvoiceMasterData[0] && einvoiceMasterData[0].LOGO_HEIGHT ? einvoiceMasterData[0].LOGO_HEIGHT : 1,
              logoPath: `${
                einvoiceMasterData[0] && einvoiceMasterData[0].URL_IMG_LOGO
                  ? einvoiceMasterData[0].URL_IMG_LOGO.toString().replace('/data', 'data') //'/../' +
                  : 'assets/images/no_image.png'
              }`, ///assets/images/einvoices_logo/abc/
            },
          ];
        } else {
          logos = [];
        }
      } catch (error) {
        logos = [];
        console.log('error  require url ', error);
      }

      bg = [
        {
          bg_start_row: einvoiceMasterData[0] && einvoiceMasterData[0].BG_START_ROW ? einvoiceMasterData[0].BG_START_ROW : 1,
          bg_start_col: einvoiceMasterData[0] && einvoiceMasterData[0].BG_START_COL ? einvoiceMasterData[0].BG_START_COL : 1,
          bg_width: einvoiceMasterData[0] && einvoiceMasterData[0].BG_WIDTH ? einvoiceMasterData[0].BG_WIDTH : 1,
          bg_height: einvoiceMasterData[0] && einvoiceMasterData[0].BG_HEIGHT ? einvoiceMasterData[0].BG_HEIGHT : 1,
          bgPath: `${
            einvoiceMasterData[0] && einvoiceMasterData[0].URL_IMG_BG ? '/../' + einvoiceMasterData[0].URL_IMG_BG : 'assets/images/no_background.png'
          }`,
        },
      ];

      this.masterDataArray = [];
      for (let i = 0; i < einvoiceMasterParam.length; i++) {
        this.masterDataArray.push({
          Cell: einvoiceMasterParam[i].CELL_CODE,
          Info: [einvoiceMasterParam[i].DATA_MAPPING],
          Type: einvoiceMasterParam[i].TYPE,
        });
      }

      if (einvoiceMasterData.length <= 0) {
        return that.showNotification('warning', that.$t("This Einvoice Doesn't Exist"), '', 5000);
      }

      reportPath = einvoiceMasterData[0].URL_FILE_EXCEL; //'report/60/95/einvoices_template/Bornga/Bornga.xlsx'
      //Cách 2
      // switch (einvoiceMasterData[0].TEMPLATE_CD) {
      //   case "111":
      //     reportSheet = "Invoice"
      //     break;
      //   case "121":
      //     reportSheet = "Invoice"
      //     break;
      // }
      reportSheet = 'Invoice';
      resultExcel = await exceljs.ExcelBuilder(p_crt_by, einvoiceMasterData, reportPath, reportSheet, logos, bg, this.masterDataArray);

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
