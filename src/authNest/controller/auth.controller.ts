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
import { UserSql, UserView } from '../../userNest/schema/user.schema';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ConfirmationCodeModel,
  ConfirmationResendingCodeModel,
  EmailPasswordResendingInputModel,
  RecoveryPasswordInputModel,
  UserRegistrationInputModel,
} from '../../inputmodels-validation/auth.inputModel';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { AuthGuard } from '../guards/bearer.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateSessionCommand } from '../auth.use-cases/createSession.use-case';
import { RegistrationUserCommand } from '../auth.use-cases/registrationUser.use-case';
import { RegistrationConfirmationUserCommand } from '../auth.use-cases/registrationConfirmationUser.use-case';
import { ResendingConfirmationCodeCommand } from '../auth.use-cases/resendingConfirmationCode.use-case';
import { MakeNewPasswordCommand } from '../auth.use-cases/makeNewPassword.use-case';
import { ResendingPasswordCodeCommand } from '../auth.use-cases/resendingPasswordCode.use-case';
import { UserTrm } from '../../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}
  // @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(200)
  async LoginUser(
    @Body('loginOrEmail') loginOrEmail: string,
    @Body('password') password: string,
    @Request() req,
    @Response() res,
  ): Promise<boolean> {
    const user: UserSql | null = await this.authService.validateLoginUser(
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

      await this.commandBus.execute(
        new CreateSessionCommand(
          sessionId,
          ip,
          title,
          refreshTokenPayload.deviceId,
          refreshToken,
        ),
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
  @HttpCode(200)
  async GenerateNewTokens(@Request() req, @Response() res): Promise<boolean> {
    const accessToken = await this.authService.createAccessToken(req.userId);
    const oldDeviceID = req.deviceId;

    const refreshTokenPayload = {
      deviceId: oldDeviceID,
    };

    const refreshToken = await this.authService.createRefreshToken(
      req.userId,
      refreshTokenPayload,
    );
    await this.authService.changeDataInSession(oldDeviceID, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });
    console.log(refreshToken);

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
    await this.commandBus.execute(new RegistrationUserCommand(registrationDto));

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmationUser(
    @Body() codeConfirmationDto: ConfirmationCodeModel,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new RegistrationConfirmationUserCommand(codeConfirmationDto),
    );

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(204)
  async resendingRegistrationCode(
    @Body() resendCodeConfirmationDto: ConfirmationResendingCodeModel,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new ResendingConfirmationCodeCommand(resendCodeConfirmationDto),
    );

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(204)
  async recoveryPasswordForUser(
    @Body() recoveryPasswordDto: RecoveryPasswordInputModel,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new MakeNewPasswordCommand(recoveryPasswordDto),
    );

    return true;
  }
  @UseGuards(ThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(204)
  async sendRecoveryPasswordCode(
    @Body() recoveryPasswordCodeDto: EmailPasswordResendingInputModel,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new ResendingPasswordCodeCommand(recoveryPasswordCodeDto),
    );

    return true;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getInformationAboutUser(
    @Request() req,
    @Response() res,
  ): Promise<UserTrm> {
    const user = await this.usersService.getUserById(req.userId);
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
