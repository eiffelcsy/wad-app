<template>
  <ClientOnly>
    <div class="container">
      <h1>{{ title }}</h1>
      <p>Welcome to your Vue.js App!</p>
      <Button
        @click="logout"
        class="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Logout
      </Button>
    </div>
  </ClientOnly>
</template>

<script setup>
const { $supabase } = useNuxtApp();

const logout = async () => {
  const { error } = await $supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
  } else {
    console.log("Logged out successfully!");
    navigateTo("/auth");
  }
};
</script>
<script src="https://accounts.google.com/gsi/client" async></script>
