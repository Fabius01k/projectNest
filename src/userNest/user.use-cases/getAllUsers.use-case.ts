import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { UserResponse } from '../schema/user.schema';
import { UserRepositorySql } from '../repository/user.repositorySql';

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
    protected userRepository: UserRepository,
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(command: GetAllUsersCommand): Promise<UserResponse> {
    return await this.userRepositorySql.findAllUsersInDbSql(
      command.searchLoginTerm,
      command.searchEmailTerm,
      command.sortBy,
      command.sortDirection,
      command.pageSize,
      command.pageNumber,
    );
  }
}
