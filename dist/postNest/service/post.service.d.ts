import { PostResponse, PostView } from '../schema/post-schema';
import { PostRepository } from '../repository/post.repository';
import { BlogRepository } from '../../blogNest/repository/blog.repository';
export declare class PostService {
    protected postRepository: PostRepository;
    protected blogRepository: BlogRepository;
    constructor(postRepository: PostRepository, blogRepository: BlogRepository);
    getAllPosts(searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<PostResponse>;
    getAllPostsForSpecifeldBlog(sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number, blogId: string): Promise<PostResponse>;
    getPostById(id: string): Promise<PostView | null>;
    postPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostView | null>;
    postPostForSpecifeldBlog(title: string, shortDescription: string, content: string, blogId: string): Promise<PostView | null>;
    putPost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>;
    deletePost(id: string): Promise<boolean>;
}
