'use strict';

const Helpers = use('Helpers');
const fs = use('fs');
const Utils = use('Utils');
const Env = use('Env');

var Excel = use('exceljs');

const DBService = use('DBService');

//const user = await auth.getUser();

class ImportHelper {
  regexCell = /([a-zA-Z]+)(\d+)/;
  regexColumns = /\$[\[](.*?)[\]]/g; // list  $[column]
  regexColumnName = /\$[\[](.*?)[\]]/; //  $[column]
  workbook = new Excel.Workbook();
  activeSheet = null;
  templateFile = '';
  reportPath = '';
  returnFile = null;

  constructor(lang, crt_by) {
    this.reportPath = 'import_temp_' + crt_by + '.xlsx';
    this.returnFile = Helpers.tmpPath(this.reportPath);
  }

  async loadFile(path) {
    //console.log(this.worksheet);
    await this.workbook.xlsx.readFile(path);
  }

  async writeFile() {
    await this.workbook.xlsx.writeFile(this.returnFile);
    return this.returnFile;
  }

  setActiveSheet(idx) {
    let workbookmodel = this.workbook.model;
    let sheet0 = workbookmodel.sheets[idx];
    console.log(sheet0);
    this.activeSheet = this.workbook.getWorksheet(sheet0.id);

    this.rowIdx = 0; //su dung do insert total
    this.mergeColIndex = [];
    this.sequenceType = null;
    this.rowSequence = 0; // cho so thu tu
  }

  async importData(import_info, lang, crt_by) {
    try {
      this.setActiveSheet(0);
      let info = JSON.parse(import_info);

      let count = 0;
      let next = true;

      let proc = info['proc'];
      let start_row = info['start_row'];
      let add_params = info['add_params'] ? info['add_params'] : [];
      let err_continue = info['error_continue'];
      let db2 = info['_db2'] ? info['_db2'] : null;
      let seq = Date.now();

      //let processList = [];

      let params = [];

      const sheetModel = this.activeSheet.model;

      for (let idx = start_row; idx <= sheetModel.rows.length; idx++) {
        let row = this.activeSheet.getRow(idx);
        let rowModel = row.model;

        //let process = {  proc: proc, param: []  };
        let param = [];

        for (let colIdx = rowModel.min; colIdx <= rowModel.max; colIdx++) {
          let cell = row.getCell(colIdx);
          let cellValue = cell.value ? cell.value : '';
          param.push(cellValue);
        }

        param.push(...add_params);
        param.push(seq);

        params.push(param);
      }

      const result = await DBService.callBulkProcCursor(proc, params, lang, crt_by, db2);

      if (result && result.length > 0) {
        try {
          result.forEach(res => {
            count += res.filter(q => !(q.hasOwnProperty('ERRCODE') || q.hasOwnProperty('ERRMSG'))).length;
          });
        } catch (e) {
          console.log(e.message);
        }
      }

      return count;
    } catch (e) {
      Utils.Logger({LVL: 'error', MODULE: 'ImportController', FUNC: 'ImportExcel', CONTENT: e.message});
    }

    return 0;
  }

  async importDBData(import_info, lang, crt_by, _resourcesPath, _filenm, _tablepk, _tablenm) {
    try {
      //console.log('importDBData',_tablepk+" - "+_tablenm)
      this.setActiveSheet(0);
      //console.log(this.activeSheet);
      //console.log('import_info', import_info);
      let info = JSON.parse(import_info);
      let count = 0;
      let next = true;
      let paramObj = [];
      let proc = info['proc'];
      let start_row = info['start_row'];
      let add_params = info['add_params'] ? info['add_params'] : [];
      let err_continue = info['error_continue'];
      let start_col = info['start_col'];
      let end_col = info['end_col'];
      let db2 = info['_db2'] ? info['_db2'] : null;
      /*[Anh Quyen Chinh] */
      let columnChk = info['impValidCol'];
      let valCheck = info['impValidValue'].trim();
      /*=================*/
      let processList = [];
      const arr_result = [];

      const sheetModel = this.activeSheet.model;
      console.log('start_col  ', start_col);
      let rows = this.activeSheet.getColumn(start_col);
      let rowsCount = rows['_worksheet']['_rows'].length;
      //console.log('sheetModel::',sheetModel.rows.length)
      /*[vng-154/dvg] sheetModel.rows.length get wrong total rows */
      for (let idx = start_row; idx <= rowsCount; idx++) {
        let seq = Date.now();
        //console.log('valCheck:',"-"+valCheck+"-");
        let row = this.activeSheet.getRow(idx);
        //console.log(row)
        let rowModel = row.model;
        //console.log('rowModel-beg:',rowModel)
        let process = {proc: proc, param: []};
        let param = [];
        if (rowModel?.min != null && rowModel?.min != 'null' && rowModel?.min != undefined) {
          //console.log('rowModel-if:',idx);
          /*[Add Check column - values] */
          if (Number(columnChk) >= 0 && valCheck != '') {
            let execlChk = row.getCell(columnChk);
            let cellValue2 = execlChk.value ? execlChk.value : '';
            if (cellValue2.trim() == valCheck.trim()) {
              for (let colIdx = start_col; colIdx <= end_col; colIdx++) {
                let cell = row.getCell(colIdx);
                //console.log('cell11:',cell.value)
                let cellValue = cell.value ? cell.value : '';
                if (cellValue.formula && cellValue.formula != undefined) {
                  cellValue = cellValue.result;
                }
                if (cellValue.richText && cellValue.richText != undefined) {
                  let concatRichText = '';
                  for (let r = 0; r < cellValue.richText.length; r++) {
                    let getText = cellValue.richText[r].text;
                    concatRichText = concatRichText + '' + getText;
                  }
                  cellValue = concatRichText;
                  //console.log('cellValue:',cellValue);
                }
                if (cellValue.sharedFormula && cellValue.sharedFormula != undefined) {
                  cellValue = cellValue.result;
                  //console.log('cellValue:',cellValue);
                }
                param.push(cellValue);
              }
              row.getCell(end_col + 1).value = idx + '' + seq;
              row.commit();
              param.push(...add_params);
              if (_tablenm == 'TAC_FILES') {
                param.push(_tablenm);
                param.push(_tablepk);
              }
              param.push(idx + '' + seq);
              paramObj.push(param);
              process['param'] = param;
              processList.push(process);
            }
          } else {
            /*[end]*/
            for (let colIdx = start_col; colIdx <= end_col; colIdx++) {
              //console.log('colIdx ::',colIdx)  //rowModel.min
              let cell = row.getCell(colIdx);
              //console.log('cell1122:',cell.value)
              let cellValue = cell.value ? cell.value : '';
              if (cellValue.formula && cellValue.formula != undefined) {
                cellValue = cellValue.result;
              }
              if (cellValue == undefined) cellValue = '';
              if (cellValue.richText && cellValue.richText != undefined) {
                let concatRichText = '';
                for (let r = 0; r < cellValue.richText.length; r++) {
                  let getText = cellValue.richText[r].text;
                  concatRichText = concatRichText + '' + getText;
                }
                cellValue = concatRichText;
                //console.log('cellValue:',cellValue);
              }
              if (cellValue.sharedFormula && cellValue.sharedFormula != undefined) {
                cellValue = cellValue.result;
                //console.log('cellValue:',cellValue);
              }

              param.push(cellValue);
            }
            row.getCell(end_col + 1).value = idx + '' + seq;
            row.commit();
            param.push(...add_params);
            if (_tablenm == 'TAC_FILES') {
              param.push(_tablenm);
              param.push(_tablepk);
            }
            param.push(idx + '' + seq);
            paramObj.push(param);
            process['param'] = param;
            processList.push(process);
          }
        }
        //console.log('rowModel:',idx);
      }
      try {
        const rtnList = await DBService.callBulkProcCursor(proc, paramObj, lang, crt_by, db2);

        if (rtnList && rtnList.length > 0) {
          try {
            for (let index = 0; index < rtnList.length; index++) {
              const element = rtnList[index][0];
              // console.log('[vng-154/dvg] > file: ImportHelper.js > line 167 > ImportHelper > importDBData > element', element);
              // console.log('[vng-154/dvg] > file: ImportHelper.js > line 167 > ImportHelper > importDBData > element', element);
              let result = {};
              result.SEQ = paramObj[index][paramObj[index].length - 1];
              if (!(element.hasOwnProperty('ERRCODE') || element.hasOwnProperty('ERRMSG'))) {
                // result.ERRCODE = element.ERRCODE;
                // result.ERRMSG  = element.ERRMSG;
              } else {
                result.ERRCODE = element.ERRCODE;
                result.ERRMSG = element.ERRMSG;
              }
              arr_result.push(result);
              count++;
            }
          } catch (e) {
            console.log(e.message);
          }
        }
      } catch (e) {
        let arr1 = [];
        let vall1 = e.message.toLowerCase();
        this.decodeMessage(arr1, vall1);
        let result1 = {};
        result1.SEQ = paramObj[0][paramObj[0].length - 1] + '';

        if (arr1.length > 0) {
          result1.ERRCODE = arr1.join('  >>>  ');
        } else {
          result1.ERRCODE = vall1;
        }
        arr_result.push(result1);
      }
      /*[B][vng-154/dvg close 20220915] 
                const promises = processList.map(async x => { 
                    const result = await this.ProcessDataImp(x,lang, crt_by);   
                    var obj = result[0] ; 
                    rr_result.push(obj);    
                    count++;
                });  
                await Promise.all(promises);   
             [E][vng-154/dvg close 20220915] */

      /*===========Write excel file================*/
      var worksheet = this.activeSheet;
      rows = worksheet.getColumn(start_col);
      rowsCount = rows['_worksheet']['_rows'].length;
      /*[vng-154/dvg] sheetModel.rows.length get wrong total rows */
      for (let idx = start_row; idx <= rowsCount; idx++) {
        var r_item = worksheet.getRow(idx);
        var maxcol = end_col + 1;
        var seq_idx = r_item.getCell(maxcol).value;
        var itemdata = '';
        var msg = 'Success';
        var flag = '1';
        for (let arri = 0; arri <= arr_result.length - 1; arri++) {
          itemdata = arr_result[arri];
          // console.log('[vng-154/dvg] > file: ImportHelper.js > line 218 > ImportHelper > importDBData > itemdata', itemdata);
          // console.log('[vng-154/dvg] >   itemdata', itemdata.SEQ + '=' + seq_idx);
          if (Number(itemdata.SEQ) == Number(seq_idx)) {
            if (itemdata.ERRCODE || itemdata.ERRCODE != undefined) {
              msg = itemdata.ERRCODE + ' ' + itemdata.ERRMSG;
            }
            flag = '2';
          }
        }
        if (flag == '1') {
          msg = 'row_data_is_wrong_please_check_again';
        }
        r_item.getCell(maxcol).value = msg;
        r_item.commit();
      }

      this.returnFile = Helpers.tmpPath(_filenm);
      await this.writeFile();
      return true;
    } catch (e) {
      console.log('e', e);
      Utils.Logger({LVL: 'error', MODULE: 'ImportHelper', FUNC: 'importDBData', CONTENT: e.message});
      return false;
    }
  }

  async writeFileExcel() {
    await this.workbook.xlsx.writeFile(this.returnFile);
    return response.attachment(this.returnFile, 'imp_file_excel.xlsx');
  }

  async ProcessDataImp(item, lang, crt_by) {
    try {
      const result = await DBService.callProcCursor(item.proc, item.param, lang, crt_by);
      // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 237 > ImportHelper > ProcessDataImp > result', result);
      result[0].SEQ = item.param[item.param.length - 1];
      //  console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 218 > ImportHelper > ProcessDataImp > result', result);
      return result;
    } catch (e) {
      // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 242 > ImportHelper > ProcessDataImp > e', e);
      Utils.Logger({LVL: 'error', MODULE: 'ImportHelper', FUNC: 'ProcessDataImp', CONTENT: e.message});
      var arr = [];
      var vall = e.message.toLowerCase();
      this.decodeMessage(arr, vall);
      var result = [{}];
      result[0].SEQ = item.param[item.param.length - 1];

      if (arr.length > 0) {
        result[0].ERRCODE = arr.join('  >>>  ');
      } else {
        result[0].ERRCODE = vall;
      }
      return result;
      // return [e.message];
    }
  }
  decodeMessage(arr, val) {
    let seft = this;
    const regex = /[ORA|ora]-([\d]*):\s\[(.*)\]/gm; // /ora-([\d]*):\s\[(.*)\]$/gm;
    var vall = val.toLowerCase().replace(/\n/gm, '');
    let m;
    while ((m = regex.exec(vall)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      //console.log(m[2]);
      if (m.length == 3) {
        if (!m[2].startsWith('ora-')) {
          var strs = m[2].split(',');
          strs.forEach(s => {
            arr[arr.length] = s;
          });
        } else {
          seft.decodeMessage(arr, m[2]);
        }
      }
    }
  }
}

module.exports = ImportHelper;
