const Helpers = use("Helpers");
const Utils = use("Utils");
const fs = use("fs");
let regexCell = /([a-zA-Z]+)(\d+)/;
const ReportHelper = use("App/Helpers/ReportHelper");
class EiExcelConverterAuto {
  constructor() {}
  async ExcelBuilder(
    p_crt_by,
    einvoiceMasterData,
    einvoiceDetailData,
    einvoicePk,
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
    masterDataArray,
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
  ) {
    //(p_crt_by, einvoiceDetailData, einvoicePk, _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox, lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath, masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn, backgroundCell,backgroundRow, backgroundWidth, backgroundHeight) {
    // console.log('===> ', p_crt_by)
    // console.log(einvoiceDetailData)
    let reportInfo = { CODE: "01", NAME: einvoiceMasterData[0]["PK"], PATH: reportPath }; //that is the report template path.
    console.log("reportInfo  ", reportInfo);
    try {
      let exceljs = new ReportHelper();
      //exceljs.reportType = "exc"
      await exceljs.createWorkbook(p_crt_by, reportInfo.PATH, "excel", "pdf");
      await exceljs.setActiveSheet(reportSheet);
      let worksheet = exceljs.worksheet;

      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

      //this fuction get the images and turn it to bytearray to insert to the excel.
      let createFile = async (url) => {
        let response = await fetch(url);
        let data = await response.blob();
        let metadata = {
          type: "image/png",
        };
        let file = new File([data], "test.png", metadata);
        return file;
      };
      //this part calculate the number of pages base on the data.
      let v_count = einvoiceDetailData.length;
      let page = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let page_index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      let pos_lv = 20; //giới hạn row một trang
      let pos = 10; //giới hạn row trang cuối
      let v_countNumberOfPages = 0;
      let total_countLenght = 0;
      let count_col = 0;
      let l_finish = "N";
      let count_col_index = 0;

      let totalRows = 0;
      let countPerPage = 0;
      let extendedRows = 0;
      let count = 0;
      let totalRowCount = 0;
      let logoArray = [];
      let extendedArray = [];
      let totalRowCount_2 = 0;
      let count_2 = 0;
      let read_price = "";
      let read_priceV = "";
      let read_priceU = "";
      let amount_vat = "";
      let amount_total = "";
      let amount_trans = "";
      let amount_net = "";
      let lb_amount_trans = "";

      const sheetModel = worksheet.model;
      let lstMergeTemp = [];
      let lstNewMerge = [];

      let excCols = exceljs.excelCols;
      let sttCell = "";
      let nmCell = "";
      let lastCell = excCols[detailCellFormat[detailCellFormat.length - 1].endCell]; // cái này update
      let startMergeRedundantRow = detailCellFormat[0].startCell;
      let endMergeRedundantRow = detailCellFormat[detailCellFormat.length - 1].endCell;
      let convertStr = "(HÓA ĐƠN CHUYỂN ĐỔI TỪ HÓA ĐƠN ĐIỆN TỬ)";
      detailCellFormat.forEach((e) => {
        if (e.cellType == 2) {
          sttCell = excCols[e.startCell];
        }
        if (e.cellType == 3) {
          nmCell = excCols[e.startCell];
        }
      });

      console.log("page", page);
      //this part set the master data to each cell. that 100% base on template.

      if (einvoiceDetailData && einvoiceDetailData.length > 0) {
        masterDataArray.forEach((e) => {
          if (e.Type == 1) {
            let infoData = "";
            e.Info.forEach((_e) => {
              if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
                infoData = infoData + einvoiceMasterData[0][`${_e}`];
              } else {
                infoData = infoData + " ";
              }
            });
            worksheet.getCell(`${e.Cell}`).value = infoData;
          } else if (e.Type == 3) {
            if (einvoiceMasterData[0]["SIGN_YN"] == "Y") {
              let infoData = "";
              e.Info.forEach((_e) => {
                if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
                  infoData = infoData + einvoiceMasterData[0][`${_e}`];
                } else {
                  infoData = infoData + " ";
                }
              });
              worksheet.getCell(`${e.Cell}`).value = infoData;
            }
          }
        });
      }

      //END-this part coppy merge information of the page before add more row.

      //this part insert range header for each page
      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
	//if(einvoiceDetailData.length  %10== 0){
	  	// lấy số lượng đòng detail xong / 10 nếu số không dư ((+1))
		// kiểm tra só lượng sheet cần kiểm tra
	// }
      for (let j = 1; j < einvoiceDetailData.length; j++) {
        Utils.excelInsertRow(worksheet, _sourceRow);
      }

      for (let j = 0; j < einvoiceDetailData.length; j++) {
        try {
          let rownum = _sourceRow + j;
          let detaildata = einvoiceDetailData[j];
          this.addValueToCellsWithItemName(worksheet, rownum, detaildata, detailCellFormat, excCols);

          detailCellFormat.forEach((e, i) => {
            worksheet.mergeCells(rownum, e.startCell, rownum, e.endCell);
            worksheet.getCell(`${excCols[e.startCell] + rownum}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: "thin" } };
          });
          // worksheet.getCell( `${lastCell +  (rownum)}`).style.border = { right: { style: 'thin' },bottom: { style: detailCellFormat[0].cellBorder }, left: { style: 'thin' }  };
        } catch (error) {
          console.log("err", error);
          console.log(_sourceRow);
          console.log(totalRowCount);
        }
      }
      //V01041285650C6C1B7AB806476FAF9E///
      worksheet.mergeCells(_sourceRow + einvoiceDetailData.length, 2, _sourceRow + einvoiceDetailData.length, 10);

      worksheet.mergeCells(_sourceRow + einvoiceDetailData.length + 1, 8, _sourceRow + einvoiceDetailData.length + 1, 12);
      worksheet.mergeCells(_sourceRow + einvoiceDetailData.length + 2, 9, _sourceRow + einvoiceDetailData.length + 2, 11);
      worksheet.mergeCells(_sourceRow + einvoiceDetailData.length + 4, 9, _sourceRow + einvoiceDetailData.length + 4, 12);

      //END-this part insert range header for each page

      //this part add more style to the rows that missing(optional) Last Page.
      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
      //	worksheet.getCell(`${excCols[e.startCell]+( _sourceRow_2 + totalRowCount_2)}`).style.border = {bottom: {style:detailCellFormat[i].cellBorder},left: { style: 'thin' }, };

      for (let o = 1; o <= extendedRows; o++) {
        try {
          detailCellFormat.forEach((e, i) => {
            worksheet.mergeCells(totalRows + _sourceRow_3 - o, e.startCell, totalRows + _sourceRow_3 - o, e.endCell);
            worksheet.getCell(`${excCols[e.startCell] + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: "thin" }, bottom: { style: detailCellFormat[i].cellBorder } };
          });
          worksheet.getCell(`${lastCell + (totalRows + _sourceRow_3 - o)}`).style.border = { right: { style: "thin" }, bottom: { style: detailCellFormat[0].cellBorder } };
          worksheet.getRow(totalRows + _sourceRow_3 - o).height = lastPageRowsHeight;
          worksheet.getCell(`${sttCell + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: "thin" }, right: { style: "thin" }, bottom: { style: detailCellFormat[0].cellBorder } };
          worksheet.getCell(`${nmCell + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: "thin" }, right: { style: "thin" }, bottom: { style: detailCellFormat[0].cellBorder } };
        } catch (error) {
          console.log("error", totalRows + _sourceRow_3 - o);
        }
      }

      //END-this part add more style to the rows that missing(optional) Last Page.

      let excelUrl = await exceljs.dowloadWorkbook();
      return excelUrl;
    } catch (error) {
      console.log(error);
      //Utils.Logger({ LVL: "error", MODULE: "ReportHelper", FUNC: "TestReport", CONTENT: error.message, });
    }
  }

  NumberToTextVN(total) {
    try {
      let rs = "";
      if (total.toString().substr(0, 1) == "-") {
        rs = "Trừ ";
      }

      total = Math.round(Math.abs(total), 0);
      let ch = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
      let rch = ["lẻ", "mốt", "", "", "", "lăm"];
      let u = ["", "mươi", "trăm", "ngàn", "", "", "triệu", "", "", "tỷ", "", "", "ngàn", "", "", "triệu"];
      let nstr = total.toString();

      let n = [];
      let len = nstr.length;

      for (let i = 0; i < len; i++) {
        n[len - 1 - i] = parseInt(nstr.substr(i, 1));
      }
      //console.log(n)
      for (let i = len - 1; i >= 0; i--) {
        if (i % 3 == 2) {
          // số 0 ở hàng trăm
          if (n[i] == 0 && n[i - 1] == 0 && n[i - 2] == 0) continue; //nếu cả 3 số là 0 thì bỏ qua không đọc
        } else if (i % 3 == 1) {
          // số ở hàng chục
          if (n[i] == 0) {
            if (n[i - 1] == 0) {
              continue;
            } // nếu hàng chục và hàng đơn vị đều là 0 thì bỏ qua.
            else {
              rs += " " + rch[n[i]];
              continue; // hàng chục là 0 thì bỏ qua, đọc số hàng đơn vị
            }
          }
          if (n[i] == 1) {
            //nếu số hàng chục là 1 thì đọc là mười
            rs += " mười";
            continue;
          }
        } else if (i != len - 1) {
          // số ở hàng đơn vị (không phải là số đầu tiên)
          if (n[i] == 0) {
            // số hàng đơn vị là 0 thì chỉ đọc đơn vị
            if (i + 2 <= len - 1 && n[i + 2] == 0 && n[i + 1] == 0) continue;
            rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]);
            continue;
          }
          if (n[i] == 1) {
            // nếu là 1 thì tùy vào số hàng chục mà đọc: 0,1: một / còn lại: mốt
            rs += " " + (n[i + 1] == 1 || n[i + 1] == 0 ? ch[n[i]] : rch[n[i]]);
            rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]);
            continue;
          }
          if (n[i] == 5) {
            // cách đọc số 5
            if (n[i + 1] != 0) {
              //nếu số hàng chục khác 0 thì đọc số 5 là lăm
              rs += " " + rch[n[i]]; // đọc số
              rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]); // đọc đơn vị
              continue;
            }
          }
        }

        rs += (rs == "" ? " " : ", ") + ch[n[i]]; // đọc số
        rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]); // đọc đơn vị
      }
      if (rs[rs.length - 1] != " ") rs += " đồng";
      else rs += "đồng";

      if (rs.length > 2) {
        let rs1 = rs.substr(0, 2);
        rs1 = rs1.toUpperCase();
        rs = rs.substr(2);
        rs = rs1 + rs;
      }
      //console.log(rs)
      return rs.trim().replace("lẻ,", "lẻ").replace("mươi,", "mươi").replace("trăm,", "trăm").replace("mười,", "mười");
    } catch (error) {
      return "";
    }
  }

  Num2VNText(s, ccy) {
    //process minus case
    let minus = "";
    if (s.trim().substr(0, 1) == "-") {
      s = s.replace("-", "").trim();
      minus = "Trừ ";
    }

    let rtnf = "";
    let l = 0;
    let i = 0;
    let j = 0;
    let dk = 0;
    let A = [];
    s = s.replace(",", "");
    let s1 = "";
    let strTmp = "";
    if (s.includes(".")) {
      s1 = s.substr(s.indexOf(".") + 1);
      s = s.substr(0, s.indexOf("."));
    }
    let B = [];
    s = s.trim();
    l = s.length;
    //l = s1.length();
    if (l > 32) {
      rtnf = "Number Very Large!";
      return rtnf;
    }
    for (i = 0; i < l; i++) {
      A[i] = s.substr(i, 1);
    }
    for (i = 0; i < l; i++) {
      if ((l - i) % 3 == 0 && A[i] == "0" && (A[i + 1] != "0" || A[i + 2] != "0")) {
        rtnf += " Không";
      }
      if (A[i] == "2") {
        rtnf += " Hai";
      } else if (A[i] == "3") {
        rtnf += " Ba";
      } else if (A[i] == "4") {
        rtnf += " Bốn";
      } else if (A[i] == "6") {
        rtnf += " Sáu";
      } else if (A[i] == "7") {
        rtnf += " Bảy";
      } else if (A[i] == "8") {
        rtnf += " Tám";
      } else if (A[i] == "9") {
        rtnf += " Chín";
      } else if (A[i] == "5") {
        if (i > 0 && (l - i) % 3 == 1 && A[i - 1] != "0") {
          rtnf += " Lăm";
        } else {
          if (i > 0 && (l - i) % 3 == 1 && A[i - 1] != "0") {
            rtnf += " Lăm";
          } else {
            rtnf += " Năm";
          }
        }
      }

      if (i > 2 && A[i] == "1" && (l - i) % 3 == 1 && parseInt(A[i - 1]) > 1) {
        rtnf += " Mốt";
      } else if (A[i] == "1" && (l - i) % 3 != 2) {
        if ((l - i) % 3 == 1) {
          if ((i > 2 && A[i - 2] == "0") || (i < 2 && A[0] == "1") || (i > 2 && A[i - 1] == "0") || (i > 2 && A[i - 1] == "0")) {
            rtnf += " Một";
          } else {
            if (A[i - 1] == "1" || A[i - 1] == "0") {
              rtnf += " Một";
            } else {
              rtnf += " Mốt";
            }
          }
        } else {
          rtnf += " Một";
        }
      }

      if ((l - i) % 3 == 2 && A[i] != "0" && A[i] != "1") {
        rtnf += " Mươi";
      } else if ((l - i) % 3 == 2 && A[i] != "0") {
        rtnf += " Mười";
      }
      if (i == 0) {
        if ((l - i) % 3 == 2 && A[i] == "0" && A[i + 1] != "0") {
          rtnf += " Không";
        }
      } else {
        if ((l - i) % 3 == 2 && A[i] == "0" && A[i + 1] != "0") {
          rtnf += " Lẻ";
        }
      }
      if ((l - i) % 3 == 0 && A[i + 1] != "0") {
        //  || A[i + 2] == "0"
        rtnf += " Trăm";
      } else if ((l - i) % 3 == 0 && A[i] != "0") {
        rtnf += " Trăm";
      }

      if (l - i == 4) {
        rtnf += " Nghìn";
      }
      if (l - i == 7) {
        rtnf += " Triệu";
      }
      if (l - i == 10) {
        rtnf += " Tỷ";
      }
      if (l - i == 13) {
        rtnf += " Nghìn Tỷ";
      }
      if (l - i == 16) {
        rtnf += " Triệu Tỷ";
      }
      if (l - i == 19) {
        rtnf += " Tỷ Tỷ";
      }
      if (l - i == 22) {
        rtnf += " Triệu Tỷ Tỷ";
      }
      if (l - i == 25) {
        rtnf += " Triệu Tỷ Tỷ";
      }
      if (l - i == 28) {
        rtnf += " Tỷ Tỷ Tỷ";
      }
      if ((l - i) % 3 == 0 && A[i] == "0" && A[i + 1] == "0" && A[i + 2] == "0") {
        i = i + 2;
      }
      if ((l - i) % 3 == 1) {
        dk = 1;
        for (j = i; j < l; j++) {
          if (A[j] != "0") {
            dk = 0;
          }
        }
      }
      if (dk == 1) break;
    }
    if (ccy == "USD") {
      rtnf += " Đô La Mỹ";
      if (s1.length > 0) {
        //Đọc số lẻ
        l = s1.length;
        if (l > 8) {
          rtnf += " ERROR!!!";
          return rtnf;
        }
        for (i = 0; i < l; i++) {
          B[i] = s1.substr(i, 1);
        }
        strTmp = "";
        //Dịch Tạm
        for (i = 0; i < 2; i++) {
          if (i > 0 && B[0] != "0" && B[0] != "1") {
            strTmp += " Mươi";
          }

          if (B[i] == "1") {
            if (i == 0) {
              strTmp += " Mười";
            } else {
              if (B[0] == "1") {
                strTmp += " Một";
              } else {
                strTmp += " Mốt";
              }
            }
          }

          switch (parseInt(B[i])) {
            case 2:
              strTmp += " Hai";
              break;
            case 3:
              strTmp += " Ba";
              break;
            case 4:
              strTmp += " Bốn";
              break;
            case 5:
              if (i % 2 == 1 && parseInt(B[0]) > 0) {
                strTmp += " Lăm";
              } else {
                strTmp += " Năm";
              }
              break;
            case 6:
              strTmp += " Sáu";
              break;
            case 7:
              strTmp += " Bảy";
              break;
            case 8:
              strTmp += " Tám";
              break;
            case 9:
              strTmp += " Chín";
              break;
          }
        }
      }
      if (strTmp != "") {
        rtnf = rtnf + " Và" + strTmp + " Xu";
      }
    }

    if (ccy == "VND") {
      rtnf += " Đồng.";
    }

    rtnf = minus + rtnf; //process minus case

    return rtnf;
  }

  addValueToCellsWithItemName(worksheet, rownum, detaildata, detailCellFormat, excCols) {
    //console.log(detailCellFormat)
    let fieldArray = [];
    detailCellFormat.forEach((e) => {
      fieldArray.push({ col: excCols[e.startCell], field: e.field });
    });
    //console.log(fieldArray)
    fieldArray.forEach((e, i) => {
      worksheet.getCell(`${e.col + rownum}`).value = detaildata[e.field];
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

  countlength_v2 = (s) => {
    let result = 0;
    if (s == "" || s == null) {
      result = 1;
    } else {
      let a = s.split("&#xA;");
      result = a.length;
      if (result == 0) {
        result = 1;
      }
    }
    return result;
  };
}
module.exports = EiExcelConverterAuto;
