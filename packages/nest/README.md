# @urapps/nest

NestJS building blocks shared by UR Apps services: a uniform response format, validation, exceptions, roles, request logging and Swagger helpers, for both HTTP applications and microservices.

## Installation

```bash
npm install @urapps/nest @urapps/common
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `@nestjs/microservices`, `@nestjs/swagger` (all 12.x), `class-transformer`, `class-validator`, `reflect-metadata`, `rxjs` and `@urapps/common`. The package is ESM-only and targets `@nestjs/platform-express`.

## Usage

HTTP application:

```ts
import { NestFactory } from '@nestjs/core';
import { AppExceptionFilter, AppValidationPipe, RolesGuard, TransformInterceptor } from '@urapps/nest';

const app = await NestFactory.create(AppModule);

app.useGlobalPipes(new AppValidationPipe());
app.useGlobalFilters(new AppExceptionFilter());
app.useGlobalInterceptors(new TransformInterceptor());
app.useGlobalGuards(new RolesGuard());
```

Microservice:

```ts
import { ServiceExceptionFilter, ServiceValidationPipe } from '@urapps/nest';

app.useGlobalPipes(new ServiceValidationPipe());
app.useGlobalFilters(new ServiceExceptionFilter());
```

HTTP responses then take one shape: `{ success: true, data }` on success and `{ success: false, message, errors? }` on failure. Microservice errors reach the caller as `{ status, message, errors? }`.

Request logging, in an HTTP application — `main.ts`:

```ts
import { AppLogger } from '@urapps/nest';

const app = await NestFactory.create(AppModule, { bufferLogs: true });

app.useLogger(new AppLogger({ json: process.env.NODE_ENV === 'production' }));
```

and the root module:

```ts
import { AccessLogMiddleware, RequestContextMiddleware } from '@urapps/nest';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('{*path}');
    consumer.apply(AccessLogMiddleware).exclude('app/health').forRoutes('{*path}');
  }
}
```

`RequestContextMiddleware` gives each request an id, taken from an incoming `X-Request-Id` of a safe shape or made anew, and sends it back in that header. Every entry logged while the request is handled carries the request's context: at the root of a JSON entry, next to `params`, and as the first characters of the id after the context in text. The authentication guard adds the account to the context through `getRequestContext()`, and an application declares fields of its own by merging into `UrappsNest.RequestContext`. `AccessLogMiddleware` logs one entry per request once it is answered or cut short, and runs after `RequestContextMiddleware`. `AppLogger` masks `DEFAULT_REDACTED_KEYS` in what it logs unless its options pass `redact`.

## API

| Group        | Exports                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pipes        | `AppValidationPipe` (HTTP), `ServiceValidationPipe` (microservices) — validation with field-level `errors`                                                                                                                            |
| Filters      | `AppExceptionFilter` (HTTP), `ServiceExceptionFilter` (microservices)                                                                                                                                                                 |
| Interceptors | `TransformInterceptor` — wraps successful responses in `SuccessResponse`; `TransformInterceptorOptions`                                                                                                                               |
| Guards       | `RolesGuard` — works with `@Roles()` and `@Public()`                                                                                                                                                                                  |
| Middlewares  | `RequestContextMiddleware` — opens the request context with the request id; `AccessLogMiddleware` — one entry per answered request; `REQUEST_ID_HEADER`                                                                               |
| Loggers      | `AppLogger` — `ConsoleLogger` that writes the request context into each entry; `DEFAULT_REDACTED_KEYS`                                                                                                                                |
| Decorators   | `@Public()`, `@Roles()`, `@SkipTransform()`, `@User()`, `ApiResponse.*` (Swagger response schemas); helpers `isPublic`, `getRoles`, `hasRequiredRoles`, `isTransformSkipped`; keys `IS_PUBLIC_KEY`, `ROLES_KEY`, `SKIP_TRANSFORM_KEY` |
| DTOs         | `SuccessResponse`, `FailedResponse`, `PaginatedDTO`, `PaginationDTO`, `FindAllQuery`                                                                                                                                                  |
| Exceptions   | `BadRequestException`, `ConflictException`; `RpcBadRequestException`, `RpcConflictException`, `RpcForbiddenException`, `RpcNotFoundException`, `RpcServiceUnavailableException`                                                       |
| Helpers      | `mapClassValidatorErrors`, `runInRequestContext`, `getRequestContext`                                                                                                                                                                 |
| Constants    | `HttpMessage`                                                                                                                                                                                                                         |
| Interfaces   | `Errors`, `RequestContext` (extended through `UrappsNest.RequestContext`), `ServiceException`                                                                                                                                         |

## Related packages

- [`@urapps/common`](https://www.npmjs.com/package/@urapps/common) — platform-agnostic utilities this package builds on.
- [`@urapps/eslint-config`](https://www.npmjs.com/package/@urapps/eslint-config) (`/nest`), [`@urapps/prettier-config`](https://www.npmjs.com/package/@urapps/prettier-config) (`/nest`), [`@urapps/tsconfig`](https://www.npmjs.com/package/@urapps/tsconfig) (`/nest`) — shared tooling configs for NestJS projects.

## License

[ISC](./LICENSE)
