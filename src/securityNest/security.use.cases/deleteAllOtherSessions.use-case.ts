import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../repository/security.repository';

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
  constructor(protected securityRepository: SecurityRepository) {}

  async execute(command: DeleteAllOtherSessionsCommand): Promise<boolean> {
    const sessionsDeleted =
      await this.securityRepository.deleteOtherSessionsInDb(
        command.sessionId,
        command.deviceId,
      );
    return sessionsDeleted;
  }
}
