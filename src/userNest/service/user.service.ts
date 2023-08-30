import { Injectable } from '@nestjs/common';
import { User, UserResponse, UserView } from '../schema/user.schema';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(protected userRepository: UserRepository) {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async getAllUsers(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<UserResponse> {
    return await this.userRepository.findAllUsersInDb(
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    );
  }
  async postUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UserView> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const dateNow = new Date().getTime().toString();
    const newUser = new User(
      new ObjectId(),
      dateNow,
      {
        userName: {
          login: login,
          email: email,
        },
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      },
      {
        resetPasswordCode: null,
        expirationDatePasswordCode: new Date(),
      },
    );

    return await this.userRepository.createUserInDb(newUser);
  }
  async deleteUser(id: string): Promise<boolean> {
    const userDeleted = await this.userRepository.deleteUserInDb(id);
    if (!userDeleted) {
      return false;
    }
    return true;
  }
}
