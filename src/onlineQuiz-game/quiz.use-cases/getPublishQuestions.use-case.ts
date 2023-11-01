import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositoryTypeOrm } from '../repository/quiz.repository.TypeOrm';
import { QuestionResponse } from '../entities/question.entity';

export class GetPublishQuestionsCommand {
  constructor(
    public bodySearchTerm: string,
    public publishedStatus: string,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
  ) {}
}

@CommandHandler(GetPublishQuestionsCommand)
export class GetPublishQuestionsUseCase
  implements ICommandHandler<GetPublishQuestionsCommand>
{
  constructor(protected quizRepositoryTypeOrm: QuizRepositoryTypeOrm) {}

  async execute(
    command: GetPublishQuestionsCommand,
  ): Promise<QuestionResponse> {
    let publishedStatus = true;

    if (command.publishedStatus !== 'all') {
      if (command.publishedStatus === 'published') {
        publishedStatus = true;
      } else if (command.publishedStatus === 'notPublished') {
        publishedStatus = false;
      }
    }
    return await this.quizRepositoryTypeOrm.findPublishQuestionsInDbTrm(
      command.bodySearchTerm,
      publishedStatus,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
