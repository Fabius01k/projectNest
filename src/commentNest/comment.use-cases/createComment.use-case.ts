import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentSql, CommentView } from '../schema/comment.schema';
import { NotFoundException } from '@nestjs/common';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { PostRepositorySql } from '../../postNest/repository/post.repositorySql';
import { CommentRepositorySql } from '../repository/comment.repositorySql';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { PostRepositoryTypeOrm } from '../../postNest/repository/post.repository.TypeOrm';
import { CommentTrm } from '../../entities/comment.entity';
import { CommentRepositoryTypeOrm } from '../repository/comment.repositoryTypeOrm';

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
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
    protected postRepositorySql: PostRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
    protected commentRepositorySql: CommentRepositorySql,
    protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentView | null> {
    const dateNow = new Date().getTime().toString();
    const post = await this.postRepositoryTypeOrm.findPostByIdInDbTrm(
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
    const user = await this.userRepositoryTypeOrm.findUserByIdInDbTrm(
      command.userId,
    );

    const newComment = new CommentTrm();
    newComment.id = dateNow;
    newComment.content = command.commentDto.content;
    newComment.userId = user!.id;
    newComment.userLogin = user!.login;
    newComment.createdAt = new Date().toISOString();
    newComment.postId = command.postId;
    newComment.isBanned = false;

    return await this.commentRepositoryTypeOrm.createCommentInDbTrm(newComment);
  }
}
