import { UserInputModel } from '../../inputmodels-validation/user.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { User, UserSql, UserView } from '../schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../service/user.service';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../repository/user.repositorySql';

export class CreateUserCommand {
  constructor(public userDto: UserInputModel) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUserCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    protected userRepository: UserRepository,
    protected userRepositorySql: UserRepositorySql,
    protected userService: UserService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserView> {
    const emailAlreadyUse =
      await this.userRepositorySql.getUserByLoginOrEmailSql(
        command.userDto.email,
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
        command.userDto.login,
      );
    if (loginAlreadyUse.length > 0) {
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
    const newUser = new UserSql(
      dateNow,
      command.userDto.login,
      command.userDto.email,
      passwordHash,
      passwordSalt,
      new Date().toISOString(),
      uuidv4(),
      add(new Date(), {
        hours: 1,
      }),
      true,
      null,
      new Date(),
    );

    return await this.userRepositorySql.createUserInDbSql(newUser);
  }
}
