export default defineNuxtRouteMiddleware(async (to, from) => {
  
  if (process.server) return;

  const allowedPaths = [
    '/',
    '/auth',
    '/join'
  ]

  const { $supabase } = useNuxtApp();

  const { data: { session } } = await $supabase.auth.getSession();

  if (!session && !(allowedPaths.includes(to.path))) {
    return navigateTo('/auth');
  }
});
