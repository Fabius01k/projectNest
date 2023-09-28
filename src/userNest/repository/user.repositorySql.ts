import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserResponse, UserSql, UserView } from '../schema/user.schema';
import { QueryResult } from 'pg';
import { randomUUID } from 'crypto';
import { UserSessionSql } from '../schema/user-session.schema';

const mapUserToView = (user: UserSql): UserView => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
@Injectable()
export class UserRepositorySql {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async findAllUsersInDbSql(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<UserResponse> {
    const users = await this.dataSource.query<UserSql[]>(`
    SELECT *      
    FROM public."Users"      
    WHERE
      "login" LIKE '%${searchLoginTerm ?? ''}%'
      OR
      "email" LIKE '%${searchEmailTerm ?? ''}%'
    ORDER BY
      "${sortBy}" ${sortDirection}
    LIMIT
      ${pageSize}
    OFFSET
      ${(pageNumber - 1) * pageSize}
      `);

    const totalCountQuery = await this.dataSource.query<
      { totalCount: string }[]
    >(`
    SELECT COUNT(*) AS "totalCount"
    FROM public."Users"   
    WHERE
      "login" LIKE '%${searchLoginTerm ?? ''}%'
      OR 
      "email" LIKE '%${searchEmailTerm ?? ''}%'
  `);
    const items = users.map((u) => mapUserToView(u));

    return {
      pagesCount: Math.ceil(+totalCountQuery[0].totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCountQuery[0].totalCount,
      items: items,
    };
  }
  async getUserByLoginOrEmailSql(loginOrEmail: string) {
    const user: QueryResult<UserSql> = await this.dataSource.query<UserSql>(`
    SELECT *      
    FROM public."Users"      
    WHERE
    "email" = '${loginOrEmail}'
    OR
    "login" = '${loginOrEmail}'
    `);

    return user;
  }
  async findSessionByRefreshTokenSql(refreshToken: string) {
    const session: QueryResult<UserSessionSql> = await this.dataSource
      .query<UserSessionSql>(`
    SELECT *      
    FROM public."UserSession"      
    WHERE
    "refreshToken" = '${refreshToken}'
    `);

    return session;
  }
  async getUserByConfirmationCodeSql(code: string) {
    const user: QueryResult<UserSql> = await this.dataSource.query<UserSql>(`
    SELECT *
    FROM public."Users"      
    WHERE
    "confirmationCode" = '${code}'    
    `);
    return user;
  }
  async getUserByResetPasswordCodeSql(recoveryCode: string) {
    const user: QueryResult<UserSql> = await this.dataSource.query<UserSql>(`
    SELECT *
    FROM public."Users"      
    WHERE
    "resetPasswordCode" = '${recoveryCode}' 
    `);
    return user;
  }

  async findUserByIdInDbSql(id: string) {
    const user: QueryResult<UserSql> = await this.dataSource.query<UserSql>(`
    SELECT *
    FROM public."Users"      
    WHERE
    "id" = '${id}'
    `);
    return user;
    // return user ? mapUserToView(user) : null;
  }
  async createUserInDbSql(newUser: UserSql): Promise<UserView> {
    const query = `
      INSERT INTO public."Users"(
      "id",
      "login",
      "email",
      "passwordHash",
      "passwordSalt",
      "createdAt",
      "confirmationCode",
      "expirationDate",
      "isConfirmed",
      "resetPasswordCode",
      "expirationDatePasswordCode")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`;

    const values = [
      newUser.id,
      newUser.login,
      newUser.email,
      newUser.passwordHash,
      newUser.passwordSalt,
      newUser.createdAt,
      newUser.confirmationCode,
      newUser.expirationDate,
      newUser.isConfirmed,
      newUser.resetPasswordCode,
      newUser.expirationDatePasswordCode,
    ];

    const result = await this.dataSource.query(query, values);
    const user = result[0];

    return mapUserToView(user);
  }
  async registrationUserSql(newUserToRegistration: UserSql): Promise<boolean> {
    const query = `
      INSERT INTO public."Users"(
      "id",
      "login",
      "email",
      "passwordHash",
      "passwordSalt",
      "createdAt",
      "confirmationCode",
      "expirationDate",
      "isConfirmed",
      "resetPasswordCode",
      "expirationDatePasswordCode")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`;

    const values = [
      newUserToRegistration.id,
      newUserToRegistration.login,
      newUserToRegistration.email,
      newUserToRegistration.passwordHash,
      newUserToRegistration.passwordSalt,
      newUserToRegistration.createdAt,
      newUserToRegistration.confirmationCode,
      newUserToRegistration.expirationDate,
      newUserToRegistration.isConfirmed,
      newUserToRegistration.resetPasswordCode,
      newUserToRegistration.expirationDatePasswordCode,
    ];

    await this.dataSource.query(query, values);
    console.log(newUserToRegistration);
    return true;
  }
  async deleteUserInDbSql(id: string): Promise<boolean> {
    const [_, deletedUser] = await this.dataSource.query(`
    DELETE 
    FROM public."Users"
    WHERE "id" = '${id}'
    `);
    return deletedUser === 1;
  }
  async deleteSessionInDbSql(deviceId: string): Promise<boolean> {
    const [_, deletedSession] = await this.dataSource.query(`
    DELETE
    FROM public."UserSession"
    WHERE "deviceId" = '${deviceId}'    
    `);
    return deletedSession === 1;
  }
  async createUserSessionInDbSql(
    newUserSession: UserSessionSql,
  ): Promise<UserSessionSql> {
    const query = `
    INSERT INTO public."UserSession"(
    "sessionId",
    "ip",
    "title",
    "deviceId",
    "lastActiveDate",
    "refreshToken",
    "tokenCreationDate",
    "tokenExpirationDate")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`;

    const values = [
      newUserSession.sessionId,
      newUserSession.ip,
      newUserSession.title,
      newUserSession.deviceId,
      newUserSession.lastActiveDate,
      newUserSession.refreshToken,
      newUserSession.tokenCreationDate,
      newUserSession.tokenExpirationDate,
    ];

    const result = await this.dataSource.query(query, values);
    const session = result[0];

    return session;
  }

  async changeDataInSessionInDbSql(
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const query = `
    UPDATE public."UserSession"
    SET "refreshToken" = $1,
        "lastActiveDate" = $2,
        "tokenCreationDate" = $3,
        "tokenExpirationDate" = $4
    WHERE "deviceId" = $5`;

    const values = [
      refreshToken,
      new Date().toISOString(),
      new Date(),
      new Date(Date.now() + 20000),
      deviceId,
    ];

    const result = await this.dataSource.query(query, values);
    return result.affectedRows === 1;
  }
  async updateConfirmationSql(id: string): Promise<boolean> {
    const query = `
    UPDATE public."Users"
    SET "isConfirmed" = $1
    
    WHERE "id" = $2`;

    const values = [true, id];

    const result = await this.dataSource.query(query, values);
    return result.affectedRows === 1;
  }

  async changeConfirmationCodeSql(
    id: string,
    confirmationCode: string,
  ): Promise<boolean> {
    const query = `
    UPDATE public."Users"
    SET "confirmationCode" = $1
    
    WHERE "id" = $2`;

    const values = [confirmationCode, id];

    const result = await this.dataSource.query(query, values);
    return result.affectedRows === 1;
  }
  async changePasswordInDbSql(
    id: string,
    passwordSalt: string,
    passwordHash: string,
  ): Promise<boolean> {
    const query = `
    UPDATE public."Users"
    SET "passwordSalt" = $1,
        "passwordHash" = $2
   
   WHERE "id" = $3`;

    const values = [passwordSalt, passwordHash, id];

    const result = await this.dataSource.query(query, values);
    return result.affectedRows === 1;
  }
  async changeResetPasswordCodeSql(
    id: string,
    NewResetPasswordCode: string,
    NewExpirationDatePasswordCode: Date,
  ): Promise<boolean> {
    const query = `
    UPDATE public."Users"
    SET "resetPasswordCode" = $1,
        "expirationDatePasswordCode" = $2
        
        WHERE "id" = $3`;

    const values = [NewResetPasswordCode, NewExpirationDatePasswordCode, id];
    console.log(NewResetPasswordCode);

    const result = await this.dataSource.query(query, values);
    return result.affectedRows === 1;
  }

  //   async findUserInformationByIdInDb(id: string) {
  //     const user = await this.userModel.findOne({ id: id });
  //
  //     return user;
  //   }
  //
}
