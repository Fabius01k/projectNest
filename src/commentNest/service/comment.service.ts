import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentResponse, CommentView } from '../schema/comment.schema';
import { CommentRepository } from '../repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(protected commentRepository: CommentRepository) {}
  async getCommentById(id: string): Promise<CommentView | null> {
    const comment = await this.commentRepository.findCommentByIdInDb(id);
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
  ): Promise<CommentResponse> {
    return await this.commentRepository.findAllCommentsForSpecifeldPostInDb(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      postId,
    );
  }
}
