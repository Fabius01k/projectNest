import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostResponse } from '../schema/post-schema';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';

export class GetAllPostsForSpecificBlogCommand {
  constructor(
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public blogId: string,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetAllPostsForSpecificBlogCommand)
export class GetAllPostsForSpecificBlogUseCase
  implements ICommandHandler<GetAllPostsForSpecificBlogCommand>
{
  constructor(
    protected postRepositorySql: PostRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
  ) {}

  async execute(
    command: GetAllPostsForSpecificBlogCommand,
  ): Promise<PostResponse> {
    return await this.postRepositoryTypeOrm.findAllPostsForSpecifeldBlogInDbTrm(
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.blogId,
      command.userId,
    );
  }
}
