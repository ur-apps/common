import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiGatewayTimeoutResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiResponseOptions,
  ApiServiceUnavailableResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { HttpMessage } from 'constants/';
import { FailedResponseDTO, PaginatedDTO, SuccessResponseDTO } from 'dto';
import { Errors } from 'interfaces';

function successResponseBuilder<T extends Type<unknown>>(
  decorator: (options?: ApiResponseOptions) => MethodDecorator & ClassDecorator,
  model?: T,
  isArray?: boolean
) {
  const schemas: (SchemaObject | ReferenceObject)[] = [{ $ref: getSchemaPath(SuccessResponseDTO) }];

  if (model) {
    schemas.push({
      required: ['data'],
      properties: isArray
        ? { data: { type: 'array', items: { $ref: getSchemaPath(model) } } }
        : { data: { $ref: getSchemaPath(model) } },
    });
  }

  return applyDecorators(decorator({ schema: { allOf: schemas } }));
}

function paginatedResponseBuilder<T extends Type<unknown>>(model: T) {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDTO) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginatedDTO) },
                  {
                    required: ['items'],
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    })
  );
}

function failedResponseBuilder<T extends Type<Errors>>(
  decorator: (options?: ApiResponseOptions) => MethodDecorator & ClassDecorator,
  message: string,
  errors?: T
) {
  const schemas: (SchemaObject | ReferenceObject)[] = [
    { $ref: getSchemaPath(FailedResponseDTO) },
    {
      properties: { message: { type: 'string', default: message } },
      required: ['message'],
    },
  ];

  if (errors) {
    schemas.push({
      properties: { errors: { $ref: getSchemaPath(errors) } },
      required: ['errors'],
    });
  }

  return applyDecorators(decorator({ schema: { allOf: schemas } }));
}

/**
 * Pre-configured Swagger response decorators for consistent API documentation
 */
export const ApiResponse = {
  Success: <T extends Type<unknown>>(model?: T, isArray?: boolean) =>
    successResponseBuilder(ApiOkResponse, model, isArray),

  Created: <T extends Type<unknown>>(model?: T, isArray?: boolean) =>
    successResponseBuilder(ApiCreatedResponse, model, isArray),

  Paginated: <T extends Type<unknown>>(model: T) => paginatedResponseBuilder(model),

  BadRequest: <T extends Type<Errors>>(message: string = HttpMessage.BAD_REQUEST, model?: T) =>
    failedResponseBuilder(ApiBadRequestResponse, message, model),

  Unauthorized: (message: string = HttpMessage.UNAUTHORIZED) => failedResponseBuilder(ApiUnauthorizedResponse, message),

  Forbidden: (message: string = HttpMessage.FORBIDDEN) => failedResponseBuilder(ApiForbiddenResponse, message),

  NotFound: <T extends Type<Errors>>(message: string = HttpMessage.NOT_FOUND, model?: T) =>
    failedResponseBuilder(ApiNotFoundResponse, message, model),

  Conflict: <T extends Type<Errors>>(message: string = HttpMessage.CONFLICT, model?: T) =>
    failedResponseBuilder(ApiConflictResponse, message, model),

  TooManyRequests: (message: string = HttpMessage.TOO_MANY_REQUESTS) =>
    failedResponseBuilder(ApiTooManyRequestsResponse, message),

  InternalServerError: (message: string = HttpMessage.INTERNAL_SERVER_ERROR) =>
    failedResponseBuilder(ApiInternalServerErrorResponse, message),

  NotImplemented: (message: string = HttpMessage.NOT_IMPLEMENTED) =>
    failedResponseBuilder(ApiNotImplementedResponse, message),

  BadGateway: (message: string = HttpMessage.BAD_GATEWAY) => failedResponseBuilder(ApiBadGatewayResponse, message),

  ServiceUnavailable: (message: string = HttpMessage.SERVICE_UNAVAILABLE) =>
    failedResponseBuilder(ApiServiceUnavailableResponse, message),

  GatewayTimeout: (message: string = HttpMessage.GATEWAY_TIMEOUT) =>
    failedResponseBuilder(ApiGatewayTimeoutResponse, message),
};
