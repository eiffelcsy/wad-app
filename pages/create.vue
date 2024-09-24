<template>
  <div class="w-full p-16 h-screen flex flex-col justify-center">
    <transition name="fade" mode="out-in">
      <div v-if="currentView === 1" key="view1" class="">
        <!-- View 1: Title and Description -->
        <div class="mb-8">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
          >
            Title
          </h1>
          <Input
            id="title"
            type="text"
            placeholder="Enter Title"
            v-model="title"
            class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600 mt-4"
          />
          <div v-if="errors.title" class="error absolute text-xs mt-1">
            {{ errors.title }}
          </div>
        </div>
        <div class="mt-8 mb-4">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
          >
            Description
          </h1>
          <Textarea
            id="description"
            type="text"
            placeholder="Enter Description"
            v-model="description"
            class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600 mt-2"
          />
          <div v-if="errors.description" class="error absolute text-xs mt-1">
            {{ errors.description }}
          </div>
        </div>
        <Button
          @click="nextView"
          class="w-full mt-4 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
          >Next</Button
        >
      </div>

      <div v-else-if="currentView === 2" key="view2">
        <!-- View 2: Date Range Picker for start_date and end_date -->
        <div class="mb-8">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
          >
            Select Date Range
          </h1>
          <div class="mt-4 flex justify-center items-center">
            <RangeCalendar v-model="dateRange" class="rounded-md border" />
          </div>
          <div v-if="errors.dateRange" class="error absolute text-xs mt-1">
            {{ errors.dateRange }}
          </div>
        </div>
        <div class="flex justify-between mt-8">
          <Button
            @click="prevView"
            class="w-full mr-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
            >Back</Button
          >
          <Button
            @click="nextView"
            class="w-full ml-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
            >Next</Button
          >
        </div>
      </div>

      <div v-else-if="currentView === 3" key="view3">
        <!-- View 3: Time Selection for start_time and end_time -->
        <div class="mb-8">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
          >
            Select Time Range
          </h1>
          <div class="mt-4 flex flex-row justify-center gap-8">
            <div>
              <label
                class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >Start Time</label
              >
              <input
                type="time"
                v-model="startTime"
                step="1800"
                class="mt-2 p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 border dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 self-center"
              />
              <div v-if="errors.startTime" class="error absolute text-xs mt-1">
                {{ errors.startTime }}
              </div>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >End Time</label
              >
              <input
                type="time"
                v-model="endTime"
                step="1800"
                class="mt-2 p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 border dark:border-zinc-600 text-zinc-900 dark:text-zinc-200"
              />
              <div v-if="errors.endTime" class="error absolute text-xs mt-1">
                {{ errors.endTime }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-8">
          <Button
            @click="prevView"
            class="w-full mr-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
            >Back</Button
          >
          <Button
            @click="nextView"
            class="w-full ml-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
            >Next</Button
          >
        </div>
      </div>

      <div v-else-if="currentView === 4" key="view4">
        <!-- View 4: Number of Participants -->
        <div class="mb-8">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
          >
            Number of Participants
          </h1>
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >Participants</label
            >
            <Input
              type="number"
              v-model="numberOfParticipants"
              min="1"
              class="w-full mt-2 p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 border dark:border-zinc-600 text-zinc-900 dark:text-zinc-200"
            />
            <div v-if="errors.numberOfParticipants" class="error text-xs mt-1">
              {{ errors.numberOfParticipants }}
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-8">
          <Button
            @click="prevView"
            class="w-full mr-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
            >Back</Button
          >
          <Button
            @click="nextView"
            class="w-full ml-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
            >Next</Button
          >
        </div>
      </div>

      <div v-else-if="currentView === 5" key="view5">
        <!-- View 5: Review and Submit -->
        <div class="mb-8">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
          >
            Review and Submit
          </h1>
          <p class="text-zinc-700 dark:text-zinc-300 mt-4">
            Please review your information before submitting.
          </p>
          <div class="mt-6 space-y-2">
            <div>
              <strong class="text-zinc-800 dark:text-zinc-100">Title:</strong>
              <span class="text-zinc-700 dark:text-zinc-300">{{ title }}</span>
            </div>
            <div>
              <strong class="text-zinc-800 dark:text-zinc-100"
                >Description:</strong
              >
              <span class="text-zinc-700 dark:text-zinc-300">{{
                description
              }}</span>
            </div>
            <div>
              <strong class="text-zinc-800 dark:text-zinc-100"
                >Date Range:</strong
              >
              <span class="text-zinc-700 dark:text-zinc-300"
                >{{ formatDate(dateRange.start) }} to
                {{ formatDate(dateRange.end) }}</span
              >
            </div>
            <div>
              <strong class="text-zinc-800 dark:text-zinc-100">Time:</strong>
              <span class="text-zinc-700 dark:text-zinc-300"
                >{{ startTime }} to {{ endTime }}</span
              >
            </div>
            <div>
              <strong class="text-zinc-800 dark:text-zinc-100"
                >Number of Participants:</strong
              >
              <span class="text-zinc-700 dark:text-zinc-300">{{
                numberOfParticipants
              }}</span>
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-8">
          <Button
            @click="prevView"
            class="w-full mr-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
            >Back</Button
          >
          <Button
            @click="submitEvent"
            class="w-full ml-2 bg-green-600 dark:bg-green-400 text-white dark:text-black"
            >Submit</Button
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { type Ref, ref } from "vue";
import dayjs from "dayjs";
import { navigateTo } from "nuxt/app";
import type { DateRange } from "radix-vue";
import { getLocalTimeZone, today } from "@internationalized/date";
import { RangeCalendar } from "@/components/ui/range-calendar";

const { $supabase } = useNuxtApp();

// Define types
interface Errors {
  title?: string;
  description?: string;
  dateRange?: string;
  startTime?: string;
  endTime?: string;
  numberOfParticipants?: string;
}

// Initial date values
const start = today(getLocalTimeZone());
const end = start.add({ days: 2 });

const title = ref<string>(""); // Title is a string
const description = ref<string>(""); // Description is a string
const startTime = ref<string | null>(null); // startTime can be string or null
const endTime = ref<string | null>(null); // endTime can be string or null
const numberOfParticipants = ref<number>(1); // numberOfParticipants is a number
const currentView = ref<number>(1); // currentView is a number
const errors = ref<Errors>({}); // errors is an object with optional fields
const dateRange = ref<DateRange>({
  start,
  end,
}) as Ref<DateRange>; // dateRange uses DateRange type

// Get the current user from Supabase
const {
  data: { user },
} = await $supabase.auth.getUser();

// Validation function for each view
const validateCurrentView = (): boolean => {
  errors.value = {}; // Clear previous errors

  if (currentView.value === 1) {
    if (!title.value.trim()) {
      errors.value.title = "Title is required.";
    }
    if (!description.value.trim()) {
      errors.value.description = "Description is required.";
    }
  } else if (currentView.value === 2) {
    if (!dateRange.value.start || !dateRange.value.end) {
      errors.value.dateRange = "Start date and end date are required.";
    }
  } else if (currentView.value === 3) {
    if (!startTime.value) {
      errors.value.startTime = "Start time is required.";
    }
    if (!endTime.value) {
      errors.value.endTime = "End time is required.";
    }
  } else if (currentView.value === 4) {
    if (!numberOfParticipants.value || numberOfParticipants.value <= 0) {
      errors.value.numberOfParticipants =
        "Number of participants must be greater than 0.";
    }
  }

  return Object.keys(errors.value).length === 0;
};

// Navigation functions
const nextView = () => {
  if (validateCurrentView()) {
    currentView.value++;
  }
};

const prevView = () => {
  currentView.value--;
};

// Function to generate a unique event code
const generateEventCode = async (): Promise<string | null> => {
  let code = "";
  let exists = true;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  while (exists) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if code exists in the events table
    const { data, error } = await $supabase
      .from("events")
      .select("code")
      .eq("code", code);

    if (error) {
      console.error("Error checking event code:", error);
      return null;
    }

    if (data.length === 0) {
      exists = false;
    }
  }

  return code;
};

// Function to submit the event
const submitEvent = async () => {
  const eventCode = await generateEventCode();

  if (!eventCode) {
    alert("Failed to generate event code. Please try again.");
    return;
  }

  // Prepare data for insertion
  const eventData = {
    title: title.value,
    description: description.value,
    creator_user_id: user.id,
    start_date: dayjs(dateRange.value.start).format("YYYY-MM-DD"),
    end_date: dayjs(dateRange.value.end).format("YYYY-MM-DD"),
    start_time: startTime.value,
    end_time: endTime.value,
    number_of_participants: numberOfParticipants.value,
    code: eventCode,
  };

  // Insert into Supabase
  const { data, error } = await $supabase.from("events").insert([eventData]);

  if (error) {
    console.error("Error inserting event:", error);
    alert("Failed to create event. Please try again.");
    return;
  }

  // Redirect to event/[event-code]
  navigateTo(`/event/${eventCode}`); // TODO: fix redirect, somehow its not working
};

// Utility function to format date
const formatDate = (date: Date) => {
  return dayjs(date).format("YYYY-MM-DD");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.error {
  color: red;
}
</style>
