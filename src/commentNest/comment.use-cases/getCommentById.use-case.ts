import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repository/comment.repository';
import { CommentView } from '../schema/comment.schema';
import { NotFoundException } from '@nestjs/common';
import { CommentRepositorySql } from '../repository/comment.repositorySql';

export class GetCommentByIdCommand {
  constructor(
    public id: string,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetCommentByIdCommand)
export class GetCommentByIdUseCase
  implements ICommandHandler<GetCommentByIdCommand>
{
  constructor(
    protected commentRepository: CommentRepository,
    protected commentRepositorySql: CommentRepositorySql,
  ) {}

  async execute(command: GetCommentByIdCommand): Promise<CommentView | null> {
    const comment = await this.commentRepositorySql.findCommentByIdInDbSql(
      command.id,
      command.userId,
    );
    if (!comment) {
      throw new NotFoundException([
        {
          message: 'Comment not found',
        },
      ]);
    }
    return comment;
  }
}
