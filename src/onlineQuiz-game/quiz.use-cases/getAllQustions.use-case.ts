import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuestionResponse } from '../entities/question.entity';

export class GetAllQuestionsCommand {
  constructor(
    public bodySearchTerm: string,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
  ) {}
}

@CommandHandler(GetAllQuestionsCommand)
export class GetAllQuestionsUseCase
  implements ICommandHandler<GetAllQuestionsCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(command: GetAllQuestionsCommand): Promise<QuestionResponse> {
    return await this.quizRepositoryTypeOrm.findAllQuestionsInDbTrm(
      command.bodySearchTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
