// import {Request, Response, Router} from "express";
// import {blogCreateValidators, blogUpdateValidators} from "../validadation/blog-validation";
// import {basicAuthGuardMiddleware} from "../validadation/authorization-validatoin";
// import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
// import {postCreateByBlogValidator} from "../validadation/post-validation";
// import {blogsController} from "../composition-root";
//
// export const blogsRouter = Router({})
//
// blogsRouter.get('/', blogsController.getAllBlogs.bind(blogsController))
//
// blogsRouter.get('/:blogId/posts', blogsController.getPostByBlogID.bind(blogsController))
//
// blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))
//
// blogsRouter.post('/', basicAuthGuardMiddleware, blogCreateValidators, inputValidationMiddleware,
//     blogsController.createBlog.bind(blogsController))
//
// blogsRouter.post('/:blogId/posts', basicAuthGuardMiddleware, postCreateByBlogValidator,
//     inputValidationMiddleware,
//     blogsController.createPostByIdBlog.bind(blogsController))
//
// blogsRouter.put('/:id', basicAuthGuardMiddleware, blogUpdateValidators, inputValidationMiddleware,
//     blogsController.updateBlog.bind(blogsController))
//
// blogsRouter.delete('/:id', basicAuthGuardMiddleware,
//     blogsController.deleteBlog.bind(blogsController))























