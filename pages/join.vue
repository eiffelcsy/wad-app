<template>
  <div class="container h-screen flex flex-col items-left justify-center">
    <div class="my-2">
      <h1
        class="text-4xl md:text-5xl lg:text-6xl text-zinc-800 dark:text-zinc-100 font-bold"
      >
        Join Event
      </h1>
    </div>
    <div>
      <form @submit.prevent="handleJoin" class="space-y-4 sm:space-y-6">
        <div class="mt-2">
          <Input
            id="join-code"
            type="text"
            placeholder="Enter Code"
            required
            class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600"
          />
        </div>
        <Button class="w-full mt-0">Join</Button>
      </form>
    </div>
    <Button
        @click="backHome"
        variant="link"
        class="w-full text-zinc-500 dark:text-zinc-400 mt-8"
        ><ArrowLeftIcon class="w-4 h-4 mr-2" />Back to Home</Button
      >
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@radix-icons/vue';

const backHome = () => {
  navigateTo("/");
};

</script>
