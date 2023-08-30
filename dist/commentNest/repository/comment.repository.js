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
exports.CommentRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const comment_schema_1 = require("../schema/comment.schema");
const mongoose_2 = require("mongoose");
const likeOrDislikeInfoComment_schema_1 = require("../schema/likeOrDislikeInfoComment.schema");
const common_1 = require("@nestjs/common");
let CommentRepository = class CommentRepository {
    constructor(commentModel, infoModelC) {
        this.commentModel = commentModel;
        this.infoModelC = infoModelC;
        this.mapCommentToView = async (comment, userId) => {
            const CommentsLikesInfo = await this.infoModelC.findOne({
                commentId: comment.id,
            });
            const userStatus = CommentsLikesInfo?.likesInfo
                ? CommentsLikesInfo?.likesInfo.find((info) => info.userId === userId)
                : { likeStatus: 'None' };
            const myStatus = userStatus ? userStatus.likeStatus : 'None';
            return {
                id: comment.id,
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin,
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: CommentsLikesInfo ? CommentsLikesInfo.numberOfLikes : 0,
                    dislikesCount: CommentsLikesInfo
                        ? CommentsLikesInfo.numberOfDislikes
                        : 0,
                    myStatus: myStatus,
                },
            };
        };
    }
    async findCommentByIdInDb(id) {
        const comment = await this.commentModel.findOne({ id: id });
        if (!comment)
            return null;
        const userId = null;
        return this.mapCommentToView(comment, userId);
    }
    async findAllCommentsForSpecifeldPostInDb(sortBy, sortDirection, pageSize, pageNumber, postId) {
        const comments = await this.commentModel
            .find({ postId: postId })
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
        const userId = null;
        const items = await Promise.all(comments.map((c) => this.mapCommentToView(c, userId)));
        const totalCount = await this.commentModel.countDocuments({
            postId: postId,
        });
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items,
        };
    }
};
exports.CommentRepository = CommentRepository;
exports.CommentRepository = CommentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(1, (0, mongoose_1.InjectModel)(likeOrDislikeInfoComment_schema_1.InformationOfLikeAndDislikeComment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CommentRepository);
//# sourceMappingURL=comment.repository.js.map