// import {TcommentView} from "../models/comments/comments-type";
// import {CommentsRepository} from "../repositories-db/comments-repository-db";
// import {ClassCommentDb} from "../classes/comments/comments-class";
// import {userModel} from "../db/db";
// import {TUserView} from "../models/users/users-type";
//
// export enum LikeStatus{
//     like= 'Like',
//     dislike = 'Dislike',
//     none = 'None'
// }
//
// export let comments: ClassCommentDb[] = []
// export class CommentsService {
//     constructor(protected commentsRepository: CommentsRepository
//     ) {
//     }
//
//     async getCommentById(id: string, userId: string | null): Promise<TcommentView | null> {
//         return this.commentsRepository.getCommentById(id, userId)
//     }
//
//     async makeLikeDislikesInDb(userId: string, commentId: string,
//                                likeStatus:LikeStatus, dateOfLikeDislike: Date): Promise<boolean> {
//         const oldLikeOrDislikeOfUser = await this.commentsRepository.findOldLikeOrDislike(commentId, userId)
//
//         if (oldLikeOrDislikeOfUser) {
//
//             if (oldLikeOrDislikeOfUser.likeStatus === "Like") {
//                 await this.commentsRepository.deleteNumberOfLikes(commentId)
//
//             } else if (oldLikeOrDislikeOfUser.likeStatus === "Dislike") {
//                 await this.commentsRepository.deleteNumberOfDislikes(commentId)
//
//             }
//             await this.commentsRepository.deleteOldLikeDislike(commentId, userId)
//         }
//
//         const userLikeStatus = likeStatus
//
//         const likeInfo = {
//             userId: userId,
//             likeStatus: likeStatus,
//             dateOfLikeDislike: dateOfLikeDislike
//         }
//
//         if (userLikeStatus === "Like") return this.commentsRepository.updateNumberOfLikes(commentId, likeInfo);
//
//         if (userLikeStatus === "Dislike")return this.commentsRepository.updateNumberOfDislikes(commentId, likeInfo);
//
//         return true;
//
//     }
//
//     async updateCommentByID(commentId: string, content: string): Promise<boolean> {
//         return await this.commentsRepository.updateCommentByID(commentId, content)
//     }
//
//     async deleteComment(commentId: string): Promise<boolean> {
//         return await this.commentsRepository.deleteComment(commentId)
//     }
//
//     async findCommentFor(id: string): Promise< any | null> {
//         return await this.commentsRepository.findCommentForDb(id)
//     }
// }
