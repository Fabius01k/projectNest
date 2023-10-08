import { Injectable } from '@nestjs/common';
import { Post, PostResponse, PostSql, PostView } from '../schema/post-schema';
import { PostsLikesAndDislikesSql } from '../schema/likeOrDislikeInfoPost-schema';
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

    const userStatusQuery = await this.dataSource.query<
      { reactionStatus: string }[]
    >(`
    SELECT "reactionStatus"
    FROM public."PostsLikesAndDislikes"
    WHERE 
      "userId" = '${userId}' and "postId" = '${post.id}'
    `);
    console.log(userStatusQuery[0]);
    const userStatus =
      userStatusQuery.length === 0 ? 'None' : userStatusQuery[0].reactionStatus;

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

  async createNewReactionPostSql(
    newUsersReaction: PostsLikesAndDislikesSql,
  ): Promise<PostsLikesAndDislikesSql> {
    const query = `
   INSERT INTO public."PostsLikesAndDislikes"(
   "postId",
   "userLogin",
   "reactionStatus",
   "addedAt",
   "userId")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;

    const values = [
      newUsersReaction.postId,
      newUsersReaction.userLogin,
      newUsersReaction.reactionStatus,
      newUsersReaction.addedAt,
      newUsersReaction.userId,
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
  async findOldLikeOrDislikeSql(
    postId: string,
    userId: string,
  ): Promise<boolean> {
    const query = `
    SELECT *
    FROM public."PostsLikesAndDislikes"
    WHERE 
    "postId" = $1 and "userId" = $2`;

    const values = [postId, userId];
    const oldUsersReaction = await this.dataSource.query(query, values);

    if (oldUsersReaction) {
      return true;
    } else {
      return false;
    }
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
  async deleteOldLikeDislikeSql(postId: string, userId: string): Promise<void> {
    const query = `
    DELETE 
    FROM public."PostsLikesAndDislikes"
    WHERE
    "postId" = $1 and "userId" = $2`;

    const values = [postId, userId];
    await this.dataSource.query(query, values);
    return;
  }
}
