// import { cp } from "fs";
import { Field, ObjectType } from "type-graphql";
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne} from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
// import { User } from "./User";

@ObjectType()
@Entity({ name: 'note', schema: 'public' })
export class Note extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

//   @SerializedPrimaryKey()

//   id!: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column("text")
  text!: string;

  @Field() //expose in graphQL
  @Column() //db column
  creatorId: number;

  // @ManyToOne(() => User, (user) => user.posts)
  //   creator: User;

  //   @Field(() => String)
  //   @CreateDateColumn()
  //   createdAt?: Date = new Date();
  
  //   @Field(() => String)
  //   @UpdateDateColumn()
  //   updatedAt?: Date = new Date();

//   @OneToMany(() => Book, book => book.author)
//   books = new Collection<Book>(this);

//   @ManyToMany(() => Author)
//   friends = new Collection<Author>(this);

}