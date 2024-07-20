/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { PoolService } from 'src/pool/pool.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [AutomationController],
  providers: [
    AutomationService,
    PoolService,
    UserService,
    AuthService,
    JwtService,
  ],
})
export class AutomationModule {}
