/*
 * ERROR HANDLER MIDDLEWARE
 */
const ErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "ERROR",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/*
 * EXPORTS
 */
export default ErrorHandler;
