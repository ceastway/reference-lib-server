import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity} from "typeorm";

@ObjectType()
@Entity({ name: 'node_act_references.reference_categories', schema: 'public' }) //table name
export class RefCategory extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  todo: number;

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