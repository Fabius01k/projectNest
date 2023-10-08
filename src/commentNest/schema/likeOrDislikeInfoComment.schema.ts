import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InformationOfLikeAndDislikeCommentDocument =
  HydratedDocument<InformationOfLikeAndDislikeComment>;
@Schema()
export class InformationOfLikeAndDislikeComment {
  @Prop({ type: String, required: true })
  commentId: string;
  @Prop({ type: Number, default: 0 })
  numberOfLikes: number;
  @Prop({ type: Number, default: 0 })
  numberOfDislikes: number;
  @Prop({
    type: [
      {
        userId: String,
        login: String,
        likeStatus: String,
        dateOfLikeDislike: Date,
      },
    ],
    default: null,
  })
  likesInfo: {
    userId: string;
    login: string;
    likeStatus: string;
    dateOfLikeDislike: Date;
  }[];
  constructor(
    commentId: string,
    numberOfLikes: number,
    numberOfDislikes: number,
    likesInfo: {
      userId: string;
      login: string;
      likeStatus: string;
      dateOfLikeDislike: Date;
    }[],
  ) {
    this.commentId = commentId;
    this.numberOfLikes = numberOfLikes;
    this.numberOfDislikes = numberOfDislikes;
    this.likesInfo = likesInfo;
  }
}
export interface CommentsLikesInfo {
  userId: string;
  likeStatus: string;
  dateOfLikeDislike: Date;
}
export class CommentsLikesAndDislikesSql {
  commentId: string;
  reactionStatus: string;
  userId: string;

  constructor(commentId: string, reactionStatus: string, userId: string) {
    this.commentId = commentId;
    this.reactionStatus = reactionStatus;
    this.userId = userId;
  }
}
export const InformationOfLikeAndDislikeCommentSchema =
  SchemaFactory.createForClass(InformationOfLikeAndDislikeComment);
