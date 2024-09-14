<template>
  <div class="container h-screen">
    <!-- Header section with the title and user email or login button -->
    <h1
      class="absolute top-8 left-8 lg:left-12 text-lg font-bold tracking-widest"
    >
      RENDEZ
    </h1>

    <!-- If the user is logged in, display their email, otherwise show the login button -->
    <Sheet v-if="user">
      <SheetTrigger as-child>
        <Button
          @click=""
          variant="outline"
          class="absolute px-2 top-7 right-8 lg:right-12 font-semibold border-zinc-300 dark:border-zinc-600"
        >
          <Avatar class="w-6 h-6 mr-2 bg-zinc-100 dark:bg-zinc-600">
            <PersonIcon class="w-4 h-4 opacity-65" />
          </Avatar>
          {{ displayName }}
        </Button>
      </SheetTrigger>
      <SheetContent class="flex flex-col">
        <SheetHeader class="flex flex-row items-center">
          <Avatar class="w-10 h-10 mr-2 bg-zinc-100 dark:bg-zinc-600">
            <PersonIcon class="w-2/3 h-2/3 opacity-65" />
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
          <NuxtLink to="/profile" class="flex flex-row items-center h-6">
            <UserRoundIcon size="16px" strokeWidth="{1}" class="mr-2" /> Your
            profile
          </NuxtLink>
          <NuxtLink to="/events" class="flex flex-row items-center h-6">
            <CalendarDaysIcon size="16px" strokeWidth="{1}" class="mr-2" /> Your
            events
          </NuxtLink>
          <NuxtLink to="/teams" class="flex flex-row items-center h-6">
            <UsersRoundIcon size="16px" strokeWidth="{1}" class="mr-2" /> Your
            teams
          </NuxtLink>
          <NuxtLink to="/projects" class="flex flex-row items-center h-6">
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
    <Button
      @click="toLogin"
      variant="outline"
      class="absolute top-8 right-8 lg:right-12 border-zinc-300 dark:border-zinc-600"
      v-else
    >
      <EnterIcon class="w-4 h-4 mr-2" />Login
    </Button>

    <!-- Main content section with title, description, and action buttons for anonymous users -->
    <div
      class="w-full h-[95%] content-center md:w-2/3 md:px-8 lg:w-1/2 lg:px-16"
      v-if="!user"
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

    <!-- Main content section for logged-in users -->
    <div class="w-full pt-24 md:pt-28 lg:pt-32 md:w-2/3 md:px-8 lg:w-1/2 lg:px-16" v-else>
      <h1 class="text-4xl md:text-5xl lg:text-6x; font-semibold">Hi, {{ displayName }}!</h1>
      <!-- TODO: Add homepage content for logged-in users -->
      Insert homepage content for logged-in users here
    </div>
    

    <Dialog :open="showDialog">
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>Update Display Name</DialogTitle>
        <DialogDescription>
          Please enter your display name to continue.
        </DialogDescription>

        <Input
          v-model="newDisplayName"
          placeholder="Enter your display name"
          class="my-4"
        />

        <div class="flex justify-end">
          <Button
            @click="saveDisplayName"
            class="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
/**
 * Importing necessary icons from @radix-icons/vue and
 * the navigateTo method from Nuxt's app navigation system.
 */
import {
  CalendarIcon,
  EnterIcon,
  PlusCircledIcon,
  PersonIcon,
} from "@radix-icons/vue";
import {
  UserRoundIcon,
  UsersRoundIcon,
  CalendarDaysIcon,
  BoxesIcon,
  LogOutIcon,
} from "lucide-vue-next";
import { navigateTo } from "nuxt/app"; // Function for page navigation

// Using Supabase authentication for user management
const { $supabase } = useNuxtApp();

const showDialog = ref(false); // Controls the dialog visibility
const newDisplayName = ref(""); // Holds the user input for the display name
const displayName = ref(""); // Stores the user's display name, initialized as an empty string
const email = ref("");

/**
 * Fetch the currently authenticated user from Supabase.
 * If a user is logged in, their details are stored in the respective variables.
 */
const {
  data: { user },
} = await $supabase.auth.getUser();

if (user) {
  if (user.user_metadata.name) {
    displayName.value = user.user_metadata.name;
  } else {
    showDialog.value = true;
  }
  email.value = user.email;
}

// Function to save the display name
const saveDisplayName = async () => {
  if (newDisplayName.value) {
    // Update the user profile in Supabase
    const { error } = await $supabase.auth.updateUser({
      data: { name: newDisplayName.value },
    });

    if (error) {
      console.error("Error updating profile:", error.message);
    } else {
      displayName.value = newDisplayName.value; // Update local displayName variable
      showDialog.value = false; // Close the dialog
    }
  }
};

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
    location.reload();
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
