import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity({ name: 'post', schema: 'public' })
export class Post extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

//   @SerializedPrimaryKey()

//   id!: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  text!: string;

  @Field()
  @Column({type: "int", default: 0 })
  points!: string;

  @Field() //expose in graphQL
  @Column() //db column
  creatorId: number;

  @ManyToOne(() => User, (user) => user.posts)
    creator: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt?: Date = new Date();
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt?: Date = new Date();

//   @OneToMany(() => Book, book => book.author)
//   books = new Collection<Book>(this);

//   @ManyToMany(() => Author)
//   friends = new Collection<Author>(this);

}