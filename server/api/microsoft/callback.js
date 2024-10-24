import { ConfidentialClientApplication } from '@azure/msal-node'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  const msalConfig = {
    auth: {
      clientId: config.public.MS_GRAPH_CLIENT_ID,
      authority: `https://login.microsoftonline.com/common`,
      clientSecret: config.public.MS_GRAPH_CLIENT_SECRET,
    },
  }

  const clientApp = new ConfidentialClientApplication(msalConfig)

  const query = getQuery(event)
  const code = query.code
  const state = query.state

  if (!code) {
    throw createError({ statusCode: 400, message: 'No code provided' })
  }

  try {
    const tokenResponse = await clientApp.acquireTokenByCode({
      code: code,
      scopes: ['offline_access', 'User.Read', 'Calendars.ReadWrite'],
      redirectUri: config.public.MS_GRAPH_REDIRECT_URI,
      state: state,
    })

    const { accessToken, refreshToken, expiresOn } = tokenResponse

    const { error } = await supabase.from('mtokens').upsert(
      {
        user_id: user.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresOn,
      },
      { onConflict: ['user_id'] }
    )

    if (error) {
      throw createError({ statusCode: 500, message: JSON.stringify(tokenResponse) })
    }

    const redirectTo = state ? decodeURIComponent(state) : '/'
    return sendRedirect(event, redirectTo)
  } catch (error) {
    console.error('Error getting tokens:', error)
    throw createError({ statusCode: 500, message: error })
  }
})
