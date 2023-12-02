import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogView } from '../schema/blog-schema';
import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { BlogRepositorySql } from '../repository/blog.repositorySql';
import { BlogRepositoryTypeOrm } from '../repository/blog.repository.TypeOrm';
import { BlogTrm } from '../../entities/blog.entity';

export class CreateBlogCommand {
  constructor(
    public blogDto: BlogInputModel,
    public userId: string,
  ) {}
}
@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    protected blogRepositorySql: BlogRepositorySql,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogView> {
    const dateNow = new Date().getTime().toString();

    const newBlog = new BlogTrm();
    newBlog.id = dateNow;
    newBlog.name = command.blogDto.name;
    newBlog.description = command.blogDto.description;
    newBlog.websiteUrl = command.blogDto.websiteUrl;
    newBlog.createdAt = new Date().toISOString();
    newBlog.isMembership = false;
    newBlog.bloggerId = command.userId;
    newBlog.blogPosts = [];

    return await this.blogRepositoryTypeOrm.createBlogInDbTrm(newBlog);
  }
}
