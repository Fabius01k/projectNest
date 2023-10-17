import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostResponse } from '../schema/post-schema';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';

export class GetAllPostsCommand {
  constructor(
    public searchNameTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetAllPostsCommand)
export class GetAllPostsUseCase implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    protected postRepositorySql: PostRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
  ) {}

  async execute(command: GetAllPostsCommand): Promise<PostResponse> {
    return await this.postRepositoryTypeOrm.findAllPostsInDbTrm(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.userId,
    );
  }
}
