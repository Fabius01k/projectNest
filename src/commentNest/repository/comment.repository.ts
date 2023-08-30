import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentResponse,
  CommentView,
} from './schema/comment.schema';
import { Model } from 'mongoose';
import {
  InformationOfLikeAndDislikeComment,
  InformationOfLikeAndDislikeCommentDocument,
} from './schema/likeOrDislikeInfoComment.schema';
import { Injectable } from '@nestjs/common';

export const mapCommentToDto = async (
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
      dislikesCount: CommentsLikesInfo ? CommentsLikesInfo.numberOfDislikes : 0,
      myStatus: myStatus,
    },
  };
};
@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) protected commentModel: Model<CommentDocument>,
    @InjectModel(InformationOfLikeAndDislikeComment.name)
    protected infoModelC: Model<InformationOfLikeAndDislikeCommentDocument>,
  ) {}
  async findCommentByIdInDb(id: string): Promise<CommentView | null> {
    const comment: Comment | null = await this.commentModel.findOne({ id: id });
    if (!comment) return null;

    const userId = null;
    return mapCommentToDto(comment, userId);
  }
  async findAllCommentsForSpecifeldPostInDb(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    postId: string,
  ): Promise<CommentResponse> {
    const comments: Comment[] = await this.commentModel
      .find({ postId: postId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const userId = null;
    const items = await Promise.all(
      comments.map((c) => mapCommentToDto(c, userId)),
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
}
