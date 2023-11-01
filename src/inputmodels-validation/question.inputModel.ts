import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QuestionInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  @Transform(({ value }) => value.trim())
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  correctAnswers: string[];
}
