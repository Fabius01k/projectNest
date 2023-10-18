import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommentRepositorySql } from '../repository/comment.repositorySql';
import { CommentRepositoryTypeOrm } from '../repository/comment.repositoryTypeOrm';

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
    protected commentRepositorySql: CommentRepositorySql,
    protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<boolean> {
    const updateComment =
      await this.commentRepositoryTypeOrm.updateCommentInDbTrm(
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
