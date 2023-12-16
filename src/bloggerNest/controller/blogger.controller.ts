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
import { CommandBus } from '@nestjs/cqrs';
import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { BlogResponse, BlogView } from '../../blogNest/schema/blog-schema';
import { CreateBlogCommand } from '../../blogNest/blog.use-cases/createBlog.use-case';
import { AuthGuard } from '../../authNest/guards/bearer.guard';
import { PostCreateByBlogIdInputModel } from '../../inputmodels-validation/post.inputModel';
import { PostResponse, PostView } from '../../postNest/schema/post-schema';
import { CreatePostCommand } from '../../postNest/post.use-cases/createPost.use-case';
import { UpdateBlogCommand } from '../../blogNest/blog.use-cases/updateBlog.use-case';
import { UpdatePostCommand } from '../../postNest/post.use-cases/updatePost.use-case';
import { DeleteBlogCommand } from '../../blogNest/blog.use-cases/deleteBlog.use-case';
import { DeletePostCommand } from '../../postNest/post.use-cases/deletePost.use-case';
import { GetAllBlogsBloggerCommand } from '../../blogNest/blog.use-cases/getAllBlogs.Blogger.use-case';
import { GetAllPostsForSpecificBlogBloggerCommand } from '../../postNest/post.use-cases/getAllPostForSpecificBlog.Blogger.use-case';
import { BanUserForBlogInputModel } from '../../inputmodels-validation/user.inputModel';
import { BanUserForBlogCommand } from '../blogger.use-cases/banUserForBlog.use-case';
import { UserResponse } from '../../userNest/schema/user.schema';
import { GetBannedUsersForSpecifeldBlogCommand } from '../blogger.use-cases/getBannedUsersForSpecifeldBlog.use-case';

@Controller('blogger')
export class BloggerController {
  constructor(private readonly commandBus: CommandBus) {}
  @UseGuards(AuthGuard)
  @Get('blogs')
  async getAllBlogs(
    @Query('searchNameTerm') searchNameTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
    @Request() req,
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

    return await this.commandBus.execute(
      new GetAllBlogsBloggerCommand(
        searchNameTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        req.userId,
      ),
    );
  }
  @UseGuards(AuthGuard)
  @Get('blogs/:blogId/posts')
  async getAllPostsForSpecifeldBlog(
    @Param('blogId') blogId: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
    @Request() req,
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

    const blog = await this.commandBus.execute(blogId);

    return await this.commandBus.execute(
      new GetAllPostsForSpecificBlogBloggerCommand(
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        blog!.id,
        req.userId,
      ),
    );
  }
  @UseGuards(AuthGuard)
  @Post('blogs')
  async postBlog(
    @Body() blogDto: BlogInputModel,
    @Request() req,
  ): Promise<BlogView> {
    return await this.commandBus.execute(
      new CreateBlogCommand(blogDto, req.userId),
    );
  }
  @UseGuards(AuthGuard)
  @Post('blogs/:blogId/posts')
  async postPost(
    @Param('blogId') blogId: string,
    @Body() postDto: PostCreateByBlogIdInputModel,
    @Request() req,
  ): Promise<PostView | null> {
    return await this.commandBus.execute(
      new CreatePostCommand(postDto, blogId, req.userId),
    );
  }
  @UseGuards(AuthGuard)
  @Put('blogs/:id')
  @HttpCode(204)
  async putBlog(
    @Param('id') id: string,
    @Body() blogDto: BlogInputModel,
    @Request() req,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new UpdateBlogCommand(id, blogDto, req.userId),
    );

    return true;
  }
  @UseGuards(AuthGuard)
  @Put('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async putPost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() postDto: PostCreateByBlogIdInputModel,
    @Request() req,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new UpdatePostCommand(postId, blogId, postDto, req.userId),
    );

    return true;
  }
  @UseGuards(AuthGuard)
  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string, @Request() req): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(id, req.userId));

    return;
  }
  @UseGuards(AuthGuard)
  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Request() req,
  ): Promise<void> {
    await this.commandBus.execute(
      new DeletePostCommand(postId, blogId, req.userId),
    );

    return;
  }
  @UseGuards(AuthGuard)
  @Put('users/:id/ban')
  @HttpCode(204)
  async banUserForSpecifeldBlog(
    @Param('id') id: string,
    @Body() banUserForBlogDto: BanUserForBlogInputModel,
    @Request() req,
  ): Promise<void> {
    return await this.commandBus.execute(
      new BanUserForBlogCommand(id, banUserForBlogDto, req.userId),
    );
  }
  @Get('users/blog/:id')
  async getAllBannedUserForSpecifeldBlog(
    @Param('id') id: string,
    @Query('searchLoginTerm') searchLoginTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<UserResponse> {
    console.log(id, 'controller 1');
    if (!searchLoginTerm) {
      searchLoginTerm = null;
    }
    if (!sortBy) {
      sortBy = 'createdAt';
    }
    if (sortBy === 'login') {
      sortBy = 'login';
    }
    if (sortBy === 'email') {
      sortBy = 'email';
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
    return await this.commandBus.execute(
      new GetBannedUsersForSpecifeldBlogCommand(
        searchLoginTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        id,
      ),
    );
  }
}
