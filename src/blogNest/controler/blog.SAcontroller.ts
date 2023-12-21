import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogSaResponse } from '../schema/blog-schema';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllBlogsSACommand } from '../blog.use-cases/getAllBlogs.SA.use-case';
import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import { BanBlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { BanBlogCommand } from '../blog.use-cases/banBlog.SA.use.case';

@Controller('sa')
export class BlogSAController {
  constructor(private readonly commandBus: CommandBus) {}
  @UseGuards(BasicAuthGuard)
  @Get('blogs')
  async getAllBlogsSa(
    @Query('searchNameTerm') searchNameTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<BlogSaResponse> {
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
      new GetAllBlogsSACommand(
        searchNameTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
      ),
    );
  }
  @UseGuards(BasicAuthGuard)
  @Put('blogs/:id/ban')
  @HttpCode(204)
  async banBlog(
    @Param('id') id: string,
    @Body() banBlogDto: BanBlogInputModel,
  ): Promise<void> {
    return await this.commandBus.execute(new BanBlogCommand(id, banBlogDto));
  }

  // @UseGuards(BasicAuthGuard)
  // @Post('blogs')
  // async postBlog(@Body() blogDto: BlogInputModel): Promise<BlogView> {
  //   return await this.commandBus.execute(new CreateBlogCommand(blogDto));
  // }
  // @UseGuards(BasicAuthGuard)
  // @Put('blogs/:id')
  // @HttpCode(204)
  // async putBlog(
  //   @Param('id') id: string,
  //   @Body() blogDto: BlogInputModel,
  // ): Promise<boolean> {
  //   await this.commandBus.execute(new UpdateBlogCommand(id, blogDto));
  //
  //   return true;
  // }
  // @UseGuards(BasicAuthGuard)
  // @Delete('blogs/:id')
  // @HttpCode(204)
  // async deleteBlog(@Param('id') id: string): Promise<void> {
  //   await this.commandBus.execute(new DeleteBlogCommand(id));
  //
  //   return;
  // }
  // @UseGuards(GetToken)
  // @Get(':blogId/posts')
  // async getAllPostsForSpecifeldBlog(
  //   @Param('blogId') blogId: string,
  //   @Query('sortBy') sortBy: string,
  //   @Query('sortDirection') sortDirection: 'asc' | 'desc',
  //   @Query('pageSize') pageSize: number,
  //   @Query('pageNumber') pageNumber: number,
  //   @Request() req,
  // ): Promise<PostResponse | null> {
  //   let userId = null;
  //   if (req.userId) {
  //     userId = req.userId;
  //   }
  //   if (!sortBy) {
  //     sortBy = 'createdAt';
  //   }
  //
  //   if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
  //     sortDirection = 'desc';
  //   }
  //
  //   const checkPageSize = +pageSize;
  //   if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
  //     pageSize = 10;
  //   }
  //
  //   const checkPageNumber = +pageNumber;
  //   if (
  //     !pageNumber ||
  //     !Number.isInteger(checkPageNumber) ||
  //     checkPageNumber <= 0
  //   ) {
  //     pageNumber = 1;
  //   }
  //
  //   const blog = await this.commandBus.execute(blogId);
  //
  //   return await this.commandBus.execute(
  //     new GetAllPostsForSpecificBlogCommand(
  //       sortBy,
  //       sortDirection,
  //       pageSize,
  //       pageNumber,
  //       blog!.id,
  //       userId,
  //     ),
  //   );
  // }
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
