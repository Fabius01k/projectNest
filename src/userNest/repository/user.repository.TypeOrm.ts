import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponse, UserView } from '../schema/user.schema';

import { UserTrm } from '../../entities/user.entity';
import { UsersSessionTrm } from '../../entities/usersSession.entity';
import { BannedUsersInBlogsEntityTrm } from '../../entities/bannedUsersInBlogs.entity';

const mapUserToView = (user: UserTrm): UserView => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
    banInfo: {
      isBanned: user.isBanned,
      banDate: user.isBanned ? user.banDate : null,
      banReason: user.isBanned ? user.banReason : null,
    },
  };
};

@Injectable()
export class UserRepositoryTypeOrm {
  constructor(
    @InjectRepository(UserTrm)
    protected userRepository: Repository<UserTrm>,
    @InjectRepository(UsersSessionTrm)
    protected sessionRepository: Repository<UsersSessionTrm>,
    @InjectRepository(BannedUsersInBlogsEntityTrm)
    protected banUserForBlogRepository: Repository<BannedUsersInBlogsEntityTrm>,
  ) {}

  private async mapBanUserToView(user: UserTrm): Promise<UserView> {
    const banUser = await this.banUserForBlogRepository
      .createQueryBuilder('BannedUsersInBlogsEntityTrm')
      .where('BannedUsersInBlogsEntityTrm.userId = :userId', {
        userId: user.id,
      })
      .getOne();
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        isBanned: banUser!.isBanned,
        banDate: banUser!.banDate,
        banReason: banUser!.banReason,
      },
    };
  }

  async findAllUsersInDbTrm(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<UserResponse> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('UserTrm')
      .where(
        `${
          searchLoginTerm
            ? 'UserTrm.login ilike :searchLoginTerm'
            : 'UserTrm.login is not null'
        }`,
        { searchLoginTerm: `%${searchLoginTerm}%` },
      )
      .orWhere(
        `${
          searchEmailTerm
            ? 'UserTrm.email ilike :searchEmailTerm'
            : 'UserTrm.email is not null'
        }`,
        { searchEmailTerm: `%${searchEmailTerm}%` },
      )
      .orderBy(
        'UserTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const users = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    const items = users.map((u) => mapUserToView(u));

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }
  async findAllBannedUserForSpecifeldBlogTrm(
    searchLoginTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    id: string,
  ): Promise<UserResponse> {
    const bannedUserForBlog = await this.banUserForBlogRepository
      .createQueryBuilder('BannedUsersInBlogsEntityTrm')
      .where('BannedUsersInBlogsEntityTrm.blogId = :blogId', {
        blogId: id,
      })
      .getRawMany();
    console.log(bannedUserForBlog, 'repo 1');
    const userIds = bannedUserForBlog.map(
      (row) => row.BannedUsersInBlogsEntityTrm_userId,
    );
    console.log(userIds, 'repo 2');

    const queryBuilder = await this.userRepository
      .createQueryBuilder('UserTrm')
      //.where('UserTrm.id IN (:userIds)', { userIds: userIds })
      .where('UserTrm.id IN (:...userIds)', { userIds: userIds })
      .orderBy(
        'UserTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const users = await queryBuilder.getMany();
    console.log(users, 'repo 3');
    const totalCountQuery = await queryBuilder.getCount();

    const items = await Promise.all(
      users.map((userId) => this.mapBanUserToView(userId)),
    );
    console.log(items, 'repo 4');
    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }
  async findBannedUsersInDbTrm(
    banStatus: boolean,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<UserResponse> {
    console.log(banStatus, 'status repo');

    const queryBuilder = this.userRepository
      .createQueryBuilder('UserTrm')
      .where('UserTrm.isBanned =:status', { status: banStatus })
      .andWhere(
        `${
          searchLoginTerm || searchEmailTerm
            ? 'UserTrm.login ilike :searchLoginTerm OR UserTrm.email ilike :searchEmailTerm'
            : 'UserTrm.login is not null'
        }`,
        {
          searchLoginTerm: `%${searchLoginTerm}%`,
          searchEmailTerm: `%${searchEmailTerm}%`,
        },
      )

      .orderBy(
        'UserTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const users = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    const items = users.map((u) => mapUserToView(u));

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }
  async getUserByLoginOrEmailTrm(
    loginOrEmail: string,
  ): Promise<UserTrm | null> {
    const user = await this.userRepository
      .createQueryBuilder('UserTrm')
      .where('UserTrm.email = :loginOrEmail OR UserTrm.login = :loginOrEmail', {
        loginOrEmail,
      })
      .getOne();
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async findSessionByRefreshTokenTrm(
    refreshToken: string,
  ): Promise<UsersSessionTrm> {
    const userSession = await this.sessionRepository
      .createQueryBuilder('UsersSessionTrm')
      .where('UsersSessionTrm.refreshToken = :refreshToken', { refreshToken })
      .getOne();
    if (userSession) {
      return userSession;
    } else {
      throw new UnauthorizedException([
        {
          message: 'Unauthorized3',
        },
      ]);
    }
  }
  async findUserByConfirmationCodeTrm(code: string): Promise<UserTrm | null> {
    const user = await this.userRepository
      .createQueryBuilder('UserTrm')
      .where('UserTrm.confirmationCode =:code', { code })
      .getOne();
    if (user) {
      return user;
    } else {
      return null;
    }
  }
  async findUserByResetPasswordCodeTrm(
    recoveryCode: string,
  ): Promise<UserTrm | null> {
    const user = await this.userRepository
      .createQueryBuilder('UserTrm')
      .where('UserTrm.resetPasswordCode =:recoveryCode', { recoveryCode })
      .getOne();
    if (user) {
      return user;
    } else {
      return null;
    }
  }
  async findUserByIdInDbTrm(id: string): Promise<UserTrm | null> {
    const user = await this.userRepository
      .createQueryBuilder('UserTrm')
      .where('UserTrm.id =:id', { id })
      .getOne();
    if (user) {
      return user;
    } else {
      return null;
    }
  }
  async changeDataInSessionInDbTrm(
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const UpdatedSession = await this.sessionRepository.update(
      {
        deviceId: deviceId,
      },
      {
        refreshToken: refreshToken,
        lastActiveDate: new Date().toISOString(),
        tokenCreationDate: new Date(),
        tokenExpirationDate: new Date(Date.now() + 20000),
      },
    );

    return (
      UpdatedSession.affected !== null &&
      UpdatedSession.affected !== undefined &&
      UpdatedSession.affected > 0
    );
  }
  async updateConfirmationTrm(id: string): Promise<boolean> {
    const ConfirmedUser = await this.userRepository.update(
      { id: id },
      { isConfirmed: true },
    );

    return (
      ConfirmedUser.affected !== null &&
      ConfirmedUser.affected !== undefined &&
      ConfirmedUser.affected > 0
    );
  }
  async changeConfirmationCodeTrm(
    id: string,
    confirmationCode: string,
  ): Promise<boolean> {
    const ChangedCode = await this.userRepository.update(
      { id: id },
      { confirmationCode: confirmationCode },
    );

    return (
      ChangedCode.affected !== null &&
      ChangedCode.affected !== undefined &&
      ChangedCode.affected > 0
    );
  }
  async changePasswordInDbTrm(
    id: string,
    passwordSalt: string,
    passwordHash: string,
  ): Promise<boolean> {
    const ChangedPassword = await this.userRepository.update(
      { id: id },
      { passwordSalt: passwordSalt, passwordHash: passwordHash },
    );

    return (
      ChangedPassword.affected !== null &&
      ChangedPassword.affected !== undefined &&
      ChangedPassword.affected > 0
    );
  }
  async changeResetPasswordCodeTrm(
    id: string,
    NewResetPasswordCode: string,
    NewExpirationDatePasswordCode: Date,
  ): Promise<boolean> {
    const ChangedPasswordCode = await this.userRepository.update(
      { id: id },
      {
        resetPasswordCode: NewResetPasswordCode,
        expirationDatePasswordCode: NewExpirationDatePasswordCode,
      },
    );

    return (
      ChangedPasswordCode.affected !== null &&
      ChangedPasswordCode.affected !== undefined &&
      ChangedPasswordCode.affected > 0
    );
  }

  // async changeDataInSessionInDbTrm(
  //   deviceId: string,
  //   refreshToken: string,
  // ): Promise<boolean> {
  //   const UpdatedSession = await this.sessionRepository
  //     .createQueryBuilder('UsersSessionTrm')
  //     .update()
  //     .set({
  //       refreshToken: refreshToken,
  //       lastActiveDate: new Date().toISOString(),
  //       tokenCreationDate: new Date(),
  //       tokenExpirationDate: new Date(Date.now() + 20000),
  //     })
  //     .where('UsersSessionTrm.deviceId = :deviceId', { deviceId })
  //     .execute();
  //
  //   return (
  //     UpdatedSession.affected !== null &&
  //     UpdatedSession.affected !== undefined &&
  //     UpdatedSession.affected > 0
  //   );
  // }

  // async findUserInformationByIdInDb(id: string) {
  //   const user = await this.userModel.findOne({ id: id });
  //
  //   return user;
  // }
  async createUserInDbTrm(newUser: UserTrm): Promise<UserView> {
    const createdUser = await this.userRepository.save(newUser);

    return mapUserToView(createdUser);
  }
  async registrationUserTrm(newUserToRegistration: UserTrm): Promise<boolean> {
    await this.userRepository.save(newUserToRegistration);
    console.log(newUserToRegistration);
    return true;
  }
  async deleteUserInDbTrm(id: string): Promise<boolean> {
    await this.sessionRepository.delete({ userId: id });
    const deletedUser = await this.userRepository.delete(id);
    return (
      deletedUser.affected !== null &&
      deletedUser.affected !== undefined &&
      deletedUser.affected > 0
    );
  }
  async banUser(
    id: string,
    isBanned: boolean,
    banReason: string,
    banDate: string,
  ): Promise<boolean> {
    const userBanned = await this.userRepository.update(
      { id: id },
      {
        isBanned: isBanned,
        banDate: banDate,
        banReason: banReason,
      },
    );

    return (
      userBanned.affected !== null &&
      userBanned.affected !== undefined &&
      userBanned.affected > 0
    );
  }
  async createUserSessionInDbTrm(
    newUserSession: UsersSessionTrm,
  ): Promise<UsersSessionTrm> {
    const createdSession = await this.sessionRepository.save(newUserSession);
    return createdSession;
  }
  async banUserForSpecifeldBlog(
    newUserForBlogBanned: BannedUsersInBlogsEntityTrm,
  ): Promise<void> {
    await this.banUserForBlogRepository.save(newUserForBlogBanned);
  }
  async unbanUserForSpecifeldBlog(id: string, blogId: string): Promise<void> {
    await this.banUserForBlogRepository.delete({ userId: id, blogId: blogId });
  }
  async checkBannedUser(blogId: string, userId: string): Promise<void> {
    const userBanned = await this.banUserForBlogRepository
      .createQueryBuilder('BannedUsersInBlogsEntityTrm')
      .where('BannedUsersInBlogsEntityTrm.blogId = :blogId', {
        blogId: blogId,
      })
      .andWhere('BannedUsersInBlogsEntityTrm.userId = :userId', {
        userId: userId,
      })
      .getOne();
    if (userBanned) {
      throw new ForbiddenException([
        {
          message: 'You are not allowed',
        },
      ]);
    }
  }
}
