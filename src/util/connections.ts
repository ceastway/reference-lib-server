import { DataSource } from 'typeorm';
import { PrimaryDataSource } from "../data-sources";

export const ConnToPrimaryDataSource = async():Promise<DataSource | undefined> => {

    const dataSourceConn = PrimaryDataSource;

    try{
        await dataSourceConn.initialize();
        console.log("Data Source has been initialized!");
        return dataSourceConn;
    }catch(err){
        console.error("Error during Data Source initialization", err);
        return undefined;
    }
}