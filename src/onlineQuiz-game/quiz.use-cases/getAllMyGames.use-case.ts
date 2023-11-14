import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { GameResponse } from '../viewModels/quiz-game.wiew-model';

export class GetAllMyGamesCommand {
  constructor(
    public firstSortBy: string,
    public secondSortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetAllMyGamesCommand)
export class GetAllMyGamesUseCase
  implements ICommandHandler<GetAllMyGamesCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}
  async execute(command: GetAllMyGamesCommand): Promise<GameResponse> {
    console.log('mid,use-cases');
    return await this.quizRepositoryTypeOrm.findAllMyGamesInDbTrm(
      command.firstSortBy,
      command.secondSortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.userId,
    );
  }
}
