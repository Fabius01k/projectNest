import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserResponse } from '../../userNest/schema/user.schema';

export class GetBannedUsersForSpecifeldBlogCommand {
  constructor(
    public searchLoginTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
    public id: string,
  ) {}
}
@CommandHandler(GetBannedUsersForSpecifeldBlogCommand)
export class GetBannedUsersForSpecifeldBlogUseCase
  implements ICommandHandler<GetBannedUsersForSpecifeldBlogCommand>
{
  constructor(protected userRepositoryTypeOrm: UserRepositoryTypeOrm) {}

  async execute(
    command: GetBannedUsersForSpecifeldBlogCommand,
  ): Promise<UserResponse> {
    console.log(command.id, 'rervice 1');
    return await this.userRepositoryTypeOrm.findAllBannedUserForSpecifeldBlogTrm(
      command.searchLoginTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
      command.id,
    );
  }
}
