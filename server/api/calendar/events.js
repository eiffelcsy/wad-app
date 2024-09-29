import { OAuth2Client } from "google-auth-library";
import { google } from 'googleapis';


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const tokensCookie = getCookie(event, "google_tokens");

  if (!tokensCookie) {
    throw createError({ statusCode: 401, message: "User not authenticated" });
  }

  const tokens = JSON.parse(tokensCookie);

  const oauth2Client = new OAuth2Client(
    config.public.GAPI_CLIENT_ID,
    config.public.GAPI_CLIENT_SECRET,
    config.public.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials(tokens);

  // Handle token refresh
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      // Store the new refresh token in the cookie
      setCookie(event, "google_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  });

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // List all calendars
    const calendarList = await calendar.calendarList.list({minAccessRole: "owner"});

    const eventsPromises = calendarList.data.items.map(async (calendarItem) => {
      const eventsResponse = await calendar.events.list({
        calendarId: calendarItem.id,
        showDeleted: false,
        singleEvents: true,
        maxResults: 2500,
        orderBy: "startTime",
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
    console.error("Error fetching events:", error);
    throw createError({ statusCode: 500, message: "Error fetching events" });
  }
});
