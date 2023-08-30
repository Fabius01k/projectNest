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
exports.BlogRepository = void 0;
const common_1 = require("@nestjs/common");
const blog_schema_1 = require("../schema/blog-schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mapBlogToDto = (blog) => {
    return {
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    };
};
let BlogRepository = class BlogRepository {
    constructor(blogModel) {
        this.blogModel = blogModel;
    }
    async findAllBlogsInDb(searchNameTerm, sortBy, sortDirection, pageSize, pageNumber) {
        const filter = searchNameTerm
            ? { name: new RegExp(searchNameTerm, 'gi') }
            : {};
        const blogs = await this.blogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
        const items = blogs.map((blog) => mapBlogToDto(blog));
        const totalCount = await this.blogModel.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items,
        };
    }
    async findBlogByIdInDb(id) {
        const blog = await this.blogModel.findOne({ id: id });
        if (!blog)
            return null;
        return mapBlogToDto(blog);
    }
    async createBlogInDb(newBlog) {
        const createdBlog = new this.blogModel(newBlog);
        await createdBlog.save();
        return mapBlogToDto(newBlog);
    }
    async updateBlogInDb(id, name, description, websiteUrl) {
        const updateBlog = await this.blogModel.updateOne({ id: id }, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl,
            },
        });
        const blog = updateBlog.matchedCount === 1;
        return blog;
    }
    async deleteBlogInDb(id) {
        const deleteDBlog = await this.blogModel.deleteOne({ id: id });
        return deleteDBlog.deletedCount === 1;
    }
};
exports.BlogRepository = BlogRepository;
exports.BlogRepository = BlogRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_schema_1.Blog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogRepository);
//# sourceMappingURL=blog.repository.js.map