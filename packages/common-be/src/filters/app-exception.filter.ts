import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

import { HttpMessage } from 'constants/';
import { FailedResponseDTO } from 'dto';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost): void {
    this.logger.debug(exception);

    const response = host.switchToHttp().getResponse<Response>();
    let httpStatus: number;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
    } else {
      httpStatus = typeof exception?.status === 'number' ? exception.status : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const responseBody = new FailedResponseDTO(
      exception?.message ?? HttpMessage.INTERNAL_SERVER_ERROR,
      exception?.errors
    );

    response.status(httpStatus).json(responseBody);
  }
}
