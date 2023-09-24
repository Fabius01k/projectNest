import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { NotFoundException } from '@nestjs/common';

export class DeleteUserCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(protected userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userDeleted = await this.userRepository.deleteUserInDb(command.id);
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
