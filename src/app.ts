// import express, {Request, Response} from "express";
// import {videosRouter} from "./routes/videos-router";
// import {blogsRouter} from "./routes/blogs-router";
// import {postsRouter} from "./routes/post-router";
// import {usersRouter} from "./routes/users-router";
// import {authRouter} from "./routes/auth-router";
// import {commentRouter} from "./routes/comment-router";
// import {emailRouter} from "./routes/email-router";
// import cookieParser from "cookie-parser";
// import {securityRouter} from "./routes/security-router";
// import {collections} from "./db/db";
//
//
// const app = express()
// app.use(cookieParser())
// app.use(express.json())
//
//
// app.use('/videos', videosRouter)
// app.use('/blogs', blogsRouter)
// app.use('/posts', postsRouter)
// app.use('/users', usersRouter)
// app.use('/auth',authRouter)
// app.use('/comments',commentRouter)
// app.use('/email',emailRouter)
// app.use('/security',securityRouter)
//
// app.delete('/testing/all-data', async (req: Request, res: Response) => {
//     const promises = collections.map(async (model: any) => {
//         await model.deleteMany({})
//     });
//
//     await Promise.all(promises);
//     res.sendStatus(204);
// });
//
//
//
//
// // app.delete('/testing/all-data', async(req: Request, res: Response) => {
// //     const promises = collections.map(c => c.deleteMany())
// //     await Promise.all(promises)
// //     res.sendStatus(204)
// // })
//
// export default app
