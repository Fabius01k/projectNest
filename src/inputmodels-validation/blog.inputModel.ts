import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlogInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  @Transform(({ value }) => value.trim())
  description: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @Transform(({ value }) => value.trim())
  websiteUrl: string;
}
