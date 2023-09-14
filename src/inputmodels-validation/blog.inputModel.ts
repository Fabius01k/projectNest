import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class BlogInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
