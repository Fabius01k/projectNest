import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserTrm } from './user.entity';

@Entity()
export class UsersSessionTrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => UserTrm, (u) => u.usersSessions)
  @JoinColumn({ name: 'userId' })
  user: UserTrm;
  @Column()
  userId: string;
  @Column()
  ip: string;
  @Column()
  title: string;
  @Column()
  deviceId: string;
  @Column()
  lastActiveDate: string;
  @Column()
  refreshToken: string;
  @Column()
  tokenCreationDate: Date;
  @Column()
  tokenExpirationDate: Date;
}
