// import { blogs } from './blogs-repository-db';
// import { blogsModel, postsLikesInfoModel, postsModel } from '../db/db';
// import { TPostView } from '../models/posts/posts-type';
// import { ObjectId } from 'mongodb';
// import {
//   ClassPostDb,
//   ClassPostsLikesInfoDb,
//   PostsLikesInfo,
// } from '../classes/posts/posts-class';
//
// export const posts: ClassPostDb[] = [];
//
// // export const mapPostFromDbView = async (post: ClassPostDb,userId: string | null): Promise<TPostView> => {
// //
// //    const PostsLikesInfo = await postsLikesInfoModel.findOne({infoId: post.id})
// //    const userStatus = PostsLikesInfo?.likesInfo ? PostsLikesInfo?.likesInfo.find((info) => info.userId === userId) : {likeStatus:'None'};
// //    const myStatus = userStatus ? userStatus.likeStatus : "None"
// //
// //     const newestLikes = PostsLikesInfo?.likesInfo
// //         ?.filter((info) => info.likeStatus === 'Like')
// //         ?.sort((a, b) => new Date(b.dateOfLikeDislike).getTime() - new Date(a.dateOfLikeDislike).getTime())
// //         ?.slice(0, 3)
// //         ?.map((info) => ({
// //             addedAt: info.dateOfLikeDislike,
// //             userId: info.userId,
// //             login: info.login,
// //         })) || []
// //
// //     return {
// //         id: post.id,
// //         title: post.title,
// //         shortDescription: post.shortDescription,
// //         content: post.content,
// //         blogId: post.blogId,
// //         blogName: post.blogName,
// //         createdAt: post.createdAt,
// //
// //         extendedLikesInfo: {
// //             likesCount: PostsLikesInfo ? PostsLikesInfo.numberOfLikes : 0,
// //             dislikesCount: PostsLikesInfo ? PostsLikesInfo.numberOfDislikes : 0,
// //             myStatus: myStatus,
// //             newestLikes: newestLikes
// //         }
// //     }
// // }
//
// export class PostsRepostory {
//   async findPosts(
//     sortBy: string,
//     sortDirection: 'asc' | 'desc',
//     pageSize: number,
//     pageNumber: number,
//     userId: string | null,
//   ) {
//     const posts: ClassPostDb[] = await postsModel
//       .find()
//       .sort({ [sortBy]: sortDirection })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(+pageSize)
//       .lean();
//
//     const items = await Promise.all(
//       posts.map((p) => mapPostFromDbView(p, userId)),
//     );
//     const totalCount = await postsModel.countDocuments();
//
//     return {
//       pagesCount: Math.ceil(totalCount / pageSize),
//       page: +pageNumber,
//       pageSize: +pageSize,
//       totalCount: totalCount,
//       items: items,
//     };
//   }
//   async createPost(
//     newPost: ClassPostDb,
//     userId: string | null,
//   ): Promise<TPostView | null> {
//     await postsModel.insertMany([newPost]);
//
//     return mapPostFromDbView(newPost, userId);
//   }
//   async createPostByBlogId(
//     newPost: ClassPostDb,
//     userId: string | null,
//   ): Promise<TPostView | null> {
//     await postsModel.insertMany([newPost]);
//
//     return mapPostFromDbView(newPost, userId);
//   }
//   async findPostsByBlogId(
//     sortBy: string,
//     sortDirection: 'asc' | 'desc',
//     pageSize: number,
//     pageNumber: number,
//     blogId: string,
//     userId: string | null,
//   ) {
//     /*const filter = !blogId
//             ? {}
//             : {
//                 id: new RegExp(blogId,'gi')
//             }
// */
//     const posts: ClassPostDb[] = await postsModel
//       .find({ blogId: blogId })
//       .sort({ [sortBy]: sortDirection })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(+pageSize)
//       .lean();
//
//     const items = await Promise.all(
//       posts.map((p) => mapPostFromDbView(p, userId)),
//     );
//     const totalCount = await postsModel.countDocuments({ blogId: blogId });
//
//     return {
//       pagesCount: Math.ceil(totalCount / pageSize),
//       page: +pageNumber,
//       pageSize: +pageSize,
//       totalCount: totalCount,
//       items: items,
//     };
//   }
//   async getPostById(
//     id: string,
//     userId: string | null,
//   ): Promise<TPostView | null> {
//     const post: ClassPostDb | null = await postsModel.findOne({ id: id });
//     if (!post) return null;
//
//     return mapPostFromDbView(post, userId);
//   }
//   async updatePost(
//     id: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//   ): Promise<boolean | null> {
//     const blog = await blogsModel.findOne({ id: blogId });
//
//     if (!blog) {
//       return null;
//     }
//     const updatePostPromise = await postsModel.updateOne(
//       { id: id },
//       {
//         $set: {
//           title: title,
//           shortDescription: shortDescription,
//           content: content,
//           blogId: blogId,
//           blogName: blog.name,
//         },
//       },
//     );
//     const post = updatePostPromise.matchedCount === 1;
//     return post;
//   }
//   async deletePost(id: string): Promise<boolean> {
//     const deletePostPromise = await postsModel.deleteOne({ id: id });
//
//     return deletePostPromise.deletedCount === 1;
//   }
//   async createCollectionOfPostsLikesInf(
//     newCollectionPostsLikesInfo: ClassPostsLikesInfoDb,
//   ): Promise<ClassPostsLikesInfoDb> {
//     const result = await postsLikesInfoModel.insertMany([
//       newCollectionPostsLikesInfo,
//     ]);
//     return newCollectionPostsLikesInfo;
//   }
//   async findPostForDb(id: string) {
//     const post = await postsModel.findOne({ id: id });
//     return post;
//   }
//   async findOldLikeDislike(infoId: string, userId: string) {
//     const result = await postsLikesInfoModel.findOne({
//       infoId,
//       'likesInfo.userId': userId,
//     });
//     if (result?.likesInfo) {
//       const likeInfo = result.likesInfo.find((info) => info.userId === userId);
//       return likeInfo;
//     }
//     return null;
//   }
//   async deleteNumberOfLikes(infoId: string): Promise<void> {
//     await postsLikesInfoModel.updateOne(
//       { infoId },
//       { $inc: { numberOfLikes: -1 } },
//     );
//     return;
//   }
//   async deleteNumberOfDislikes(infoId: string): Promise<void> {
//     await postsLikesInfoModel.updateOne(
//       { infoId },
//       { $inc: { numberOfDislikes: -1 } },
//     );
//     return;
//   }
//   async deleteOldLikeDislike(infoId: string, userId: string) {
//     const result = await postsLikesInfoModel.updateOne(
//       { infoId, 'likesInfo.userId': userId },
//       { $pull: { likesInfo: { userId: userId } } },
//     );
//     return result;
//   }
//   async updateNumberOfLikes(
//     infoId: string,
//     likeInfo: PostsLikesInfo,
//   ): Promise<boolean> {
//     const result = await postsLikesInfoModel.updateOne(
//       { infoId },
//       { $inc: { numberOfLikes: 1 }, $push: { likesInfo: likeInfo } },
//     );
//     return result.modifiedCount > 0;
//   }
//   async updateNumberOfDislikes(
//     infoId: string,
//     likeInfo: PostsLikesInfo,
//   ): Promise<boolean> {
//     const result = await postsLikesInfoModel.updateOne(
//       { infoId },
//       { $inc: { numberOfDislikes: 1 }, $push: { likesInfo: likeInfo } },
//     );
//     return result.modifiedCount > 0;
//   }
// }
