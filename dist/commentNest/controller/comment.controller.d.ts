import { CommentView } from '../schema/comment.schema';
import { CommentService } from '../service/comment.service';
import { Response } from 'express';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getCommentById(id: string, res: Response): Promise<CommentView | null>;
}
