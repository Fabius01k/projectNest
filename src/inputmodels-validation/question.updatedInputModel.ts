import { IsBoolean, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QuestionUpdatedInputModel {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
// export class QuestionUpdatedInputModel {
//   @IsNotEmpty()
//   @IsBoolean()
//   @IsIn([true, false])
//   published: boolean;
// }
