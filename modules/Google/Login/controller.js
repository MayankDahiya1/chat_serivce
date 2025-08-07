/*
 * IMPORTS
 */
import { google } from 'googleapis';
import { UserModel } from '../model.js';
import { _GenerateAccessToken, _GenerateRefreshToken } from '../../Account/utils.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import ApiError from '../../../utils/ApiError.js';

/*
 * CONST: Google OAuth2 Client
 */
const _Oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/*
 * FUNCTION: Handle Google login
 */
const GoogleAuthCallback = asyncHandler(async (req, res) => {
  // Const Assignment
  const code = req.query.code;

  // If code is missing
  if (!code) {
    throw new ApiError('Authorization code is missing', 400);
  }

  // Get tokens from Google
  const { tokens } = await _Oauth2Client.getToken(code);
  _Oauth2Client.setCredentials(tokens);

  // Get user profile
  const _Oauth2 = google.oauth2({ auth: _Oauth2Client, version: 'v2' });

  // Extracting data
  const { data: profile } = await _Oauth2.userinfo.get();

  // Extracting email
  const { email } = profile;

  // If email is not there in google
  if (!email) {
    throw new ApiError('Google account does not have a public email', 400);
  }

  // Check if user exists
  const _User = await UserModel.findFirst({ where: { email, provider: 'GOOGLE' } });

  // If user doesn't exsists
  if (!_User) {
    return res.status(401).json({
      status: 'LOGIN_FAILED',
      message: 'User not found. Registration not allowed via Google.',
    });
  }

  // Generate tokens
  const _AccessToken = _GenerateAccessToken({
    id: _User.id,
    email: _User.email,
  });

  // Extracting Device
  const device = req.headers['user-agent'] || 'unknown';

  // Extracting IP
  const ip = req.ip;

  // Generating refresh token
  const _RefreshToken = await _GenerateRefreshToken(
    _User.id,
    { id: _User.id, email: _User.email },
    device,
    ip
  );

  // Return
  return res.json({
    token: _AccessToken,
    refreshToken: _RefreshToken,
    status: 'SUCCESSFULLY_LOGGED_IN',
    message: 'User logged in with Google successfully.',
  });
});

/*
 * EXPORT
 */
export default GoogleAuthCallback;
