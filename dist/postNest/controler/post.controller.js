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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("../service/post.service");
const comment_service_1 = require("../../commentNest/service/comment.service");
let PostController = class PostController {
    constructor(postService, commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }
    async getAllPosts(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber) {
        if (!searchNameTerm) {
            searchNameTerm = null;
        }
        if (!sortBy) {
            sortBy = 'createdAt';
        }
        if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
            sortDirection = 'desc';
        }
        const checkPageSize = +pageSize;
        if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
            pageSize = 10;
        }
        const checkPageNumber = +pageNumber;
        if (!pageNumber ||
            !Number.isInteger(checkPageNumber) ||
            checkPageNumber <= 0) {
            pageNumber = 1;
        }
        return await this.postService.getAllPosts(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber);
    }
    async getPostById(id, res) {
        const post = await this.postService.getPostById(id);
        if (post) {
            return post;
        }
        else {
            res.sendStatus(404);
            return null;
        }
    }
    async postPost(title, shortDescription, content, blogId) {
        return await this.postService.postPost(title, shortDescription, content, blogId);
    }
    async putPost(id, title, shortDescription, content, blogId, res) {
        const updetedPost = await this.postService.putPost(id, title, shortDescription, content, blogId);
        if (!updetedPost) {
            res.sendStatus(404);
            return false;
        }
        else {
            res.sendStatus(204);
            return true;
        }
    }
    async deletePost(id, res) {
        const postDeleted = await this.postService.deletePost(id);
        if (!postDeleted) {
            res.sendStatus(404);
            return false;
        }
        else {
            res.sendStatus(204);
            return true;
        }
    }
    async getAllCommentForSpecifeldPost(postId, sortBy, sortDirection, pageSize, pageNumber, res) {
        if (!sortBy) {
            sortBy = 'createdAt';
        }
        if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
            sortDirection = 'desc';
        }
        const checkPageSize = +pageSize;
        if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
            pageSize = 10;
        }
        const checkPageNumber = +pageNumber;
        if (!pageNumber ||
            !Number.isInteger(checkPageNumber) ||
            checkPageNumber <= 0) {
            pageNumber = 1;
        }
        const post = await this.postService.getPostById(postId);
        if (!post) {
            res.sendStatus(404);
            return null;
        }
        return await this.commentService.getAllCommentForSpecifeldPost(sortBy, sortDirection, pageSize, pageNumber, post.id);
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('searchNameTerm')),
    __param(1, (0, common_1.Query)('sortBy')),
    __param(2, (0, common_1.Query)('sortDirection')),
    __param(3, (0, common_1.Query)('pageSize')),
    __param(4, (0, common_1.Query)('pageNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getAllPosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('title')),
    __param(1, (0, common_1.Body)('shortDescription')),
    __param(2, (0, common_1.Body)('content')),
    __param(3, (0, common_1.Body)('blogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "postPost", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('shortDescription')),
    __param(3, (0, common_1.Body)('content')),
    __param(4, (0, common_1.Body)('blogId')),
    __param(5, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "putPost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)(':postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)('sortBy')),
    __param(2, (0, common_1.Query)('sortDirection')),
    __param(3, (0, common_1.Query)('pageSize')),
    __param(4, (0, common_1.Query)('pageNumber')),
    __param(5, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getAllCommentForSpecifeldPost", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [post_service_1.PostService,
        comment_service_1.CommentService])
], PostController);
//# sourceMappingURL=post.controller.js.map