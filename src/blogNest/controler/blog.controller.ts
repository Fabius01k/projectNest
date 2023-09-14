import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { BlogResponse, BlogView } from '../schema/blog-schema';
import { PostResponse, PostView } from '../../postNest/schema/post-schema';
import { PostService } from '../../postNest/service/post.service';
import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import { PostCreateByBlogIdInputModel } from '../../inputmodels-validation/post.inputModel';
import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { GetToken } from '../../authNest/guards/bearer.guard';

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
    return blog;
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  async postBlog(@Body() blogDto: BlogInputModel): Promise<BlogView> {
    return await this.blogService.postBlog(blogDto);
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async putBlog(
    @Param('id') id: string,
    @Body() blogDto: BlogInputModel,
  ): Promise<boolean> {
    await this.blogService.putBlog(id, blogDto);

    return true;
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogService.deleteBlog(id);

    return;
  }
  @UseGuards(GetToken)
  @Get(':blogId/posts')
  async getAllPostsForSpecifeldBlog(
    @Param('blogId') blogId: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
    @Request() req,
  ): Promise<PostResponse | null> {
    let userId = null;
    if (req.userId) {
      userId = req.userId;
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

    const blog = await this.blogService.getBlogById(blogId);

    return await this.postService.getAllPostsForSpecifeldBlog(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      blog!.id,
      userId,
    );
  }
  @UseGuards(GetToken)
  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async postPostForSpecifeldBlog(
    @Param('blogId') blogId: string,
    @Body() postDto: PostCreateByBlogIdInputModel,
    @Request() req,
  ): Promise<PostView | null> {
    let userId = null;
    if (req.userId) {
      userId = req.userId;
    }
    const post = await this.postService.postPostForSpecifeldBlog(
      postDto,
      blogId,
      userId,
    );

    return post;
  }
}
