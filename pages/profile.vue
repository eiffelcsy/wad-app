<!-- TODO: Styling, API connections, Edit Profile -->
<template>
  <div>
    <PageHeader/>
    <div class="container h-screen">
      <div
        class="w-full mt-8 md:mt-10 lg:mt-12 flex flex-col items-center"
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
          class="w-full flex flex-col lg:flex-row gap-8 mt-16 justify-between items-center lg:justify-center"
        >
          <gCalButton class="w-full max-w-96"></gCalButton>
          <Button class="w-full max-w-96"
            ><img
              src="/icons/microsoft.svg"
              alt="gIcon"
              class="mr-4 h-4 w-4 invert dark:invert-0"
            />Connect to Microsoft Outlook</Button
          >
          <Button class="w-full max-w-96"
            ><img
              src="/icons/apple.svg"
              alt="gIcon"
              class="mr-4 h-4 w-4 invert dark:invert-0"
            />Connect to Apple Calendar</Button
          >
        </div>
      </div>
    </div>
    <PageFooter/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { gCalButton } from "@/components/ui/gcal-button";
import { PageHeader } from "@/components/ui/page-header";
import { PageFooter } from "@/components/ui/page-footer";

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);

</script>
