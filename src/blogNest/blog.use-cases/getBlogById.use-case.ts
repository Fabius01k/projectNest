import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogView } from '../schema/blog-schema';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../repository/blog.repositorySql';
import { BlogRepositoryTypeOrm } from '../repository/blog.repository.TypeOrm';

export class GetBlogByIdCommand {
  constructor(public id: string) {}
}
@CommandHandler(GetBlogByIdCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: GetBlogByIdCommand): Promise<BlogView | null> {
    const blog = await this.blogRepositoryTypeOrm.findBlogByIdInDbTrm(
      command.id,
    );
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
