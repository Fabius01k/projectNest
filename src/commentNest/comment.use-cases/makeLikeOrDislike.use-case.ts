import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepositorySql } from '../repository/comment.repositorySql';
import { CommentRepositoryTypeOrm } from '../repository/comment.repositoryTypeOrm';

export class MakeLikeOrDislikeCCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public likeDto: LikeInputModel,
  ) {}
}
@CommandHandler(MakeLikeOrDislikeCCommand)
export class MakeLikeOrDislikeCommentUseCase
  implements ICommandHandler<MakeLikeOrDislikeCCommand>
{
  constructor(
    protected commentRepositorySql: CommentRepositorySql,
    protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm,
  ) {}

  async execute(command: MakeLikeOrDislikeCCommand): Promise<boolean> {
    const oldLikeOrDislikeOfUser =
      await this.commentRepositoryTypeOrm.findOldLikeOrDislikeTrm(
        command.commentId,
        command.userId,
      );

    if (oldLikeOrDislikeOfUser) {
      await this.commentRepositoryTypeOrm.deleteOldLikeDislikeTrm(
        command.commentId,
        command.userId,
      );
    }
    const newUsersReaction = {
      commentId: command.commentId,
      reactionStatus: command.likeDto.likeStatus,
      userId: command.userId,
    };
    await this.commentRepositoryTypeOrm.createNewReactionCommentTrm(
      newUsersReaction,
    );

    return true;
  }
}
