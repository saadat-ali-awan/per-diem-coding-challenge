import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StoreService } from '../store/store.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, StoreService],
})
export class AuthModule {}
