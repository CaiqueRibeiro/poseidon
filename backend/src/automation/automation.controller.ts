import {
  Body,
  Headers,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AuthService } from '../auth/auth.service';
import { PoolService } from '../pool/pool.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../auth/auth.guard';
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
        condition.field.indexOf('price0') !== -1 ? pool.token1 : pool.token0;

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
      condition.field.indexOf('price0') !== -1 ? pool.token1 : pool.token0;

    return automationResult;
  }

  @UseGuards(AuthGuard)
  @Post(':id/start')
  async startAutomation(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    const user = await this.userService.getUser(jwt.userId);
    if (!user.privateKey)
      throw new Error('You must have your private key in settings');

    const automation = await this.automationService.startAutomation(
      id,
      jwt.userId,
    );

    if (!automation.poolId || !automation.isActive) {
      return automation;
    }

    const condition = automation.isOpened
      ? automation.closeCondition
      : automation.openCondition;

    if (!condition) return automation;

    const pool = await this.poolService.getPool(automation.poolId);

    const tokenAddress =
      condition.field.indexOf('price0') !== -1 ? pool.token1 : pool.token0;

    return automation;
  }

  @UseGuards(AuthGuard)
  @Post(':id/stop')
  async stopAutomation(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    return this.automationService.stopAutomation(id, jwt.userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteAutomation(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    return this.automationService.deleteAutomation(id, jwt.userId);
  }

  @UseGuards(AuthGuard)
  @Get('active')
  async getActiveAutomations(@Headers('Authorization') authorization: string) {
    const jwt = this.authService.decodeToken(authorization);
    return this.automationService.getActiveAutomations(jwt.userId);
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

  @UseGuards(AuthGuard)
  @Get('')
  async getAutomations(
    @Headers('Authorization') authorization: string,
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    return this.automationService.getAutomations(jwt.userId, page, pageSize);
  }
}
