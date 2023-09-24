import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../userNest/repository/user.repository';
import bcrypt from 'bcrypt';
import { UserSession } from '../../userNest/schema/user-session.schema';
import { User } from '../../userNest/schema/user.schema';
import { EmailManager } from '../../managers/email-manager';

@Injectable()
export class AuthService {
  constructor(
    protected userRepository: UserRepository,
    protected jwtService: JwtService,
    protected emailManager: EmailManager,
  ) {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async createAccessToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '1m' });
  }

  async createRefreshToken(
    userId: string,
    refreshTokenPayload: any,
  ): Promise<string> {
    const payload = { userId, ...refreshTokenPayload };
    return this.jwtService.sign(payload, { expiresIn: '1m' });
  }

  async validateLoginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.getUserByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    if (user && (await bcrypt.compare(password, user.accountData.passwordHash)))
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
    return await this.userRepository.changeDataInSessionInDb(
      deviceId,
      refreshToken,
    );
  }
  async deleteSession(deviceId: string): Promise<boolean> {
    return await this.userRepository.deleteSessionInDb(deviceId);
  }
  async getUserSessionInDb(refreshToken: string): Promise<UserSession | null> {
    const session =
      await this.userRepository.findSessionByRefreshToken(refreshToken);
    return session;
  }
}
