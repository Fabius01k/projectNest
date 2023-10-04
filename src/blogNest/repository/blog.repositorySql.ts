import { Injectable } from '@nestjs/common';
import { BlogResponse, BlogSql, BlogView } from '../schema/blog-schema';
import { QueryResult } from 'pg';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const mapBlogToView = (blog: BlogSql): BlogView => {
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
export class BlogRepositorySql {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}
  async findAllBlogsInDbSql(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageSize: number,
    pageNumber: number,
  ): Promise<BlogResponse> {
    const blogs = await this.dataSource.query<BlogSql[]>(`
    SELECT *
    FROM public."Blogs"
    WHERE
    "name" ILIKE '%${searchNameTerm ?? ''}%'
    ORDER BY
      "${sortBy}" ${sortDirection}
    LIMIT
      ${pageSize}
    OFFSET
      ${(pageNumber - 1) * pageSize}   
    `);

    const totalCountQuery = await this.dataSource.query<
      { totalCount: string }[]
    >(`
    SELECT COUNT(*) AS "totalCount"
    FROM public."Blogs"   
    WHERE
      "name" ILIKE '%${searchNameTerm ?? ''}%'     
  `);

    const items = blogs.map((b) => mapBlogToView(b));

    return {
      pagesCount: Math.ceil(+totalCountQuery[0].totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCountQuery[0].totalCount,
      items: items,
    };
  }
  async findBlogByIdInDbSql(id: string): Promise<BlogView | null> {
    console.log(id, 'repo');
    const blog: QueryResult<BlogSql[] | null> = await this.dataSource.query(`
    SELECT *
    FROM public."Blogs"
    WHERE 
    "id" = '${id}'   
    `);
    if (blog.length === 0) return null;
    return mapBlogToView(blog[0]);
  }
  async createBlogInDbSql(newBlog: BlogSql): Promise<BlogView> {
    const query = `
    INSERT INTO public."Blogs"(
    "id",
    "name",
    "description",
    "websiteUrl",
    "createdAt",
    "isMembership")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;

    const values = [
      newBlog.id,
      newBlog.name,
      newBlog.description,
      newBlog.websiteUrl,
      newBlog.createdAt,
      newBlog.isMembership,
    ];

    const result = await this.dataSource.query(query, values);
    const blog = result[0];

    return mapBlogToView(blog);
  }
  async updateBlogInDbSql(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const query = `
    UPDATE public."Blogs"
    SET 
    "name" = $1,
    "description" = $2,
    "websiteUrl" = $3
    
    WHERE "id" = $4`;

    const values = [name, description, websiteUrl, id];
    const [_, blogUpdated] = await this.dataSource.query(query, values);

    return blogUpdated === 1;
  }
  async deleteBlogInDbSql(id: string): Promise<boolean> {
    const query = `    
    DELETE
    FROM public."Blogs"
    WHERE "id" = $1`;

    const values = [id];

    const [_, deletedBlog] = await this.dataSource.query(query, values);

    return deletedBlog === 1;
  }
}
