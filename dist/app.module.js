"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const blog_schema_1 = require("./blogNest/schema/blog-schema");
const post_schema_1 = require("./postNest/schema/post-schema");
const likeOrDislikeInfoPost_schema_1 = require("./postNest/schema/likeOrDislikeInfoPost-schema");
const comment_schema_1 = require("./commentNest/schema/comment.schema");
const likeOrDislikeInfoComment_schema_1 = require("./commentNest/schema/likeOrDislikeInfoComment.schema");
const user_schema_1 = require("./userNest/schema/user.schema");
const post_controller_1 = require("./postNest/controler/post.controller");
const comment_controller_1 = require("./commentNest/controller/comment.controller");
const user_controller_1 = require("./userNest/controller/user.controller");
const post_service_1 = require("./postNest/service/post.service");
const post_repository_1 = require("./postNest/repository/post.repository");
const comment_service_1 = require("./commentNest/service/comment.service");
const comment_repository_1 = require("./commentNest/repository/comment.repository");
const user_service_1 = require("./userNest/service/user.service");
const user_repository_1 = require("./userNest/repository/user.repository");
const blog_service_1 = require("./blogNest/service/blog.service");
const blog_controller_1 = require("./blogNest/controler/blog.controller");
const blog_repository_1 = require("./blogNest/repository/blog.repository");
const testing_controller_1 = require("./testingNest/testing.controller");
const testing_service_1 = require("./testingNest/testing.service");
const settings_1 = require("./application/settings");
const dbName = 'myApi';
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(settings_1.settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: blog_schema_1.Blog.name,
                    schema: blog_schema_1.BlogSchema,
                },
                {
                    name: post_schema_1.Post.name,
                    schema: post_schema_1.PostSchema,
                },
                {
                    name: likeOrDislikeInfoPost_schema_1.InformationOfLikeAndDislikePost.name,
                    schema: likeOrDislikeInfoPost_schema_1.InformationOfLikeAndDislikePostSchema,
                },
                {
                    name: comment_schema_1.Comment.name,
                    schema: comment_schema_1.CommentSchema,
                },
                {
                    name: likeOrDislikeInfoComment_schema_1.InformationOfLikeAndDislikeComment.name,
                    schema: likeOrDislikeInfoComment_schema_1.InformationOfLikeAndDislikeCommentSchema,
                },
                {
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema,
                },
            ]),
        ],
        controllers: [
            app_controller_1.AppController,
            blog_controller_1.BlogController,
            post_controller_1.PostController,
            comment_controller_1.CommentController,
            user_controller_1.UserController,
            testing_controller_1.TestingController,
        ],
        providers: [
            app_service_1.AppService,
            blog_service_1.BlogService,
            blog_repository_1.BlogRepository,
            post_service_1.PostService,
            post_repository_1.PostRepository,
            comment_service_1.CommentService,
            comment_repository_1.CommentRepository,
            user_service_1.UserService,
            user_repository_1.UserRepository,
            testing_service_1.TestingService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map