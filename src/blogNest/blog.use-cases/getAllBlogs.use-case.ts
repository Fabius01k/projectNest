import { BlogRepository } from '../repository/blog.repository';
import { BlogResponse } from '../schema/blog-schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepositorySql } from '../repository/blog.repositorySql';

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
    protected blogRepository: BlogRepository,
    protected blogRepositorySql: BlogRepositorySql,
  ) {}

  async execute(command: GetAllBlogsCommand): Promise<BlogResponse> {
    return await this.blogRepositorySql.findAllBlogsInDbSql(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
