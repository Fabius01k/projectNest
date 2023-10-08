import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repository/comment.repository';
import { CommentRepositorySql } from '../repository/comment.repositorySql';

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
    protected commentRepository: CommentRepository,
    protected commentRepositorySql: CommentRepositorySql,
  ) {}

  async execute(command: MakeLikeOrDislikeCCommand): Promise<boolean> {
    const oldLikeOrDislikeOfUser =
      await this.commentRepositorySql.findOldLikeOrDislikeSql(
        command.commentId,
        command.userId,
      );

    if (oldLikeOrDislikeOfUser) {
      await this.commentRepositorySql.deleteOldLikeDislikeSql(
        command.commentId,
        command.userId,
      );
    }
    const newUsersReaction = {
      commentId: command.commentId,
      reactionStatus: command.likeDto.likeStatus,
      userId: command.userId,
    };
    await this.commentRepositorySql.createNewReactionCommentSql(
      newUsersReaction,
    );

    return true;
  }
}
