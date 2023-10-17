import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { BlogTrm } from './blog.entity';
import { PostsLikesAndDislikesTrm } from './post-likes.entity';

@Entity()
export class PostTrm {
  @PrimaryColumn()
  id: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @Column()
  @JoinColumn({ name: 'blogId' })
  blogId: string;
  @Column()
  blogName: string;
  @Column()
  createdAt: string;
  @ManyToOne(() => BlogTrm, (b) => b.blogPosts)
  @JoinColumn({ name: 'blogId' })
  blog: BlogTrm;
  @OneToMany(() => PostsLikesAndDislikesTrm, (p) => p.postId)
  postLikedAndDislikes: PostsLikesAndDislikesTrm[];
}
