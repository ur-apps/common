import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

import { HttpMessage } from 'constants/';
import { BadRequestException, RpcBadRequestException } from 'exceptions';
import { mapClassValidatorErrors } from 'helpers';

const baseOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  stopAtFirstError: true,
};

/**
 * Validation pipe optimized for apps
 *
 * @example
 * // Global registration
 * app.useGlobalPipes(new AppValidationPipe());
 *
 * // Controller-scoped registration
 * @UsePipes(new AppValidationPipe())
 * export class UsersController {}
 *
 * // With custom options
 * new AppValidationPipe({
 *   forbidNonWhitelisted: true,
 *   validationError: { target: false }
 * })
 */
export class AppValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super({
      ...baseOptions,
      exceptionFactory: (errors) => {
        const mappedErrors = mapClassValidatorErrors(errors);

        throw new BadRequestException(HttpMessage.INVALID, mappedErrors);
      },
      ...options,
    });
  }
}

/**
 * Validation pipe optimized for microservices
 * Throws RpcBadRequestException instead of HTTP exception
 *
 * @example
 * // Global registration in microservice
 * app.useGlobalPipes(new ServiceValidationPipe());
 *
 * // Controller-scoped registration
 * @UsePipes(new ServiceValidationPipe())
 * export class UsersController {}
 */
export class ServiceValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super({
      ...baseOptions,
      exceptionFactory: (errors) => {
        const mappedErrors = mapClassValidatorErrors(errors);

        throw new RpcBadRequestException(HttpMessage.INVALID, mappedErrors);
      },
      ...options,
    });
  }
}
