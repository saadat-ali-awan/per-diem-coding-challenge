import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { StoreService } from '../store/store.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private storeService: StoreService,
    private jwt: JwtService,
  ) {}

  async signup(tenant: string, email: string, password: string) {
    const store = await this.storeService.bySubDomain(tenant);
    const hash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { email, passwordHash: hash, storeId: store.id },
    });
    return this.sign(user.id, store.id, store.subDomain);
  }

  async login(tenant: string, email: string, password: string) {
    const store = await this.storeService.bySubDomain(tenant);
    const user = await this.prisma.user.findFirst({
      where: { email, storeId: store.id },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user.id, store.id, store.subDomain);
  }

  private async sign(userId: string, storeId: string, subDomain: string) {
    const payload = { sub: userId, storeId, subDomain };
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: '7d',
    });
    return { token };
  }
}
