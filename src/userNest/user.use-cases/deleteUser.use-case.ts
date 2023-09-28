import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { NotFoundException } from '@nestjs/common';
import { UserRepositorySql } from '../repository/user.repositorySql';

export class DeleteUserCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(
    protected userRepository: UserRepository,
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userDeleted = await this.userRepositorySql.deleteUserInDbSql(
      command.id,
    );
    if (!userDeleted) {
      throw new NotFoundException([
        {
          message: 'User not found',
        },
      ]);
    }
    return;
  }
}
