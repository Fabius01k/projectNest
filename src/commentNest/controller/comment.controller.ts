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
import { AuthGuard, GetToken } from '../../authNest/guards/bearer.guard';
import { LikeInputModel } from '../../inputmodels-validation/like.inputModel';
import { CommandBus } from '@nestjs/cqrs';
import { GetCommentByIdCommand } from '../comment.use-cases/getCommentById.use-case';
import { UpdateCommentCommand } from '../comment.use-cases/updateComment.use-case';
import { DeleteCommentCommand } from '../comment.use-cases/deleteComment.use-case';
import { MakeLikeOrDislikeCCommand } from '../comment.use-cases/makeLikeOrDislike.use-case';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commandBus: CommandBus,
  ) {}
  @UseGuards(GetToken)
  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<CommentView | null> {
    const comment = await this.commandBus.execute(
      new GetCommentByIdCommand(id, req.userId),
    );
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
    const commentBeforeUpdating = await this.commandBus.execute(
      new GetCommentByIdCommand(commentId, req.userId),
    );
    const commentatorId = commentBeforeUpdating.commentatorInfo.userId;
    if (commentatorId !== req.userId) {
      throw new ForbiddenException([
        {
          message: 'You are not allowed to update this comment',
        },
      ]);
    }
    await this.commandBus.execute(
      new UpdateCommentCommand(commentId, commentDto),
    );

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
    // const comment =
    //   await this.commentService.getCommentForLikeOrDislike(commentId);
    const comment = await this.commandBus.execute(
      new GetCommentByIdCommand(commentId, req.userId),
    );

    await this.commandBus.execute(
      new MakeLikeOrDislikeCCommand(req.userId, commentId, likeDto),
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
    const commentBeforeUpdating = await this.commandBus.execute(
      new GetCommentByIdCommand(commentId, req.userId),
    );
    const commentatorId = commentBeforeUpdating.commentatorInfo.userId;
    console.log(commentatorId);
    if (commentatorId !== req.userId) {
      throw new ForbiddenException([
        {
          message: 'You are not allowed to update this comment',
        },
      ]);
    }
    await this.commandBus.execute(new DeleteCommentCommand(commentId));

    return;
  }
}
