import { OAuth2Client } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.SUPABASE_URL,
    config.public.SUPABASE_KEY
  );

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

    const { data: user, error: userError } = await supabase.auth.getUser();

    const userId = user.id;

    const { error } = await supabase.from("gTokens").upsert(
      {
        user_id: userId,
        access_token: access_token,
        refresh_token: refresh_token,
        expires_at: new Date(expiry_date),
      },
      { onConflict: ["user_id"] }
    );

    if (error) {
      throw createError({ statusCode: 500, message: "Failed to store tokens" });
    }

    const redirectTo = state ? decodeURIComponent(state) : "/";
    return sendRedirect(event, redirectTo);
  } catch (error) {
    console.error("Error getting tokens:", error);
    throw createError({ statusCode: 500, message: "Authentication failed" });
  }
});
