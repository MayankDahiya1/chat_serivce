/*
 * IMPORTS
 */
import { google } from 'googleapis';

/*
 * CONST
 */
const _Oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/*
 * FUNCTION
 */
const GoogleToken = asyncHandler(async (req, res) => {
  // Url generation
  const _Url = _Oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['profile', 'email'],
  });

  if (!_Url || _Url instanceof Error) {
    throw new ApiError('Somthing went wrong!');
  }

  // Return successfully
  return res.status(200).json({
    status: 'URL_GENERATED',
    message: 'Google OAuth URL generated successfully',
    url: _Url,
  });
});

/*
 * EXPORT
 */
export default GoogleToken;
