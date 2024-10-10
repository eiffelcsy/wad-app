<template>
  <div class="w-full px-16 h-screen flex flex-col pt-16">
    <Button
      @click="backHome"
      variant="link"
      class="mt-2 text-zinc-500 dark:text-zinc-400 absolute left-2 top-2"
    >
      <ArrowLeftIcon class="w-4 h-4 mr-2" />Back to Home
    </Button>
    <div>
      <h1
        class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
      >
        New Event
      </h1>
      <p
        class="text-base text-zinc-400 dark:text-zinc-500 my-2 lg:my-4 lg:pr-4"
      >
        Create and customize a new event by filling in the details below.
      </p>
    </div>
    <transition name="fade" mode="out-in">
      <div
        v-if="currentView === 1"
        key="view1"
        class="relative h-full flex flex-col md:items-center"
      >
        <!-- View 1: Title and Description -->
        <div
          class="w-full md:flex md:flex-row md:justify-center md:gap-16 lg:gap-36"
        >
          <div class="md:w-72 lg:w-96">
            <div class="mb-4">
              <h1
                class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
              >
                Title
              </h1>
              <Input
                id="title"
                type="text"
                placeholder="Enter Title"
                v-model="title"
                class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600"
              />
              <div v-if="errors.title" class="error absolute text-xs mt-1">
                {{ errors.title }}
              </div>
            </div>
            <div class="mt-4 mb-4 lg:mt-8">
              <h1
                class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
              >
                Description
              </h1>
              <Textarea
                id="description"
                type="text"
                placeholder="Enter Description"
                v-model="description"
                class="w-full h-12 lg:h-40 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600 mt-2"
              />
              <div
                v-if="errors.description"
                class="error absolute text-xs mt-1"
              >
                {{ errors.description }}
              </div>
            </div>
          </div>
          <div>
            <h1
              class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:mb-4"
            >
              Select Date Range
            </h1>
            <div class="mt-2 flex justify-center items-center">
              <RangeCalendar v-model="dateRange" class="rounded-md border" />
            </div>
            <div v-if="errors.dateRange" class="error absolute text-xs mt-1">
              {{ errors.dateRange }}
            </div>
          </div>
        </div>
        <Button
          @click="nextView"
          class="absolute bottom-8 w-full max-w-96 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
          >Next</Button
        >
      </div>

      <div
        v-else-if="currentView === 2"
        key="view2"
        class="relative h-full flex flex-col md:items-center"
      >
        <div class="md:flex md:flex-row md:justify-center md:gap-28 lg:gap-40">
          <div class="mb-8">
            <h1
              class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
            >
              Select Time Range
            </h1>
            <div class="mt-4 lg:mt-8 flex flex-row justify-center gap-8">
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
                <div
                  v-if="errors.startTime"
                  class="error absolute text-xs mt-1"
                >
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
          <div>
            <h1
              class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
            >
              Number of Participants
            </h1>
            <div class="mt-4 lg:mt-6">
              <Input
                type="number"
                v-model="numberOfParticipants"
                min="1"
                class="w-full lg:w-2/3 mt-2 p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 border dark:border-zinc-600 text-zinc-900 dark:text-zinc-200"
              />
              <div
                v-if="errors.numberOfParticipants"
                class="error text-xs mt-1"
              >
                {{ errors.numberOfParticipants }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="absolute bottom-8 w-full flex justify-between mt-6 md:mt-8 lg:mt-10">
            <Button
              @click="prevView"
              class="w-full max-w-96 mr-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
              >Back</Button
            >
            <Button
              @click="nextView"
              class="w-full max-w-96 ml-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
              >Next</Button
            >
          </div>
        </div>
      </div>

      <div v-else-if="currentView === 3" key="view3">
        <!-- View 5: Review and Submit -->
        <div class="mb-8">
          <h1
            class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
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
            class="w-full ml-2 bg-green-600 text-white"
            >Create Event</Button
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
import { ArrowLeftIcon } from "lucide-vue-next";

const supabase = useSupabaseClient();

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
const user = useSupabaseUser().value;

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
    if (!dateRange.value.start || !dateRange.value.end) {
      errors.value.dateRange = "Start date and end date are required.";
    }
  } else if (currentView.value === 2) {
    if (!startTime.value) {
      errors.value.startTime = "Start time is required.";
    }
    if (!endTime.value) {
      errors.value.endTime = "End time is required.";
    }
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
    const { data, error } = await supabase
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
  const { data, error } = await supabase.from("events").insert([eventData]);

  if (error) {
    console.error("Error inserting event:", error);
    alert("Failed to create event. Please try again.");
    return;
  }

  // Redirect to event/[event-code]
  navigateTo(`/event/${eventCode}`); // TODO: fix redirect, somehow its not working
};

const backHome = () => {
  navigateTo("/");
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
