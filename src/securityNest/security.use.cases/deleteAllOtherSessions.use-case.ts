import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepositorySql } from '../repository/security.repositorySql';
import { SecurityRepositoryTypeOrm } from '../repository/security.repository.TypeOrm';

export class DeleteAllOtherSessionsCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}
@CommandHandler(DeleteAllOtherSessionsCommand)
export class DeleteAllOtherSessionsUseCase
  implements ICommandHandler<DeleteAllOtherSessionsCommand>
{
  constructor(
    protected securityRepositorySql: SecurityRepositorySql,
    protected securityRepositoryTypeOrm: SecurityRepositoryTypeOrm,
  ) {}

  async execute(command: DeleteAllOtherSessionsCommand): Promise<boolean> {
    const sessionsDeleted =
      await this.securityRepositoryTypeOrm.deleteOtherSessionsInDbTrm(
        command.userId,
        command.deviceId,
      );
    return sessionsDeleted;
  }
}
