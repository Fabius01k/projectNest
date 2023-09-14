import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentView } from '../schema/comment.schema';
import { CommentService } from '../service/comment.service';
import { CommentInputModel } from '../../inputmodels-validation/comments.inputModel';
import { AuthGuard } from '../../authNest/guards/bearer.guard';
import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @UseGuards(AuthGuard)
  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<CommentView | null> {
    const comment = await this.commentService.getCommentById(id, req.userId);
    return comment;
  }
  @UseGuards(AuthGuard)
  @Put(':commentId')
  @HttpCode(204)
  async putComment(
    @Param('commentId') commentId: string,
    @Body() commentDto: CommentInputModel,
    @Request() req,
  ): Promise<boolean> {
    const commentBeforeUpdating = await this.commentService.getCommentById(
      commentId,
      req.userId,
    );
    const commentatorId = commentBeforeUpdating!.commentatorInfo.userId;
    if (commentatorId !== req.userId) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }
    await this.commentService.putComment(commentId, commentDto);

    return true;
  }
  @UseGuards(AuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(204)
  async makeLikeOrDislike(
    @Param('commentId') commentId: string,
    @Body() likeDto: LikeInputModel,
    @Request() req,
  ): Promise<boolean> {
    const comment =
      await this.commentService.getCommentForLikeOrDislike(commentId);
    const dateOfLikeDislike = new Date();

    await this.commentService.makeLikeOrDislike(
      req.userId,
      commentId,
      likeDto,
      dateOfLikeDislike,
    );

    return true;
  }
  @UseGuards(AuthGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req,
  ): Promise<void> {
    const commentBeforeUpdating = await this.commentService.getCommentById(
      commentId,
      req.userId,
    );
    const commentatorId = commentBeforeUpdating!.commentatorInfo.userId;
    if (commentatorId !== req.userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
    await this.commentService.deleteComment(commentId);

    return;
  }
}
