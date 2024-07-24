/* istanbul ignore file */
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChainId } from 'commons/models/chainId';
import { Exchange } from 'commons/models/exchange';

export class ConditionDTO {
  @IsString()
  field: string;

  @IsString()
  operator: string;

  @IsString()
  value: string;
}

export class AutomationDTO {
  @IsString()
  name: string;

  @IsString()
  poolId: string;

  @IsString()
  nextAmount: string;

  @ValidateNested()
  @Type(() => ConditionDTO)
  openCondition: ConditionDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => ConditionDTO)
  closeCondition?: ConditionDTO;

  @IsOptional()
  @IsBoolean()
  isOpened: boolean;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsInt()
  exchange: Exchange;

  @IsInt()
  network: ChainId;
}
