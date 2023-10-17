import { BlogResponse } from '../schema/blog-schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepositorySql } from '../repository/blog.repositorySql';
import { BlogRepositoryTypeOrm } from '../repository/blog.repository.TypeOrm';

export class GetAllBlogsCommand {
  constructor(
    public searchNameTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
  ) {}
}
@CommandHandler(GetAllBlogsCommand)
export class GetAllBlogsUseCase implements ICommandHandler<GetAllBlogsCommand> {
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: GetAllBlogsCommand): Promise<BlogResponse> {
    return await this.blogRepositoryTypeOrm.findAllBlogsInDbTrm(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
