import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;
@Schema()
export class Comment {
  @Prop({ type: ObjectId, required: true })
  _id: ObjectId;
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  content: string;
  // @Prop({
  //   userId: { type: String, required: true },
  //   userLogin: { type: String, required: true },
  // })
  // commentatorInfo: {
  //   userId: string;
  //   userLogin: string;
  // };
  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  @Prop({ type: String, required: true })
  createdAt: string;
  @Prop({ type: String, required: true })
  postId: string;
  constructor(
    _id: ObjectId,
    id: string,
    content: string,
    commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    createdAt: string,
    postId: string,
  ) {
    this._id = _id;
    this.id = id;
    this.content = content;
    this.commentatorInfo = commentatorInfo;
    this.createdAt = createdAt;
    this.postId = postId;
  }
}
export type CommentView = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export interface CommentResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentView[];
}
export class CommentSql {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  postId: string;
  constructor(
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string,
    postId: string,
  ) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.userLogin = userLogin;
    this.createdAt = createdAt;
    this.postId = postId;
  }
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
