
import { intToRGBA } from "jimp"
import moment from "moment"

let regexCell = /([a-zA-Z]+)(\d+)/;
let test = {

	ExcelBuilder: async (that, einvoiceMasterData, einvoiceDetailData, einvoicePk, _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox, lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath, masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn, backgroundCell, backgroundWidth, backgroundHeight, checked, unchecked) => {
		let reportInfo = { CODE: '01', NAME: einvoicePk, PATH: reportPath };//that is the report template path.
		console.log(einvoiceMasterData)
		console.log(einvoiceDetailData)
		let exceljs = require("@/plugins/exceljs.js");
		if (!!exceljs) {
			exceljs = exceljs.default;
		}
		await exceljs.createWorkbook(that, reportInfo.PATH);
		exceljs.setWorksheet(reportSheet);//that is the name of the sheet of the einvoice template.
		let worksheet = exceljs.worksheet();

		const sheetModel = worksheet.model;
		let lstMergeTemp = [];
		let lstNewMerge = [];

		let excCols = that.excelCols
		let sttCell = ""
		let nmCell = ""
		let lastCell = excCols[detailCellFormat[detailCellFormat.length - 1].endCell + 1]
		let startMergeRedundantRow = detailCellFormat[0].startCell
		let endMergeRedundantRow = detailCellFormat[detailCellFormat.length - 1].endCell
		//"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
		//"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

		//this fuction get the images and turn it to bytearray to insert to the excel.
		let createFile = async (url) => {
			let response = await fetch(url);
			let data = await response.blob();
			let metadata = {
				type: 'image/png'
			};
			let file = new File([data], "test.png", metadata);
			return file;
		}
		let totalRows = einvoiceDetailData.length;
		let checkImage = await createFile(checked);
		let checkImageByteArray = await that.blobToArray(new Blob([checkImage], { type: 'application/octet-stream' }))

		let uncheckImage = await createFile(unchecked);
		let uncheckImageByteArray = await that.blobToArray(new Blob([uncheckImage], { type: 'application/octet-stream' }))

		let signedIcon = await createFile(signPath);
		let signIconByteArray = await that.blobToArray(new Blob([signedIcon], { type: 'application/octet-stream' }))

		//END-this fuction get the images and turn it to bytearray to insert to the excel.
		console.log("checkImageByteArray +++==> ", checkImageByteArray);

		console.log("uncheckImageByteArray +++==> ", uncheckImageByteArray);
		// //this part set the master data to each cell. that 100% base on template.
		try {
			if (einvoiceDetailData && einvoiceDetailData.length > 0) {
				masterDataArray.forEach(e => {
					if (e.Type == 1) {
						let infoData = ""
						e.Info.forEach(_e => {
							console.log("_e +++>> 1", _e);
							if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
								infoData = infoData + einvoiceMasterData[0][`${_e}`];
							} else {
								infoData = infoData + " "
							}
						});
						console.log("e.Cell +++>> 1", e.Cell, " infoData ++++==>   ", infoData);
						exceljs.getCellByAddress(that, `${e.Cell}`).value = infoData;
					} else
						if (e.Type == 2) {
							switch (e.Info[0]) {
								case "dateString":
									exceljs.getCellByAddress(that, `${e.Cell}`).value = dateString != null ? dateString : '';
									//console.log(e.Cell+"+"+e.Info[0])
									break;
								default: exceljs.getCellByAddress(that, `${e.Cell}`).value = e.Info[0] != null ? e.Info[0] : '';
									break;
							}

						} else
							if (e.Type == 3) {
								if (einvoiceMasterData[0]["SIGN_YN"] == "Y") {
									let infoData = ""
									e.Info.forEach(_e => {
										if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
											infoData = infoData + einvoiceMasterData[0][`${_e}`];
										} else {
											infoData = infoData + " "
										}
									});
									exceljs.getCellByAddress(that, `${e.Cell}`).value = infoData;
								}
							}
				});
			}
		} catch (error) {
			console.log("error +===>", error);
		}


		if (einvoiceMasterData[0]["CMA"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 18 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 18 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}


		if (einvoiceMasterData[0]["KCMA"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 19 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 19 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["CMTMTTIEN"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 20 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 20 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["NNTDBKKHAN"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 24 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 24 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["NNTKTDNUBND"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 25 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 25 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["CDDU"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 32 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 32 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["CBTHOP"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 33 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 33 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["HDGTGT"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 36 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 36 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["HDBHANG"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 37 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 37 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["HDBTSCONG"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 38 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 38 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["HDBHDTQGIA"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 39 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 39 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["HDKHAC"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 40 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 40 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}

		if (einvoiceMasterData[0]["CTU"] == "1") {
			try {
				worksheet.addImage(exceljs.insertImage(that, checkImageByteArray), {
					tl: { col: 2, row: 41 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				worksheet.addImage(exceljs.insertImage(that, uncheckImageByteArray), {
					tl: { col: 2, row: 41 },
					ext: { width: 20, height: 20 }
				});

			} catch (error) {
				console.log(error)
			}
		}


		try {
			// //this part coppy merge information of the page before add more row.
			let lstMerge = sheetModel.merges;
			lstMerge.forEach(x => {
				const mergeRange = x;
				const startMergeCell = mergeRange.split(':').shift();
				const endMergeCell = mergeRange.split(':').pop();

				const _row1 = Number((startMergeCell.match(regexCell))[2]); //regex: string - character - number
				const _col1 = that.excelCols.findIndex(x => x == (startMergeCell.match(regexCell))[1]); //regex: string - character - number/// 
				const _row2 = Number((endMergeCell.match(regexCell))[2]); //regex: string - character - number
				const _col2 = that.excelCols.findIndex(x => x == (endMergeCell.match(regexCell))[1]); //regex: string - character - number///
				if (_row1 === _sourceRow) {
					lstMergeTemp.push({ row1: _row1, col1: _col1, row2: _row2, col2: _col2, range: x });
					worksheet.unMergeCells(startMergeCell);
				}

				if (_row1 > _sourceRow) {
					lstNewMerge.push({ row1: _row1 + totalRows - 1, col1: _col1, row2: _row2 + totalRows - 1, col2: _col2, range: x });
					worksheet.unMergeCells(startMergeCell);
				}
			});
			// //console.log(lstMerge)
			// // //ADDING rows
			for (let i = 1; i < totalRows; i++) {
				exceljs.copyRow(_sourceRow + i, _sourceRow, 'c');
				exceljs.getCellByAddress(that, `C${_sourceRow + i}`).style.border = {};
			}
			// //END-ADDING rows

			lstNewMerge.forEach(x => {
				try {
					//console.log(x);
					worksheet.mergeCells(x.row1, x.col1, x.row2, x.col2);
				} catch (ee) {
					console.log("err", ee)
				}
	
			})

			let _startRow = 1; let _startcol = 1;
			let _endRow = totalRows + _sourceRow; 
			let _endcol = detailCellFormat[detailCellFormat.length - 1].endCell + 3;
			const _rowCount = _endRow - _startRow + 1;

			const _sheetModel = worksheet.model;
			let _lstMerge = [..._sheetModel.merges];
			let _lstNewMerge = [];

			_lstMerge = _lstMerge.map(q => {
				let obj = {}
				const startMergeCell = q.split(':').shift();
				const endMergeCell = q.split(':').pop();

				const _row1 = Number((startMergeCell.match(that.regexCell))[2]); //regex: string - character - number
				const _col1 = that.excelCols.findIndex(x => x == (startMergeCell.match(that.regexCell))[1]); //regex: string - character - number/// 
				const _row2 = Number((endMergeCell.match(that.regexCell))[2]); //regex: string - character - number
				const _col2 = that.excelCols.findIndex(x => x == (endMergeCell.match(that.regexCell))[1]); //regex: string - characte
				obj = {
					range: q,
					row1: _row1,
					col1: _col1,
					row2: _row2,
					col2: _col2
				};
				return obj;
			});
			_lstMerge = _lstMerge.filter(q => {
				let b = false;
				if (q.row1 >= _startRow && q.col1 >= _startcol && q.row2 <= _endRow && q.col2 <= _endcol) {
					b = true;
				}
				return b;
			})
			//console.log(_lstMerge)

			for (let idx = 0; idx <  1; idx++) {
				_lstMerge.forEach(q => {
					const startMergeCell = q["range"].split(':').shift();
					const endMergeCell = q["range"].split(':').pop();

					let c1 = (startMergeCell.match(that.regexCell))[1] + (q.row1 + (_rowCount * (1 + idx)));
					let c2 = (endMergeCell.match(that.regexCell))[1] + (q.row2 + (_rowCount * (1 + idx)));
					_lstNewMerge.push({ row1: q.row1 + (_rowCount * (1 + idx)), col1: q.col1, row2: q.row2 + (_rowCount * (1 + idx)), col2: q.col2, range: `${c1}:${c2}` });
				});

			}
			exceljs.insertRange2(that, `A1:AF${_endRow}`, 1, true, false);
			_lstNewMerge.forEach(x => {
				try {
					const startMergeCell = x["range"].split(':').shift();
					worksheet.unMergeCells(startMergeCell)
				} catch (ee) { console.log(ee.message) }
				try {
					worksheet.mergeCells(x.row1, x.col1, x.row2, x.col2);
				} catch (ee) {
					console.log(ee.message)
					console.log(x.row1 + "+" + x.col1)
					console.log(x.row2 + "+" + x.col2)
				}
			})

			for (let i = 0; i < totalRows; i++) {  //totalRows
				let check_round;
				console.log(" ii +++==>",i);
				try {
					const _e = einvoiceDetailData[i];

					addValueToCellsWithItemName(that, exceljs,  _sourceRow + i, _e, "", detailCellFormat, excCols);

					detailCellFormat.forEach((e, j) => {
						check_round = _sourceRow  + i;

						worksheet.mergeCells(_sourceRow  + i, e.startCell, _sourceRow  + i  , e.endCell)
						// exceljs.getCellByAddress(that, `${excCols[e.startCell] + (_sourceRow )}`).style.border = { bottom: { style: detailCellFormat[j].cellBorder }, };
						
					});
					//exceljs.getCellByAddress(that, `${lastCell +  (_sourceRow )}`).style.border = { right: { style: 'solid' },bottom: { style: detailCellFormat[j].cellBorder }  };
				} catch (error) {
					console.log("error detailCellFormat +==> ",error);
				}
			}

		} catch (error) {
			console.log("error +++===> ", error);
		}


		// //this part insert Signed image if the einvoice is signed.
		// //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
		// //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
		if (einvoiceMasterData[0]["STATUS"] == "Y") {
			let _countFromEndDetailToSignBox = 3; 
			try {
				try {
					worksheet.addImage(exceljs.insertImage(that, signIconByteArray), {
						tl: { col: 6.8  , row: totalRows + _sourceRow + _countFromEndDetailToSignBox -1 },
						ext: { width: 70, height: 50 }
					});
				} catch (error) {
					console.log(error)
				}
			} catch (error) {
				console.log(error)
			}
		}
		// //END-this part insert Signed image if the einvoice is signed.

		

		let convertResult = await exceljs.convertToPdfAndDownload(that, reportInfo.NAME)
		//console.log(" convertResult" , convertResult);
		return convertResult.data
		await exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
	},


}
let NumberToTextVN = (total) => {

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

		// console.log("total",total)
		// console.log("nstr",nstr)
		// console.log("n",n)
		// console.log("len",len)

		for (let i = 0; i < len; i++) {
			n[len - 1 - i] = parseInt(nstr.substr(i, 1));
		}
		//console.log(n)
		for (let i = len - 1; i >= 0; i--) {
			if (i % 3 == 2)// số 0 ở hàng trăm
			{
				if (n[i] == 0 && n[i - 1] == 0 && n[i - 2] == 0) continue;//nếu cả 3 số là 0 thì bỏ qua không đọc
			}
			else if (i % 3 == 1) // số ở hàng chục
			{
				if (n[i] == 0) {
					if (n[i - 1] == 0) { continue; }// nếu hàng chục và hàng đơn vị đều là 0 thì bỏ qua.
					else {
						rs += " " + rch[n[i]]; continue;// hàng chục là 0 thì bỏ qua, đọc số hàng đơn vị
					}
				}
				if (n[i] == 1)//nếu số hàng chục là 1 thì đọc là mười
				{
					rs += " mười"; continue;
				}
			}
			else if (i != len - 1)// số ở hàng đơn vị (không phải là số đầu tiên)
			{
				if (n[i] == 0)// số hàng đơn vị là 0 thì chỉ đọc đơn vị
				{
					if (i + 2 <= len - 1 && n[i + 2] == 0 && n[i + 1] == 0) continue;
					rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]);
					continue;
				}
				if (n[i] == 1)// nếu là 1 thì tùy vào số hàng chục mà đọc: 0,1: một / còn lại: mốt
				{
					rs += " " + ((n[i + 1] == 1 || n[i + 1] == 0) ? ch[n[i]] : rch[n[i]]);
					rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]);
					continue;
				}
				if (n[i] == 5) // cách đọc số 5
				{
					if (n[i + 1] != 0) //nếu số hàng chục khác 0 thì đọc số 5 là lăm
					{
						rs += " " + rch[n[i]];// đọc số 
						rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]);// đọc đơn vị
						continue;
					}
				}
			}

			rs += (rs == "" ? " " : ", ") + ch[n[i]];// đọc số
			rs += " " + (i % 3 == 0 ? u[i] : u[i % 3]);// đọc đơn vị
		}
		if (rs[rs.length - 1] != ' ')
			rs += " đồng";
		else
			rs += "đồng";

		if (rs.length > 2) {
			let rs1 = rs.substr(0, 2);
			rs1 = rs1.toUpperCase();
			rs = rs.substr(2);
			rs = rs1 + rs;
		}
		//console.log(rs)
		return rs.trim().replace("lẻ,", "lẻ").replace("mươi,", "mươi").replace("trăm,", "trăm").replace("mười,", "mười");
	}
	catch (error) {
		return "";
	}

}

let Num2VNText = (s, ccy) => {
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
	let A = []
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
		if (((l - i) % 3 == 0) && (A[i] == "0") && ((A[i + 1] != "0") || (A[i + 2] != "0"))) {
			rtnf += " Không";
		}
		if (A[i] == "2") { rtnf += " Hai"; }
		else
			if (A[i] == "3") { rtnf += " Ba"; }
			else
				if (A[i] == "4") { rtnf += " Bốn"; }
				else
					if (A[i] == "6") { rtnf += " Sáu"; }
					else
						if (A[i] == "7") { rtnf += " Bảy"; }
						else
							if (A[i] == "8") { rtnf += " Tám"; }
							else
								if (A[i] == "9") { rtnf += " Chín"; }
								else
									if (A[i] == "5") {
										if ((i > 0) && ((l - i) % 3 == 1) && (A[i - 1] != "0")) {
											rtnf += " Lăm";
										}
										else {
											if (i > 0 && (l - i) % 3 == 1 && A[i - 1] != "0") {
												rtnf += " Lăm";
											}
											else {
												rtnf += " Năm";
											}
										}
									}

		if ((i > 2) && (A[i] == "1") && ((l - i) % 3 == 1) && (parseInt(A[i - 1]) > 1)) {
			rtnf += " Mốt";
		}
		else if ((A[i] == "1") && (((l - i) % 3) != 2)) {
			if ((l - i) % 3 == 1) {
				if (i > 2 && A[i - 2] == "0" || i < 2 && A[0] == "1" || i > 2 && A[i - 1] == "0" || i > 2 && A[i - 1] == "0") {
					rtnf += " Một";
				}
				else {
					if (A[i - 1] == "1" || A[i - 1] == "0") {
						rtnf += " Một";
					}
					else {
						rtnf += " Mốt";
					}

				}
			}
			else {
				rtnf += " Một";
			}
		}


		if (((l - i) % 3) == 2 && A[i] != "0" && A[i] != "1") {
			rtnf += " Mươi";
		}
		else if ((l - i) % 3 == 2 && A[i] != "0") {
			rtnf += " Mười";
		}
		if (i == 0) {
			if ((l - i) % 3 == 2 && A[i] == "0" && A[i + 1] != "0") {
				rtnf += " Không";
			}
		}
		else {
			if ((l - i) % 3 == 2 && A[i] == "0" && A[i + 1] != "0") {
				rtnf += " Lẻ";
			}
		}
		if ((l - i) % 3 == 0 && (A[i + 1] != "0")) //  || A[i + 2] == "0"
		{
			rtnf += " Trăm";
		}
		else if ((l - i) % 3 == 0 && A[i] != "0") {
			rtnf += " Trăm";
		}

		if ((l - i) == 4) {
			rtnf += " Nghìn";
		}
		if ((l - i) == 7) {
			rtnf += " Triệu";
		}
		if ((l - i) == 10) {
			rtnf += " Tỷ";
		}
		if ((l - i) == 13) {
			rtnf += " Nghìn Tỷ";
		}
		if ((l - i) == 16) {
			rtnf += " Triệu Tỷ";
		}
		if ((l - i) == 19) {
			rtnf += " Tỷ Tỷ";
		}
		if ((l - i) == 22) {
			rtnf += " Triệu Tỷ Tỷ";
		}
		if ((l - i) == 25) {
			rtnf += " Triệu Tỷ Tỷ";
		}
		if ((l - i) == 28) {
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
		if (s1.length > 0) //Đọc số lẻ 
		{
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
				if ((i > 0) && (B[0] != "0") && (B[0] != "1")) {
					strTmp += " Mươi";
				}

				if (B[i] == "1") {
					if (i == 0) {
						strTmp += " Mười";
					}
					else {
						if (B[0] == "1") {
							strTmp += " Một";
						}
						else {
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
						}
						else {
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

let addValueToCellsWithItemName = (that, exceljs, rownum, detaildata, itemname, detailCellFormat, excCols) => {
	//console.log(detailCellFormat)
	let fieldArray = []
	detailCellFormat.forEach(e => {
		fieldArray.push({ col: excCols[e.startCell], field: e.field })
	});
	//console.log(fieldArray)
	fieldArray.forEach((e, i) => {
		// if (e.field == "ITEM_NAME") {
		// 	exceljs.getCellByAddress(that, `${e.col + rownum}`).value = itemname;
		// } else {
		// 	exceljs.getCellByAddress(that, `${e.col + rownum}`).value = detaildata[e.field];
		// }
		exceljs.getCellByAddress(that, `${e.col + rownum}`).value = detaildata[e.field];

	});
	// exceljs.getCellByAddress(that, `${fieldArray[0] + rownum}`).value = detaildata["STT"];
	// exceljs.getCellByAddress(that, `${fieldArray[1] + rownum}`).value = itemname;
	// exceljs.getCellByAddress(that, `${fieldArray[2] + rownum}`).value = detaildata["ITEM_UOM"];
	// exceljs.getCellByAddress(that, `${fieldArray[3] + rownum}`).value = detaildata["QTY"];
	// exceljs.getCellByAddress(that, `${fieldArray[4] + rownum}`).value = detaildata["U_PRICE"];
	// exceljs.getCellByAddress(that, `${fieldArray[5] + rownum}`).value = detaildata["NET_TR_AMT"];
}
let countlength_v2 = (s) => {
	let result = 0;
	let a = s.split('&#xA;')

	result = a.length;
	if (result == 0) {
		result = 1;
	}

	return result;
}
export default test; 