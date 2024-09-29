import { OAuth2Client } from 'google-auth-library';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const oauth2Client = new OAuth2Client(
        config.public.GAPI_CLIENT_ID,
        config.public.GAPI_CLIENT_SECRET,
        config.public.GOOGLE_REDIRECT_URI
    );
  
    const query = getQuery(event);
    const code = query.code;
  
    if (!code) {
      throw createError({ statusCode: 400, message: 'No code provided' });
    }
  
    try {
      const { tokens } = await oauth2Client.getToken(code);
  
      // Store tokens in a secure cookie or session
      setCookie(event, 'google_tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // e.g., 30 days
      });
  
      return sendRedirect(event, '/testpage');
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw createError({ statusCode: 500, message: 'Authentication failed' });
    }
  });
  