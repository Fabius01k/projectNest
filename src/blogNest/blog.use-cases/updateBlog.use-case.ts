import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../repository/blog.repositorySql';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public blogDto: BlogInputModel,
  ) {}
}
@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(protected blogRepositorySql: BlogRepositorySql) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const updatedBlog = await this.blogRepositorySql.updateBlogInDbSql(
      command.id,
      command.blogDto.name,
      command.blogDto.description,
      command.blogDto.websiteUrl,
    );
    if (!updatedBlog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    return true;
  }
}
