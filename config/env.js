/*
 * LOADS ENV
 */
import dotenv from 'dotenv';
dotenv.config();

/*
 * EXPORTS
 */
export default {
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
};
