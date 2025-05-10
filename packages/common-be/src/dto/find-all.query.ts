import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class FindAllQuery {
  @ApiProperty({ default: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;
}
