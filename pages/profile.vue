<!-- TODO: Styling, API connections, Edit Profile -->
<template>
  <div>
    <Header/>
    <div class="container h-screen">
      <div
        class="w-full pt-24 md:pt-28 md:px-8 lg:pt-32 lg:px-12 flex flex-col items-center"
      >
        <div class="flex flex-col items-center">
          <Avatar class="mt-2" size="lg"></Avatar>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold mt-6">
            {{ displayName }}
          </h1>
          <p class="font-light">{{ email }}</p>
        </div>
        <div class="w-full md:w-2/3 lg:w-1/2 flex flex-row mt-8 justify-evenly">
          <div class="flex flex-col items-center">
            <h1 class="text-3xl mb-2">5</h1>
            <p>Events</p>
          </div>
          <div class="flex flex-col items-center">
            <h1 class="text-3xl mb-2">2</h1>
            <p>Teams</p>
          </div>
          <div class="flex flex-col items-center">
            <h1 class="text-3xl mb-2">3</h1>
            <p>Projects</p>
          </div>
        </div>
        <div
          class="w-5/6 flex flex-col lg:flex-row mt-16 h-40 justify-between lg:justify-center"
        >
          <GCalButton></GCalButton>
          <Button
            ><img
              src="/icons/microsoft.svg"
              alt="gIcon"
              class="mr-4 h-4 w-4 invert dark:invert-0"
            />Connect to Microsoft Outlook</Button
          >
          <Button
            ><img
              src="/icons/apple.svg"
              alt="gIcon"
              class="mr-4 h-4 w-4 invert dark:invert-0"
            />Connect to Apple Calendar</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from "nuxt/app";
import { ref } from "vue";
import Header from "../components/ui/header/header.vue";
import GCalButton from "../components/ui/gcal-button/gCalButton.vue";

const { $supabase } = useNuxtApp();

const displayName = ref("");
const email = ref("");

const {
  data: { user },
} = await $supabase.auth.getUser();

if (user) {
  email.value = user.email;
  displayName.value = user.user_metadata.name;
}
</script>
