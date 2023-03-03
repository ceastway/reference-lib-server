// import { RefItem } from 'src/entities/RefItem';
import { PrimaryDataSource } from "../data-sources";

//TODO: Ask Dustin why I cannot type this as: Promise<RefItem | null>
export async function getRefCategoryItem(): Promise<any>{
  await PrimaryDataSource.initialize();

  const refItem = await PrimaryDataSource
  .getRepository('RefItem')
  .findOneBy({id: 25});

  return refItem;
}