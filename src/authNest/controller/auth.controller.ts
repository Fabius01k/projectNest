import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
} from '@nestjs/common';
import { UserService } from '../../userNest/service/user.service';
import { AuthService } from '../service/auth.service';
// import { LocalLoginGuard } from '../guards/local-login.guard';
import { randomUUID } from 'crypto';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { User, UserView } from '../../userNest/schema/user.schema';
// import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ConfirmationCodeModel,
  ConfirmationResendingCodeModel,
  EmailPasswordResendingInputModel,
  RecoveryPasswordInputModel,
  UserRegistrationInputModel,
} from '../auth-inputModel.ts/auth.inputModel';
import { RefreshTokenGuard } from '../strategies/local-refreshToken.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async LoginUser(
    @Body('loginOrEmail') loginOrEmail: string,
    @Body('password') password: string,
    @Request() req,
    @Response() res,
  ): Promise<boolean> {
    const user: User | null = await this.authService.validateLoginUser(
      loginOrEmail,
      password,
    );
    if (user) {
      const accessToken = await this.authService.createAccessToken(user.id);
      const refreshTokenPayload = {
        deviceId: randomUUID(),
      };

      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        refreshTokenPayload,
      );

      const sessionId = user.id;
      const ip = req.ip;
      const title = req.headers['user-agent'] || 'Unknown';

      await this.authService.createSession(
        sessionId,
        ip,
        title,
        refreshTokenPayload.deviceId,
        refreshToken,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 20 * 1000,
      });

      res.send({ accessToken });
      return true;
    }
    res.sendStatus(401);
    return false;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async GenerateNewTokens(@Request() req, @Response() res): Promise<boolean> {
    const accessToken = await this.authService.createAccessToken(req.userId);
    const oldDeviceID = req.deviceId;

    const refreshTokenPayload = {
      deviceId: oldDeviceID,
    };

    const refreshToken = await this.authService.createRefreshToken(
      req.user.id,
      refreshTokenPayload,
    );
    await this.authService.changeDataInSession(oldDeviceID, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });

    res.send({ accessToken });
    return true;
  }

  @UseGuards(RefreshTokenGuard) // добавить стратегию для рефреш токена
  @Post('logout')
  async logoutUser(@Request() req, @Response() res): Promise<boolean> {
    await this.authService.deleteSession(req.deviceId);

    res.clearCookie('refreshToken');
    res.sendStatus(204);
    return true;
  }

  @Post('registration')
  async registrationUser(
    @Body() registrationDto: UserRegistrationInputModel,
    @Response() res,
  ): Promise<boolean> {
    await this.authService.registrationUser(registrationDto);
    res.sendStatus(204);
    return true;
  }

  @Post('registration-confirmation')
  async registrationConfirmationUser(
    @Body() codeConfirmationDto: ConfirmationCodeModel,
    @Response() res,
  ): Promise<boolean> {
    await this.authService.registrationConfirmationUser(codeConfirmationDto);
    res.sendStatus(204);
    return true;
  }

  @Post('registration-email-resending')
  async resendingRegistrationCode(
    @Body() resendCodeConfirmationDto: ConfirmationResendingCodeModel,
    @Response() res,
  ): Promise<boolean> {
    await this.authService.resendingCode(resendCodeConfirmationDto);
    res.sendStatus(204);
    return true;
  }

  @Post('new-password')
  async recoveryPasswordForUser(
    @Body() recoveryPasswordDto: RecoveryPasswordInputModel,
    @Response() res,
  ): Promise<boolean> {
    await this.authService.makeNewPassword(recoveryPasswordDto);
    res.sendStatus(204);
    return true;
  }

  @Post('password-recovery')
  async sendRecoveryPasswordCode(
    @Body() recoveryPasswordCodeDto: EmailPasswordResendingInputModel,
    @Response() res,
  ): Promise<boolean> {
    await this.authService.resendingPasswordCode(recoveryPasswordCodeDto);
    res.sendStatus(204);
    return true;
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  async getInformationAboutUser(
    @Request() req,
    @Response() res,
  ): Promise<UserView | null> {
    const user = await this.usersService.getUserById(req.user.userId);
    if (!user) {
      return res.sendStatus(401);
    }
    return res.status(200).send({
      email: user.email,
      login: user.login,
      userId: user.id,
    });
  }
}
