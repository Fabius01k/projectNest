import { BlogResponse, BlogSaResponse } from '../schema/blog-schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepositorySql } from '../repository/blog.repositorySql';
import { BlogRepositoryTypeOrm } from '../repository/blog.repository.TypeOrm';

export class GetAllBlogsSACommand {
  constructor(
    public searchNameTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
  ) {}
}
@CommandHandler(GetAllBlogsSACommand)
export class GetAllBlogsSAUseCase
  implements ICommandHandler<GetAllBlogsSACommand>
{
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: GetAllBlogsSACommand): Promise<BlogSaResponse> {
    return await this.blogRepositoryTypeOrm.findAllBlogsSAInDbTrm(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
