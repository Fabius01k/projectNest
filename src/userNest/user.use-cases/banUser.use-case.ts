import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryTypeOrm } from '../repository/user.repository.TypeOrm';
import { NotFoundException } from '@nestjs/common';
import { SecurityRepositoryTypeOrm } from '../../securityNest/repository/security.repository.TypeOrm';
import { PostRepositoryTypeOrm } from '../../postNest/repository/post.repository.TypeOrm';
import { CommentRepositoryTypeOrm } from '../../commentNest/repository/comment.repositoryTypeOrm';

export class BanUserCommand {
  constructor(
    public id: string,
    public isBanned: boolean,
    public banReason: string,
  ) {}
}
@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    protected userRepositoryTypeOrm: UserRepositoryTypeOrm,
    protected securityRepositoryTypeOrm: SecurityRepositoryTypeOrm,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
    protected commentRepositoryTypeOrm: CommentRepositoryTypeOrm,
  ) {}
  async execute(command: BanUserCommand): Promise<void> {
    const userBaned = await this.userRepositoryTypeOrm.banUser(
      command.id,
      command.isBanned,
      command.banReason,
    );
    if (!userBaned) {
      throw new NotFoundException([
        {
          message: 'User not found',
        },
      ]);
    }
    await this.securityRepositoryTypeOrm.deleteAllSessionsInDbTrm(command.id);
    await this.postRepositoryTypeOrm.banPosts(command.id, command.isBanned);
    await this.commentRepositoryTypeOrm.banComments(
      command.id,
      command.isBanned,
    );
    await this.commentRepositoryTypeOrm.banCommentLikes(
      command.id,
      command.isBanned,
    );
    await this.postRepositoryTypeOrm.banPostLikes(command.id, command.isBanned);
  }
}
