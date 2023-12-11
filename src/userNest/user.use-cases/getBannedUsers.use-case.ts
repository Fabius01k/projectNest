import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserResponse } from '../schema/user.schema';
import { UserRepositorySql } from '../repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../repository/user.repository.TypeOrm';

export class GetBannedUsersCommand {
  constructor(
    public banStatus: string,
    public searchLoginTerm: string | null,
    public searchEmailTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
  ) {}
}
@CommandHandler(GetBannedUsersCommand)
export class GetBannedUsersUseCase
  implements ICommandHandler<GetBannedUsersCommand>
{
  constructor(
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: GetBannedUsersCommand): Promise<UserResponse> {
    console.log(command.banStatus, 'status use case not all');
    let banStatus = true;

    if (command.banStatus !== 'all') {
      if (command.banStatus === 'notBanned') {
        banStatus = false;
      } else if (command.banStatus === 'banned') {
        banStatus = true;
      }
    }
    return await this.userRepositoryTypeOrm.findBannedUsersInDbTrm(
      banStatus,
      command.searchLoginTerm,
      command.searchEmailTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
