import { ConfirmationCodeModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { User } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';

export class RegistrationConfirmationUserCommand {
  constructor(public codeConfirmationDto: ConfirmationCodeModel) {}
}
@CommandHandler(RegistrationConfirmationUserCommand)
export class RegistrationConfirmationUserUseCase
  implements ICommandHandler<RegistrationConfirmationUserCommand>
{
  constructor(protected userRepository: UserRepository) {}

  async execute(
    command: RegistrationConfirmationUserCommand,
  ): Promise<boolean> {
    const user: User | null =
      await this.userRepository.getUserByConfirmationCode(
        command.codeConfirmationDto.code,
      );
    if (!user) {
      throw new BadRequestException([
        { message: 'User not found', field: 'code' },
      ]);
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        { message: 'User already confirmed', field: 'code' },
      ]);
    }
    if (
      user.emailConfirmation.confirmationCode !==
      command.codeConfirmationDto.code
    ) {
      throw new BadRequestException([{ message: 'Invalid confirmation code' }]);
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException([
        { message: 'The confirmation code has expired' },
      ]);
    }

    const result = await this.userRepository.updateConfirmation(user.id);
    return result;
  }
}
