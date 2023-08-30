import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { PostResponse, PostView } from '../schema/post-schema';
import { PostService } from '../service/post.service';
import { CommentService } from '../../commentNest/service/comment.service';
import { CommentResponse } from '../../commentNest/schema/comment.schema';
import { Response } from 'express';

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
  async getPostById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PostView | null> {
    const post = await this.postService.getPostById(id);
    if (post) {
      return post;
    } else {
      res.sendStatus(404);
      return null;
    }
  }
  @Post()
  async postPost(
    @Body('title') title: string,
    @Body('shortDescription') shortDescription: string,
    @Body('content') content: string,
    @Body('blogId') blogId: string,
  ): Promise<PostView | null> {
    return await this.postService.postPost(
      title,
      shortDescription,
      content,
      blogId,
    );
  }
  @Put(':id')
  async putPost(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('shortDescription') shortDescription: string,
    @Body('content') content: string,
    @Body('blogId') blogId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const updetedPost = await this.postService.putPost(
      id,
      title,
      shortDescription,
      content,
      blogId,
    );
    if (!updetedPost) {
      res.sendStatus(404);
      return false;
    } else {
      res.sendStatus(204);
      return true;
    }
  }
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const postDeleted = await this.postService.deletePost(id);
    if (!postDeleted) {
      res.sendStatus(404);
      return false;
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
    @Res({ passthrough: true }) res: Response,
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
      res.sendStatus(404);
      return null;
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
