import {
  Controller,
  Get,
  Headers,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('trades')
export class TradeController {
  constructor(
    private readonly tradeService: TradeService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('closed')
  async getClosedTrades(
    @Headers('Authorization') authorization: string,
    @Query('dateFrom', ParseIntPipe) dateFrom: number,
    @Query('dateTo', ParseIntPipe) dateTo: number,
  ) {
    if (!dateFrom) dateFrom = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days
    if (!dateTo) dateTo = Date.now();

    const jwt = this.authService.decodeToken(authorization);
    return this.tradeService.getClosedTrades(
      jwt.userId,
      new Date(dateFrom),
      new Date(dateTo),
    );
  }
}
