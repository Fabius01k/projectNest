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
exports.InformationOfLikeAndDislikeCommentSchema = exports.InformationOfLikeAndDislikeComment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let InformationOfLikeAndDislikeComment = class InformationOfLikeAndDislikeComment {
    constructor(commentId, numberOfLikes, numberOfDislikes, likesInfo) {
        this.commentId = commentId;
        this.numberOfLikes = numberOfLikes;
        this.numberOfDislikes = numberOfDislikes;
        this.likesInfo = likesInfo;
    }
};
exports.InformationOfLikeAndDislikeComment = InformationOfLikeAndDislikeComment;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], InformationOfLikeAndDislikeComment.prototype, "commentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], InformationOfLikeAndDislikeComment.prototype, "numberOfLikes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], InformationOfLikeAndDislikeComment.prototype, "numberOfDislikes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                userId: String,
                login: String,
                likeStatus: String,
                dateOfLikeDislike: Date,
            },
        ],
        default: null,
    }),
    __metadata("design:type", Array)
], InformationOfLikeAndDislikeComment.prototype, "likesInfo", void 0);
exports.InformationOfLikeAndDislikeComment = InformationOfLikeAndDislikeComment = __decorate([
    (0, mongoose_1.Schema)(),
    __metadata("design:paramtypes", [String, Number, Number, Array])
], InformationOfLikeAndDislikeComment);
exports.InformationOfLikeAndDislikeCommentSchema = mongoose_1.SchemaFactory.createForClass(InformationOfLikeAndDislikeComment);
//# sourceMappingURL=likeOrDislikeInfoComment.schema.js.map