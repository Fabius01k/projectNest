// import mongoose, {Schema} from "mongoose";
// import {ObjectId, WithId} from "mongodb";
//
// import {ClassCommentDb, ClassCommentsLikesInfoDb} from "../../classes/comments/comments-class";
//
//
// export const commentSchema = new mongoose.Schema<WithId<ClassCommentDb>>({
//     _id: { type: ObjectId, require: true},
//     id: { type: String, require: true },
//     content: { type: String, require: true },
//     commentatorInfo: {
//         userId: { type: String, require: true },
//         userLogin: { type: String, require: true },
//     },
//     createdAt: { type: String, require: true },
//     postId: { type: String, require: true },
// })
//
// export const commentsLikesInfoSchema = new mongoose.Schema<WithId<ClassCommentsLikesInfoDb>>({
//     infoId: { type: String, require: true },
//     likesInfo:
//         { type: [
//             new Schema({userId: String,
//             likeStatus: String, dateOfLikeDislike: Date})
//             ], default: null },
//     numberOfLikes: { type: Number, default: 0 },
//     numberOfDislikes: { type: Number, default: 0 }
//     })
