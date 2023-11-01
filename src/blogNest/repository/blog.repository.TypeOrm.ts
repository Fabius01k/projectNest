import { Injectable } from '@nestjs/common';
import { BlogResponse, BlogSql, BlogView } from '../schema/blog-schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogTrm } from '../../entities/blog.entity';
import { QuizGameTrm } from '../../onlineQuiz-game/entities/quiz-game.entity';
import { PlayerTrm } from '../../onlineQuiz-game/entities/player.entity';
import { QuizGameView } from '../../onlineQuiz-game/viewModels/quiz-game.wiew-model';

const mapBlogToView = (blog: BlogTrm): BlogView => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

@Injectable()
export class BlogRepositoryTypeOrm {
  constructor(
    @InjectRepository(BlogTrm)
    protected blogRepository: Repository<BlogTrm>,
  ) {}
  async findAllBlogsInDbTrm(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<BlogResponse> {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('BlogTrm')
      .where(
        `${
          searchNameTerm
            ? 'BlogTrm.name ilike :searchNameTerm'
            : 'BlogTrm.name is not null'
        }`,
        { searchNameTerm: `%${searchNameTerm}%` },
      )
      .orderBy(
        'BlogTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const blogs = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    const items = blogs.map((b) => mapBlogToView(b));

    return {
      pagesCount: Math.ceil(totalCountQuery / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCountQuery,
      items,
    };
  }

  async findBlogByIdInDbTrm(id: string): Promise<BlogView | null> {
    const blog = await this.blogRepository
      .createQueryBuilder('BlogSql')
      .where('BlogSql.id =:id', { id })
      .getOne();
    if (blog) {
      return mapBlogToView(blog);
    } else {
      return null;
    }
  }
  async createBlogInDbTrm(newBlog: BlogSql): Promise<BlogView> {
    const createdBlog = await this.blogRepository.save(newBlog);

    return mapBlogToView(createdBlog);
  }
  async updateBlogInDbTrm(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const updatedBlog = await this.blogRepository.update(
      { id: id },
      {
        name: name,
        description: description,
        websiteUrl: websiteUrl,
      },
    );

    return (
      updatedBlog.affected !== null &&
      updatedBlog.affected !== undefined &&
      updatedBlog.affected > 0
    );
  }
  async deleteBlogInDbTrm(id: string): Promise<boolean> {
    const deletedBlog = await this.blogRepository.delete(id);
    return (
      deletedBlog.affected !== null &&
      deletedBlog.affected !== undefined &&
      deletedBlog.affected > 0
    );
  }
}
