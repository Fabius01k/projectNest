import { UserRegistrationInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { EmailManager } from '../../managers/email-manager';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../userNest/schema/user.schema';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import add from 'date-fns/add';
import { AuthService } from '../service/auth.service';
import bcrypt from 'bcrypt';

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
  ) {}

  async execute(command: RegistrationUserCommand): Promise<boolean> {
    const emailAlreadyUse = await this.userRepository.getUserByLoginOrEmail(
      command.registrationDto.email,
    );
    if (emailAlreadyUse) {
      throw new BadRequestException([
        {
          message: 'This email is already in use',
          field: 'email',
        },
      ]);
    }
    const loginAlreadyUse = await this.userRepository.getUserByLoginOrEmail(
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
    const newUserToRegistration = new User(
      new ObjectId(),
      dateNow,
      {
        userName: {
          login: command.registrationDto.login,
          email: command.registrationDto.email,
        },
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
      {
        resetPasswordCode: null,
        expirationDatePasswordCode: new Date(),
      },
    );
    await this.userRepository.registrationUser(newUserToRegistration);

    this.emailManager.sendEmailConfirmationMessage(newUserToRegistration);
    return true;
  }
}
