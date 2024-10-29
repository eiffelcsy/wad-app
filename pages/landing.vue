<template>
  <div>
    <div
      class="flex flex-row justify-between py-4 px-8 md:px-12 lg:px-16 bg-zinc-50 dark:bg-black"
    >
      <div class="flex items-center">
        <NuxtLink to="/" class="">
          <p class="text-xl font-bold tracking-wider">MeetLah</p>
        </NuxtLink>
      </div>
      <Button
        @click="toLogin"
        variant="outline"
        class=" border-zinc-300 dark:border-zinc-600"
      >
        <EnterIcon class="w-4 h-4 mr-2" />Login
      </Button>
    </div>
    <h1 class="text-3xl">Work in Progress</h1>
  </div>
</template>

<script lang="ts" setup>
import {
  EnterIcon,
} from "@radix-icons/vue";
import { navigateTo } from "nuxt/app";


const toLogin = () => {
  navigateTo("/auth");
};
</script>

<style>

</style>