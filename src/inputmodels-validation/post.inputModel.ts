import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindBlogInDb } from './inputModel.custom-decoration';

export class PostCreateInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  @Transform(({ value }) => value.trim())
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  @Transform(({ value }) => value.trim())
  content: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  // @FindBlogInDb({
  //   message: 'Blog not found',
  // })
  blogId: string;
}
export class PostCreateByBlogIdInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  @Transform(({ value }) => value.trim())
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  @Transform(({ value }) => value.trim())
  content: string;
}
