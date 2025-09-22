/*
 * GLOBAL UTILS
 */
import ApiError from './utils/apiError.js';
import prisma from './config/db.js';
import { asyncHandler } from './utils/asyncHandler.js';
import createLogger, {
  _ServerLog,
  _DatabaseLog,
  _AuthLog,
  _ChatLog,
  _LLMLog,
  _KafkaLog,
  _ErrorLog,
} from './utils/logger.js';

/*
 * SETTING GLOBALS
 */
global.ApiError = ApiError;
global.DB = prisma;
global.asyncHandler = asyncHandler;
global.createLogger = createLogger;
global._ServerLog = _ServerLog;
global._DatabaseLog = _DatabaseLog;
global._AuthLog = _AuthLog;
global._ChatLog = _ChatLog;
global._LLMLog = _LLMLog;
global._KafkaLog = _KafkaLog;
global._ErrorLog = _ErrorLog;
