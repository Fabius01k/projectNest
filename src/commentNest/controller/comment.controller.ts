import { Controller, Get, Param, Res } from '@nestjs/common';
import { CommentView } from '../schema/comment.schema';
import { CommentService } from '../service/comment.service';
import { Response } from 'express';
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommentView | null> {
    const comment = await this.commentService.getCommentById(id);
    if (comment) {
      return comment;
    } else {
      res.sendStatus(404);
      return null;
    }
  }
}
