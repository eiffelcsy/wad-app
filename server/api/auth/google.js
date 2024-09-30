import { OAuth2Client } from 'google-auth-library';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const oauth2Client = new OAuth2Client(
      config.public.GAPI_CLIENT_ID,
      config.public.GAPI_CLIENT_SECRET,
      config.public.GOOGLE_REDIRECT_URI
    );
  
    const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });
  
    return sendRedirect(event, authUrl);
  });
  