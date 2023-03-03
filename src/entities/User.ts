import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity({ name: 'user', schema: 'public' })
export class User extends BaseEntity{

  @Field() //expose in graphQL
  @PrimaryGeneratedColumn() //db column
  id: number;

  @Field(() => String)
  @Column( { unique: true } )
  username: string;

  @Column( {type: "text"} )
  password: string;

  @Field(() => String)
  @Column( { unique: true } )
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Post, (post) => post.creator)
    posts: Post[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date = new Date();

}