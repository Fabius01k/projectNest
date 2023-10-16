import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../repository/blog.repositorySql';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(protected blogRepositorySql: BlogRepositorySql) {}

  async execute(command: DeleteBlogCommand): Promise<boolean> {
    const blogDeleted = await this.blogRepositorySql.deleteBlogInDbSql(
      command.id,
    );
    if (!blogDeleted) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    return true;
  }
}
