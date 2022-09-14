"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const Utils = use("Utils");
const Env = use("Env");

var Excel = use('exceljs');

const DBService = use("DBService")


//const user = await auth.getUser();


class ImportHelper {
    
    regexCell = /([a-zA-Z]+)(\d+)/;
    regexColumns = /\$[\[](.*?)[\]]/g; // list  $[column]
    regexColumnName = /\$[\[](.*?)[\]]/; //  $[column]
    workbook = new Excel.Workbook();
    activeSheet = null;
    templateFile = "";
    reportPath ="";
    returnFile = null;

    
	constructor( lang, crt_by) {
        this.reportPath = "import_temp_" + crt_by +".xlsx";
        this.returnFile = Helpers.tmpPath(this.reportPath)
    }

    
    async loadFile(path){
    	await this.workbook.xlsx.readFile(path)
    }

    async writeFile(){
        await this.workbook.xlsx.writeFile(this.returnFile);
        return this.returnFile;
    }

    setActiveSheet(idx){
    	this.activeSheet = this.workbook.getWorksheet(idx);
        this.rowIdx = 0;//su dung do insert total
        this.mergeColIndex = [];
        this.sequenceType = null;
        this.rowSequence = 0// cho so thu tu
    }

    async importData(import_info, lang, crt_by) {
        try{
            this.setActiveSheet(1);
            let info = JSON.parse(import_info);

            let count = 0;
            let next = true;

            let proc = info["proc"];
            let start_row = info["start_row"];
            let add_params = info["add_params"] ? info["add_params"]  : [];
            let err_continue = info["error_continue"];

            let seq = Date.now();

            let processList = [];

            const sheetModel = this.activeSheet.model;

            for(let idx = start_row; idx <= sheetModel.rows.length; idx++) {
                let row = this.activeSheet.getRow(idx);
                let rowModel = row.model;

                let process = {  proc: proc, param: []  };
                let param = [];

                for(let colIdx = rowModel.min; colIdx <= rowModel.max; colIdx++) {
                    let cell = row.getCell(colIdx);
                    let cellValue = (cell.value ? cell.value : "");
                    param.push(cellValue);
                }

                param.push(...add_params);
                param.push(seq);

                process["param"] = param;
                processList.push(process);
            }


            

            const promises = processList.map(async x => {
                if(next || err_continue) {
                    const result = await this.delayedDataProcess(x,lang, crt_by);
                    if (result <= 0) {
                        next = false;
                        if(!err_continue)
                            return null;
                    } else {
                        count+=result;
                    }
                }
            });

            await Promise.all(promises);

            return count;
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "ImportExcel", CONTENT: e.message })
        }
        
        return 0;
    }



    async delayedDataProcess(item, lang, crt_by) {
        try {
            const result = await DBService.callProcCursor(item.proc, item.param, lang, crt_by);
            if(result) 
                return 1;
            else 
                return 0;
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "delayedDataProcess", CONTENT: e.message })
            return 0;
        }
    }

	 async importDBData(import_info, lang, crt_by, _resourcesPath, _filenm) {
        try{
            this.setActiveSheet(1);
            let info = JSON.parse(import_info); 

            let count = 0;
            let next = true;

            let proc = info["proc"];
            let start_row = info["start_row"];
            let add_params = info["add_params"] ? info["add_params"]  : [];
            let err_continue = info["error_continue"];
            let end_col = info["end_col"];

            

            let processList = [];
            const arr_result = []; 
            const sheetModel = this.activeSheet.model;
            for(let idx = start_row; idx <= sheetModel.rows.length; idx++) {
                let seq = Date.now();
                let row = this.activeSheet.getRow(idx);
                let rowModel = row.model;
                
                let process = {  proc: proc, param: []  };
                let param = [];

                for(let colIdx = rowModel.min; colIdx <= end_col; colIdx++) {
                    let cell = row.getCell(colIdx);
                    let cellValue = (cell.value ? cell.value : ""); 
                    if(cellValue.formula && cellValue.formula != undefined){
                        cellValue = cellValue.result;
                    }
                    param.push(cellValue);
                } 
                row.getCell(end_col+1).value = idx+''+seq;
                row.commit();
                param.push(...add_params);
                param.push(idx+''+seq); 

                process["param"] = param;
                processList.push(process); 
            }   
            const promises = processList.map(async x => { 
                const result = await this.ProcessDataImp(x,lang, crt_by);   
                var obj = result[0] ; 
                arr_result.push(obj);   
                // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 175 > ImportHelper > importDBData > arr_result', arr_result);
                count++;
            });  
            await Promise.all(promises);   
            

            // this.loadFile(_resourcesPath);
            // this.setActiveSheet(1);
            var worksheet = this.activeSheet;
            // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 191 > ImportHelper > importDBData > itemdata');
            for(let idx = start_row; idx <= sheetModel.rows.length; idx++) {   
                var r_item = worksheet.getRow(idx);
                var maxcol = end_col + 1  ;
                var seq_idx = r_item.getCell(maxcol).value;
                // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 187 > ImportHelper > importDBData > seq_idx', seq_idx);
                var itemdata = ""; var msg ="Success";  var flag = '1';
                for(let arri = 0; arri<=arr_result.length-1; arri++)
                {   
                    itemdata = arr_result[arri]; 
                    // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 191 > ImportHelper > importDBData > itemdata', itemdata);
                    // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 193 > ImportHelper > importDBData > itemdata.SEQ', itemdata.SEQ);
                    // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 194 > ImportHelper > importDBData > seq_idx', seq_idx);
                    if(itemdata.SEQ == seq_idx) 
                    {
                        if(itemdata.ERRCODE || itemdata.ERRCODE != undefined)
                        { 
                            msg =  itemdata.ERRCODE + ' ' +itemdata.ERRMSG
                        } 
                        flag = '2';
                    }
                }  
                if(flag == '1')
                {
                    msg = "row_data_is_wrong_please_check_again";
                } 
                r_item.getCell(maxcol).value = msg;
                r_item.commit();
            }  

            this.returnFile = Helpers.tmpPath(_filenm);  
            await this.writeFile(); 

            return  true ;//response.attachment(rtnfileData, file_name);
            // return rtnfileData;
             
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportHelper", FUNC: "importDBData", CONTENT: e.message })
            return false;
        } 
    }

    async writeFileExcel(){
        await this.workbook.xlsx.writeFile(this.returnFile);
        return response.attachment( this.returnFile, 'imp_file_excel.xlsx');
    }

    async ProcessDataImp(item, lang, crt_by) {
        try {
            const result = await DBService.callProcCursor(item.proc, item.param, lang, crt_by); 
            // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 237 > ImportHelper > ProcessDataImp > result', result);
            result[0].SEQ = item.param[item.param.length-1];
            //  console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 218 > ImportHelper > ProcessDataImp > result', result);
            return result; 
        } catch (e) {
            // console.log('vng-154-dvg^_^: > file: ImportHelper.js > line 242 > ImportHelper > ProcessDataImp > e', e);
            Utils.Logger({ LVL: "error", MODULE: "ImportHelper", FUNC: "ProcessDataImp", CONTENT: e.message })
            var arr = [];
            var vall = e.message.toLowerCase();
            this.decodeMessage(arr, vall);
            var result = [{}];
            result[0].SEQ = item.param[item.param.length-1];

            if (arr.length > 0) {
                  result[0].ERRCODE = arr.join("  >>>  ") ; 
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
        var vall = val.toLowerCase().replace(/\n/gm,'');
        let m;
        while ((m = regex.exec(vall)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            //console.log(m[2]);
            if (m.length == 3) {
                if (!m[2].startsWith("ora-")) {
                    var strs = m[2].split(",");
                    strs.forEach((s) => {
                        arr[arr.length] = s;
                    });
                } else {
                    seft.decodeMessage(arr, m[2]);
                }
            }
        }
    }
}

module.exports = ImportHelper