import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PostTrm } from './post.entity';

@Entity()
export class BlogTrm {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: string;
  @Column()
  isMembership: boolean;
  @Column()
  bloggerId: string;
  @Column({ nullable: true })
  isBanned: boolean;
  @OneToMany(() => PostTrm, (p) => p.blogId)
  blogPosts: PostTrm[];
}
