import { EmailPasswordResendingInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { EmailManager } from '../../managers/email-manager';
import { User } from '../../userNest/schema/user.schema';
import { randomUUID } from 'crypto';
import add from 'date-fns/add';

export class ResendingPasswordCodeCommand {
  constructor(
    public recoveryPasswordCodeDto: EmailPasswordResendingInputModel,
  ) {}
}
@CommandHandler(ResendingPasswordCodeCommand)
export class ResendingPasswordCodeUseCase
  implements ICommandHandler<ResendingPasswordCodeCommand>
{
  constructor(
    protected userRepository: UserRepository,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: ResendingPasswordCodeCommand): Promise<boolean> {
    const user: User | null = await this.userRepository.getUserByLoginOrEmail(
      command.recoveryPasswordCodeDto.email,
    );
    if (!user) return false;

    const NewResetPasswordCode = randomUUID();
    const NewExpirationDatePasswordCode = add(new Date(), { hours: 24 });

    await this.userRepository.changeResetPasswordCode(
      user.id,
      NewResetPasswordCode,
      NewExpirationDatePasswordCode,
    );
    await this.emailManager.resendPasswordCodeMessage(
      command.recoveryPasswordCodeDto.email,
      NewResetPasswordCode,
    );

    return true;
  }
}
