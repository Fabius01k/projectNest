import { CommentResponse, CommentView } from '../schema/comment.schema';
import { CommentRepository } from '../repository/comment.repository';
export declare class CommentService {
    protected commentRepository: CommentRepository;
    constructor(commentRepository: CommentRepository);
    getCommentById(id: string): Promise<CommentView | null>;
    getAllCommentForSpecifeldPost(sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number, postId: string): Promise<CommentResponse>;
}
