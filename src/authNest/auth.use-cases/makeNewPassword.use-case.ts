import { RecoveryPasswordInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../service/auth.service';
import { UserSql } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepositorySql } from '../../userNest/repository/user.repositorySql';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { UserTrm } from '../../entities/user.entity';

export class MakeNewPasswordCommand {
  constructor(public recoveryPasswordDto: RecoveryPasswordInputModel) {}
}
@CommandHandler(MakeNewPasswordCommand)
export class MakeNewPasswordUseCase
  implements ICommandHandler<MakeNewPasswordCommand>
{
  constructor(
    private readonly authService: AuthService,
    protected userRepositorySql: UserRepositorySql,
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
  ) {}
  async execute(command: MakeNewPasswordCommand): Promise<boolean> {
    const user: UserTrm | null =
      await this.userRepositoryTypeOrm.findUserByResetPasswordCodeTrm(
        command.recoveryPasswordDto.recoveryCode,
      );
    if (!user) {
      throw new BadRequestException([
        { message: 'User not found', field: 'code' },
      ]);
    }
    if (
      user.expirationDatePasswordCode &&
      user.expirationDatePasswordCode < new Date()
    ) {
      throw new BadRequestException({
        message: 'The code has expired',
        field: 'code',
      });
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.authService._generateHash(
      command.recoveryPasswordDto.newPassword,
      passwordSalt,
    );
    const result = await this.userRepositoryTypeOrm.changePasswordInDbTrm(
      user.id,
      passwordSalt,
      passwordHash,
    );
    return result;
  }
}
