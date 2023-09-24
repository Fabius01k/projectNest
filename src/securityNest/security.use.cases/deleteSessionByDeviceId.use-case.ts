import { SecurityRepository } from '../repository/security.repository';
import { UserRepository } from '../../userNest/repository/user.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class DeleteSessionByDeviceIdCommand {
  constructor(
    public deviceId: string,
    public userId: string,
    public creationDateOfToken: Date,
  ) {}
}

@CommandHandler(DeleteSessionByDeviceIdCommand)
export class DeleteSessionByDeviceIdUseCase
  implements ICommandHandler<DeleteSessionByDeviceIdCommand>
{
  constructor(
    protected securityRepository: SecurityRepository,
    protected userRepository: UserRepository,
  ) {}

  async execute(command: DeleteSessionByDeviceIdCommand): Promise<boolean> {
    console.log(command.deviceId, 'service');
    const ownerOfSendToken =
      await this.userRepository.findUserInformationByIdInDb(command.userId);
    const userSessionInDb = await this.securityRepository.findSessionsForDelete(
      command.deviceId,
    );

    if (!userSessionInDb) {
      throw new NotFoundException([
        {
          message: 'Session not found',
        },
      ]);
    }

    if (ownerOfSendToken!.id !== userSessionInDb?.sessionId) {
      throw new ForbiddenException([
        {
          message: 'You are not allowed to delete this session',
        },
      ]);
    }

    if (
      command.deviceId !== userSessionInDb?.deviceId &&
      command.creationDateOfToken !== userSessionInDb?.tokenCreationDate
    )
      throw new UnauthorizedException([
        {
          message: 'Unauthorized',
        },
      ]);
    const sessionDeleted =
      await this.securityRepository.deleteSessionByDeviceIdInDb(
        command.deviceId,
      );

    return sessionDeleted;
  }
}
