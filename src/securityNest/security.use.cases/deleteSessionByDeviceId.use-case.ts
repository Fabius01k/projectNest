import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityRepositorySql } from '../repository/security.repositorySql';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { SecurityRepositoryTypeOrm } from '../repository/security.repository.TypeOrm';

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
    protected securityRepositorySql: SecurityRepositorySql,
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
    protected securityRepositoryTypeOrm: SecurityRepositoryTypeOrm,
  ) {}

  async execute(command: DeleteSessionByDeviceIdCommand): Promise<boolean> {
    const ownerOfSendToken =
      await this.userRepositoryTypeOrm.findUserByIdInDbTrm(command.userId);

    const userSessionInDb =
      await this.securityRepositoryTypeOrm.findSessionsForDeleteTrm(
        command.deviceId,
      );

    if (!userSessionInDb) {
      throw new NotFoundException([
        {
          message: 'Session not found',
        },
      ]);
    }
    console.log(ownerOfSendToken?.id);
    console.log(userSessionInDb.userId);
    if (ownerOfSendToken!.id !== userSessionInDb?.userId) {
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
      await this.securityRepositoryTypeOrm.deleteSessionInDbTrm(
        command.deviceId,
      );

    return sessionDeleted;
  }
}
