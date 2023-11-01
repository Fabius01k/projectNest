import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { AnswerView, QuizGameView } from '../viewModels/quiz-game.wiew-model';
import { NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException([
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
      newAnswer.playerId = player.userId;
      newAnswer.questionId = gameQuestions[0].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 1) {
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
      newAnswer.playerId = player.userId;
      newAnswer.questionId = gameQuestions[1].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 2) {
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
      newAnswer.playerId = player.userId;
      newAnswer.questionId = gameQuestions[2].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 3) {
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
      newAnswer.playerId = player.userId;
      newAnswer.questionId = gameQuestions[3].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 4) {
      // if (firstPlayerAnswers === 4 && secondPlayerAnswers === 4) {
      //   const checkAnswer = gameQuestions[4].correctAnswers.includes(
      //     command.answer,
      //   );
      //   let userAnswer: string;
      //
      //   if (checkAnswer) {
      //     userAnswer = 'Correct';
      //   } else {
      //     userAnswer = 'Incorrect';
      //   }
      //   const rightAnswersFirstPlayer =
      //     await this.quizRepositoryTypeOrm.checkRightAnswersFirstPlayer(
      //       player.userId,
      //     );
      //   if (rightAnswersFirstPlayer >= 1 || userAnswer === 'Correct') {
      //   }
      // }
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

        const rightAnswersFirstPlayer =
          await this.quizRepositoryTypeOrm.checkRightAnswersFirstPlayer(
            player.userId,
          );
        const rightAnswersSecondPlayer =
          await this.quizRepositoryTypeOrm.checkRightAnswersSecondPlayer(
            player,
          );

        if (rightAnswersSecondPlayer >= 1) {
          await this.quizRepositoryTypeOrm.takeExtraScoreForSecondPlayer(
            player,
          );
        }
        // if (
        //   (rightAnswersSecondPlayer === 0 && rightAnswersFirstPlayer >= 1) ||
        //   userAnswer === 'Correct'
        // ) {
        //   await this.quizRepositoryTypeOrm.takeExtraScoreForFirstPlayer(player);
        // }
        const newAnswer = new UserAnswersTrm();
        newAnswer.id = new Date().getTime().toString();
        newAnswer.playerId = player.userId;
        newAnswer.questionId = gameQuestions[4].id;
        newAnswer.answerStatus = userAnswer;
        newAnswer.addedAt = new Date().toISOString();
        const lastAnswer =
          await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);

        await this.quizRepositoryTypeOrm.finishTheGameInDbTrm(player.gameId);

        const firstPlayerAnswersFinally =
          await this.quizRepositoryTypeOrm.countFirstPlayerAnswers(player);
        const secondPlayerAnswersFinnaly =
          await this.quizRepositoryTypeOrm.countSecondPlayerAnswers(player);

        if (firstPlayerAnswersFinally > secondPlayerAnswers) {
          await this.quizRepositoryTypeOrm.makeFirstPlayerWin(player);
        }
        if (firstPlayerAnswersFinally < secondPlayerAnswers) {
          await this.quizRepositoryTypeOrm.makeSecondPlayerWin(player);
        }
        if (firstPlayerAnswersFinally === secondPlayerAnswers) {
          await this.quizRepositoryTypeOrm.notAWinner(player);
        }

        return lastAnswer;
      }

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
      newAnswer.playerId = player.userId;
      newAnswer.questionId = gameQuestions[4].id;
      newAnswer.answerStatus = userAnswer;
      newAnswer.addedAt = new Date().toISOString();

      return await this.quizRepositoryTypeOrm.createNewAnswer(newAnswer);
    }
    if (firstPlayerAnswers === 5) {
      throw new NotFoundException([
        {
          message:
            'You have answered all the questions, wait for the end of the game',
        },
      ]);
    }
  }
}
