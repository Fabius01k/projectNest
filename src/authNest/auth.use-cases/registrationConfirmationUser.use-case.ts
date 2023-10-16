import { ConfirmationCodeModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

export class RegistrationConfirmationUserCommand {
  constructor(public codeConfirmationDto: ConfirmationCodeModel) {}
}
@CommandHandler(RegistrationConfirmationUserCommand)
export class RegistrationConfirmationUserUseCase
  implements ICommandHandler<RegistrationConfirmationUserCommand>
{
  constructor(
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(
    command: RegistrationConfirmationUserCommand,
  ): Promise<boolean> {
    const user: UserTrm | null =
      await this.userRepositoryTypeOrm.findUserByConfirmationCodeTrm(
        command.codeConfirmationDto.code,
      );
    if (!user) {
      throw new BadRequestException([
        { message: 'User not found', field: 'code' },
      ]);
    }
    if (user.isConfirmed) {
      throw new BadRequestException([
        { message: 'User already confirmed', field: 'code' },
      ]);
    }
    if (user.confirmationCode !== command.codeConfirmationDto.code) {
      throw new BadRequestException([{ message: 'Invalid confirmation code' }]);
    }
    if (user.expirationDate < new Date()) {
      throw new BadRequestException([
        { message: 'The confirmation code has expired' },
      ]);
    }

    const result = await this.userRepositoryTypeOrm.updateConfirmationTrm(
      user.id,
    );

    return result;
  }
}
