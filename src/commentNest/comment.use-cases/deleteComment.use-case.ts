import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repository/comment.repository';
import { NotFoundException } from '@nestjs/common';

export class DeleteCommentCommand {
  constructor(public commentId: string) {}
}
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(protected commentRepository: CommentRepository) {}

  async execute(command: DeleteCommentCommand): Promise<boolean> {
    const commentDeleted = await this.commentRepository.deleteCommentInDb(
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
