import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Post,
  PostCreateByBlogIdInputModel,
  PostCreateInputModel,
  PostResponse,
  PostView,
} from '../schema/post-schema';
import { PostRepository } from '../repository/post.repository';
import { BlogRepository } from '../../blogNest/repository/blog.repository';
import { ObjectId } from 'mongodb';
import { InformationOfLikeAndDislikePost } from '../schema/likeOrDislikeInfoPost-schema';

@Injectable()
export class PostService {
  constructor(
    protected postRepository: PostRepository,
    protected blogRepository: BlogRepository,
  ) {}
  async getAllPosts(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<PostResponse> {
    return await this.postRepository.findAllPostsInDb(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    );
  }
  async getAllPostsForSpecifeldBlog(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    blogId: string,
  ): Promise<PostResponse> {
    return await this.postRepository.findAllPostsForSpecifeldBlogInDb(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      blogId,
    );
  }
  async getPostById(id: string): Promise<PostView | null> {
    const post = await this.postRepository.findPostByIdInDb(id);
    if (!post) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return post;
  }
  async postPost(postDto: PostCreateInputModel): Promise<PostView | null> {
    const dateNow = new Date().getTime().toString();
    const blog = await this.blogRepository.findBlogByIdInDb(postDto.blogId);

    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }

    const newPost = new Post(
      new ObjectId(),
      dateNow,
      postDto.title,
      postDto.shortDescription,
      postDto.content,
      postDto.blogId,
      blog.name,
      new Date().toISOString(),
    );

    const postId = newPost.id;
    const InfOfLikeAndDislikePost = new InformationOfLikeAndDislikePost(
      postId,
      0,
      0,
      [],
    );
    await this.postRepository.createInfOfLikeAndDislikePost(
      InfOfLikeAndDislikePost,
    );

    return await this.postRepository.createPostInDb(newPost);
  }
  async postPostForSpecifeldBlog(
    postDto: PostCreateByBlogIdInputModel,
    blogId: string,
  ): Promise<PostView | null> {
    const dateNow = new Date().getTime().toString();
    const blog = await this.blogRepository.findBlogByIdInDb(blogId);

    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    const newPost = new Post(
      new ObjectId(),
      dateNow,
      postDto.title,
      postDto.shortDescription,
      postDto.content,
      blogId,
      blog.name,
      new Date().toISOString(),
    );

    const postId = newPost.id;
    const InfOfLikeAndDislikePost = new InformationOfLikeAndDislikePost(
      postId,
      0,
      0,
      [],
    );
    await this.postRepository.createInfOfLikeAndDislikePost(
      InfOfLikeAndDislikePost,
    );

    return await this.postRepository.createPostInDb(newPost);
  }
  async putPost(id: string, postDto: PostCreateInputModel): Promise<boolean> {
    const updatedPost = await this.postRepository.updatePostInDb(
      id,
      postDto.title,
      postDto.shortDescription,
      postDto.content,
      postDto.blogId,
    );
    if (!updatedPost) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return true;
  }
  async deletePost(id: string): Promise<boolean> {
    const postDeleted = await this.postRepository.deletePostInDb(id);
    if (!postDeleted) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return true;
  }
}
