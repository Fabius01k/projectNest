import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repository/comment.repository';
import { UserRepository } from '../../userNest/repository/user.repository';
import { Comment, CommentView } from '../schema/comment.schema';
import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InformationOfLikeAndDislikeComment } from '../schema/likeOrDislikeInfoComment.schema';
import { PostRepository } from '../../postNest/repository/post.repository';

export class CreateCommentCommand {
  constructor(
    public commentDto: CommentInputModel,
    public postId: string,
    public userId: string,
  ) {}
}
@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    protected commentRepository: CommentRepository,
    protected userRepository: UserRepository,
    protected postRepository: PostRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentView | null> {
    const dateNow = new Date().getTime().toString();
    const post = await this.postRepository.findPostByIdInDb(
      command.postId,
      command.userId,
    );

    if (!post) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    const user = await this.userRepository.findUserInformationByIdInDb(
      command.userId,
    );

    const newComment = new Comment(
      new ObjectId(),
      dateNow,
      command.commentDto.content,
      {
        userId: user!.id,
        userLogin: user!.accountData.userName.login,
      },
      new Date().toISOString(),
      command.postId,
    );

    const newInformationOfLikeAndDislikeComment =
      new InformationOfLikeAndDislikeComment(newComment.id, 0, 0, []);

    await this.commentRepository.createInformationOfLikeAndDislikeComment(
      newInformationOfLikeAndDislikeComment,
    );

    return await this.commentRepository.createCommentInDb(newComment);
  }
}
