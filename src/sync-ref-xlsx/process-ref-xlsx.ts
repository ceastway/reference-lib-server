//npx ts-node src/sync-ref-xlsx/process-ref-xlsx.ts
//TODO: Dusting
//yarn npx-import (why can I run this from normal terminal, but not vscode terminal)

import Excel from 'exceljs';
import { getRefCategoryItemsFromDb } from './get-ref-category-items-frm-db';
import { getRefCategoryItemsFromExcel } from './get-ref-category-items-from-xls';
import { processRefCategory } from './process-ref-category';
import { PrimaryDataSource } from "../data-sources";


// const [categoryRefItems] = async() => {
//   return await getRefCategoryItems(3);
// };
// console.log(getRefCategoryItems(3));

const excelFilePath = "/Users/chris/Documents/referenceLibrary/references-TOC-import.xlsx";

async function processRefCats(){
  
  await PrimaryDataSource.initialize();

  const numberOfCats = 150; //150
  const numberOfItemRows = 150; //150
  
  const wb = new Excel.Workbook();
  await wb.xlsx.readFile(excelFilePath);

  const tocWs = wb.getWorksheet('TOC');

  for (let tocRowIndex = 3; tocRowIndex < (numberOfCats+3); tocRowIndex++) {
    let catSheetName = tocWs.getCell(tocRowIndex, 3).value;
    let catSheetId = tocWs.getCell(tocRowIndex, 4).value;
    let catWs = wb.getWorksheet(catSheetName as string);
    let catId = catSheetId as number;

    if(catSheetName){
      console.log({catId});
      console.log({catSheetName});
    }

    if(catId){
      console.log("process: ", catId);
      const refCategoryItemsExcel = await getRefCategoryItemsFromExcel(catWs, numberOfItemRows);
      const refCategoryItemsDb = await getRefCategoryItemsFromDb(catSheetId as number);

      // await console.log("refCategoryItemsDb", refCategoryItemsDb);

      await processRefCategory(catId, refCategoryItemsExcel, refCategoryItemsDb);
    }
    
  }

  // function callbackFunction(refCategoryItemsDb:any){
  //   console.log('callbackFunction', refCategoryItemsDb);
  // }

  
  // console.log(v1);
  // newworksheet.columns = [
  // {header: 'Id', key: 'id', width: 10},
  // {header: 'Name', key: 'name', width: 32}, 
  // {header: 'D.O.B.', key: 'dob', width: 15,}
  // ];
}

processRefCats();

// // File path.
// readXlsxFile(excelFilePath).then((rows:{i: number, j: number}) => {
//   // console.log(rows);

//   for (i in rows) {
//     for (j in rows[i]) {
//       console.log(rows[i][j])
//     }
//   }

//   // `rows` is an array of rows
//   // each row being an array of cells.


//   // rows === [{
//   //   date: new Date(2018, 2, 24),
//   //   numberOfStudents: 10,
//   //   course: {
//   //     isFree: true,
//   //     title: 'Chemistry'
//   //   },
//   //   contact: '+11234567890',
//   //   status: 'SCHEDULED'
//   // }]


// })()

/*
// Readable Stream.
readXlsxFile(fs.createReadStream(excelFilePath)).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
})

// Buffer.
readXlsxFile(Buffer.from(fs.readFileSync(excelFilePath))).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
})
*/
