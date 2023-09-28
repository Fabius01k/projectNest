import { Injectable } from '@nestjs/common';
import { UserSql, UserView } from '../schema/user.schema';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../repository/user.repositorySql';

@Injectable()
export class UserService {
  constructor(
    protected userRepository: UserRepository,
    protected userRepositorySql: UserRepositorySql,
  ) {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async getUserById(userId: string): Promise<UserSql[]> {
    const user = await this.userRepositorySql.findUserByIdInDbSql(userId);

    return user;
  }
}
