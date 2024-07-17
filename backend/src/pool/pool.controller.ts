import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PoolService } from './pool.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getPools(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.poolService.getPools(page, pageSize);
  }

  @UseGuards(AuthGuard)
  @Get('symbols')
  async getPoolSymbols() {
    return this.poolService.getPoolSymbols();
  }

  @UseGuards(AuthGuard)
  @Get('top')
  async getTopPools() {
    return this, this.poolService.getTopPools();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getPool(@Param('id') id: string) {
    return this.poolService.getPool(id);
  }

  @UseGuards(AuthGuard)
  @Get('search/:symbol')
  async searchPool(@Param('symbol') symbol: string) {
    return this.poolService.searchPool(symbol);
  }
}
