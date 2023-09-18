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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { BasicAuthGuard } from './authNest/guards/basic-auth.guard';
import { RefreshTokenGuard } from './authNest/guards/refresh-token.guard';
import { AuthController } from './authNest/controller/auth.controller';
import { AuthGuard, GetToken } from './authNest/guards/bearer.guard';
import { BlogNotFoundValidation } from './inputmodels-validation/inputModel.custom-decoration';
import { SecurityController } from './securityNest/controler/security.controller';
import { SecurityService } from './securityNest/service/security.service';
import { SecurityRepository } from './securityNest/repository/security.repository';
import { APP_GUARD } from '@nestjs/core';

const dbName = 'myApi';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 10,
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
    AppService,
    BlogService,
    BlogRepository,
    PostService,
    PostRepository,
    CommentService,
    CommentRepository,
    UserService,
    UserRepository,
    TestingService,
    AuthService,
    SecurityService,
    SecurityRepository,
    JwtAccessStrategyStrategy,
    EmailManager,
    BasicAuthGuard,
    RefreshTokenGuard,
    AuthGuard,
    GetToken,
    BlogNotFoundValidation,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
