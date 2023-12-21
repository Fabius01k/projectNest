import { BanBlogInputModel } from '../../inputmodels-validation/blog.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepositoryTypeOrm } from '../../postNest/repository/post.repository.TypeOrm';
import { BlogRepositoryTypeOrm } from '../repository/blog.repository.TypeOrm';
import { NotFoundException } from '@nestjs/common';

export class BanBlogCommand {
  constructor(
    public id: string,
    public banBlogDto: BanBlogInputModel,
  ) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
    protected blogRepositoryTypeOrm: BlogRepositoryTypeOrm,
  ) {}
  async execute(command: BanBlogCommand): Promise<void> {
    const blog = await this.blogRepositoryTypeOrm.findBlogForBanInDbTrm(
      command.id,
    );
    if (!blog) {
      throw new NotFoundException([
        {
          message: 'User not found',
        },
      ]);
    }
    await this.blogRepositoryTypeOrm.banBlog(
      command.id,
      command.banBlogDto.isBanned,
    );
    await this.postRepositoryTypeOrm.banPosts(
      blog.bloggerId,
      command.banBlogDto.isBanned,
    );
  }
}
