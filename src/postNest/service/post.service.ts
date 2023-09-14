import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostResponse, PostView } from '../schema/post-schema';
import { PostRepository } from '../repository/post.repository';
import { BlogRepository } from '../../blogNest/repository/blog.repository';
import { ObjectId } from 'mongodb';
import { InformationOfLikeAndDislikePost } from '../schema/likeOrDislikeInfoPost-schema';
import {
  PostCreateByBlogIdInputModel,
  PostCreateInputModel,
} from '../../inputmodels-validation/post.inputModel';
import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';

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
    userId: string | null,
  ): Promise<PostResponse> {
    return await this.postRepository.findAllPostsInDb(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      userId,
    );
  }
  async getAllPostsForSpecifeldBlog(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    blogId: string,
    userId: string | null,
  ): Promise<PostResponse> {
    return await this.postRepository.findAllPostsForSpecifeldBlogInDb(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      blogId,
      userId,
    );
  }
  async getPostById(
    id: string,
    userId: string | null,
  ): Promise<PostView | null> {
    const post = await this.postRepository.findPostByIdInDb(id, userId);
    if (!post) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return post;
  }
  async postPost(
    postDto: PostCreateInputModel,
    userId: string | null,
  ): Promise<PostView | null> {
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

    return await this.postRepository.createPostInDb(newPost, userId);
  }
  async postPostForSpecifeldBlog(
    postDto: PostCreateByBlogIdInputModel,
    blogId: string,
    userId: string | null,
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

    return await this.postRepository.createPostInDb(newPost, userId);
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
  async makeLikeOrDislike(
    userId: string,
    login: string,
    postId: string,
    likeDto: LikeInputModel,
    dateOfLikeDislike: Date,
  ): Promise<boolean> {
    const oldLikeOrDislikeOfUser =
      await this.postRepository.findOldLikeOrDislike(postId, userId);

    if (oldLikeOrDislikeOfUser) {
      if (oldLikeOrDislikeOfUser.likeStatus === 'Like') {
        await this.postRepository.deleteNumberOfLikes(postId);
      } else if (oldLikeOrDislikeOfUser.likeStatus === 'Dislike') {
        await this.postRepository.deleteNumberOfDislikes(postId);
      }
      await this.postRepository.deleteOldLikeDislike(postId, userId);
    }
    const newLikeInfo = {
      userId: userId,
      login: login,
      likeStatus: likeDto.likeStatus,
      dateOfLikeDislike: dateOfLikeDislike,
    };
    if (likeDto.likeStatus === 'Like')
      return this.postRepository.updateNumberOfLikes(postId, newLikeInfo);

    if (likeDto.likeStatus === 'Dislike')
      return this.postRepository.updateNumberOfDislikes(postId, newLikeInfo);
    return true;
  }
}
