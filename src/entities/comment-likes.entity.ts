import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommentTrm } from './comment.entity';
@Entity()
export class CommentsLikesAndDislikesTrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  commentId: string;
  @Column()
  reactionStatus: string;
  @Column()
  userId: string;
  @Column({ nullable: true })
  isBanned: boolean;
  @ManyToOne(() => CommentTrm, (c) => c.commentLikesAndDislikes)
  comment: CommentTrm;
}
