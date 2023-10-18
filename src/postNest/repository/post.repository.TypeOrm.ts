import { Injectable } from '@nestjs/common';
import { Post, PostResponse, PostSql, PostView } from '../schema/post-schema';
import { PostsLikesAndDislikesSql } from '../schema/likeOrDislikeInfoPost-schema';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QueryResult } from 'pg';
import { PostTrm } from '../../entities/post.entity';
import { PostsLikesAndDislikesTrm } from '../../entities/post-likes.entity';

@Injectable()
export class PostRepositoryTypeOrm {
  constructor(
    @InjectRepository(PostTrm)
    protected postRepository: Repository<PostTrm>,
    @InjectRepository(PostsLikesAndDislikesTrm)
    protected postLikesRepository: Repository<PostsLikesAndDislikesTrm>,
  ) {}
  private async mapPostToView(
    post: PostTrm,
    userId: string | null,
  ): Promise<PostView> {
    const likesBuilder = await this.postLikesRepository
      .createQueryBuilder('PostsLikesAndDislikesTrm')
      .where('PostsLikesAndDislikesTrm.reactionStatus = :status', {
        status: 'Like',
      })
      .andWhere('PostsLikesAndDislikesTrm.postId = :postId', {
        postId: post.id,
      });

    const likesCount = await likesBuilder.getCount();

    const dislikesBuilder = await this.postLikesRepository
      .createQueryBuilder('PostsLikesAndDislikesTrm')
      .where('PostsLikesAndDislikesTrm.reactionStatus = :status', {
        status: 'Dislike',
      })
      .andWhere('PostsLikesAndDislikesTrm.postId = :postId', {
        postId: post.id,
      });

    const dislikesCount = await dislikesBuilder.getCount();

    const userStatusQuery = await this.postLikesRepository
      .createQueryBuilder('PostsLikesAndDislikesTrm')
      .where('PostsLikesAndDislikesTrm.userId = :userId', { userId: userId })
      .andWhere('PostsLikesAndDislikesTrm.postId = :postId', {
        postId: post.id,
      })
      .getOne();

    const userStatus = userStatusQuery
      ? userStatusQuery.reactionStatus
      : 'None';

    const newestLikesBuilder = await this.postLikesRepository
      .createQueryBuilder('PostsLikesAndDislikesTrm')
      .select([
        'PostsLikesAndDislikesTrm.userId',
        'PostsLikesAndDislikesTrm.userLogin',
        'PostsLikesAndDislikesTrm.addedAt',
      ])
      .leftJoin(
        'PostsLikesAndDislikesTrm.post',
        'PostTrm',
        'PostTrm.id = PostsLikesAndDislikesTrm.postId',
      )
      .where('PostsLikesAndDislikesTrm.reactionStatus = :status', {
        status: 'Like',
      })
      .andWhere('PostsLikesAndDislikesTrm.postId = :postId', {
        postId: post.id,
      })
      .orderBy('PostsLikesAndDislikesTrm.addedAt', 'DESC')
      .limit(3)
      .getMany();

    const newestLikes = newestLikesBuilder.map((item) => ({
      addedAt: new Date(item.addedAt),
      userId: item.userId,
      login: item.userLogin,
    }));

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: userStatus,
        newestLikes: newestLikes,
      },
    };
  }

  async findAllPostsInDbTrm(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    userId: string | null,
  ): Promise<PostResponse> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('PostTrm')
      .where(
        `${
          searchNameTerm
            ? 'PostTrm.title ilike :searchNameTerm'
            : 'PostTrm.title is not null'
        }`,
        { searchNameTerm: `%${searchNameTerm}%` },
      )
      .orderBy(
        'PostTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const posts = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    const items = await Promise.all(
      posts.map((p) => this.mapPostToView(p, userId)),
    );

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }
  async createPostInDbTrm(
    newPost: PostTrm,
    userId: string | null,
  ): Promise<PostView> {
    const createdPost = await this.postRepository.save(newPost);

    return this.mapPostToView(createdPost, userId);
  }

  async findAllPostsForSpecifeldBlogInDbTrm(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    blogId: string,
    userId: string | null,
  ): Promise<PostResponse> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('PostTrm')
      .where('PostTrm.blogId = :blogId', { blogId })
      .orderBy(
        'PostTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const posts = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    const items = await Promise.all(
      posts.map((p) => this.mapPostToView(p, userId)),
    );

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }

  async findPostByIdInDbTrm(
    id: string,
    userId: string | null,
  ): Promise<PostView | null> {
    const post = await this.postRepository
      .createQueryBuilder('PostTrm')
      .where('PostTrm.id =:id', { id })
      .getOne();
    if (post) {
      return this.mapPostToView(post, userId);
    } else {
      return null;
    }
  }

  async updatePostInDbTrm(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<boolean> {
    const updatedPost = await this.postRepository.update(
      { id: postId },
      {
        title: title,
        shortDescription: shortDescription,
        content: content,
      },
    );

    return (
      updatedPost.affected !== null &&
      updatedPost.affected !== undefined &&
      updatedPost.affected > 0
    );
  }
  async deletePostInDbTrm(postId: string): Promise<boolean> {
    const deletedPost = await this.postRepository.delete({ id: postId });
    return (
      deletedPost.affected !== null &&
      deletedPost.affected !== undefined &&
      deletedPost.affected > 0
    );
  }
  async findOldLikeOrDislikeTrm(
    postId: string,
    userId: string,
  ): Promise<boolean> {
    const oldUsersReaction = await this.postLikesRepository
      .createQueryBuilder('PostsLikesAndDislikesTrm')
      .where('PostsLikesAndDislikesTrm.postId =:postId', { postId })
      .andWhere('PostsLikesAndDislikesTrm.userId =:userId', { userId })
      .getOne();

    if (oldUsersReaction) {
      return true;
    } else {
      return false;
    }
  }
  async deleteOldLikeDislikeTrm(postId: string, userId: string): Promise<void> {
    await this.postLikesRepository
      .createQueryBuilder('PostsLikesAndDislikesTrm')
      .delete()
      .from('PostsLikesAndDislikesTrm')
      .where('postId =:postId', { postId })
      .andWhere('userId =:userId', { userId })
      .delete()
      .execute();

    return;
  }

  async createNewReactionPostTrm(
    newUsersReaction: PostsLikesAndDislikesSql,
  ): Promise<void> {
    await this.postLikesRepository.save(newUsersReaction);

    return;
  }
}
