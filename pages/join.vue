<template>
  <div class="container h-screen flex flex-col items-left justify-center">
    <!-- Header section with the title -->
    <div class="my-2">
      <h1
        class="text-4xl md:text-5xl lg:text-6xl text-zinc-800 dark:text-zinc-100 font-bold"
      >
        Join Event.
      </h1>
    </div>

    <!-- Form for entering the join code -->
    <div>
      <!-- Prevents default form submission and triggers handleJoin when the form is submitted -->
      <form @submit.prevent="handleJoin" class="space-y-4 sm:space-y-6">
        <!-- Input field for the event code -->
        <div class="mt-2">
          <Input
            id="join-code"
            type="text"
            placeholder="Enter Code"
            required
            class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600"
          />
        </div>

        <!-- Join button that submits the form -->
        <Button class="w-full mt-0">Join</Button>
      </form>
    </div>

    <!-- Button to navigate back to the home page -->
    <Button
      @click="backHome"
      variant="link"
      class="w-full text-zinc-500 dark:text-zinc-400 mt-8"
    >
      <ArrowLeftIcon class="w-4 h-4 mr-2" />Back to Home
    </Button>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@radix-icons/vue'; // Importing the arrow icon component from Radix Icons
import { navigateTo } from 'nuxt/app'; // Importing the navigation function from Nuxt.js

/**
 * Redirects the user to the home page.
 */
const backHome = () => {
  navigateTo("/");
};

/**
 * Placeholder function to handle the form submission for joining an event.
 * This should contain the logic to process the "Join Code" entered by the user.
 */
const handleJoin = () => {
  // You can implement the logic here for what should happen when the form is submitted.
  // For example, validating the join code and navigating to the event page.
  console.log("Join event with the provided code");
};
</script>
