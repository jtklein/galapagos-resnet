const XLSX = require("xlsx");
const fs = require("fs");

const inputFilename = "./network_data/PROJECT_NETWORK.xlsx";

const exportSheets = ['MAIN', 'ORGS FULL', 'SPECIES FULL'];

const workBook = XLSX.readFile(inputFilename);
exportSheets.forEach(sheet => {
    let sheetData = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
    sheetData = JSON.stringify(sheetData, null, 2);
    fs.writeFileSync(`./network_data/additional/${sheet}.json`, sheetData);
})
