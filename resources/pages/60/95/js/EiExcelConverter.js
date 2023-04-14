
import { intToRGBA } from "jimp"
import moment from "moment"

let regexCell = /([a-zA-Z]+)(\d+)/;
let test = {

	ExcelBuilder: async (that, einvoiceMasterData, einvoiceDetailData, einvoicePk, _sourceRow, _sourceRow_2, _sourceRow_3, headerRowCount, countFromEndDetailToSignBox, lastPageRowsHeight, reportPath, reportSheet, signPath, cancelPath, bgPath, masterDataArray, detailCellFormat, logos, signCell, signBoxCell, signByCell, cancelYn, backgroundCell, backgroundWidth, backgroundHeight) => {
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
		let cancelImage = await createFile(cancelPath);
		let cancelImageByteArray = await that.blobToArray(new Blob([cancelImage], { type: 'application/octet-stream' }))

		let signedIcon = await createFile(signPath);
		let signIconByteArray = await that.blobToArray(new Blob([signedIcon], { type: 'application/octet-stream' }))

		//let logoImage = await createFile(logoPath);
		//let logoIconByteArray = await that.blobToArray(new Blob([logoImage], { type: 'application/octet-stream' }))

		let bgImage = await createFile(bgPath);
		let bgIconByteArray = await that.blobToArray(new Blob([bgImage], { type: 'application/octet-stream' }))
		//END-this fuction get the images and turn it to bytearray to insert to the excel.

		//this part calculate the number of pages base on the data.
		let v_count = einvoiceDetailData.length;
		let page = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let page_index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		let pos_lv = 20//giới hạn row một trang
		let pos = 10//giới hạn row trang cuối
		let v_countNumberOfPages = 0;
		let total_countLenght = 0;
		let count_col = 0;
		let l_finish = "N";
		let count_col_index = 0;

		let totalRows = 0
		let countPerPage = 0
		let extendedRows = 0
		let count = 0
		let totalRowCount = 0
		let logoArray = []
		let extendedArray = []
		let totalRowCount_2 = 0
		let count_2 = 0
		let read_price = ""
		let read_priceV = ""
		let read_priceU = ""
		let amount_vat = ""
		let amount_total = ""
		let amount_trans = ""
		let amount_net = ""
		let lb_amount_trans = ""

		const sheetModel = worksheet.model;
		let lstMergeTemp = [];
		let lstNewMerge = [];

		let excCols = that.excelCols
		let sttCell = ""
		let nmCell = ""
		let lastCell = excCols[detailCellFormat[detailCellFormat.length - 1].endCell + 1]
		let startMergeRedundantRow = detailCellFormat[0].startCell
		let endMergeRedundantRow = detailCellFormat[detailCellFormat.length - 1].endCell
		let convertStr = "(HÓA ĐƠN CHUYỂN ĐỔI TỪ HÓA ĐƠN ĐIỆN TỬ)"
		detailCellFormat.forEach(e => {
			if (e.cellType == 2) {
				sttCell = excCols[e.startCell]
			}
			if (e.cellType == 3) {
				nmCell = excCols[e.startCell]
			}
		});

		for (let i = 0; i < 99; i++) {
			//console.log(page)
			count_col_index = 0;
			total_countLenght = 0;
			for (let j = count_col; j < v_count; j++) {

				let count_row = countlength_v2(einvoiceDetailData[j]["ITEM_NAME"]);
				if (count_row > 0) {
					total_countLenght += count_row;

				}
				else {
					total_countLenght += 1;
				}

				if (count_col == v_count - 1) {

					if (total_countLenght > pos) {
						//console.log("total_countLenght>pos",total_countLenght)
						page[i] = count_col_index;
						page_index[i] = total_countLenght - 1;
						page[i + 1] = 1;
						page_index[i + 1] = count_row;
						l_finish = "Y";
						count_col++;
						count_col_index++;
						break;
					}
					else {
						//console.log("total_countLenght<pos",total_countLenght)
						let abc = 0
						page.forEach(e => {
							abc += e
						});
						page[i] = v_count - abc;
						page_index[i] = total_countLenght;
						l_finish = "Y";
						count_col++;
						count_col_index++;
						break;
					}


				}
				else if (total_countLenght > pos_lv) {
					if (total_countLenght - pos_lv < 2) {
						page[i] = count_col_index;
						page_index[i] = total_countLenght;
						//count_col++;
						count_col_index++;
						break;//continue;	
					}
				}
				else if (total_countLenght == pos_lv) {
					page[i] = count_col_index + 1;
					page_index[i] = total_countLenght;
					count_col++;
					count_col_index++;
					break;//continue;
				}
				count_col++;
				count_col_index++;
			}
			if (l_finish == "Y") {
				break;
			}

		}

		for (let i = 0; i < 10; i++) {
			if (page[i] > 0) {
				v_countNumberOfPages++;
			}
		}

		console.log(page)
		console.log("v_countNumberOfPages", v_countNumberOfPages)
		//END-this part calculate the number of pages base on the data.

		//this part re-format amt.
		if (einvoiceMasterData[0]["CURRENCYCODEUSD"].toString() == "VND") {
			lb_amount_trans = "";
			amount_trans = "";
			amount_total = einvoiceMasterData[0]["TOT_AMT_BK_93"] == null ? null : einvoiceMasterData[0]["TOT_AMT_BK_93"].toString();
			amount_vat = einvoiceMasterData[0]["VAT_BK_AMT_92"] == null ? null : einvoiceMasterData[0]["VAT_BK_AMT_92"].toString();
			amount_net = einvoiceMasterData[0]["NET_BK_AMT_90"] == null ? null : einvoiceMasterData[0]["NET_BK_AMT_90"].toString();
			read_price = NumberToTextVN(parseFloat(einvoiceMasterData[0]["TOTALAMOUNTINWORD"] == null ? null : einvoiceMasterData[0]["TOTALAMOUNTINWORD"].toString()));
		}
		else {
			lb_amount_trans = einvoiceMasterData[0]["EXCHANGERATE"] == null ? null : einvoiceMasterData[0]["EXCHANGERATE"].toString();
			amount_trans = einvoiceMasterData[0]["TOT_AMT_BK_93"] == null ? null : einvoiceMasterData[0]["TOT_AMT_BK_93"].toString();
			amount_total = einvoiceMasterData[0]["TOT_AMT_TR_94"] == null ? null : einvoiceMasterData[0]["TOT_AMT_TR_94"].toString();
			amount_vat = einvoiceMasterData[0]["VAT_TR_AMT_DIS_TR_91"] == null ? null : einvoiceMasterData[0]["VAT_TR_AMT_DIS_TR_91"].toString();
			amount_net = einvoiceMasterData[0]["NET_TR_AMT_DIS_TR_89"] == null ? null : einvoiceMasterData[0]["NET_TR_AMT_DIS_TR_89"].toString();

			read_price = Num2VNText(einvoiceMasterData[0]["TOTALAMOUNTINWORD"].toString(), "USD");
		}
		read_price = read_price.substr(0, 2) + read_price.substr(2, read_price.length - 2).toLowerCase() + '.';
		//read_priceV=NumberToTextVN(parseFloat(einvoiceMasterData[0]["TOTALAMOUNTINWORD"] == null ? null : einvoiceMasterData[0]["TOTALAMOUNTINWORD"].toString()));
		//read_priceU=Num2VNText(einvoiceMasterData[0]["TOTALAMOUNTINWORD"].toString(), "USD");
		
		//END-this part re-format amt.

		//this part set the master data to each cell. that 100% base on template.

		let dateString = `Ngày (Date) ${einvoiceMasterData[0]["INVOICEISSUEDDATE_DD"]}   tháng (month)  ${einvoiceMasterData[0]["INVOICEISSUEDDATE_MM"]}  năm (year) ${einvoiceMasterData[0]["INVOICEISSUEDDATE_YYYY"]}`
		let footerStr = '(In tại phần mềm Genuwin E-INVOICE của CÔNG TY CỔ PHẦN WEBCASH GENUWIN - MST: 1201496252)'
		if (einvoiceDetailData && einvoiceDetailData.length > 0) {
			masterDataArray.forEach(e => {
				if (e.Type == 1) {
					let infoData = ""
					e.Info.forEach(_e => {
						if (einvoiceMasterData[0][`${_e}`] != null || einvoiceMasterData[0][`${_e}`] != undefined) {
							infoData = infoData + einvoiceMasterData[0][`${_e}`];
						} else {
							infoData = infoData + " "
						}

					});
					exceljs.getCellByAddress(that, `${e.Cell}`).value = infoData;
				} else
					if (e.Type == 2) {
						switch (e.Info[0]) {
							case "dateString":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = dateString != null ? dateString : '';
								//console.log(e.Cell+"+"+e.Info[0])
								break;
							case "page":
								if (v_countNumberOfPages <= 1) { exceljs.getCellByAddress(that, `${e.Cell}`).value = ``; }
								//console.log(e.Cell+"+"+e.Info[0])
								break;
							case "lb_amount_trans":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = lb_amount_trans != null ? lb_amount_trans : '';
								//console.log(e.Cell+"+"+e.Info)
								break;
							case "amount_net":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = amount_net != null ? amount_net : '';
								//console.log(e.Cell+"+"+e.Info)
								break;
							case "amount_trans":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = amount_trans != null ? amount_trans : '';
								//console.log(e.Cell+"+"+e.Info)
								break;
							case "amount_vat":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = amount_vat != null ? amount_vat : '';
								//.log(e.Cell+"+"+e.Info)
								break;
							case "amount_total":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = amount_total != null ? amount_total : '';
								//console.log(e.Cell+"+"+e.Info)
								break;
							case "read_price":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = read_price != null ? read_price : '';
								//console.log(e.Cell+"+"+e.Info)
								break;
							// case "read_priceV":
							// 	exceljs.getCellByAddress(that, `${e.Cell}`).value = read_priceV != null ? read_priceV.substr(0, 2) + read_priceV.substr(2, read_priceV.length - 2).toLowerCase() + '.' : '';
							// 	//console.log(e.Cell+"+"+e.Info)
							// 	break;
							// case "read_priceU":
							// 	exceljs.getCellByAddress(that, `${e.Cell}`).value = read_priceU != null ? read_priceU.substr(0, 2) + read_priceU.substr(2, read_priceU.length - 2).toLowerCase() + '.' : '';
							// 	//console.log(e.Cell+"+"+e.Info)
							// 	break;
							case "convert":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = convertStr != null ? convertStr : '';
								//console.log(e.Cell+"+"+e.Info)
								break;
							case "footer":
								exceljs.getCellByAddress(that, `${e.Cell}`).value = footerStr != null ? footerStr : '';
								//console.log(e.Cell+"+"+e.Info)
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

		if (v_countNumberOfPages > 1) {
			for (let j = 0; j < page.length; j++) {
				let lastPagelength = 0
				let pageRowCount = 0
				for (let i = 0; i < page[j]; i++) {
					let item_length = countlength_v2(einvoiceDetailData[countPerPage]["ITEM_NAME"])
					if (page[j] > 0 && page[j + 1] == 0) {
						lastPagelength += item_length
					}
					totalRows += item_length
					pageRowCount += item_length
					countPerPage++

				}



				if (page[j] > 0 && page[j + 1] == 0) {
					totalRows = totalRows + (pos_lv - lastPagelength)
					extendedRows = pos_lv - lastPagelength
					totalRows += headerRowCount
					break
				} else {
					//console.log("page[j]+",page[j])
					if (j > 0) { totalRows += headerRowCount }

				}
				totalRows += pos_lv - pageRowCount
			}
		} else {
			for (let j = 0; j < page.length; j++) {
				let lastPagelength = 0
				for (let i = 0; i < page[j]; i++) {
					let item_length = countlength_v2(einvoiceDetailData[countPerPage]["ITEM_NAME"])
					if (page[j] > 0 && page[j + 1] == 0) {
						lastPagelength += item_length
					}
					totalRows += item_length
					countPerPage++

				}
				if (page[j] > 0 && page[j + 1] == 0) {
					//console.log("page[j]",page[j])
					//console.log("lastPagelength",lastPagelength)
					totalRows = totalRows + (10 - lastPagelength)
					extendedRows = 10 - lastPagelength
					break
				}
			}
		}
		//END-this part calculate the total row needed for the einvoice.

		//this part coppy merge information of the page before add more row.
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
		//console.log(lstMerge)
		// //ADDING rows
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
		//END-this part coppy merge information of the page before add more row.

		//this part insert range header for each page
		//"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
		//"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
		if (v_countNumberOfPages > 1) {
			for (let j = 0; j < page.length; j++) {
				const e = parseInt(page[j])
				let countCheck = 0
				if (e > 0) {
					for (let i = 0; i < e; i++) {
						const _e = einvoiceDetailData[i + count];

						try {
							let item_name_lt = countlength_v2(_e["ITEM_NAME"])
							totalRowCount += item_name_lt
							countCheck += item_name_lt
							//console.log(totalRowCount + "+" + item_name_lt)
						} catch (error) {
							console.log("err", error)
							console.log(_sourceRow)
							console.log(totalRowCount)
						}
					}


					let _count_ = 0

					if (j == 0) {
						_sourceRow = _sourceRow - 1

						if (pos_lv - totalRowCount > 0) {
							let tmpObj = { loop_row: (pos_lv - totalRowCount), loopStartRow: totalRowCount + _sourceRow + 1 }
							extendedArray.push(tmpObj)
						}

						_count_ = totalRowCount + _sourceRow + (pos_lv - totalRowCount)
						totalRowCount += (pos_lv - totalRowCount)

						worksheet.getRow(totalRowCount + _sourceRow + (pos_lv - totalRowCount)).addPageBreak();
						logoArray.push({ logoPos: totalRowCount + _sourceRow + (pos_lv - totalRowCount), logos: logos })

					} else {
						let leftCount = 0

						if (page[j + 1] != 0) {
							leftCount = pos_lv - countCheck
							worksheet.getRow(totalRowCount + _sourceRow + leftCount).addPageBreak();

							if (leftCount > 0) {
								let tmpObj = { loop_row: leftCount, loopStartRow: totalRowCount + _sourceRow + 1 }
								extendedArray.push(tmpObj)
							}


							logoArray.push({ logoPos: totalRowCount + _sourceRow + leftCount, logos: logos })

						} else {
							for (let index = 1; index <= pos_lv - pos; index++) {
								worksheet.getRow(totalRowCount + _sourceRow + leftCount + index).hidden = true
							}

						}
						if (leftCount > 0) {
							totalRowCount += leftCount
						}

					}
					let data = []
					for (let _u = 0; _u < v_countNumberOfPages; _u++) {

						if (_u == 0) {
							data.push({ PAGE: "Trang " + (_u + 1) })
						} else {
							data.push({ PAGE: "Trang tiếp theo trang trước- Trang " + (_u + 1) })
						}


					}


					let _startRow = 1; let _startcol = 1;
					let _endRow = _count_; let _endcol = detailCellFormat[detailCellFormat.length - 1].endCell + 3;
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

					for (let idx = 0; idx < data.length - 1; idx++) {
						_lstMerge.forEach(q => {
							const startMergeCell = q["range"].split(':').shift();
							const endMergeCell = q["range"].split(':').pop();


							let c1 = (startMergeCell.match(that.regexCell))[1] + (q.row1 + (_rowCount * (1 + idx)));
							let c2 = (endMergeCell.match(that.regexCell))[1] + (q.row2 + (_rowCount * (1 + idx)));
							_lstNewMerge.push({ row1: q.row1 + (_rowCount * (1 + idx)), col1: q.col1, row2: q.row2 + (_rowCount * (1 + idx)), col2: q.col2, range: `${c1}:${c2}` });
						});

					}
					exceljs.insertRange2(that, `A1:AF${_count_}`, data, true, false);
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
					//	console.log(_lstNewMerge)
					_sourceRow += headerRowCount
					count += e
				} else break;

			}



			for (let j = 0; j < page.length; j++) {
				const e = parseInt(page[j])
				let countCheck_2 = 0
				//"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
				//"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
				if (e > 0) {
					for (let i = 0; i < e; i++) {
						const _e = einvoiceDetailData[i + count_2];

						try {
							let item_name_lt = countlength_v2(_e["ITEM_NAME"])

							let longRow = _e["ITEM_NAME"].split('&#xA;')


							for (let itl = 0; itl < item_name_lt; itl++) {

								const _item_name = longRow[itl];
								addValueToCellsWithItemName(that, exceljs, itl + _sourceRow_2 + totalRowCount_2, _e, _item_name, detailCellFormat, excCols)

							}

							if (item_name_lt == 1) {
								detailCellFormat.forEach((e, i) => {
									worksheet.mergeCells(_sourceRow_2 + totalRowCount_2, e.startCell, _sourceRow_2 + totalRowCount_2, e.endCell)
									
									exceljs.getCellByAddress(that, `${excCols[e.startCell] + (_sourceRow_2 + totalRowCount_2)}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: 'thin' }, };
								});
								exceljs.getCellByAddress(that, `${lastCell +  (_sourceRow_2 + totalRowCount_2)}`).style.border = { right: { style: 'thin' },bottom: { style: detailCellFormat[0].cellBorder }  };
								//exceljs.getCellByAddress(that, `${nmCell + (_sourceRow_2 + totalRowCount_2 + item_name_lt)}`).style.border = { bottom: { style: detailCellFormat[0].cellBorder }, };
								//	==exceljs.getCellByAddress(that, `${sttCell + (_sourceRow_2 + totalRowCount_2 + item_name_lt)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder }, top: { style: 'thin' } };
							} else {
								worksheet.mergeCells(_sourceRow_2 + totalRowCount_2, detailCellFormat[0].startCell, _sourceRow_2 + totalRowCount_2 + item_name_lt - 1, detailCellFormat[0].endCell)
								for (let itl = 0; itl < item_name_lt; itl++) {
									detailCellFormat.forEach(e => {
										if (e.cellType == 3) {
											worksheet.mergeCells(_sourceRow_2 + totalRowCount_2 + itl, e.startCell, _sourceRow_2 + totalRowCount_2 + itl, e.endCell)
											exceljs.getCellByAddress(that, `${excCols[e.startCell] + (_sourceRow_2 + totalRowCount_2 + itl)}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: 'thin' }, };
										}
									});
									exceljs.getCellByAddress(that, `${lastCell + (_sourceRow_2 + totalRowCount_2 + itl)}`).style.border = { right: { style: 'thin' } };
									exceljs.getCellByAddress(that, `${nmCell + (_sourceRow_2 + totalRowCount_2 + itl)}`).style.border = { left: { style: 'thin' } };
								}
								detailCellFormat.forEach(e => {
									if (e.cellType == 1) {
										worksheet.mergeCells(_sourceRow_2 + totalRowCount_2, e.startCell, _sourceRow_2 + totalRowCount_2 + item_name_lt - 1, e.endCell)
										exceljs.getCellByAddress(that, `${excCols[e.startCell] + (_sourceRow_2 + totalRowCount_2)}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: 'thin' }, };
										//console.log(e.startCell+"+"+e.endCell)
									} else {
										//worksheet.mergeCells(_sourceRow_2 + totalRowCount_2, e.startCell, _sourceRow_2 + totalRowCount_2, e.endCell)
									}

								});
								exceljs.getCellByAddress(that, `${nmCell + (_sourceRow_2 + totalRowCount_2 + item_name_lt - 1)}`).style.border = { bottom: { style: detailCellFormat[0].cellBorder }, };
								exceljs.getCellByAddress(that, `${sttCell + (_sourceRow_2 + totalRowCount_2 + item_name_lt - 1)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder } };

							}

							totalRowCount_2 += item_name_lt
							countCheck_2 += item_name_lt

						} catch (error) {
							console.log("err", error)
							//console.log(_sourceRow_2)
							//console.log(totalRowCount)

						}
					}
					if (j == 0) {
						totalRowCount_2 += (pos_lv - totalRowCount_2)
						if (cancelYn == "Y") {
							try {
								worksheet.addImage(exceljs.insertImage(that, cancelImageByteArray), {
									tl: { col: startMergeRedundantRow, row: _sourceRow_2 - 10 },
									ext: { width: 705, height: 700 }
								});
							} catch (error) {
								console.log(error)
							}

						}
						if (bgPath != "") {
							try {
								worksheet.addImage(exceljs.insertImage(that, bgIconByteArray), {
									tl: { col: backgroundCell, row: _sourceRow_2 - 1 },
									ext: { width: backgroundWidth + 100, height: backgroundHeight + 200 }
								});

							} catch (error) {
								console.log(error)
							}
						}

					} else {


						let leftCount = pos_lv - countCheck_2
						if (leftCount > 0) {
							totalRowCount_2 += leftCount
						}
						if (cancelYn == "Y") {
							if (j == v_countNumberOfPages - 1) {
								try {
									worksheet.addImage(exceljs.insertImage(that, cancelImageByteArray), {
										tl: { col: startMergeRedundantRow, row: _sourceRow_2 + totalRowCount_2 - pos_lv - 10 },
										ext: { width: 705, height: 500 }
									});
								} catch (error) {
									console.log(error)
								}
							} else {
								try {
									worksheet.addImage(exceljs.insertImage(that, cancelImageByteArray), {
										tl: { col: startMergeRedundantRow, row: _sourceRow_2 + totalRowCount_2 - pos_lv - 10 },
										ext: { width: 705, height: 700 }
									});
								} catch (error) {
									console.log(error)
								}
							}
						}

						if (bgPath != "") {
							if (j == v_countNumberOfPages - 1) {
								try {
									worksheet.addImage(exceljs.insertImage(that, bgIconByteArray), {
										tl: { col: backgroundCell, row: _sourceRow_2 + totalRowCount_2 - pos_lv - 1 },
										ext: { width: backgroundWidth, height: backgroundHeight }
									});

								} catch (error) {
									console.log(error)
								}
							} else {
								try {
									worksheet.addImage(exceljs.insertImage(that, bgIconByteArray), {
										tl: { col: backgroundCell, row: _sourceRow_2 + totalRowCount_2 - pos_lv - 1 },
										ext: { width: backgroundWidth + 100, height: backgroundHeight + 200 }
									});

								} catch (error) {
									console.log(error)
								}
							}


						}

					}

					_sourceRow_2 += headerRowCount
					count_2 += e
				} else break;

			}

		} else {
			for (let j = 0; j < page.length; j++) {
				const e = parseInt(page[j])
				//"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
				//"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
				if (e > 0) {
					for (let i = 0; i < e; i++) {
						const _e = einvoiceDetailData[i + count];

						try {
							let item_name_lt = countlength_v2(_e["ITEM_NAME"])

							let longRow = _e["ITEM_NAME"].split('&#xA;')
							for (let itl = 0; itl < item_name_lt; itl++) {

								const _item_name = longRow[itl];
								addValueToCellsWithItemName(that, exceljs, itl + _sourceRow + totalRowCount, _e, _item_name, detailCellFormat, excCols)
							}



							if (item_name_lt == 1) {
								detailCellFormat.forEach((e, i) => {
									worksheet.mergeCells(_sourceRow + totalRowCount, e.startCell, _sourceRow + totalRowCount, e.endCell)
									
									exceljs.getCellByAddress(that, `${excCols[e.startCell] + (_sourceRow + totalRowCount)}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: 'thin' }};
								});
								exceljs.getCellByAddress(that, `${lastCell +  (_sourceRow + totalRowCount)}`).style.border = { right: { style: 'thin' },bottom: { style: detailCellFormat[0].cellBorder }  };
								exceljs.getCellByAddress(that, `${nmCell + (_sourceRow + totalRowCount + item_name_lt)}`).style.border = { bottom: { style: detailCellFormat[0].cellBorder }, };
								exceljs.getCellByAddress(that, `${sttCell + (_sourceRow + totalRowCount + item_name_lt)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder } };
							} else {
								detailCellFormat.forEach((e, i) => {
									if (e.cellType == 1 || e.cellType == 2) {
										worksheet.mergeCells(_sourceRow + totalRowCount, e.startCell, _sourceRow + totalRowCount + item_name_lt - 1, e.endCell)
										//console.log("_sourceRow+totalRowCount e.startCell _sourceRow+totalRowCount+item_name_lt-1, e.endCell",_sourceRow+totalRowCount+"+--+"+e.startCell+"+--+"+_sourceRow+totalRowCount+item_name_lt-1+"+--+"+e.endCell)
										
										exceljs.getCellByAddress(that, `${excCols[e.startCell] + (_sourceRow + totalRowCount)}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: 'thin' }, right: { style: 'thin' } };
									} else {
										worksheet.mergeCells(_sourceRow + totalRowCount, e.startCell, _sourceRow + totalRowCount, e.endCell)
										exceljs.getCellByAddress(that, `${excCols[e.startCell] + (_sourceRow + totalRowCount)}`).style.border = { bottom: { style: detailCellFormat[i].cellBorder }, left: { style: 'thin' }, };
									}
										exceljs.getCellByAddress(that, `${lastCell + (_sourceRow + totalRowCount)}`).style.border = { right: { style: 'thin' },bottom: { style: detailCellFormat[0].cellBorder }  };
								});

								for (let u = 0; u < item_name_lt; u++) {
									//exceljs.getCellByAddress(that,`${nmCell+(_sourceRow+totalRowCount+u}`).style.border = {left: {style:'thin'}};
									//console.log(`${nmCell+(_sourceRow+totalRowCount+u)}`)
								}

								exceljs.getCellByAddress(that, `${nmCell + (_sourceRow + totalRowCount + item_name_lt - 1)}`).style.border = { bottom: { style: detailCellFormat[0].cellBorder }, };
								exceljs.getCellByAddress(that, `${sttCell + (_sourceRow + totalRowCount + item_name_lt - 1)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder }, top: { style: 'thin' } };

							}
							totalRowCount += item_name_lt
							if (cancelYn == "Y") {
								try {
									worksheet.addImage(exceljs.insertImage(that, cancelImageByteArray), {
										tl: { col: startMergeRedundantRow, row: _sourceRow_2 - 10 },
										ext: { width: 705, height: 500 }
									});
								} catch (error) {
									console.log(error)
								}

							}
							if (bgPath != "") {
								try {
									worksheet.addImage(exceljs.insertImage(that, bgIconByteArray), {
										tl: { col: backgroundCell, row: _sourceRow_2 - 1 },
										ext: { width: backgroundWidth, height: backgroundHeight }
									});
								} catch (error) {
									console.log(error)
								}
							}
						} catch (error) {
							console.log("err", error)
							console.log(_sourceRow)
							console.log(totalRowCount)

						}

					}

					count += e
				} else break;

			}
		}


		//END-this part insert range header for each page


		//this part add more style to the rows that missing(optional) Last Page.
		//"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
		//"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
		//	exceljs.getCellByAddress(that,`${excCols[e.startCell]+( _sourceRow_2 + totalRowCount_2)}`).style.border = {bottom: {style:detailCellFormat[i].cellBorder},left: { style: 'thin' }, };
		if (v_countNumberOfPages > 1) {
			for (let o = 1; o < extendedRows; o++) {
				try {
					detailCellFormat.forEach((e, i) => {
						worksheet.mergeCells(totalRows + _sourceRow_3 - o, e.startCell, totalRows + _sourceRow_3 - o, e.endCell)
						exceljs.getCellByAddress(that, `${excCols[e.startCell] + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: 'thin' }, bottom: { style: detailCellFormat[i].cellBorder }, };
						
					});
					worksheet.getRow(totalRows + _sourceRow_3 - o).height = lastPageRowsHeight
					exceljs.getCellByAddress(that, `${lastCell + (totalRows + _sourceRow_3 - o)}`).style.border = { right: { style: 'thin' },bottom: { style: detailCellFormat[0].cellBorder }  };
					exceljs.getCellByAddress(that, `${sttCell + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder }, };
					exceljs.getCellByAddress(that, `${nmCell + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder }, };
				} catch (error) {
					console.log("error", error)
					console.log("error", totalRows + _sourceRow_3 - o)
				}
			}
		} else {
			for (let o = 1; o <= extendedRows; o++) {
				try {
					detailCellFormat.forEach((e, i) => {
						worksheet.mergeCells(totalRows + _sourceRow_3 - o, e.startCell, totalRows + _sourceRow_3 - o, e.endCell)
						exceljs.getCellByAddress(that, `${excCols[e.startCell] + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: 'thin' }, bottom: { style: detailCellFormat[i].cellBorder }, };
					});
					worksheet.getRow(totalRows + _sourceRow_3 - o).height = lastPageRowsHeight
					exceljs.getCellByAddress(that, `${lastCell + (totalRows + _sourceRow_3 - o)}`).style.border = { right: { style: 'thin' },bottom: { style: detailCellFormat[0].cellBorder }  };
					exceljs.getCellByAddress(that, `${sttCell + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder }, };
					exceljs.getCellByAddress(that, `${nmCell + (totalRows + _sourceRow_3 - o)}`).style.border = { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: detailCellFormat[0].cellBorder }, };
				} catch (error) {
					console.log("error", totalRows + _sourceRow_3 - o)
				}
			}
		}

		//END-this part add more style to the rows that missing(optional) Last Page.

		//this part add more style to the rows that missing(optional) Other pages.
		//"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
		//"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

		for (let o = 0; o < extendedArray.length; o++) {
			let rowItem = extendedArray[o]
			worksheet.mergeCells(rowItem.loopStartRow, startMergeRedundantRow, rowItem.loopStartRow + rowItem.loop_row - 1, endMergeRedundantRow)
			exceljs.getCellByAddress(that, `${sttCell + (rowItem.loopStartRow)}`).style.border = { left: { style: 'thin' }, bottom: { style: 'thin' } };
			for (let _omg = 0; _omg < rowItem.loop_row; _omg++) {
				try {
					exceljs.getCellByAddress(that, `${lastCell + (rowItem.loopStartRow + _omg)}`).style.border = { right: { style: 'thin' } };
				} catch (error) {
					console.log("error", rowItem.loopStartRow + _omg)
				}

			}

		}
		//END-this part add more style to the rows that missing(optional) Other pages.

		//this part insert logo for all the self gen header
		let promises = logos.map(async (e, i) => {
			let imgRow = e.logoStartCount
			let logoImage = await createFile(e.logoPath);
			let logoIconByteArray = await that.blobToArray(new Blob([logoImage], { type: 'application/octet-stream' }))

			try {
				worksheet.addImage(exceljs.insertImage(that, logoIconByteArray), {
					tl: { col: e.start, row: imgRow },
					ext: { width: e.width, height: e.height }
				});
			} catch (error) {
				console.log(error)
			}


		});
		await Promise.all(promises);
		// await Promise.all(promises);
		for (let imgIdx = 0; imgIdx < logoArray.length; imgIdx++) {
			const logosAray = logoArray[imgIdx].logos;
			let imgPos = logoArray[imgIdx].logoPos
			try {
				let promises = logosAray.map(async (e, i) => {
					let imgRow = imgPos + e.logoStartCount
					let logoImage = await createFile(e.logoPath);
					let logoIconByteArray = await that.blobToArray(new Blob([logoImage], { type: 'application/octet-stream' }))
					try {
						worksheet.addImage(exceljs.insertImage(that, logoIconByteArray), {
							tl: { col: e.start, row: imgRow },
							ext: { width: e.width, height: e.height }
						});
					} catch (error) {
						console.log(error)
					}


				});
				await Promise.all(promises);
			} catch (error) {
				console.log(error)
			}



			//exceljs.getCellByAddress(that, `B${imgRow}`).style.border = { top: { style: 'thin' } };//re-style the cell
		}

		//END-this part insert logo for all the self gen header

		//this part insert Signed image if the einvoice is signed.
		//"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
		//"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
		if (einvoiceMasterData[0]["SIGN_YN"] == "Y") {
			try {
				worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox))
				worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1))
				worksheet.unMergeCells(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2))
				try {
					worksheet.addImage(exceljs.insertImage(that, signIconByteArray), {
						tl: { col: signCell.start, row: totalRows + _sourceRow_3 + countFromEndDetailToSignBox - 1 },
						ext: { width: 100, height: 65 }
					});
				} catch (error) {
					console.log(error)
				}
				worksheet.mergeCells(totalRows + _sourceRow_3 + countFromEndDetailToSignBox, signByCell.start, totalRows + _sourceRow_3 + countFromEndDetailToSignBox, signByCell.end)//re-merge the cell to fill signed by, signed date
				worksheet.mergeCells(totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1, signByCell.start, totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1, signByCell.end)//re-merge the cell to fill signed by, signed date
				worksheet.mergeCells(totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2, signByCell.start, totalRows + _sourceRow_3 + + countFromEndDetailToSignBox + 2, signByCell.end)//re-merge the cell to fill signed by, signed date

			} catch (error) {
				console.log(error)
			}

		}
		//END-this part insert Signed image if the einvoice is signed.

		//this part add more style to missing part of the footer(optional).
		try {
			//console.log(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2))
			exceljs.getCellByAddress(that, `${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox)}`).style.border = { top: { style: 'thin' }, right: { style: 'thin' } };
			exceljs.getCellByAddress(that, `${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 1)}`).style.border = { right: { style: 'thin' } };
			exceljs.getCellByAddress(that, `${signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox + 2)}`).style.border = { bottom: { style: 'thin' }, right: { style: 'thin' } };

		} catch (error) {
			console.log(signBoxCell + (totalRows + _sourceRow_3 + countFromEndDetailToSignBox))
		}

		//END-this part add more style to missing part of the footer(optional).

		let convertResult = await exceljs.convertToPdfAndDownload(that, reportInfo.NAME)
		console.log(" convertResult" , convertResult);
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
		if (e.field == "ITEM_NAME") {
			exceljs.getCellByAddress(that, `${e.col + rownum}`).value = itemname;
		} else {
			exceljs.getCellByAddress(that, `${e.col + rownum}`).value = detaildata[e.field];
		}

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