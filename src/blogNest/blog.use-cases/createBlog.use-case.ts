import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../repository/blog.repository';
import { Blog, BlogView } from '../schema/blog-schema';
import { BlogInputModel } from '../../inputmodels-validation/blog.inputModel';

export class CreateBlogCommand {
  constructor(public blogDto: BlogInputModel) {}
}
@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(protected blogRepository: BlogRepository) {}

  async execute(command: CreateBlogCommand): Promise<BlogView> {
    const dateNow = new Date().getTime().toString();
    const newBlog = new Blog(
      dateNow,
      command.blogDto.name,
      command.blogDto.description,
      command.blogDto.websiteUrl,
      new Date().toISOString(),
      false,
    );

    return await this.blogRepository.createBlogInDb(newBlog);
  }
}
