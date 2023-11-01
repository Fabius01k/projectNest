import { QuestionInputModel } from '../../inputmodels-validation/question.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { NotFoundException } from '@nestjs/common';

export class UpdateQuestionCommand {
  constructor(
    public id: string,
    public questionDto: QuestionInputModel,
  ) {}
}
@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: UpdateQuestionCommand): Promise<boolean> {
    const updatedQuestion =
      await this.quizRepositoryTypeOrm.updateQuestionInDbTrm(
        command.id,
        command.questionDto.body,
        command.questionDto.correctAnswers,
      );
    if (!updatedQuestion) {
      throw new NotFoundException([
        {
          message: 'Question not found',
        },
      ]);
    }
    return true;
  }
}
