import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentResponse,
  CommentView,
} from '../schema/comment.schema';
import { Model } from 'mongoose';
import {
  CommentsLikesInfo,
  InformationOfLikeAndDislikeComment,
  InformationOfLikeAndDislikeCommentDocument,
} from '../schema/likeOrDislikeInfoComment.schema';
import { Injectable } from '@nestjs/common';

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
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) protected commentModel: Model<CommentDocument>,
    @InjectModel(InformationOfLikeAndDislikeComment.name)
    protected infoModelC: Model<InformationOfLikeAndDislikeCommentDocument>,
  ) {}
  private mapCommentToView = async (
    comment: Comment,
    userId: string | null,
  ): Promise<CommentView> => {
    const CommentsLikesInfo = await this.infoModelC.findOne({
      commentId: comment.id,
    });
    const userStatus = CommentsLikesInfo?.likesInfo
      ? CommentsLikesInfo?.likesInfo.find((info) => info.userId === userId)
      : { likeStatus: 'None' };
    const myStatus = userStatus ? userStatus.likeStatus : 'None';
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: CommentsLikesInfo ? CommentsLikesInfo.numberOfLikes : 0,
        dislikesCount: CommentsLikesInfo
          ? CommentsLikesInfo.numberOfDislikes
          : 0,
        myStatus: myStatus,
      },
    };
  };
  async findCommentByIdInDb(
    id: string,
    userId: string,
  ): Promise<CommentView | null> {
    const comment: Comment | null = await this.commentModel.findOne({ id: id });
    if (!comment) return null;

    return this.mapCommentToView(comment, userId);
  }
  async findAllCommentsForSpecifeldPostInDb(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    postId: string,
    userId: string | null,
  ): Promise<CommentResponse> {
    const comments: Comment[] = await this.commentModel
      .find({ postId: postId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items = await Promise.all(
      comments.map((c) => this.mapCommentToView(c, userId)),
    );
    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: items,
    };
  }
  async createInformationOfLikeAndDislikeComment(
    newInformationOfLikeAndDislikeComment: InformationOfLikeAndDislikeComment,
  ): Promise<InformationOfLikeAndDislikeComment> {
    const createdInformation = new this.infoModelC(
      newInformationOfLikeAndDislikeComment,
    );
    await createdInformation.save();
    return newInformationOfLikeAndDislikeComment;
  }
  async createCommentInDb(newComment: Comment): Promise<CommentView> {
    const createdComment = new this.commentModel(newComment);
    await createdComment.save();

    return this.mapCommentToView(newComment, newComment.commentatorInfo.userId);
  }
  async updateCommentInDb(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const updateComment = await this.commentModel.updateOne(
      { id: commentId },
      {
        $set: {
          content: content,
        },
      },
    );

    const comment = updateComment.matchedCount === 1;
    return comment;
  }
  async deleteCommentInDb(commentId: string): Promise<boolean> {
    const deletedComment = await this.commentModel.deleteOne({
      id: commentId,
    });

    return deletedComment.deletedCount === 1;
  }
  async findCommentForLikeOrDislike(
    commentId: string,
  ): Promise<Comment | null> {
    const comment = await this.commentModel.findOne({
      id: commentId,
    });
    return comment;
  }
  async findOldLikeOrDislike(commentId: string, userId: string) {
    const result = await this.infoModelC.findOne({
      commentId,
      'likesInfo.userId': userId,
    });
    if (result?.likesInfo) {
      const likeInfo = result.likesInfo.find((info) => info.userId === userId);
      return likeInfo;
    }
    return null;
  }

  async deleteNumberOfLikes(commentId: string): Promise<void> {
    await this.infoModelC.updateOne(
      { commentId },
      { $inc: { numberOfLikes: -1 } },
    );
    return;
  }
  async deleteNumberOfDislikes(commentId: string): Promise<void> {
    await this.infoModelC.updateOne(
      { commentId },
      { $inc: { numberOfDislikes: -1 } },
    );
    return;
  }
  async deleteOldLikeDislike(commentId: string, userId: string): Promise<void> {
    await this.infoModelC.updateOne(
      { commentId, 'likesInfo.userId': userId },
      { $pull: { likesInfo: { userId: userId } } },
    );
    return;
  }
  async updateNumberOfLikes(
    commentId: string,
    newLikeInfo: CommentsLikesInfo,
  ): Promise<boolean> {
    const result = await this.infoModelC.updateOne(
      { commentId },
      { $inc: { numberOfLikes: 1 }, $push: { likesInfo: newLikeInfo } },
    );
    return result.modifiedCount === 1;
  }
  async updateNumberOfDislikes(
    commentId: string,
    newLikeInfo: CommentsLikesInfo,
  ): Promise<boolean> {
    const result = await this.infoModelC.updateOne(
      { commentId },
      { $inc: { numberOfDislikes: 1 }, $push: { likesInfo: newLikeInfo } },
    );
    return result.modifiedCount === 1;
  }
}
