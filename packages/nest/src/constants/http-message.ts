export enum HttpMessage {
  BAD_REQUEST = 'Bad request',
  INVALID = 'Validation error',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not found',
  CONFLICT = 'Conflict',
  TOO_MANY_REQUESTS = 'Too many requests',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  NOT_IMPLEMENTED = 'Not implemented',
  BAD_GATEWAY = 'Bad gateway',
  SERVICE_UNAVAILABLE = 'Service unavailable',
  GATEWAY_TIMEOUT = 'Gateway timeout',
}
