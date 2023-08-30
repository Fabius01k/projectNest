import { PostResponse, PostView } from '../schema/post-schema';
import { PostService } from '../service/post.service';
import { CommentService } from '../../commentNest/service/comment.service';
import { CommentResponse } from '../../commentNest/schema/comment.schema';
import { Response } from 'express';
export declare class PostController {
    private readonly postService;
    private readonly commentService;
    constructor(postService: PostService, commentService: CommentService);
    getAllPosts(searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<PostResponse>;
    getPostById(id: string, res: Response): Promise<PostView | null>;
    postPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostView | null>;
    putPost(id: string, title: string, shortDescription: string, content: string, blogId: string, res: Response): Promise<boolean>;
    deletePost(id: string, res: Response): Promise<boolean>;
    getAllCommentForSpecifeldPost(postId: string, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number, res: Response): Promise<CommentResponse | null>;
}
