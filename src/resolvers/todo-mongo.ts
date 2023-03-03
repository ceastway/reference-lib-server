/*
https://github.com/typeorm/typeorm/blob/master/docs/mongodb.md

I could not get this to work. It would only pull empty queries.

MongoDB support is very limited for typeorm at this point. I recomend that we stick with MySQL for now.
*/

import { Todo } from "../entities-mongo/todo";
import { Resolver, Query, FieldResolver } from "type-graphql"; //Arg, Int
import { MongoDataSource } from "../data-sources";

console.log(FieldResolver);

MongoDataSource.initialize();

// const manager = getMongoManager();

@Resolver(Todo)

export class TodoResolver {

    @Query(() => [Todo])
    todos(
        ///@Arg('orderBy') orderBy: string,
        ///@Arg('limit', () => Int) limit: number,
        ///@Arg('todoNameWhere', () => String) todoNameWhere: string
    ): Promise<Todo[]> {

            //const DataSet = MongoDataSource.getMongoRepository(Todo);
            // const Manager = MongoDataSource.manager;

            // const timber = MongoDataSource.manager.

            /*
            const todos = MongoDataSource.manager.find(Todo, {
                where: {
                    id: 1
                    //title: "Test todo1"
                }
                
            }); //.orderBy(orderBy, "ASC");
            */

            const todos = MongoDataSource.manager.getMongoRepository(Todo).findBy({
                where: {
                    id: {$eq: 1}
                    //title: "Test todo1"
                }
            })

            return todos;
    }
}