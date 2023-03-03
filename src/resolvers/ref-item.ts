import { RefItem } from "../entities/RefItem";
import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx, ObjectType, UseMiddleware } from "type-graphql"; //, FieldResolver 
import { MyContext } from "src/types";
import { FieldError } from "./common"
import { isAuth } from "../middleware/isAuth";
import { PrimaryDataSource } from "../data-sources";

// console.log(FieldResolver);

PrimaryDataSource.initialize();

/*
You must be running 'yarn watch' for these changes to take effect
*/

@InputType()
class RefItemInput {
    @Field()
    name: string
    @Field()
    cat: number
    @Field()
    exampleString: string
}

// ## ObjectTypes are returned from mutations
@ObjectType()
class RefItemResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => RefItem, {nullable: true})
    refItem?: RefItem;
}

@Resolver(RefItem)

export class RefItemResolver {
    @Query(() => [RefItem])
    refItems(
        ///@Arg('orderBy') orderBy: string,
        @Arg('cat') cat: number,
        @Arg('limit', () => Int) limit: number,
        ///@Arg('refItemNameWhere', () => String) refItemNameWhere: string
        // @Arg('cursor', () => Int, { nullable: true }) cursor: number | null
    ): Promise<RefItem[]> {

        //.where("refItem.RefItemName = :RefItemName", {RefItemName: refItemNameWhere})
        /*
        ,
		RefItemName
        */
        return PrimaryDataSource
                .getRepository(RefItem)
                .createQueryBuilder("reference_items") //refItem
                .where("cat = :refItemCatWhere", {refItemCatWhere: cat})
                ///.orderBy(orderBy, "ASC")
                .take(limit)
                .getMany();
    }

    @Query(() => RefItem, { nullable: true })
    refItem(@Arg('refItemId', () => Int) refItemId: number): Promise<RefItem | null> {

        return RefItem.findOneBy({id: refItemId});
    }

    @Mutation(() => RefItemResponse)
    @UseMiddleware(isAuth)
    async createRefItem(
        // @Arg('title', () => String) title: string
        @Arg('options') options: RefItemInput,
        @Ctx() { req }: MyContext
        ): Promise<RefItemResponse> {

        //2 sql queries
        const savedRefItem = await RefItem.create({
            ...options,
            creatorId: req.session.userId,
        }).save();

        return { errors: undefined, refItem: savedRefItem }
    }

    @Mutation(() => RefItem)
    async updateRefItem(
        @Arg('id', () => Int) id: number,
        @Arg('name', () => String, {nullable: true}) name: string
        ): Promise<RefItem | null> {
        const refItem = await RefItem.findOne({where: {id: id}});

        if (!refItem){
            return null;
        }

        if (typeof name !== "undefined"){
            await RefItem.update({id}, { name })
        }

        return refItem;
        
    }

    @Mutation(() => Boolean)
    async deleteRefItem(
        @Arg('id', () => Int) id: number
        ): Promise<boolean> {

        try{
            RefItem.delete(id);
            return true;
        } catch {
            return false;
        }
        
    }
}