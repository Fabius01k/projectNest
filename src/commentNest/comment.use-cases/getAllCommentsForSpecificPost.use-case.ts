import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentResponse } from '../schema/comment.schema';
import { CommentRepositorySql } from '../repository/comment.repositorySql';
import { CommentRepositoryTypeOrm } from '../repository/comment.repositoryTypeOrm';

export class GetAllCommentsForSpecificPostCommand {
  constructor(
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public postId: string,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetAllCommentsForSpecificPostCommand)
export class GetAllCommentsForSpecificPostUseCase
  implements ICommandHandler<GetAllCommentsForSpecificPostCommand>
{
  constructor(
    protected commentRepositorySql: CommentRepositorySql,
    protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm,
  ) {}

  async execute(
    command: GetAllCommentsForSpecificPostCommand,
  ): Promise<CommentResponse> {
    return await this.commentRepositoryTypeOrm.findAllCommentsForSpecifeldPostInDbTrm(
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.postId,
      command.userId,
    );
  }
}
