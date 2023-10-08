import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repository/comment.repository';
import { CommentResponse } from '../schema/comment.schema';
import { CommentRepositorySql } from '../repository/comment.repositorySql';

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
    protected commentRepository: CommentRepository,
    protected commentRepositorySql: CommentRepositorySql,
  ) {}

  async execute(
    command: GetAllCommentsForSpecificPostCommand,
  ): Promise<CommentResponse> {
    return await this.commentRepositorySql.findAllCommentsForSpecifeldPostInDbSql(
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.postId,
      command.userId,
    );
  }
}
