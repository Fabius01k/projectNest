import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InformationOfLikeAndDislikePostDocument =
  HydratedDocument<InformationOfLikeAndDislikePost>;
@Schema()
export class InformationOfLikeAndDislikePost {
  @Prop({ type: String, required: true })
  postId: string;
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
    postId: string,
    numberOfLikes: number,
    numberOfDislikes: number,
    likesInfo: {
      userId: string;
      login: string;
      likeStatus: string;
      dateOfLikeDislike: Date;
    }[],
  ) {
    this.postId = postId;
    this.numberOfLikes = numberOfLikes;
    this.numberOfDislikes = numberOfDislikes;
    this.likesInfo = likesInfo;
  }
}
export class PostsLikesAndDislikesSql {
  postId: string;
  userLogin: string;
  reactionStatus: string;
  addedAt: Date;
  userId: string;

  constructor(
    postId: string,
    userLogin: string,
    reactionStatus: string,
    addedAt: Date,
    userId: string,
  ) {
    this.postId = postId;
    this.userLogin = userLogin;
    this.reactionStatus = reactionStatus;
    this.addedAt = addedAt;
    this.userId = userId;
  }
}
export const InformationOfLikeAndDislikePostSchema =
  SchemaFactory.createForClass(InformationOfLikeAndDislikePost);
