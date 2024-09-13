<template>
  <div class="container h-screen">
    <!-- Header section with the title and user email or login button -->
    <h1 class="absolute top-8 left-8 lg:left-12 text-2xl">Rendez.</h1>

    <!-- If the user is logged in, display their email, otherwise show the login button -->
    <Sheet v-if="user">
      <SheetTrigger as-child>
        <Button
          @click=""
          variant="outline"
          class="absolute px-2 top-8 right-8 lg:right-12 font-normal border-zinc-300 dark:border-zinc-600"
        >
          <Avatar class="w-6 h-6 mr-2 bg-zinc-100 dark:bg-zinc-600">
            <PersonIcon class="w-4 h-4 opacity-65"/>
          </Avatar>
          {{ displayName }}
        </Button>
      </SheetTrigger>
      <SheetContent class="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right"> Name </Label>
            <Input id="name" value="Pedro Duarte" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right"> Username </Label>
            <Input id="username" value="@peduarte" class="col-span-3" />
          </div>
        </div>
        <SheetFooter class="absolute bottom-4 w-3/4 sm:w-auto self-center">
          <Button
            @click="logout"
            class="px-4 py-2 mt-2 sm:mt-0 bg-red-500 text-white rounded-md"
            v-if="user"
          >
            Logout
          </Button>
          <SheetClose as-child>
            <Button type="submit"> Save changes </Button>
          </SheetClose>
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
import { CalendarIcon, EnterIcon, PlusCircledIcon, PersonIcon } from "@radix-icons/vue";
import { navigateTo } from "nuxt/app"; // Function for page navigation

// Using Supabase authentication for user management
const { $supabase } = useNuxtApp();

const displayName = ref(""); // Stores the user's display name, initialized as an empty string
const showDialog = ref(false); // Controls the dialog visibility
const newDisplayName = ref(""); // Holds the user input for the display name

/**
 * Fetch the currently authenticated user from Supabase.
 * If a user is logged in, their email is stored in the 'email' variable.
 */
const {
  data: { user },
} = await $supabase.auth.getUser();

if (user) {
  if (user.user_metadata.name) {
    displayName.value = user.user_metadata.name; // Update the email if a user is logged in
  } else {
    showDialog.value = true;
    console.log(showDialog.value);
  }
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
