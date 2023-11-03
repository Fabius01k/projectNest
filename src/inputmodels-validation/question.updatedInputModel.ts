import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QuestionUpdatedInputModel {
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  // @Transform(({ value }) => value === 'true')
  // @IsBoolean()
  // @Type(() => Boolean)
  published: boolean;
}
