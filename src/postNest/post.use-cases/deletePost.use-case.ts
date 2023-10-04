import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';
import { NotFoundException } from '@nestjs/common';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { BlogRepositorySql } from '../../blogNest/repository/blog.repositorySql';

export class DeletePostCommand {
  constructor(
    public postId: string,
    public blogId: string,
  ) {}
}
@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    protected postRepository: PostRepository,
    protected postRepositorySql: PostRepositorySql,
    protected blogRepositorySql: BlogRepositorySql,
  ) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
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
    const postDeleted = await this.postRepositorySql.deletePostInDbSql(
      command.postId,
    );
    if (!postDeleted) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return true;
  }
}
