import { BlogRepository } from '../repository/blog.repository';
import { BlogResponse } from '../schema/blog-schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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
  constructor(protected blogRepository: BlogRepository) {}

  async execute(command: GetAllBlogsCommand): Promise<BlogResponse> {
    return await this.blogRepository.findAllBlogsInDb(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
