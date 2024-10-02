import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const supabase = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "User not authenticated" });
  }

  const query = getQuery(event);
  const timeMin = query.timeMin;
  const timeMax = query.timeMax;

  if (!timeMin || !timeMax) {
    throw createError({
      statusCode: 400,
      message: "timeMin and timeMax parameters are required",
    });
  }

  const { data: tokenData, error } = await supabase
    .from("gtokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !tokenData) {
    throw createError({ statusCode: 401, message: "No tokens found for user" });
  }

  const tokens = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry_date: tokenData.expires_at,
  };

  const oauth2Client = new OAuth2Client(
    config.public.GAPI_CLIENT_ID,
    config.public.GAPI_CLIENT_SECRET,
    config.public.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials(tokens);

  const isTokenExpired = new Date() > new Date(tokens.expiry_date);
  if (isTokenExpired) {
    try {
      // Refresh the access token using the refresh token
      const newTokens = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(newTokens.credentials);

      // Update tokens in the Supabase database
      const { error: updateError } = await supabase
        .from("gtokens")
        .update({
          access_token: newTokens.credentials.access_token,
          expires_at: new Date(newTokens.credentials.expiry_date),
        })
        .eq("user_id", user.id);

      if (updateError) {
        throw createError({ statusCode: 500, message: updateError.message });
      }
    } catch (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // List all calendars
    const calendarList = await calendar.calendarList.list({
      minAccessRole: "owner",
    });

    const eventsPromises = calendarList.data.items.map(async (calendarItem) => {
      const eventsResponse = await calendar.events.list({
        calendarId: calendarItem.id,
        showDeleted: false,
        singleEvents: true,
        maxResults: 2500,
        orderBy: "startTime",
        timeMin: timeMin,
        timeMax: timeMax,
      });
      const events = eventsResponse.data.items || [];
      // Attach calendar name to each event
      events.forEach((event) => {
        event.calendarName = calendarItem.summary;
      });
      return events;
    });

    const allEventsArrays = await Promise.all(eventsPromises);
    const allEvents = allEventsArrays.flat();

    // Sort events by start time
    allEvents.sort((a, b) => {
      const dateA = new Date(a.start.dateTime || a.start.date);
      const dateB = new Date(b.start.dateTime || b.start.date);
      return dateA - dateB;
    });

    return allEvents;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error fetching events" });
  }
});
