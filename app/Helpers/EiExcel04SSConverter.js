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
	  let imgBase4 =
        "data:image/png;base64,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";
      let id = await exceljs.insertImageBase64(imgBase4);
    //   let sheet = exceljs.worksheet();
      console.log("id", id)
	//   worksheet.insertImageBase64(id,`I18:I18`)
      worksheet.addImage(id, {
        tl: { col: 10, row: 18},
        br: { col: 11, row: 18 },
      });

      for (let j = 0; j < einvoiceDetailData.length; j++) {
        try {
          let rownum = _sourceRow + j;
          let detaildata = einvoiceDetailData[j];
          this.addValueToCellsWithItemName(worksheet, rownum, detaildata, detailCellFormat, excCols);

          detailCellFormat.forEach((e, i) => {
            worksheet.mergeCells(rownum, e.startCell, rownum, e.endCell);
            worksheet.getCell(`${excCols[e.startCell] + rownum}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: "thin" } };
          });
          worksheet.getCell( `${lastCell +  (rownum)}`).style.border = { right: { style: 'thin' },bottom: { style: detailCellFormat[0].cellBorder }, left: { style: 'thin' }  };
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
