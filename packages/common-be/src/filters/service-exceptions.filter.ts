import { Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

import { ServiceException } from 'interfaces';
import { HttpMessage } from 'constants/';

const internalServerError: ServiceException = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  message: HttpMessage.INTERNAL_SERVER_ERROR,
};

@Catch()
export class ServiceExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(ServiceExceptionFilter.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any): Observable<ServiceException> {
    this.logger.debug(exception);

    const error = exception instanceof RpcException ? exception.getError() : internalServerError;

    return throwError(() => error);
  }
}
