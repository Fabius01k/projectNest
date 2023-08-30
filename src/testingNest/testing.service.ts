import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../blogNest/schema/blog-schema';
import { Post } from '../postNest/schema/post-schema';
import { InformationOfLikeAndDislikePost } from '../postNest/schema/likeOrDislikeInfoPost-schema';
import { Comment } from '../commentNest/schema/comment.schema';
import { InformationOfLikeAndDislikeComment } from '../commentNest/schema/likeOrDislikeInfoComment.schema';
import { User } from '../userNest/schema/user.schema';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(InformationOfLikeAndDislikePost.name)
    private PInfoModel: Model<InformationOfLikeAndDislikePost>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(InformationOfLikeAndDislikeComment.name)
    private CInfoModel: Model<InformationOfLikeAndDislikeComment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async deleteAllData() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.PInfoModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.CInfoModel.deleteMany({});
    await this.userModel.deleteMany({});
  }
}
