/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [TradeController],
  providers: [TradeService, AuthService, JwtService],
})
export class TradeModule {}
