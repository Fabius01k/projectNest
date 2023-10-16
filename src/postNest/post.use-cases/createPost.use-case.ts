import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateByBlogIdInputModel } from '../../inputmodels-validation/post.inputModel';
import { PostSql, PostView } from '../schema/post-schema';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../../blogNest/repository/blog.repositorySql';
import { PostRepositorySql } from '../repository/post.repositorySql';

export class CreatePostCommand {
  constructor(
    public postDto: PostCreateByBlogIdInputModel,
    public blogId: string,
    public userId: string | null,
  ) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected postRepositorySql: PostRepositorySql,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostView | null> {
    const blog = await this.blogRepositorySql.findBlogByIdInDbSql(
      command.blogId,
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
      command.blogId,
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
