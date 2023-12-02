import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { BlogRepositorySql } from '../../blogNest/repository/blog.repositorySql';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';
import { BlogRepositoryTypeOrm } from '../../blogNest/repository/blog.repository.TypeOrm';

export class DeletePostCommand {
  constructor(
    public postId: string,
    public blogId: string,
    public userId: string,
  ) {}
}
@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    protected postRepositorySql: PostRepositorySql,
    protected blogRepositorySql: BlogRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
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
    const postDeleted = await this.postRepositoryTypeOrm.deletePostInDbTrm(
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
