import { ForbiddenException, Injectable } from '@nestjs/common';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuizGameTrm } from '../entities/quiz-game.entity';

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
    console.log(activeGame, 'service');
    return activeGame;
  }
}
