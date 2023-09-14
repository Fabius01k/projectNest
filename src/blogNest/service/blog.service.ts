import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogResponse, BlogView } from '../schema/blog-schema';
import { BlogRepository } from '../repository/blog.repository';
import { ObjectId } from 'mongodb';
import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';

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
    const blog = await this.blogRepository.findBlogByIdInDb(id);
    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    return blog;
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
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    return true;
  }
  async deleteBlog(id: string): Promise<boolean> {
    const blogDeleted = await this.blogRepository.deleteBlogInDb(id);
    if (!blogDeleted) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    return true;
  }
}
