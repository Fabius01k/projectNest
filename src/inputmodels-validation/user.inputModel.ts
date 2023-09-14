import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Transform(({ value }) => value.trim())
  login: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Transform(({ value }) => value.trim())
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @Transform(({ value }) => value.trim())
  email: string;
}
