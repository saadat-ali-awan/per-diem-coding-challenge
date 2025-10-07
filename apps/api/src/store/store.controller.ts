import { Controller, Get, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { TenantGuard } from '../tenant/tenant.guard';
import { Tenant } from '../tenant/tenant.decorator';

@Controller('store')
@UseGuards(TenantGuard)
export class StoreController {
  constructor(private store: StoreService) {}

  @Get('me')
  async me(@Tenant() tenant: string) {
    return this.store.bySubDomain(tenant);
  }
}
