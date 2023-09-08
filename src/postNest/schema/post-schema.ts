import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export type PostDocument = HydratedDocument<Post>;
@Schema()
export class Post {
  @Prop({ type: ObjectId, required: true })
  _id: ObjectId;
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  shortDescription: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  blogId: string;
  @Prop({ type: String, required: true })
  blogName: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  constructor(
    _id: ObjectId,
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
  ) {
    this._id = _id;
    this.id = id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = createdAt;
  }
}

export type PostView = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;

    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string;
    }[];
  };
};
export interface PostResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostView[];
}

export class PostCreateInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  @IsString()
  @IsNotEmpty()
  blogId: string;
}
export class PostCreateByBlogIdInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
