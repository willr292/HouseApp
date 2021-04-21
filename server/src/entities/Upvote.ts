import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Upvote extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @PrimaryColumn()
  postId: string;

  @ManyToOne(() => Post, (post) => post.upvotes, {
    onDelete: "CASCADE",
  })
  post: Post;
}
