import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PostCreateInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  @IsString()
  @IsNotEmpty()
  blogId: string;
}
export class PostCreateByBlogIdInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}
