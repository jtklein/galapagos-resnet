const XLSX = require("xlsx");
const fs = require("fs");

const inputFilename = "./network_data/additional/NETWORK_DATA.xlsx";

const exportSheets = ['projects', 'orgs_info', 'species_info', 'plans_info'];

const workBook = XLSX.readFile(inputFilename);
exportSheets.forEach(sheet => {
    let sheetData = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
    sheetData = JSON.stringify(sheetData, null, 2);
    fs.writeFileSync(`./network_data/additional/${sheet}.json`, sheetData);
})
