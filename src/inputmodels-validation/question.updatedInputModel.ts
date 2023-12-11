import { IsBoolean, IsNotEmpty } from 'class-validator';

export class QuestionUpdatedInputModel {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
