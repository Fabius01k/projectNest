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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const blog_schema_1 = require("../schema/blog-schema");
const blog_repository_1 = require("../repository/blog.repository");
const mongodb_1 = require("mongodb");
let BlogService = class BlogService {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }
    async getAllBlogs(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber) {
        return await this.blogRepository.findAllBlogsInDb(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber);
    }
    async getBlogById(id) {
        return await this.blogRepository.findBlogByIdInDb(id);
    }
    async postBlog(name, description, websiteUrl) {
        const dateNow = new Date().getTime().toString();
        const newBlog = new blog_schema_1.Blog(new mongodb_1.ObjectId(), dateNow, name, description, websiteUrl, new Date().toISOString(), false);
        return await this.blogRepository.createBlogInDb(newBlog);
    }
    async putBlog(id, name, description, websiteUrl) {
        const updatedBlog = await this.blogRepository.updateBlogInDb(id, name, description, websiteUrl);
        if (!updatedBlog) {
            return false;
        }
        return true;
    }
    async deleteBlog(id) {
        const blogDeleted = await this.blogRepository.deleteBlogInDb(id);
        if (!blogDeleted) {
            return false;
        }
        return true;
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blog_repository_1.BlogRepository])
], BlogService);
//# sourceMappingURL=blog.service.js.map