<template>
  <div
    class="flex flex-row justify-between py-4 px-8 md:px-12 lg:px-16 border-b"
  >
    <div class="flex flex-row items-center">
      <NuxtImg
        src="/images/logo_light.png"
        class="size-12 mr-2"
        v-if="$colorMode.value === 'light'"
      />
      <NuxtImg
        src="/images/logo_dark.png"
        class="size-12 mr-2"
        v-if="$colorMode.value === 'dark'"
      />
      <NuxtLink v-if="!isMobile" to="/" prefetch="true" 
        ><p class="text-xl font-bold tracking-wider hover:opacity-80">
          Meet<span class="text-indigo-600 dark:text-indigo-500">L</span>ah
        </p></NuxtLink
      >
    </div>
    <div class="flex gap-1">
      <Notifications />
      <Sheet>
        <SheetTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="font-semibold border-zinc-200 dark:border-zinc-700 hover:bg-transparent"
          >
            <Avatar class="w-8 h-8 border bg-zinc-50 dark:bg-zinc-900">
              <img :src="profilePictureUrl" />
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent class="flex flex-col">
          <SheetHeader class="flex flex-row items-center">
            <Avatar class="w-10 h-10 mr-2">
              <img :src="profilePictureUrl" />
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
              to="/"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
              ><HouseIcon size="16px" strokeWidth="{1}" class="mr-2" /> Home
            </NuxtLink>
            <Separator class="my-2" />
            <NuxtLink
              to="/create-event"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
              ><CalendarPlusIcon size="16px" strokeWidth="{1}" class="mr-2" />
              Create event
            </NuxtLink>
            <NuxtLink
              to="/create-team"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
              ><UserRoundPlusIcon size="16px" strokeWidth="{1}" class="mr-2" />
              Create team
            </NuxtLink>
            <NuxtLink
              to="/create-project"
              class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
              ><PackagePlusIcon size="16px" strokeWidth="{1}" class="mr-2" />
              Create project
            </NuxtLink>
            <Separator class="my-2" />
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
  </div>
</template>

<script setup>
import { useMediaQuery } from "@vueuse/core";
import {
  UsersRoundIcon,
  CalendarDaysIcon,
  BoxesIcon,
  LogOutIcon,
  HouseIcon,
  CalendarPlusIcon,
  PackagePlusIcon,
  UserRoundPlusIcon,
} from "lucide-vue-next";
import { Notifications } from "@/components/custom/notifications";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
const profilePictureUrl = ref("");
const isMobile = useMediaQuery("(max-width: 600px)");

if (
  user.value.app_metadata.provider == "email" &&
  !user.value.app_metadata.providers.includes("google")
) {
  const { data: profilePicData, error: profilePicError } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(`pics/default-${user.value.id}.png`);

  if (profilePicError) {
    console.error("Could not fetch profile picture");
  }
  
  profilePictureUrl.value = profilePicData.publicUrl;
} else {
  profilePictureUrl.value = user.value.user_metadata.avatar_url;
}

/**
 * Logs the user out using Supabase's authentication.
 * If successful, redirects to the homepage. If an error occurs, it logs the error.
 */
const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message); // Logs the error if something goes wrong
  } else {
    console.log("Logged out successfully!");
    location.reload();
  }
};
</script>
