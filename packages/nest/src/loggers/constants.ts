/**
 * Keys `AppLogger` masks in structured params and in logged objects unless its options name others:
 * credentials and the tokens that stand in for them.
 */
export const DEFAULT_REDACTED_KEYS = [
  'password',
  'currentPassword',
  'refreshToken',
  'accessToken',
  'token',
  'authorization',
  'cookie',
] as const;

/** How many characters of the request id a text entry shows. */
export const SHORT_REQUEST_ID_LENGTH = 8;
