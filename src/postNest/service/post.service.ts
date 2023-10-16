// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Post } from '../schema/post-schema';
// import { PostRepository } from '../repository/post.repository';
// import { PostRepositorySql } from '../repository/post.repositorySql';
//
// @Injectable()
// export class PostService {
//   constructor(
//     protected postRepository: PostRepository,
//     protected postRepositorySql: PostRepositorySql,
//   ) {}
//
//   async getPostForLikeOrDislike(
//     postId: string,
//     userId: string,
//   ): Promise<Post | null> {
//     const post = await this.postRepositorySql.findPostByIdInDbSql(
//       postId,
//       userId,
//     );
//
//     if (!post) {
//       throw new NotFoundException([
//         {
//           message: 'Post not found',
//         },
//       ]);
//     }
//     return post;
//   }
// }
