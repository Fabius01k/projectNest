// import dotenv from 'dotenv'
// import mongoose from 'mongoose';
// import {videosSchema} from "../schemes/videos/videos-schema";
// import {blogsSchema} from "../schemes/blogs/blogs-schema";
// import {postsLikesInfoSchema, postsSchema} from "../schemes/posts/posts-schema";
// import {commentSchema, commentsLikesInfoSchema} from "../schemes/comments/comments-schema";
// import {usersSchema} from "../schemes/users/users-schema";
// import {sessionsSchema} from "../schemes/sessions/sessions-schema";
// import {accessingToAppSchema} from "../schemes/accessingToApp/accessingtoapp_schema";
// import {ClassVideoDb} from "../classes/videos/videos-class";
// import {ClassBlogDb} from "../classes/blogs/blogs-class";
// import {ClassPostDb, ClassPostsLikesInfoDb} from "../classes/posts/posts-class";
// import {ClassCommentDb, ClassCommentsLikesInfoDb} from "../classes/comments/comments-class";
// import {ClassNewDocumentToAppFromUser, ClassUserAccountDb, ClassUsersSessionDb} from "../classes/users/users-class";
//
// dotenv.config()
//
//
// const dbName = "myApi"
// const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`
//
// export const videosModel = mongoose.model<ClassVideoDb>("videos", videosSchema)
// export const blogsModel = mongoose.model<ClassBlogDb>("blogs", blogsSchema)
// export const postsModel = mongoose.model<ClassPostDb>("posts",postsSchema)
// export const commentsModel = mongoose.model<ClassCommentDb>("comments",commentSchema)
// export const userModel = mongoose.model<ClassUserAccountDb>("user", usersSchema)
// export const sessionsModel = mongoose.model<ClassUsersSessionDb>("sessions",sessionsSchema)
// export const accessingToAppModel =
//     mongoose.model<ClassNewDocumentToAppFromUser>("accessingToApp",accessingToAppSchema)
// export const commentsLikesInfoModel =
//     mongoose.model<ClassCommentsLikesInfoDb>("commentsLikeInfo",commentsLikesInfoSchema)
// export const postsLikesInfoModel =
//     mongoose.model<ClassPostsLikesInfoDb>("postsLikeInfo",postsLikesInfoSchema)
//
//
//
// export const collections = [videosModel,blogsModel,
//     postsModel,commentsModel,userModel,
//     sessionsModel,accessingToAppModel,
//     commentsLikesInfoModel,postsLikesInfoModel
// ]
//
// export async function runDb() {
//     try {
//         await mongoose.connect(mongoURI, {dbName: "myApi"})
//         console.log('Connected successfully to mongoose server')
//     } catch (e) {
//         console.log('Can`t connect to db')
//         await mongoose.disconnect()
//     }
// }
