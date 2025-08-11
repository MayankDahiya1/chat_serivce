/*
 * IMPORTS
 */
import rateLimit from 'express-rate-limit';

/*
 * Global rate limiter to protect from brute force attacks.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max requests per IP
  message: { status: 'TOO_MANY_REQUESTS', message: 'Too many requests, try again later' },
});

/*
 * EXPORTS
 */
export default limiter;
