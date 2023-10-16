import { Injectable } from '@nestjs/common';
import { UserSql, UserView } from '../schema/user.schema';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async getUserById(userId: string): Promise<UserTrm | null> {
    const user = await this.userRepositoryTypeOrm.findUserByIdInDbTrm(userId);

    return user;
  }
}
