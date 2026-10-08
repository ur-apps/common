import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { getErrorMessage } from '@ur-apps/common';
import { Request, Response } from 'express';

import { HttpMessage } from 'constants/';
import { FailedResponseDTO } from 'dto';
import { Errors } from 'interfaces';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    let httpStatus: number;
    let responseBody: FailedResponseDTO;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody = new FailedResponseDTO(
        exception.message,
        (exception as HttpException & { errors?: Errors }).errors
      );
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = new FailedResponseDTO(HttpMessage.INTERNAL_SERVER_ERROR);
    }

    if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.path}: ${getErrorMessage(exception)}`,
        exception instanceof Error ? exception.stack : undefined
      );
    } else {
      this.logger.debug(exception);
    }

    response.status(httpStatus).json(responseBody);
  }
}
