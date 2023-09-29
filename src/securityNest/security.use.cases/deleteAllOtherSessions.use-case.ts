import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../repository/security.repository';
import { SecurityRepositorySql } from '../repository/security.repositorySql';

export class DeleteAllOtherSessionsCommand {
  constructor(
    public sessionId: string,
    public deviceId: string,
  ) {}
}
@CommandHandler(DeleteAllOtherSessionsCommand)
export class DeleteAllOtherSessionsUseCase
  implements ICommandHandler<DeleteAllOtherSessionsCommand>
{
  constructor(
    protected securityRepository: SecurityRepository,
    protected securityRepositorySql: SecurityRepositorySql,
  ) {}

  async execute(command: DeleteAllOtherSessionsCommand): Promise<boolean> {
    const sessionsDeleted =
      await this.securityRepositorySql.deleteOtherSessionsInDbSql(
        command.sessionId,
        command.deviceId,
      );
    return sessionsDeleted;
  }
}
