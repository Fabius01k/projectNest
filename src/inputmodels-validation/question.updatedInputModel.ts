import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class QuestionUpdatedInputModel {
  @IsBoolean()
  @IsNotEmpty()
  // @IsIn([true, false])
  published: boolean;
}
