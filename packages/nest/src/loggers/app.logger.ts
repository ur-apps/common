import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common';

import { getRequestContext } from 'helpers';

import { DEFAULT_REDACTED_KEYS, SHORT_REQUEST_ID_LENGTH } from './constants.ts';

type JsonLogObjectOptions = Parameters<ConsoleLogger['getJsonLogObject']>[1];
type JsonLogObject = ReturnType<ConsoleLogger['getJsonLogObject']>;

/**
 * `ConsoleLogger` that writes the context of the request being handled into each entry:
 * every field of it at the root of a JSON entry, and the beginning of the request id next to the context in text.
 * A field of the entry itself is never replaced by a field of the context.
 * `DEFAULT_REDACTED_KEYS` are masked unless the options pass `redact`.
 *
 * @example
 * const app = await NestFactory.create(AppModule, { bufferLogs: true });
 *
 * app.useLogger(new AppLogger({ json: process.env.NODE_ENV === 'production', logLevels }));
 */
export class AppLogger extends ConsoleLogger {
  constructor(options: ConsoleLoggerOptions = {}) {
    super({ redact: [...DEFAULT_REDACTED_KEYS], ...options });
  }

  protected getJsonLogObject(message: unknown, options: JsonLogObjectOptions): JsonLogObject {
    const logObject = super.getJsonLogObject(message, options);

    for (const [key, value] of Object.entries(getRequestContext() ?? {})) {
      if (!(key in logObject)) {
        logObject[key] = value;
      }
    }

    return logObject;
  }

  protected formatContext(context: string): string {
    const formatted = super.formatContext(context);
    const requestId = getRequestContext()?.requestId;

    return requestId ? `${formatted}[${requestId.slice(0, SHORT_REQUEST_ID_LENGTH)}] ` : formatted;
  }
}
