import { ConfirmationCodeModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { UserSql } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';

export class RegistrationConfirmationUserCommand {
  constructor(public codeConfirmationDto: ConfirmationCodeModel) {}
}
@CommandHandler(RegistrationConfirmationUserCommand)
export class RegistrationConfirmationUserUseCase
  implements ICommandHandler<RegistrationConfirmationUserCommand>
{
  constructor(
    protected userRepository: UserRepository,
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(
    command: RegistrationConfirmationUserCommand,
  ): Promise<boolean> {
    const users: UserSql[] =
      await this.userRepositorySql.getUserByConfirmationCodeSql(
        command.codeConfirmationDto.code,
      );
    if (users.length === 0) {
      throw new BadRequestException([
        { message: 'User not found', field: 'code' },
      ]);
    }
    for (const user of users)
      if (user && user.isConfirmed) {
        throw new BadRequestException([
          { message: 'User already confirmed', field: 'code' },
        ]);
      }
    let isValidCode = false;
    users.forEach((item) => {
      if (item.confirmationCode === command.codeConfirmationDto.code) {
        isValidCode = true;
        return;
      }
    });
    if (!isValidCode) {
      throw new BadRequestException([{ message: 'Invalid confirmation code' }]);
    }
    let codeNotExpired = false;
    users.forEach((item) => {
      if (item.expirationDate < new Date()) {
        codeNotExpired = true;
        return;
      }
    });
    if (!codeNotExpired) {
      throw new BadRequestException([{ message: 'Invalid confirmation code' }]);
    }

    const result = await this.userRepositorySql.updateConfirmationSql(
      users[0].id,
    );

    return result;
  }
}
