import { addRefCategoryItem, updateRefCategoryItem } from './modify-ref-category-item';

export function processRefCategory(catId:number, refCategoryItemsExcel:any, refCategoryItemsDb:any){
  
  // console.log({refCategoryItemsDb});
  
  //create a set from the db items
  const refCategoryItemsDbSet = new Set();
  const refCategoryItemsDbArr = new Array(); //TODO: set size?
  const refCategoryItemsDbIdMap = new Map();

  // create a db array
  refCategoryItemsDb.forEach((dbItem:any) => {
    refCategoryItemsDbSet.add(dbItem.order);
    refCategoryItemsDbIdMap.set(dbItem.order, dbItem.id);
    refCategoryItemsDbArr[dbItem.order] = 
    JSON.stringify({
      orderId: dbItem.order,
      name: dbItem.name,
      exampleString: dbItem.exampleString,
      result: dbItem.result ? dbItem.result : '',
      result2: dbItem.result2,
      result2Label: dbItem.result2Label,
      creatorId: 1
    });
  });

  // console.log({refCategoryItemsDbArr});

  // loop through the excel items
  refCategoryItemsExcel.forEach((excelItem:any)=>{
    // console.log("excelItem", excelItem);
    // console.log("excelItem.orderId", excelItem.orderId);

    if(refCategoryItemsDbSet.has(excelItem.orderId)){
      // console.log("found");
      /*
      compare this item to the excel item
      if(excel Item != db Item, update db Item)
      */
      if(excelItem.result === null){excelItem.result = '';}

      if(JSON.stringify(excelItem)!==refCategoryItemsDbArr[excelItem.orderId]){
        //update this item
        console.log("====they do not match=====");

        let dbItemCompare = JSON.parse(refCategoryItemsDbArr[excelItem.orderId]);

        Object.keys(dbItemCompare).map((key)=>{
          if(dbItemCompare[key] !== excelItem[key]){
            console.log(`out of sync - ${key} :`);
            console.log('Item: ', dbItemCompare['name']);
            console.log('ItemId: ', refCategoryItemsDbIdMap.get(excelItem.orderId));
            console.log('   db: ', dbItemCompare[key]);
            console.log('excel: ', excelItem[key]);
          }
        })
        delete excelItem.orderId;
        updateRefCategoryItem(refCategoryItemsDbIdMap.get(excelItem.order), excelItem);
      }
    }else{
      //add this item
      if(excelItem.orderId && excelItem.orderId !== 'Array'){
        excelItem.cat = catId;
        excelItem.order = excelItem['orderId'];
        console.log("add::", excelItem);
        addRefCategoryItem(excelItem);
      }
      
    }

  });

}