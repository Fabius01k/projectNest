import { PostCreateByBlogIdInputModel } from '../../inputmodels-validation/post.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../../blogNest/repository/blog.repositorySql';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';
import { BlogRepositoryTypeOrm } from '../../blogNest/repository/blog.repository.TypeOrm';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public blogId: string,
    public postDto: PostCreateByBlogIdInputModel,
    public userId: string,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected postRepositorySql: PostRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: UpdatePostCommand): Promise<boolean> {
    await this.blogRepositoryTypeOrm.checkOwnerBlogInDb(
      command.blogId,
      command.userId,
    );
    const blog = await this.blogRepositoryTypeOrm.findBlogByIdInDbTrm(
      command.blogId,
    );

    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    const updatedPost = await this.postRepositoryTypeOrm.updatePostInDbTrm(
      command.postId,
      command.postDto.title,
      command.postDto.shortDescription,
      command.postDto.content,
    );
    if (!updatedPost) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return true;
  }
}
