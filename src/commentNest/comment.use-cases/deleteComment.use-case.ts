import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommentRepositorySql } from '../repository/comment.repositorySql';

export class DeleteCommentCommand {
  constructor(public commentId: string) {}
}
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(protected commentRepositorySql: CommentRepositorySql) {}

  async execute(command: DeleteCommentCommand): Promise<boolean> {
    const commentDeleted = await this.commentRepositorySql.deleteCommentInDbSql(
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
