/*
 * IMPORTS
 */
import bcrypt from 'bcryptjs';

/*
 * HELPER
 */
import { asyncHandler } from '../../../utils/asyncHandler.js';

/*
 * MODELS
 */
import { UserModel } from '../model.js';

/*
 * UTILs
 */
import { _GenerateAccessToken, _GenerateRefreshToken } from '../utils.js';

/*
 * VALIDATIONS
 */
import { RegisterSchema } from './validation.js';

/*
 * CONST
 */
const RegisterUser = asyncHandler(async (req, res) => {
  // Validating data
  const _ValideData = RegisterSchema.parse(req.body);

  // Getting all the required fields from body
  const { name, email, password } = _ValideData;

  // If any of the field not exsisted
  if (!name || !email || !password) {
    // Throws error
    throw new ApiError('All fields are required', 400);
  }

  // Hashing of password
  const _HashedPassword = await bcrypt.hash(password, 10);

  // Pushing new user into in-memory of cpu
  const _CreateUser = await UserModel.create({
    data: { name, email, password: _HashedPassword },
  });

  // If error persists
  if (!_CreateUser || _CreateUser instanceof Error) {
    // Throws error
    throw new ApiError('Something went wrong', 401);
  }

  // Return success
  res.status(201).json({
    message: 'User creates successfully',
    status: 'CREATED_SUCCESSFULLY',
  });
});

/*
 * EXPORTS
 */
export default RegisterUser;
