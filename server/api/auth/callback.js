import { OAuth2Client } from "google-auth-library";
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const supabase = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  const oauth2Client = new OAuth2Client(
    config.public.GAPI_CLIENT_ID,
    config.public.GAPI_CLIENT_SECRET,
    config.public.GOOGLE_REDIRECT_URI
  );

  const query = getQuery(event);
  const code = query.code;
  const state = query.state;

  if (!code) {
    throw createError({ statusCode: 400, message: "No code provided" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token, expiry_date } = tokens;

    const { error } = await supabase.from("gtokens").upsert(
      {
        user_id: user.id,
        access_token: access_token,
        refresh_token: refresh_token,
        expires_at: new Date(expiry_date),
      },
      { onConflict: ["user_id"] }
    );

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    const redirectTo = state ? decodeURIComponent(state) : "/";
    return sendRedirect(event, redirectTo);
  } catch (error) {
    console.error("Error getting tokens:", error);
    throw createError({ statusCode: 500, message: error });
  }
});
