import { BlogResponse } from '../schema/blog-schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepositorySql } from '../repository/blog.repositorySql';
import { BlogRepositoryTypeOrm } from '../repository/blog.repository.TypeOrm';

export class GetAllBlogsBloggerCommand {
  constructor(
    public searchNameTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public userId: string,
  ) {}
}
@CommandHandler(GetAllBlogsBloggerCommand)
export class GetAllBlogsBloggerUseCase
  implements ICommandHandler<GetAllBlogsBloggerCommand>
{
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: GetAllBlogsBloggerCommand): Promise<BlogResponse> {
    return await this.blogRepositoryTypeOrm.findAllBlogsBloggerInDbTrm(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.userId,
    );
  }
}
