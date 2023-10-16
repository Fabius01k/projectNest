import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserSessionSql } from '../../userNest/schema/user-session.schema';
import { UserSql } from '../../userNest/schema/user.schema';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { SecurityRepositorySql } from '../../securityNest/repository/security.repositorySql';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';
import { UsersSessionTrm } from '../../entities/usersSession.entity';
import { SecurityRepositoryTypeOrm } from '../../securityNest/repository/security.repository.TypeOrm';

@Injectable()
export class AuthService {
  constructor(
    protected jwtService: JwtService,
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
    protected securityRepositorySql: SecurityRepositorySql,
    protected securityRepositoryTypeOrm: SecurityRepositoryTypeOrm,
  ) {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async createAccessToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '10s' });
  }

  async createRefreshToken(
    userId: string,
    refreshTokenPayload: any,
  ): Promise<string> {
    const payload = { userId, ...refreshTokenPayload };
    return this.jwtService.sign(payload, { expiresIn: '20s' });
  }

  async validateLoginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserTrm | null> {
    const user =
      await this.userRepositoryTypeOrm.getUserByLoginOrEmailTrm(loginOrEmail);
    if (!user) return null;

    if (user && (await bcrypt.compare(password, user.passwordHash)))
      return user;

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
    return await this.userRepositoryTypeOrm.changeDataInSessionInDbTrm(
      deviceId,
      refreshToken,
    );
  }
  async deleteSession(deviceId: string): Promise<boolean> {
    return await this.securityRepositoryTypeOrm.deleteSessionInDbTrm(deviceId);
  }
  async getUserSessionInDb(refreshToken: string): Promise<UsersSessionTrm> {
    const session =
      await this.userRepositoryTypeOrm.findSessionByRefreshTokenTrm(
        refreshToken,
      );
    return session;
  }
}
