import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Tenant = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  const header = (req.headers['x-tenant'] || '') as string;
  if (header) return header;
  const host = (req.headers.host || '').split(':')[0];
  const parts = host.split('.');
  if (parts.length >= 2) return parts[0];
  return null;
});
