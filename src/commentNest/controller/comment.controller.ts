import { Controller, Get, Param } from '@nestjs/common';
import { CommentView } from '../schema/comment.schema';
import { CommentService } from '../service/comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  async getCommentById(@Param('id') id: string): Promise<CommentView | null> {
    const comment = await this.commentService.getCommentById(id);
    return comment;
  }
}
