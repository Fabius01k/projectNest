import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateByBlogIdInputModel } from '../../inputmodels-validation/post.inputModel';
import { PostSql, PostView } from '../schema/post-schema';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../../blogNest/repository/blog.repositorySql';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { BlogRepositoryTypeOrm } from '../../blogNest/repository/blog.repository.TypeOrm';
import { PostTrm } from '../../entities/post.entity';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';

export class CreatePostCommand {
  constructor(
    public postDto: PostCreateByBlogIdInputModel,
    public blogId: string,
    public userId: string,
  ) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected postRepositorySql: PostRepositorySql,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostView | null> {
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
    await this.blogRepositoryTypeOrm.checkOwnerBlogInDb(
      command.blogId,
      command.userId,
    );

    const dateNow = new Date().getTime().toString();
    const newPost = new PostTrm();
    newPost.id = dateNow;
    newPost.title = command.postDto.title;
    newPost.shortDescription = command.postDto.shortDescription;
    newPost.content = command.postDto.content;
    newPost.blogId = command.blogId;
    newPost.blogName = blog.name;
    newPost.createdAt = new Date().toISOString();
    newPost.bloggerId = command.userId;
    newPost.isBanned = false;
    newPost.postLikedAndDislikes = [];

    return await this.postRepositoryTypeOrm.createPostInDbTrm(
      newPost,
      command.userId,
    );
  }
}
