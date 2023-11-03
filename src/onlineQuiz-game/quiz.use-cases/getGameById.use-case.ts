import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { ForbiddenException } from '@nestjs/common';

export class GetGameByIdCommand {
  constructor(
    public userId: string,
    public gameId: string,
  ) {}
}
@CommandHandler(GetGameByIdCommand)
export class GetGameByIdUseCase implements ICommandHandler<GetGameByIdCommand> {
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: GetGameByIdCommand): Promise<QuizGameView> {
    const player = await this.quizRepositoryTypeOrm.findNeedPlayersInDbTrm(
      command.userId,
      command.gameId,
    );
    // if (player!.gameId !== command.gameId) {
    //   throw new ForbiddenException([
    //     {
    //       message: 'You are not a member of this game',
    //     },
    //   ]);
    // }
    if (!player) {
      throw new ForbiddenException([
        {
          message: 'You are not a member of this game',
        },
      ]);
    }
    return await this.quizRepositoryTypeOrm.findGameByIdInDbTrm(
      player!,
      command.gameId,
    );
  }
}
