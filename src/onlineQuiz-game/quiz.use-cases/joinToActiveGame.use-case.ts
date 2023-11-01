import { QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';
import { PlayerTrm } from '../entities/player.entity';
import { QuizGameTrm } from '../entities/quiz-game.entity';

export class JoinToActiveGameCommand {
  constructor(
    public newGame: QuizGameTrm,
    public userId: string,
  ) {}
}
@CommandHandler(JoinToActiveGameCommand)
export class JoinToActiveGameUseCase
  implements ICommandHandler<JoinToActiveGameCommand>
{
  constructor(
    protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: JoinToActiveGameCommand): Promise<QuizGameView> {
    const user: UserTrm | null =
      await this.userRepositoryTypeOrm.findUserByIdInDbTrm(command.userId);
    const secondPlayer = new PlayerTrm();

    secondPlayer.id = new Date().getTime().toString();
    secondPlayer.userId = command.userId;
    secondPlayer.userLogin = user!.login;
    secondPlayer.gameId = command.newGame.id;
    secondPlayer.userStatus = 'Active';
    secondPlayer.scoresNumberInGame = 0;

    const createdActiveGame =
      await this.quizRepositoryTypeOrm.joinSecondPlayerInGame(
        command.newGame,
        secondPlayer,
      );
    await this.quizRepositoryTypeOrm.createNewPlayerInDbTrm(secondPlayer);
    return createdActiveGame;
  }
}
