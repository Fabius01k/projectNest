import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';

export class MakeLikeOrDislikePCommand {
  constructor(
    public userId: string,
    public login: string,
    public postId: string,
    public likeDto: LikeInputModel,
    public dateOfLikeDislike: Date,
  ) {}
}
@CommandHandler(MakeLikeOrDislikePCommand)
export class MakeLikeOrDislikePostUseCase
  implements ICommandHandler<MakeLikeOrDislikePCommand>
{
  constructor(
    protected postRepositorySql: PostRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
  ) {}

  async execute(command: MakeLikeOrDislikePCommand): Promise<boolean> {
    const oldLikeOrDislikeOfUser =
      await this.postRepositoryTypeOrm.findOldLikeOrDislikeTrm(
        command.postId,
        command.userId,
      );

    if (oldLikeOrDislikeOfUser) {
      await this.postRepositoryTypeOrm.deleteOldLikeDislikeTrm(
        command.postId,
        command.userId,
      );
    }
    const newUsersReaction = {
      postId: command.postId,
      userLogin: command.login,
      reactionStatus: command.likeDto.likeStatus,
      addedAt: command.dateOfLikeDislike,
      userId: command.userId,
    };
    await this.postRepositoryTypeOrm.createNewReactionPostTrm(newUsersReaction);

    return true;
  }
}
