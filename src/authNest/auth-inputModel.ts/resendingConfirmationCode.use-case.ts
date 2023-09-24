import { ConfirmationResendingCodeModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { EmailManager } from '../../managers/email-manager';
import { User } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class ResendingConfirmationCodeCommand {
  constructor(
    public resendCodeConfirmationDto: ConfirmationResendingCodeModel,
  ) {}
}
@CommandHandler(ResendingConfirmationCodeCommand)
export class ResendingConfirmationCodeUseCase
  implements ICommandHandler<ResendingConfirmationCodeCommand>
{
  constructor(
    protected userRepository: UserRepository,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: ResendingConfirmationCodeCommand): Promise<boolean> {
    const user: User | null = await this.userRepository.getUserByLoginOrEmail(
      command.resendCodeConfirmationDto.email,
    );
    if (!user) {
      throw new BadRequestException([
        { message: 'User not found', field: 'email' },
      ]);
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'User already confirmed',
          field: 'email',
        },
      ]);
    }

    const confirmationCode = randomUUID();

    await this.userRepository.changeConfirmationCode(user.id, confirmationCode);

    this.emailManager.resendEmailConfirmationMessage(
      command.resendCodeConfirmationDto.email,
      confirmationCode,
    );

    return true;
  }
}
