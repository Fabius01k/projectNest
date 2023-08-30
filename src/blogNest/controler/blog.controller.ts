import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { BlogResponse, BlogView } from '../schema/blog-schema';
import { PostResponse, PostView } from '../../postNest/schema/post-schema';
import { PostService } from '../../postNest/service/post.service';
import { Response } from 'express';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly postService: PostService,
  ) {}

  @Get()
  async getAllBlogs(
    @Query('searchNameTerm') searchNameTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<BlogResponse> {
    if (!searchNameTerm) {
      searchNameTerm = null;
    }

    if (!sortBy) {
      sortBy = 'createdAt';
    }

    if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
      sortDirection = 'desc';
    }

    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = 10;
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = 1;
    }

    return await this.blogService.getAllBlogs(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    );
  }
  @Get(':id')
  async getBlogById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BlogView | null> {
    const blog = await this.blogService.getBlogById(id);
    if (blog) {
      return blog;
    } else {
      res.sendStatus(404);
      return null;
    }
  }
  @Post()
  async postBlog(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('websiteUrl') websiteUrl: string,
  ): Promise<BlogView> {
    return await this.blogService.postBlog(name, description, websiteUrl);
  }
  @Put(':id')
  async putBlog(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('websiteUrl') websiteUrl: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const updatedBlog = await this.blogService.putBlog(
      id,
      name,
      description,
      websiteUrl,
    );
    if (!updatedBlog) {
      res.sendStatus(404);
      return false;
    } else {
      res.sendStatus(204);
      return true;
    }
  }
  @Delete(':id')
  async deleteBlog(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const blogDeleted = await this.blogService.deleteBlog(id);
    if (!blogDeleted) {
      res.sendStatus(404);
      return false;
    } else {
      res.sendStatus(204);
      return true;
    }
  }
  @Get(':blogId/posts')
  async getAllPostsForSpecifeldBlog(
    @Param('blogId') blogId: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PostResponse | null> {
    if (!sortBy) {
      sortBy = 'createdAt';
    }

    if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
      sortDirection = 'desc';
    }

    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = 10;
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = 1;
    }

    const blog = await this.blogService.getBlogById(blogId);
    if (!blog) {
      res.sendStatus(404);
      return null;
    }

    return await this.postService.getAllPostsForSpecifeldBlog(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      blog.id,
    );
  }
  @Post(':blogId/posts')
  async postPostForSpecifeldBlog(
    @Param('blogId') blogId: string,
    @Body('title') title: string,
    @Body('shortDescription') shortDescription: string,
    @Body('content') content: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PostView | null> {
    const post = await this.postService.postPostForSpecifeldBlog(
      title,
      shortDescription,
      content,
      blogId,
    );

    if (!post) {
      res.sendStatus(404);
      return null;
    }

    return post;
  }
}
