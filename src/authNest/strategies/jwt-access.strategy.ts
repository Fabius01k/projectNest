import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { settings } from '../../application/settings';

@Injectable()
export class JwtAccessStrategyStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: settings.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    return {
      userId: payload.sub,
      deviceId: payload.deviceId,
    };
  }
}
