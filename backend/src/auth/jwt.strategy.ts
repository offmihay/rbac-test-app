import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestWithUser } from 'src/common/types/jwt-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: any) {
    const jwtUser: RequestWithUser['user'] = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return jwtUser;
  }
}
