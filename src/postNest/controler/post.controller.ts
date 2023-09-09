import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
    return post;
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

    return post;
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
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<boolean> {
    await this.postService.deletePost(id);

    return true;
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

    return await this.commentService.getAllCommentForSpecifeldPost(
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      post!.id,
    );
  }
}
