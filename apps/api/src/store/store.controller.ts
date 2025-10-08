import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { TenantGuard } from '../tenant/tenant.guard';
import { Tenant } from '../tenant/tenant.decorator';
import { CreateStoreDto } from './dto/create-store.dto';

@Controller('store')
export class StoreController {
  constructor(private store: StoreService) {}

  @Post()
  async createStore(@Body() dto: CreateStoreDto) {
    return this.store.createStore(dto);
  }

  @UseGuards(TenantGuard)
  @Get('me')
  async me(@Tenant() tenant: string) {
    return this.store.bySubDomain(tenant);
  }
}
