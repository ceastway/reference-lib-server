import { Note } from "../../entities/Note";
import { Field, ObjectType } from 'type-graphql';
import { FieldError } from "../common";

// ## ObjectTypes are returned from mutations
@ObjectType()
export class NoteResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => Note, {nullable: true})
    note?: Note;
}