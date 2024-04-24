'use strict';
const DBService = use('DBService');
const EiExcelConverter = use('App/Helpers/EiExcel04SS2Converter');
class EiExcelHandler {
  constructor() {}
  masterDataArray = [];

  async getEinvoice(tei_einvoice_m_pk, p_language, p_crt_by, _db2 = 'N') {
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

      //tei_einvoice_m_pk = "574306";

      const einvoiceMasterData = await DBService.callProcCursor('EI_SEL_04SS_02_M', [tei_einvoice_m_pk], p_language, p_crt_by, _db2);
      const einvoiceDetailData = await DBService.callProcCursor('EI_SEL_04SS_02_D', [tei_einvoice_m_pk], p_language, p_crt_by, _db2);

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

      //console.log(einvoiceDetailData)
      if (einvoiceMasterData.length <= 0) {
        return that.showNotification('warning', that.$t("This Einvoice Doesn't Exist"), '', 5000);
      }

      //let url_file_excel = "report/60/95/einvoices_template/Bornga/Bornga.xlsx";

      this.masterDataArray = [];

      reportPath = 'report/60/95/ex_04ss/HD_04SS_2.xlsx';
      reportSheet = 'Invoice';
      //mảng data của master
      this.masterDataArray.push(
        {Cell: `B6`, Info: [`TEN_BIEN_BAN`], Type: 1},
        {Cell: `B7`, Info: [`VOUCHER_NO`], Type: 1},
        {Cell: `B15`, Info: [`NOW`], Type: 1},

        {Cell: `B17`, Info: [`COMPANY_NM`], Type: 1},
        {Cell: `B18`, Info: [`COM_ADD`], Type: 1},
        {Cell: `B19`, Info: [`TAX_CODE`], Type: 1},
        {Cell: `H19`, Info: [`COM_TEL`], Type: 1},
        {Cell: `B20`, Info: [`COM_REPRESENT`], Type: 1},
        {Cell: `H20`, Info: [`COM_POSITION`], Type: 1},

        {Cell: `B22`, Info: [`CUSTOMER_NAME`], Type: 1},
        {Cell: `B23`, Info: [`CUS_ADDR`], Type: 1},
        {Cell: `B24`, Info: [`CUS_TAX_CODE`], Type: 1},
        {Cell: `H24`, Info: [`CUS_TEL`], Type: 1},
        {Cell: `B25`, Info: [`CUS_REPRESENT`], Type: 1},
        {Cell: `H25`, Info: [`CUS_POSITION`], Type: 1},

        {Cell: `B27`, Info: [`CUS_TITLE`], Type: 1},
        {Cell: `B32`, Info: [`REASON`], Type: 1},

        {Cell: `D41`, Info: [`COMPANY_SIGN`], Type: 1},
        {Cell: `D42`, Info: [`COMPANY_SIGN_DT`], Type: 1},

        {Cell: `H41`, Info: [`USER_SIGN_NM`], Type: 1},
        {Cell: `H42`, Info: [`USER_SIGN_DT`], Type: 1},
      );

      detailCellFormat = [
        {startCell: 2, endCell: 3, cellType: 2, cellBorder: 'thin', field: 'STT'}, //từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
        {startCell: 4, endCell: 4, cellType: 1, cellBorder: 'thin', field: 'SERIAL_NO'}, //type 1: còn lại
        {startCell: 5, endCell: 5, cellType: 1, cellBorder: 'thin', field: 'INVOICE_NO'}, //type 1: còn lại
        {startCell: 6, endCell: 6, cellType: 1, cellBorder: 'thin', field: 'INVOICE_DATE'}, //type 1: còn lại
        {startCell: 7, endCell: 7, cellType: 1, cellBorder: 'thin', field: 'TOT_NET_TR_AMT'}, //type 1: còn lại
        {startCell: 8, endCell: 8, cellType: 1, cellBorder: 'thin', field: 'TOT_VAT_TR_AMT'}, //type 1: còn lại
        {startCell: 9, endCell: 10, cellType: 1, cellBorder: 'thin', field: 'TOT_AMT'}, //type 1: còn lại
      ];

      // if(einvoiceMasterData[0].URL_IMG_BG != "" && einvoiceMasterData[0].URL_IMG_BG != null )
      // {
      //   bgPath = `${einvoiceMasterData[0].URL_IMG_BG}`;
      // }else
      // {
      //   bgPath = "";
      // }

      // if(einvoiceMasterData[0].URL_IMG_LOGO != "" && einvoiceMasterData[0].URL_IMG_LOGO != null)
      // {
      //   logos = [
      //     { start: einvoiceMasterData[0].LOGO_START_ROW,
      //       width: 0.99 * dpi,
      //       height: 0.99 * dpi,
      //       logoStartCount: einvoiceMasterData[0].LOGO_START_COL,
      //       logoPath: `${einvoiceMasterData[0].URL_IMG_LOGO}` },
      //   ];
      // }
      // else{
      //   logos = [];
      // }

      console.log('bgPath  ', bgPath);
      console.log('logos   ', logos);

      // backgroundCell = einvoiceMasterData[0].BG_START_ROW
      // backgroundRow = einvoiceMasterData[0].BG_END_ROW
      // backgroundWidth = einvoiceMasterData[0].BG_WIDTH
      // backgroundHeight = einvoiceMasterData[0].BG_HEIGHT

      signCell = {start: einvoiceMasterData[0].SIGN_START_CELL, end: einvoiceMasterData[0].SIGN_END_CELL};
      signBoxCell = einvoiceMasterData[0].SIGN_CELL_BOX;
      signByCell = {start: einvoiceMasterData[0].SIGN_BY_START_CELL, end: einvoiceMasterData[0].SIGN_BY_END_CELL};
      countFromEndDetailToSignBox = 8;

      _sourceRow = 30;
      _sourceRow_2 = 30;
      _sourceRow_3 = 30;

      headerRowCount = einvoiceMasterData[0].DETAILS_START_ROW == null ? 0 : einvoiceMasterData[0].DETAILS_START_ROW;
      lastPageRowsHeight = 18;

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
