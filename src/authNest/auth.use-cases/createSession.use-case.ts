import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import {
  UserSession,
  UserSessionSql,
} from '../../userNest/schema/user-session.schema';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';

export class CreateSessionCommand {
  constructor(
    public sessionId: string,
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
    protected userRepository: UserRepository,
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(command: CreateSessionCommand): Promise<UserSession> {
    const newUserSession = new UserSessionSql(
      command.sessionId,
      command.ip,
      command.title,
      command.deviceId,
      new Date().toISOString(),
      command.refreshToken,
      new Date(),
      new Date(Date.now() + 20000),
    );
    return await this.userRepositorySql.createUserSessionInDbSql(
      newUserSession,
    );
  }
}
