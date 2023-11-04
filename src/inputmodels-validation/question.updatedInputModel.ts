import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QuestionUpdatedInputModel {
  @IsBoolean()
  published: boolean;
}
