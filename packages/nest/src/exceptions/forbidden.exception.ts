import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { HttpMessage } from 'constants/';
import { ServiceException } from 'interfaces';

export class RpcForbiddenException extends RpcException {
  constructor(message: string = HttpMessage.FORBIDDEN) {
    super({
      status: HttpStatus.FORBIDDEN,
      message,
    } satisfies ServiceException);
  }
}
