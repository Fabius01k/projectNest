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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const blog_service_1 = require("../service/blog.service");
const post_service_1 = require("../../postNest/service/post.service");
let BlogController = class BlogController {
    constructor(blogService, postService) {
        this.blogService = blogService;
        this.postService = postService;
    }
    async getAllBlogs(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber) {
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
        return await this.blogService.getAllBlogs(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber);
    }
    async getBlogById(id, res) {
        const blog = await this.blogService.getBlogById(id);
        if (blog) {
            return blog;
        }
        else {
            res.sendStatus(404);
            return null;
        }
    }
    async postBlog(name, description, websiteUrl) {
        return await this.blogService.postBlog(name, description, websiteUrl);
    }
    async putBlog(id, name, description, websiteUrl, res) {
        const updatedBlog = await this.blogService.putBlog(id, name, description, websiteUrl);
        if (!updatedBlog) {
            res.sendStatus(404);
            return false;
        }
        else {
            res.sendStatus(204);
            return true;
        }
    }
    async deleteBlog(id, res) {
        const blogDeleted = await this.blogService.deleteBlog(id);
        if (!blogDeleted) {
            res.sendStatus(404);
            return false;
        }
        else {
            res.sendStatus(204);
            return true;
        }
    }
    async getAllPostsForSpecifeldBlog(blogId, sortBy, sortDirection, pageSize, pageNumber, res) {
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
        const blog = await this.blogService.getBlogById(blogId);
        if (!blog) {
            res.sendStatus(404);
            return null;
        }
        return await this.postService.getAllPostsForSpecifeldBlog(sortBy, sortDirection, pageSize, pageNumber, blog.id);
    }
    async postPostForSpecifeldBlog(blogId, title, shortDescription, content, res) {
        const post = await this.postService.postPostForSpecifeldBlog(title, shortDescription, content, blogId);
        if (!post) {
            res.sendStatus(404);
            return null;
        }
        return post;
    }
};
exports.BlogController = BlogController;
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
], BlogController.prototype, "getAllBlogs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('name')),
    __param(1, (0, common_1.Body)('description')),
    __param(2, (0, common_1.Body)('websiteUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "postBlog", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('websiteUrl')),
    __param(4, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "putBlog", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "deleteBlog", null);
__decorate([
    (0, common_1.Get)(':blogId/posts'),
    __param(0, (0, common_1.Param)('blogId')),
    __param(1, (0, common_1.Query)('sortBy')),
    __param(2, (0, common_1.Query)('sortDirection')),
    __param(3, (0, common_1.Query)('pageSize')),
    __param(4, (0, common_1.Query)('pageNumber')),
    __param(5, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getAllPostsForSpecifeldBlog", null);
__decorate([
    (0, common_1.Post)(':blogId/posts'),
    __param(0, (0, common_1.Param)('blogId')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('shortDescription')),
    __param(3, (0, common_1.Body)('content')),
    __param(4, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "postPostForSpecifeldBlog", null);
exports.BlogController = BlogController = __decorate([
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blog_service_1.BlogService,
        post_service_1.PostService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map