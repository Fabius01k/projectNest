import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BlogResponse,
  BlogSaResponse,
  BlogSaView,
  BlogSql,
  BlogView,
} from '../schema/blog-schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogTrm } from '../../entities/blog.entity';
import { QuizGameTrm } from '../../onlineQuiz-game/entities/quiz-game.entity';
import { PlayerTrm } from '../../onlineQuiz-game/entities/player.entity';
import { QuizGameView } from '../../onlineQuiz-game/viewModels/quiz-game.wiew-model';
import { UserTrm } from '../../entities/user.entity';

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
    @InjectRepository(UserTrm)
    protected userRepository: Repository<UserTrm>,
  ) {}
  private async mapBlogToSaView(blog: BlogTrm): Promise<BlogSaView> {
    const user = await this.userRepository
      .createQueryBuilder('UserTrm')
      .where('UserTrm.id =:id', { id: blog.bloggerId })
      .getOne();

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
      blogOwnerInfo: {
        userId: user!.id,
        userLogin: user!.login,
      },
      banInfo: {
        isBanned: blog.isBanned,
        banDate: blog.banDate,
      },
    };
  }
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
      .andWhere('BlogTrm.isBanned = :status', { status: false })
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
  async findAllBlogsBloggerInDbTrm(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
    userId: string,
  ): Promise<BlogResponse> {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('BlogTrm')
      .where('BlogTrm.bloggerId = :bloggerId', { bloggerId: userId })
      .andWhere(
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
  async findAllBlogsSAInDbTrm(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<BlogSaResponse> {
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
      // .andWhere('BlogTrm.isBanned = :status', { status: false })
      .orderBy(
        'BlogTrm.' + sortBy,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize);

    const blogs = await queryBuilder.getMany();
    const totalCountQuery = await queryBuilder.getCount();

    const items = await Promise.all(blogs.map((b) => this.mapBlogToSaView(b)));

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
      .createQueryBuilder('BlogTrm')
      .where('BlogTrm.id =:id', { id })
      .andWhere('BlogTrm.isBanned = :status', { status: false })
      .getOne();
    if (blog) {
      return mapBlogToView(blog);
    } else {
      return null;
    }
  }
  async findBlogInDbTrm(id: string): Promise<BlogTrm | null> {
    const blog = await this.blogRepository
      .createQueryBuilder('BlogTrm')
      .where('BlogTrm.id =:id', { id })
      .getOne();
    return blog;
  }
  async checkOwnerBlogInDb(blogId: string, userId: string): Promise<void> {
    const blog = await this.blogRepository
      .createQueryBuilder('BlogTrm')
      .where('BlogTrm.id = :id', { id: blogId })
      .getOne();
    if (!blog) {
      throw new NotFoundException([
        {
          message: 'Blog not found',
        },
      ]);
    }
    if (blog?.bloggerId !== userId) {
      throw new ForbiddenException([
        {
          message: 'You are not allowed',
        },
      ]);
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
  async banBlog(
    id: string,
    isBanned: boolean,
    banDate: string,
  ): Promise<boolean> {
    const blogBanned = await this.blogRepository.update(
      { id: id },
      { isBanned: isBanned, banDate: banDate },
    );

    return (
      blogBanned.affected !== null &&
      blogBanned.affected !== undefined &&
      blogBanned.affected > 0
    );
  }
}
