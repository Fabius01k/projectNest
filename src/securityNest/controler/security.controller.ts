import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../../authNest/guards/refresh-token.guard';
import { UserSessionView } from '../../userNest/schema/user-session.schema';
import { SecurityService } from '../service/security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}
  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getAllActiveUsersSession(@Request() req): Promise<UserSessionView[]> {
    const sessionId = req.user.id;
    const sessionOfUser: UserSessionView[] =
      await this.securityService.getAllActiveUsersSession(sessionId);

    return sessionOfUser;
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices')
  @HttpCode(204)
  async deleteAllOthersSessions(@Request() req): Promise<void> {
    const sessionId = req.userId;
    const deviceId = req.deviceId;
    await this.securityService.deleteAllOthersSessions(sessionId, deviceId);

    return;
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices/:deviceId')
  @HttpCode(204)
  async deleteSessionById(
    @Request() req,
    @Param('deviceId') deviceId: string,
  ): Promise<void> {
    const creationDateOfToken = req.tokenCreationDate;
    const userId = req.userId;

    await this.securityService.deleteSessionByDeviceId(
      deviceId,
      userId,
      creationDateOfToken,
    );
    return;
  }
}
