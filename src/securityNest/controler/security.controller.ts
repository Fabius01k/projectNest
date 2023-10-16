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
import { CommandBus } from '@nestjs/cqrs';
import { GetAllActiveSessionsCommand } from '../security.use.cases/getAllActiveSessions.use-case';
import { DeleteAllOtherSessionsCommand } from '../security.use.cases/deleteAllOtherSessions.use-case';
import { DeleteSessionByDeviceIdCommand } from '../security.use.cases/deleteSessionByDeviceId.use-case';

@Controller('security')
export class SecurityController {
  constructor(private readonly commandBus: CommandBus) {}
  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getAllActiveUsersSession(@Request() req): Promise<UserSessionView[]> {
    const userId = req.userId;
    const sessionOfUser: UserSessionView[] = await this.commandBus.execute(
      new GetAllActiveSessionsCommand(userId),
    );

    return sessionOfUser;
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices')
  @HttpCode(204)
  async deleteAllOthersSessions(@Request() req): Promise<void> {
    const userId = req.userId;
    const deviceId = req.deviceId;
    await this.commandBus.execute(
      new DeleteAllOtherSessionsCommand(userId, deviceId),
    );
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

    await this.commandBus.execute(
      new DeleteSessionByDeviceIdCommand(deviceId, userId, creationDateOfToken),
    );
    return;
  }
}
