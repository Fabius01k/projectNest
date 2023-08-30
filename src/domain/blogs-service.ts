// import { TBlogView } from '../models/blogs/blogs-type';
// import { ObjectId } from 'mongodb';
// import { BlogsRepository } from '../repositories-db/blogs-repository-db';
// import { TPostView } from '../models/posts/posts-type';
// import { PostsRepostory } from '../repositories-db/post-repostory-db';
// import { blogsModel } from '../db/db';
// import { ClassBlogDb } from '../classes/blogs/blogs-class';
// import {
//   ClassPostDb,
//   ClassPostsLikesInfoDb,
// } from '../classes/posts/posts-class';
//
// export const blogs: ClassBlogDb[] = [];
// export class BlogsService {
//   constructor(
//     protected blogsRepository: BlogsRepository,
//     protected postsRepository: PostsRepostory,
//   ) {}
//
//   // async findBlogs(sortBy: string,sortDirection: 'asc' | 'desc',
//   //                 pageSize: number,pageNumber: number,searchNameTerm: string | null) {
//   //     return this.blogsRepository.findBlogs(
//   //         sortBy,sortDirection,pageSize,pageNumber,searchNameTerm
//   //     )
//   // }
//   async findPostByBlogID(
//     sortBy: string,
//     sortDirection: 'asc' | 'desc',
//     pageSize: number,
//     pageNumber: number,
//     blogId: string,
//     userId: string | null,
//   ) {
//     return this.postsRepository.findPostsByBlogId(
//       sortBy,
//       sortDirection,
//       pageSize,
//       pageNumber,
//       blogId,
//       userId,
//     );
//   }
//   async createBlog(
//     name: string,
//     description: string,
//     websiteUrl: string,
//   ): Promise<TBlogView> {
//     const dateNow = new Date().getTime().toString();
//     const newBlog = new ClassBlogDb(
//       new ObjectId(),
//       dateNow,
//       name,
//       description,
//       websiteUrl,
//       new Date().toISOString(),
//       false,
//     );
//
//     const createdBlogService = await this.blogsRepository.createBlog(newBlog);
//
//     return createdBlogService;
//   }
//
//   async createPostByBlogID(
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     userId: string | null,
//   ): Promise<TPostView | null> {
//     const dateNow = new Date().getTime().toString();
//     const blog = await blogsModel.findOne({ id: blogId });
//
//     if (!blog) {
//       return null;
//     }
//     const newPost = new ClassPostDb(
//       new ObjectId(),
//       dateNow,
//       title,
//       shortDescription,
//       content,
//       blogId,
//       blog.name,
//       new Date().toISOString(),
//     );
//
//     const infoId = newPost.id;
//     const newCollectionPostsLikesInfo = new ClassPostsLikesInfoDb(
//       infoId,
//       [],
//       0,
//       0,
//     );
//     await this.postsRepository.createCollectionOfPostsLikesInf(
//       newCollectionPostsLikesInfo,
//     );
//
//     const createdPostService = await this.postsRepository.createPostByBlogId(
//       newPost,
//       userId,
//     );
//
//     return createdPostService;
//   }
//
//   // async getBlogById(id: string): Promise<TBlogView | null> {
//   //   return this.blogsRepository.getBlogById(id);
//   // }
//   async updateBlog(
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//   ): Promise<boolean> {
//     return await this.blogsRepository.updateBlog(
//       id,
//       name,
//       description,
//       websiteUrl,
//     );
//   }
//   async deleteBlog(id: string): Promise<boolean> {
//     return await this.blogsRepository.deleteBlog(id);
//   }
// }
