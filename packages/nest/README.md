# @urapps/nest

NestJS building blocks shared by UR Apps services: a uniform response format, validation, exceptions, roles and Swagger helpers, for both HTTP applications and microservices.

## Installation

```bash
npm install @urapps/nest @urapps/common
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `@nestjs/microservices`, `@nestjs/swagger` (all 12.x), `class-transformer`, `class-validator`, `reflect-metadata`, `rxjs` and `@urapps/common`. The package is ESM-only and targets `@nestjs/platform-express`.

## Usage

HTTP application:

```ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppExceptionFilter, AppValidationPipe, RolesGuard, TransformInterceptor } from '@urapps/nest';

const app = await NestFactory.create(AppModule);

app.useGlobalPipes(new AppValidationPipe());
app.useGlobalFilters(new AppExceptionFilter());
app.useGlobalInterceptors(new TransformInterceptor());
app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
```

Microservice:

```ts
import { ServiceExceptionFilter, ServiceValidationPipe } from '@urapps/nest';

app.useGlobalPipes(new ServiceValidationPipe());
app.useGlobalFilters(new ServiceExceptionFilter());
```

HTTP responses then take one shape: `{ success: true, data }` on success and `{ success: false, message, errors? }` on failure. Microservice errors reach the caller as `{ status, message, errors? }`.

## API

| Group        | Exports                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pipes        | `AppValidationPipe` (HTTP), `ServiceValidationPipe` (microservices) — validation with field-level `errors`                                                                                                                            |
| Filters      | `AppExceptionFilter` (HTTP), `ServiceExceptionFilter` (microservices)                                                                                                                                                                 |
| Interceptors | `TransformInterceptor` — wraps successful responses in `SuccessResponseDTO`; `TransformInterceptorOptions`                                                                                                                            |
| Guards       | `RolesGuard` — works with `@Roles()` and `@Public()`                                                                                                                                                                                  |
| Decorators   | `@Public()`, `@Roles()`, `@SkipTransform()`, `@User()`, `ApiResponse.*` (Swagger response schemas); helpers `isPublic`, `getRoles`, `hasRequiredRoles`, `isTransformSkipped`; keys `IS_PUBLIC_KEY`, `ROLES_KEY`, `SKIP_TRANSFORM_KEY` |
| DTOs         | `SuccessResponseDTO`, `FailedResponseDTO`, `PaginatedDTO`, `FindAllQuery`                                                                                                                                                             |
| Exceptions   | `BadRequestException`, `ConflictException`; `RpcBadRequestException`, `RpcConflictException`, `RpcForbiddenException`, `RpcNotFoundException`, `RpcServiceUnavailableException`                                                       |
| Helpers      | `mapClassValidatorErrors`                                                                                                                                                                                                             |
| Constants    | `HttpMessage`                                                                                                                                                                                                                         |
| Interfaces   | `Errors`, `ServiceException`                                                                                                                                                                                                          |

## Related packages

- [`@urapps/common`](https://www.npmjs.com/package/@urapps/common) — platform-agnostic utilities this package builds on.
- [`@urapps/eslint-config`](https://www.npmjs.com/package/@urapps/eslint-config) (`/nest`), [`@urapps/prettier-config`](https://www.npmjs.com/package/@urapps/prettier-config) (`/nest`), [`@urapps/tsconfig`](https://www.npmjs.com/package/@urapps/tsconfig) (`/nest`) — shared tooling configs for NestJS projects.

## License

[ISC](./LICENSE)
