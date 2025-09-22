/*
 * ERROR HANDLER MIDDLEWARE
 */
const ErrorHandler = (err, req, res, _next) => {
  _ErrorLog('Request error: %s', err.message);
  _ErrorLog('Request path: %s %s', req.method, req.path);
  _ErrorLog('User: %s', req.user?.id || 'Anonymous');

  if (process.env.NODE_ENV === 'development') {
    _ErrorLog('Stack trace: %s', err.stack);
  }

  const statusCode = err.statusCode || 500;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'VALIDATION_ERROR',
      message: 'Invalid input data provided',
      errors: err.details || err.message,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'INVALID_ID',
      message: 'Invalid ID format provided',
    });
  }

  if (err.code === 'P2002') {
    // Prisma unique constraint error
    return res.status(409).json({
      status: 'CONFLICT',
      message: 'Resource already exists with the provided data',
    });
  }

  if (err.code === 'P2025') {
    // Prisma record not found
    return res.status(404).json({
      status: 'NOT_FOUND',
      message: 'Requested resource not found',
    });
  }

  // Default error response
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'INTERNAL_ERROR' : 'ERROR',
    message: statusCode >= 500 ? 'An internal server error occurred' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/*
 * EXPORTS
 */
export default ErrorHandler;
