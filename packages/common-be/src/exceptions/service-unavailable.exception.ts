import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { HttpMessage } from 'constants/';
import { Errors, ServiceException } from 'interfaces';

export class RpcServiceUnavailableException extends RpcException {
  constructor(message = HttpMessage.SERVICE_UNAVAILABLE, errors?: Errors) {
    super({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message,
      errors,
    } satisfies ServiceException);
  }
}
