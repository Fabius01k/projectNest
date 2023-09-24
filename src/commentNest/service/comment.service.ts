import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../schema/comment.schema';
import { CommentRepository } from '../repository/comment.repository';
import { PostRepository } from '../../postNest/repository/post.repository';
import { UserRepository } from '../../userNest/repository/user.repository';

@Injectable()
export class CommentService {
  constructor(
    protected commentRepository: CommentRepository,
    protected postRepository: PostRepository,
    protected userRepository: UserRepository,
  ) {}

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
}
