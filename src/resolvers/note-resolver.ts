import { Note } from "../entities/Note";
import { Resolver, Query, Arg, Int, Mutation, Ctx, UseMiddleware } from "type-graphql";
//import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx, ObjectType, UseMiddleware, FieldResolver } from "type-graphql";
import { MyContext } from "src/types";
// import { FieldError } from "./common"
import { isAuth } from "../middleware/isAuth";
import { PrimaryDataSource } from "../data-sources";
import {
    NoteInput,
    NoteResponse
    // PostCreateInput,
    // PostDeleteInput,
    // PostInput,
    // PostListInput,
    // PostListOutput,
    // PostUpdateInput
  } from './graphql-types';

PrimaryDataSource.initialize();

@Resolver(Note)

export class NoteResolver {
    @Query(() => [Note])
    notes(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Int, { nullable: true }) cursor: number | null
    ): Promise<Note[]> {

        if(cursor){

            return PrimaryDataSource
                .getRepository(Note)
                .createQueryBuilder("note")
                .where('id < :id', { id: cursor })
                .orderBy("createdAt", "DESC")
                .take(limit)
                .getMany();
        }else{

            return PrimaryDataSource
                .getRepository(Note)
                .createQueryBuilder("note")
                .orderBy("createdAt", "DESC")
                .take(limit)
                .getMany();
        }
    }

    @Query(() => Note, { nullable: true })
    note(@Arg('noteId', () => Int) noteId: number): Promise<Note | null> {

        return Note.findOneBy({id: noteId});
    }

    @Mutation(() => NoteResponse)
    @UseMiddleware(isAuth)
    async createNote(
        // @Arg('title', () => String) title: string
        @Arg('options') options: NoteInput,
        @Ctx() { req }: MyContext
        ): Promise<NoteResponse> {

        //2 sql queries
        const savedNote = await Note.create({
            ...options,
            creatorId: req.session.userId,
        }).save();

        return {errors: undefined, note: savedNote}
    }

    @Mutation(() => NoteResponse)
    async updateNote(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
        @Arg('text', () => String, {nullable: true}) text: string
        ): Promise<Note | null> {
        const note = await Note.findOne({where: {id: id}});

        if (!note){
            return null;
        }

        if (typeof title !== "undefined"){
            await Note.update({id}, { title: title, text: text })
        }

        return note;
        
    }

    @Mutation(() => Boolean)
    async deleteNote(
        @Arg('id', () => Int) id: number
        ): Promise<boolean> {

        try{
            Note.delete(id);
            return true;
        } catch {
            return false;
        }
        
    }
}