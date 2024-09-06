export default defineNuxtRouteMiddleware(async (to, from) => {
  
  if (process.server) return;

  const { $supabase } = useNuxtApp();

  const { data: { session } } = await $supabase.auth.getSession();

  if (!session && to.path !== '/auth') {
    return navigateTo('/auth');
  }

  if (session && to.path === '/auth') {
    return navigateTo('/');
  }
});
