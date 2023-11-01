import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { NotFoundException } from '@nestjs/common';

export class DeleteQuestionCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: DeleteQuestionCommand): Promise<boolean> {
    const questionDeleted =
      await this.quizRepositoryTypeOrm.deleteQuestionInDbTrm(command.id);
    if (!questionDeleted) {
      throw new NotFoundException([
        {
          message: 'Question not found',
        },
      ]);
    }
    return true;
  }
}
