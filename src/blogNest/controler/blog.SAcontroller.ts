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
import { BlogResponse, BlogView } from '../schema/blog-schema';
import { PostResponse } from '../../postNest/schema/post-schema';
import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { GetToken } from '../../authNest/guards/bearer.guard';
import { GetAllBlogsCommand } from '../blog.use-cases/getAllBlogs.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../blog.use-cases/createBlog.use-case';
import { UpdateBlogCommand } from '../blog.use-cases/updateBlog.use-case';
import { DeleteBlogCommand } from '../blog.use-cases/deleteBlog.use-case';
import { GetAllPostsForSpecificBlogCommand } from '../../postNest/post.use-cases/getAllPostForSpecificBlog.use-case';

@Controller('sa')
export class BlogSAController {
  constructor(private readonly commandBus: CommandBus) {}
  @UseGuards(BasicAuthGuard)
  @Get('blogs')
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

    return await this.commandBus.execute(
      new GetAllBlogsCommand(
        searchNameTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      ),
    );
  }
  @UseGuards(BasicAuthGuard)
  @Post('blogs')
  async postBlog(@Body() blogDto: BlogInputModel): Promise<BlogView> {
    return await this.commandBus.execute(new CreateBlogCommand(blogDto));
  }
  @UseGuards(BasicAuthGuard)
  @Put('blogs/:id')
  @HttpCode(204)
  async putBlog(
    @Param('id') id: string,
    @Body() blogDto: BlogInputModel,
  ): Promise<boolean> {
    await this.commandBus.execute(new UpdateBlogCommand(id, blogDto));

    return true;
  }
  @UseGuards(BasicAuthGuard)
  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(id));

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

    const blog = await this.commandBus.execute(blogId);

    return await this.commandBus.execute(
      new GetAllPostsForSpecificBlogCommand(
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        blog!.id,
        userId,
      ),
    );
  }
  // @UseGuards(GetToken)
  // @UseGuards(BasicAuthGuard)
  // @Post(':blogId/posts')
  // async postPostForSpecifeldBlog(
  //   @Param('blogId') blogId: string,
  //   @Body() postDto: PostCreateByBlogIdInputModel,
  //   @Request() req,
  // ): Promise<PostView | null> {
  //   let userId = null;
  //   if (req.userId) {
  //     userId = req.userId;
  //   }
  //   const post = await this.commandBus.execute(
  //     new CreatePostForSpecificBlogCommand(postDto, blogId, userId),
  //   );
  //
  //   return post;
  // }
}
