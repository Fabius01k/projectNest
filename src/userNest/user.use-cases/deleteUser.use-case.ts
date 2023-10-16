import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UserRepositorySql } from '../repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../repository/user.repository.TypeOrm';

export class DeleteUserCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userDeleted = await this.userRepositoryTypeOrm.deleteUserInDbTrm(
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
