import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key for routes excluded from TransformInterceptor.
 * Used to mark routes whose handler result is sent as it is, without the SuccessResponseDTO wrapper.
 */
export const SKIP_TRANSFORM_KEY = '@urapps/nest:skip-transform';

/**
 * Decorator to mark a controller or route as excluded from TransformInterceptor.
 * The handler result is sent as it is: `undefined` becomes an empty body without a Content-Type.
 *
 * @example
 * @SkipTransform()
 * @Get(':id/audio')
 * getAudio(@Res({ passthrough: true }) res: Response) {
 *   // nginx serves the file named in X-Accel-Redirect
 *   res.setHeader('X-Accel-Redirect', '/protected/audio.mp3');
 * }
 */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);

/**
 * Helper function to check if a route is excluded from TransformInterceptor.
 *
 * @param reflector Reflector instance
 * @param context Execution context (class and handler)
 * @returns true if the route or its controller is marked with @SkipTransform()
 */
export const isTransformSkipped = (reflector: Reflector, context: ExecutionContext): boolean => {
  return (
    reflector.getAllAndOverride<boolean | undefined>(SKIP_TRANSFORM_KEY, [context.getHandler(), context.getClass()]) ??
    false
  );
};
