import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Comment,
  CommentResponse,
  CommentView,
} from '../schema/comment.schema';
import { CommentRepository } from '../repository/comment.repository';
import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { PostRepository } from '../../postNest/repository/post.repository';
import { UserRepository } from '../../userNest/repository/user.repository';
import { ObjectId } from 'mongodb';

import { InformationOfLikeAndDislikeComment } from '../schema/likeOrDislikeInfoComment.schema';
import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';

@Injectable()
export class CommentService {
  constructor(
    protected commentRepository: CommentRepository,
    protected postRepository: PostRepository,
    protected userRepository: UserRepository,
  ) {}
  async getCommentById(
    id: string,
    userId: string,
  ): Promise<CommentView | null> {
    const comment = await this.commentRepository.findCommentByIdInDb(
      id,
      userId,
    );
    if (!comment) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return comment;
  }
  async getAllCommentForSpecifeldPost(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    postId: string,
    userId: string | null,
  ): Promise<CommentResponse> {
    return await this.commentRepository.findAllCommentsForSpecifeldPostInDb(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      postId,
      userId,
    );
  }
  async postComment(
    commentDto: CommentInputModel,
    postId: string,
    userId: string,
  ): Promise<CommentView | null> {
    const dateNow = new Date().getTime().toString();
    const post = await this.postRepository.findPostByIdInDb(postId, userId);

    if (!post) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    const user = await this.userRepository.findUserInformationByIdInDb(userId);

    const newComment = new Comment(
      new ObjectId(),
      dateNow,
      commentDto.content,
      {
        userId: user!.id,
        userLogin: user!.accountData.userName.login,
      },
      new Date().toISOString(),
      postId,
    );

    const newInformationOfLikeAndDislikeComment =
      new InformationOfLikeAndDislikeComment(newComment.id, 0, 0, []);

    await this.commentRepository.createInformationOfLikeAndDislikeComment(
      newInformationOfLikeAndDislikeComment,
    );

    return await this.commentRepository.createCommentInDb(newComment);
  }
  async putComment(
    commentId: string,
    commentDto: CommentInputModel,
  ): Promise<boolean> {
    const updateComment = await this.commentRepository.updateCommentInDb(
      commentId,
      commentDto.content,
    );
    if (!updateComment) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return true;
  }
  async deleteComment(commentId: string): Promise<boolean> {
    const commentDeleted =
      await this.commentRepository.deleteCommentInDb(commentId);

    if (!commentDeleted) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return true;
  }
  async getCommentForLikeOrDislike(commentId: string): Promise<Comment | null> {
    const comment =
      await this.commentRepository.findCommentForLikeOrDislike(commentId);

    if (!comment) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return comment;
  }
  async makeLikeOrDislike(
    userId: string,
    commentId: string,
    likeDto: LikeInputModel,
    dateOfLikeDislike: Date,
  ): Promise<boolean> {
    const oldLikeOrDislikeOfUser =
      await this.commentRepository.findOldLikeOrDislike(commentId, userId);

    if (oldLikeOrDislikeOfUser) {
      if (oldLikeOrDislikeOfUser.likeStatus === 'Like') {
        await this.commentRepository.deleteNumberOfLikes(commentId);
      } else if (oldLikeOrDislikeOfUser.likeStatus === 'Dislike') {
        await this.commentRepository.deleteNumberOfDislikes(commentId);
      }
      await this.commentRepository.deleteOldLikeDislike(commentId, userId);
    }
    const newLikeInfo = {
      userId: userId,
      likeStatus: likeDto.likeStatus,
      dateOfLikeDislike: dateOfLikeDislike,
    };
    if (likeDto.likeStatus === 'Like')
      return this.commentRepository.updateNumberOfLikes(commentId, newLikeInfo);

    if (likeDto.likeStatus === 'Dislike')
      return this.commentRepository.updateNumberOfDislikes(
        commentId,
        newLikeInfo,
      );
    return true;
  }
}
