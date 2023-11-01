import { QuestionInputModel } from '../../inputmodels-validation/question.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuestionTrm } from '../entities/question.entity';

export class CreateQuestionCommand {
  constructor(public questionDto: QuestionInputModel) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: CreateQuestionCommand): Promise<QuestionTrm> {
    const dateNow = new Date().getTime().toString();

    const newQuestion = new QuestionTrm();
    newQuestion.id = dateNow;
    newQuestion.body = command.questionDto.body;
    newQuestion.correctAnswers = command.questionDto.correctAnswers;
    newQuestion.published = false;
    newQuestion.createdAt = new Date().toISOString();
    newQuestion.updatedAt = new Date().toISOString();
    console.log(newQuestion, 'use-cases');

    return await this.quizRepositoryTypeOrm.createQuestionInDbTrm(newQuestion);
  }
}
