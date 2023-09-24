import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repository/comment.repository';

export class MakeLikeOrDislikeCCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public likeDto: LikeInputModel,
    public dateOfLikeDislike: Date,
  ) {}
}
@CommandHandler(MakeLikeOrDislikeCCommand)
export class MakeLikeOrDislikeUseCase
  implements ICommandHandler<MakeLikeOrDislikeCCommand>
{
  constructor(protected commentRepository: CommentRepository) {}

  async execute(command: MakeLikeOrDislikeCCommand): Promise<boolean> {
    const oldLikeOrDislikeOfUser =
      await this.commentRepository.findOldLikeOrDislike(
        command.commentId,
        command.userId,
      );

    if (oldLikeOrDislikeOfUser) {
      if (oldLikeOrDislikeOfUser.likeStatus === 'Like') {
        await this.commentRepository.deleteNumberOfLikes(command.commentId);
      } else if (oldLikeOrDislikeOfUser.likeStatus === 'Dislike') {
        await this.commentRepository.deleteNumberOfDislikes(command.commentId);
      }
      await this.commentRepository.deleteOldLikeDislike(
        command.commentId,
        command.userId,
      );
    }
    const newLikeInfo = {
      userId: command.userId,
      likeStatus: command.likeDto.likeStatus,
      dateOfLikeDislike: command.dateOfLikeDislike,
    };
    if (command.likeDto.likeStatus === 'Like')
      return this.commentRepository.updateNumberOfLikes(
        command.commentId,
        newLikeInfo,
      );

    if (command.likeDto.likeStatus === 'Dislike')
      return this.commentRepository.updateNumberOfDislikes(
        command.commentId,
        newLikeInfo,
      );
    return true;
  }
}
