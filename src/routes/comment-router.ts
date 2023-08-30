// import {Request, Response, Router} from "express";
// import {CommentsService} from "../domain/comments-service";
// import {commentUpdateValidation, LikeInfoStatusValidator} from "../validadation/comments-valodation";
// import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
// import {authMiddleware} from "../middlewares/auth-middleware";
// import {commentsController} from "../composition-root";
//
// export const commentRouter = Router({})
//
// commentRouter.get('/:id',commentsController.getCoomentById.bind(commentsController))
//
// commentRouter.put('/:commentId/like-status',authMiddleware,LikeInfoStatusValidator,
//     inputValidationMiddleware,commentsController.makeLikeDislikes.bind(commentsController))
//
// commentRouter.put('/:commentId',authMiddleware,
//     commentUpdateValidation,inputValidationMiddleware,
//     commentsController.updateComment.bind(commentsController))
//
// commentRouter.delete('/:commentId',authMiddleware,
//     commentsController.deleteComment.bind(commentsController))