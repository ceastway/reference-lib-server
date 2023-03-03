export async function getRefCategoryItemsFromExcel(catWs: any, numberOfItemRows: any){

  // TODO: const catItemsExcelArr = new Array(numberOfItemRows-1);
  const catItemsExcelArr = [];

  for (let catRowIndex = 2; catRowIndex < numberOfItemRows; catRowIndex++) {
      let catId = catWs.getCell(catRowIndex, 1).value;

      if(catId){
        // TODO: change to the specific index
        catItemsExcelArr.push({
          orderId: catWs.getCell(catRowIndex, 2).value,
          name: catWs.getCell(catRowIndex, 3).value ? catWs.getCell(catRowIndex, 3).value : '',
          exampleString: catWs.getCell(catRowIndex, 4).value ? catWs.getCell(catRowIndex, 4).value : '',
          result: catWs.getCell(catRowIndex, 5).value ? catWs.getCell(catRowIndex, 5).value.toString() : '',
          result2: catWs.getCell(catRowIndex, 6).value,
          result2Label: catWs.getCell(catRowIndex, 7).value,
          creatorId: 1,
        });
      }
    }
  return catItemsExcelArr;
}