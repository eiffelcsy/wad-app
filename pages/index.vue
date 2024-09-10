<template>
  <ClientOnly>
    <div class="container h-screen">
      <h1 class="absolute top-8 left-8 lg:left-12 text-2xl">Rendez</h1>
      <p class="absolute top-8 right-8 lg:right-12" v-if="user">{{ email }}</p>
      <Button
        @click="toLogin"
        variant="outline"
        class="absolute top-8 right-8 lg:right-12"
        v-else
        ><EnterIcon class="w-4 h-4 mr-2" />Login</Button
      >
      <div
        class="w-full h-screen content-center md:w-2/3 md:px-8 lg:w-1/2 lg:px-16"
      >
        <h1
          class="text-4xl md:text-5xl lg:text-6xl text-zinc-800 dark:text-zinc-300 font-bold my-2"
        >
          Simplify Your Scheduling
        </h1>
        <p
          class="text-lg lg:text-xl text-zinc-400 dark:text-zinc-500 my-2 lg:my-4 lg:pr-4"
        >
          Rendez makes it easy to coordinate meetings and events. Share your
          availability, let others pick a time, and get notified instantly.
        </p>
        <Button
          class="mt-2 bg-zinc-800 dark:bg-zinc-300 text-white dark:text-black"
        >
          Create an Event <CalendarIcon class="ml-2" />
        </Button>
      </div>

      <Button
        @click="logout"
        class="px-4 py-2 bg-red-500 text-white rounded-md"
        v-if="session"
      >
        Logout
      </Button>
      <Button
        @click="toggleDarkMode"
        class="absolute bottom-4 right-4 p-2 size-9 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-full"
      >
        <SunIcon v-if="isDark" />
        <MoonIcon v-else />
      </Button>
    </div>
  </ClientOnly>
</template>

<script setup>
import { SunIcon, MoonIcon, CalendarIcon, EnterIcon } from "@radix-icons/vue";
import { navigateTo } from "nuxt/app";

const { $supabase } = useNuxtApp();

const isDark = ref(false);
const email = ref('');

const { data: { user } } = await $supabase.auth.getUser();
if (user) {
  email.value = user.email;
}

const logout = async () => {
  const { error } = await $supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
  } else {
    console.log("Logged out successfully!");
    navigateTo("/");
  }
};

const toLogin = () => {
  navigateTo("/auth");
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
</script>
