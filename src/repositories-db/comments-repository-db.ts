// import {TcommentView} from "../models/comments/comments-type";
// import {commentsLikesInfoModel, commentsModel, userModel} from "../db/db";
// import {
//     ClassCommentDb,
//     ClassCommentsLikesInfoDb,
//     CommentsLikesInfo
// } from "../classes/comments/comments-class";
//
// export let comments: ClassCommentDb[] = []
// const mapCommentFromDbToView = async (comment: ClassCommentDb, userId: string | null): Promise<TcommentView> => {
//
//     const CommentsLikesInfo = await commentsLikesInfoModel.findOne({infoId: comment.id})
//     const userStatus = CommentsLikesInfo?.likesInfo ? CommentsLikesInfo?.likesInfo.find((info) => info.userId === userId) : {likeStatus:'None'};
//     const myStatus = userStatus ? userStatus.likeStatus : "None"//if(userStatus){return userStatus.likeStatus} else {return 'None'}
//     return {
//         id: comment.id,
//         content: comment.content,
//         commentatorInfo: {
//             userId: comment.commentatorInfo.userId,
//             userLogin: comment.commentatorInfo.userLogin
//         },
//         createdAt: comment.createdAt,
//         likesInfo: {
//             likesCount: CommentsLikesInfo ? CommentsLikesInfo.numberOfLikes : 0,
//             dislikesCount: CommentsLikesInfo ? CommentsLikesInfo.numberOfDislikes : 0,
//             myStatus: myStatus
//         }
//     }
// }
//
// export class CommentsRepository {
//     async getCommentById(id: string,userId: string | null): Promise<TcommentView | null> {
//         const comment: ClassCommentDb | null = await commentsModel.findOne({id: id})
//         if (!comment) return null
//
//         return mapCommentFromDbToView(comment,userId)
//     }
//
//     async createCommentByPostId(newComment: ClassCommentDb): Promise<TcommentView | null> {
//
//         await commentsModel.insertMany([newComment])
//
//         return mapCommentFromDbToView(newComment, newComment.commentatorInfo.userId)
//     }
//
//     async createCollectionOfCommentsLikesInf(newCollectionCommentsLikesInfo: ClassCommentsLikesInfoDb):
//         Promise<ClassCommentsLikesInfoDb> {
//         let result = await commentsLikesInfoModel
//             .insertMany([newCollectionCommentsLikesInfo])
//         return newCollectionCommentsLikesInfo
//     }
//
//     async findCommentByPostID(sortBy: string, sortDirection: 'asc' | 'desc',
//                               pageSize: number, pageNumber: number, postId: string,
//                               userId: string | null) {
//
//         const comment: ClassCommentDb[] = await commentsModel
//             .find({postId: postId})
//             .sort({ [sortBy]: sortDirection })
//             .skip((pageNumber - 1) * pageSize)
//             .limit(+pageSize)
//             .lean()
//
//         const items = await Promise.all(comment.map( c => mapCommentFromDbToView(c,userId)))
//         const totalCount = await commentsModel.countDocuments({postId: postId})
//
//         return {
//             pagesCount: Math.ceil(totalCount / pageSize),
//             page: +pageNumber,
//             pageSize: +pageSize,
//             totalCount: totalCount,
//             items: items
//         }
//     }
//
//     async updateCommentByID(commentId: string, content: string): Promise<boolean> {
//         const updateCommentByID = await commentsModel
//             .updateOne({id: commentId}, {
//                 $set: {
//                     content: content
//                 },
//             })
//
//         const comment = updateCommentByID.matchedCount === 1
//         return comment
//     }
//
//     async deleteComment(commentId: string): Promise<boolean> {
//         const deleteComment = await commentsModel
//             .deleteOne({id: commentId})
//
//         return deleteComment.deletedCount === 1
//     }
//
//     async findOldLikeOrDislike(infoId: string,userId: string) {
//         const result = await commentsLikesInfoModel.findOne({ infoId ,"likesInfo.userId": userId});
//         if (result?.likesInfo) {
//             const likeInfo = result.likesInfo.find(info => info.userId === userId);
//             return likeInfo
//         }
//         return null
//     }
//
//     async deleteOldLikeDislike(infoId: string, userId: string) {
//         const result = await commentsLikesInfoModel.updateOne(
//             {infoId, "likesInfo.userId": userId},
//             {$pull: {likesInfo: {userId: userId}}})
//         return result
//     }
//
//     async makeLikeOrDislike(userId: string, commentId: string, likeStatus: string, dateOfLikeDislike: Date): Promise<boolean> {
//
//         const likeInfo = {
//             userId: userId,
//             likeStatus: likeStatus,
//             dateOfLikeDislike: dateOfLikeDislike
//         }
//         const infoId = commentId
//         let result = await commentsLikesInfoModel
//             .updateOne({infoId},{ $push: { likesInfo: likeInfo }})
//
//         return result.modifiedCount === 1
//     }
//
//     async findCommentForDb(id: string) {
//         const comment = await commentsModel.findOne({id: id})
//         return comment
//     }
//     async deleteNumberOfLikes(infoId: string): Promise<void> {
//         await commentsLikesInfoModel.updateOne(
//             { infoId },
//             { $inc: { numberOfLikes: -1 } }
//         );
//         return;
//     }
//     async deleteNumberOfDislikes(infoId: string): Promise<void> {
//         await commentsLikesInfoModel.updateOne(
//             { infoId },
//             { $inc: { numberOfDislikes: -1 } }
//         );
//         return;
//     }
//     async updateNumberOfLikes(infoId: string, likeInfo: CommentsLikesInfo): Promise<boolean> {
//         const result = await commentsLikesInfoModel.updateOne(
//             { infoId },
//             { $inc: { numberOfLikes: 1 },
//                      $push: { likesInfo: likeInfo }}
//         );
//         return result.modifiedCount > 0;
//     }
//     async updateNumberOfDislikes(infoId: string, likeInfo: CommentsLikesInfo): Promise<boolean> {
//         const result = await commentsLikesInfoModel.updateOne(
//             { infoId },
//             { $inc: { numberOfDislikes: 1 },
//                      $push: { likesInfo: likeInfo } }
//         );
//         return result.modifiedCount > 0;
//     }
//
// }
