import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserResponse,
  UserView,
} from '../schema/user.schema';
import { Model } from 'mongoose';

const mapUserToDto = (user: User): UserView => {
  return {
    id: user.id,
    login: user.accountData.userName.login,
    email: user.accountData.userName.email,
    createdAt: user.accountData.createdAt,
  };
};

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) protected userModel: Model<UserDocument>,
  ) {}
  async findAllUsersInDb(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<UserResponse> {
    const filter = {
      $or: [
        {
          'accountData.userName.login': {
            $regex: searchLoginTerm ?? '',
            $options: 'i',
          },
        },
        {
          'accountData.userName.email': {
            $regex: searchEmailTerm ?? '',
            $options: 'i',
          },
        },
      ],
    };

    const users: User[] = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items = users.map((u) => mapUserToDto(u));
    const totalCount = await this.userModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: items,
    };
  }
  async createUserInDb(newUser: User): Promise<UserView> {
    const createdUser = new this.userModel(newUser);
    await createdUser.save();

    return mapUserToDto(newUser);
  }
  async deleteUserInDb(id: string): Promise<boolean> {
    const deletedUser = await this.userModel.deleteOne({ id: id });

    return deletedUser.deletedCount === 1;
  }
}
