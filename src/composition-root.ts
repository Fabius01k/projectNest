// import {VideosRepository} from "./repositories-db/videos-repositories-db";
// import {VideosService} from "./domain/videos-servise";
// import {BlogsRepository} from "./repositories-db/blogs-repository-db";
// import {BlogsService} from "./domain/blogs-service";
// import {PostsRepostory} from "./repositories-db/post-repostory-db";
// import {PostsService} from "./domain/posts-servise";
// import {CommentsRepository} from "./repositories-db/comments-repository-db";
// import {CommentsService} from "./domain/comments-service";
// import {UsersRepository} from "./repositories-db/users-repository-db";
// import {UsersService} from "./domain/users-service";
// import {SecurityRepository} from "./repositories-db/security-repository-db";
// import {SecurityService} from "./domain/security-service";
// import {AuthService} from "./domain/auth-service";
// import {EmailManager} from "./managers/email-manager";
// import {BlogsController} from "./controllers/blogs/blog-controller";
// import {VideosController} from "./controllers/videos/videos-controller";
// import {AuthController} from "./controllers/auth/auth-controller";
// import {CommentsController} from "./controllers/comments/comments-controller";
// import {EmailController} from "./controllers/email/email-controller";
// import {PostsController} from "./controllers/posts/posts-controller";
// import {SecurityController} from "./controllers/security/security-controller";
// import {UsersController} from "./controllers/users/users-controller";
//
//
//
// export const videosRepository = new VideosRepository()
// export const blogsRepository = new BlogsRepository()
// export const postsRepository = new PostsRepostory()
// export const commentsRepository = new CommentsRepository()
// export const usersRepository = new UsersRepository()
// export const securityRepository = new SecurityRepository()
//
// export const emailManager = new EmailManager(usersRepository)
//
// export const videosService = new VideosService(videosRepository)
// export const blogsService = new BlogsService(blogsRepository,postsRepository)
// export const postsService = new PostsService(postsRepository,commentsRepository)
// export const commentsService = new CommentsService(commentsRepository)
// export const usersService = new UsersService(usersRepository)
// export const authService = new AuthService(usersRepository,emailManager)
// export const securityService = new SecurityService(securityRepository)
//
//
//
//
// export const videosController = new VideosController(videosService)
// export const blogsController = new BlogsController(blogsService)
// export const postsController = new PostsController(postsService,usersService)
// export const commentsController = new CommentsController(commentsService)
// export const usersController = new UsersController(usersService)
// export const authController = new AuthController(usersService,authService)
// export const securityController = new SecurityController(securityService)
// export const emailController = new EmailController()
