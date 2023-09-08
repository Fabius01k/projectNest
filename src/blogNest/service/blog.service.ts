import { Injectable } from '@nestjs/common';
import {
  Blog,
  BlogInputModel,
  BlogResponse,
  BlogView,
} from '../schema/blog-schema';
import { BlogRepository } from '../repository/blog.repository';
import { ObjectId } from 'mongodb';

// @Injectable()
// export class BlogService {
//   constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
//   async findAllBlogs(): Promise<Blog[]> {
//     return this.blogModel.find().exec();
//   }
// }

@Injectable()
export class BlogService {
  constructor(protected blogRepository: BlogRepository) {}
  async getAllBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<BlogResponse> {
    return await this.blogRepository.findAllBlogsInDb(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    );
  }
  async getBlogById(id: string): Promise<BlogView | null> {
    return await this.blogRepository.findBlogByIdInDb(id);
  }
  async postBlog(blogDto: BlogInputModel): Promise<BlogView> {
    const dateNow = new Date().getTime().toString();
    const newBlog = new Blog(
      new ObjectId(),
      dateNow,
      blogDto.name,
      blogDto.description,
      blogDto.websiteUrl,
      new Date().toISOString(),
      false,
    );

    return await this.blogRepository.createBlogInDb(newBlog);
  }
  async putBlog(id: string, blogDto: BlogInputModel): Promise<boolean> {
    const updatedBlog = await this.blogRepository.updateBlogInDb(
      id,
      blogDto.name,
      blogDto.description,
      blogDto.websiteUrl,
    );
    if (!updatedBlog) {
      return false;
    }
    return true;
  }
  async deleteBlog(id: string): Promise<boolean> {
    const blogDeleted = await this.blogRepository.deleteBlogInDb(id);
    if (!blogDeleted) {
      return false;
    }
    return true;
  }
}
