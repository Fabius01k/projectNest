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

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      console.log(123);
      throw new UnauthorizedException([
        {
          message: 'Unauthorized1',
        },
      ]);
    }

    const decoded = await this.authService.decodeRefreshToken(refreshToken);
    const userSession = await this.authService.getUserSessionInDb(refreshToken);

    if (
      decoded.deviceId !== userSession?.deviceId &&
      decoded.tokenCreationDate !== userSession?.tokenCreationDate
    ) {
      console.log(1234);
      throw new UnauthorizedException([
        {
          message: 'Unauthorized2',
        },
      ]);
    }

    request['userId'] = decoded.userId;
    request['deviceId'] = decoded.deviceId;
    request['tokenCreationDate'] = decoded.tokenCreationDate;

    return true;
  }
}
