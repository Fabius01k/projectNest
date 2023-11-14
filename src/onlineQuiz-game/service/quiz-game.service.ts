import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuizGameTrm } from '../entities/quiz-game.entity';
import { PlayerStatisticsView } from '../viewModels/player-statistics.view.model';
import { PlayerTrm } from '../entities/player.entity';

@Injectable()
export class QuizGameService {
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async getActivePlayers(userId: string): Promise<void> {
    const user =
      await this.quizRepositoryTypeOrm.findActivePlayersInDbTrm(userId);

    if (user) {
      throw new ForbiddenException([
        {
          message: 'You are already taking part in another game',
        },
      ]);
    }
  }
  async findActiveGameToConnect(): Promise<QuizGameTrm | null> {
    const activeGame =
      await this.quizRepositoryTypeOrm.findActiveGamesInDbTrm();

    return activeGame;
  }
  async getPlayersStatistic(
    userId: string,
  ): Promise<PlayerStatisticsView | null> {
    const playerStatistic =
      await this.quizRepositoryTypeOrm.findPlayerStatistic(userId);

    if (!playerStatistic) {
      throw new NotFoundException([
        {
          message: 'Player not found',
        },
      ]);
    }
    return playerStatistic;
  }
}
