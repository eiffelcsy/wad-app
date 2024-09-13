<template>
  <div class="container h-screen">
    <!-- Header section with the title and user email or login button -->
    <h1 class="absolute top-8 left-8 lg:left-12 text-2xl">Rendez.</h1>

    <!-- If the user is logged in, display their email, otherwise show the login button -->
    <p class="absolute top-8 right-8 lg:right-12" v-if="user">{{ email }}</p>
    <Button
      @click="toLogin"
      variant="outline"
      class="absolute top-8 right-8 lg:right-12 border-zinc-300 dark:border-zinc-600"
      v-else
    >
      <EnterIcon class="w-4 h-4 mr-2" />Login
    </Button>

    <!-- Main content section with title, description, and action buttons -->
    <div
      class="w-full h-[95%] content-center md:w-2/3 md:px-8 lg:w-1/2 lg:px-16"
    >
      <h1
        class="text-3xl md:text-4xl lg:text-5xl text-zinc-800 dark:text-zinc-100 font-bold my-2"
      >
        Simplify Scheduling. Amplify Collaboration.
      </h1>
      <p
        class="text-base md:text-lg lg:text-xl text-zinc-400 dark:text-zinc-500 my-2 lg:my-4 lg:pr-4"
      >
        Rendez makes it easy to coordinate meetings and events. Share your
        availability, let others pick a time, and get notified instantly.
      </p>
      <!-- Button to create an event (visible if logged in) -->
      <Button
        class="mt-2 mr-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
        @click="toCreate"
      >
        Create Event <CalendarIcon class="ml-2" />
      </Button>

      <!-- Button to join an event -->
      <Button
        variant="outline"
        class="mt-2 ml-2 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
        @click="toJoin"
      >
        Join Event <PlusCircledIcon class="ml-2" />
      </Button>
    </div>

    <!-- Logout button appears if user is logged in -->
    <Button
      @click="logout"
      class="px-4 py-2 bg-red-500 text-white rounded-md"
      v-if="user"
    >
      Logout
    </Button>
  </div>
</template>

<script setup>
/**
 * Importing necessary icons from @radix-icons/vue and
 * the navigateTo method from Nuxt's app navigation system.
 */
import { CalendarIcon, EnterIcon, PlusCircledIcon } from "@radix-icons/vue";
import { navigateTo } from "nuxt/app"; // Function for page navigation

// Using Supabase authentication for user management
const { $supabase } = useNuxtApp();

const email = ref(""); // Stores the user's email, initialized as an empty string

/**
 * Fetch the currently authenticated user from Supabase.
 * If a user is logged in, their email is stored in the 'email' variable.
 */
const {
  data: { user },
} = await $supabase.auth.getUser();

if (user) {
  email.value = user.email; // Update the email if a user is logged in
}

/**
 * Logs the user out using Supabase's authentication.
 * If successful, redirects to the homepage. If an error occurs, it logs the error.
 */
const logout = async () => {
  const { error } = await $supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message); // Logs the error if something goes wrong
  } else {
    console.log("Logged out successfully!");
    navigateTo("/"); // Redirects to the homepage after successful logout
  }
};

/**
 * Redirects the user to the login page.
 */
const toLogin = () => {
  navigateTo("/auth"); // Navigate to authentication page (login/register)
};

/**
 * Redirects the user to the 'Create Event' page if logged in.
 * Otherwise, it navigates to the login page.
 */
const toCreate = () => {
  if (user) {
    navigateTo("/create"); 
  } else {
    navigateTo("/auth");
  }
};

/**
 * Redirects the user to the 'Join Event' page.
 */
const toJoin = () => {
  navigateTo("/join");
};
</script>
