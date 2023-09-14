import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../blogNest/repository/blog.repository';
import { BlogService } from '../blogNest/service/blog.service';

@ValidatorConstraint({ name: 'blogExist', async: true })
@Injectable()
export class BlogNotFoundValidation implements ValidatorConstraintInterface {
  constructor(private readonly blogRepository: BlogRepository) {}
  async validate(blogId: string) {
    const blog = await this.blogRepository.findBlogByIdInDb(blogId);

    if (!blog) return false;
    return true;
  }

  // defaultMessage(args: ValidationArguments): string {
  //   return `This blog is not found`;
  // }
}
export function FindBlogInDb(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'blogExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: BlogNotFoundValidation,
    });
  };
}
