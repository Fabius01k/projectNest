import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../../userNest/service/user.service';
import { AuthService } from '../service/auth.service';
import { randomUUID } from 'crypto';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { User, UserView } from '../../userNest/schema/user.schema';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ConfirmationCodeModel,
  ConfirmationResendingCodeModel,
  EmailPasswordResendingInputModel,
  RecoveryPasswordInputModel,
  UserRegistrationInputModel,
} from '../../inputmodels-validation/auth.inputModel';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(200)
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
      console.log(refreshToken);
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

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logoutUser(@Request() req, @Response() res): Promise<boolean> {
    await this.authService.deleteSession(req.deviceId);

    res.clearCookie('refreshToken');
    res.sendStatus(204);
    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('registration')
  @HttpCode(204)
  async registrationUser(
    @Body() registrationDto: UserRegistrationInputModel,
  ): Promise<boolean> {
    await this.authService.registrationUser(registrationDto);

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmationUser(
    @Body() codeConfirmationDto: ConfirmationCodeModel,
  ): Promise<boolean> {
    await this.authService.registrationConfirmationUser(codeConfirmationDto);

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(204)
  async resendingRegistrationCode(
    @Body() resendCodeConfirmationDto: ConfirmationResendingCodeModel,
  ): Promise<boolean> {
    await this.authService.resendingCode(resendCodeConfirmationDto);

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(204)
  async recoveryPasswordForUser(
    @Body() recoveryPasswordDto: RecoveryPasswordInputModel,
  ): Promise<boolean> {
    await this.authService.makeNewPassword(recoveryPasswordDto);

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(204)
  async sendRecoveryPasswordCode(
    @Body() recoveryPasswordCodeDto: EmailPasswordResendingInputModel,
  ): Promise<boolean> {
    await this.authService.resendingPasswordCode(recoveryPasswordCodeDto);

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
