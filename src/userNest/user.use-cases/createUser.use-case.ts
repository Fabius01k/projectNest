import { UserInputModel } from '../../inputmodels-validation/user.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { User, UserView } from '../schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../service/user.service';
import bcrypt from 'bcrypt';

export class CreateUserCommand {
  constructor(public userDto: UserInputModel) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUserCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    protected userRepository: UserRepository,
    protected userService: UserService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserView> {
    const emailAlreadyUse = await this.userRepository.getUserByLoginOrEmail(
      command.userDto.email,
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
      command.userDto.login,
    );
    if (loginAlreadyUse) {
      throw new BadRequestException([
        {
          message: 'This login is already in use',
          field: 'login',
        },
      ]);
    }
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.userService._generateHash(
      command.userDto.password,
      passwordSalt,
    );

    const dateNow = new Date().getTime().toString();
    const newUser = new User(
      new ObjectId(),
      dateNow,
      {
        userName: {
          login: command.userDto.login,
          email: command.userDto.email,
        },
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      },
      {
        resetPasswordCode: null,
        expirationDatePasswordCode: new Date(),
      },
    );

    return await this.userRepository.createUserInDb(newUser);
  }
}
