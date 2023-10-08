import {
  Body,
  Controller,
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
import { AuthGuard, GetToken } from '../../authNest/guards/bearer.guard';
import { UserService } from '../../userNest/service/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllPostsCommand } from '../post.use-cases/getAllPosts.use-case';
import { GetPostByIdCommand } from '../post.use-cases/getPotsById.use-case';
import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { CreateCommentCommand } from '../../commentNest/comment.use-cases/createComment.use-case';
import {
  CommentResponse,
  CommentView,
} from '../../commentNest/schema/comment.schema';
import { GetAllCommentsForSpecificPostCommand } from '../../commentNest/comment.use-cases/getAllCommentsForSpecificPost.use-case';
import { MakeLikeOrDislikePCommand } from '../post.use-cases/makeLikeOrDislike.use-case';
import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}
  @UseGuards(GetToken)
  @Get()
  async getAllPosts(
    @Query('searchNameTerm') searchNameTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
    @Request() req,
  ): Promise<PostResponse> {
    let userId = null;
    if (req.userId) {
      userId = req.userId;
    }
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
      new GetAllPostsCommand(
        searchNameTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        userId,
      ),
    );
  }
  @UseGuards(GetToken)
  @Get(':id')
  async getPostById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<PostView | null> {
    let userId = null;
    if (req.userId) {
      userId = req.userId;
    }
    const post = await this.commandBus.execute(
      new GetPostByIdCommand(id, userId),
    );
    return post;
  }
  @UseGuards(AuthGuard)
  @Post(':postId/comments')
  async postComment(
    @Param('postId') postId: string,
    @Body() commentDto: CommentInputModel,
    @Request() req,
  ): Promise<CommentView | null> {
    const comment = await this.commandBus.execute(
      new CreateCommentCommand(commentDto, postId, req.userId),
    );

    return comment;
  }
  @UseGuards(AuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async makeLikeOrDislike(
    @Param('postId') postId: string,
    @Body() likeDto: LikeInputModel,
    @Request() req,
  ): Promise<boolean> {
    const post = await this.commandBus.execute(
      new GetPostByIdCommand(postId, req.userId),
    );
    const user = await this.userService.getUserById(req.userId);
    const dateOfLikeDislike = new Date();

    await this.commandBus.execute(
      new MakeLikeOrDislikePCommand(
        req.userId,
        user[0].login,
        postId,
        likeDto,
        dateOfLikeDislike,
      ),
    );

    return true;
  }
  @UseGuards(GetToken)
  @Get(':postId/comments')
  async getAllCommentForSpecifeldPost(
    @Param('postId') postId: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
    @Request() req,
  ): Promise<CommentResponse | null> {
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

    const post = await this.commandBus.execute(
      new GetPostByIdCommand(postId, userId),
    );

    return await this.commandBus.execute(
      new GetAllCommentsForSpecificPostCommand(
        sortBy,
        sortDirection,
        pageSize,
        pageNumber,
        post.id,
        userId,
      ),
    );
  }
}
