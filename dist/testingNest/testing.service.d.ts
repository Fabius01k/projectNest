import { Model } from 'mongoose';
import { Blog } from '../blogNest/schema/blog-schema';
import { Post } from '../postNest/schema/post-schema';
import { InformationOfLikeAndDislikePost } from '../postNest/schema/likeOrDislikeInfoPost-schema';
import { Comment } from '../commentNest/schema/comment.schema';
import { InformationOfLikeAndDislikeComment } from '../commentNest/schema/likeOrDislikeInfoComment.schema';
import { User } from '../userNest/schema/user.schema';
export declare class TestingService {
    private blogModel;
    private postModel;
    private PInfoModel;
    private commentModel;
    private CInfoModel;
    private userModel;
    constructor(blogModel: Model<Blog>, postModel: Model<Post>, PInfoModel: Model<InformationOfLikeAndDislikePost>, commentModel: Model<Comment>, CInfoModel: Model<InformationOfLikeAndDislikeComment>, userModel: Model<User>);
    deleteAllData(): Promise<void>;
}
