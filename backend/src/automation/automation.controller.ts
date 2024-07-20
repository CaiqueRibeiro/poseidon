import {
  Body,
  Headers,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AuthService } from 'src/auth/auth.service';
import { PoolService } from 'src/pool/pool.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AutomationDTO } from './automation.dto';

@Controller('automations')
export class AutomationController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly poolService: PoolService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  async addAutomation(
    @Body() automation: AutomationDTO,
    @Headers('Authorization') authorization: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    const user = await this.userService.getUser(jwt.userId);
    if (!user.privateKey)
      throw new Error('You must have your private key in settings');

    const automationResult = await this.automationService.addAutomation(
      jwt.userId,
      automation,
    );

    if (automationResult.poolId && automationResult.isActive) {
      const pool = await this.poolService.getPool(automation.poolId);

      const condition = automation.isOpened
        ? automation.closeCondition
        : automation.openCondition;

      if (!condition) return automationResult;

      const tokenAddress =
        condition.field.indexOf('proce0') !== -1 ? pool.token1 : pool.token0;

      console.log(tokenAddress);

      // swap pré approval
    }

    return automationResult;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateAutomation(
    @Param('id') id: string,
    @Body() automation: AutomationDTO,
    @Headers('Authorization') authorization: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    const user = await this.userService.getUser(jwt.userId);
    if (!user.privateKey)
      throw new Error('You must have your private key in settings');

    const automationResult = await this.automationService.updateAutomation(
      id,
      jwt.userId,
      automation,
    );

    if (!automationResult.poolId || !automationResult.isActive) {
      return automationResult;
    }

    const condition = automation.isOpened
      ? automation.closeCondition
      : automation.openCondition;

    if (!condition) return automationResult;

    const pool = await this.poolService.getPool(automationResult.poolId);

    const tokenAddress =
      condition.field.indexOf('proce0') !== -1 ? pool.token1 : pool.token0;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getAutomation(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    return this.automationService.getAutomation(id, jwt.userId);
  }
}
