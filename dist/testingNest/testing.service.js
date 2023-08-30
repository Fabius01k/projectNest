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
exports.TestingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const blog_schema_1 = require("../blogNest/schema/blog-schema");
const post_schema_1 = require("../postNest/schema/post-schema");
const likeOrDislikeInfoPost_schema_1 = require("../postNest/schema/likeOrDislikeInfoPost-schema");
const comment_schema_1 = require("../commentNest/schema/comment.schema");
const likeOrDislikeInfoComment_schema_1 = require("../commentNest/schema/likeOrDislikeInfoComment.schema");
const user_schema_1 = require("../userNest/schema/user.schema");
let TestingService = class TestingService {
    constructor(blogModel, postModel, PInfoModel, commentModel, CInfoModel, userModel) {
        this.blogModel = blogModel;
        this.postModel = postModel;
        this.PInfoModel = PInfoModel;
        this.commentModel = commentModel;
        this.CInfoModel = CInfoModel;
        this.userModel = userModel;
    }
    async deleteAllData() {
        await this.blogModel.deleteMany({});
        await this.postModel.deleteMany({});
        await this.PInfoModel.deleteMany({});
        await this.commentModel.deleteMany({});
        await this.CInfoModel.deleteMany({});
        await this.userModel.deleteMany({});
    }
};
exports.TestingService = TestingService;
exports.TestingService = TestingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_schema_1.Blog.name)),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(2, (0, mongoose_1.InjectModel)(likeOrDislikeInfoPost_schema_1.InformationOfLikeAndDislikePost.name)),
    __param(3, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(4, (0, mongoose_1.InjectModel)(likeOrDislikeInfoComment_schema_1.InformationOfLikeAndDislikeComment.name)),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TestingService);
//# sourceMappingURL=testing.service.js.map