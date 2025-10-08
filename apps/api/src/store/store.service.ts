import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async createStore(dto: CreateStoreDto) {
    const existing = await this.prisma.store.findUnique({
      where: { subDomain: dto.subDomain },
    });

    if (existing) {
      throw new ConflictException('Store with this subdomain already exists');
    }

    const store = await this.prisma.store.create({
      data: {
        subDomain: dto.subDomain,
        name: dto.name,
        welcome: dto.welcome ?? `Welcome to ${dto.name}!`,
        theme: {
          primary: dto.primary ?? '#2563eb',
          background: dto.background ?? '#ffffff',
          fontFamily: dto.fontFamily ?? 'Inter',
        },
      },
    });

    return store;
  }

  async bySubDomain(subDomain: string) {
    const store = await this.prisma.store.findUnique({ where: { subDomain } });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }
}
