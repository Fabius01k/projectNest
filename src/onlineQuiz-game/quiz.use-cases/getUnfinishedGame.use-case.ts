import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class GetUnfinishedGameCommand {
  constructor(public userId: string) {}
}
@CommandHandler(GetUnfinishedGameCommand)
export class GetUnfinishedGameUseCase
  implements ICommandHandler<GetUnfinishedGameCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: GetUnfinishedGameCommand): Promise<QuizGameView> {
    const isUnfinishedGame = await this.quizRepositoryTypeOrm.isUnfinishedGame(
      command.userId,
    );
    if (!isUnfinishedGame) {
      throw new NotFoundException([
        {
          message: 'Game not found',
        },
      ]);
    }
    const player = await this.quizRepositoryTypeOrm.findActivePlayersInDbTrm(
      command.userId,
    );
    if (!player) {
      throw new NotFoundException([
        {
          message: "You don't have any active games",
        },
      ]);
    }

    return await this.quizRepositoryTypeOrm.findUnfinishedGamesInDbTrm(player);
  }
}
