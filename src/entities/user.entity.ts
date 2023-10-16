import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UsersSessionTrm } from './usersSession.entity';

@Entity()
export class UserTrm {
  @PrimaryColumn()
  id: string;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  passwordSalt: string;
  @Column()
  createdAt: string;
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: Date;
  @Column()
  isConfirmed: boolean;
  @Column({ nullable: true })
  resetPasswordCode: string;
  @Column({ nullable: true })
  expirationDatePasswordCode: Date;
  @OneToMany(() => UsersSessionTrm, (u) => u.userId)
  usersSessions: UsersSessionTrm[];
}
