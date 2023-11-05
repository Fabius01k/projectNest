import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionResponse, QuestionTrm } from '../entities/question.entity';
import { Not, Repository } from 'typeorm';
import { PlayerTrm } from '../entities/player.entity';
import { QuizGameTrm } from '../entities/quiz-game.entity';
import { AnswerView, QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { UserAnswersTrm } from '../entities/user-answers.entity';
import { QuestionUpdatedInputModel } from '../../inputmodels-validation/question.updatedInputModel';

@Injectable()
export class QuizRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuestionTrm)
    protected questionRepository: Repository<QuestionTrm>,
    @InjectRepository(PlayerTrm)
    protected playerRepository: Repository<PlayerTrm>,
    @InjectRepository(QuizGameTrm)
    protected gameRepository: Repository<QuizGameTrm>,
    @InjectRepository(UserAnswersTrm)
    protected answerRepository: Repository<UserAnswersTrm>,
  ) {}
  private async mapGameForFirstPlayer(
    game: QuizGameTrm,
    player: PlayerTrm,
  ): Promise<QuizGameView> {
    // const firstPlayerScoresBuilder = await this.answerRepository
    //   .createQueryBuilder('UserAnswersTrm')
    //   .where('UserAnswersTrm.playerId = :playerId', {
    //     playerId: player.userId,
    //   })
    //   .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
    // const scores = await firstPlayerScoresBuilder.getCount();

    return {
      id: game.id,
      firstPlayerProgress: {
        answers: [],
        player: {
          id: player.userId,
          login: player.userLogin,
        },
        score: player.scoresNumberInGame,
      },
      // secondPlayerProgress: {
      //   answers: null,
      //   player: {
      //     id: null,
      //     login: null,
      //   },
      //   score: null,
      // },
      secondPlayerProgress: null,
      questions: null,
      status: game.status,
      pairCreatedDate: game.pairCreatedDate,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
    };
  }
  private async mapGameForSecondPlayer(
    newGame: QuizGameTrm,
    secondPlayer: PlayerTrm,
    newStatus: string,
    newPairCreatedDate: string,
    newStartGameDate: string,
  ): Promise<QuizGameView> {
    const firstPlayer = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: newGame.id })
      .getOne();

    // const firstPlayerScoresBuilder = await this.answerRepository
    //   .createQueryBuilder('UserAnswersTrm')
    //   .where('UserAnswersTrm.playerId = :playerId', {
    //     playerId: firstPlayer!.userId,
    //   })
    //   .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
    // const firstPlayerScores = await firstPlayerScoresBuilder.getCount();

    // const secondPlayerScoresBuilder = await this.answerRepository
    //   .createQueryBuilder('UserAnswersTrm')
    //   .where('UserAnswersTrm.playerId = :playerId', {
    //     playerId: secondPlayer.userId,
    //   })
    //   .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
    // const secondPlayerScores = await secondPlayerScoresBuilder.getCount();

    // const randomQuestions = await this.questionRepository
    //   .createQueryBuilder('QuestionTrm')
    //   .where('QuestionTrm.published = :published', { published: true })
    //   .orderBy('QuestionTrm.id', 'ASC')
    //   .limit(5)
    //   .getMany();
    // const questions: { id: string; body: string }[] = [];
    // for (const question of randomQuestions) {
    //   question.game = newGame;
    //   await this.questionRepository.save(question);
    // }
    // for (const question of randomQuestions) {
    //   questions.push({
    //     id: question.id,
    //     body: question.body,
    //   });
    // }
    const randomQuestions = await this.questionRepository
      .createQueryBuilder('QuestionTrm')
      .where('QuestionTrm.published = :published', { published: true })
      .orderBy('QuestionTrm.id', 'ASC')
      .limit(5)
      .getMany();
    const questions: { id: string; body: string }[] = [];

    const questionsId: string[] = [];

    randomQuestions.forEach((question) => {
      questionsId.push(question.id);
    });

    await this.gameRepository.update(
      { id: newGame.id },
      { questionsId: questionsId },
    );

    for (const question of randomQuestions) {
      questions.push({
        id: question.id,
        body: question.body,
      });
    }

    return {
      id: newGame.id,
      firstPlayerProgress: {
        answers: [],
        player: {
          id: firstPlayer!.userId,
          login: firstPlayer!.userLogin,
        },
        score: firstPlayer!.scoresNumberInGame,
      },
      secondPlayerProgress: {
        answers: [],
        player: {
          id: secondPlayer.userId,
          login: secondPlayer.userLogin,
        },
        score: secondPlayer.scoresNumberInGame,
      },
      questions: questions,
      status: newStatus,
      pairCreatedDate: newPairCreatedDate,
      startGameDate: newStartGameDate,
      finishGameDate: newGame.finishGameDate,
    };
  }
  // private async mapUnfinishedGame(
  //   unfinishedGame: QuizGameTrm,
  //   firstPlayer: PlayerTrm,
  // ): Promise<QuizGameView> {
  //   const secondPlayer = await this.playerRepository
  //     .createQueryBuilder('PlayerTrm')
  //     .where('PlayerTrm.gameId = :gameId', { gameId: unfinishedGame.id })
  //     .andWhere('PlayerTrm.userId != :userId', { userId: firstPlayer.userId })
  //     .getOne();
  //   const firstPlayerAnswersBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: firstPlayer.userId,
  //     })
  //     .getMany();
  //   const firstPlayerAnswers = firstPlayerAnswersBuilder.map((item) => ({
  //     questionId: item.questionId,
  //     answerStatus: item.answerStatus,
  //     addedAt: item.createdAt,
  //   }));
  //   const secondPlayerAnswersBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: secondPlayer!.userId,
  //     })
  //     .getMany();
  //   const secondPlayerAnswers = secondPlayerAnswersBuilder.map((item) => ({
  //     questionId: item.questionId,
  //     answerStatus: item.answerStatus,
  //     addedAt: item.createdAt,
  //   }));
  //   const firstPlayerScoresBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: firstPlayer!.userId,
  //     })
  //     .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
  //   const firstPlayerScores = await firstPlayerScoresBuilder.getCount();
  //
  //   const secondPlayerScoresBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: secondPlayer!.userId,
  //     })
  //     .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
  //   const secondPlayerScores = await secondPlayerScoresBuilder.getCount();
  //
  //   const questions = await this.questionRepository
  //     .createQueryBuilder('QuestionTrm')
  //     .select(['QuestionTrm.id', 'QuestionTrm.body'])
  //     .leftJoin(
  //       'QuestionTrm.game',
  //       'QuizGameTrm',
  //       'QuizGameTrm.id = QuestionTrm.gameId',
  //     )
  //     // .where('QuizGameTrm.id = :gameId', { gameId: unfinishedGame.id })
  //     .getMany();
  //   const formattedQuestions = questions.map((question) => ({
  //     id: question.id,
  //     body: question.body,
  //   }));
  //
  //   return {
  //     id: unfinishedGame.id,
  //     firstPlayerProgress: {
  //       answers: firstPlayerAnswers,
  //       player: {
  //         id: firstPlayer.userId,
  //         login: firstPlayer.userLogin,
  //       },
  //       score: firstPlayerScores,
  //     },
  //     secondPlayerProgress: {
  //       answers: secondPlayerAnswers,
  //       player: {
  //         id: secondPlayer!.id,
  //         login: secondPlayer!.userLogin,
  //       },
  //       score: secondPlayerScores,
  //     },
  //     questions: formattedQuestions,
  //     status: unfinishedGame.status,
  //     pairCreatedDate: unfinishedGame.pairCreatedDate,
  //     startGameDate: unfinishedGame.startGameDate,
  //     finishGameDate: unfinishedGame.finishGameDate,
  //   };
  // }
  private async mapUnfinishedGame(
    unfinishedGame: QuizGameTrm,
    player: PlayerTrm,
  ): Promise<QuizGameView> {
    const firstPlayerPromise = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: unfinishedGame.id })
      .andWhere('PlayerTrm.IsFirstInGame = :status', { status: true })
      .getOne();

    const secondPlayerPromise = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: unfinishedGame.id })
      .andWhere('PlayerTrm.userId != :userId', {
        userId: firstPlayerPromise!.userId,
      })
      .getOne();

    if (!secondPlayerPromise) {
      const firstPlayerAnswersPromise = await this.answerRepository
        .createQueryBuilder('UserAnswersTrm')
        .where('UserAnswersTrm.playerId = :playerId', {
          playerId: firstPlayerPromise!.id,
        })
        .getMany();

      return {
        id: unfinishedGame!.id,
        firstPlayerProgress: {
          answers: firstPlayerAnswersPromise.map((item) => ({
            questionId: item.questionId,
            answerStatus: item.answerStatus,
            addedAt: item.addedAt,
          })),
          player: {
            id: firstPlayerPromise!.userId,
            login: firstPlayerPromise!.userLogin,
          },
          score: firstPlayerPromise!.scoresNumberInGame,
        },
        secondPlayerProgress: null,
        questions: null,
        status: unfinishedGame!.status,
        pairCreatedDate: unfinishedGame!.pairCreatedDate,
        startGameDate: unfinishedGame!.startGameDate,
        finishGameDate: unfinishedGame!.finishGameDate,
      };
    }
    const firstPlayerAnswersPromise = this.answerRepository
      .createQueryBuilder('UserAnswersTrm')
      .where('UserAnswersTrm.playerId = :playerId', {
        playerId: firstPlayerPromise!.id,
      })
      .getMany();

    const secondPlayerAnswersPromise = this.answerRepository
      .createQueryBuilder('UserAnswersTrm')
      .where('UserAnswersTrm.playerId = :playerId', {
        playerId: (await secondPlayerPromise)?.id,
      })
      .getMany();

    // const firstPlayerScoresPromise = this.answerRepository
    //   .createQueryBuilder('UserAnswersTrm')
    //   .where('UserAnswersTrm.playerId = :playerId', {
    //     playerId: firstPlayer.userId,
    //   })
    //   .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' })
    //   .getCount();
    //
    // const secondPlayerScoresPromise = this.answerRepository
    //   .createQueryBuilder('UserAnswersTrm')
    //   .where('UserAnswersTrm.playerId = :playerId', {
    //     playerId: (await secondPlayerPromise)!.userId,
    //   })
    //   .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' })
    //   .getCount();

    // const questionsPromise = this.questionRepository
    //   .createQueryBuilder('QuestionTrm')
    //   .select(['QuestionTrm.id', 'QuestionTrm.body'])
    //   .leftJoin(
    //     'QuestionTrm.game',
    //     'QuizGameTrm',
    //     'QuizGameTrm.id = QuestionTrm.gameId',
    //   )
    //   .where('QuestionTrm.gameId = :gameId', { gameId: unfinishedGame.id })
    //   .getMany();

    const questionsPromise = this.questionRepository
      .createQueryBuilder('QuestionTrm')
      .select(['QuestionTrm.id', 'QuestionTrm.body'])
      .where('QuestionTrm.id IN (:...questionIds)', {
        questionIds: unfinishedGame.questionsId,
      })
      .getMany();

    const [secondPlayer, firstPlayerAnswers, secondPlayerAnswers, questions] =
      await Promise.all([
        secondPlayerPromise,
        firstPlayerAnswersPromise,
        secondPlayerAnswersPromise,
        questionsPromise,
      ]);

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      body: question.body,
    }));
    if (!secondPlayer) {
      return {
        id: unfinishedGame!.id,
        firstPlayerProgress: {
          answers: firstPlayerAnswers.map((item) => ({
            questionId: item.questionId,
            answerStatus: item.answerStatus,
            addedAt: item.addedAt,
          })),
          player: {
            id: firstPlayerPromise!.userId,
            login: firstPlayerPromise!.userLogin,
          },
          score: firstPlayerPromise!.scoresNumberInGame,
        },
        secondPlayerProgress: null,
        questions: null,
        status: unfinishedGame!.status,
        pairCreatedDate: unfinishedGame!.pairCreatedDate,
        startGameDate: unfinishedGame!.startGameDate,
        finishGameDate: unfinishedGame!.finishGameDate,
      };
    }

    return {
      id: unfinishedGame.id,
      firstPlayerProgress: {
        answers: firstPlayerAnswers.map((item) => ({
          questionId: item.questionId,
          answerStatus: item.answerStatus,
          addedAt: item.addedAt,
        })),
        player: {
          id: firstPlayerPromise!.userId,
          login: firstPlayerPromise!.userLogin,
        },
        score: firstPlayerPromise!.scoresNumberInGame,
      },
      secondPlayerProgress: {
        answers: secondPlayerAnswers.map((item) => ({
          questionId: item.questionId,
          answerStatus: item.answerStatus,
          addedAt: item.addedAt,
        })),
        player: {
          id: secondPlayer!.userId,
          login: secondPlayer!.userLogin,
        },
        score: secondPlayer!.scoresNumberInGame,
      },
      questions: formattedQuestions.length > 0 ? formattedQuestions : [],
      status: unfinishedGame.status,
      pairCreatedDate: unfinishedGame.pairCreatedDate,
      startGameDate: unfinishedGame.startGameDate,
      finishGameDate: unfinishedGame.finishGameDate,
    };
  }

  // private async mapGameById(
  //   game: QuizGameTrm,
  //   firstPlayer: PlayerTrm,
  // ): Promise<QuizGameView> {
  //   const secondPlayer = await this.playerRepository
  //     .createQueryBuilder('PlayerTrm')
  //     .where('PlayerTrm.gameId = :gameId', { gameId: game!.id })
  //     .andWhere('PlayerTrm.userId != :userId', { userId: firstPlayer.userId })
  //     .getOne();
  //   const firstPlayerAnswersBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: firstPlayer.userId,
  //     })
  //     .getMany();
  //   const firstPlayerAnswers = firstPlayerAnswersBuilder.map((item) => ({
  //     questionId: item.questionId,
  //     answerStatus: item.answerStatus,
  //     addedAt: item.createdAt,
  //   }));
  //   const secondPlayerAnswersBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: secondPlayer!.userId,
  //     })
  //     .getMany();
  //   const secondPlayerAnswers = secondPlayerAnswersBuilder.map((item) => ({
  //     questionId: item.questionId,
  //     answerStatus: item.answerStatus,
  //     addedAt: item.createdAt,
  //   }));
  //   const firstPlayerScoresBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: firstPlayer!.userId,
  //     })
  //     .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
  //   const firstPlayerScores = await firstPlayerScoresBuilder.getCount();
  //
  //   const secondPlayerScoresBuilder = await this.answerRepository
  //     .createQueryBuilder('UserAnswersTrm')
  //     .where('UserAnswersTrm.playerId = :playerId', {
  //       playerId: secondPlayer!.userId,
  //     })
  //     .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
  //   const secondPlayerScores = await secondPlayerScoresBuilder.getCount();
  //
  //   const questions = await this.questionRepository
  //     .createQueryBuilder('QuestionTrm')
  //     .select(['QuestionTrm.id', 'QuestionTrm.body'])
  //     .leftJoin(
  //       'QuestionTrm.game',
  //       'QuizGameTrm',
  //       'QuizGameTrm.id = QuestionTrm.gameId',
  //     )
  //     // .where('QuizGameTrm.id = :gameId', { gameId: unfinishedGame.id })
  //     .getMany();
  //   const formattedQuestions = questions.map((question) => ({
  //     id: question.id,
  //     body: question.body,
  //   }));
  //
  //   return {
  //     id: game!.id,
  //     firstPlayerProgress: {
  //       answers: firstPlayerAnswers,
  //       player: {
  //         id: firstPlayer.userId,
  //         login: firstPlayer.userLogin,
  //       },
  //       score: firstPlayerScores,
  //     },
  //     secondPlayerProgress: {
  //       answers: secondPlayerAnswers,
  //       player: {
  //         id: secondPlayer!.id,
  //         login: secondPlayer!.userLogin,
  //       },
  //       score: secondPlayerScores,
  //     },
  //     questions: formattedQuestions,
  //     status: game!.status,
  //     pairCreatedDate: game!.pairCreatedDate,
  //     startGameDate: game!.startGameDate,
  //     finishGameDate: game!.finishGameDate,
  //   };
  // }
  private async mapGameById(
    game: QuizGameTrm,
    firstPlayer: PlayerTrm,
  ): Promise<QuizGameView> {
    const firstPlayerPromise = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: game.id })
      .andWhere('PlayerTrm.IsFirstInGame = :status', { status: true })
      .getOne();

    const secondPlayerPromise = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: game!.id })
      .andWhere('PlayerTrm.userId != :userId', {
        userId: firstPlayerPromise!.userId,
      })
      .getOne();

    if (!secondPlayerPromise) {
      const firstPlayerAnswersPromise = await this.answerRepository
        .createQueryBuilder('UserAnswersTrm')
        .where('UserAnswersTrm.playerId = :playerId', {
          playerId: firstPlayerPromise!.id,
        })
        .getMany();

      return {
        id: game!.id,
        firstPlayerProgress: {
          answers: firstPlayerAnswersPromise.map((item) => ({
            questionId: item.questionId,
            answerStatus: item.answerStatus,
            addedAt: item.addedAt,
          })),
          player: {
            id: firstPlayerPromise!.userId,
            login: firstPlayerPromise!.userLogin,
          },
          score: firstPlayerPromise!.scoresNumberInGame,
        },
        secondPlayerProgress: null,
        questions: null,
        status: game!.status,
        pairCreatedDate: game!.pairCreatedDate,
        startGameDate: game!.startGameDate,
        finishGameDate: game!.finishGameDate,
      };
    }

    const firstPlayerAnswersPromise = this.answerRepository
      .createQueryBuilder('UserAnswersTrm')
      .where('UserAnswersTrm.playerId = :playerId', {
        playerId: firstPlayerPromise!.id,
      })
      .getMany();
    const secondPlayerAnswersPromise = await this.answerRepository
      .createQueryBuilder('UserAnswersTrm')
      .where('UserAnswersTrm.playerId = :playerId', {
        playerId: secondPlayerPromise?.id,
      })
      .getMany();

    // const secondPlayerAnswersPromise = secondPlayerPromise.then(
    //   (secondPlayer) =>
    //     this.answerRepository
    //       .createQueryBuilder('UserAnswersTrm')
    //       .where('UserAnswersTrm.playerId = :playerId', {
    //         playerId: secondPlayer?.userId,
    //       })
    //       .getMany(),
    // );

    // const firstPlayerScoresPromise = this.answerRepository
    //   .createQueryBuilder('UserAnswersTrm')
    //   .where('UserAnswersTrm.playerId = :playerId', {
    //     playerId: firstPlayer!.userId,
    //   })
    //   .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' })
    //   .getCount();
    //
    // const secondPlayerScoresPromise = secondPlayerPromise.then((secondPlayer) =>
    //   this.answerRepository
    //     .createQueryBuilder('UserAnswersTrm')
    //     .where('UserAnswersTrm.playerId = :playerId', {
    //       playerId: secondPlayer!.userId,
    //     })
    //     .andWhere('UserAnswersTrm.answerStatus = :status', {
    //       status: 'Correct',
    //     })
    //     .getCount(),
    // );

    // const questionsPromise = this.questionRepository
    //   .createQueryBuilder('QuestionTrm')
    //   .select(['QuestionTrm.id', 'QuestionTrm.body'])
    //   .leftJoin(
    //     'QuestionTrm.game',
    //     'QuizGameTrm',
    //     'QuizGameTrm.id = QuestionTrm.gameId',
    //   )
    //   .getMany();
    const questionsPromise = this.questionRepository
      .createQueryBuilder('QuestionTrm')
      .select(['QuestionTrm.id', 'QuestionTrm.body'])
      .where('QuestionTrm.id IN (:...questionIds)', {
        questionIds: game.questionsId,
      })
      .getMany();

    const [secondPlayer, firstPlayerAnswers, secondPlayerAnswers, questions] =
      await Promise.all([
        secondPlayerPromise,
        firstPlayerAnswersPromise,
        secondPlayerAnswersPromise,
        questionsPromise,
      ]);

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      body: question.body,
    }));

    if (!secondPlayer) {
      return {
        id: game!.id,
        firstPlayerProgress: {
          answers: firstPlayerAnswers.map((item) => ({
            questionId: item.questionId,
            answerStatus: item.answerStatus,
            addedAt: item.addedAt,
          })),
          player: {
            id: firstPlayerPromise!.userId,
            login: firstPlayerPromise!.userLogin,
          },
          score: firstPlayerPromise!.scoresNumberInGame,
        },
        secondPlayerProgress: null,
        questions: null,
        status: game!.status,
        pairCreatedDate: game!.pairCreatedDate,
        startGameDate: game!.startGameDate,
        finishGameDate: game!.finishGameDate,
      };
    }

    return {
      id: game!.id,
      firstPlayerProgress: {
        answers: firstPlayerAnswers.map((item) => ({
          questionId: item.questionId,
          answerStatus: item.answerStatus,
          addedAt: item.addedAt,
        })),
        player: {
          id: firstPlayerPromise!.userId,
          login: firstPlayerPromise!.userLogin,
        },
        score: firstPlayerPromise!.scoresNumberInGame,
      },
      secondPlayerProgress: {
        answers: secondPlayerAnswers.map((item) => ({
          questionId: item.questionId,
          answerStatus: item.answerStatus,
          addedAt: item.addedAt,
        })),
        player: {
          id: secondPlayer!.userId,
          login: secondPlayer!.userLogin,
        },
        score: secondPlayer!.scoresNumberInGame,
      },
      questions: formattedQuestions.length > 0 ? formattedQuestions : [],
      status: game!.status,
      pairCreatedDate: game!.pairCreatedDate,
      startGameDate: game!.startGameDate,
      finishGameDate: game!.finishGameDate,
    };
  }

  async findAllQuestionsInDbTrm(
    bodySearchTerm: string,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<QuestionResponse> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('QuestionTrm')
      .where(
        `${
          bodySearchTerm
            ? 'QuestionTrm.body ilike: bodySearchTerm'
            : 'QuestionTrm.body is not null'
        }`,
        { bodySearchTerm: `%${bodySearchTerm}%` },
      )
      .orderBy(
        'QuestionTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const items = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }
  async findPublishQuestionsInDbTrm(
    bodySearchTerm: string,
    publishedStatus,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<QuestionResponse> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('QuestionTrm')
      .where(
        `${
          bodySearchTerm
            ? 'QuestionTrm.body ilike: bodySearchTerm'
            : 'QuestionTrm.body is not null'
        }`,
        { bodySearchTerm: `%${bodySearchTerm}%` },
      )
      .andWhere('QuestionTrm.published =:publishedStatus', {
        publishedStatus: publishedStatus,
      })
      .orderBy(
        'QuestionTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const items = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }

  async createQuestionInDbTrm(newQuestion: QuestionTrm): Promise<QuestionTrm> {
    const createdQuestion = await this.questionRepository.save(newQuestion);

    return createdQuestion;
  }
  async deleteQuestionInDbTrm(id: string): Promise<boolean> {
    const deletedQuestion = await this.questionRepository.delete(id);
    return (
      deletedQuestion.affected !== null &&
      deletedQuestion.affected !== undefined &&
      deletedQuestion.affected > 0
    );
  }
  async updateQuestionInDbTrm(
    id: string,
    body: string,
    correctAnswers: string[],
  ): Promise<boolean> {
    const updatedQuestion = await this.questionRepository.update(
      { id: id },
      {
        body: body,
        correctAnswers: correctAnswers,
        updatedAt: new Date().toISOString(),
      },
    );

    return (
      updatedQuestion.affected !== null &&
      updatedQuestion.affected !== undefined &&
      updatedQuestion.affected > 0
    );
  }
  async publishQuestionInDbTrm(
    id: string,
    publishDto: QuestionUpdatedInputModel,
  ): Promise<boolean> {
    const publishedQuestion = await this.questionRepository.update(
      { id: id },
      { published: publishDto.published, updatedAt: new Date().toISOString() },
    );

    return (
      publishedQuestion.affected !== null &&
      publishedQuestion.affected !== undefined &&
      publishedQuestion.affected > 0
    );
  }
  // async findActivePlayersInDbTrm(userId: string): Promise<PlayerTrm[] | null> {
  //   const player: PlayerTrm[] = await this.playerRepository
  //     .createQueryBuilder('PlayerTrm')
  //     .where('PlayerTrm.userId = :userId', { userId: userId })
  //     // .andWhere('PlayerTrm.userStatus IN (:...statuses)', {
  //     //   statuses: ['Active', 'Winner', 'Loser', 'Draw'],
  //     // })
  //     .getMany();
  //
  //   if (player && player.length > 0) {
  //     return player;
  //   } else {
  //     return null;
  //   }
  // }
  async findActivePlayersInDbTrm(userId: string): Promise<PlayerTrm | null> {
    const player = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.userId = :userId', { userId: userId })
      .andWhere('PlayerTrm.userStatus = :status', { status: 'Active' })
      .getOne();

    if (player) {
      return player;
    } else {
      return null;
    }
  }
  async isUnfinishedGame(userId: string): Promise<boolean> {
    const player = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.userId = :userId', { userId: userId })
      .getOne();

    // const game = await this.gameRepository
    //   .createQueryBuilder('QuizGameTrm')
    //   .where('QuizGameTrm.id = :gameId', { gameId: player!.gameId })
    //   .andWhere('QuizGameTrm.status = :status', { status: 'Active' })
    //   .getOne();
    if (player) {
      return true;
    } else {
      return false;
    }
  }
  async isActiveGame(player: PlayerTrm): Promise<boolean | QuizGameTrm> {
    const game = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.id = :gameId', { gameId: player.gameId })
      .andWhere('QuizGameTrm.status = :status', { status: 'Active' })
      .getOne();
    if (game) {
      return game;
    } else {
      return false;
    }
  }
  async findNeedPlayersInDbTrm(
    userId: string,
    gameId: string,
  ): Promise<PlayerTrm | null> {
    const player = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: gameId })
      .andWhere('PlayerTrm.userId = :userId', { userId: userId })
      .getOne();

    if (player) {
      return player;
    } else {
      return null;
    }
  }

  // async findActivePlayersInDbTrm(userId: string): Promise<QuizGameTrm | null> {
  //   const player = await this.playerRepository.findOne({
  //     where: { userId: userId },
  //   });
  //   const activeGame = await this.gameRepository
  //     .createQueryBuilder('QuizGameTrm')
  //     .where('QuizGameTrm.id = :userId', { userId: player!.userId })
  //     .andWhere('PlayerTrm.userStatus = :status', { status: 'Active' })
  //     .orWhere('PlayerTrm.userStatus = :status', {
  //       status: 'PendingSecondPlayer',
  //     })
  //     .getOne();
  //
  //   if (activeGame) {
  //     return activeGame;
  //   } else {
  //     return null;
  //   }
  // }
  async findActiveGamesInDbTrm(): Promise<QuizGameTrm | null> {
    const activeGame = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.status = :status', { status: 'PendingSecondPlayer' })
      .getOne();
    // console.log(activeGame, 'repo');
    if (activeGame) {
      return activeGame;
    } else {
      return null;
    }
  }
  // async findUnfinishedGamesInDbTrm(
  //   player: PlayerTrm[],
  // ): Promise<QuizGameView | null> {
  //   const unfinishedGame = await this.gameRepository
  //     .createQueryBuilder('QuizGameTrm')
  //     .where('QuizGameTrm.id = :gameId', { gameId: player. })
  //     .andWhere('QuizGameTrm.status != :status', { status: 'Finished' })
  //     .getOne();
  //   if (!unfinishedGame) return null;
  //   return this.mapUnfinishedGame(unfinishedGame!, player);
  // }
  async findUnfinishedGamesInDbTrm(
    player: PlayerTrm,
  ): Promise<QuizGameView | null> {
    const unfinishedGame = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.id = :gameId', { gameId: player.gameId })
      .andWhere('QuizGameTrm.status != :status', { status: 'Finished' })
      .getOne();
    if (!unfinishedGame) return null;
    return this.mapUnfinishedGame(unfinishedGame!, player);
  }
  async findGame(gameId: string): Promise<boolean> {
    const game = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.id = :gameId', { gameId: gameId })
      .getOne();

    if (!game) {
      return false;
    } else {
      return true;
    }
  }
  async findGameByIdInDbTrm(
    player: PlayerTrm,
    gameId: string,
  ): Promise<QuizGameView> {
    const game = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.id = :gameId', { gameId: gameId })
      .getOne();

    if (!game) {
      throw new BadRequestException([
        {
          message: 'Game nof found',
        },
      ]);
    }
    return this.mapGameById(game!, player);
  }
  // async getPlayerOneInDbTrm(userId: string): Promise<PlayerTrm | null> {
  //   const player = await this.playerRepository
  //     .createQueryBuilder('PlayerTrm')
  //     .where('PlayerTrm.userId = :userId', { userId: userId })
  //     .getOne();
  //
  //   if (player) {
  //     return player;
  //   } else {
  //     return null;
  //   }
  // }
  async createNewPlayerInDbTrm(newPlayer: PlayerTrm): Promise<PlayerTrm> {
    const createdPlayer = await this.playerRepository.save(newPlayer);
    return createdPlayer;
  }
  async createNewGameInDbTrm(
    newGame: QuizGameTrm,
    newPlayer: PlayerTrm,
  ): Promise<QuizGameView> {
    const createdGame = await this.gameRepository.save(newGame);
    return this.mapGameForFirstPlayer(createdGame, newPlayer);
  }
  async joinSecondPlayerInGame(
    newGame: QuizGameTrm,
    secondPlayer: PlayerTrm,
  ): Promise<QuizGameView> {
    const newStatus = 'Active';
    const newPairCreatedDate = new Date().toISOString();
    const newStartGameDate = new Date().toISOString();
    await this.gameRepository.update(
      { id: newGame.id },
      {
        status: newStatus,
        pairCreatedDate: newPairCreatedDate,
        startGameDate: newStartGameDate,
      },
    );
    return this.mapGameForSecondPlayer(
      newGame,
      secondPlayer,
      newStatus,
      newPairCreatedDate,
      newStartGameDate,
    );
  }
  // async findQuestionsActiveGame(player: PlayerTrm): Promise<QuestionTrm[]> {
  //   const questions = await this.questionRepository
  //     .createQueryBuilder('QuestionTrm')
  //     .select([
  //       'QuestionTrm.id',
  //       'QuestionTrm.body',
  //       'QuestionTrm.correctAnswers',
  //     ])
  //     .leftJoin(
  //       'QuestionTrm.game',
  //       'QuizGameTrm',
  //       'QuizGameTrm.id = QuestionTrm.gameId',
  //     )
  //     .where('QuestionTrm.gameId = :gameId', { gameId: player.gameId })
  //     .getMany();
  //   return questions;
  // }
  async findQuestionsActiveGame(player: PlayerTrm): Promise<QuestionTrm[]> {
    const game = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.id = :gameId', { gameId: player.gameId })
      .getOne();

    const questionsPromise = await this.questionRepository
      .createQueryBuilder('QuestionTrm')
      .select([
        'QuestionTrm.id',
        'QuestionTrm.body',
        'QuestionTrm.correctAnswers',
      ])
      .where('QuestionTrm.id IN (:...questionIds)', {
        questionIds: game!.questionsId,
      })
      .getMany();
    return questionsPromise;
  }
  async allQu(): Promise<QuestionTrm[]> {
    const questions = await this.questionRepository.find();
    return questions;
  }
  // const questionsPromise = this.questionRepository
  //   .createQueryBuilder('QuestionTrm')
  //   .select(['QuestionTrm.id', 'QuestionTrm.body'])
  //   .leftJoin(
  //     'QuestionTrm.game',
  //     'QuizGameTrm',
  //     'QuizGameTrm.id = QuestionTrm.gameId',
  //   )
  //   .where('QuestionTrm.gameId = :gameId', { gameId: unfinishedGame.id })
  //   .getMany();

  async countFirstPlayerAnswers(player: PlayerTrm): Promise<number> {
    const firstNumber = await this.answerRepository
      .createQueryBuilder('UserAnswersTrm')
      .where('UserAnswersTrm.playerId = :playerId', {
        playerId: player.id,
      })
      .getCount();
    return firstNumber;
  }

  async countSecondPlayerAnswers(player: PlayerTrm): Promise<number> {
    const secondPlayerPromise = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: player.gameId })
      .andWhere('PlayerTrm.userId != :userId', { userId: player.userId })
      .getOne();

    const secondNumber = await this.answerRepository
      .createQueryBuilder('UserAnswersTrm')
      .where('UserAnswersTrm.playerId = :playerId', {
        playerId: secondPlayerPromise!.id,
      })
      .getCount();
    return secondNumber;
  }
  async createNewAnswer(newAnswer: UserAnswersTrm): Promise<AnswerView> {
    const createdAnswer = await this.answerRepository.save(newAnswer);
    // if (newAnswer.answerStatus === 'Correct') {
    //   const player = await this.playerRepository
    //     .createQueryBuilder('PlayerTrm')
    //     .where('PlayerTrm.userId =:userId', { userId: newAnswer.playerId })
    //     .getOne();
    //   const updatedScores = player!.scoresNumberInGame + 1;
    //   await this.playerRepository.update(
    //     { userId: newAnswer.playerId },
    //     { scoresNumberInGame: updatedScores },
    //   );
    // }
    if (newAnswer.answerStatus === 'Correct') {
      await this.playerRepository
        .createQueryBuilder()
        .update(PlayerTrm)
        .set({ scoresNumberInGame: () => 'scoresNumberInGame + 1' })
        .where('userId = :userId', { userId: newAnswer.playerId })
        .execute();
    }

    const answerView: AnswerView = {
      questionId: createdAnswer.questionId,
      answerStatus: createdAnswer.answerStatus,
      addedAt: createdAnswer.addedAt.toString(),
    };

    return answerView;
  }
  async finishTheGameInDbTrm(gameId: string): Promise<void> {
    await this.gameRepository.update(
      { id: gameId },
      { status: 'Finished', finishGameDate: new Date().toISOString() },
    );
  }
  async checkScoresFirstPlayer(userId: string): Promise<number> {
    const firstPlayerScoresBuilder = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.userId = :userId', { userId: userId })
      .getOne();
    return firstPlayerScoresBuilder!.scoresNumberInGame;
  }
  async checkRightAnswersFirstPlayer(userId: string): Promise<number> {
    const firstPlayerScoresBuilder = await this.answerRepository
      .createQueryBuilder('UserAnswersTrm')
      .where('UserAnswersTrm.playerId = :playerId', {
        playerId: userId,
      })
      .andWhere('UserAnswersTrm.answerStatus = :status', { status: 'Correct' });
    return await firstPlayerScoresBuilder.getCount();
  }

  async checkScoresSecondPlayer(player: PlayerTrm): Promise<number> {
    const secondPlayerPromise = await this.playerRepository
      .createQueryBuilder('PlayerTrm')
      .where('PlayerTrm.gameId = :gameId', { gameId: player.gameId })
      .andWhere('PlayerTrm.userId != :userId', { userId: player.userId })
      .getOne();

    return secondPlayerPromise!.scoresNumberInGame;
  }
  async takeExtraScore(firstPlayerFinishId: string): Promise<void> {
    await this.playerRepository
      .createQueryBuilder()
      .update(PlayerTrm)
      .set({ scoresNumberInGame: () => 'scoresNumberInGame + 1' })
      .where('userId = :userId', { userId: firstPlayerFinishId })
      .execute();
  }
  async makeMarkAboutTheFirstPlayer(player: PlayerTrm): Promise<void> {
    await this.gameRepository.update(
      { id: player.gameId },
      { firstPlayerFinishId: player.userId },
    );
  }
  // async makeFirstPlayerWin(player: PlayerTrm): Promise<void> {
  //   await this.playerRepository.update(
  //     { userId: player.userId },
  //     {
  //       userStatus: 'Winner',
  //     },
  //   );
  //   const secondPlayer = await this.playerRepository
  //     .createQueryBuilder('PlayerTrm')
  //     .where('PlayerTrm.gameId = :gameId', { gameId: player.gameId })
  //     .andWhere('PlayerTrm.userId != :userId', { userId: player.userId })
  //     .getOne();
  //
  //   await this.playerRepository.update(
  //     { userId: secondPlayer!.userId },
  //     {
  //       userStatus: 'Loser',
  //     },
  //   );
  // }
  async makeFirstPlayerWin(player: PlayerTrm): Promise<void> {
    await this.playerRepository.update(
      { userId: player.userId },
      { userStatus: 'Winner' },
    );

    const secondPlayer = await this.playerRepository.findOne({
      where: { gameId: player.gameId, userId: Not(player.userId) },
    });

    await this.playerRepository.update(
      { userId: secondPlayer!.userId },
      { userStatus: 'Loser' },
    );
  }
  async makeSecondPlayerWin(player: PlayerTrm): Promise<void> {
    await this.playerRepository.update(
      { userId: player.userId },
      { userStatus: 'Loser' },
    );

    const secondPlayer = await this.playerRepository.findOne({
      where: { gameId: player.gameId, userId: Not(player.userId) },
    });

    await this.playerRepository.update(
      { userId: secondPlayer!.userId },
      { userStatus: 'Winner' },
    );
  }
  async notAWinner(player: PlayerTrm): Promise<void> {
    await this.playerRepository.update(
      { userId: player.userId },
      { userStatus: 'Draw' },
    );

    const secondPlayer = await this.playerRepository.findOne({
      where: { gameId: player.gameId, userId: Not(player.userId) },
    });

    await this.playerRepository.update(
      { userId: secondPlayer!.userId },
      { userStatus: 'Draw' },
    );
  }
  async findFinishedPlayer(gameId: string): Promise<boolean> {
    const firstFinishedPlayer = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.id = :id', { id: gameId })
      .getOne();
    if (firstFinishedPlayer!.firstPlayerFinishId) {
      return true;
    } else {
      return false;
    }
  }
  async findGameBeforeFinish(gameId: string): Promise<QuizGameTrm> {
    const game = await this.gameRepository
      .createQueryBuilder('QuizGameTrm')
      .where('QuizGameTrm.id = :id', { id: gameId })
      .getOne();
    return game!;
  }
}
