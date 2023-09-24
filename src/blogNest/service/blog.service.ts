import { Injectable } from '@nestjs/common';

import { BlogRepository } from '../repository/blog.repository';

@Injectable()
export class BlogService {
  constructor(protected blogRepository: BlogRepository) {}
}
