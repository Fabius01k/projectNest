import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class BannedUsersInBlogsEntityTrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userId: string;
  @Column()
  blogId: string;
  @Column()
  banReason: string;
  @Column()
  isBanned: boolean;
  @Column()
  banDate: string;
}
