// import { BlogsService } from '../../domain/blogs-service';
// import { Request, Response } from 'express';
// import { jwtService } from '../../application/jwt-service';
//
// export class BlogsController {
//   constructor(protected blogsService: BlogsService) {}
//   // async getAllBlogs(req: Request, res: Response) {
//   //     let searchNameTerm: string | null = req.query.searchNameTerm as any
//   //     if (!searchNameTerm) {
//   //         searchNameTerm = null
//   //     }
//   //
//   //     let sortBy: string = req.query.sortBy as any
//   //     if (!sortBy) {
//   //         sortBy = 'createdAt'
//   //     }
//   //
//   //     let sortDirection: 'asc' | 'desc' | undefined = req.query.sortDirection as 'asc' | 'desc' | undefined
//   //     if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
//   //         sortDirection = 'desc'
//   //     }
//   //
//   //     let pageSize: number = req.query.pageSize as any
//   //     const checkPagSize = +pageSize
//   //
//   //     if (!pageSize || !Number.isInteger(checkPagSize) || checkPagSize <= 0) {
//   //         pageSize = 10
//   //     }
//   //
//   //     let pageNumber: number = req.query.pageNumber as any
//   //     const checkPageNumber = +pageNumber
//   //
//   //     if (!pageNumber || !Number.isInteger(checkPageNumber) || checkPageNumber <= 0) {
//   //         pageNumber = 1
//   //     }
//   //
//   //     const blogs = await this.blogsService.findBlogs(sortBy, sortDirection, pageSize, pageNumber, searchNameTerm)
//   //     res.status(200).send(blogs)
//   // }
//   // async getBlogById(req: Request, res: Response) {
//   //   const blog = await this.blogsService.getBlogById(req.params.id);
//   //
//   //   if (blog) {
//   //     res.status(200).send(blog);
//   //   } else {
//   //     res.sendStatus(404);
//   //   }
//   // }
//   async getPostByBlogID(req: Request, res: Response) {
//     const authorizationHeader = req.headers.authorization;
//     let userId = null;
//     if (authorizationHeader) {
//       const [type, token] = authorizationHeader.split(' ');
//       if (type === 'Bearer' && token) {
//         const accessToken = token;
//         userId = await jwtService.getUserIdByToken(accessToken);
//       }
//     }
//     let sortBy: string = req.query.sortBy as any;
//     if (!sortBy) {
//       sortBy = 'createdAt';
//     }
//
//     let sortDirection: 'asc' | 'desc' | undefined = req.query.sortDirection as
//       | 'asc'
//       | 'desc'
//       | undefined;
//     if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
//       sortDirection = 'desc';
//     }
//
//     let pageSize: number = req.query.pageSize as any;
//     const checkPagSize = +pageSize;
//
//     if (!pageSize || !Number.isInteger(checkPagSize) || checkPagSize <= 0) {
//       pageSize = 10;
//     }
//
//     let pageNumber: number = req.query.pageNumber as any;
//     const checkPageNumber = +pageNumber;
//
//     if (
//       !pageNumber ||
//       !Number.isInteger(checkPageNumber) ||
//       checkPageNumber <= 0
//     ) {
//       pageNumber = 1;
//     }
//
//     const result = await this.blogsService.getBlogById(req.params.blogId);
//     if (!result) {
//       res.sendStatus(404);
//       return;
//     }
//
//     const blogs = await this.blogsService.findPostByBlogID(
//       sortBy,
//       sortDirection,
//       pageSize,
//       pageNumber,
//       result!.id,
//       userId,
//     );
//     res.status(200).send(blogs);
//   }
//   // async createBlog(req: Request, res: Response) {
//   //   const newBlog = await this.blogsService.createBlog(
//   //     req.body.name,
//   //     req.body.description,
//   //     req.body.websiteUrl,
//   //   );
//   //   res.status(201).send(newBlog);
//   // }
//   async createPostByIdBlog(req: Request, res: Response) {
//     const authorizationHeader = req.headers.authorization;
//     let userId = null;
//     if (authorizationHeader) {
//       const [type, token] = authorizationHeader.split(' ');
//       if (type === 'Bearer' && token) {
//         const accessToken = token;
//         userId = await jwtService.getUserIdByToken(accessToken);
//       }
//     }
//
//     const newPost = await this.blogsService.createPostByBlogID(
//       req.body.title,
//       req.body.shortDescription,
//       req.body.content,
//       req.params.blogId,
//       userId,
//     );
//     if (newPost) {
//       res.status(201).send(newPost);
//     } else {
//       res.sendStatus(404);
//     }
//   }
//   async updateBlog(req: Request, res: Response) {
//     const blog = await this.blogsService.updateBlog(
//       req.params.id,
//       req.body.name,
//       req.body.description,
//       req.body.websiteUrl,
//     );
//
//     if (blog) {
//       res.sendStatus(204);
//     } else {
//       res.sendStatus(404);
//     }
//   }
//   async deleteBlog(req: Request, res: Response) {
//     const newBlogs = await this.blogsService.deleteBlog(req.params.id);
//     if (newBlogs) {
//       res.sendStatus(204);
//     } else {
//       res.sendStatus(404);
//     }
//   }
// }
