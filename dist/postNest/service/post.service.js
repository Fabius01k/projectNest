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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const post_schema_1 = require("../schema/post-schema");
const post_repository_1 = require("../repository/post.repository");
const blog_repository_1 = require("../../blogNest/repository/blog.repository");
const mongodb_1 = require("mongodb");
const likeOrDislikeInfoPost_schema_1 = require("../schema/likeOrDislikeInfoPost-schema");
let PostService = class PostService {
    constructor(postRepository, blogRepository) {
        this.postRepository = postRepository;
        this.blogRepository = blogRepository;
    }
    async getAllPosts(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber) {
        return await this.postRepository.findAllPostsInDb(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber);
    }
    async getAllPostsForSpecifeldBlog(sortBy, sortDirection, pageSize, pageNumber, blogId) {
        return await this.postRepository.findAllPostsForSpecifeldBlogInDb(sortBy, sortDirection, pageSize, pageNumber, blogId);
    }
    async getPostById(id) {
        return await this.postRepository.findPostByIdInDb(id);
    }
    async postPost(title, shortDescription, content, blogId) {
        const dateNow = new Date().getTime().toString();
        const blog = await this.blogRepository.findBlogByIdInDb(blogId);
        if (!blog) {
            return null;
        }
        const newPost = new post_schema_1.Post(new mongodb_1.ObjectId(), dateNow, title, shortDescription, content, blogId, blog.name, new Date().toISOString());
        const postId = newPost.id;
        const InfOfLikeAndDislikePost = new likeOrDislikeInfoPost_schema_1.InformationOfLikeAndDislikePost(postId, 0, 0, []);
        await this.postRepository.createInfOfLikeAndDislikePost(InfOfLikeAndDislikePost);
        return await this.postRepository.createPostInDb(newPost);
    }
    async postPostForSpecifeldBlog(title, shortDescription, content, blogId) {
        const dateNow = new Date().getTime().toString();
        const blog = await this.blogRepository.findBlogByIdInDb(blogId);
        if (!blog) {
            return null;
        }
        const newPost = new post_schema_1.Post(new mongodb_1.ObjectId(), dateNow, title, shortDescription, content, blogId, blog.name, new Date().toISOString());
        const postId = newPost.id;
        const InfOfLikeAndDislikePost = new likeOrDislikeInfoPost_schema_1.InformationOfLikeAndDislikePost(postId, 0, 0, []);
        await this.postRepository.createInfOfLikeAndDislikePost(InfOfLikeAndDislikePost);
        return await this.postRepository.createPostInDb(newPost);
    }
    async putPost(id, title, shortDescription, content, blogId) {
        const updatedPost = await this.postRepository.updatePostInDb(id, title, shortDescription, content, blogId);
        if (!updatedPost) {
            return false;
        }
        return true;
    }
    async deletePost(id) {
        const postDeleted = await this.postRepository.deletePostInDb(id);
        if (!postDeleted) {
            return false;
        }
        return true;
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [post_repository_1.PostRepository,
        blog_repository_1.BlogRepository])
], PostService);
//# sourceMappingURL=post.service.js.map