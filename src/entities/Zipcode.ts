import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity} from "typeorm";

@ObjectType()
@Entity({ name: 'zipcode', schema: 'public' })
export class Zipcode extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  City: string;

  @Field(() => String, { nullable: true })
  @Column()
  LocationText: string;

  @Field(() => String)
  @Column()
  Zipcode: string;

  @Field(() => Number)
  @Column()
  Lat: number;

  @Field(() => Number)
  @Column()
  Long: number;

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