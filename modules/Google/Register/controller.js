/*
 * IMPORTS
 */
import { google } from 'googleapis';
import { UserModel } from '../model.js';
import { _GenerateAccessToken, _GenerateRefreshToken } from '../../Account/utils.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import ApiError from '../../../utils/apiError.js';

/*
 * GOOGLE CLIENT
 */
const _Oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/*
 * FUNCTION: Google Register
 */
const GoogleRegisterCallback = asyncHandler(async (req, res) => {
  const code = req.query.code;

  if (!code) {
    throw new ApiError('Missing authorization code from Google', 400);
  }

  // Get Google tokens
  const { tokens } = await _Oauth2Client.getToken(code);
  _Oauth2Client.setCredentials(tokens);

  // Get Google profile
  const oauth2 = google.oauth2({ auth: _Oauth2Client, version: 'v2' });

  // Extracting data
  const { data: profile } = await oauth2.userinfo.get();

  // Extracting email and name
  const { email, name } = profile;

  if (!email) {
    throw new ApiError('Email not found in Google account', 400);
  }

  // Check if already registered
  const _AlreadyExists = await UserModel.findUnique({ where: { email } });

  if (_AlreadyExists) {
    return res.status(400).json({
      status: 'ALREADY_REGISTERED',
      message: 'User already exists, please log in.',
    });
  }

  // Create new user
  const _NewUser = await UserModel.create({
    data: {
      name,
      email,
      password: '',
    },
  });

  // Generate tokens
  const _AccessToken = _GenerateAccessToken({
    id: _NewUser.id,
    email: _NewUser.email,
  });

  // Extracting device
  const device = req.headers['user-agent'] || 'unknown';

  // Extracting IP
  const ip = req.ip;

  // Refresh token generated
  const _RefreshToken = await _GenerateRefreshToken(
    _NewUser.id,
    { id: _NewUser.id, email: _NewUser.email },
    device,
    ip
  );

  // Return
  res.status(201).json({
    token: _AccessToken,
    refreshToken: _RefreshToken,
    status: 'GOOGLE_REGISTERED',
    message: 'User registered with Google successfully.',
  });
});

/*
 * EXPORT
 */
export default GoogleRegisterCallback;
