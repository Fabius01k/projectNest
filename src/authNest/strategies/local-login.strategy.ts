import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';
import { User } from '../../userNest/schema/user.schema';

// @Injectable()
// export class LocalLoginStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({ usernameField: 'login' });
//   }
//   async validate(login: string, password: string): Promise<User> {
//     const user = await this.authService.validateLoginUser(login, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }

// @Injectable()
// export class LocalLoginStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({ usernameField: 'login' });
//   }
//   async validate(login: string, password: string): Promise<User> {
//     const user = await this.authService.validateLoginUser(login, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }

// @Injectable()
// export class LocalLoginGuard
//   extends PassportStrategy(Strategy, 'local')
//   implements CanActivate
// {
//   constructor(private readonly authService: AuthService) {
//     super({ usernameField: 'login' });
//   }
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const result = (await super.canActivate(context)) as boolean;
//     const request = context.switchToHttp().getRequest();
//     await super.logIn(request);
//     return result;
//   }
//
//   async validate(login: string, password: string): Promise<User> {
//     const user = await this.authService.validateLoginUser(login, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
