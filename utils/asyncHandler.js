/*
 * Async Handler Wrapper
 * Automatically passes errors to next() so that
 * centralized error handler can catch them
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
