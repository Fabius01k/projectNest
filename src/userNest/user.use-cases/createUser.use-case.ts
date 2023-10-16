import { UserInputModel } from '../../inputmodels-validation/user.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserView } from '../schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../service/user.service';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

export class CreateUserCommand {
  constructor(public userDto: UserInputModel) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUserCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
    protected userService: UserService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserView> {
    const emailAlreadyUse =
      await this.userRepositoryTypeOrm.getUserByLoginOrEmailTrm(
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
    const loginAlreadyUse =
      await this.userRepositoryTypeOrm.getUserByLoginOrEmailTrm(
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

    const newUser = new UserTrm();
    newUser.id = dateNow;
    newUser.login = command.userDto.login;
    newUser.email = command.userDto.email;
    newUser.passwordHash = passwordHash;
    newUser.passwordSalt = passwordSalt;
    newUser.createdAt = new Date().toISOString();
    newUser.confirmationCode = uuidv4();
    newUser.expirationDate = add(new Date(), {
      hours: 1,
    });
    newUser.isConfirmed = true;
    newUser.usersSessions = [];

    return await this.userRepositoryTypeOrm.createUserInDbTrm(newUser);
  }
}
