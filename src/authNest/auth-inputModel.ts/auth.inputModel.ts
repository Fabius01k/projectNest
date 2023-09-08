import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import // UniqueEmailValidator,
// UniqueLoginValidator,
'../decorations/user-registration.decorator';

export class UserInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  // @UniqueLoginValidator()
  login: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  // @UniqueEmailValidator()
  email: string;
}
export class ConfirmationCodeModel {
  @IsString()
  @IsNotEmpty()
  // @UniqueCodeValidator()
  code: string;
}
export class ConfirmationResendingCodeModel {
  @IsString()
  @IsNotEmpty()
  // @UniqueReCodeValidator()
  email: string;
}
export class RecoveryPasswordInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
export class EmailPasswordResendingInputModel {
  @IsString()
  @IsNotEmpty()
  email: string;
}
export class UserRegistrationInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  // @UniqueLoginValidator()
  login: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  // @UniqueEmailValidator()
  email: string;
}
