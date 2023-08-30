import { BlogResponse, BlogView } from '../schema/blog-schema';
import { BlogRepository } from '../repository/blog.repository';
export declare class BlogService {
    protected blogRepository: BlogRepository;
    constructor(blogRepository: BlogRepository);
    getAllBlogs(searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<BlogResponse>;
    getBlogById(id: string): Promise<BlogView | null>;
    postBlog(name: string, description: string, websiteUrl: string): Promise<BlogView>;
    putBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>;
    deleteBlog(id: string): Promise<boolean>;
}
