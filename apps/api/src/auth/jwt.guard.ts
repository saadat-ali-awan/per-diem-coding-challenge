import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ForbiddenException,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtGuard extends AuthGuard('jwt-cookie') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) throw err || new ForbiddenException('Invalid token');

    const req = context.switchToHttp().getRequest<Request>();
    const userTyped = user as unknown as Express.User;

    if (req.tenant && userTyped.subDomain !== req.tenant) {
      throw new ForbiddenException('Tenant mismatch');
    }

    req.user = userTyped;
    return user;
  }
}
