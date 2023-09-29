import { SecurityRepository } from '../repository/security.repository';
import { UserRepository } from '../../userNest/repository/user.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityRepositorySql } from '../repository/security.repositorySql';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { UserSql } from '../../userNest/schema/user.schema';
import { UserSessionSql } from '../../userNest/schema/user-session.schema';

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
    protected securityRepositorySql: SecurityRepositorySql,
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(command: DeleteSessionByDeviceIdCommand): Promise<boolean> {
    const ownerOfSendToken = await this.userRepositorySql.findUserByIdInDbSql(
      command.userId,
    );
    const userSessionInDb =
      await this.securityRepositorySql.findSessionsForDeleteSql(
        command.deviceId,
      );

    if (userSessionInDb.length === 0) {
      throw new NotFoundException([
        {
          message: 'Session not found',
        },
      ]);
    }
    // let isAllowedToDelete = false;
    // ownerOfSendToken.forEach((item) => {
    //   if (item.id === userSessionInDb?.sessionId) {
    //     isAllowedToDelete = true;
    //   }
    // });
    let isAllowedToDelete = false;

    for (let i = 0; i < userSessionInDb.length; i++) {
      const session = userSessionInDb[i];

      for (let j = 0; j < ownerOfSendToken.length; j++) {
        const owner = ownerOfSendToken[j];

        if (session.sessionId === owner.id) {
          isAllowedToDelete = true;
          break;
        }
      }

      if (isAllowedToDelete) {
        break;
      }
    }
    if (!isAllowedToDelete) {
      throw new ForbiddenException([
        {
          message: 'You are not allowed to delete this session',
        },
      ]);
    }

    // if (ownerOfSendToken!.id !== userSessionInDb?.sessionId) {

    console.log(command.deviceId);
    console.log(command.creationDateOfToken);
    console.log(userSessionInDb);

    if (
      userSessionInDb.every(
        (session) =>
          session.deviceId !== command.deviceId &&
          session.creationDateOfToken !== command.creationDateOfToken,
      )
    )
      throw new UnauthorizedException([
        {
          message: 'Unauthorized',
        },
      ]);
    const sessionDeleted =
      await this.securityRepositorySql.deleteSessionInDbSql(command.deviceId);

    return sessionDeleted;
  }
}
