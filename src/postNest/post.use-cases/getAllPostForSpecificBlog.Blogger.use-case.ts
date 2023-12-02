import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostResponse } from '../schema/post-schema';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';
import { BlogRepositoryTypeOrm } from '../../blogNest/repository/blog.repository.TypeOrm';

export class GetAllPostsForSpecificBlogBloggerCommand {
  constructor(
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public blogId: string,
    public userId: string,
  ) {}
}
@CommandHandler(GetAllPostsForSpecificBlogBloggerCommand)
export class GetAllPostsForSpecificBlogBloggerUseCase
  implements ICommandHandler<GetAllPostsForSpecificBlogBloggerCommand>
{
  constructor(
    protected postRepositorySql: PostRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(
    command: GetAllPostsForSpecificBlogBloggerCommand,
  ): Promise<PostResponse> {
    await this.blogRepositoryTypeOrm.checkOwnerBlogInDb(
      command.blogId,
      command.userId,
    );
    return await this.postRepositoryTypeOrm.findAllPostsForSpecifeldBlogBloggerInDbTrm(
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.blogId,
      command.userId,
    );
  }
}
