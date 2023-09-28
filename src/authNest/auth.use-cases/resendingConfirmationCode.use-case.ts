import { ConfirmationResendingCodeModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { EmailManager } from '../../managers/email-manager';
import { User, UserSql } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';

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
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(command: ResendingConfirmationCodeCommand): Promise<boolean> {
    const users: UserSql[] =
      await this.userRepositorySql.getUserByLoginOrEmailSql(
        command.resendCodeConfirmationDto.email,
      );
    if (users.length === 0) {
      throw new BadRequestException([
        { message: 'User not found', field: 'email' },
      ]);
    }
    for (const user of users)
      if (user && user.isConfirmed) {
        throw new BadRequestException([
          {
            message: 'User already confirmed',
            field: 'email',
          },
        ]);
      }

    const confirmationCode = randomUUID();

    await this.userRepositorySql.changeConfirmationCodeSql(
      users[0].id,
      confirmationCode,
    );

    this.emailManager.resendEmailConfirmationMessage(
      command.resendCodeConfirmationDto.email,
      confirmationCode,
    );

    return true;
  }
}
