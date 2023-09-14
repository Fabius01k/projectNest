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

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
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

    return await this.postService.getAllPosts(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      userId,
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
    const post = await this.postService.getPostById(id, userId);
    return post;
  }
  // @Post('posts')
  // async postPost(
  //   @Body() postDto: PostCreateInputModel,
  // ): Promise<PostView | null> {
  //   return await this.postService.postPost(postDto);
  // }
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
    const post = await this.postService.postPost(postDto, userId);

    return post;
  }
  @UseGuards(AuthGuard)
  @Post(':postId/comments')
  async postComment(
    @Param('postId') postId: string,
    @Body() commentDto: CommentInputModel,
    @Request() req,
  ): Promise<CommentView | null> {
    const comment = await this.commentService.postComment(
      commentDto,
      postId,
      req.userId,
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
    await this.postService.putPost(id, postDto);

    return true;
  }
  @UseGuards(AuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async makeLikeOrDislike(
    @Param('postId') postId: string,
    @Body() likeDto: LikeInputModel,
    @Request() req,
  ): Promise<boolean> {
    const post = await this.postService.getPostForLikeOrDislike(postId);
    const user = await this.userService.getUserById(req.userId);
    const dateOfLikeDislike = new Date();

    await this.postService.makeLikeOrDislike(
      req.userId,
      user!.login,
      postId,
      likeDto,
      dateOfLikeDislike,
    );

    return true;
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postService.deletePost(id);

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

    const post = await this.postService.getPostById(postId, userId);

    return await this.commentService.getAllCommentForSpecifeldPost(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      post!.id,
    );
  }
}
