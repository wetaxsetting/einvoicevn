const Helpers = use('Helpers');
const Utils = use('Utils');
const fs = use('fs');
let regexCell = /([a-zA-Z]+)(\d+)/;
const ReportHelper = use('App/Helpers/ReportHelper');
class EiExcelConverterAuto {
  constructor() {}
  async ExcelBuilder(
    p_crt_by,
    einvoiceMasterData,
    einvoiceDetailData,
    einvoiceVAT_Bill,
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
    backgroundHeight,
  ) {
    let reportInfo = {CODE: '01', NAME: einvoiceMasterData[0]['PK'], PATH: reportPath}; //that is the report template path.
    //console.log('reportInfo  ', reportInfo);
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
      //this part calculate the number of pages base on the data.
      let v_count = einvoiceDetailData.length;
      let page = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ];
      let page_index = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ];
      const num_of_more_pages_max = l_num_of_more_pages_max || 20; //giới hạn tối đa quy định trong 1 trang nhằm tạo ra trang đẹp
      const num_of_more_pages = l_num_of_more_pages || 20; //giới hạn row một trang
      const num_of_pages = l_num_of_pages || 10; //giới hạn row trang cuối
      let v_countNumberOfPages = 0;
      let total_countLenght = 0;
      let count_col = 0;
      let l_finish = 'N';
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
      let read_price = '';
      let read_priceV = '';
      let read_priceU = '';
      let amount_vat = '';
      let amount_total = '';
      let amount_trans = '';
      let amount_net = '';
      let lb_amount_trans = '';

      const sheetModel = worksheet.model;
      let lstMergeTemp = [];
      let lstNewMerge = [];

      let excCols = exceljs.excelCols;
      let sttCell = '';
      let nmCell = '';
      let lastCell = excCols[detailCellFormat[detailCellFormat.length - 1].endCell]; // cái này update
      let startMergeRedundantRow = detailCellFormat[0].startCell;
      let endMergeRedundantRow = detailCellFormat[detailCellFormat.length - 1].endCell;
      let convertStr = '(HÓA ĐƠN CHUYỂN ĐỔI TỪ HÓA ĐƠN ĐIỆN TỬ)';
      let cell_of_page = '';
      let number_of_page = '';

      detailCellFormat.forEach(e => {
        if (e.cellType == 2) {
          sttCell = excCols[e.startCell];
        }
        if (e.cellType == 3) {
          nmCell = excCols[e.startCell];
        }
      });

      for (let i = 0; i < 99; i++) {
        //console.log('pagae ', page);
        //console.log('pagae ', i);

        count_col_index = 0;
        total_countLenght = 0;
        for (let j = count_col; j < v_count; j++) {
          let count_row = this.countlength(einvoiceDetailData[j]['ITEM_NAME']);
          if (count_row > 0) {
            total_countLenght += count_row;
          } else {
            total_countLenght += 1;
          }
          //console.log('total_countLenght  ', total_countLenght);
          if (count_col == v_count - 1) {
            if (total_countLenght > num_of_pages) {
              page[i] = count_col_index;
              page_index[i] = total_countLenght - 1;
              page[i + 1] = 1;
              page_index[i + 1] = count_row;
              l_finish = 'Y';
              count_col++;
              count_col_index++;
              break;
            } else {
              let abc = 0;
              page.forEach(e => {
                abc += e;
              });
              page[i] = v_count - abc;
              page_index[i] = total_countLenght;
              l_finish = 'Y';
              count_col++;
              count_col_index++;
              break;
            }
          } else if (total_countLenght >= num_of_more_pages) {
            page[i] = count_col_index;
            page_index[i] = total_countLenght;
            count_col++;
            count_col_index++;
            break; //continue;
          }
          count_col++;
          count_col_index++;
        }
        if (l_finish == 'Y') {
          break;
        }
      }

      let data_of_page = [];
      for (let i = 0; i < page.length; i++) {
        if (page[i] > 0) {
          v_countNumberOfPages++;
          /*data_of_page.push({PAGE: 'Trang ' + (i + 1) + '/' + total_number_of_page, NUM: i});
          if (i == 0) {
            data_of_page.push({PAGE: 'Trang ' + (i + 1) + '/' + total_number_of_page, NUM: i});
          } else {
            data_of_page.push({PAGE: 'Trang tiếp theo trang trước- Trang ' + (i + 1), NUM: i});
          }
          */
        }
      }

      for (let i = 0; i < v_countNumberOfPages; i++) {
        data_of_page.push({PAGE: 'Trang ' + (i + 1) + '/' + v_countNumberOfPages, NUM: i});
      }
      console.log('data_of_page  ', data_of_page);
      //END-this part calculate the number of pages base on the data.

      //this part set the master data to each cell. that 100% base on template.
      let dateString = einvoiceMasterData[0]['INVOICE_DATE_DD_MM_YYYY']; //`Ngày (Date) ${einvoiceMasterData[0]["INVOICE_DATE_DD"]}   tháng (month)  ${einvoiceMasterData[0]["INVOICE_DATE_MM"]}  năm (year) ${einvoiceMasterData[0]["INVOICE_DATE_YYYY"]}`
      let footerStr = '(In tại phần mềm Genuwin E-INVOICE của CÔNG TY CỔ PHẦN WEBCASH GENUWIN - MST: 1201496252)';
      if (einvoiceDetailData && einvoiceDetailData.length > 0) {
        masterDataArray.forEach(e => {
          if (e.Type == 1) {
            let infoData = '';
            e.Info.forEach(_e => {
              if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
                infoData = infoData + einvoiceMasterData[0][`${_e}`];
              } else {
                infoData = infoData + ' ';
              }
            });
            worksheet.getCell(`${e.Cell}`).value = infoData;
          } else if (e.Type == 2) {
            switch (e.Info[0]) {
              case 'dateString':
                worksheet.getCell(`${e.Cell}`).value = dateString != null ? dateString : '';
                //console.log(e.Cell+"+"+e.Info[0])
                break;
              case 'page':
                cell_of_page = this.extractLetters(e.Cell);
                number_of_page = this.extractAllDigits(e.Cell);
                //console.log('cell_of_page  ', cell_of_page);
                if (v_countNumberOfPages <= 1) {
                  worksheet.getCell(`${e.Cell}`).value = ``;
                }
                //console.log(e.Cell+"+"+e.Info[0])
                break;
              case 'lb_amount_trans':
                worksheet.getCell(`${e.Cell}`).value = lb_amount_trans != null ? lb_amount_trans : '';
                //console.log(e.Cell+"+"+e.Info)
                break;
              case 'amount_net':
                worksheet.getCell(`${e.Cell}`).value = amount_net != null ? amount_net : '';
                //console.log(e.Cell+"+"+e.Info)
                break;
              case 'amount_trans':
                worksheet.getCell(`${e.Cell}`).value = amount_trans != null ? amount_trans : '';
                //console.log(e.Cell+"+"+e.Info)
                break;
              case 'amount_vat':
                worksheet.getCell(`${e.Cell}`).value = amount_vat != null ? amount_vat : '';
                //.log(e.Cell+"+"+e.Info)
                break;
              case 'amount_total':
                worksheet.getCell(`${e.Cell}`).value = amount_total != null ? amount_total : '';
                //console.log(e.Cell+"+"+e.Info)
                break;
              case 'read_price':
                read_price = einvoiceMasterData[0]['AMOUNT_WORD_VIE'];
                worksheet.getCell(`${e.Cell}`).value = read_price != null ? read_price.replace(',', '') : '';
                worksheet.getCell(`${e.Cell}`).style.border = {right: {style: 'thin'}};
                // console.log(e.Cell+"+"+e.Info)
                break;
              case 'convert':
                worksheet.getCell(`${e.Cell}`).value = convertStr != null ? convertStr : '';
                //console.log(e.Cell+"+"+e.Info)
                break;
              case 'footer':
                worksheet.getCell(`${e.Cell}`).value = footerStr != null ? footerStr : '';
                //console.log(e.Cell+"+"+e.Info)
                break;
              case 'SELLER_ADDRESS':
                worksheet.getCell(`${e.Cell}`).value = einvoiceMasterData[0]['SELLER_ADDRESS'];
                worksheet.getRow(`${e.Cell.toString().substr(1, e.Cell.length - 1)}`).height =
                  einvoiceMasterData[0]['SELLER_ADDRESS'] == null
                    ? 14
                    : Math.ceil(einvoiceMasterData[0]['SELLER_ADDRESS'].toString().length / 99) * 14; //Math.ceil
                break;
              case 'BUYER_ADDRESS':
                let range_string = 0,
                  height_row = 0;
                if (einvoiceMasterData[0]['BUYER_ADDRESS'] && this.isVietnameseUpperCase(einvoiceMasterData[0]['BUYER_ADDRESS'])) {
                  range_string = 75;
                  height_row = 15;
                } else {
                  range_string = 84;
                  height_row = 14;
                }
                worksheet.getCell(`${e.Cell}`).value = einvoiceMasterData[0]['BUYER_ADDRESS'];
                worksheet.getRow(`${e.Cell.toString().substr(1, e.Cell.length - 1)}`).height =
                  einvoiceMasterData[0]['BUYER_ADDRESS'] == null
                    ? 14
                    : Math.ceil(einvoiceMasterData[0]['BUYER_ADDRESS'].toString().length / range_string) * height_row; //Math.ceil
                break;
              default:
                worksheet.getCell(`${e.Cell}`).value = e.Info[0] != null ? e.Info[0] : '';
                break;
            }
          } else if (e.Type == 3) {
            if (einvoiceMasterData[0]['SIGN_YN'] == 'Y') {
              let infoData = '';
              e.Info.forEach(_e => {
                if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
                  infoData = infoData + einvoiceMasterData[0][`${_e}`];
                } else {
                  infoData = infoData + ' ';
                }
              });
              worksheet.getCell(`${e.Cell}`).value = infoData;
            }
          }
        });
      }

      if (v_countNumberOfPages > 1) {
        totalRows = num_of_more_pages_max + (v_countNumberOfPages - 1) * (num_of_more_pages_max + headerRowCount - 1) + (v_countNumberOfPages - 1);
        extendedRows = num_of_more_pages_max - page[v_countNumberOfPages - 1];
      } else {
        for (let j = 0; j < page.length; j++) {
          let lastPagelength = 0;
          for (let i = 0; i < page[j]; i++) {
            let item_length = this.countlength(einvoiceDetailData[countPerPage]['ITEM_NAME']);
            if (page[j] > 0 && page[j + 1] == 0) {
              lastPagelength += item_length;
            }
            totalRows += item_length;
            countPerPage++;
          }
          if (page[j] > 0 && page[j + 1] == 0) {
            totalRows = totalRows + (num_of_pages - lastPagelength);
            extendedRows = num_of_pages - lastPagelength;
            break;
          }
        }
      }
      //console.log('totalRows  ', totalRows);
      //END-this part calculate the total row needed for the einvoice.

      //this part coppy merge information of the page before add more row.
      let lstMerge = sheetModel.merges;
      if (v_countNumberOfPages == 1) {
        lstMerge.forEach(x => {
          const mergeRange = x;
          const startMergeCell = mergeRange.split(':').shift();
          const endMergeCell = mergeRange.split(':').pop();

          const _row1 = Number(startMergeCell.match(regexCell)[2]); //regex: string - character - number
          const _col1 = exceljs.excelCols.findIndex(x => x == startMergeCell.match(regexCell)[1]); //regex: string - character - number///
          const _row2 = Number(endMergeCell.match(regexCell)[2]); //regex: string - character - number
          const _col2 = exceljs.excelCols.findIndex(x => x == endMergeCell.match(regexCell)[1]); //regex: string - character - number///
          if (_row1 === _sourceRow) {
            lstMergeTemp.push({row1: _row1, col1: _col1, row2: _row2, col2: _col2, range: x});
            worksheet.unMergeCells(startMergeCell);
          }

          if (_row1 > _sourceRow) {
            lstNewMerge.push({row1: _row1 + totalRows - 1, col1: _col1, row2: _row2 + totalRows - 1, col2: _col2, range: x});
            worksheet.unMergeCells(startMergeCell);
          }
          //console.log("_row1  ", _row1 ,  )
          //console.log("lstNewMerge ", lstNewMerge)
        });
        for (let i = 1; i < totalRows; i++) {
          //console.log(" _sourceRow + i, _sourceRow  ++++===> ", _sourceRow + i, totalRows)
          exceljs.copyRow(_sourceRow + i, _sourceRow, 'c');
          worksheet.getCell(`C${_sourceRow + i}`).style.border = {};
        }
      } else {
        lstMerge.forEach(x => {
          const mergeRange = x;
          const startMergeCell = mergeRange.split(':').shift();
          const endMergeCell = mergeRange.split(':').pop();

          const _row1 = Number(startMergeCell.match(regexCell)[2]); //regex: string - character - number
          const _col1 = exceljs.excelCols.findIndex(x => x == startMergeCell.match(regexCell)[1]); //regex: string - character - number///
          const _row2 = Number(endMergeCell.match(regexCell)[2]); //regex: string - character - number
          const _col2 = exceljs.excelCols.findIndex(x => x == endMergeCell.match(regexCell)[1]); //regex: string - character - number///
          if (_row1 === _sourceRow) {
            lstMergeTemp.push({row1: _row1, col1: _col1, row2: _row2, col2: _col2, range: x});
            worksheet.unMergeCells(startMergeCell);
          }

          if (_row1 > _sourceRow) {
            lstNewMerge.push({row1: _row1 + totalRows - 1, col1: _col1, row2: _row2 + totalRows - 1, col2: _col2, range: x});
            worksheet.unMergeCells(startMergeCell);
          }
        });

        for (let i = 1; i < totalRows; i++) {
          //console.log(' _sourceRow + i, _sourceRow  ++++===> ', _sourceRow + i, _sourceRow);
          exceljs.copyRow(_sourceRow + i, _sourceRow, 'c');
          worksheet.getCell(`C${_sourceRow + i}`).style.border = {};
        }
      }

      lstNewMerge.sort((a, b) => parseFloat(a.row1) - parseFloat(b.row1));
      lstNewMerge.forEach(x => {
        //console.log('lstNewMerge  ', x);
        try {
          //console.log(x);
          worksheet.mergeCells(x.row1, x.col1, x.row2, x.col2);
        } catch (ee) {
          console.log('err', ee);
        }
      });
      ///===============================================??>>>>> OK
      //END-this part coppy merge information of the page before add more row.

      //this part insert range header for each page
      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
      //=======================================================================================================
      console.log('page  ', JSON.stringify(page));
      if (v_countNumberOfPages > 1) {
        for (let j = 0; j < page.length; j++) {
          const e = parseInt(page[j]);
          let countCheck = 0;
          console.log('cell_of_page  ', cell_of_page);
          if (page[j] > 0 && cell_of_page) {
            let number_of_page_index = Number(number_of_page) + j * (num_of_more_pages_max + headerRowCount);
            worksheet.getCell(`${cell_of_page + number_of_page_index}`).value = data_of_page[j].PAGE;
          }

          if (e > 0) {
            for (let i = 0; i < e; i++) {
              const _e = einvoiceDetailData[i + count];
              try {
                let item_name_lt = this.countlength(_e['ITEM_NAME']);
                totalRowCount += item_name_lt;
                countCheck += item_name_lt;
              } catch (error) {
                console.log('err', error);
                console.log(_sourceRow);
                console.log(totalRowCount);
              }
            }
            let _count_ = 0;
            if (j == 0) {
              _sourceRow = _sourceRow - 1;
              if (num_of_more_pages - totalRowCount > 0) {
                let tmpObj = {loop_row: num_of_more_pages_max - totalRowCount, loopStartRow: totalRowCount + _sourceRow + 1};
                extendedArray.push(tmpObj);
              }
              /*console.log(
                'totalRowCount  ',
                totalRowCount,
                '_sourceRow  ',
                _sourceRow,
                'totalRowCount  ',
                totalRowCount,
                'num_of_more_pages_max',
                num_of_more_pages_max,
                'num_of_more_pages',
                num_of_more_pages,
              );*/
              _count_ = totalRowCount + _sourceRow + (num_of_more_pages - totalRowCount) + (num_of_more_pages_max - num_of_more_pages) + 1; //
              totalRowCount += num_of_more_pages - totalRowCount;

              let _startCell = '';
              let _midCell = '';
              let _endCell = '';
              const rowIndex = totalRowCount + _sourceRow + (num_of_more_pages - totalRowCount) + (num_of_more_pages_max - num_of_more_pages) + 1;
              const rowExtendedStart = totalRowCount + _sourceRow + (num_of_more_pages - totalRowCount) + 1;
              const rowExtendedEnd = totalRowCount + _sourceRow + (num_of_more_pages - totalRowCount) + (num_of_more_pages_max - num_of_more_pages);
              /*try {
                console.log(
                  'rowExtendedStart ',
                  rowExtendedStart,
                  'startMergeRedundantRow ',
                  startMergeRedundantRow,
                  'rowExtendedEnd ',
                  rowExtendedEnd,
                  'endMergeRedundantRow ',
                  endMergeRedundantRow,
                );
                worksheet.mergeCells(rowExtendedStart, startMergeRedundantRow, rowExtendedEnd, endMergeRedundantRow);
              } catch (error) {
                console.log('mergeCells 0 err ', error);
              }*/
              try {
                // console.log('rowIndex ', rowIndex, 'startMergeRedundantRow ', startMergeRedundantRow, 'endMergeRedundantRow ', endMergeRedundantRow);
                worksheet.mergeCells(rowIndex, startMergeRedundantRow, rowIndex, endMergeRedundantRow);
              } catch (error) {
                console.log('mergeCells 0 dòng cuối cùng err ', error);
              }

              if (detailCellFormat[0].startCell == 1) {
                _startCell = excCols[detailCellFormat[0].startCell];
                worksheet.getCell(`${_startCell + rowIndex}`).style.border = {
                  left: {style: 'medium', color: {argb: 'FF0070C0'}},
                  right: {style: 'medium', color: {argb: 'FF0070C0'}},
                  top: {style: 'none', color: {argb: 'FF0070C0'}},
                  bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                };
              } else {
                _startCell = excCols[detailCellFormat[0].startCell - 1];
                _midCell = excCols[detailCellFormat[0].startCell];
                _endCell = excCols[detailCellFormat[detailCellFormat.length - 1].endCell + 1];

                // lấy đoạn stype none cho đoạn merge
                for (let i = rowExtendedStart; i <= rowExtendedEnd; i++) {
                  worksheet.getCell(`${_startCell + i}`).style.border = {
                    left: {style: 'medium', color: {argb: 'FF0070C0'}},
                    right: {style: 'none', color: {argb: 'FF0070C0'}},
                    top: {style: 'none', color: {argb: 'FF0070C0'}},
                    bottom: {style: 'none', color: {argb: 'FF0070C0'}},
                  };
                  worksheet.getCell(`${_midCell + i}`).style.border = {
                    left: {style: 'none', color: {argb: 'FF0070C0'}},
                    right: {style: 'none', color: {argb: 'FF0070C0'}},
                    top: {style: 'none', color: {argb: 'FF0070C0'}},
                    bottom: {style: 'none', color: {argb: 'FF0070C0'}},
                  };
                  worksheet.getCell(`${_endCell + i}`).style.border = {
                    left: {style: 'none', color: {argb: 'FF0070C0'}},
                    right: {style: 'medium', color: {argb: 'FF0070C0'}},
                    top: {style: 'none', color: {argb: 'FF0070C0'}},
                    bottom: {style: 'none', color: {argb: 'FF0070C0'}},
                  };
                }

                console.log('_startCell  ', _startCell, '_midCell  ', _midCell, '_endCell  ', _endCell);
                worksheet.getCell(`${_startCell + rowIndex}`).style.border = {
                  left: {style: 'medium', color: {argb: 'FF0070C0'}},
                  right: {style: 'none', color: {argb: 'FF0070C0'}},
                  top: {style: 'none', color: {argb: 'FF0070C0'}},
                  bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                };
                worksheet.getCell(`${_midCell + rowIndex}`).style.border = {
                  left: {style: 'none', color: {argb: 'FF0070C0'}},
                  right: {style: 'none', color: {argb: 'FF0070C0'}},
                  top: {style: 'none', color: {argb: 'FF0070C0'}},
                  bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                };
                worksheet.getCell(`${_endCell + rowIndex}`).style.border = {
                  left: {style: 'none', color: {argb: 'FF0070C0'}},
                  right: {style: 'medium', color: {argb: 'FF0070C0'}},
                  top: {style: 'none', color: {argb: 'FF0070C0'}},
                  bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                };
              }

              worksheet
                .getRow(totalRowCount + _sourceRow + (num_of_more_pages - totalRowCount) + (num_of_more_pages_max - num_of_more_pages) + 1)
                .addPageBreak();

              logoArray.push({
                logoPos: totalRowCount + _sourceRow + (num_of_more_pages - totalRowCount) + (num_of_more_pages_max - num_of_more_pages) + 1,
                logos: logos,
              });
            } else {
              let leftCount = 0;
              if (page[j + 1] != 0) {
                leftCount = num_of_more_pages_max - countCheck;

                let _startCell = '';
                let _midCell = '';
                let _endCell = totalRowCount + _sourceRow + (num_of_more_pages - totalRowCount) + 1;
                const rowIndex = (j + 1) * (num_of_more_pages_max + headerRowCount);

                console.log('startMergeRedundantRow ', startMergeRedundantRow, 'endMergeRedundantRow ', endMergeRedundantRow, 'rowIndex ', rowIndex);
                try {
                  worksheet.mergeCells(rowIndex, startMergeRedundantRow, rowIndex, endMergeRedundantRow);
                } catch (error) {
                  //console.log('err', error.Error);
                }

                if (detailCellFormat[0].startCell == 1) {
                  _startCell = excCols[detailCellFormat[0].startCell];
                  worksheet.getCell(`${_startCell + rowIndex}`).style.border = {
                    left: {style: 'medium', color: {argb: 'FF0070C0'}},
                    right: {style: 'medium', color: {argb: 'FF0070C0'}},
                    top: {style: 'none', color: {argb: 'FF0070C0'}},
                    bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                  };
                } else {
                  _startCell = excCols[detailCellFormat[0].startCell - 1];
                  _midCell = excCols[detailCellFormat[0].startCell];
                  _endCell = excCols[detailCellFormat[detailCellFormat.length - 1].endCell + 1];

                  console.log('_startCell  ', _startCell, '_midCell  ', _midCell, '_endCell  ', _endCell);
                  worksheet.getCell(`${_startCell + rowIndex}`).style.border = {
                    left: {style: 'medium', color: {argb: 'FF0070C0'}},
                    right: {style: 'none', color: {argb: 'FF0070C0'}},
                    top: {style: 'none', color: {argb: 'FF0070C0'}},
                    bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                  };
                  worksheet.getCell(`${_midCell + rowIndex}`).style.border = {
                    left: {style: 'none', color: {argb: 'FF0070C0'}},
                    right: {style: 'none', color: {argb: 'FF0070C0'}},
                    top: {style: 'none', color: {argb: 'FF0070C0'}},
                    bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                  };
                  worksheet.getCell(`${_endCell + rowIndex}`).style.border = {
                    left: {style: 'none', color: {argb: 'FF0070C0'}},
                    right: {style: 'medium', color: {argb: 'FF0070C0'}},
                    top: {style: 'none', color: {argb: 'FF0070C0'}},
                    bottom: {style: 'medium', color: {argb: 'FF0070C0'}},
                  };
                }

                worksheet.getRow((j + 1) * (num_of_more_pages_max + headerRowCount)).addPageBreak();

                if (leftCount > 0) {
                  let tmpObj = {
                    loop_row: leftCount,
                    loopStartRow: j * (num_of_more_pages_max + headerRowCount) + headerRowCount + countCheck,
                  };
                  extendedArray.push(tmpObj);
                }

                logoArray.push({logoPos: rowIndex, logos: logos});
              } else {
                let numHiddenRow = v_countNumberOfPages * (num_of_more_pages_max + headerRowCount);
                //let numHiddenRow = v_countNumberOfPages * (20 + headerRowCount); // phần này lấy ra số dòng ẩn nhưng 20 dòng mới hơp lý
                //console.log('numHiddenRow ', numHiddenRow, 'num_of_more_pages_max - num_of_more_pages ', num_of_more_pages_max % num_of_more_pages);
                for (let index = 1; index <= num_of_pages + (num_of_more_pages_max % num_of_more_pages); index++) {
                  //worksheet.getRow(totalRowCount + _sourceRow + leftCount + index + 1).hidden = true;
                  worksheet.getRow(numHiddenRow - index).hidden = true;
                }
              }
              if (leftCount > 0) {
                totalRowCount += leftCount;
              }
            }

            let _startRow = 1;
            let _startcol = 1;
            let _endRow = _count_;
            let _endcol = detailCellFormat[detailCellFormat.length - 1].endCell + 3;
            const _rowCount = _endRow - _startRow + 1;

            const _sheetModel = worksheet.model;
            let _lstMerge = [..._sheetModel.merges];
            let _lstNewMerge = [];

            _lstMerge = _lstMerge.map(q => {
              let obj = {};
              const startMergeCell = q.split(':').shift();
              const endMergeCell = q.split(':').pop();

              const _row1 = Number(startMergeCell.match(regexCell)[2]); //regex: string - character - number
              const _col1 = exceljs.excelCols.findIndex(x => x == startMergeCell.match(regexCell)[1]); //regex: string - character - number///
              const _row2 = Number(endMergeCell.match(regexCell)[2]); //regex: string - character - number
              const _col2 = exceljs.excelCols.findIndex(x => x == endMergeCell.match(regexCell)[1]); //regex: string - characte
              obj = {
                range: q,
                row1: _row1,
                col1: _col1,
                row2: _row2,
                col2: _col2,
              };
              return obj;
            });
            _lstMerge = _lstMerge.filter(q => {
              let b = false;
              if (q.row1 >= _startRow && q.col1 >= _startcol && q.row2 <= _endRow && q.col2 <= _endcol) {
                b = true;
              }
              return b;
            });

            //console.log('data.length  ', data, data.length);
            for (let idx = 0; idx < data_of_page.length - 1; idx++) {
              _lstMerge.forEach(q => {
                const startMergeCell = q['range'].split(':').shift();
                const endMergeCell = q['range'].split(':').pop();
                //let rangeExtend = num_of_more_pages_max - num_of_more_pages;
                let c1 = startMergeCell.match(regexCell)[1] + (q.row1 + _rowCount * (1 + idx));
                let c2 = endMergeCell.match(regexCell)[1] + (q.row2 + _rowCount * (1 + idx));
                _lstNewMerge.push({
                  row1: q.row1 + _rowCount * (1 + idx),
                  col1: q.col1,
                  row2: q.row2 + _rowCount * (1 + idx),
                  col2: q.col2,
                  range: `${c1}:${c2}`,
                });
              });
            }

            _lstNewMerge.sort((a, b) => parseFloat(a.row1) - parseFloat(b.row1));
            exceljs.insertRange3(`A1:V${_count_}`, data_of_page, true, false);
            _lstNewMerge.forEach(x => {
              try {
                const startMergeCell = x['range'].split(':').shift();
                worksheet.unMergeCells(startMergeCell);
              } catch (ee) {
                //console.log(ee.message);
              }
              try {
                worksheet.mergeCells(x.row1, x.col1, x.row2, x.col2);
              } catch (ee) {
                console.log(ee.message);
                console.log(x.row1 + '+' + x.col1);
                console.log(x.row2 + '+' + x.col2);
              }
            });
            //	console.log(_lstNewMerge)
            _sourceRow += headerRowCount - 1;
            count += e;
          } else break;
        }

        for (let j = 0; j < page.length; j++) {
          const e = parseInt(page[j]);
          let countCheck_2 = 0;
          if (j != 0) {
            //totalRowCount_2++; // cộng thêm 1 dòng do có 1 dòng cuối trang trước
            totalRowCount_2 += num_of_more_pages_max - num_of_more_pages + 1;
          }
          if (e > 0) {
            for (let i = 0; i < e; i++) {
              //console.log('i  ', i);
              const _e = einvoiceDetailData[i + count_2];
              try {
                const _item_name = _e['ITEM_NAME'];
                this.addValueToCellsWithItemName(worksheet, _sourceRow_2 + totalRowCount_2, _e, _item_name, detailCellFormat, excCols);
                let item_name_lt = this.countlength(_item_name);
                //console.log('item_name_lt  ', item_name_lt);
                if (item_name_lt == 1) {
                  detailCellFormat.forEach((e, i) => {
                    try {
                      worksheet.mergeCells(_sourceRow_2 + totalRowCount_2, e.startCell, _sourceRow_2 + totalRowCount_2, e.endCell);
                    } catch (error) {}
                    worksheet.getCell(`${excCols[e.startCell] + (_sourceRow_2 + totalRowCount_2)}`).style.border = {
                      bottom: {style: detailCellFormat[i].cellBorder},
                      left: {style: 'thin'},
                    };
                  });
                  worksheet.getCell(`${lastCell + (_sourceRow_2 + totalRowCount_2)}`).style.border = {
                    right: {style: 'thin'},
                    bottom: {style: detailCellFormat[0].cellBorder},
                    left: {style: 'thin'},
                  };
                } else {
                  // console.log(
                  //   '_sourceRow_2 + totalRowCount_2  ',
                  //   _sourceRow_2 + totalRowCount_2,
                  //   '_sourceRow_2 + totalRowCount_2 + item_name_lt - 1 ',
                  //   _sourceRow_2 + totalRowCount_2 + item_name_lt - 1,
                  // );
                  detailCellFormat.forEach(e => {
                    //console.log('e  ', e);
                    worksheet.mergeCells(_sourceRow_2 + totalRowCount_2, e.startCell, _sourceRow_2 + totalRowCount_2 + item_name_lt - 1, e.endCell);
                    worksheet.getCell(`${excCols[e.startCell] + (_sourceRow_2 + totalRowCount_2)}`).style.border = {
                      bottom: {style: e.cellBorder},
                      left: {style: 'thin'},
                    };
                  });
                }

                totalRowCount_2 += item_name_lt;
                countCheck_2 += item_name_lt;
              } catch (error) {
                console.log('err', error);
                //console.log(_sourceRow_2)
                //console.log(totalRowCount)
              }
            }
            if (j == 0) {
              totalRowCount_2 += num_of_more_pages - totalRowCount_2;
              if (cancelYn == 'Y') {
                try {
                  worksheet.addImage(await exceljs.insertPathImage(cancelPath), {
                    tl: {col: 9, row: _sourceRow_2},
                    ext: {width: 200, height: 100},
                  });
                } catch (error) {
                  console.log(error);
                }
              }
              if (bgPath != '') {
                console.log('backgroundCell  ' + backgroundCell + '  j  ' + j);
                try {
                  worksheet.addImage(await exceljs.insertPathImage2(bgPath), {
                    tl: {col: backgroundCell, row: backgroundRow - 1},
                    ext: {width: backgroundWidth, height: backgroundHeight},
                  });
                } catch (error) {
                  console.log(error);
                }
              }
            } else {
              let leftCount = num_of_more_pages - countCheck_2;
              if (leftCount > 0) {
                totalRowCount_2 += leftCount;
              }
              if (cancelYn == 'Y') {
                if (j == v_countNumberOfPages - 1) {
                  try {
                    worksheet.addImage(await exceljs.insertPathImage(cancelPath), {
                      tl: {col: 9, row: _sourceRow_2 + totalRowCount_2 - num_of_more_pages},
                      ext: {width: 200, height: 100},
                    });
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  try {
                    worksheet.addImage(await exceljs.insertPathImage(cancelPath), {
                      tl: {col: 9, row: _sourceRow_2 + totalRowCount_2 - num_of_more_pages},
                      ext: {width: 200, height: 100},
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }
              }

              if (bgPath != '') {
                if (j == v_countNumberOfPages - 1) {
                  //console.log('backgroundCell  ' + backgroundRow + '  j  ' + j + ' totalRowCount_2 ' + totalRowCount_2 + ' num_of_more_pages  ' + num_of_more_pages);
                  try {
                    worksheet.addImage(await exceljs.insertPathImage2(bgPath), {
                      // tl: { col: backgroundCell, row: backgroundRow + totalRowCount_2 - num_of_more_pages - 1 },
                      tl: {col: backgroundCell, row: backgroundRow + num_of_more_pages * j + headerRowCount * j - 1},
                      ext: {width: backgroundWidth, height: backgroundHeight},
                    });
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  try {
                    worksheet.addImage(await exceljs.insertPathImage2(bgPath), {
                      // tl: { col: backgroundCell, row: _sourceRow_2 + totalRowCount_2 - num_of_more_pages - 1 },
                      tl: {col: backgroundCell, row: backgroundRow + num_of_more_pages * j + headerRowCount * j - 1},
                      ext: {width: backgroundWidth, height: backgroundHeight},
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            }
            _sourceRow_2 += headerRowCount - 1;
            count_2 += e;
          } else break;
        }
      } else {
        for (let j = 0; j < page.length; j++) {
          const e = parseInt(page[j]);
          if (e > 0) {
            for (let i = 0; i < e; i++) {
              const _e = einvoiceDetailData[i + count];
              console.log('_e  ', _e);
              try {
                let item_name_lt = this.countlength(_e['ITEM_NAME']);
                const _item_name = _e['ITEM_NAME']; //longRow[itl];
                this.addValueToCellsWithItemName(worksheet, _sourceRow + totalRowCount, _e, _item_name, detailCellFormat, excCols);
                if (item_name_lt == 1) {
                  detailCellFormat.forEach((e, i) => {
                    try {
                      worksheet.mergeCells(_sourceRow + totalRowCount, e.startCell, _sourceRow + totalRowCount, e.endCell);
                    } catch (error) {}
                    worksheet.getCell(`${excCols[e.startCell] + (_sourceRow + totalRowCount)}`).style.border = {
                      bottom: {style: detailCellFormat[i].cellBorder},
                      left: {style: 'thin'},
                    };
                  });
                  worksheet.getCell(`${lastCell + (_sourceRow + totalRowCount)}`).style.border = {
                    right: {style: 'thin'},
                    bottom: {style: detailCellFormat[0].cellBorder},
                    left: {style: 'thin'},
                  };
                  //worksheet.getCell(`${nmCell + (_sourceRow + totalRowCount + item_name_lt)}`).style.border = { bottom: { style: detailCellFormat[0].cellBorder }, };
                  //worksheet.getCell(`${sttCell + (_sourceRow + totalRowCount + item_name_lt)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder } };
                } else {
                  //console.log('detailCellFormat  ', detailCellFormat);
                  detailCellFormat.forEach((e, i) => {
                    if (e.cellType == 2 || e.cellType == 1) {
                      nmCell = excCols[e.startCell];
                      worksheet.mergeCells(_sourceRow + totalRowCount, e.startCell, _sourceRow + totalRowCount + item_name_lt - 1, e.endCell);
                      worksheet.getCell(`${excCols[e.startCell] + (_sourceRow + totalRowCount)}`).style.border = {
                        bottom: {style: detailCellFormat[i].cellBorder},
                        left: {style: 'thin'},
                        right: {style: 'thin'},
                      };
                    } else {
                      worksheet.mergeCells(_sourceRow + totalRowCount, e.startCell, _sourceRow + totalRowCount, e.endCell);
                      worksheet.getCell(`${excCols[e.startCell] + (_sourceRow + totalRowCount)}`).style.border = {
                        bottom: {style: detailCellFormat[i].cellBorder},
                        left: {style: 'thin'},
                      };
                    }
                    //console.log('lastCell  ', lastCell);
                    worksheet.getCell(`${lastCell + (_sourceRow + totalRowCount)}`).style.border = {
                      right: {style: 'thin'},
                      bottom: {style: detailCellFormat[0].cellBorder},
                      left: {style: 'thin'},
                    };
                  });
                  /*for (let u = 0; u < item_name_lt; u++) {
                    //worksheet.getCell(`${nmCell+(_sourceRow+totalRowCount+u}`).style.border = {left: {style:'thin'}};
                    //console.log(`${nmCell+(_sourceRow+totalRowCount+u)}`)
                  }
                  console.log('nmCell  ', nmCell, '(_sourceRow + totalRowCount + item_name_lt - 1) ', _sourceRow + totalRowCount + item_name_lt - 1);*/
                  worksheet.getCell(`${nmCell + (_sourceRow + totalRowCount + item_name_lt - 1)}`).style.border = {
                    bottom: {style: detailCellFormat[0].cellBorder},
                  };
                  worksheet.getCell(`${sttCell + (_sourceRow + totalRowCount + item_name_lt - 1)}`).style.border = {
                    left: {style: 'thin'},
                    right: {style: 'thin'},
                    bottom: {style: detailCellFormat[0].cellBorder},
                    top: {style: 'thin'},
                  };
                }
                totalRowCount += item_name_lt;
                if (i == 0) {
                  console.log('cancelYn   ', cancelYn);
                  if (cancelYn == 'Y') {
                    try {
                      worksheet.addImage(await exceljs.insertPathImage(cancelPath), {
                        tl: {col: 9, row: _sourceRow_2},
                        ext: {width: 200, height: 100},
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  if (bgPath != '') {
                    try {
                      worksheet.addImage(await exceljs.insertPathImage2(bgPath), {
                        tl: {col: backgroundCell, row: backgroundRow - 1},
                        ext: {width: backgroundWidth, height: backgroundHeight},
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }
              } catch (error) {
                console.log('err', error);
                console.log(_sourceRow);
                console.log(totalRowCount);
              }
            }
            count += e;
          } else break;
        }
      }
      //END-this part insert range header for each page

      //this part add more style to the rows that missing(optional) Last Page.
      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
      //	worksheet.getCell(`${excCols[e.startCell]+( _sourceRow_2 + totalRowCount_2)}`).style.border = {bottom: {style:detailCellFormat[i].cellBorder},left: { style: 'thin' }, };
      if (v_countNumberOfPages > 1) {
        console.log('extendedRows  ', extendedRows);
        for (let o = 1; o <= extendedRows; o++) {
          try {
            detailCellFormat.forEach((e, i) => {
              try {
                worksheet.mergeCells(totalRows + _sourceRow_3 - o, e.startCell, totalRows + _sourceRow_3 - o, e.endCell);
              } catch (error) {}
              worksheet.getCell(`${excCols[e.startCell] + (totalRows + _sourceRow_3 - o)}`).style.border = {
                left: {style: 'thin'},
                bottom: {style: detailCellFormat[i].cellBorder},
              };
            });
            worksheet.getRow(totalRows + _sourceRow_3 - o).height = lastPageRowsHeight;
            worksheet.getCell(`${lastCell + (totalRows + _sourceRow_3 - o)}`).style.border = {
              right: {style: 'thin'},
              bottom: {style: detailCellFormat[0].cellBorder},
            };
            worksheet.getCell(`${sttCell + (totalRows + _sourceRow_3 - o)}`).style.border = {
              left: {style: 'thin'},
              right: {style: 'thin'},
              bottom: {style: detailCellFormat[0].cellBorder},
            };
          } catch (error) {
            console.log('error', error);
            console.log('error', totalRows + _sourceRow_3 - o);
          }
        }
      } else {
        for (let o = 1; o <= extendedRows; o++) {
          try {
            detailCellFormat.forEach((e, i) => {
              try {
                worksheet.mergeCells(totalRows + _sourceRow_3 - o, e.startCell, totalRows + _sourceRow_3 - o, e.endCell);
              } catch (error) {}
              worksheet.getCell(`${excCols[e.startCell] + (totalRows + _sourceRow_3 - o)}`).style.border = {
                left: {style: 'thin'},
                bottom: {style: detailCellFormat[i].cellBorder},
              };
            });
            worksheet.getCell(`${lastCell + (totalRows + _sourceRow_3 - o)}`).style.border = {
              right: {style: 'thin'},
              bottom: {style: detailCellFormat[0].cellBorder},
            };
            worksheet.getRow(totalRows + _sourceRow_3 - o).height = lastPageRowsHeight;
            worksheet.getCell(`${sttCell + (totalRows + _sourceRow_3 - o)}`).style.border = {
              left: {style: 'thin'},
              right: {style: 'thin'},
              bottom: {style: detailCellFormat[0].cellBorder},
            };
          } catch (error) {
            console.log('error', totalRows + _sourceRow_3 - o);
          }
        }
      }

      //END-this part add more style to the rows that missing(optional) Last Page.

      //this part add more style to the rows that missing(optional) Other pages.

      console.log('extendedArray check chỗ này ++==>', extendedArray);
      for (let o = 0; o < extendedArray.length; o++) {
        let rowItem = extendedArray[o];
        try {
          worksheet.mergeCells(rowItem.loopStartRow, startMergeRedundantRow, rowItem.loopStartRow + rowItem.loop_row - 1, endMergeRedundantRow);
        } catch (error) {
          console.log(error);
        }

        let _startCell = '';
        let _midCell = '';
        let _endCell = '';
        for (let i = 0; i < rowItem.loop_row; i++) {
          if (detailCellFormat[0].startCell == 1) {
            _startCell = excCols[detailCellFormat[0].startCell];

            worksheet.getCell(`${_startCell + (rowItem.loopStartRow + i)}`).style.border = {
              left: {style: 'none', color: {argb: 'FF0070C0'}},
              right: {style: 'none', color: {argb: 'FF0070C0'}},
              top: {style: 'none', color: {argb: 'FF0070C0'}},
              bottom: {style: 'none', color: {argb: 'FF0070C0'}},
            };
          } else {
            _startCell = excCols[detailCellFormat[0].startCell - 1];
            _midCell = excCols[detailCellFormat[0].startCell];
            _endCell = excCols[detailCellFormat[detailCellFormat.length - 1].endCell + 1];

            worksheet.getCell(`${_startCell + (rowItem.loopStartRow + i)}`).style.border = {
              left: {style: 'medium', color: {argb: 'FF0070C0'}},
              right: {style: 'none', color: {argb: 'FF0070C0'}},
              top: {style: 'none', color: {argb: 'FF0070C0'}},
              bottom: {style: 'none', color: {argb: 'FF0070C0'}},
            };
            worksheet.getCell(`${_midCell + (rowItem.loopStartRow + i)}`).style.border = {
              left: {style: 'none', color: {argb: 'FF0070C0'}},
              right: {style: 'none', color: {argb: 'FF0070C0'}},
              top: {style: 'none', color: {argb: 'FF0070C0'}},
              bottom: {style: 'none', color: {argb: 'FF0070C0'}},
            };
            worksheet.getCell(`${_endCell + (rowItem.loopStartRow + i)}`).style.border = {
              left: {style: 'none', color: {argb: 'FF0070C0'}},
              right: {style: 'medium', color: {argb: 'FF0070C0'}},
              top: {style: 'none', color: {argb: 'FF0070C0'}},
              bottom: {style: 'none', color: {argb: 'FF0070C0'}},
            };
          }
        }
      }
      //=======================================================================================================
      //END-this part add more style to the rows that missing(optional) Other pages.

      //this part insert logo for all the self gen header
      let promises = logos.map(async (e, i) => {
        // console.log(" e +++===> ", e);
        let imgRow = e.logoStartCount;
        //  let logoImage =  await createFile(e.logoPath);
        let logoIconByteArray = await exceljs.insertPathImage2(e.logoPath);
        try {
          worksheet.addImage(logoIconByteArray, {
            tl: {col: e.start, row: imgRow},
            ext: {width: e.width, height: e.height},
          });
        } catch (error) {
          console.log(error);
        }
      });
      await Promise.all(promises);
      //console.log(" logoArray +++===> ", logoArray);
      for (let imgIdx = 0; imgIdx < logoArray.length; imgIdx++) {
        const logosAray = logoArray[imgIdx].logos;
        let imgPos = logoArray[imgIdx].logoPos;
        try {
          let promises = logosAray.map(async (e, i) => {
            let imgRow = imgPos + e.logoStartCount;
            //  let logoImage =  await createFile(e.logoPath);
            let logoIconByteArray = await exceljs.insertPathImage2(e.logoPath);
            try {
              worksheet.addImage(logoIconByteArray, {
                tl: {col: e.start, row: imgRow},
                ext: {width: e.width, height: e.height},
              });
            } catch (error) {
              console.log(error);
            }
          });
          await Promise.all(promises);
        } catch (error) {
          console.log(error);
        }
      }

      //END-this part insert logo for all the self gen header

      //this part insert Signed image if the einvoice is signed.
      //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
      //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

      if (einvoiceMasterData[0]['SIGN_YN'] == 'Y') {
        try {
          console.log('SIGN_YN  ++===>  ', signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox));
          worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox));
          worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1));
          worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2));
          try {
            worksheet.addImage(await exceljs.insertPathImage(signPath), {
              tl: {col: signCell.start + 2, row: totalRows + _sourceRow_3 + countFromEndDetailToSignBox - 1},
              ext: {width: 80, height: 50},
            });
          } catch (error) {
            console.log(error);
          }
          worksheet.mergeCells(
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox,
            signByCell.start,
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox,
            signByCell.end,
          ); //re-merge the cell to fill signed by, signed date
          worksheet.mergeCells(
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1,
            signByCell.start,
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1,
            signByCell.end,
          ); //re-merge the cell to fill signed by, signed date
          worksheet.mergeCells(
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2,
            signByCell.start,
            totalRows + _sourceRow_3 + +countFromEndDetailToSignBox + 2,
            signByCell.end,
          ); //re-merge the cell to fill signed by, signed date
        } catch (error) {
          console.log(error);
        }
      }

      if (einvoiceMasterData[0]['ETAX_SIGN_YN'] == 'Y') {
        try {
          console.log('ETAX_SIGN_YN  ++===>  ', taxSignCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox));
          worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox));
          worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1));
          worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2));
          try {
            worksheet.addImage(await exceljs.insertPathImage(signPath), {
              tl: {col: taxSignCell.start + 2, row: totalRows + _sourceRow_3 + countFromEndDetailToSignBox - 1},
              ext: {width: 80, height: 50},
            });
          } catch (error) {
            console.log(error);
          }
          worksheet.mergeCells(
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox,
            signByCell.start,
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox,
            signByCell.end,
          ); //re-merge the cell to fill signed by, signed date
          worksheet.mergeCells(
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1,
            signByCell.start,
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1,
            signByCell.end,
          ); //re-merge the cell to fill signed by, signed date
          worksheet.mergeCells(
            totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2,
            signByCell.start,
            totalRows + _sourceRow_3 + +countFromEndDetailToSignBox + 2,
            signByCell.end,
          ); //re-merge the cell to fill signed by, signed date
        } catch (error) {
          console.log(error);
        }
      }
      //END-this part insert Signed image if the einvoice is signed.

      //this part add more style to missing part of the footer(optional).
      try {
        if (v_countNumberOfPages > 1) {
          worksheet.getCell(`${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox)}`).style.border = {
            top: {style: 'thin'},
            right: {style: 'thin'},
          };
          worksheet.getCell(`${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1)}`).style.border = {right: {style: 'thin'}};
          worksheet.getCell(`${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2)}`).style.border = {
            bottom: {style: 'thin'},
            right: {style: 'thin'},
          };
        } else {
          //console.log("XXXX  ++===>  ", signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox));
          worksheet.getCell(`${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox)}`).style.border = {
            top: {style: 'thin'},
            right: {style: 'thin'},
          };
          worksheet.getCell(`${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1)}`).style.border = {right: {style: 'thin'}};
          worksheet.getCell(`${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2)}`).style.border = {
            bottom: {style: 'thin'},
            right: {style: 'thin'},
          };
        }
      } catch (error) {
        console.log(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox));
      }

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
      //Utils.Logger({ LVL: "error", MODULE: "ReportHelper", FUNC: "TestReport", CONTENT: error.message, });
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

  countlength = s => {
    let rangeWord = 40;
    let result = 0;
    //console.log('countlength ', s);
    if (this.hasLineBreak(s)) {
      result = this.countLineBreaks(s) + 1;
    } else {
      result = Math.ceil(s.length / rangeWord);
    }
    //console.log('countlength result ', result);
    return result;
  };
  // isVietnameseUpperCase(str) {
  //   const vietnameseRegex = /^[\p{Lu}\s]+$/u; // Chỉ kiểm tra chữ hoa và khoảng trắng
  //   return vietnameseRegex.test(str.normalize('NFC'));
  // }

  isVietnameseUpperCase(str) {
    // Chuẩn hóa chuỗi và chuyển toàn bộ sang chữ hoa
    const normalizedStr = str.normalize('NFC');
    return normalizedStr === normalizedStr.toUpperCase();
  }

  hasLineBreak = str => {
    return str.includes('\n') || str.includes('\r');
  };

  countLineBreaks = str => {
    const matches = str.match(/\r?\n/g); // Tìm tất cả các ký tự xuống dòng (\n hoặc \r\n)
    return matches ? matches.length : 0;
  };

  getLetters = str => {
    return str.match(/[a-zA-Z]/g) || []; // Tìm các chữ, nếu không có trả về mảng rỗng
  };

  extractLetters = str => {
    return str.replace(/[^a-zA-Z]/g, ''); // Loại bỏ mọi thứ không phải chữ
  };

  extractAllDigits = str => {
    return str.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
  };
}
module.exports = EiExcelConverterAuto;
