import { Animal } from "../entities/animal";
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
class AnimalInput {
    @Field()
    AnimalName: string
    // @Field()
    // text: string
}

// ## ObjectTypes are returned from mutations
@ObjectType()
class AnimalResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => Animal, {nullable: true})
    animal?: Animal;
}

@Resolver(Animal)

export class AnimalResolver {
    @Query(() => [Animal])
    animals(
        @Arg('orderBy') orderBy: string,
        @Arg('limit', () => Int) limit: number,
        @Arg('animalNameWhere', () => String) animalNameWhere: string
        // @Arg('cursor', () => Int, { nullable: true }) cursor: number | null
    ): Promise<Animal[]> {

        //.where("animal.AnimalName = :AnimalName", {AnimalName: animalNameWhere})
        /*
        ,
		AnimalName
        */
        return PrimaryDataSource
                .getRepository(Animal)
                .createQueryBuilder("animal")
                .where("animal.AnimalName LIKE :animalNameWhere", {animalNameWhere: animalNameWhere})
                .orderBy(orderBy, "ASC")
                .take(limit)
                .getMany();
    }

    @Query(() => Animal, { nullable: true })
    animal(@Arg('animalId', () => Int) animalId: number): Promise<Animal | null> {

        return Animal.findOneBy({id: animalId});
    }

    @Mutation(() => AnimalResponse)
    @UseMiddleware(isAuth)
    async createAnimal(
        // @Arg('title', () => String) title: string
        @Arg('options') options: AnimalInput,
        @Ctx() { req }: MyContext
        ): Promise<AnimalResponse> {

        //2 sql queries
        const savedAnimal =  await Animal.create({
            ...options,
            creatorId: req.session.userId,
        }).save();

        return {errors: undefined, animal: savedAnimal}
    }

    @Mutation(() => Animal)
    async updateAnimal(
        @Arg('id', () => Int) id: number,
        @Arg('AnimalName', () => String, {nullable: true}) AnimalName: string
        ): Promise<Animal | null> {
        const animal = await Animal.findOne({where: {id: id}});

        if (!animal){
            return null;
        }

        if (typeof AnimalName !== "undefined"){
            await Animal.update({id}, { AnimalName })
        }

        return animal;
        
    }

    @Mutation(() => Boolean)
    async deleteAnimal(
        @Arg('id', () => Int) id: number
        ): Promise<boolean> {

        try{
            Animal.delete(id);
            return true;
        } catch {
            return false;
        }
        
    }
}