import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @OneToMany(() => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];

  @Field()
  @Column({ type: "int", default: 0 })
  price: number;

  @Field()
  @Column({ type: "int", default: 0 })
  beds: number;

  @Field()
  @Column({ type: "int", default: 0 })
  bathrooms: number;

  @Field()
  @Column("double precision")
  latitude: number;

  @Field()
  @Column("double precision")
  longitude: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
