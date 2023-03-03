import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity} from "typeorm";

@ObjectType()
@Entity({ name: 'animal', schema: 'public' })
export class Animal extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  AnimalName: string;

  // @Field(() => String)
  // @Column()
  // text!: string;

  // @Field()
  // @Column({type: "int", default: 0 })
  // points!: string;

  @Field() //expose in graphQL
  @Column() //db column
  creatorId: number;

//   @ManyToOne(() => User, (user) => user.posts)
//     creator: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt?: Date = new Date();
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt?: Date = new Date();

}