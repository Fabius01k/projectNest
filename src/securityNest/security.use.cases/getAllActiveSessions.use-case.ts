import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../repository/security.repository';
import { UserSessionView } from '../../userNest/schema/user-session.schema';
import { SecurityRepositorySql } from '../repository/security.repositorySql';

export class GetAllActiveSessionsCommand {
  constructor(public sessionId: string) {}
}
@CommandHandler(GetAllActiveSessionsCommand)
export class GetAllActiveSessionsUseCase
  implements ICommandHandler<GetAllActiveSessionsCommand>
{
  constructor(
    protected securityRepository: SecurityRepository,
    protected securityRepositorySql: SecurityRepositorySql,
  ) {}

  async execute(
    command: GetAllActiveSessionsCommand,
  ): Promise<UserSessionView[]> {
    return this.securityRepositorySql.findUserSessionsInDbSql(
      command.sessionId,
    );
  }
}
