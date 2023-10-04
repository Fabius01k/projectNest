import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostResponse,
  PostSql,
  PostView,
} from '../schema/post-schema';
import { Model } from 'mongoose';
import { InformationOfLikeAndDislikePost } from '../schema/likeOrDislikeInfoPost-schema';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryResult } from 'pg';
// SELECT p.*,
//   (SELECT count(*)
// FROM "PostsLikesAndDislikes" l
// WHERE l."reactionStatus" = 'Like' and l."postId" = p."id" ) as "likesCount",
//   (SELECT count(*)
// FROM "PostsLikesAndDislikes" l
// WHERE l."reactionStatus" = 'Dislike' and l."postId" = p."id" ) as "dislikesCount",
//   (SELECT l."reactionStatus"
// FROM "PostsLikesAndDislikes" l
// WHERE l."postId" = p."id" ) as "myStatus",
//   (SELECT array
// (SELECT row_to_json(row)
// FROM (select l."userId", l."userLogin" as "login", l."addedAt"
// FROM "PostsLikesAndDislikes" l
// WHERE l."status" = 'Like'
// ORDER BY "addedAt" desc
// LIMIT 3
// OFFSET 0) as row) as "newestLikes"
//
// FROM public."Posts" p
@Injectable()
export class PostRepositorySql {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}
  private async mapPostToView(
    post: PostSql,
    userId: string | null,
  ): Promise<PostView> {
    const likesCountQuery = await this.dataSource.query<number>(`
    SELECT COUNT(*)
  FROM public."PostsLikesAndDislikes" 
  WHERE 
  "reactionStatus" = 'Like' and "postId" = '${post.id}'
`);
    // const likesCount = likesCountQuery[0]?.count ?? 0;
    const likesCount = parseInt(likesCountQuery[0]?.count) || 0;

    const dislikesCountQuery = await this.dataSource.query<number>(`
    SELECT COUNT(*)
  FROM public."PostsLikesAndDislikes" 
  WHERE 
  "reactionStatus" = 'Dislike' and "postId" = '${post.id}'
`);
    // const dislikesCount = dislikesCountQuery[0]?.count ?? 0;
    const dislikesCount = parseInt(dislikesCountQuery[0]?.count) || 0;

    const userStatusQuery = await this.dataSource.query<string>(`
    SELECT "reactionStatus"
    FROM public."PostsLikesAndDislikes"
    WHERE 
      "userId" = '${userId}'   
    `);
    const userStatus =
      userStatusQuery.length === 0 ? 'None' : userStatusQuery[0];

    const newestLikesQuery = await this.dataSource.query(`
    SELECT array(
    SELECT row_to_json(row)
    FROM (
      SELECT p."userId", 
      (SELECT u.login
        FROM public."Users" u
        WHERE u."id" = p."userId"
      ) as "login", p."addedAt"
      FROM public."PostsLikesAndDislikes" p
      WHERE p."reactionStatus" = 'Like'
      ORDER BY p."addedAt" DESC
      LIMIT 3
      OFFSET 0
    ) as row
  )
    `);
    const newestLikes = newestLikesQuery[0]?.array ?? [];

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: userStatus,
        newestLikes: newestLikes,
      },
    };
  }

  async findAllPostsInDbSql(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    userId: string | null,
  ): Promise<PostResponse> {
    const posts = await this.dataSource.query<PostSql[]>(`
    SELECT * 
    FROM public."Posts"
    WHERE 
       "title" ILIKE '%${searchNameTerm ?? ''}%'
    ORDER BY 
      "${sortBy}" ${sortDirection}
    LIMIT 
       ${pageSize}
    OFFSET 
        ${(pageNumber - 1) * pageSize}   
    `);

    const totalCountQuery = await this.dataSource.query<
      { totalCount: string }[]
    >(`
    SELECT COUNT(*) AS "totalCount"
    FROM public."Posts"   
    WHERE
      "title" ILIKE '%${searchNameTerm ?? ''}%'     
  `);
    // const items = posts.map((p) => this.mapPostToView(p, userId));
    const items = await Promise.all(
      posts.map((p) => this.mapPostToView(p, userId)),
    );

    return {
      pagesCount: Math.ceil(+totalCountQuery[0].totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCountQuery[0].totalCount,
      items: items,
    };
  }
  async createPostInDbSql(
    newPost: Post,
    userId: string | null,
  ): Promise<PostView> {
    const query = `
    INSERT INTO public."Posts"(
    "id",
    "title",
    "shortDescription",
    "content",
    "blogId",
    "blogName",
    "createdAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;

    const values = [
      newPost.id,
      newPost.title,
      newPost.shortDescription,
      newPost.content,
      newPost.blogId,
      newPost.blogName,
      newPost.createdAt,
    ];

    await this.dataSource.query(query, values);
    return this.mapPostToView(newPost, userId);
  }
  async createInfOfLikeAndDislikePostSql(
    InfOfLikeAndDislikePost: InformationOfLikeAndDislikePost,
  ): Promise<InformationOfLikeAndDislikePost> {
    const query = `
   INSERT INTO public."PostsLikesAndDIslikes"(
   "postId",
   "numberOfLikes",
   "numberOfDislikes",
   "likesInfo")
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

    const values = [
      InfOfLikeAndDislikePost.postId,
      InfOfLikeAndDislikePost.numberOfLikes,
      InfOfLikeAndDislikePost.numberOfDislikes,
      InfOfLikeAndDislikePost.likesInfo,
    ];

    return await this.dataSource.query(query, values);
  }

  async findAllPostsForSpecifeldBlogInDbSql(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    blogId: string,
    userId: string | null,
  ): Promise<PostResponse> {
    const posts = await this.dataSource.query<PostSql[]>(`
    SELECT * 
    FROM public."Posts"
    WHERE 
       "blogId" = '${blogId}'
    ORDER BY 
      "${sortBy}" ${sortDirection}
    LIMIT 
       ${pageSize}
    OFFSET 
        ${(pageNumber - 1) * pageSize}   
    `);

    const totalCountQuery = await this.dataSource.query<
      { totalCount: string }[]
    >(`
    SELECT COUNT(*) AS "totalCount"
    FROM public."Posts"   
    WHERE
      "blogId" = '${blogId}'    
  `);
    // const items = posts.map((p) => this.mapPostToView(p, userId));
    const items = await Promise.all(
      posts.map((p) => this.mapPostToView(p, userId)),
    );

    return {
      pagesCount: Math.ceil(+totalCountQuery[0].totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCountQuery[0].totalCount,
      items: items,
    };
  }
  async findPostByIdInDbSql(
    id: string,
    userId: string | null,
  ): Promise<PostView | null> {
    const post: QueryResult<PostView[] | null> = await this.dataSource.query(`
    SELECT *
    FROM public."Posts"
    WHERE 
    "id" = '${id}'
    `);
    if (post.length === 0) return null;
    return this.mapPostToView(post[0], userId);
  }

  async updatePostInDbSql(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<boolean> {
    const query = `
    UPDATE public."Posts"
    SET
    "title" = $1,
    "shortDescription" = $2,
    "content" = $3
    
    WHERE "id" = $4`;

    const values = [title, shortDescription, content, postId];
    const [_, postUpdated] = await this.dataSource.query(query, values);

    return postUpdated === 1;
  }
  async deletePostInDbSql(postId: string): Promise<boolean> {
    const query = `    
    DELETE
    FROM public."Posts"
    WHERE "id" = $1`;

    const values = [postId];

    const [_, deletedPost] = await this.dataSource.query(query, values);

    return deletedPost === 1;
  }

  // async findPostForLikeOrDislike(postId: string): Promise<Post | null> {
  //   const post = await this.postModel.findOne({ id: postId });
  //   return post;
  // }
  // async findOldLikeOrDislike(postId: string, userId: string) {
  //   const result = await this.infoModel.findOne({
  //     postId,
  //     'likesInfo.userId': userId,
  //   });
  //   if (result?.likesInfo) {
  //     const likeInfo = result.likesInfo.find((info) => info.userId === userId);
  //     return likeInfo;
  //   }
  //   return null;
  // }
  // async deleteNumberOfLikes(postId: string): Promise<void> {
  //   await this.infoModel.updateOne({ postId }, { $inc: { numberOfLikes: -1 } });
  //   return;
  // }
  // async deleteNumberOfDislikes(postId: string): Promise<void> {
  //   await this.infoModel.updateOne(
  //     { postId },
  //     { $inc: { numberOfDislikes: -1 } },
  //   );
  //   return;
  // }
  // async deleteOldLikeDislike(postId: string, userId: string): Promise<void> {
  //   await this.infoModel.updateOne(
  //     { postId, 'likesInfo.userId': userId },
  //     { $pull: { likesInfo: { userId: userId } } },
  //   );
  //   return;
  // }
  // async updateNumberOfLikes(
  //   postId: string,
  //   newLikeInfo: CommentsLikesInfo,
  // ): Promise<boolean> {
  //   const result = await this.infoModel.updateOne(
  //     { postId },
  //     { $inc: { numberOfLikes: 1 }, $push: { likesInfo: newLikeInfo } },
  //   );
  //   return result.modifiedCount === 1;
  // }
  // async updateNumberOfDislikes(
  //   postId: string,
  //   newLikeInfo: CommentsLikesInfo,
  // ): Promise<boolean> {
  //   const result = await this.infoModel.updateOne(
  //     { postId },
  //     { $inc: { numberOfDislikes: 1 }, $push: { likesInfo: newLikeInfo } },
  //   );
  //   return result.modifiedCount === 1;
  // }
}
