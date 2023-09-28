import { EmailPasswordResendingInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { EmailManager } from '../../managers/email-manager';
import { UserSql } from '../../userNest/schema/user.schema';
import { randomUUID } from 'crypto';
import add from 'date-fns/add';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { BadRequestException } from '@nestjs/common';

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
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(command: ResendingPasswordCodeCommand): Promise<boolean> {
    const users: UserSql[] =
      await this.userRepositorySql.getUserByLoginOrEmailSql(
        command.recoveryPasswordCodeDto.email,
      );
    console.log(users);
    if (users.length === 0) {
      throw new BadRequestException([{ message: 'User not found' }]);
    }

    const NewResetPasswordCode = randomUUID();
    const NewExpirationDatePasswordCode = add(new Date(), { hours: 24 });

    await this.userRepositorySql.changeResetPasswordCodeSql(
      users[0].id,
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
