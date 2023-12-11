import {
  CommentResponse,
  CommentSql,
  CommentView,
} from '../schema/comment.schema';

import { CommentsLikesAndDislikesSql } from '../schema/likeOrDislikeInfoComment.schema';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QueryResult } from 'pg';
import { CommentTrm } from '../../entities/comment.entity';
import { CommentsLikesAndDislikesTrm } from '../../entities/comment-likes.entity';

@Injectable()
export class CommentRepositoryTypeOrm {
  constructor(
    @InjectRepository(CommentTrm)
    protected commentRepository: Repository<CommentTrm>,
    @InjectRepository(CommentsLikesAndDislikesTrm)
    protected commentLikesRepository: Repository<CommentsLikesAndDislikesTrm>,
  ) {}
  private mapCommentToView = async (
    comment: CommentTrm,
    userId: string | null,
  ): Promise<CommentView> => {
    const likesBuilder = await this.commentLikesRepository
      .createQueryBuilder('CommentsLikesAndDislikesTrm')
      .where('CommentsLikesAndDislikesTrm.reactionStatus = :status', {
        status: 'Like',
      })
      .andWhere('CommentsLikesAndDislikesTrm.commentId = :commentId', {
        commentId: comment.id,
      })
      .andWhere('CommentsLikesAndDislikesTrm.isBanned = false');

    const likesCount = await likesBuilder.getCount();

    const dislikesBuilder = await this.commentLikesRepository
      .createQueryBuilder('CommentsLikesAndDislikesTrm')
      .where('CommentsLikesAndDislikesTrm.reactionStatus = :status', {
        status: 'Dislike',
      })
      .andWhere('CommentsLikesAndDislikesTrm.commentId = :commentId', {
        commentId: comment.id,
      })
      .andWhere('CommentsLikesAndDislikesTrm.isBanned = false');

    const dislikesCount = await dislikesBuilder.getCount();

    const userStatusQuery = await this.commentLikesRepository
      .createQueryBuilder('CommentsLikesAndDislikesTrm')
      .where('CommentsLikesAndDislikesTrm.userId = :userId', { userId: userId })
      .andWhere('CommentsLikesAndDislikesTrm.commentId = :commentId', {
        commentId: comment.id,
      })
      .getOne();

    const userStatus = userStatusQuery
      ? userStatusQuery.reactionStatus
      : 'None';

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
  async findCommentByIdInDbTrm(
    id: string,
    userId: string | null,
  ): Promise<CommentView | null> {
    const comment = await this.commentRepository
      .createQueryBuilder('CommentTrm')
      .where('CommentTrm.id =:id', { id })
      .andWhere('CommentTrm.isBanned = false')
      .getOne();
    if (comment) {
      return this.mapCommentToView(comment, userId);
    } else {
      return null;
    }
  }
  async findAllCommentsForSpecifeldPostInDbTrm(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    postId: string,
    userId: string | null,
  ): Promise<CommentResponse> {
    const queryBuilder = await this.commentRepository
      .createQueryBuilder('CommentTrm')
      .where('CommentTrm.postId =:postId', { postId })
      .andWhere('CommentTrm.isBanned =:status', { status: false })
      .orderBy(
        'CommentTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const comments = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    const items = await Promise.all(
      comments.map((c) => this.mapCommentToView(c, userId)),
    );

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }

  async createCommentInDbTrm(newComment: CommentTrm): Promise<CommentView> {
    const createdComment = await this.commentRepository.save(newComment);
    return this.mapCommentToView(createdComment, newComment.userId);
  }
  async updateCommentInDbTrm(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const updatedComment = await this.commentRepository.update(
      { id: commentId },
      {
        content: content,
      },
    );

    return (
      updatedComment.affected !== null &&
      updatedComment.affected !== undefined &&
      updatedComment.affected > 0
    );
  }
  async deleteCommentInDbTrm(commentId: string): Promise<boolean> {
    console.log(commentId);
    const deletedComment = await this.commentRepository.delete({
      id: commentId,
    });
    return (
      deletedComment.affected !== null &&
      deletedComment.affected !== undefined &&
      deletedComment.affected > 0
    );
  }
  // // async findCommentForLikeOrDislike(
  // //   commentId: string,
  // // ): Promise<Comment | null> {
  // //   const comment = await this.commentModel.findOne({
  // //     id: commentId,
  // //   });
  // //   return comment;
  // // }
  async findOldLikeOrDislikeTrm(
    commentId: string,
    userId: string,
  ): Promise<boolean> {
    const oldUsersReaction = await this.commentLikesRepository
      .createQueryBuilder('CommentsLikesAndDislikesTrm')
      .where('CommentsLikesAndDislikesTrm.commentId =:commentId', {
        commentId,
      })
      .andWhere('CommentsLikesAndDislikesTrm.userId =:userId', { userId })
      .getOne();

    if (oldUsersReaction) {
      return true;
    } else {
      return false;
    }
  }
  async deleteOldLikeDislikeTrm(
    commentId: string,
    userId: string,
  ): Promise<void> {
    await this.commentLikesRepository
      .createQueryBuilder('CommentsLikesAndDislikesTrm')
      .delete()
      .from('CommentsLikesAndDislikesTrm')
      .where('commentId =:commentId', { commentId })
      .andWhere('userId =:userId', { userId })
      .delete()
      .execute();

    return;
  }
  async createNewReactionCommentTrm(
    newUsersReaction: CommentsLikesAndDislikesSql,
  ): Promise<void> {
    await this.commentLikesRepository.save(newUsersReaction);

    return;
  }
  async banComments(id: string, isBanned: boolean): Promise<boolean> {
    const commentBanned = await this.commentRepository.update(
      { userId: id },
      {
        isBanned: isBanned,
      },
    );

    return (
      commentBanned.affected !== null &&
      commentBanned.affected !== undefined &&
      commentBanned.affected > 0
    );
  }
  async banCommentLikes(id: string, isBanned: boolean): Promise<boolean> {
    const commentsLikeBanned = await this.commentLikesRepository.update(
      { userId: id },
      {
        isBanned: isBanned,
      },
    );

    return (
      commentsLikeBanned.affected !== null &&
      commentsLikeBanned.affected !== undefined &&
      commentsLikeBanned.affected > 0
    );
  }
}
