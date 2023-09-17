import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionView } from '../../userNest/schema/user-session.schema';
import { SecurityRepository } from '../repository/security.repository';
import { UserRepository } from '../../userNest/repository/user.repository';

@Injectable()
export class SecurityService {
  constructor(
    protected securityRepository: SecurityRepository,
    protected userRepository: UserRepository,
  ) {}

  async getAllActiveUsersSession(
    sessionId: string,
  ): Promise<UserSessionView[]> {
    return this.securityRepository.findUserSessionsInDb(sessionId);
  }
  async deleteAllOthersSessions(
    sessionId: string,
    deviceId: string,
  ): Promise<boolean> {
    const sessionsDeleted =
      await this.securityRepository.deleteOtherSessionsInDb(
        sessionId,
        deviceId,
      );
    return sessionsDeleted;
  }
  async deleteSessionByDeviceId(
    deviceId: string,
    userId: string,
    creationDateOfToken: Date,
  ): Promise<boolean> {
    const ownerOfSendToken =
      await this.userRepository.findUserInformationByIdInDb(userId);
    const userSessionInDb =
      await this.securityRepository.findSessionsForDelete(deviceId);

    if (!userSessionInDb) {
      throw new NotFoundException([
        {
          message: 'Session not found',
        },
      ]);
    }
    if (ownerOfSendToken!.id !== userSessionInDb?.sessionId) {
      throw new ForbiddenException(
        'You are not allowed to delete this session',
      );
    }

    if (
      deviceId !== userSessionInDb?.deviceId &&
      creationDateOfToken !== userSessionInDb?.tokenCreationDate
    )
      throw new UnauthorizedException([
        {
          message: 'Unauthorized',
        },
      ]);
    const sessionDeleted =
      await this.securityRepository.deleteSessionByDeviceIdInDb(deviceId);

    return sessionDeleted;
  }
}
