import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';
import { NotFoundException } from '@nestjs/common';

export class DeletePostCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(protected postRepository: PostRepository) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    const postDeleted = await this.postRepository.deletePostInDb(command.id);
    if (!postDeleted) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return true;
  }
}
