import { BlogService } from '../service/blog.service';
import { BlogResponse, BlogView } from '../schema/blog-schema';
import { PostResponse, PostView } from '../../postNest/schema/post-schema';
import { PostService } from '../../postNest/service/post.service';
import { Response } from 'express';
export declare class BlogController {
    private readonly blogService;
    private readonly postService;
    constructor(blogService: BlogService, postService: PostService);
    getAllBlogs(searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<BlogResponse>;
    getBlogById(id: string, res: Response): Promise<BlogView | null>;
    postBlog(name: string, description: string, websiteUrl: string): Promise<BlogView>;
    putBlog(id: string, name: string, description: string, websiteUrl: string, res: Response): Promise<boolean>;
    deleteBlog(id: string, res: Response): Promise<boolean>;
    getAllPostsForSpecifeldBlog(blogId: string, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number, res: Response): Promise<PostResponse | null>;
    postPostForSpecifeldBlog(blogId: string, title: string, shortDescription: string, content: string, res: Response): Promise<PostView | null>;
}
