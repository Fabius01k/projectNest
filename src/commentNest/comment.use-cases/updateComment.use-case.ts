import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repository/comment.repository';
import { NotFoundException } from '@nestjs/common';
import { CommentRepositorySql } from '../repository/comment.repositorySql';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public commentDto: CommentInputModel,
  ) {}
}
@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(
    protected commentRepository: CommentRepository,
    protected commentRepositorySql: CommentRepositorySql,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<boolean> {
    const updateComment = await this.commentRepositorySql.updateCommentInDbSql(
      command.commentId,
      command.commentDto.content,
    );
    if (!updateComment) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return true;
  }
}
