import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepositoryTypeOrm } from '../../commentNest/repository/comment.repositoryTypeOrm';
import { CommentForCurrentBloggerResponse } from '../../commentNest/schema/comment.schema';

export class GetAllCommentsForCurrentBloggerCommand {
  constructor(
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public userId: string,
  ) {}
}
@CommandHandler(GetAllCommentsForCurrentBloggerCommand)
export class GetAllCommentsForCurrentBloggerUseCase
  implements ICommandHandler<GetAllCommentsForCurrentBloggerCommand>
{
  constructor(protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm) {}
  async execute(
    command: GetAllCommentsForCurrentBloggerCommand,
  ): Promise<CommentForCurrentBloggerResponse> {
    return await this.commentRepositoryTypeOrm.findAllCommentsForCurrentBloggerInDbTrm(
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.userId,
    );
  }
}
