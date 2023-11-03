import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { QuizGameTrm } from '../entities/quiz-game.entity';
import { PlayerTrm } from '../entities/player.entity';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

export class CreateNewGameCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreateNewGameCommand)
export class CreateNewGameUseCase
  implements ICommandHandler<CreateNewGameCommand>
{
  constructor(
    protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: CreateNewGameCommand): Promise<QuizGameView> {
    // const playerOne = await this.quizRepositoryTypeOrm.getPlayerOneInDbTrm(
    //   command.userId,
    // );
    const newGameId = new Date().getTime().toString();

    const user: UserTrm | null =
      await this.userRepositoryTypeOrm.findUserByIdInDbTrm(command.userId);
    const newPlayer = new PlayerTrm();

    newPlayer.id = new Date().getTime().toString();
    newPlayer.userId = command.userId;
    newPlayer.userLogin = user!.login;
    newPlayer.gameId = newGameId;
    newPlayer.IsFirstInGame = true;
    newPlayer.userStatus = 'WaitSecondPlayer';
    newPlayer.scoresNumberInGame = 0;

    // const NwPlayer =
    //   await this.quizRepositoryTypeOrm.createNewPlayerInDbTrm(newPlayer);

    const newGame = new QuizGameTrm();

    newGame.id = newGameId;
    newGame.status = 'PendingSecondPlayer';
    newGame.pairCreatedDate = new Date().toISOString();
    newGame.gameQuestions = [];
    newGame.gamePlayers = [];

    const createdGame = await this.quizRepositoryTypeOrm.createNewGameInDbTrm(
      newGame,
      newPlayer,
    );
    await this.quizRepositoryTypeOrm.createNewPlayerInDbTrm(newPlayer);
    return createdGame;
  }
}
