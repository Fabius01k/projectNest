import { Blog, BlogDocument, BlogResponse, BlogView } from '../schema/blog-schema';
import { Model } from 'mongoose';
export declare class BlogRepository {
    protected blogModel: Model<BlogDocument>;
    constructor(blogModel: Model<BlogDocument>);
    findAllBlogsInDb(searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<BlogResponse>;
    findBlogByIdInDb(id: string): Promise<BlogView | null>;
    createBlogInDb(newBlog: Blog): Promise<BlogView>;
    updateBlogInDb(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>;
    deleteBlogInDb(id: string): Promise<boolean>;
}
