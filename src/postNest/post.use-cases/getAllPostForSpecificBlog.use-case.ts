import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';
import { PostResponse } from '../schema/post-schema';
import { PostRepositorySql } from '../repository/post.repositorySql';

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
    protected postRepository: PostRepository,
    protected postRepositorySql: PostRepositorySql,
  ) {}

  async execute(
    command: GetAllPostsForSpecificBlogCommand,
  ): Promise<PostResponse> {
    return await this.postRepositorySql.findAllPostsForSpecifeldBlogInDbSql(
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.blogId,
      command.userId,
    );
  }
}
