import {
  CommentResponse,
  CommentSql,
  CommentView,
} from '../schema/comment.schema';

import { CommentsLikesAndDislikesSql } from '../schema/likeOrDislikeInfoComment.schema';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryResult } from 'pg';

// export const mapCommentToDto = async (
//   comment: Comment,
//   userId: string | null,
// ): Promise<CommentView> => {
//   const CommentsLikesInfo = await this.infoModelC.findOne({
//     commentId: comment.id,
//   });
//   const userStatus = CommentsLikesInfo?.likesInfo
//     ? CommentsLikesInfo?.likesInfo.find((info) => info.userId === userId)
//     : { likeStatus: 'None' };
//   const myStatus = userStatus ? userStatus.likeStatus : 'None';
//   return {
//     id: comment.id,
//     content: comment.content,
//     commentatorInfo: {
//       userId: comment.commentatorInfo.userId,
//       userLogin: comment.commentatorInfo.userLogin,
//     },
//     createdAt: comment.createdAt,
//     likesInfo: {
//       likesCount: CommentsLikesInfo ? CommentsLikesInfo.numberOfLikes : 0,
//       dislikesCount: CommentsLikesInfo ? CommentsLikesInfo.numberOfDislikes : 0,
//       myStatus: myStatus,
//     },
//   };
// };
@Injectable()
export class CommentRepositorySql {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}
  private mapCommentToView = async (
    comment: CommentSql,
    userId: string | null,
  ): Promise<CommentView> => {
    const likesCountQuery = await this.dataSource.query<number>(`
    SELECT COUNT(*)
  FROM public."CommentsLikesAndDislikes" 
  WHERE 
  "reactionStatus" = 'Like' and "commentId" = '${comment.id}'
`);
    const likesCount = parseInt(likesCountQuery[0]?.count) || 0;

    const dislikesCountQuery = await this.dataSource.query<number>(`
    SELECT COUNT(*)
  FROM public."CommentsLikesAndDislikes" 
  WHERE 
  "reactionStatus" = 'Dislike' and "commentId" = '${comment.id}'
`);
    const dislikesCount = parseInt(dislikesCountQuery[0]?.count) || 0;

    const userStatusQuery = await this.dataSource.query<
      { reactionStatus: string }[]
    >(`
    SELECT "reactionStatus"
    FROM public."CommentsLikesAndDislikes"
    WHERE 
      "userId" = '${userId}' and "commentId" = '${comment.id}'
    `);
    const userStatus =
      userStatusQuery.length === 0 ? 'None' : userStatusQuery[0].reactionStatus;

    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: userStatus,
      },
    };
  };
  async findCommentByIdInDbSql(
    id: string,
    userId: string | null,
  ): Promise<CommentView | null> {
    const comment: QueryResult<CommentSql[] | null> = await this.dataSource
      .query(`
    SELECT *
    FROM public."Comments"
    WHERE 
    "id" = '${id}'
    `);
    if (comment.length === 0) return null;
    return this.mapCommentToView(comment[0], userId);
  }
  async findAllCommentsForSpecifeldPostInDbSql(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    postId: string,
    userId: string | null,
  ): Promise<CommentResponse> {
    const comments = await this.dataSource.query<CommentSql[]>(`
    SELECT * 
    FROM public."Comments"
    WHERE 
    "postId" = '${postId}'
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
    FROM public."Comments"   
    WHERE
      "postId" = '${postId}'    
  `);
    const items = await Promise.all(
      comments.map((c) => this.mapCommentToView(c, userId)),
    );

    return {
      pagesCount: Math.ceil(+totalCountQuery[0].totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCountQuery[0].totalCount,
      items: items,
    };
  }

  async createCommentInDbSql(newComment: CommentSql): Promise<CommentView> {
    const query = `
     INSERT INTO public."Comments"(
     "id",
     "content",
     "userId",
     "userLogin",
     "createdAt",
     "postId")
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`;

    const values = [
      newComment.id,
      newComment.content,
      newComment.userId,
      newComment.userLogin,
      newComment.createdAt,
      newComment.postId,
    ];

    const result = await this.dataSource.query(query, values);
    const comment = result[0];

    return this.mapCommentToView(comment, newComment.userId);
  }
  async updateCommentInDbSql(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const query = `
    UPDATE public."Comments"
    SET
    "content" = $1
    
    WHERE "id" = $2`;

    const values = [content, commentId];
    const [_, commentUpdated] = await this.dataSource.query(query, values);

    return commentUpdated === 1;
  }
  async deleteCommentInDbSql(commentId: string): Promise<boolean> {
    const query = `    
    DELETE
    FROM public."Comments"
    WHERE "id" = $1`;

    const values = [commentId];

    const [_, deletedComment] = await this.dataSource.query(query, values);

    return deletedComment === 1;
  }
  // async findCommentForLikeOrDislike(
  //   commentId: string,
  // ): Promise<Comment | null> {
  //   const comment = await this.commentModel.findOne({
  //     id: commentId,
  //   });
  //   return comment;
  // }
  async findOldLikeOrDislikeSql(commentId: string, userId: string) {
    const query = `
    SELECT *
    FROM public."CommentsLikesAndDislikes"
    WHERE 
    "commentId" = $1 and "userId" = $2`;

    const values = [commentId, userId];
    const oldUsersReaction = await this.dataSource.query(query, values);

    if (oldUsersReaction) {
      return true;
    } else {
      return false;
    }
  }
  async deleteOldLikeDislikeSql(
    commentId: string,
    userId: string,
  ): Promise<void> {
    const query = `
    DELETE 
    FROM public."CommentsLikesAndDislikes"
    WHERE
    "commentId" = $1 and "userId" = $2`;

    const values = [commentId, userId];
    await this.dataSource.query(query, values);
    return;
  }
  async createNewReactionCommentSql(
    newUsersReaction: CommentsLikesAndDislikesSql,
  ): Promise<CommentsLikesAndDislikesSql> {
    const query = `
   INSERT INTO public."CommentsLikesAndDislikes"(
   "commentId",
   "reactionStatus",
   "userId")
    VALUES ($1, $2, $3)
    RETURNING *`;

    const values = [
      newUsersReaction.commentId,
      newUsersReaction.reactionStatus,
      newUsersReaction.userId,
    ];

    return await this.dataSource.query(query, values);
  }
}
