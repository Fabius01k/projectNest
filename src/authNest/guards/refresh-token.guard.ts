import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const decoded = await this.authService.decodeRefreshToken(refreshToken);
    const userSession = await this.authService.getUserSessionInDb(refreshToken);

    if (
      decoded.deviceId !== userSession?.deviceId &&
      decoded.creationDate !== userSession?.tokenCreationDate
    ) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
