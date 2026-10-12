import { ApiProperty } from '@nestjs/swagger';

import { Errors } from 'interfaces';

export class SuccessResponseDTO<T = undefined> {
  @ApiProperty({ default: true })
  success: true;

  data?: T;

  constructor(data?: T) {
    this.success = true;
    this.data = data;
  }
}

export class PaginatedDTO<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  items: T[];

  constructor({ total, limit, offset, items }: PaginatedDTO<T>) {
    this.total = total;
    this.limit = limit;
    this.offset = offset;
    this.items = items;
  }
}

export class FailedResponseDTO<T extends Errors = Errors> {
  @ApiProperty({ default: false })
  success: false;

  @ApiProperty()
  message: string;

  errors?: T;

  constructor(message: string, errors?: T) {
    this.success = false;
    this.message = message;
    this.errors = errors;
  }
}
