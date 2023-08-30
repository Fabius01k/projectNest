"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const post_schema_1 = require("../schema/post-schema");
const mongoose_2 = require("mongoose");
const likeOrDislikeInfoPost_schema_1 = require("../schema/likeOrDislikeInfoPost-schema");
const blog_schema_1 = require("../../blogNest/schema/blog-schema");
let PostRepository = class PostRepository {
    constructor(postModel, infoModel, blogModel) {
        this.postModel = postModel;
        this.infoModel = infoModel;
        this.blogModel = blogModel;
    }
    async mapPostToView(post, userId) {
        const PostsLikesInfo = await this.infoModel.findOne({ postId: post.id });
        const userStatus = PostsLikesInfo?.likesInfo
            ? PostsLikesInfo?.likesInfo.find((info) => info.userId === userId)
            : { likeStatus: 'None' };
        const myStatus = userStatus ? userStatus.likeStatus : 'None';
        const newestLikes = PostsLikesInfo?.likesInfo
            ?.filter((info) => info.likeStatus === 'Like')
            ?.sort((a, b) => new Date(b.dateOfLikeDislike).getTime() -
            new Date(a.dateOfLikeDislike).getTime())
            ?.slice(0, 3)
            ?.map((info) => ({
            addedAt: info.dateOfLikeDislike,
            userId: info.userId,
            login: info.login,
        })) || [];
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: PostsLikesInfo ? PostsLikesInfo.numberOfLikes : 0,
                dislikesCount: PostsLikesInfo ? PostsLikesInfo.numberOfDislikes : 0,
                myStatus: myStatus,
                newestLikes: newestLikes,
            },
        };
    }
    async findAllPostsInDb(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber) {
        const filter = searchNameTerm
            ? { name: new RegExp(searchNameTerm, 'gi') }
            : {};
        const posts = await this.postModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
        const userId = null;
        const items = await Promise.all(posts.map((p) => this.mapPostToView(p, userId)));
        const totalCount = await this.postModel.countDocuments();
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items,
        };
    }
    async findAllPostsForSpecifeldBlogInDb(sortBy, sortDirection, pageSize, pageNumber, blogId) {
        const posts = await this.postModel
            .find({ blogId: blogId })
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
        const userId = null;
        const items = await Promise.all(posts.map((p) => this.mapPostToView(p, userId)));
        const totalCount = await this.postModel.countDocuments({ blogId: blogId });
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items,
        };
    }
    async findPostByIdInDb(id) {
        const post = await this.postModel.findOne({ id: id });
        if (!post)
            return null;
        const userId = null;
        return this.mapPostToView(post, userId);
    }
    async createPostInDb(newPost) {
        const createdPost = new this.postModel(newPost);
        await createdPost.save();
        const userId = null;
        return this.mapPostToView(newPost, userId);
    }
    async updatePostInDb(id, title, shortDescription, content, blogId) {
        const blog = await this.blogModel.findOne({ id: blogId });
        if (!blog) {
            return false;
        }
        const updatePost = await this.postModel.updateOne({ id: id }, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
            },
        });
        const post = updatePost.matchedCount === 1;
        return post;
    }
    async deletePostInDb(id) {
        const deletedPost = await this.postModel.deleteOne({ id: id });
        return deletedPost.deletedCount === 1;
    }
    async createInfOfLikeAndDislikePost(InfOfLikeAndDislikePost) {
        const createdInfo = new this.infoModel(InfOfLikeAndDislikePost);
        return await createdInfo.save();
    }
};
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, mongoose_1.InjectModel)(likeOrDislikeInfoPost_schema_1.InformationOfLikeAndDislikePost.name)),
    __param(2, (0, mongoose_1.InjectModel)(blog_schema_1.Blog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PostRepository);
//# sourceMappingURL=post.repository.js.map