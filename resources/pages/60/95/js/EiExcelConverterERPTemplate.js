
import { intToRGBA } from "jimp"
import moment from "moment"

let regexCell = /([a-zA-Z]+)(\d+)/;
let test = {

	ExcelBuilder: async (that, einvoiceMasterData, einvoicePk, reportPath, reportSheet) => {
		let reportInfo = { CODE: '01', NAME: einvoicePk, PATH: reportPath };//that is the report template path.
		console.log(einvoiceMasterData)
		// console.log(einvoiceDetailData)
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
		

		//END-this part add more style to missing part of the footer(optional).

		   let convertResult = await exceljs.convertToPdfAndDownload(that, reportInfo.NAME)
		// console.log("convertResult  ", convertResult);
	      return convertResult.data
		   console.log("reportInfo.NAME " , reportInfo.NAME);
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
	if(s  == "" || s == null)
	{
		result = 1;
	}else
	{
		let a = s.split('&#xA;')
		result = a.length;
		if (result == 0) {
			result = 1;
		}
	}
	

	return result;
}
export default test; 