import { RecoveryPasswordInputModel } from '../../inputmodels-validation/auth.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../userNest/repository/user.repository';
import { AuthService } from '../service/auth.service';
import { User } from '../../userNest/schema/user.schema';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';

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
  ) {}
  async execute(command: MakeNewPasswordCommand): Promise<boolean> {
    const user: User | null =
      await this.userRepository.getUserByResetPasswordCode(
        command.recoveryPasswordDto.recoveryCode,
      );
    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        filed: 'code',
      });
    }
    if (
      user.passwordUpdate &&
      user.passwordUpdate.expirationDatePasswordCode &&
      user.passwordUpdate.expirationDatePasswordCode < new Date()
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
    const result = await this.userRepository.changePasswordInDb(
      user.id,
      passwordSalt,
      passwordHash,
    );
    return result;
  }
}
