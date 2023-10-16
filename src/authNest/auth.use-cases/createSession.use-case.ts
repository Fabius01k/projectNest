import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserSessionSql } from '../../userNest/schema/user-session.schema';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { UsersSessionTrm } from '../../entities/usersSession.entity';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';

export class CreateSessionCommand {
  constructor(
    public userId: string,
    public ip: string,
    public title: string,
    public deviceId: string,
    public refreshToken: string,
  ) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: CreateSessionCommand): Promise<UsersSessionTrm> {
    const newUserSession = new UsersSessionTrm();
    newUserSession.userId = command.userId;
    newUserSession.ip = command.ip;
    newUserSession.title = command.title;
    newUserSession.deviceId = command.deviceId;
    newUserSession.lastActiveDate = new Date().toISOString();
    newUserSession.refreshToken = command.refreshToken;
    newUserSession.tokenCreationDate = new Date();
    newUserSession.tokenExpirationDate = new Date(Date.now() + 20000);

    return await this.userRepositoryTypeOrm.createUserSessionInDbTrm(
      newUserSession,
    );
  }
}
