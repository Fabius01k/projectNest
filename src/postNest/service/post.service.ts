import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../schema/post-schema';
import { PostRepository } from '../repository/post.repository';
import { BlogRepository } from '../../blogNest/repository/blog.repository';

@Injectable()
export class PostService {
  constructor(
    protected postRepository: PostRepository,
    protected blogRepository: BlogRepository,
  ) {}

  async getPostForLikeOrDislike(postId: string): Promise<Post | null> {
    const post = await this.postRepository.findPostForLikeOrDislike(postId);

    if (!post) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return post;
  }
}
