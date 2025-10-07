import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async bySubDomain(subDomain: string) {
    const store = await this.prisma.store.findUnique({ where: { subDomain } });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }
}
