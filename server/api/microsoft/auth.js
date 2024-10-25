import { ConfidentialClientApplication } from '@azure/msal-node'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const redirectUri = query.redirect_uri || "/"

  const msalConfig = {
    auth: {
      clientId: config.public.MS_GRAPH_CLIENT_ID,
      authority: `https://login.microsoftonline.com/common`,
      clientSecret: config.public.MS_GRAPH_CLIENT_SECRET,
    },
  }

  const clientApp = new ConfidentialClientApplication(msalConfig)

  const authUrl = await clientApp.getAuthCodeUrl({
    scopes: ['offline_access', 'User.Read', 'Calendars.ReadWrite'],
    redirectUri: config.public.MS_GRAPH_REDIRECT_URI,
    state: encodeURIComponent(redirectUri),
  })

  return sendRedirect(event, authUrl)
})