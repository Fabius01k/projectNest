import { EmailPasswordResendingInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../managers/email-manager';
import { UserSql } from '../../userNest/schema/user.schema';
import { randomUUID } from 'crypto';
import add from 'date-fns/add';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { BadRequestException } from '@nestjs/common';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

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
    protected emailManager: EmailManager,
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: ResendingPasswordCodeCommand): Promise<boolean> {
    const user: UserTrm | null =
      await this.userRepositoryTypeOrm.getUserByLoginOrEmailTrm(
        command.recoveryPasswordCodeDto.email,
      );
    console.log(user);
    if (!user) {
      throw new BadRequestException([{ message: 'User not found' }]);
    }

    const NewResetPasswordCode = randomUUID();
    const NewExpirationDatePasswordCode = add(new Date(), { hours: 24 });

    await this.userRepositoryTypeOrm.changeResetPasswordCodeTrm(
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
