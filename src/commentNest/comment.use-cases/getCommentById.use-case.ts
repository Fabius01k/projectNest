import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentView } from '../schema/comment.schema';
import { NotFoundException } from '@nestjs/common';
import { CommentRepositorySql } from '../repository/comment.repositorySql';
import { CommentRepositoryTypeOrm } from '../repository/comment.repositoryTypeOrm';

export class GetCommentByIdCommand {
  constructor(
    public id: string,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetCommentByIdCommand)
export class GetCommentByIdUseCase
  implements ICommandHandler<GetCommentByIdCommand>
{
  constructor(
    protected commentRepositorySql: CommentRepositorySql,
    protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm,
  ) {}

  async execute(command: GetCommentByIdCommand): Promise<CommentView | null> {
    const comment = await this.commentRepositoryTypeOrm.findCommentByIdInDbTrm(
      command.id,
      command.userId,
    );
    if (!comment) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return comment;
  }
}
