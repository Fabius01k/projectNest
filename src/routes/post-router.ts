// import {Request, Response, Router} from "express";
// import {postCreateValidators, postUpdateValodators} from "../validadation/post-validation";
// import {basicAuthGuardMiddleware} from "../validadation/authorization-validatoin";
// import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
// import {authMiddleware} from "../middlewares/auth-middleware";
// import {commentCreateByPostValidation, LikeInfoStatusValidator} from "../validadation/comments-valodation";
// import {postsController, postsService} from "../composition-root";
//
//
// export const postsRouter = Router({})
//
// postsRouter.get('/', postsController.getAllPosts.bind(postsController))
//
// postsRouter.get('/:postId/comments', postsController.getCommentByPostID.bind(postsController))
//
// postsRouter.get('/:id', postsController.getPostById.bind(postsController))
//
// postsRouter.post('/', basicAuthGuardMiddleware, postCreateValidators, inputValidationMiddleware,
//     postsController.createPost.bind(postsController))
//
// postsRouter.post('/:postId/comments', authMiddleware, commentCreateByPostValidation,
//     inputValidationMiddleware,
//     postsController.createCommentByIdPost.bind(postsController))
//
// postsRouter.put('/:postId/like-status',authMiddleware,LikeInfoStatusValidator,
//     inputValidationMiddleware,postsController.makeLikeOrDislikes.bind(postsController))
//
// postsRouter.put('/:id', basicAuthGuardMiddleware, postUpdateValodators, inputValidationMiddleware,
//     postsController.updatePost.bind(postsController))
//
// postsRouter.delete('/:id', basicAuthGuardMiddleware,
//     postsController.deletePost.bind(postsController))





