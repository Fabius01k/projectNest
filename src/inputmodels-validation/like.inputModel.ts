import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LikeInputModel {
  @IsString()
  @IsNotEmpty()
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: string;
}
