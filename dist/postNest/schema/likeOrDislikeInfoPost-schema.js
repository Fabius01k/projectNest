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
exports.InformationOfLikeAndDislikePostSchema = exports.InformationOfLikeAndDislikePost = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let InformationOfLikeAndDislikePost = class InformationOfLikeAndDislikePost {
    constructor(postId, numberOfLikes, numberOfDislikes, likesInfo) {
        this.postId = postId;
        this.numberOfLikes = numberOfLikes;
        this.numberOfDislikes = numberOfDislikes;
        this.likesInfo = likesInfo;
    }
};
exports.InformationOfLikeAndDislikePost = InformationOfLikeAndDislikePost;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], InformationOfLikeAndDislikePost.prototype, "postId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], InformationOfLikeAndDislikePost.prototype, "numberOfLikes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], InformationOfLikeAndDislikePost.prototype, "numberOfDislikes", void 0);
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
], InformationOfLikeAndDislikePost.prototype, "likesInfo", void 0);
exports.InformationOfLikeAndDislikePost = InformationOfLikeAndDislikePost = __decorate([
    (0, mongoose_1.Schema)(),
    __metadata("design:paramtypes", [String, Number, Number, Array])
], InformationOfLikeAndDislikePost);
exports.InformationOfLikeAndDislikePostSchema = mongoose_1.SchemaFactory.createForClass(InformationOfLikeAndDislikePost);
//# sourceMappingURL=likeOrDislikeInfoPost-schema.js.map