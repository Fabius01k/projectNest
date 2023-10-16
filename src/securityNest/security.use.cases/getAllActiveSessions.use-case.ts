import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserSessionView } from '../../userNest/schema/user-session.schema';
import { SecurityRepositorySql } from '../repository/security.repositorySql';
import { SecurityRepositoryTypeOrm } from '../repository/security.repository.TypeOrm';

export class GetAllActiveSessionsCommand {
  constructor(public userId: string) {}
}
@CommandHandler(GetAllActiveSessionsCommand)
export class GetAllActiveSessionsUseCase
  implements ICommandHandler<GetAllActiveSessionsCommand>
{
  constructor(
    protected securityRepositorySql: SecurityRepositorySql,
    protected securityRepositoryTypeOrm: SecurityRepositoryTypeOrm,
  ) {}

  async execute(
    command: GetAllActiveSessionsCommand,
  ): Promise<UserSessionView[]> {
    return this.securityRepositoryTypeOrm.findUserSessionsInDbTrm(
      command.userId,
    );
  }
}
