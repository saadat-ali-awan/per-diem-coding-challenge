import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  storeId: string;
  subDomain: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const cookies = req?.cookies as Record<string, unknown> | undefined;
          const token = cookies?.auth;
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: unknown): JwtPayload {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'sub' in payload &&
      'storeId' in payload &&
      'subDomain' in payload
    ) {
      return payload as JwtPayload;
    }

    throw new Error('Invalid JWT payload structure');
  }
}
