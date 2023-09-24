import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';
import { PostResponse } from '../schema/post-schema';

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
  constructor(protected postRepository: PostRepository) {}

  async execute(command: GetAllPostsCommand): Promise<PostResponse> {
    return await this.postRepository.findAllPostsInDb(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.userId,
    );
  }
}
