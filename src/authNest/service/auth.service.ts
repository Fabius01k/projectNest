import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../userNest/repository/user.repository';
import bcrypt from 'bcrypt';
import {
  UserSession,
  UserSessionSql,
} from '../../userNest/schema/user-session.schema';
import { User, UserSql } from '../../userNest/schema/user.schema';
import { EmailManager } from '../../managers/email-manager';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { SecurityRepositorySql } from '../../securityNest/repository/security.repositorySql';

@Injectable()
export class AuthService {
  constructor(
    protected userRepository: UserRepository,
    protected jwtService: JwtService,
    protected userRepositorySql: UserRepositorySql,
    protected securityRepositorySql: SecurityRepositorySql,
  ) {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async createAccessToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '6m' });
  }

  async createRefreshToken(
    userId: string,
    refreshTokenPayload: any,
  ): Promise<string> {
    const payload = { userId, ...refreshTokenPayload };
    return this.jwtService.sign(payload, { expiresIn: '6m' });
  }

  async validateLoginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserSql | null> {
    const users =
      await this.userRepositorySql.getUserByLoginOrEmailSql(loginOrEmail);
    if (users.length === 0) return null;
    // if (user && (await bcrypt.compare(password, user.passwordHash)))
    //   return user;
    for (const user of users) {
      if (await bcrypt.compare(password, user.passwordHash)) {
        return user;
      }
    }

    return null;
  }
  async decodeRefreshToken(
    refreshToken: string,
  ): Promise<{ deviceId: string; userId: string; tokenCreationDate: Date }> {
    const decoded: any = this.jwtService.verify(refreshToken);
    const tokenCreationDate = new Date(decoded.iat * 1000);
    return {
      deviceId: decoded.deviceId,
      userId: decoded.userId,
      tokenCreationDate: tokenCreationDate,
    };
  }
  async changeDataInSession(
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    return await this.userRepositorySql.changeDataInSessionInDbSql(
      deviceId,
      refreshToken,
    );
  }
  async deleteSession(deviceId: string): Promise<boolean> {
    return await this.securityRepositorySql.deleteSessionInDbSql(deviceId);
  }
  async getUserSessionInDb(refreshToken: string): Promise<UserSessionSql> {
    const session =
      await this.userRepositorySql.findSessionByRefreshTokenSql(refreshToken);
    return session;
  }
}
