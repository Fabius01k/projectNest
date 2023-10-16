import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserResponse } from '../schema/user.schema';
import { UserRepositorySql } from '../repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../repository/user.repository.TypeOrm';

export class GetAllUsersCommand {
  constructor(
    public searchLoginTerm: string | null,
    public searchEmailTerm: string | null,
    public sortBy: string,
    public sortDirection: 'asc' | 'desc',
    public pageSize: number,
    public pageNumber: number,
  ) {}
}
@CommandHandler(GetAllUsersCommand)
export class GetAllUsersUseCase implements ICommandHandler<GetAllUsersCommand> {
  constructor(
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: GetAllUsersCommand): Promise<UserResponse> {
    return await this.userRepositoryTypeOrm.findAllUsersInDbTrm(
      command.searchLoginTerm,
      command.searchEmailTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
