import { match } from 'path-to-regexp';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const allowedPaths = [
    '/',
    '/auth',
    '/join',
    '/event/:eventId',
  ];

  const { $supabase } = useNuxtApp();
  const {
    data: { session },
  } = await $supabase.auth.getSession();

  // Function to check if the path matches any allowed patterns
  function isAllowed(path) {
    return allowedPaths.some((pathPattern) => {
      const matcher = match(pathPattern, { decode: decodeURIComponent });
      return matcher(path) !== false;
    });
  }

  if (!session && !isAllowed(to.path)) {
    return navigateTo('/auth');
  }
});
