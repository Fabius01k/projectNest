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
import { PostResponse, PostView } from '../schema/post-schema';
import { PostService } from '../service/post.service';
import { CommentService } from '../../commentNest/service/comment.service';
import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import { PostCreateInputModel } from '../../inputmodels-validation/post.inputModel';
import { GetToken } from '../../authNest/guards/bearer.guard';
import { UserService } from '../../userNest/service/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllPostsCommand } from '../post.use-cases/getAllPosts.use-case';
import { CreatePostCommand } from '../post.use-cases/createPost.use-case';
import { UpdatePostCommand } from '../post.use-cases/updatePost.use-case';
import { DeletePostCommand } from '../post.use-cases/deletePost.use-case';
import { GetAllPostsForSpecificBlogCommand } from '../post.use-cases/getAllPostForSpecificBlog.use-case';

@Controller('sa')
export class PostSAController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(GetToken)
  @Get('blogs/:blogId/posts')
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
  @UseGuards(GetToken)
  @UseGuards(BasicAuthGuard)
  @Post('blogs/:blogId/posts')
  async postPost(
    @Body() postDto: PostCreateInputModel,
    @Request() req,
  ): Promise<PostView | null> {
    let userId = null;
    if (req.userId) {
      userId = req.userId;
    }
    const post = await this.commandBus.execute(
      new CreatePostCommand(postDto, userId),
    );

    return post;
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async putPost(
    @Param('id') id: string,
    @Body() postDto: PostCreateInputModel,
  ): Promise<boolean> {
    await this.commandBus.execute(new UpdatePostCommand(id, postDto));

    return true;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeletePostCommand(id));

    return;
  }
}
