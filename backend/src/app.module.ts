/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import Config from './config';
import { UserModule } from './user/user.module';
import { PoolModule } from './pool/pool.module';
import { AutomationModule } from './automation/automation.module';
import { TradeModule } from './trade/trade.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: Config.MAILER_HOST,
        port: Config.MAILER_PORT,
        secure: false,
        auth: {
          user: Config.MAILER_USER,
          pass: Config.MAILER_PASS,
        },
      },
      defaults: {
        secure: false,
        from: Config.DEFAULT_FROM,
      },
    }),
    UserModule,
    PoolModule,
    AutomationModule,
    TradeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
