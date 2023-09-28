import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../application/settings';

// @Injectable()
// export class RefreshTokenGuard implements CanActivate {
//   constructor(
//     private readonly authService: AuthService,
//     private jwtService: JwtService,
//   ) {}
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const refreshToken = request.cookies['refreshToken'];
//     console.log(refreshToken);
//
//     if (!refreshToken) {
//       console.log(123);
//       throw new UnauthorizedException([
//         {
//           message: 'Unauthorized1',
//         },
//       ]);
//     }
//
//     const decoded = await this.authService.decodeRefreshToken(refreshToken);
//     const userSession = await this.authService.getUserSessionInDb(refreshToken);
//
//     if (
//       decoded.deviceId !== userSession?.deviceId &&
//       decoded.tokenCreationDate !== userSession?.tokenCreationDate
//     ) {
//       console.log(1234);
//       throw new UnauthorizedException([
//         {
//           message: 'Unauthorized2',
//         },
//       ]);
//     }
//
//     request['userId'] = decoded.userId;
//     request['deviceId'] = decoded.deviceId;
//     request['tokenCreationDate'] = decoded.tokenCreationDate;
//
//     return true;
//   }
// }

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        console.log(123);
        throw new UnauthorizedException([
          {
            message: 'Unauthorized1',
          },
        ]);
      }

      const result = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secret,
      });
      if (!result) {
        throw new UnauthorizedException([
          {
            message: 'Unauthorized2',
          },
        ]);
      }

      const decoded = await this.authService.decodeRefreshToken(refreshToken);
      const userSession =
        await this.authService.getUserSessionInDb(refreshToken);
      console.log(userSession, '11111');
      console.log(decoded, '22222');

      if (
        decoded.deviceId !== userSession[0].deviceId &&
        decoded.tokenCreationDate !== userSession[0].tokenCreationDate
      ) {
        console.log(1234);
        throw new UnauthorizedException([
          {
            message: 'Unauthorized3',
          },
        ]);
      }

      request['userId'] = decoded.userId;
      request['deviceId'] = decoded.deviceId;
      request['tokenCreationDate'] = decoded.tokenCreationDate;

      return true;
    } catch (e) {
      throw new UnauthorizedException([
        {
          message: 'Unauthorized4',
        },
      ]);
    }
  }
}
