import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../repository/security.repository';
import { UserSessionView } from '../../userNest/schema/user-session.schema';

export class GetAllActiveSessionsCommand {
  constructor(public sessionId: string) {}
}
@CommandHandler(GetAllActiveSessionsCommand)
export class GetAllActiveSessionsUseCase
  implements ICommandHandler<GetAllActiveSessionsCommand>
{
  constructor(protected securityRepository: SecurityRepository) {}

  async execute(
    command: GetAllActiveSessionsCommand,
  ): Promise<UserSessionView[]> {
    return this.securityRepository.findUserSessionsInDb(command.sessionId);
  }
}
