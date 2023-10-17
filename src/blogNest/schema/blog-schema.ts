// import { HydratedDocument } from 'mongoose';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//
// export type BlogDocument = HydratedDocument<Blog>;
// @Schema()
// export class Blog {
//   @Prop({ type: String, required: true })
//   id: string;
//   @Prop({ type: String, required: true })
//   name: string;
//   @Prop({ type: String, required: true })
//   description: string;
//   @Prop({ type: String, required: true })
//   websiteUrl: string;
//   @Prop({ type: String, required: true })
//   createdAt: string;
//   @Prop({ type: Boolean, required: true })
//   isMembership: boolean;
//   constructor(
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//     createdAt: string,
//     isMembership: boolean,
//   ) {
//     this.id = id;
//     this.name = name;
//     this.description = description;
//     this.websiteUrl = websiteUrl;
//     this.createdAt = createdAt;
//     this.isMembership = isMembership;
//   }
// }

export type BlogView = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export interface BlogResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogView[];
}
export class BlogSql {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  constructor(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
    this.isMembership = isMembership;
  }
}
// export const BlogSchema = SchemaFactory.createForClass(Blog);
