<template>
  <div>
    <PageHeader />
    <div
      class="w-full px-8 min-h-screen flex flex-col pt-8 pb-10 items-center bg-gradient-to-b from-white dark:from-black to-indigo-200/30 dark:to-indigo-900/20"
    >
      <div class="mx-auto w-full lg:w-1/2">
        <h1
          class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
        >
          New Event
        </h1>
        <p class="text-base text-zinc-400 dark:text-zinc-500">
          Create and customize a new event by filling in the details below.
        </p>
      </div>
      <transition name="fade" mode="out-in">
        <div
          v-if="currentView === 1"
          key="view1"
          class="relative w-full lg:w-1/2 h-full flex flex-col md:items-center md:mt-4 lg:mt-8"
        >
          <!-- View 1: Title and Description -->
          <div
            class="w-full flex flex-col mt-4 md:flex-row md:justify-center gap-4 md:gap-6 lg:gap-8"
          >
            <Card class="w-full">
              <CardContent class="pt-4">
                <div>
                  <h1
                    class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
                  >
                    Title
                  </h1>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter Title"
                    v-model="title"
                    class="w-full h-12 text-sm sm:text-base p-2 sm:p-3"
                  />
                  <div v-if="errors.title" class="error absolute text-xs mt-1">
                    {{ errors.title }}
                  </div>
                </div>
                <div class="pt-4">
                  <h1
                    class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
                  >
                    Description
                  </h1>
                  <Textarea
                    id="description"
                    type="text"
                    placeholder="Enter Description"
                    v-model="description"
                    class="w-full h-12 lg:h-40 text-sm sm:text-base p-2 sm:p-3 mt-2"
                  />
                  <div
                    v-if="errors.description"
                    class="error absolute text-xs mt-1"
                  >
                    {{ errors.description }}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-4">
                <div>
                  <h1
                    class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:mb-4"
                  >
                    Select Date Range
                  </h1>
                  <div class="mt-2 flex justify-center items-center">
                    <RangeCalendar
                      v-model="dateRange"
                      class="rounded-md border"
                    />
                  </div>
                  <div
                    v-if="errors.dateRange"
                    class="error absolute text-xs mt-1"
                  >
                    {{ errors.dateRange }}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button @click="nextView" class="mt-6 md:mt-8 lg:mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >Next</Button
          >
        </div>

        <div
          v-else-if="currentView === 2"
          key="view2"
          class="relative w-full lg:w-1/2 h-full flex flex-col md:items-center md:mt-4 lg:mt-8"
        >
          <div
            class="w-full flex flex-col mt-4 md:flex-row md:justify-center gap-4 md:gap-6 lg:gap-8"
          >
            <Card class="w-full">
              <CardContent>
                <div>
                  <h1
                    class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
                  >
                    Select Time Range
                  </h1>
                  <div class="mt-4 lg:mt-8 flex flex-col md:flex-row justify-center gap-4 xl:gap-8">
                    <div>
                      <label
                        class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >Start Time</label
                      >
                      <div class="flex flex-row gap-2">
                        <Select v-model="startTime">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <template v-for="hour in 12" :key="hour">
                                <SelectItem :value="`${hour.toString().padStart(2, '0')}:00`"> {{ `${hour.toString().padStart(2, '0')}:00` }} </SelectItem>
                                <SelectItem :value="`${hour.toString().padStart(2, '0')}:30`"> {{ `${hour.toString().padStart(2, '0')}:30` }} </SelectItem>
                              </template>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Select v-model="startTimeMeridiem">
                          <SelectTrigger>
                            <SelectValue placeholder="AM or PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="AM"> AM </SelectItem>
                              <SelectItem value="PM"> PM </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
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
                      <div class="flex flex-row gap-2">
                        <Select v-model="endTime">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <template v-for="hour in 12" :key="hour">
                                <SelectItem :value="`${hour.toString().padStart(2, '0')}:00`"> {{ `${hour.toString().padStart(2, '0')}:00` }} </SelectItem>
                                <SelectItem :value="`${hour.toString().padStart(2, '0')}:30`"> {{ `${hour.toString().padStart(2, '0')}:30` }} </SelectItem>
                              </template>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Select v-model="endTimeMeridiem">
                          <SelectTrigger>
                            <SelectValue placeholder="AM or PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="AM"> AM </SelectItem>
                              <SelectItem value="PM"> PM </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div
                        v-if="errors.endTime"
                        class="error absolute text-xs mt-1"
                      >
                        {{ errors.endTime }}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent
                ><div>
                  <h1
                    class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
                  >
                    Number of Participants
                  </h1>
                  <div class="mt-4 lg:mt-6">
                    <NumberField
                      id="numParticipants"
                      :default-value="1"
                      :min="1"
                      v-model="numberOfParticipants"
                    >
                      <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldContent>
                    </NumberField>
                    <div
                      v-if="errors.numberOfParticipants"
                      class="error text-xs mt-1"
                    >
                      {{ errors.numberOfParticipants }}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div
            class="w-full grid grid-cols-1 lg:grid-cols-2 mt-6 md:mt-8 lg:mt-10 gap-4 md:gap-6 lg:gap-8"
          >
            <Button @click="prevView" variant="outline" class="w-full"
              >Back</Button
            >
            <Button @click="nextView" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Next</Button>
          </div>
        </div>

        <div
          v-else-if="currentView === 3"
          key="view3"
          class="relative w-full lg:w-1/2 h-full flex flex-col md:items-center md:mt-4 lg:mt-8"
        >
          <!-- View 3: Review and Submit -->
          <Card class="w-full mt-4">
            <CardHeader>
              <CardTitle>Review and Submit</CardTitle>
              <CardDescription
                >Please review your information before
                submitting.</CardDescription
              >
            </CardHeader>
            <CardContent class="flex flex-col items-center">
              <div class="w-80 lg:w-96 flex flex-row justify-between">
                <strong class="text-zinc-800 dark:text-zinc-100"
                  >Title:
                </strong>
                <span class="text-zinc-700 dark:text-zinc-300">{{
                  title
                }}</span>
              </div>
              <div v-if="description" class="md:w-80 lg:w-96 flex flex-row justify-between">
                <strong class="text-zinc-800 dark:text-zinc-100"
                  >Description:
                </strong>
                <span class="text-zinc-700 dark:text-zinc-300">{{
                  description
                }}</span>
              </div>
              <div class="w-80 lg:w-96 flex flex-row justify-between">
                <strong class="text-zinc-800 dark:text-zinc-100"
                  >Date Range:
                </strong>
                <span class="text-zinc-700 dark:text-zinc-300"
                  >{{ formatDate(dateRange.start) }} to
                  {{ formatDate(dateRange.end) }}</span
                >
              </div>
              <div class="w-80 lg:w-96 flex flex-row justify-between">
                <strong class="text-zinc-800 dark:text-zinc-100">Time: </strong>
                <span class="text-zinc-700 dark:text-zinc-300"
                  >{{ startTime }}{{ startTimeMeridiem }} to {{ endTime }}{{ endTimeMeridiem }}</span
                >
              </div>
              <div class="w-80 lg:w-96 flex flex-row justify-between">
                <strong class="text-zinc-800 dark:text-zinc-100"
                  >Number of Participants:
                </strong>
                <span class="text-zinc-700 dark:text-zinc-300">{{
                  numberOfParticipants
                }}</span>
              </div>
            </CardContent>
          </Card>
          <div class="w-full grid grid-cols-1 lg:grid-cols-2 mt-6 md:mt-8 lg:mt-10 gap-4 md:gap-6 lg:gap-8">
            <Button
              @click="prevView"
              variant="outline"
              class="w-full"
              >Back</Button
            >
            <Button
              @click="submitEvent"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >Create Event</Button
            >
          </div>
        </div>
      </transition>

      <div v-if="fun"></div>
      <Dialog :open="showDialog" v-else>
        <DialogContent>
          <DialogHeader>
            <DialogTitle class="tw-text-xl"
              >Event Code: <strong>{{ eventCode }}</strong></DialogTitle
            >
          </DialogHeader>
          <DialogDescription>
            Share this code or link below.
          </DialogDescription>
          <div class="flex items-center space-x-2">
            <div class="grid flex-1 gap-2">
              <Input readonly :default-value="shareableLink" />
            </div>
            <Button type="submit" size="sm" class="px-3 bg-indigo-600 hover:bg-indigo-700 text-white" @click="copyLink">
              <span class="sr-only">Copy</span>
              <Copy class="w-4 h-4" />
            </Button>
          </div>
          <DialogFooter class="sm:justify-start">
            <DialogClose as-child>
              <Button @click="closeDialog" class="bg-indigo-600 hover:bg-indigo-700 hover:text-white">
                Go to Event
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <PageFooter />
  </div>
</template>

<script lang="ts" setup>
import { type Ref, ref } from "vue";
import dayjs from "dayjs";
import { navigateTo } from "nuxt/app";
import type { DateRange } from "radix-vue";
import { getLocalTimeZone, today } from "@internationalized/date";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { PageHeader } from "@/components/custom/page-header";
import { PageFooter } from "@/components/custom/page-footer";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-vue-next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
const startTimeMeridiem = ref<string | null>(null);
const endTimeMeridiem = ref<string | null>(null);
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
    // if (!description.value.trim()) {
    //   errors.value.description = "Description is required.";
    // }
    if (!dateRange.value.start || !dateRange.value.end) {
      errors.value.dateRange = "Start date and end date are required.";
    }
  } else if (currentView.value === 2) {
    if (!startTime.value || !startTimeMeridiem.value) {
      errors.value.startTime = "Start time is required.";
    }
    if (!endTime.value || !endTimeMeridiem.value) {
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
// Event code and shareable link states
const eventCode = ref(null);
const shareableLink = ref("");
const showDialog = ref(false);

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

const convertTo24HourFormat = (time: string, meridiem: string): string => {
  let [hours, minutes] = time.split(":").map(Number);

  if (meridiem === "PM" && hours !== 12) {
    hours += 12; // Convert to PM by adding 12 hours
  } else if (meridiem === "AM" && hours === 12) {
    hours = 0; // Handle 12:00 AM case (convert to 00:00)
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

// Function to submit the event
const submitEvent = async () => {
  const adjustedStartTime = convertTo24HourFormat(
    startTime.value,
    startTimeMeridiem.value
  );
  const adjustedEndTime = convertTo24HourFormat(
    endTime.value,
    endTimeMeridiem.value
  );

  eventCode.value = await generateEventCode();

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
    start_time: adjustedStartTime,
    end_time: adjustedEndTime,
    number_of_participants: numberOfParticipants.value,
    code: eventCode.value,
  };

  // Insert into Supabase
  const { data, error } = await supabase.from("events").insert([eventData]);

  if (error) {
    console.error("Error inserting event:", error);
    alert("Failed to create event. Please try again.");
    return;
  }

  // Set shareable link
  shareableLink.value = `${window.location.origin}/event/${eventCode.value}`;

  console.log("shareableLink set:", shareableLink.value);

  // Only show dialog once the shareableLink is confirmed to be set
  if (shareableLink.value) {
    showDialog.value = true;
  }
};

const backHome = () => {
  navigateTo("/");
};

// Utility function to format date
const formatDate = (date: Date) => {
  return dayjs(date).format("DD MMM YYYY");
};
// Close Dialog
const closeDialog = () => {
  showDialog.value = false;

  // Redirect to event page once modal closes
  navigateTo(`/event/${eventCode.value}`);
};
// fun function for testing
const fun = ref(false);

// Copy link to clipboard
const copyLink = () => {
  navigator.clipboard.writeText(shareableLink.value);
  alert("Link copied to clipboard!");
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
