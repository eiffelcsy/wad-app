<!-- TODO: Styling, API connections, Edit Profile -->
<template>
  <div>
    <NuxtLink
      to="/"
      class="absolute top-8 left-8 md:left-12 lg:left-16 text-lg font-bold tracking-widest"
    >
      RENDEZ
    </NuxtLink>
    <div>
      <Sheet>
        <SheetTrigger as-child>
          <Button
            @click=""
            variant="outline"
            size="icon"
            class="absolute px-2 top-7 right-8 md:right-12 lg:right-16 font-semibold border-zinc-200 dark:border-zinc-700"
          >
            <Avatar class="w-8 h-8 bg-zinc-100 dark:bg-zinc-600">
              <UserRoundIcon size="20px" strokeWidth="{1}" class="opacity-60" />
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent class="flex flex-col">
          <SheetHeader class="flex flex-row items-center">
            <Avatar class="w-10 h-10 mr-2 bg-zinc-100 dark:bg-zinc-600">
              <UserRoundIcon size="24px" strokeWidth="{1}" class="opacity-60" />
            </Avatar>
            <div>
              <SheetTitle class="text-left">
                {{ displayName }}
              </SheetTitle>
              <SheetDescription class="text-left">
                {{ email }}
              </SheetDescription>
            </div>
          </SheetHeader>
          <div class="flex flex-col gap-2 py-4">
            <NuxtLink
              to="/profile"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
            >
              <UserRoundIcon size="16px" strokeWidth="{1}" class="mr-2" /> Your
              profile
            </NuxtLink>
            <NuxtLink
              to="/events"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
            >
              <CalendarDaysIcon size="16px" strokeWidth="{1}" class="mr-2" />
              Your events
            </NuxtLink>
            <NuxtLink
              to="/teams"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
            >
              <UsersRoundIcon size="16px" strokeWidth="{1}" class="mr-2" /> Your
              teams
            </NuxtLink>
            <NuxtLink
              to="/projects"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
            >
              <BoxesIcon size="16px" strokeWidth="{1}" class="mr-2" /> Your
              projects
            </NuxtLink>

            <Separator class="my-2" />
            <Button
              @click="logout"
              variant="link"
              class="justify-start font-normal text-base p-0 h-6"
              v-if="user"
            >
              <LogOutIcon size="16px" strokeWidth="{1}" class="mr-2" />
              Logout
            </Button>
          </div>
          <SheetFooter class="absolute bottom-4 w-3/4 sm:w-auto self-center">
            <SheetClose as-child> </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
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
          <Button id="gCal">
            <img
              src="/icons/google.svg"
              alt="gIcon"
              class="mr-4 h-4 w-4 invert dark:invert-0"
            />
            Connect to Google Calendar</Button
          >
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
import {
  UserRoundIcon,
  UsersRoundIcon,
  CalendarDaysIcon,
  BoxesIcon,
  LogOutIcon,
} from "lucide-vue-next";
import { useNuxtApp } from "nuxt/app";
import { ref } from "vue";

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
