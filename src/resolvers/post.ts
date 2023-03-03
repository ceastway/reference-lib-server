import { Post } from "../entities/Post";
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
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}

// ## ObjectTypes are returned from mutations
@ObjectType()
class PostResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => Post, {nullable: true})
    post?: Post;
}

@Resolver(Post)

export class PostResolver {
    @Query(() => [Post])
    posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Int, { nullable: true }) cursor: number | null
    ): Promise<Post[]> {

        if(cursor){

            return PrimaryDataSource
                .getRepository(Post)
                .createQueryBuilder("post")
                .where('id < :id', { id: cursor })
                .orderBy("createdAt", "DESC")
                .take(limit)
                .getMany();
        }else{

            return PrimaryDataSource
                .getRepository(Post)
                .createQueryBuilder("post")
                .orderBy("createdAt", "DESC")
                .take(limit)
                .getMany();
        }
    }

    @Query(() => Post, { nullable: true })
    post(@Arg('postId', () => Int) postId: number): Promise<Post | null> {

        return Post.findOneBy({id: postId});
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        // @Arg('title', () => String) title: string
        @Arg('options') options: PostInput,
        @Ctx() { req }: MyContext
        ): Promise<PostResponse> {

        //2 sql queries
        const savedPost = await Post.create({
            ...options,
            creatorId: req.session.userId,
        }).save();

        // console.log('savedPost', savedPost);

        return {errors: undefined, post: savedPost};
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string
        ): Promise<Post | null> {
        const post = await Post.findOne({where: {id: id}});

        if (!post){
            return null;
        }

        if (typeof title !== "undefined"){
            await Post.update({id}, { title })
        }

        return post;

    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number
        ): Promise<boolean> {

        try{
            Post.delete(id);
            return true;
        } catch {
            return false;
        }
        
    }
}