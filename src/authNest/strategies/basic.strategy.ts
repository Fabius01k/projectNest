import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

// @Injectable()
// export class BasicStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super();
//   }
//   async validate(username, passwrod): Promise<boolean> {
//     if (
//       bacisConstans.userName === username &&
//       bacisConstans.password === passwrod
//     ) {
//       return true;
//     }
//     throw new UnauthorizedException();
//   }
// }
@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;
    if (!auth) throw new UnauthorizedException();
    const [authType, authValue] = auth.split(' ');
    if (authType !== 'Basic') throw new UnauthorizedException();
    if (authValue !== 'YWRtaW46cXdlcnR5') throw new UnauthorizedException();
    return true;
  }
}
