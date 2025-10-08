import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Tenant } from '../tenant/tenant.decorator';
import { TenantGuard } from '../tenant/tenant.guard';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
@UseGuards(TenantGuard)
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  async signup(
    @Tenant() tenant: string,
    @Body() dto: SignupDto,
    @Res() res: Response,
  ) {
    const { token } = await this.auth.signup(tenant, dto.email, dto.password);
    setAuthCookie(res, token, tenant);
    return res.json({ ok: true });
  }

  @Post('login')
  async login(
    @Tenant() tenant: string,
    @Body() dto: LoginDto,
    @Res() res: Response,
  ) {
    const { token } = await this.auth.login(tenant, dto.email, dto.password);
    setAuthCookie(res, token, tenant);
    return res.json({ ok: true });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('auth', cookieOptions({ domain: undefined }));
    return res.json({ ok: true });
  }

  @UseGuards(TenantGuard, JwtGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}

function cookieOptions({ domain }: { domain?: string }) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: !!process.env.COOKIE_SECURE,
    ...(domain ? { domain } : {}),
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

function setAuthCookie(res: Response, token: string, tenant: string) {
  const host = process.env.PUBLIC_HOST ?? 'localhost';
  const isLocal = host === 'localhost';
  const domain = isLocal ? undefined : `${tenant}.${host}`;
  res.cookie('auth', token, cookieOptions({ domain }));
}
