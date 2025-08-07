/*
 * GLOBAL UTILS
 */
import ApiError from './utils/ApiError.js';
import prisma from './config/db.js';
import { asyncHandler } from './utils/asyncHandler.js';

/*
 * SETTING GLOBALS
 */
global.ApiError = ApiError;
global.DB = prisma;
global.asyncHandler = asyncHandler;
