import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';

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
export class MakeLikeOrDislikeUseCase
  implements ICommandHandler<MakeLikeOrDislikePCommand>
{
  constructor(protected postRepository: PostRepository) {}

  async execute(command: MakeLikeOrDislikePCommand): Promise<boolean> {
    const oldLikeOrDislikeOfUser =
      await this.postRepository.findOldLikeOrDislike(
        command.postId,
        command.userId,
      );

    if (oldLikeOrDislikeOfUser) {
      if (oldLikeOrDislikeOfUser.likeStatus === 'Like') {
        await this.postRepository.deleteNumberOfLikes(command.postId);
      } else if (oldLikeOrDislikeOfUser.likeStatus === 'Dislike') {
        await this.postRepository.deleteNumberOfDislikes(command.postId);
      }
      await this.postRepository.deleteOldLikeDislike(
        command.postId,
        command.userId,
      );
    }
    const newLikeInfo = {
      userId: command.userId,
      login: command.login,
      likeStatus: command.likeDto.likeStatus,
      dateOfLikeDislike: command.dateOfLikeDislike,
    };
    if (command.likeDto.likeStatus === 'Like')
      return this.postRepository.updateNumberOfLikes(
        command.postId,
        newLikeInfo,
      );

    if (command.likeDto.likeStatus === 'Dislike')
      return this.postRepository.updateNumberOfDislikes(
        command.postId,
        newLikeInfo,
      );
    return true;
  }
}
