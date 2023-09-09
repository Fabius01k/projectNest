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
import {
  PostCreateInputModel,
  PostResponse,
  PostView,
} from '../schema/post-schema';
import { PostService } from '../service/post.service';
import { CommentService } from '../../commentNest/service/comment.service';
import { CommentResponse } from '../../commentNest/schema/comment.schema';
import { Response } from 'express';
import { BasicAuthGuard } from '../../authNest/strategies/basic.strategy';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}
  @Get()
  async getAllPosts(
    @Query('searchNameTerm') searchNameTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<PostResponse> {
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
    );
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostView | null> {
    const post = await this.postService.getPostById(id);
    if (post) {
      return post;
    } else {
      throw new BadRequestException([
        {
          message: 'Post not found',
        },
      ]);
    }
  }
  // @Post('posts')
  // async postPost(
  //   @Body() postDto: PostCreateInputModel,
  // ): Promise<PostView | null> {
  //   return await this.postService.postPost(postDto);
  // }
  @UseGuards(BasicAuthGuard)
  @Post()
  async postPost(
    @Body() postDto: PostCreateInputModel,
  ): Promise<PostView | null> {
    const post = await this.postService.postPost(postDto);

    if (!post) {
      throw new BadRequestException([
        {
          message: 'Blog not found',
        },
      ]);
    }

    return post;
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async putPost(
    @Param('id') id: string,
    @Body() postDto: PostCreateInputModel,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const updetedPost = await this.postService.putPost(id, postDto);
    if (!updetedPost) {
      throw new BadRequestException([
        {
          message: 'Post not found',
        },
      ]);
    } else {
      res.sendStatus(204);
      return true;
    }
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const postDeleted = await this.postService.deletePost(id);
    if (!postDeleted) {
      throw new BadRequestException([
        {
          message: 'Post not found',
        },
      ]);
    } else {
      res.sendStatus(204);
      return true;
    }
  }
  @Get(':postId/comments')
  async getAllCommentForSpecifeldPost(
    @Param('postId') postId: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<CommentResponse | null> {
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

    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new BadRequestException([
        {
          message: 'Post not found',
        },
      ]);
    }

    return await this.commentService.getAllCommentForSpecifeldPost(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      post.id,
    );
  }
}
