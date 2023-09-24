import { PostCreateInputModel } from '../../inputmodels-validation/post.inputModel';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repository/post.repository';
import { NotFoundException } from '@nestjs/common';

export class UpdatePostCommand {
  constructor(
    public id: string,
    public postDto: PostCreateInputModel,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(protected postRepository: PostRepository) {}

  async execute(command: UpdatePostCommand): Promise<boolean> {
    const updatedPost = await this.postRepository.updatePostInDb(
      command.id,
      command.postDto.title,
      command.postDto.shortDescription,
      command.postDto.content,
      command.postDto.blogId,
    );
    if (!updatedPost) {
      throw new NotFoundException([
        {
          message: 'Post not found',
        },
      ]);
    }
    return true;
  }
}
