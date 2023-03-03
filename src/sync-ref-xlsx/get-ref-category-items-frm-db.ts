// import { RefItem } from 'src/entities/RefItem';
import { PrimaryDataSource } from "../data-sources";

//TODO: Ask Dustin why I cannot type this ...>
export async function getRefCategoryItemsFromDb(catId: number): Promise<any>{

  const catRefItems = await PrimaryDataSource
  .getRepository('RefItem')
  .find({
    where: {
      cat: catId
    }
  });

  // callbackFunction(catRefItems);

  // console.log({catRefItems});
  return catRefItems;

}