import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../authNest/guards/bearer.guard';
import {
  AnswerView,
  GameResponse,
  QuizGameView,
  TopUsersResponse,
} from '../viewModels/quiz-game.wiew-model';
import { QuizGameService } from '../service/quiz-game.service';
import { CreateNewGameCommand } from '../quiz.use-cases/createNewGame.use-case';
import { JoinToActiveGameCommand } from '../quiz.use-cases/joinToActiveGame.use-case';
import { GetUnfinishedGameCommand } from '../quiz.use-cases/getUnfinishedGame.use-case';
import { GetGameByIdCommand } from '../quiz.use-cases/getGameById.use-case';
import { PostAnswerCommand } from '../quiz.use-cases/postAnswer.use-case';
import { PlayerStatisticsView } from '../viewModels/player-statistics.view.model';
import { GetAllMyGamesCommand } from '../quiz.use-cases/getAllMyGames.use-case';
import { GetTopUsersCommand } from '../quiz.use-cases/getTopUsers.use-case';
import { Public } from '../../authNest/decorations/public.decoration';
@UseGuards(AuthGuard)
@Controller('pair-game-quiz')
export class QuizGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizGameService: QuizGameService,
  ) {}
  @Public()
  @Get('users/top')
  @HttpCode(200)
  async getTopUsers(
    @Query('sort') sort: string[],
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<TopUsersResponse> {
    console.log(sort);
    // if (!sort || sort.length === 0) {
    //   sort = ['avgScores desc', 'sumScore desc'];
    // }
    if (!sort || sort.length === 0) {
      sort = ['avgScores desc', 'sumScore desc'];
    } else if (typeof sort === 'string') {
      sort = [sort];
    } else if (
      typeof sort === 'object' &&
      sort.length === 1 &&
      typeof sort[0] === 'string'
    ) {
      sort = [sort[0]];
    }
    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = 10;
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = 1;
    }
    return await this.commandBus.execute(
      new GetTopUsersCommand(sort, pageSize, pageNumber),
    );
  }

  @Get('pairs/my')
  @HttpCode(200)
  async getAllMyGames(
    @Request() req,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<GameResponse> {
    if (!sortBy) {
      sortBy = 'pairCreatedDate';
    }
    // const firstSortBy = sortBy[0];
    // const secondSortBy = sortBy[1] || 'pairCreatedDate';

    if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
      sortDirection = 'desc';
    }

    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = 10;
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = 1;
    }

    return await this.commandBus.execute(
      new GetAllMyGamesCommand(
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        req.userId,
      ),
    );
  }
  // @UseGuards(AuthGuard)
  @Post('pairs/connection')
  @HttpCode(200)
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
  // @UseGuards(AuthGuard)
  @Get('pairs/my-current')
  @HttpCode(200)
  async getUnfinishedGame(@Request() req): Promise<QuizGameView> {
    const game = await this.commandBus.execute(
      new GetUnfinishedGameCommand(req.userId),
    );
    return game;
  }
  // @UseGuards(AuthGuard)
  @Get('pairs/:id')
  @HttpCode(200)
  async getGameById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<QuizGameView> {
    if (isNaN(Number(id))) {
      throw new BadRequestException([
        {
          message: 'Incorrect id format',
        },
      ]);
    }
    const game = await this.commandBus.execute(
      new GetGameByIdCommand(req.userId, id),
    );
    return game;
  }
  // @UseGuards(AuthGuard)
  @Post('pairs/my-current/answers')
  @HttpCode(200)
  async postAnswer(
    @Body('answer') answer: string,
    @Request() req,
  ): Promise<AnswerView | null> {
    const userAnswer = await this.commandBus.execute(
      new PostAnswerCommand(req.userId, answer),
    );

    return userAnswer;
  }

  // @UseGuards(AuthGuard)
  @Get('users/my-statistic')
  @HttpCode(200)
  async getStatisticAboutPlayer(
    @Request() req,
  ): Promise<PlayerStatisticsView | null> {
    const statistic = await this.quizGameService.getPlayersStatistic(
      req.userId,
    );
    return statistic;
  }
}
