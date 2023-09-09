import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserResponse, UserView } from '../schema/user.schema';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { ObjectId } from 'mongodb';
import { UserInputModel } from '../../authNest/auth-inputModel.ts/auth.inputModel';

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
  async postUser(userDto: UserInputModel): Promise<UserView> {
    const emailAlreadyUse = await this.userRepository.getUserByLoginOrEmail(
      userDto.email,
    );
    if (emailAlreadyUse) {
      throw new BadRequestException([
        {
          message: 'This email is already in use',
          field: 'email',
        },
      ]);
    }
    const loginAlreadyUse = await this.userRepository.getUserByLoginOrEmail(
      userDto.login,
    );
    if (loginAlreadyUse) {
      throw new BadRequestException([
        {
          message: 'This login is already in use',
          field: 'login',
        },
      ]);
    }
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userDto.password,
      passwordSalt,
    );

    const dateNow = new Date().getTime().toString();
    const newUser = new User(
      new ObjectId(),
      dateNow,
      {
        userName: {
          login: userDto.login,
          email: userDto.email,
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
  async deleteUser(id: string): Promise<void> {
    const userDeleted = await this.userRepository.deleteUserInDb(id);
    if (!userDeleted) {
      throw new NotFoundException([
        {
          message: 'User not found',
        },
      ]);
    }
    return;
  }
  async getUserById(userId: string): Promise<UserView | null> {
    const user = await this.userRepository.findUserByIdInDb(userId);

    return user;
  }
}
