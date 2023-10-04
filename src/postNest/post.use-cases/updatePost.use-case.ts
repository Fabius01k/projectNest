import { PostCreateByBlogIdInputModel } from '../../inputmodels-validation/post.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../../blogNest/repository/blog.repositorySql';
import { PostRepositorySql } from '../repository/post.repositorySql';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public blogId: string,
    public postDto: PostCreateByBlogIdInputModel,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    protected postRepository: PostRepository,
    protected blogRepositorySql: BlogRepositorySql,
    protected postRepositorySql: PostRepositorySql,
  ) {}

  async execute(command: UpdatePostCommand): Promise<boolean> {
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
    const updatedPost = await this.postRepositorySql.updatePostInDbSql(
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
