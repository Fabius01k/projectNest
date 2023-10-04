import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../blogNest/repository/blog.repository';
import { BlogRepositorySql } from '../blogNest/repository/blog.repositorySql';

@ValidatorConstraint({ name: 'blogExist', async: true })
@Injectable()
export class BlogNotFoundValidation implements ValidatorConstraintInterface {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly blogRepositorySql: BlogRepositorySql,
  ) {}
  async validate(blogId: string) {
    const blog = await this.blogRepositorySql.findBlogByIdInDbSql(blogId);

    if (!blog) return false;
    return true;
  }
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
