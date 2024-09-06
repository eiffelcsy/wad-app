import { createClient, SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) =>  {
    const config = useRuntimeConfig()

    const supabaseUrl: string = config.public.SUPABASE_URL as string
    const supabaseKey: string = config.public.SUPABASE_KEY as string

    const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

    nuxtApp.provide('supabase', supabase)
})
