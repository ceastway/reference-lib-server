import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity} from "typeorm";

@ObjectType()
@Entity({ name: 'node_act_references.reference_items', schema: 'public' }) //table name
export class RefItem extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Number)
  @Column({type: "int"})
  cat: number;

  @Field(() => Number)
  @Column({type: "int"})
  order: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({nullable: true})
  exampleString: string;

  @Field(() => String, { nullable: true })
  @Column({nullable: true})
  result: string;

  @Field(() => String, { nullable: true })
  @Column({nullable: true})
  result2: string;

  @Field(() => String, { nullable: true })
  @Column({nullable: true})
  result2Label: string;


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