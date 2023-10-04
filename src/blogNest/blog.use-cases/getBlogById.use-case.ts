import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../repository/blog.repository';
import { BlogView } from '../schema/blog-schema';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../repository/blog.repositorySql';

export class GetBlogByIdCommand {
  constructor(public id: string) {}
}
@CommandHandler(GetBlogByIdCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(
    protected blogRepository: BlogRepository,
    protected blogRepositorySql: BlogRepositorySql,
  ) {}

  async execute(command: GetBlogByIdCommand): Promise<BlogView | null> {
    const blog = await this.blogRepositorySql.findBlogByIdInDbSql(command.id);
    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    return blog;
  }
}
