import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CommentsLikesAndDislikesTrm } from './comment-likes.entity';
import { PostTrm } from './post.entity';
@Entity()
export class CommentTrm {
  @PrimaryColumn()
  id: string;
  @Column()
  content: string;
  @Column()
  userId: string;
  @Column()
  userLogin: string;
  @Column()
  createdAt: string;
  @Column()
  postId: string;
  @Column({ nullable: true })
  isBanned: boolean;
  @OneToMany(() => CommentsLikesAndDislikesTrm, (c) => c.commentId)
  commentLikesAndDislikes: CommentsLikesAndDislikesTrm[];
  @ManyToOne(() => PostTrm, (p) => p.postComments)
  @JoinColumn({ name: 'postId' })
  post: PostTrm;
}
