/*
 * IMPORTS
 */
import bcrypt from 'bcryptjs';

/*
 * UTILs
 */
import { _GenerateAccessToken, _GenerateRefreshToken } from '../utils.js';

/*
 * MODELS
 */
import { UserModel } from '../model.js';

/*
 * VALIDATIONS
 */
import { LoginSchema } from './validation.js';

/*
 * CONST
 */
const LoginUser = asyncHandler(async (req, res) => {
  // Validate request
  const _ValidatedData = LoginSchema.parse(req.body);

  // Parsing data
  const { email, password } = _ValidatedData;

  // Checking all fields are there
  if (!email || !password) {
    throw new ApiError('All fields required');
  }

  // Find user
  const _User = await UserModel.findUnique({ where: { email } });

  // If error persists
  if (!_User || _User instanceof Error) {
    return res.status(401).json({
      message: 'Invalid email or password',
      status: 'INVALID_EMAIL_PASSWORD',
    });
  }

  // Checking password
  const _IsMatch = await bcrypt.compare(password, _User.password);

  // If not matched throw error
  if (!_IsMatch) {
    return res.status(401).json({
      message: 'Invalid email or password',
      status: 'INVALID_EMAIL_PASSWORD',
    });
  }

  // Access token
  const _AccessToken = _GenerateAccessToken({
    id: _User.id,
    email: _User.email,
  });

  // Device/IP capture
  const device = req.headers['user-agent'] || 'unknown';
  const ip = req.ip;

  // Refresh token
  const _RefreshToken = await _GenerateRefreshToken(
    _User.id,
    { id: _User.id, email: _User.email },
    device,
    ip
  );

  // Return
  res.json({
    token: _AccessToken,
    refreshToken: _RefreshToken,
    status: 'SUCCESSFULLY_LOGGED_IN',
    message: 'Successfully logged in user.',
  });
});

/*
 * EXPORTS
 */
export default LoginUser;
