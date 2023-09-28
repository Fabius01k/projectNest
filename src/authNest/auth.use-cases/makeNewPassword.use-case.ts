import { RecoveryPasswordInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { AuthService } from '../service/auth.service';
import { User, UserSql } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';

export class MakeNewPasswordCommand {
  constructor(public recoveryPasswordDto: RecoveryPasswordInputModel) {}
}
@CommandHandler(MakeNewPasswordCommand)
export class MakeNewPasswordUseCase
  implements ICommandHandler<MakeNewPasswordCommand>
{
  constructor(
    protected userRepository: UserRepository,
    private readonly authService: AuthService,
    protected userRepositorySql: UserRepositorySql,
  ) {}
  async execute(command: MakeNewPasswordCommand): Promise<boolean> {
    const users: UserSql[] =
      await this.userRepositorySql.getUserByResetPasswordCodeSql(
        command.recoveryPasswordDto.recoveryCode,
      );
    if (users.length === 0) {
      throw new BadRequestException([
        {
          message: 'User not found',
          filed: 'code',
        },
      ]);
    }
    let isValidCode = true;
    users.forEach((item) => {
      if (
        item.expirationDatePasswordCode &&
        item.expirationDatePasswordCode < new Date()
      ) {
        isValidCode = false;
        return;
      }
    });
    if (!isValidCode) {
      throw new BadRequestException([
        {
          message: 'The code has expired',
          field: 'code',
        },
      ]);
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.authService._generateHash(
      command.recoveryPasswordDto.newPassword,
      passwordSalt,
    );
    const result = await this.userRepositorySql.changePasswordInDbSql(
      users[0].id,
      passwordSalt,
      passwordHash,
    );
    return result;
  }
}
