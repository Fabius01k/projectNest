import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../authNest/guards/bearer.guard';
import { AnswerView, QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { QuizGameService } from '../service/quiz-game.service';
import { CreateNewGameCommand } from '../quiz.use-cases/createNewGame.use-case';
import { JoinToActiveGameCommand } from '../quiz.use-cases/joinToActiveGame.use-case';
import { GetUnfinishedGameCommand } from '../quiz.use-cases/getUnfinishedGame.use-case';
import { GetGameByIdCommand } from '../quiz.use-cases/getGameById.use-case';
import { PostAnswerCommand } from '../quiz.use-cases/postAnswer.use-case';
console.log(1);
@Controller('pair-game-quiz')
export class QuizGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizGameService: QuizGameService,
  ) {}
  @UseGuards(AuthGuard)
  @Post('pairs/connection')
  async connectToTheGame(@Request() req): Promise<any> {
    await this.quizGameService.getActivePlayers(req.userId);

    const activeGame = await this.quizGameService.findActiveGameToConnect();
    if (!activeGame) {
      const newGame = await this.commandBus.execute(
        new CreateNewGameCommand(req.userId),
      );
      return newGame;
    }
    if (activeGame) {
      return await this.commandBus.execute(
        new JoinToActiveGameCommand(activeGame, req.userId),
      );
    }
  }
  @UseGuards(AuthGuard)
  @Get('pairs/my-current')
  async getUnfinishedGame(@Request() req): Promise<QuizGameView> {
    const game = await this.commandBus.execute(
      new GetUnfinishedGameCommand(req.userId),
    );
    return game;
  }
  @UseGuards(AuthGuard)
  @Get('pairs/:id')
  async getGameById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<QuizGameView> {
    const game = await this.commandBus.execute(
      new GetGameByIdCommand(req.userId, id),
    );
    return game;
  }
  @UseGuards(AuthGuard)
  @Post('pairs/my-current/answers')
  async postAnswer(
    @Body('answer') answer: string,
    @Request() req,
  ): Promise<AnswerView | null> {
    const userAnswer = await this.commandBus.execute(
      new PostAnswerCommand(req.userId, answer),
    );
    return userAnswer;
  }
}
