import { UserRegistrationInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../managers/email-manager';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { AuthService } from '../service/auth.service';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

export class RegistrationUserCommand {
  constructor(public registrationDto: UserRegistrationInputModel) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    protected emailManager: EmailManager,
    private readonly authService: AuthService,
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}

  async execute(command: RegistrationUserCommand): Promise<boolean> {
    const emailAlreadyUse =
      await this.userRepositoryTypeOrm.getUserByLoginOrEmailTrm(
        command.registrationDto.email,
      );
    console.log(emailAlreadyUse);
    if (emailAlreadyUse) {
      throw new BadRequestException([
        {
          message: 'This email is already in use',
          field: 'email',
        },
      ]);
    }
    const loginAlreadyUse =
      await this.userRepositoryTypeOrm.getUserByLoginOrEmailTrm(
        command.registrationDto.login,
      );
    if (loginAlreadyUse) {
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
    const newUserToRegistration = new UserTrm();
    newUserToRegistration.id = dateNow;
    newUserToRegistration.login = command.registrationDto.login;
    newUserToRegistration.email = command.registrationDto.email;
    newUserToRegistration.passwordHash = passwordHash;
    newUserToRegistration.passwordSalt = passwordSalt;
    newUserToRegistration.createdAt = new Date().toISOString();
    newUserToRegistration.confirmationCode = uuidv4();
    newUserToRegistration.expirationDate = add(new Date(), {
      hours: 1,
    });
    newUserToRegistration.isConfirmed = false;
    newUserToRegistration.usersSessions = [];
    await this.userRepositoryTypeOrm.registrationUserTrm(newUserToRegistration);

    this.emailManager.sendEmailConfirmationMessage(newUserToRegistration);
    return true;
  }
}
