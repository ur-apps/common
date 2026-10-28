import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindAllQuery {
  @ApiProperty({ type: 'number', default: 100, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  @Type(() => Number)
  limit = 100;

  @ApiProperty({ type: 'number', default: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset = 0;
}
