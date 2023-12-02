import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogRepositorySql } from '../repository/blog.repositorySql';
import { BlogRepositoryTypeOrm } from '../repository/blog.repository.TypeOrm';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public blogDto: BlogInputModel,
    public userId: string,
  ) {}
}
@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    await this.blogRepositoryTypeOrm.checkOwnerBlogInDb(
      command.id,
      command.userId,
    );
    const updatedBlog = await this.blogRepositoryTypeOrm.updateBlogInDbTrm(
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
