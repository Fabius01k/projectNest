import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostController } from './postNest/controler/post.controller';
import { CommentController } from './commentNest/controller/comment.controller';
import { UserController } from './userNest/controller/user.controller';
import { UserService } from './userNest/service/user.service';
import { BlogController } from './blogNest/controler/blog.controller';
import { TestingController } from './testingNest/testing.controller';
import { TestingService } from './testingNest/testing.service';
import { jwtConstants } from './application/settings';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './authNest/service/auth.service';

import { JwtAccessStrategyStrategy } from './authNest/strategies/jwt-access.strategy';
import { EmailManager } from './managers/email-manager';

import { BasicAuthGuard } from './authNest/guards/basic-auth.guard';
import { RefreshTokenGuard } from './authNest/guards/refresh-token.guard';
import { AuthController } from './authNest/controller/auth.controller';
import { AuthGuard, GetToken } from './authNest/guards/bearer.guard';
import { BlogNotFoundValidation } from './inputmodels-validation/inputModel.custom-decoration';
import { SecurityController } from './securityNest/controler/security.controller';
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
// import { CreatePostForSpecificBlogUseCase } from './postNest/post.use-cases/createPostForSpecificBlog.use-case';
import { CreatePostUseCase } from './postNest/post.use-cases/createPost.use-case';
import { UpdatePostUseCase } from './postNest/post.use-cases/updatePost.use-case';
import { DeletePostUseCase } from './postNest/post.use-cases/deletePost.use-case';

import { GetCommentByIdUseCase } from './commentNest/comment.use-cases/getCommentById.use-case';
import { GetAllCommentsForSpecificPostUseCase } from './commentNest/comment.use-cases/getAllCommentsForSpecificPost.use-case';
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
import { BlogRepositorySql } from './blogNest/repository/blog.repositorySql';
import { BlogSAController } from './blogNest/controler/blog.SAcontroller';
import { PostSAController } from './postNest/controler/post.SAcontroller';
import { PostRepositorySql } from './postNest/repository/post.repositorySql';
import { CommentRepositorySql } from './commentNest/repository/comment.repositorySql';
import { MakeLikeOrDislikeCommentUseCase } from './commentNest/comment.use-cases/makeLikeOrDislike.use-case';
import { MakeLikeOrDislikePostUseCase } from './postNest/post.use-cases/makeLikeOrDislike.use-case';
import { UserTrm } from './entities/user.entity';
import { UsersSessionTrm } from './entities/usersSession.entity';
import { UserRepositoryTypeOrm } from './userNest/repository/user.repository.TypeOrm';
import { SecurityRepositoryTypeOrm } from './securityNest/repository/security.repository.TypeOrm';
import { BlogRepositoryTypeOrm } from './blogNest/repository/blog.repository.TypeOrm';
import { BlogTrm } from './entities/blog.entity';
import { PostTrm } from './entities/post.entity';
import { PostRepositoryTypeOrm } from './postNest/repository/post.repository.TypeOrm';
import { PostsLikesAndDislikesTrm } from './entities/post-likes.entity';

const superAdminControllers = [
  UserController,
  BlogSAController,
  PostSAController,
];
const publicControllers = [
  AppController,
  BlogController,
  PostController,
  CommentController,
  TestingController,
  AuthController,
  SecurityController,
];
const services = [AppService, UserService, AuthService, TestingService];
// const repositoriesMongo = [
//   BlogRepository,
//   BlogRepository,
//   BlogRepository,
//   PostRepository,
//   CommentRepository,
//   UserRepository,
//   SecurityRepository,
// ];
const repositoriesSql = [
  UserRepositorySql,
  SecurityRepositorySql,
  BlogRepositorySql,
  PostRepositorySql,
  CommentRepositorySql,
];
const repositoriesTypeOrm = [
  UserRepositoryTypeOrm,
  SecurityRepositoryTypeOrm,
  BlogRepositoryTypeOrm,
  PostRepositoryTypeOrm,
];

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
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  MakeLikeOrDislikePostUseCase,
];
const commentUseCases = [
  GetCommentByIdUseCase,
  GetAllCommentsForSpecificPostUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  MakeLikeOrDislikeCommentUseCase,
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
      // entities: [UserTrm, UsersSessionTrm],
      // host: 'localhost',
      // port: 5432,
      // username: 'i_node_js',
      // password: 'sa',
      // database: 'MyNestProject',
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      url: process.env.NEON_URL,
      ssl: true,
    }),
    TypeOrmModule.forFeature([
      UserTrm,
      UsersSessionTrm,
      BlogTrm,
      PostTrm,
      PostsLikesAndDislikesTrm,
    ]),
    CqrsModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    // MongooseModule.forRoot(
    //   settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`,
    // ),
    // MongooseModule.forFeature([]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [...publicControllers, ...superAdminControllers],
  providers: [
    ...guardsAndValidations,
    ...repositoriesSql,
    ...repositoriesTypeOrm,
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
