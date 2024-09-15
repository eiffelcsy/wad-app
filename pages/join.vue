<template>
  <div
    class="container w-full max-w-[32rem] p-16 h-screen flex flex-col items-left justify-center"
  >
    <!-- Header section with the title -->
    <div class="my-2">
      <h1
        class="text-4xl md:text-5xl lg:text-6xl text-zinc-800 dark:text-zinc-100 font-semibold"
      >
        Join Event
      </h1>
    </div>

    <!-- Form for entering the join code -->
    <div>
      <!-- Prevents default form submission and triggers handleJoin when the form is submitted -->
      <form @submit.prevent="handleJoin" class="space-y-4 sm:space-y-6">
        <!-- Input field for the event code -->
        <div class="mt-4">
          <Input
            v-model="joinCode"
            id="join-code"
            type="text"
            placeholder="Enter Code"
            required
            class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600"
          />
        </div>

        <!-- Join button that submits the form -->
        <Button
          class="w-full mt-0 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
          >Join</Button
        >
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
    <Toaster />
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from "@radix-icons/vue"; // Importing the arrow icon component from Radix Icons
import { navigateTo } from "nuxt/app"; // Importing the navigation function from Nuxt.js
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";

const { $supabase } = useNuxtApp();
const { toast } = useToast();

const joinCode = ref("");

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
const handleJoin = async () => {
  const code = joinCode.value.trim();

  if (code.length !== 6) {
    // Display an error toast if the join code is of invalid length
    toast({
      title: "Invalid Join Code.",
      description: "Please enter a 6-character Join Code.",
      variant: "destructive",
      action: h(
        ToastAction,
        {
          altText: "Try again",
        },
        {
          default: () => "Try again",
        }
      ),
    });
    return;
  }

  try {
    // Query the 'events' table in Supabase to check if the code exists
    const { data, error } = await $supabase
      .from("events")
      .select("code")
      .eq("code", code)
      .single();

    if (error || !data) {
      // Display an error toast if the code does not exist
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Could not find your event.",
        variant: "destructive",
        action: h(
          ToastAction,
          {
            altText: "Try again",
          },
          {
            default: () => "Try again",
          }
        ),
      });
    } else {
      // Navigate to the event page if the code exists
      navigateTo(`/event/${code}`);
    }
  } catch (err) {
    // Handle any unexpected errors
    toast({
      title: "Uh oh! Something went wrong.",
      description: err.message,
      variant: "destructive",
      action: h(
        ToastAction,
        {
          altText: "Try again",
        },
        {
          default: () => "Try again",
        }
      ),
    });
  }
};
</script>
