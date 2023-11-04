import { QuestionInputModel } from '../../inputmodels-validation/question.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { NotFoundException } from '@nestjs/common';
import { QuestionUpdatedInputModel } from '../../inputmodels-validation/question.updatedInputModel';

export class PublishQuestionCommand {
  constructor(
    public id: string,
    public publishDto: QuestionUpdatedInputModel,
  ) {}
}
@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: PublishQuestionCommand): Promise<boolean> {
    const publishQuestion =
      await this.quizRepositoryTypeOrm.publishQuestionInDbTrm(
        command.id,
        command.publishDto,
      );
    if (!publishQuestion) {
      throw new NotFoundException([
        {
          message: 'Question not found',
        },
      ]);
    }

    return true;
  }
}
