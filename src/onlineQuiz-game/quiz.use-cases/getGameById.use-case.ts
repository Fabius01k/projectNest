import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuizGameView } from '../viewModels/quiz-game.wiew-model';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

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
    const game = await this.quizRepositoryTypeOrm.findGame(command.gameId);

    if (!game) {
      throw new BadRequestException([
        {
          message: 'Incorrect id format',
        },
      ]);
    }
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
      throw new NotFoundException([
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
