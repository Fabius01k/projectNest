import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
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

export class BanUserInputModel {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(20, 1000)
  @Transform(({ value }) => value.trim())
  banReason: string;
}

export class BanUserForBlogInputModel {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(20, 1000)
  @Transform(({ value }) => value.trim())
  banReason: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  blogId: string;
}
