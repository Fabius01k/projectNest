import { BanUserForBlogInputModel } from '../../inputmodels-validation/user.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryTypeOrm } from '../../userNest/repository/user.repository.TypeOrm';
import { BannedUsersInBlogsEntityTrm } from '../../entities/bannedUsersInBlogs.entity';

export class BanUserForBlogCommand {
  constructor(
    public id: string,
    public banUserForBlogDto: BanUserForBlogInputModel,
  ) {}
}
@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogUseCase
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(protected userRepositoryTypeOrm: UserRepositoryTypeOrm) {}

  async execute(command: BanUserForBlogCommand): Promise<void> {
    if (command.banUserForBlogDto.isBanned) {
      const banDate = new Date().toISOString();
      const newUserForBlogBanned = new BannedUsersInBlogsEntityTrm();
      newUserForBlogBanned.userId = command.id;
      newUserForBlogBanned.blogId = command.banUserForBlogDto.blogId;
      newUserForBlogBanned.banReason = command.banUserForBlogDto.banReason;
      newUserForBlogBanned.isBanned = command.banUserForBlogDto.isBanned;
      newUserForBlogBanned.banDate = banDate;

      await this.userRepositoryTypeOrm.banUserForSpecifeldBlog(
        newUserForBlogBanned,
      );
    }
    if (!command.banUserForBlogDto.isBanned) {
      await this.userRepositoryTypeOrm.unbanUserForSpecifeldBlog(
        command.id,
        command.banUserForBlogDto.blogId,
      );
    }
  }
}
