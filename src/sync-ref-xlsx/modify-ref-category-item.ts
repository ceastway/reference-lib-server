// import { RefItem } from 'src/entities/RefItem';
import { PrimaryDataSource } from "../data-sources";

//TODO: Ask Dustin why I cannot type this as: Promise<RefItem | null>
export async function addRefCategoryItem(refItem: any): Promise<any>{

  await PrimaryDataSource
    .getRepository('RefItem')
    .insert({
      ...refItem
    });
}

export async function updateRefCategoryItem(id: number, refItem: any): Promise<any>{

  await PrimaryDataSource
    .getRepository('RefItem')
    .update({id}, {...refItem });
}