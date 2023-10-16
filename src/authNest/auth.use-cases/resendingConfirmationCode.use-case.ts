import { ConfirmationResendingCodeModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../managers/email-manager';
import { UserSql } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

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
    protected emailManager: EmailManager,
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: ResendingConfirmationCodeCommand): Promise<boolean> {
    const user: UserTrm | null =
      await this.userRepositoryTypeOrm.getUserByLoginOrEmailTrm(
        command.resendCodeConfirmationDto.email,
      );
    if (!user) {
      throw new BadRequestException([
        { message: 'User not found', field: 'code' },
      ]);
    }
    if (user.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'User already confirmed',
          field: 'email',
        },
      ]);
    }

    const confirmationCode = randomUUID();

    await this.userRepositoryTypeOrm.changeConfirmationCodeTrm(
      user.id,
      confirmationCode,
    );

    this.emailManager.resendEmailConfirmationMessage(
      command.resendCodeConfirmationDto.email,
      confirmationCode,
    );

    return true;
  }
}
