const ExcelJS = use('exceljs');
const Helpers = use("Helpers");

class RenderJsonToExcelFile {
    constructor(){

    }

  async createFille() {
       const file_name = Helpers.tmpPath('test01.xlsx')
        const workbook = new ExcelJS.Workbook();
        workbook.addWorksheet('Sheet1');
        return await workbook.xlsx.writeFile(file_name);
    }
}

module.exports = RenderJsonToExcelFile