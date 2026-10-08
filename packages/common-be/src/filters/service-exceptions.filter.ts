import { Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { getErrorMessage } from '@ur-apps/common';
import { Observable, throwError } from 'rxjs';

import { HttpMessage } from 'constants/';
import { ServiceException } from 'interfaces';

const internalServerError: ServiceException = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  message: HttpMessage.INTERNAL_SERVER_ERROR,
};

@Catch()
export class ServiceExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(ServiceExceptionFilter.name);

  catch(exception: unknown): Observable<ServiceException> {
    if (exception instanceof RpcException) {
      this.logger.debug(exception);

      return throwError(() => exception.getError());
    }

    this.logger.error(getErrorMessage(exception), exception instanceof Error ? exception.stack : undefined);

    return throwError(() => internalServerError);
  }
}
