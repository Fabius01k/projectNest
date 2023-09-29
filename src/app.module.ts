import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogNest/schema/blog-schema';
import { Post, PostSchema } from './postNest/schema/post-schema';
import {
  InformationOfLikeAndDislikePost,
  InformationOfLikeAndDislikePostSchema,
} from './postNest/schema/likeOrDislikeInfoPost-schema';
import { Comment, CommentSchema } from './commentNest/schema/comment.schema';
import {
  InformationOfLikeAndDislikeComment,
  InformationOfLikeAndDislikeCommentSchema,
} from './commentNest/schema/likeOrDislikeInfoComment.schema';
import { User, UserSchema } from './userNest/schema/user.schema';
import { PostController } from './postNest/controler/post.controller';
import { CommentController } from './commentNest/controller/comment.controller';
import { UserController } from './userNest/controller/user.controller';
import { PostService } from './postNest/service/post.service';
import { PostRepository } from './postNest/repository/post.repository';
import { CommentService } from './commentNest/service/comment.service';
import { CommentRepository } from './commentNest/repository/comment.repository';
import { UserService } from './userNest/service/user.service';
import { UserRepository } from './userNest/repository/user.repository';
import { BlogService } from './blogNest/service/blog.service';
import { BlogController } from './blogNest/controler/blog.controller';
import { BlogRepository } from './blogNest/repository/blog.repository';
import { TestingController } from './testingNest/testing.controller';
import { TestingService } from './testingNest/testing.service';
import { jwtConstants, settings } from './application/settings';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './authNest/service/auth.service';

import { JwtAccessStrategyStrategy } from './authNest/strategies/jwt-access.strategy';
import {
  UserSession,
  UserSessionSchema,
} from './userNest/schema/user-session.schema';
import { EmailManager } from './managers/email-manager';

import { BasicAuthGuard } from './authNest/guards/basic-auth.guard';
import { RefreshTokenGuard } from './authNest/guards/refresh-token.guard';
import { AuthController } from './authNest/controller/auth.controller';
import { AuthGuard, GetToken } from './authNest/guards/bearer.guard';
import { BlogNotFoundValidation } from './inputmodels-validation/inputModel.custom-decoration';
import { SecurityController } from './securityNest/controler/security.controller';
import { SecurityService } from './securityNest/service/security.service';
import { SecurityRepository } from './securityNest/repository/security.repository';
import { ThrottlerModule } from '@nestjs/throttler';
import { GetAllBlogsUseCase } from './blogNest/blog.use-cases/getAllBlogs.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { GetBlogByIdUseCase } from './blogNest/blog.use-cases/getBlogById.use-case';
import { CreateBlogUseCase } from './blogNest/blog.use-cases/createBlog.use-case';
import { UpdateBlogUseCase } from './blogNest/blog.use-cases/updateBlog.use-case';
import { DeleteBlogUseCase } from './blogNest/blog.use-cases/deleteBlog.use-case';
import { GetAllPostsUseCase } from './postNest/post.use-cases/getAllPosts.use-case';
import { GetPostByIdUseCase } from './postNest/post.use-cases/getPotsById.use-case';
import { GetAllPostsForSpecificBlogUseCase } from './postNest/post.use-cases/getAllPostForSpecificBlog.use-case';
import { CreatePostForSpecificBlogUseCase } from './postNest/post.use-cases/createPostForSpecificBlog.use-case';
import { CreatePostUseCase } from './postNest/post.use-cases/createPost.use-case';
import { UpdatePostUseCase } from './postNest/post.use-cases/updatePost.use-case';
import { DeletePostUseCase } from './postNest/post.use-cases/deletePost.use-case';
import { MakeLikeOrDislikeUseCase } from './postNest/post.use-cases/makeLikeOrDislike.use-case';
import { GetCommentByIdUseCase } from './commentNest/comment.use-cases/getCommentById.use-case';
import { GetAllCommentsForSpecificPostCommand } from './commentNest/comment.use-cases/getAllCommentsForSpecificPost.use-case';
import { CreateCommentUseCase } from './commentNest/comment.use-cases/createComment.use-case';
import { UpdateCommentUseCase } from './commentNest/comment.use-cases/updateComment.use-case';
import { DeleteCommentUseCase } from './commentNest/comment.use-cases/deleteComment.use-case';
import { GetAllUsersUseCase } from './userNest/user.use-cases/getAllUsers.use-case';
import { CreateUserUserCase } from './userNest/user.use-cases/createUser.use-case';
import { DeleteUserUseCase } from './userNest/user.use-cases/deleteUser.use-case';
import { GetAllActiveSessionsUseCase } from './securityNest/security.use.cases/getAllActiveSessions.use-case';
import { DeleteAllOtherSessionsUseCase } from './securityNest/security.use.cases/deleteAllOtherSessions.use-case';
import { DeleteSessionByDeviceIdUseCase } from './securityNest/security.use.cases/deleteSessionByDeviceId.use-case';
import { CreateSessionUseCase } from './authNest/auth.use-cases/createSession.use-case';
import { RegistrationUserUseCase } from './authNest/auth.use-cases/registrationUser.use-case';
import { RegistrationConfirmationUserUseCase } from './authNest/auth.use-cases/registrationConfirmationUser.use-case';
import { ResendingConfirmationCodeUseCase } from './authNest/auth.use-cases/resendingConfirmationCode.use-case';
import { MakeNewPasswordUseCase } from './authNest/auth.use-cases/makeNewPassword.use-case';
import { ResendingPasswordCodeUseCase } from './authNest/auth.use-cases/resendingPasswordCode.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositorySql } from './userNest/repository/user.repositorySql';
import { SecurityRepositorySql } from './securityNest/repository/security.repositorySql';

const dbName = 'myApi';
const services = [
  AppService,
  BlogService,
  PostService,
  CommentService,
  UserService,
  AuthService,
  SecurityService,
  TestingService,
];
const repositoriesMongo = [
  BlogRepository,
  PostRepository,
  CommentRepository,
  UserRepository,
  SecurityRepository,
];
const repositoriesSql = [UserRepositorySql, SecurityRepositorySql];

const guardsAndValidations = [
  JwtAccessStrategyStrategy,
  EmailManager,
  BasicAuthGuard,
  RefreshTokenGuard,
  AuthGuard,
  GetToken,
  BlogNotFoundValidation,
];
const blogUseCases = [
  GetAllBlogsUseCase,
  GetBlogByIdUseCase,
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
];
const postUseCases = [
  GetAllPostsUseCase,
  GetAllPostsForSpecificBlogUseCase,
  GetPostByIdUseCase,
  CreatePostForSpecificBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  MakeLikeOrDislikeUseCase,
];
const commentUseCases = [
  GetCommentByIdUseCase,
  GetAllCommentsForSpecificPostCommand,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  MakeLikeOrDislikeUseCase,
];
const userUseCases = [
  GetAllUsersUseCase,
  CreateUserUserCase,
  DeleteUserUseCase,
];
const securityUseCases = [
  GetAllActiveSessionsUseCase,
  DeleteAllOtherSessionsUseCase,
  DeleteSessionByDeviceIdUseCase,
];
const authUseCases = [
  CreateSessionUseCase,
  RegistrationUserUseCase,
  RegistrationConfirmationUserUseCase,
  ResendingConfirmationCodeUseCase,
  MakeNewPasswordUseCase,
  ResendingPasswordCodeUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      /*host: 'localhost',
      port: 5432,
      username: 'i_node_js',
      password: 'sa',
      database: 'MyNestProject',
      autoLoadEntities: false,
      synchronize: false,
      logging: true,*/
      url: process.env.NEON_URL,
      ssl: true,
    }),
    CqrsModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    MongooseModule.forRoot(
      settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`,
    ),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: InformationOfLikeAndDislikePost.name,
        schema: InformationOfLikeAndDislikePostSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: InformationOfLikeAndDislikeComment.name,
        schema: InformationOfLikeAndDislikeCommentSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [
    AppController,
    BlogController,
    PostController,
    CommentController,
    UserController,
    TestingController,
    AuthController,
    SecurityController,
  ],
  providers: [
    ...guardsAndValidations,
    ...repositoriesMongo,
    ...repositoriesSql,
    ...services,
    ...blogUseCases,
    ...postUseCases,
    ...commentUseCases,
    ...userUseCases,
    ...securityUseCases,
    ...authUseCases,
  ],
})
export class AppModule {}
