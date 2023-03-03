import { RefCategory } from "../entities/RefCategory";
import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx, ObjectType, UseMiddleware, FieldResolver } from "type-graphql";
import { MyContext } from "src/types";
import { FieldError } from "./common"
import { isAuth } from "../middleware/isAuth";
import { PrimaryDataSource } from "../data-sources";

console.log(FieldResolver);

PrimaryDataSource.initialize();

/*
You must be running 'yarn watch' for these changes to take effect
*/

@InputType()
class RefCategoryInput {
    @Field()
    name: string
    @Field()
    todo: number
}

// ## ObjectTypes are returned from mutations
@ObjectType()
class RefCategoryResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => RefCategory, {nullable: true})
    refCategory?: RefCategory;
}

@Resolver(RefCategory)

export class RefCategoryResolver {
    @Query(() => [RefCategory])
    refCategorys(
        ///@Arg('orderBy') orderBy: string,
        @Arg('limit', () => Int) limit: number,
        ///@Arg('refCategoryNameWhere', () => String) refCategoryNameWhere: string
        // @Arg('cursor', () => Int, { nullable: true }) cursor: number | null
    ): Promise<RefCategory[]> {

        //.where("refCategory.RefCategoryName = :RefCategoryName", {RefCategoryName: refCategoryNameWhere})
        /*
        ,
		RefCategoryName
        */
        return PrimaryDataSource
                .getRepository(RefCategory)
                .createQueryBuilder("reference_categories") //refCategory
                ///.where("refCategory.name LIKE :refCategoryNameWhere", {refCategoryNameWhere: refCategoryNameWhere})
                ///.orderBy(orderBy, "ASC")
                .take(limit)
                .getMany();
    }

    @Query(() => RefCategory, { nullable: true })
    refCategory(@Arg('refCategoryId', () => Int) refCategoryId: number): Promise<RefCategory | null> {

        return RefCategory.findOneBy({id: refCategoryId});
    }

    @Mutation(() => RefCategoryResponse)
    @UseMiddleware(isAuth)
    async createRefCategory(
        // @Arg('title', () => String) title: string
        @Arg('options') options: RefCategoryInput,
        @Ctx() { req }: MyContext
        ): Promise<RefCategoryResponse> {

        //2 sql queries
        const savedRefCategory = await RefCategory.create({
            ...options,
            creatorId: req.session.userId,
        }).save();

        return {errors: undefined, refCategory: savedRefCategory}
    }

    @Mutation(() => RefCategory)
    async updateRefCategory(
        @Arg('id', () => Int) id: number,
        @Arg('name', () => String, {nullable: true}) name: string
        ): Promise<RefCategory | null> {
        const refCategory = await RefCategory.findOne({where: {id: id}});

        if (!refCategory){
            return null;
        }

        if (typeof name !== "undefined"){
            await RefCategory.update({id}, { name })
        }

        return refCategory;
        
    }

    @Mutation(() => Boolean)
    async deleteRefCategory(
        @Arg('id', () => Int) id: number
        ): Promise<boolean> {

        try{
            RefCategory.delete(id);
            return true;
        } catch {
            return false;
        }
        
    }
}