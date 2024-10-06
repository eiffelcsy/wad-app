<template>
  <div>
    <NuxtLink
      to="/"
      class="absolute top-8 left-8 md:left-12 lg:left-16 text-xl font-bold tracking-wider"
      >MeetLah</NuxtLink
    >
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
            to="/"
            class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
            ><HouseIcon size="16px" strokeWidth="{1}" class="mr-2" /> Home
          </NuxtLink>
          <Separator class="my-2" />
          <NuxtLink
            to="/create-event"
            class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
            ><CalendarPlusIcon size="16px" strokeWidth="{1}" class="mr-2" /> Create event
          </NuxtLink>
          <NuxtLink
            to="/create-project"
            class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
            ><PackagePlusIcon size="16px" strokeWidth="{1}" class="mr-2" /> Create project
          </NuxtLink>
          <Separator class="my-2" />
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
</template>

<script setup>
import {
  UserRoundIcon,
  UsersRoundIcon,
  CalendarDaysIcon,
  BoxesIcon,
  LogOutIcon,
  HouseIcon,
  CalendarPlusIcon,
  PackagePlusIcon,
} from "lucide-vue-next";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);

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
