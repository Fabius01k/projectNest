import { CommentDocument, CommentResponse, CommentView } from '../schema/comment.schema';
import { Model } from 'mongoose';
import { InformationOfLikeAndDislikeCommentDocument } from '../schema/likeOrDislikeInfoComment.schema';
export declare class CommentRepository {
    protected commentModel: Model<CommentDocument>;
    protected infoModelC: Model<InformationOfLikeAndDislikeCommentDocument>;
    constructor(commentModel: Model<CommentDocument>, infoModelC: Model<InformationOfLikeAndDislikeCommentDocument>);
    private mapCommentToView;
    findCommentByIdInDb(id: string): Promise<CommentView | null>;
    findAllCommentsForSpecifeldPostInDb(sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number, postId: string): Promise<CommentResponse>;
}
