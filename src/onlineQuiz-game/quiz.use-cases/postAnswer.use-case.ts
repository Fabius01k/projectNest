import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { AnswerView, QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserAnswersTrm } from '../entities/user-answers.entity';

export class PostAnswerCommand {
  constructor(
    public userId: string,
    public answer: string,
  ) {}
}
@CommandHandler(PostAnswerCommand)
export class PostAnswerUseCase implements ICommandHandler<PostAnswerCommand> {
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: PostAnswerCommand): Promise<any | null> {
    const player = await this.quizRepositoryTypeOrm.findActivePlayersInDbTrm(
      command.userId,
    );

    if (!player) {
      throw new ForbiddenException([
        {
          message: "You don't have any active games",
        },
      ]);
    }
    const isActiveGame = await this.quizRepositoryTypeOrm.isActiveGame(player);

    if (!isActiveGame) {
      throw new ForbiddenException([
        {
          message: "You don't have any active games",
        },
      ]);
    }

    const gameQuestions =
      await this.quizRepositoryTypeOrm.findQuestionsActiveGame(player);

    const firstPlayerAnswers =
      await this.quizRepositoryTypeOrm.countFirstPlayerAnswers(player);
    const secondPlayerAnswers =
      await this.quizRepositoryTypeOrm.countSecondPlayerAnswers(player);

    if (firstPlayerAnswers === 0) {
      const checkAnswer = gameQuestions[0].correctAnswers.includes(
        command.answer,
      );
      let userAnswer: string;

      if (checkAnswer) {
        userAnswer = 'Correct';
      } else {
        userAnswer = 'Incorrect';
      }
      const newAnswer = new UserAnswersTrm();
      newAnswer.id = new Date().getTime().toString();
      newAnswer.playerId = player.id;
      newAnswer.questionId = gameQuestions[0].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 1) {
      // console.log(gameQuestions[1].correctAnswers, '1');
      const checkAnswer = gameQuestions[1].correctAnswers.includes(
        command.answer,
      );
      let userAnswer: string;

      if (checkAnswer) {
        userAnswer = 'Correct';
      } else {
        userAnswer = 'Incorrect';
      }
      const newAnswer = new UserAnswersTrm();
      newAnswer.id = new Date().getTime().toString();
      newAnswer.playerId = player.id;
      newAnswer.questionId = gameQuestions[1].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 2) {
      console.log(gameQuestions[2].correctAnswers, '2');
      const checkAnswer = gameQuestions[2].correctAnswers.includes(
        command.answer,
      );
      let userAnswer: string;

      if (checkAnswer) {
        userAnswer = 'Correct';
      } else {
        userAnswer = 'Incorrect';
      }
      const newAnswer = new UserAnswersTrm();
      newAnswer.id = new Date().getTime().toString();
      newAnswer.playerId = player.id;
      newAnswer.questionId = gameQuestions[2].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 3) {
      // console.log(gameQuestions[3].correctAnswers, '3');
      const checkAnswer = gameQuestions[3].correctAnswers.includes(
        command.answer,
      );
      let userAnswer: string;

      if (checkAnswer) {
        userAnswer = 'Correct';
      } else {
        userAnswer = 'Incorrect';
      }
      const newAnswer = new UserAnswersTrm();
      newAnswer.id = new Date().getTime().toString();
      newAnswer.playerId = player.id;
      newAnswer.questionId = gameQuestions[3].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 4 && secondPlayerAnswers < 5) {
      const checkAnswer = gameQuestions[4].correctAnswers.includes(
        command.answer,
      );
      let userAnswer: string;

      if (checkAnswer) {
        userAnswer = 'Correct';
      } else {
        userAnswer = 'Incorrect';
      }
      const firstFinishedPlayerInGame =
        await this.quizRepositoryTypeOrm.findFinishedPlayer(player.gameId);

      if (!firstFinishedPlayerInGame) {
        const rightAnswersFirstPlayer =
          await this.quizRepositoryTypeOrm.checkRightAnswersFirstPlayer(player);
        if (rightAnswersFirstPlayer >= 1 || userAnswer === 'Correct') {
          await this.quizRepositoryTypeOrm.makeMarkAboutTheFirstPlayer(player);
        }
      }
      const newAnswer = new UserAnswersTrm();
      newAnswer.id = new Date().getTime().toString();
      newAnswer.playerId = player.id;
      newAnswer.questionId = gameQuestions[4].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      const lastAnswerFirstPlayer =
        await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);

      // setTimeout(async () => {
      //   secondPlayerAnswersAfterTenSeconds =
      //     await this.quizRepositoryTypeOrm.countSecondPlayerAnswers(player);
      // }, 10000);
      //
      // const unansweredQuestionsSecondPlayer =
      //   5 - secondPlayerAnswersAfterTenSeconds;

      setTimeout(async () => {
        const secondPlayer =
          await this.quizRepositoryTypeOrm.findSecondPlayer(player);
        const secondPlayerAnswersAfterTenSeconds =
          await this.quizRepositoryTypeOrm.countSecondPlayerAnswers(player);

        const unansweredQuestionsSecondPlayer =
          5 - secondPlayerAnswersAfterTenSeconds;

        if (unansweredQuestionsSecondPlayer > 0) {
          console.log(
            unansweredQuestionsSecondPlayer,
            'unansweredQuestionsSecondPlayer',
          );
          console.log(
            secondPlayerAnswersAfterTenSeconds,
            'secondPlayerAnswersAfterTenSeconds',
          );

          // const unansweredQuestionsIndex = unansweredQuestionsSecondPlayer - 1;

          for (let i = 0; i < unansweredQuestionsSecondPlayer; i++) {
            const noAnswer = new UserAnswersTrm();
            noAnswer.id = new Date().getTime().toString();
            noAnswer.playerId = secondPlayer.id;
            noAnswer.questionId =
              gameQuestions[secondPlayerAnswersAfterTenSeconds + i].id;
            noAnswer.answerStatus = 'Incorrect';
            noAnswer.addedAt = new Date().toISOString();

            await this.quizRepositoryTypeOrm.createNewAnswer(noAnswer);
          }
        }
        const gameBeforeFinish =
          await this.quizRepositoryTypeOrm.findGameBeforeFinish(player.gameId);
        if (gameBeforeFinish.firstPlayerFinishId) {
          await this.quizRepositoryTypeOrm.takeExtraScore(
            gameBeforeFinish.firstPlayerFinishId,
          );
        }

        await this.quizRepositoryTypeOrm.finishTheGameInDbTrm(player.gameId);

        const firstPlayerScoresFinally =
          await this.quizRepositoryTypeOrm.checkScoresFirstPlayer(player);
        const secondPlayerScoresFinally =
          await this.quizRepositoryTypeOrm.checkScoresSecondPlayer(player);

        console.log(firstPlayerScoresFinally, 'очки первого игрока');
        console.log(secondPlayerScoresFinally, 'очки второго игрока');

        if (firstPlayerScoresFinally > secondPlayerScoresFinally) {
          await this.quizRepositoryTypeOrm.makeFirstPlayerWin(player);
        }
        if (firstPlayerScoresFinally < secondPlayerScoresFinally) {
          await this.quizRepositoryTypeOrm.makeSecondPlayerWin(player);
        }
        if (firstPlayerScoresFinally === secondPlayerScoresFinally) {
          await this.quizRepositoryTypeOrm.notAWinner(player);
        }
      }, 10000);

      return lastAnswerFirstPlayer;

      // return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 4 && secondPlayerAnswers === 5) {
      const checkAnswer = gameQuestions[4].correctAnswers.includes(
        command.answer,
      );
      let userAnswer: string;

      if (checkAnswer) {
        userAnswer = 'Correct';
      } else {
        userAnswer = 'Incorrect';
      }

      const newAnswer = new UserAnswersTrm();
      newAnswer.id = new Date().getTime().toString();
      newAnswer.playerId = player.id;
      newAnswer.questionId = gameQuestions[4].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      const lastAnswer =
        await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
      const gameBeforeFinish =
        await this.quizRepositoryTypeOrm.findGameBeforeFinish(player.gameId);
      if (gameBeforeFinish.firstPlayerFinishId) {
        await this.quizRepositoryTypeOrm.takeExtraScore(
          gameBeforeFinish.firstPlayerFinishId,
        );
      }

      await this.quizRepositoryTypeOrm.finishTheGameInDbTrm(player.gameId);

      const firstPlayerScoresFinally =
        await this.quizRepositoryTypeOrm.checkScoresFirstPlayer(player);
      const secondPlayerScoresFinally =
        await this.quizRepositoryTypeOrm.checkScoresSecondPlayer(player);

      console.log(firstPlayerScoresFinally, 'очки первого игрока');
      console.log(secondPlayerScoresFinally, 'очки второго игрока');

      if (firstPlayerScoresFinally > secondPlayerScoresFinally) {
        await this.quizRepositoryTypeOrm.makeFirstPlayerWin(player);
      }
      if (firstPlayerScoresFinally < secondPlayerScoresFinally) {
        await this.quizRepositoryTypeOrm.makeSecondPlayerWin(player);
      }
      if (firstPlayerScoresFinally === secondPlayerScoresFinally) {
        await this.quizRepositoryTypeOrm.notAWinner(player);
      }

      return lastAnswer;
    }
    if (firstPlayerAnswers === 5) {
      throw new ForbiddenException([
        {
          message:
            'You have answered all the questions, wait for the end of the game',
        },
      ]);
    }
  }
}
