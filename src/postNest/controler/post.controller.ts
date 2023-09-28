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
import {
  CommentResponse,
  CommentView,
} from '../../commentNest/schema/comment.schema';

import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import { PostCreateInputModel } from '../../inputmodels-validation/post.inputModel';
import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { AuthGuard, GetToken } from '../../authNest/guards/bearer.guard';
import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';
import { UserService } from '../../userNest/service/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllPostsCommand } from '../post.use-cases/getAllPosts.use-case';
import { GetPostByIdCommand } from '../post.use-cases/getPotsById.use-case';
import { CreatePostCommand } from '../post.use-cases/createPost.use-case';
import { UpdatePostCommand } from '../post.use-cases/updatePost.use-case';
import { DeletePostCommand } from '../post.use-cases/deletePost.use-case';
import { MakeLikeOrDislikePCommand } from '../post.use-cases/makeLikeOrDislike.use-case';
import { GetAllCommentsForSpecificPostCommand } from '../../commentNest/comment.use-cases/getAllCommentsForSpecificPost.use-case';
import { CreateCommentCommand } from '../../commentNest/comment.use-cases/createComment.use-case';

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
  @UseGuards(GetToken)
  @UseGuards(BasicAuthGuard)
  @Post()
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
  // @UseGuards(AuthGuard)
  // @Put(':postId/like-status')
  // @HttpCode(204)
  // async makeLikeOrDislike(
  //   @Param('postId') postId: string,
  //   @Body() likeDto: LikeInputModel,
  //   @Request() req,
  // ): Promise<boolean> {
  //   const post = await this.postService.getPostForLikeOrDislike(postId);
  //   const user = await this.userService.getUserById(req.userId);
  //   const dateOfLikeDislike = new Date();
  //
  //   await this.commandBus.execute(
  //     new MakeLikeOrDislikePCommand(
  //       req.userId,
  //       user!.login,
  //       postId,
  //       likeDto,
  //       dateOfLikeDislike,
  //     ),
  //   );
  //
  //   return true;
  // }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeletePostCommand(id));

    return;
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
        post!.id,
        userId,
      ),
    );
  }
}
