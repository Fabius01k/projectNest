import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { BlogResponse, BlogView, BlogInputModel } from '../schema/blog-schema';
import {
  PostCreateByBlogIdInputModel,
  PostResponse,
  PostView,
} from '../../postNest/schema/post-schema';
import { PostService } from '../../postNest/service/post.service';
import { Response } from 'express';
import { BasicAuthGuard } from '../../authNest/strategies/basic.strategy';

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
  async getBlogById(@Param('id') id: string): Promise<BlogView | null> {
    const blog = await this.blogService.getBlogById(id);
    if (blog) {
      return blog;
    } else {
      throw new BadRequestException([
        {
          message: 'Blog not found',
        },
      ]);
    }
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  async postBlog(@Body() blogDto: BlogInputModel): Promise<BlogView> {
    return await this.blogService.postBlog(blogDto);
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async putBlog(
    @Param('id') id: string,
    @Body() blogDto: BlogInputModel,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const updatedBlog = await this.blogService.putBlog(id, blogDto);
    if (!updatedBlog) {
      throw new BadRequestException([
        {
          message: 'Blog not found',
        },
      ]);
    } else {
      res.sendStatus(204);
      return true;
    }
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteBlog(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const blogDeleted = await this.blogService.deleteBlog(id);
    if (!blogDeleted) {
      throw new BadRequestException([
        {
          message: 'Blog not found',
        },
      ]);
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
      throw new BadRequestException([
        {
          message: 'Blog not found',
        },
      ]);
    }

    return await this.postService.getAllPostsForSpecifeldBlog(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      blog.id,
    );
  }
  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async postPostForSpecifeldBlog(
    @Param('blogId') blogId: string,
    @Body() postDto: PostCreateByBlogIdInputModel,
  ): Promise<PostView | null> {
    const post = await this.postService.postPostForSpecifeldBlog(
      postDto,
      blogId,
    );

    if (!post) {
      throw new BadRequestException([
        {
          message: 'Blog not found',
        },
      ]);
    }

    return post;
  }
}
