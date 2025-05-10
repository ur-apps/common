import { HttpStatus, BadRequestException as NestBadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { HttpMessage } from 'constants/';
import { Errors, ServiceException } from 'interfaces';

export class BadRequestException extends NestBadRequestException {
  public errors?: Errors;

  constructor(message = HttpMessage.BAD_REQUEST, errors?: Errors) {
    super(message);
    this.errors = errors;
  }
}

export class RpcBadRequestException extends RpcException {
  constructor(message = HttpMessage.BAD_REQUEST, errors?: Errors) {
    super({
      status: HttpStatus.BAD_REQUEST,
      message,
      errors,
    } satisfies ServiceException);
  }
}
