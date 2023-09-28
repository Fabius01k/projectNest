import { PostRepository } from '../repository/post.repository';
import { BlogRepository } from '../../blogNest/repository/blog.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateInputModel } from '../../inputmodels-validation/post.inputModel';
import { Post, PostView } from '../schema/post-schema';
import { NotFoundException } from '@nestjs/common';
import { InformationOfLikeAndDislikePost } from '../schema/likeOrDislikeInfoPost-schema';

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
  ) {}

  async execute(command: CreatePostCommand): Promise<PostView | null> {
    const dateNow = new Date().getTime().toString();
    const blog = await this.blogRepository.findBlogByIdInDb(
      command.postDto.blogId,
    );
    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }

    const newPost = new Post(
      dateNow,
      command.postDto.title,
      command.postDto.shortDescription,
      command.postDto.content,
      command.postDto.blogId,
      blog.name,
      new Date().toISOString(),
    );

    const postId = newPost.id;
    const InfOfLikeAndDislikePost = new InformationOfLikeAndDislikePost(
      postId,
      0,
      0,
      [],
    );
    await this.postRepository.createInfOfLikeAndDislikePost(
      InfOfLikeAndDislikePost,
    );

    return await this.postRepository.createPostInDb(newPost, command.userId);
  }
}
