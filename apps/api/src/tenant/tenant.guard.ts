import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const host = (req.headers.host || '').split(':')[0];
    const xTenant = (req.headers['x-tenant'] || '') as string;

    const sub = xTenant || host.split('.')[0];
    if (!sub || sub === 'www')
      throw new UnauthorizedException('Missing tenant');
    req.tenant = sub;
    return true;
  }
}
