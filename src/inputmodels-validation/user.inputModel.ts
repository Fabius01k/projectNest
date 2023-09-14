import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
