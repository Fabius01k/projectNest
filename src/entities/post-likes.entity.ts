import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTrm } from './post.entity';

@Entity()
export class PostsLikesAndDislikesTrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  postId: string;
  @Column()
  userLogin: string;
  @Column()
  reactionStatus: string;
  @Column()
  addedAt: Date;
  @Column()
  userId: string;
  @Column({ nullable: true })
  isBanned: boolean;
  @ManyToOne(() => PostTrm, (p) => p.postLikedAndDislikes)
  @JoinColumn({ name: 'postId' })
  post: PostTrm;
}
