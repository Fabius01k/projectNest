import { Injectable } from '@nestjs/common';
import {
  Blog,
  BlogDocument,
  BlogResponse,
  BlogView,
} from '../schema/blog-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const mapBlogToDto = (blog: Blog): BlogView => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(Blog.name) protected blogModel: Model<BlogDocument>,
  ) {}
  async findAllBlogsInDb(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<BlogResponse> {
    const filter = searchNameTerm
      ? { name: new RegExp(searchNameTerm, 'gi') }
      : {};

    const blogs: Blog[] = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items = blogs.map((blog) => mapBlogToDto(blog));
    const totalCount = await this.blogModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: items,
    };
  }
  async findBlogByIdInDb(id: string): Promise<BlogView | null> {
    const blog: Blog | null = await this.blogModel.findOne({ id: id });
    if (!blog) return null;

    return mapBlogToDto(blog);
  }
  async createBlogInDb(newBlog: Blog): Promise<BlogView> {
    const createdBlog = new this.blogModel(newBlog);
    await createdBlog.save();

    return mapBlogToDto(newBlog);
  }
  async updateBlogInDb(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const updateBlog = await this.blogModel.updateOne(
      { id: id },
      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      },
    );

    const blog = updateBlog.matchedCount === 1;
    return blog;
  }
  async deleteBlogInDb(id: string): Promise<boolean> {
    const deleteDBlog = await this.blogModel.deleteOne({ id: id });

    return deleteDBlog.deletedCount === 1;
  }
}
