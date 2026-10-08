export function getErrorMessage(error: unknown): string {
  if (error instanceof AggregateError) {
    const causes = error.errors?.map((cause) => getErrorMessage(cause)).join('; ');

    return [error.message, causes].filter(Boolean).join(': ') || error.name;
  }

  if (error instanceof Error) {
    return error.message || error.name;
  }

  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error);
    } catch {
      // Not serializable (circular reference, BigInt): falls through to String(error)
    }
  }

  return String(error);
}
