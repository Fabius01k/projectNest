// import mongoose, {Schema} from "mongoose";
// import {ObjectId, WithId} from "mongodb";
// import {ClassPostDb, ClassPostsLikesInfoDb} from "../../classes/posts/posts-class";
//
//
// export const postsSchema = new mongoose.Schema<WithId<ClassPostDb>>({
//     _id: { type: ObjectId, require: true},
//     id: { type: String, require: true },
//     title: { type: String, require: true},
//     shortDescription: { type: String, require: true},
//     content: { type: String, require: true},
//     blogId: { type:String, require: true},
//     blogName: { type: String, require: true},
//     createdAt: { type: String, require: true}
// })
//
// export const postsLikesInfoSchema = new mongoose.Schema<WithId<ClassPostsLikesInfoDb>>({
//     infoId: { type: String, require: true },
//     likesInfo:
//         { type: [
//                 new Schema({userId: String,login: String,
//                     likeStatus: String, dateOfLikeDislike: Date})
//             ], default: null },
//     numberOfLikes: { type: Number, default: 0 },
//     numberOfDislikes: { type: Number, default: 0 }
// })
