import { UserRegistrationInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { EmailManager } from '../../managers/email-manager';
import { BadRequestException } from '@nestjs/common';
import { User, UserSql } from '../../userNest/schema/user.schema';
import { randomUUID } from 'crypto';
import add from 'date-fns/add';
import { AuthService } from '../service/auth.service';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';

export class RegistrationUserCommand {
  constructor(public registrationDto: UserRegistrationInputModel) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    protected userRepository: UserRepository,
    protected emailManager: EmailManager,
    private readonly authService: AuthService,
    protected userRepositorySql: UserRepositorySql,
  ) {}

  async execute(command: RegistrationUserCommand): Promise<boolean> {
    const emailAlreadyUse =
      await this.userRepositorySql.getUserByLoginOrEmailSql(
        command.registrationDto.email,
      );
    console.log(emailAlreadyUse);
    if (emailAlreadyUse.length > 0) {
      throw new BadRequestException([
        {
          message: 'This email is already in use',
          field: 'email',
        },
      ]);
    }
    const loginAlreadyUse =
      await this.userRepositorySql.getUserByLoginOrEmailSql(
        command.registrationDto.login,
      );
    if (loginAlreadyUse.length > 0) {
      throw new BadRequestException([
        {
          message: 'This login is already in use',
          field: 'login',
        },
      ]);
    }

    const dateNow = new Date().getTime().toString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.authService._generateHash(
      command.registrationDto.password,
      passwordSalt,
    );
    const newUserToRegistration = new UserSql(
      dateNow,
      command.registrationDto.login,
      command.registrationDto.email,
      passwordHash,
      passwordSalt,
      new Date().toISOString(),
      randomUUID(),
      add(new Date(), {
        hours: 1,
      }),
      false,
      null,
      new Date(),
    );
    await this.userRepositorySql.registrationUserSql(newUserToRegistration);
    console.log(newUserToRegistration.resetPasswordCode);
    this.emailManager.sendEmailConfirmationMessage(newUserToRegistration);
    return true;
  }
}
