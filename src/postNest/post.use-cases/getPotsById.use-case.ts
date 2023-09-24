import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';
import { PostView } from '../schema/post-schema';
import { NotFoundException } from '@nestjs/common';

export class GetPostByIdCommand {
  constructor(
    public id: string,
    public userId: string | null,
  ) {}
}
@CommandHandler(GetPostByIdCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdCommand> {
  constructor(protected postRepository: PostRepository) {}

  async execute(command: GetPostByIdCommand): Promise<PostView | null> {
    const post = await this.postRepository.findPostByIdInDb(
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
