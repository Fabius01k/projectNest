import { Injectable } from '@nestjs/common';
import { UserView } from '../schema/user.schema';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(protected userRepository: UserRepository) {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async getUserById(userId: string): Promise<UserView | null> {
    const user = await this.userRepository.findUserByIdInDb(userId);

    return user;
  }
}
