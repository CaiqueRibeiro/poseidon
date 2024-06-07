/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [PoolController],
  providers: [PoolService, AuthService, JwtService],
})
export class PoolModule {}
