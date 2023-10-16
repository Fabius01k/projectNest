// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Comment } from '../schema/comment.schema';
// import { CommentRepository } from '../repository/comment.repository';
// import { PostRepository } from '../../postNest/repository/post.repository';
//
// @Injectable()
// export class CommentService {
//   constructor(
//     protected commentRepository: CommentRepository,
//     protected postRepository: PostRepository,
//   ) {}
//
//   async getCommentForLikeOrDislike(commentId: string): Promise<Comment | null> {
//     const comment =
//       await this.commentRepository.findCommentForLikeOrDislike(commentId);
//
//     if (!comment) {
//       throw new NotFoundException([
//         {
//           message: 'Comment not found',
//         },
//       ]);
//     }
//     return comment;
//   }
// }
