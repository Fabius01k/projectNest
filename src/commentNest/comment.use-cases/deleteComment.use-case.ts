import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommentRepositorySql } from '../repository/comment.repositorySql';
import { CommentRepositoryTypeOrm } from '../repository/comment.repositoryTypeOrm';

export class DeleteCommentCommand {
  constructor(public commentId: string) {}
}
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    protected commentRepositorySql: CommentRepositorySql,
    protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<boolean> {
    console.log(command);
    const commentDeleted =
      await this.commentRepositoryTypeOrm.deleteCommentInDbTrm(
        command.commentId,
      );

    if (!commentDeleted) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return true;
  }
}
