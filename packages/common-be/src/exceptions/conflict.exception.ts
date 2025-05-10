import { HttpStatus, ConflictException as NestConflictException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { HttpMessage } from 'constants/';
import { Errors, ServiceException } from 'interfaces';

export class ConflictException extends NestConflictException {
  public errors?: Errors;

  constructor(message = HttpMessage.CONFLICT, errors?: Errors) {
    super(message);
    this.errors = errors;
  }
}

export class RpcConflictException extends RpcException {
  constructor(message = HttpMessage.CONFLICT, errors?: Errors) {
    super({
      status: HttpStatus.CONFLICT,
      message,
      errors,
    } satisfies ServiceException);
  }
}
