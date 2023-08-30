import { Post, PostDocument, PostResponse, PostView } from '../schema/post-schema';
import { Model } from 'mongoose';
import { InformationOfLikeAndDislikePost, InformationOfLikeAndDislikePostDocument } from '../schema/likeOrDislikeInfoPost-schema';
import { BlogDocument } from '../../blogNest/schema/blog-schema';
export declare class PostRepository {
    protected postModel: Model<PostDocument>;
    protected infoModel: Model<InformationOfLikeAndDislikePostDocument>;
    protected blogModel: Model<BlogDocument>;
    constructor(postModel: Model<PostDocument>, infoModel: Model<InformationOfLikeAndDislikePostDocument>, blogModel: Model<BlogDocument>);
    private mapPostToView;
    findAllPostsInDb(searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<PostResponse>;
    findAllPostsForSpecifeldBlogInDb(sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number, blogId: string): Promise<PostResponse>;
    findPostByIdInDb(id: string): Promise<PostView | null>;
    createPostInDb(newPost: Post): Promise<PostView>;
    updatePostInDb(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>;
    deletePostInDb(id: string): Promise<boolean>;
    createInfOfLikeAndDislikePost(InfOfLikeAndDislikePost: InformationOfLikeAndDislikePost): Promise<InformationOfLikeAndDislikePost>;
}
