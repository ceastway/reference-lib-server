import { Zipcode } from "../entities/Zipcode";
import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx, ObjectType, UseMiddleware, FieldResolver } from "type-graphql";
import { MyContext } from "src/types";
import { FieldError } from "./common"
import { isAuth } from "../middleware/isAuth";
import { PrimaryDataSource } from "../data-sources";

console.log(FieldResolver);

PrimaryDataSource.initialize();

@InputType()
class ZipcodeInput {
    @Field()
    LocationText: string
    // @Field()
    // text: string
}

// ## ObjectTypes are returned from mutations
@ObjectType()
class ZipcodeResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => Zipcode, {nullable: true})
    zipcode?: Zipcode;
}

@Resolver(Zipcode)

// @FieldResolver(()=>String){
    
// }

export class ZipcodeResolver {
    @Query(() => [Zipcode])
    zipcodes(
        @Arg('orderBy') orderBy: string,
        @Arg('limit', () => Int) limit: number,
        @Arg('locationTextWhere', () => String) locationTextWhere: string,
        // @Arg('cursor', () => Int, { nullable: true }) cursor: number | null
    ): Promise<Zipcode[]> {

        //.where("zipcode.LocationText = :LocationText", {LocationText: locationTextWhere})
        /*
        ,
		LocationText
        */
        return PrimaryDataSource
                .getRepository(Zipcode)
                .createQueryBuilder("zipcode")
                .where("zipcode.LocationText LIKE :locationTextWhere", {locationTextWhere: locationTextWhere})
                .orderBy(orderBy, "ASC")
                .take(limit)
                .getMany();
    }

    @Query(() => Zipcode, { nullable: true })
    zipcode(@Arg('zipcodeId', () => Int) zipcodeId: number): Promise<Zipcode | null> {

        return Zipcode.findOneBy({id: zipcodeId});
    }

    @Mutation(() => ZipcodeResponse)
    @UseMiddleware(isAuth)
    async createZipcode(
        // @Arg('title', () => String) title: string
        @Arg('options') options: ZipcodeInput,
        @Ctx() { req }: MyContext
        ): Promise<ZipcodeResponse> {

        //2 sql queries
        const savedZipcode = await Zipcode.create({
            ...options,
            creatorId: req.session.userId,
        }).save();

        return {errors: undefined, zipcode: savedZipcode}
    }

    @Mutation(() => Zipcode)
    async updateZipcode(
        @Arg('id', () => Int) id: number,
        @Arg('LocationText', () => String, {nullable: true}) LocationText: string
        ): Promise<Zipcode | null> {
        const zipcode = await Zipcode.findOne({where: {id: id}});

        if (!zipcode){
            return null;
        }

        if (typeof LocationText !== "undefined"){
            await Zipcode.update({id}, { LocationText })
        }

        return zipcode;
        
    }

    @Mutation(() => Boolean)
    async deleteZipcode(
        @Arg('id', () => Int) id: number
        ): Promise<boolean> {

        try{
            Zipcode.delete(id);
            return true;
        } catch {
            return false;
        }
        
    }
}