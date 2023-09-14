import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostResponse,
  PostView,
} from '../schema/post-schema';
import { Model } from 'mongoose';
import {
  InformationOfLikeAndDislikePost,
  InformationOfLikeAndDislikePostDocument,
} from '../schema/likeOrDislikeInfoPost-schema';
import { Blog, BlogDocument } from '../../blogNest/schema/blog-schema';
import { CommentsLikesInfo } from '../../commentNest/schema/likeOrDislikeInfoComment.schema';

// export const mapPostToDto = async (
//   post: Post,
//   userId: string | null,
// ): Promise<PostView> => {
//   const PostsLikesInfo = await this.infoModel.findOne({ postId: post.id });
//   const userStatus = PostsLikesInfo?.likesInfo
//     ? PostsLikesInfo?.likesInfo.find((info) => info.userId === userId)
//     : { likeStatus: 'None' };
//   const myStatus = userStatus ? userStatus.likeStatus : 'None';
//
//   const newestLikes =
//     PostsLikesInfo?.likesInfo
//       ?.filter((info) => info.likeStatus === 'Like')
//       ?.sort(
//         (a, b) =>
//           new Date(b.dateOfLikeDislike).getTime() -
//           new Date(a.dateOfLikeDislike).getTime(),
//       )
//       ?.slice(0, 3)
//       ?.map((info) => ({
//         addedAt: info.dateOfLikeDislike,
//         userId: info.userId,
//         login: info.login,
//       })) || [];
//
//   return {
//     id: post.id,
//     title: post.title,
//     shortDescription: post.shortDescription,
//     content: post.content,
//     blogId: post.blogId,
//     blogName: post.blogName,
//     createdAt: post.createdAt,
//
//     extendedLikesInfo: {
//       likesCount: PostsLikesInfo ? PostsLikesInfo.numberOfLikes : 0,
//       dislikesCount: PostsLikesInfo ? PostsLikesInfo.numberOfDislikes : 0,
//       myStatus: myStatus,
//       newestLikes: newestLikes,
//     },
//   };
// };

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) protected postModel: Model<PostDocument>,
    @InjectModel(InformationOfLikeAndDislikePost.name)
    protected infoModel: Model<InformationOfLikeAndDislikePostDocument>,
    @InjectModel(Blog.name) protected blogModel: Model<BlogDocument>,
  ) {}
  private async mapPostToView(
    post: Post,
    userId: string | null,
  ): Promise<PostView> {
    const PostsLikesInfo = await this.infoModel.findOne({ postId: post.id });
    const userStatus = PostsLikesInfo?.likesInfo
      ? PostsLikesInfo?.likesInfo.find((info) => info.userId === userId)
      : { likeStatus: 'None' };
    const myStatus = userStatus ? userStatus.likeStatus : 'None';

    const newestLikes =
      PostsLikesInfo?.likesInfo
        ?.filter((info) => info.likeStatus === 'Like')
        ?.sort(
          (a, b) =>
            new Date(b.dateOfLikeDislike).getTime() -
            new Date(a.dateOfLikeDislike).getTime(),
        )
        ?.slice(0, 3)
        ?.map((info) => ({
          addedAt: info.dateOfLikeDislike,
          userId: info.userId,
          login: info.login,
        })) || [];

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,

      extendedLikesInfo: {
        likesCount: PostsLikesInfo ? PostsLikesInfo.numberOfLikes : 0,
        dislikesCount: PostsLikesInfo ? PostsLikesInfo.numberOfDislikes : 0,
        myStatus: myStatus,
        newestLikes: newestLikes,
      },
    };
  }
  async findAllPostsInDb(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    userId: string | null,
  ): Promise<PostResponse> {
    const filter = searchNameTerm
      ? { name: new RegExp(searchNameTerm, 'gi') }
      : {};

    const posts: Post[] = await this.postModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items = await Promise.all(
      posts.map((p) => this.mapPostToView(p, userId)),
    );
    const totalCount = await this.postModel.countDocuments();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: items,
    };
  }
  async findAllPostsForSpecifeldBlogInDb(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    blogId: string,
    userId: string | null,
  ): Promise<PostResponse> {
    const posts: Post[] = await this.postModel
      .find({ blogId: blogId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items = await Promise.all(
      posts.map((p) => this.mapPostToView(p, userId)),
    );
    const totalCount = await this.postModel.countDocuments({ blogId: blogId });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: items,
    };
  }
  async findPostByIdInDb(
    id: string,
    userId: string | null,
  ): Promise<PostView | null> {
    const post: Post | null = await this.postModel.findOne({ id: id });
    if (!post) return null;

    return this.mapPostToView(post, userId);
  }
  async createPostInDb(
    newPost: Post,
    userId: string | null,
  ): Promise<PostView> {
    const createdPost = new this.postModel(newPost);
    await createdPost.save();

    return this.mapPostToView(newPost, userId);
  }
  async updatePostInDb(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const blog = await this.blogModel.findOne({ id: blogId });

    if (!blog) {
      return false;
    }
    const updatePost = await this.postModel.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
          blogName: blog.name,
        },
      },
    );

    const post = updatePost.matchedCount === 1;
    return post;
  }
  async deletePostInDb(id: string): Promise<boolean> {
    const deletedPost = await this.postModel.deleteOne({ id: id });

    return deletedPost.deletedCount === 1;
  }
  async createInfOfLikeAndDislikePost(
    InfOfLikeAndDislikePost: InformationOfLikeAndDislikePost,
  ): Promise<InformationOfLikeAndDislikePost> {
    const createdInfo = new this.infoModel(InfOfLikeAndDislikePost);
    return await createdInfo.save();
  }
  async findPostForLikeOrDislike(postId: string): Promise<Post | null> {
    const post = await this.postModel.findOne({ id: postId });
    return post;
  }
  async findOldLikeOrDislike(postId: string, userId: string) {
    const result = await this.infoModel.findOne({
      postId,
      'likesInfo.userId': userId,
    });
    if (result?.likesInfo) {
      const likeInfo = result.likesInfo.find((info) => info.userId === userId);
      return likeInfo;
    }
    return null;
  }
  async deleteNumberOfLikes(postId: string): Promise<void> {
    await this.infoModel.updateOne({ postId }, { $inc: { numberOfLikes: -1 } });
    return;
  }
  async deleteNumberOfDislikes(postId: string): Promise<void> {
    await this.infoModel.updateOne(
      { postId },
      { $inc: { numberOfDislikes: -1 } },
    );
    return;
  }
  async deleteOldLikeDislike(postId: string, userId: string): Promise<void> {
    await this.infoModel.updateOne(
      { postId, 'likesInfo.userId': userId },
      { $pull: { likesInfo: { userId: userId } } },
    );
    return;
  }
  async updateNumberOfLikes(
    postId: string,
    newLikeInfo: CommentsLikesInfo,
  ): Promise<boolean> {
    const result = await this.infoModel.updateOne(
      { postId },
      { $inc: { numberOfLikes: 1 }, $push: { likesInfo: newLikeInfo } },
    );
    return result.modifiedCount === 1;
  }
  async updateNumberOfDislikes(
    postId: string,
    newLikeInfo: CommentsLikesInfo,
  ): Promise<boolean> {
    const result = await this.infoModel.updateOne(
      { postId },
      { $inc: { numberOfDislikes: 1 }, $push: { likesInfo: newLikeInfo } },
    );
    return result.modifiedCount === 1;
  }
}
