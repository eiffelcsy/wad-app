import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
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

  // Fetch the stored tokens from Supabase
  const { data: tokenData, error } = await supabase
    .from("mtokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !tokenData) {
    throw createError({ statusCode: 401, message: "No tokens found for user" });
  }

  // Access token from Supabase (since you're not using refresh tokens anymore)
  const accessToken = tokenData.access_token;

  const expiresOn = new Date(tokenData.expiresOn); // Assuming expiresOn is in UTC
  const currentTime = new Date(); // Current time in local time

  // Convert current time to UTC for comparison
  const currentTimeUTC = new Date(currentTime.toISOString());
  const isTokenExpired = currentTimeUTC > expiresOn;
  
  if (isTokenExpired) {
    throw createError({
      statusCode: 401,
      message: `${new Date(tokenData.expires_at)} ${new Date()}`,
    });
  }

  // Define the API URL with appropriate filters for date range
  const url = `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${timeMin}&endDateTime=${timeMax}&$orderby=start/dateTime`;

  try {
    // Fetch events from the Microsoft Graph API using native fetch
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: `Error fetching events from Microsoft Graph: ${response.statusText}`,
      });
    }

    const eventsData = await response.json();
    const events = eventsData.value;

    // Sort events by start time (Microsoft Graph already orders by start dateTime, but this ensures it)
    events.sort((a, b) => {
      const dateA = new Date(a.start.dateTime);
      const dateB = new Date(b.start.dateTime);
      return dateA - dateB;
    });

    return events;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Error fetching events: ${error.message}`,
    });
  }
});
