import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../userNest/repository/user.repository';
import bcrypt from 'bcrypt';
import { UserSession } from '../../userNest/schema/user-session.schema';
import { User } from '../../userNest/schema/user.schema';
import { ObjectId } from 'mongodb';
import add from 'date-fns/add';
import { randomUUID } from 'crypto';
import { EmailManager } from '../../managers/email-manager';
import {
  ConfirmationCodeModel,
  ConfirmationResendingCodeModel,
  EmailPasswordResendingInputModel,
  RecoveryPasswordInputModel,
} from '../auth-inputModel.ts/auth.inputModel';

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
    return this.jwtService.sign(payload, { expiresIn: '7m' });
  }

  async createRefreshToken(
    userId: string,
    refreshTokenPayload: any,
  ): Promise<string> {
    const payload = { userId, ...refreshTokenPayload };
    return this.jwtService.sign(payload, { expiresIn: '7m' });
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
  ): Promise<{ deviceId: string; userId: string; creationDate: Date }> {
    const decoded: any = this.jwtService.verify(refreshToken);
    const tokenCreationDate = new Date(decoded.iat * 1000);
    return {
      deviceId: decoded.deviceId,
      userId: decoded.userId,
      creationDate: tokenCreationDate,
    };
  }
  async createSession(
    sessionId: string,
    ip: string,
    title: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<UserSession> {
    const newUserSession = new UserSession(
      sessionId,
      ip,
      title,
      deviceId,
      new Date().toISOString(),
      refreshToken,
      new Date(),
      new Date(Date.now() + 20000),
    );
    return await this.userRepository.createUserSessionInDb(newUserSession);
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
  async registrationUser(registrationDto): Promise<boolean> {
    const emailAlreadyUse = await this.userRepository.getUserByLoginOrEmail(
      registrationDto.email,
    );
    if (emailAlreadyUse) {
      throw new Error('This email is already in use');
    }
    const loginAlreadyUse = await this.userRepository.getUserByLoginOrEmail(
      registrationDto.login,
    );
    if (loginAlreadyUse) {
      throw new Error('This login is already in use');
    }

    const dateNow = new Date().getTime().toString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      registrationDto.password,
      passwordSalt,
    );
    const newUserToRegistration = new User(
      new ObjectId(),
      dateNow,
      {
        userName: {
          login: registrationDto.login,
          email: registrationDto.email,
        },
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
      {
        resetPasswordCode: null,
        expirationDatePasswordCode: new Date(),
      },
    );
    await this.userRepository.registrationUser(newUserToRegistration);

    await this.emailManager.sendEmailConfirmationMessage(newUserToRegistration);
    return true;
  }
  async registrationConfirmationUser(
    codeConfirmationDto: ConfirmationCodeModel,
  ): Promise<boolean> {
    const user: User | null =
      await this.userRepository.getUserByConfirmationCode(
        codeConfirmationDto.code,
      );
    if (!user) {
      throw new BadRequestException(['User not found']);
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException(['User already confirmed']);
    }
    if (user.emailConfirmation.confirmationCode !== codeConfirmationDto.code) {
      throw new BadRequestException(['Invalid confirmation code']);
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException(['The confirmation code has expired']);
    }

    const result = await this.userRepository.updateConfirmation(user.id);
    return result;
  }
  async resendingCode(
    resendCodeConfirmationDto: ConfirmationResendingCodeModel,
  ): Promise<boolean> {
    const user: User | null = await this.userRepository.getUserByLoginOrEmail(
      resendCodeConfirmationDto.email,
    );
    if (!user) {
      throw new Error('User not found');
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new Error('User already confirmed');
    }

    const confirmationCode = randomUUID();

    await this.userRepository.changeConfirmationCode(user.id, confirmationCode);

    await this.emailManager.resendEmailConfirmationMessage(
      resendCodeConfirmationDto.email,
      confirmationCode,
    );

    return true;
  }
  async makeNewPassword(
    recoveryPasswordDto: RecoveryPasswordInputModel,
  ): Promise<boolean> {
    const user: User | null =
      await this.userRepository.getUserByResetPasswordCode(
        recoveryPasswordDto.recoveryCode,
      );
    if (!user) {
      throw new Error('User not found');
    }
    if (
      user.passwordUpdate &&
      user.passwordUpdate.expirationDatePasswordCode &&
      user.passwordUpdate.expirationDatePasswordCode < new Date()
    ) {
      throw new Error('The code has expired');
    }
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      recoveryPasswordDto.newPassword,
      passwordSalt,
    );
    const result = await this.userRepository.changePasswordInDb(
      user.id,
      passwordSalt,
      passwordHash,
    );
    return result;
  }
  async resendingPasswordCode(
    recoveryPasswordCodeDto: EmailPasswordResendingInputModel,
  ): Promise<boolean> {
    const user: User | null = await this.userRepository.getUserByLoginOrEmail(
      recoveryPasswordCodeDto.email,
    );
    if (!user) return false;

    const NewResetPasswordCode = randomUUID();
    const NewExpirationDatePasswordCode = add(new Date(), { hours: 24 });

    await this.userRepository.changeResetPasswordCode(
      user.id,
      NewResetPasswordCode,
      NewExpirationDatePasswordCode,
    );
    await this.emailManager.resendPasswordCodeMessage(
      recoveryPasswordCodeDto.email,
      NewResetPasswordCode,
    );

    return true;
  }
  async getUserSessionInDb(refreshToken: string): Promise<UserSession | null> {
    const session =
      await this.userRepository.findSessionByRefreshToken(refreshToken);
    return session;
  }
}
