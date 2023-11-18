import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { TopUsersResponse } from '../viewModels/quiz-game.wiew-model';

export class GetTopUsersCommand {
  constructor(
    public sort: string[],
    public pageSize: number,
    public pageNumber: number,
  ) {}
}
@CommandHandler(GetTopUsersCommand)
export class GetTopUsersUseCase implements ICommandHandler<GetTopUsersCommand> {
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}
  async execute(command: GetTopUsersCommand): Promise<TopUsersResponse> {
    return await this.quizRepositoryTypeOrm.findTopUsersInDbTrm(
      command.sort,
      command.pageSize,
      command.pageNumber,
    );
  }
}
