import { PostRepository } from '../repository/post.repository';
import { BlogRepository } from '../../blogNest/repository/blog.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateInputModel } from '../../inputmodels-validation/post.inputModel';
import { Post, PostSql, PostView } from '../schema/post-schema';
import { NotFoundException } from '@nestjs/common';
import { PostsLikesAndDislikesSql } from '../schema/likeOrDislikeInfoPost-schema';
import { BlogRepositorySql } from '../../blogNest/repository/blog.repositorySql';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { BlogView } from '../../blogNest/schema/blog-schema';

export class CreatePostCommand {
  constructor(
    public postDto: PostCreateInputModel,
    public userId: string | null,
  ) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    protected postRepository: PostRepository,
    protected blogRepository: BlogRepository,
    protected blogRepositorySql: BlogRepositorySql,
    protected postRepositorySql: PostRepositorySql,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostView | null> {
    const blog = await this.blogRepositorySql.findBlogByIdInDbSql(
      command.postDto.blogId,
    );

    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    const dateNow = new Date().getTime().toString();
    const newPost = new PostSql(
      dateNow,
      command.postDto.title,
      command.postDto.shortDescription,
      command.postDto.content,
      command.postDto.blogId,
      blog.name,
      new Date().toISOString(),
    );

    // const postId = newPost.id;
    // const InfOfLikeAndDislikePost = new PostsLikesAndDislikesSql(
    //   postId,
    //   0,
    //   0,
    //   [],
    // );
    // await this.postRepositorySql.createInfOfLikeAndDislikePostSql(
    //   InfOfLikeAndDislikePost,
    // );

    return await this.postRepositorySql.createPostInDbSql(
      newPost,
      command.userId,
    );
  }
}
