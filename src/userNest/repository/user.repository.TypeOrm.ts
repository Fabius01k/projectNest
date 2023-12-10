import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserResponse, UserSql, UserView } from '../schema/user.schema';
import { QueryResult } from 'pg';
import { UserSessionSql } from '../schema/user-session.schema';
import { UserTrm } from '../../entities/user.entity';
import { UsersSessionTrm } from '../../entities/usersSession.entity';

const mapUserToView = (user: UserTrm): UserView => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
@Injectable()
export class UserRepositoryTypeOrm {
  constructor(
    @InjectRepository(UserTrm)
    protected userRepository: Repository<UserTrm>,
    @InjectRepository(UsersSessionTrm)
    protected sessionRepository: Repository<UsersSessionTrm>,
  ) {}

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
  ): Promise<boolean> {
    const userBanned = await this.userRepository.update(
      { id: id },
      {
        isBanned: isBanned,
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
}
