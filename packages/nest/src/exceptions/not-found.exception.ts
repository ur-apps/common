import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { HttpMessage } from 'constants/';
import { ServiceException } from 'interfaces';

export class RpcNotFoundException extends RpcException {
  constructor(message = HttpMessage.NOT_FOUND) {
    super({
      status: HttpStatus.NOT_FOUND,
      message,
    } satisfies ServiceException);
  }
}
