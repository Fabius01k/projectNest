import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostView } from '../schema/post-schema';
import { NotFoundException } from '@nestjs/common';
import { PostRepositorySql } from '../repository/post.repositorySql';
import { PostRepositoryTypeOrm } from '../repository/post.repository.TypeOrm';

export class GetPostByIdCommand {
  constructor(
    public id: string,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetPostByIdCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdCommand> {
  constructor(
    protected postRepositorySql: PostRepositorySql,
    protected postRepositoryTypeOrm: PostRepositoryTypeOrm,
  ) {}

  async execute(command: GetPostByIdCommand): Promise<PostView | null> {
    const post = await this.postRepositoryTypeOrm.findPostByIdInDbTrm(
      command.id,
      command.userId,
    );
    if (!post) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return post;
  }
}
