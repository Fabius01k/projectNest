import { QuestionInputModel } from '../../inputmodels-validation/question.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { NotFoundException } from '@nestjs/common';

export class PublishQuestionCommand {
  constructor(
    public id: string,
    public published: boolean,
  ) {}
}
@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: PublishQuestionCommand): Promise<boolean> {
    await this.quizRepositoryTypeOrm.publishQuestionInDbTrm(
      command.id,
      command.published,
    );

    return true;
  }
}
