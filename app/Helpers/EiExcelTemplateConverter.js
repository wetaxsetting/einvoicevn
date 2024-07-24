const Helpers = use('Helpers');
const Utils = use('Utils');
const fs = use('fs');
let regexCell = /([a-zA-Z]+)(\d+)/;
const ReportHelper = use('App/Helpers/ReportHelper');
class EiExcelConverterAuto {
  constructor() {}

  async ExcelBuilder(p_crt_by, einvoiceMasterData, reportPath, reportSheet, logos, bg, masterDataArray) {
    //(p_crt_by, einvoiceDetailData, einvoicePk, _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox, lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath, masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn, backgroundCell,backgroundRow, backgroundWidth, backgroundHeight) {
    // console.log('===> ', p_crt_by)
    // console.log(einvoiceDetailData)
    let reportInfo = {CODE: '01', NAME: einvoiceMasterData[0]['PK'], PATH: reportPath}; //that is the report template path.
    try {
      let exceljs = new ReportHelper();
      //exceljs.reportType = "exc"
      await exceljs.createWorkbook(p_crt_by, reportInfo.PATH, 'excel', 'pdf');
      await exceljs.setActiveSheet(reportSheet);
      let worksheet = exceljs.worksheet;

      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

      //this fuction get the images and turn it to bytearray to insert to the excel.
      let createFile = async url => {
        let response = await fetch(url);
        let data = await response.blob();
        let metadata = {
          type: 'image/png',
        };
        let file = new File([data], 'test.png', metadata);
        return file;
      };

      if (bg.length) {
        try {
          worksheet.addImage(await exceljs.insertPathImage(bg[0].bgPath), {
            tl: {col: bg[0].bg_start_col, row: bg[0].bg_start_row},
            ext: {width: bg[0].bg_width, height: bg[0].bg_height},
          });
        } catch (error) {
          console.log(error);
        }
      }
      //console.log("logos  " , logos  );
      //console.log("logos[0].logoPath  " , logos[0].logoPath  );
      Utils.Logger({LVL: 'error', MODULE: 'EiExcelTemplateConverter', FUNC: 'ExcelBuilder', CONTENT: logos});
      if (logos && logos.length > 0 && logos[0].logoPath) {
        try {
          console.log('file: EiExcelTemplateConverter.js:57 [vng-304] ExcelBuilder [vng-304] logos[0].logoPath:', logos[0].logoPath);

          let idimg = await exceljs.insertPathImage(logos[0].logoPath);
          worksheet.addImage(idimg, {
            tl: {col: logos[0].logo_start_col, row: logos[0].logo_start_row},
            ext: {width: logos[0].logo_width, height: logos[0].logo_height},
          });
        } catch (error) {
          console.log(error);
        }
      }

      masterDataArray.forEach(e => {
        if (e.Type == 1) {
          let infoData = '';
          // console.log("  e +++ >>>", e)
          e.Info.forEach(_e => {
            if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
              infoData = infoData + einvoiceMasterData[0][`${_e}`];
            } else {
              infoData = infoData + ' ';
            }
          });
          worksheet.getCell(`${e.Cell}`).value = infoData;
        }
      });

      //END-this part add more style to missing part of the footer(optional).

      // const reportFilePdf = await exceljs.writeFile();
      // let base64PDF =  await fs.readFileSync(reportFilePdf, {encoding: 'base64'}); //await Utils._blobFileToBase64(reportFilePdf)
      // return base64PDF

      // console.log("reportFilePdf ", reportFilePdf);
      // const reportFilePdf =  await Utils.excelToPdf(reportFile);
      // let url_pdf = exceljs.reportPath.replace("xlsx", "pdf");
      //let excelUrl = await exceljs.returnPdfFormExcel();
      // console.log(" base64PDF  " , base64PDF);
      //return base64PDF
      ////await exceljs.dowloadWorkbook(reportInfo.NAME + ".xlsx");
      let excelUrl = await exceljs.dowloadWorkbook();
      return excelUrl;
    } catch (error) {
      console.log(error);
      Utils.Logger({LVL: 'error', MODULE: 'ReportHelper', FUNC: 'TestReport', CONTENT: error.message});
    }
  }

  async ExcelBuilderUrl(p_crt_by, einvoiceMasterData, reportPath, reportSheet, logos, bg, masterDataArray) {
    //(p_crt_by, einvoiceDetailData, einvoicePk, _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox, lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath, masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn, backgroundCell,backgroundRow, backgroundWidth, backgroundHeight) {
    // console.log('===> ', p_crt_by)
    // console.log(einvoiceDetailData)
    let reportInfo = {CODE: '01', NAME: einvoiceMasterData[0]['PK'], PATH: reportPath}; //that is the report template path.
    try {
      let exceljs = new ReportHelper();
      //exceljs.reportType = "exc"
      await exceljs.createWorkbook(p_crt_by, reportInfo.PATH, 'excel', 'pdf');
      await exceljs.setActiveSheet(reportSheet);
      let worksheet = exceljs.worksheet;

      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

      //this fuction get the images and turn it to bytearray to insert to the excel.
      let createFile = async url => {
        let response = await fetch(url);
        let data = await response.blob();
        let metadata = {
          type: 'image/png',
        };
        let file = new File([data], 'test.png', metadata);
        return file;
      };

      if (bg.length) {
        try {
          worksheet.addImage(await exceljs.insertPathImage(bg[0].bgPath), {
            tl: {col: bg[0].bg_start_col, row: bg[0].bg_start_row},
            ext: {width: bg[0].bg_width, height: bg[0].bg_height},
          });
        } catch (error) {
          console.log(error);
        }
      }
      //console.log("logos  " , logos  );
      //console.log("logos[0].logoPath  " , logos[0].logoPath  );
      if (logos && logos.length > 0 && logos[0].logoPath) {
        try {
          let idimg = await exceljs.insertPathImage(logos[0].logoPath);
          //console.log("file: EiExcelTemplateConverter.js:57 [vng-304] ExcelBuilder [vng-304] idimg:", idimg)
          worksheet.addImage(idimg, {
            tl: {col: logos[0].logo_start_col, row: logos[0].logo_start_row},
            ext: {width: logos[0].logo_width, height: logos[0].logo_height},
          });
        } catch (error) {
          console.log(error);
        }
      }

      masterDataArray.forEach(e => {
        if (e.Type == 1) {
          let infoData = '';
          // console.log("  e +++ >>>", e)
          e.Info.forEach(_e => {
            if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
              infoData = infoData + einvoiceMasterData[0][`${_e}`];
            } else {
              infoData = infoData + ' ';
            }
          });
          worksheet.getCell(`${e.Cell}`).value = infoData;
        }
      });

      //END-this part add more style to missing part of the footer(optional).

      // const reportFilePdf = await exceljs.writeFile();
      // let base64PDF =  await fs.readFileSync(reportFilePdf, {encoding: 'base64'}); //await Utils._blobFileToBase64(reportFilePdf)
      // return base64PDF

      // console.log("reportFilePdf ", reportFilePdf);
      // const reportFilePdf =  await Utils.excelToPdf(reportFile);
      // let url_pdf = exceljs.reportPath.replace("xlsx", "pdf");
      //let excelUrl = await exceljs.returnPdfFormExcel();
      // console.log(" base64PDF  " , base64PDF);
      //return base64PDF
      ////await exceljs.dowloadWorkbook(reportInfo.NAME + ".xlsx");
      let excelUrl = await exceljs.dowloadWorkbook();
      return excelUrl;
    } catch (error) {
      console.log(error);
      Utils.Logger({LVL: 'error', MODULE: 'ReportHelper', FUNC: 'TestReport', CONTENT: error.message});
    }
  }

  addValueToCellsWithItemName(worksheet, rownum, detaildata, itemname, detailCellFormat, excCols) {
    //console.log(detailCellFormat)
    let fieldArray = [];
    detailCellFormat.forEach(e => {
      fieldArray.push({col: excCols[e.startCell], field: e.field});
    });
    //console.log(fieldArray)
    fieldArray.forEach((e, i) => {
      if (e.field == 'ITEM_NAME') {
        worksheet.getCell(`${e.col + rownum}`).value = itemname;
      } else {
        worksheet.getCell(`${e.col + rownum}`).value = detaildata[e.field];
      }
    });
    // let fieldArray = []
    // detailCellFormat.forEach(e => {
    // 	fieldArray.push(excCols[e.startCell])
    // });
    // //console.log(fieldArray)
    // worksheet.getCell(`${fieldArray[0] + rownum}`).value = detaildata["STT"];
    // worksheet.getCell(`${fieldArray[1] + rownum}`).value = itemname;
    // worksheet.getCell(`${fieldArray[2] + rownum}`).value = detaildata["ITEM_UOM"];
    // worksheet.getCell(`${fieldArray[3] + rownum}`).value = detaildata["QTY"];
    // worksheet.getCell(`${fieldArray[4] + rownum}`).value = detaildata["U_PRICE"];
    // worksheet.getCell(`${fieldArray[5] + rownum}`).value = detaildata["NET_TR_AMT"];
  }

  countlength_v2 = s => {
    let result = 0;
    if (s == '' || s == null) {
      result = 1;
    } else {
      let a = s.split('&#xA;');
      result = a.length;
      if (result == 0) {
        result = 1;
      }
    }
    return result;
  };
}
module.exports = EiExcelConverterAuto;
