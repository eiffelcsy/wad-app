export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = useSupabaseSession();
  
    if (!session.value && to.path === '/') {
      return navigateTo('/landing')
    }
})