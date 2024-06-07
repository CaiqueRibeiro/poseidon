import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PoolService } from './pool.service';
import { AuthGuard } from 'src/auth/auth.guard';

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
  @Get(':id')
  async getPool(@Param('id') id: string) {
    return this.poolService.getPool(id);
  }

  @UseGuards(AuthGuard)
  @Get(':symbol/:fee')
  async searchPool(@Param('symbol') symbol: string, @Param('fee') fee: number) {
    return this.poolService.searchPool(symbol, fee);
  }

  @UseGuards(AuthGuard)
  @Get('top')
  async getTopPools() {
    return this, this.poolService.getTopPools();
  }
}
