<!-- TODO: styling -->
<template>
  <div>
    <PageHeader v-if="user" class="dark:bg-zinc-950" />
    <div
      v-else
      class="flex flex-row justify-between py-4 px-8 md:px-12 lg:px-16 bg-zinc-50 dark:bg-zinc-950 border-b"
    >
      <div class="flex items-center">
        <NuxtLink to="/" class=""
          ><p class="text-xl font-bold tracking-wider">MeetLah</p></NuxtLink
        >
      </div>
      <Button
        @click="toLogin"
        variant="outline"
        class="lg:right-12 border-zinc-300 dark:border-zinc-600"
      >
        <EnterIcon class="w-4 h-4 mr-2" />Login
      </Button>
    </div>
    <div class="min-h-screen bg-zinc-50 dark:bg-black">
      <div
        class="py-6 md:py-8 mx-auto container xl:w-[1200px] flex flex-row justify-between"
      >
        <div>
          <h1
            class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold"
          >
            {{ event_title }}
          </h1>
          <p class="text-base text-zinc-400 dark:text-zinc-500 mt-1">
            Event Code: <span class="font-bold">{{ event_code }}</span>
          </p>
        </div>
        <div class="flex flex-row items-center space-x-2">
          <EditEvent />

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button
                class="ml-2 border border-red-200 dark:border-red-900 bg-red-700 text-white hover:bg-red-900"
                v-if="!isMobile"
              >
                Delete Event
              </Button>
              <Button
                size="icon"
                class="ml-2 border border-red-200 dark:border-red-900 bg-red-700 text-white hover:bg-red-900"
                v-if="isMobile"
              >
                <Trash2 class="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle
                  >Are you sure you want to delete this event?</AlertDialogTitle
                >
                <AlertDialogDescription>
                  This action cannot be undone. Once deleted, the event will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  class="bg-red-700 text-white hover:bg-red-900"
                  @click="confirmDelete"
                  >Delete</AlertDialogAction
                >
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator class="w-full" />
      <div class="py-8 mx-auto container">
        <client-only>
          <Tabs default-value="your" v-if="isMobile">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="your"> Your Availability </TabsTrigger>
              <TabsTrigger value="overall"> Overall Availability </TabsTrigger>
              <TabsTrigger value="result"> Recommeded Timeslots </TabsTrigger>
            </TabsList>
            <TabsContent value="your">
              <Card class="lg:w-80 xl:w-96">
                <CardHeader>
                  <CardTitle>Your Availability</CardTitle>
                  <CardDescription
                    >Indicate blocks of time when you are
                    <span class="font-bold text-red-300">unavailable</span>. Tap
                    to select start cell, then tap again to select end cell and
                    all the cells in between.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="w-full flex items-center justify-center">
                    <!-- Interval Grid -->
                    <table
                      class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                    >
                      <thead>
                        <tr>
                          <th class="pb-0.5"></th>
                          <th
                            v-for="(date, dateIndex) in dates"
                            :key="dateIndex"
                            class="text-sm font-medium pb-0.5"
                          >
                            {{ formatDate(date) }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                          <td
                            v-if="timeIndex % 2 == 0"
                            class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                          >
                            {{ time }}
                          </td>
                          <td v-else></td>
                          <td
                            v-for="(date, dateIndex) in dates"
                            :key="dateIndex"
                            @mousedown="startSelection(dateIndex, timeIndex)"
                            @mouseover="dragSelection(dateIndex, timeIndex)"
                            @mouseup="endSelection"
                            @touchstart.prevent="
                              tapSelection(dateIndex, timeIndex)
                            "
                            class="h-6 p-0 text-center interval-cell"
                          >
                            <div
                              :class="[
                                'h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950',
                                isSelected(dateIndex, timeIndex)
                                  ? getMergedClass(dateIndex, timeIndex) +
                                    ' selected merged'
                                  : 'rounded-lg',
                              ]"
                            ></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="overall">
              <Card class="lg:w-80 xl:w-96">
                <CardHeader>
                  <CardTitle>Overall Availability</CardTitle>
                  <CardDescription
                    >View the
                    <span class="font-bold text-green-400">availability</span>
                    of everyone in the event. Find a timeslot that suits
                    everyone's schedule.</CardDescription
                  >
                </CardHeader>
                <CardContent>
                  <div class="w-full flex items-center justify-center">
                    <!-- Heatmap Grid -->
                    <table
                      class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                    >
                      <thead>
                        <tr>
                          <th class="pb-0.5"></th>
                          <th
                            v-for="(date, dateIndex) in dates"
                            :key="dateIndex"
                            class="text-sm font-medium pb-0.5"
                          >
                            {{ formatDate(date) }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                          <td
                            v-if="timeIndex % 2 == 0"
                            class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                          >
                            {{ time }}
                          </td>
                          <td v-else></td>
                          <td
                            v-for="(date, dateIndex) in dates"
                            :key="dateIndex"
                            class="h-6 p-0 text-center heatmap-cell"
                          >
                            <div
                              class="h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-xs rounded-md"
                              :style="{
                                backgroundColor: getHeatmapColor(
                                  dateIndex,
                                  timeIndex
                                ),
                              }"
                            >
                              {{ getAvailabilityCount(dateIndex, timeIndex) }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="result">
              <Card class="lg:w-80 xl:w-96">
                <CardHeader>
                  <CardTitle>Recommended Timeslots</CardTitle>
                  <CardDescription
                    > Below are timeslots with the highest <span class="font-bold text-green-400">availability</span> among everyone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h1>blablabla</h1>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div class="flex flex-col lg:flex-row gap-8" v-else>
            <Card class="lg:w-80 xl:w-96">
              <CardHeader>
                <CardTitle>Your Availability</CardTitle>
                <CardDescription
                  >Indicate blocks of time when you are
                  <span class="font-bold text-red-300">unavailable</span>. Click
                  and drag to select blocks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="w-full flex items-center justify-center">
                  <!-- Interval Grid -->
                  <table
                    class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                  >
                    <thead>
                      <tr>
                        <th class="pb-0.5"></th>
                        <th
                          v-for="(date, dateIndex) in dates"
                          :key="dateIndex"
                          class="text-sm font-medium pb-0.5"
                        >
                          {{ formatDate(date) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                        <td
                          v-if="timeIndex % 2 == 0"
                          class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                        >
                          {{ time }}
                        </td>
                        <td v-else></td>
                        <td
                          v-for="(date, dateIndex) in dates"
                          :key="dateIndex"
                          @mousedown="startSelection(dateIndex, timeIndex)"
                          @mouseover="dragSelection(dateIndex, timeIndex)"
                          @mouseup="endSelection"
                          @touchstart.prevent="
                            tapSelection(dateIndex, timeIndex)
                          "
                          class="h-6 p-0 text-center interval-cell"
                        >
                          <div
                            :class="[
                              'h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out',
                              isSelected(dateIndex, timeIndex)
                                ? getMergedClass(dateIndex, timeIndex) +
                                  ' selected merged'
                                : 'rounded-lg',
                            ]"
                          ></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card class="lg:w-80 xl:w-96">
              <CardHeader>
                <CardTitle>Overall Availability</CardTitle>
                <CardDescription
                  >View the
                  <span class="font-bold text-green-400">availability</span> of
                  everyone in the event. <br />
                  Find a timeslot that suits everyone's
                  schedule.</CardDescription
                >
              </CardHeader>
              <CardContent>
                <div class="w-full flex items-center justify-center">
                  <!-- Heatmap Grid -->
                  <table
                    class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                  >
                    <thead>
                      <tr>
                        <th class="pb-0.5"></th>
                        <th
                          v-for="(date, dateIndex) in dates"
                          :key="dateIndex"
                          class="text-sm font-medium pb-0.5"
                        >
                          {{ formatDate(date) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                        <td
                          v-if="timeIndex % 2 == 0"
                          class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                        >
                          {{ time }}
                        </td>
                        <td v-else></td>
                        <td
                          v-for="(date, dateIndex) in dates"
                          :key="dateIndex"
                          class="h-6 p-0 text-center heatmap-cell"
                        >
                          <div
                            class="h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-xs rounded-md transition-all duration-500 ease-in-out"
                            :style="{
                              backgroundColor: getHeatmapColor(
                                dateIndex,
                                timeIndex
                              ),
                            }"
                          >
                            {{ getAvailabilityCount(dateIndex, timeIndex) }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card class="lg:w-80 xl:w-96">
              <CardHeader>
                <CardTitle>Recommended Timeslots</CardTitle>
                <CardDescription>Below are the top 10 timeslots with the highest <span class="font-bold text-green-400">availability</span> among everyone.</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="w-full flex items-center justify-center">
                  <ol>
                    <li v-for="({ count, timeslot }) in getSortedAvailability()" :key="timeslot" class="flex items-center space-x-2 mb-2">
                      <!-- Date portion with box, slight curves, and padding -->
                      <div class="border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
                        {{ timeslot }}
                      </div>
                      <!-- Availability in green, following format "[count] people available" -->
                      <span class="text-green-500 font-semibold">
                        {{ count }} people available
                      </span>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
            <div class="ml-auto">
              <div>
                <!-- Button to trigger overlay -->
                <button
                  class="bg-blue-500 text-black bg-white rounded px-4 h-[60px]"
                  @click= "toggleOverlay"
                >
                  Suggest Location
                </button>

                <!-- Overlay -->
                <div v-if="showOverlay" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div class="bg-white rounded-lg shadow-lg w-4/5 max-w-lg h-4/5 p-4 relative">
                    <button
                      class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      @click="closeOverlay"
                    >
                    &times;
                    </button>
                    <GoogleMaps/>
                  </div>
                </div>
            </div>
          </div>
          </div>
          <!-- Existing Dialog and Toast Components -->
          <Dialog :open="showDialog">
            <DialogOverlay />
            <DialogContent class="w-5/6 rounded-md">
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
        </client-only>
      </div>
    </div>
    <Toaster />
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster } from "@/components/ui/toast";
import { navigateTo } from "nuxt/app";
import debounce from "lodash.debounce";
import { PageHeader } from "@/components/custom/page-header";
import { EnterIcon } from "@radix-icons/vue";
import { PageFooter } from "@/components/custom/page-footer";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Trash2 } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";
import { EditEvent } from "@/components/custom/edit-event";
import  {GoogleMaps}  from "@/components/custom/Google-maps";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const { toast } = useToast();
const isMobile = useMediaQuery("(max-width: 1000px)");

const showDialog = ref(false);
const event_id = ref("");
const newDisplayName = ref("");
const displayName = ref("");
const event_title = ref("");
const event_participants = ref([]);

// Variables for the interval grid
const startDate = ref("");
const endDate = ref("");
const startTime = ref("");
const endTime = ref("");
const dates = ref([]);
const times = ref([]);
const intervals = ref([]);

// Variable to store the participant's name
const participant_name = ref(null);

const event_code = route.params.eventId;

const showOverlay = ref(false);

onMounted(async () => {
  // Fetch event details from Supabase
  const { data: findEvent, error: findEventError } = await supabase
    .from("events")
    .select("*")
    .eq("code", event_code)
    .single();

  if (findEventError) {
    toast({
      title: "Invalid link.",
      description: "No event with this code is found.",
      variant: "destructive",
    });
    setTimeout(() => navigateTo("/join"), 1000);
  } else {
    event_id.value = findEvent.id;
    event_title.value = findEvent.title;

    // Set dates and times
    startDate.value = findEvent.start_date;
    endDate.value = findEvent.end_date;
    startTime.value = findEvent.start_time;
    endTime.value = findEvent.end_time;

    // Generate intervals
    generateIntervals();

    // Fetch participants
    await fetchParticipants();

    // Fetch participant data
    await fetchParticipantData();

    // Fetch user events from api
    const timeMin = combineDateAndTime(
      findEvent.start_date,
      findEvent.start_time
    );
    const timeMax = combineDateAndTime(findEvent.end_date, findEvent.end_time);
    const [gCalEvents, mCalEvents] = await Promise.all([
      fetchGoogleCalEvents(timeMin, timeMax),
      fetchMicrosoftCalEvents(timeMin, timeMax),
    ]);

    // Once the events are fetched, update availability based on the results
    if (gCalEvents && gCalEvents.length > 0) {
      await updateAvailabilityFromGoogleCal(gCalEvents);
    }

    if (mCalEvents && mCalEvents.length > 0) {
      await updateAvailabilityFromMicrosoftCal(mCalEvents);
    }
  }
});

async function fetchParticipants() {
  const { data: findParticipants, error } = await supabase
    .from("participants")
    .select("*")
    .eq("event_id", event_id.value);

  if (error) {
    console.error("Error fetching participants:", error.message);
    return;
  }

  if (findParticipants) {
    event_participants.value = findParticipants.map(
      ({ name, availability }) => ({ [name]: availability })
    );
  }
}

async function fetchParticipantData() {
  const participant = await getOrCreateParticipant();

  if (participant) {
    setParticipantData(participant);
    await fetchParticipants(); // Refresh participants list
  }
}

async function getOrCreateParticipant() {
  let name = "";

  if (user.value) {
    name = user.value.user_metadata.name;
    const participant = await ensureParticipant(
      name,
      user.value.id,
      user.value.email
    );
    return participant;
  } else {
    if (!newDisplayName.value) {
      showDialog.value = true;
      return null;
    }

    name = newDisplayName.value;
    const participant = await ensureParticipant(name);
    return participant;
  }
}

async function ensureParticipant(name, user_id = null, email = null) {
  let participant = null;

  // Try to fetch participant by user_id if provided
  if (user_id) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("event_id", event_id.value)
      .eq("user_id", user_id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching participant by user_id:", error.message);
      return null;
    }

    participant = data;
  }

  // If not found by user_id, or user_id not provided, try fetching by name
  if (!participant) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("event_id", event_id.value)
      .eq("name", name)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching participant by name:", error.message);
      return null;
    }

    participant = data;
  }

  // If participant does not exist, create one
  if (!participant) {
    const { data: newParticipant, error: insertError } = await supabase
      .from("participants")
      .insert({
        event_id: event_id.value,
        name: name,
        user_id: user_id,
        email: email,
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Error creating participant:", insertError.message);
      return null;
    }

    participant = newParticipant;
  }

  return participant;
}

async function fetchGoogleCalEvents(timeMin, timeMax) {
  const { data: isImported, error: isImportedError } = await supabase
    .from("participants")
    .select("gcal_imported")
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (isImportedError) {
    console.log(isImportedError.message);
  } else {
    if (user && !isImported.gcal_imported) {
      try {
        const response = await fetch(
          `/api/calendar/gEvents?timeMin=${timeMin}&timeMax=${timeMax}`
        );
        return response.json();
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    } else {
      return null;
    }
  }
}

async function updateAvailabilityFromGoogleCal(events) {
  events.forEach((event) => {
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);

    intervals.value.forEach((interval, index) => {
      const intervalStart = new Date(interval.date + "T" + interval.time);
      const intervalEnd = new Date(intervalStart.getTime() + 30 * 60000);

      const isOverlapping =
        eventStart < intervalEnd && eventEnd > intervalStart;

      if (isOverlapping) {
        intervals.value[index].selected = true;
      }
    });
  });

  await saveAvailability();
  const { error: importError } = await supabase
    .from("participants")
    .update({ gcal_imported: "true" })
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (importError) {
    console.log(importError.message);
  }
}

// Function to fetch Microsoft Calendar events based on time range
async function fetchMicrosoftCalEvents(timeMin, timeMax) {
  // Check if Microsoft Calendar events have already been imported
  const { data: isImported, error: isImportedError } = await supabase
    .from("participants")
    .select("mcal_imported")
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (isImportedError) {
    console.log(isImportedError.message);
  } else {
    if (user && !isImported.mcal_imported) {
      try {
        const response = await fetch(
          `/api/calendar/mEvents?timeMin=${timeMin}&timeMax=${timeMax}`
        );
        return response.json();
      } catch (err) {
        console.error("Error fetching Microsoft Calendar events:", err.message);
      }
    } else {
      return null;
    }
  }
}

// Function to update availability based on fetched Microsoft Calendar events
async function updateAvailabilityFromMicrosoftCal(events) {
  events.forEach((event) => {
    const eventStart = new Date(`${event.start.dateTime}Z`);
    const eventEnd = new Date(`${event.end.dateTime}Z`);

    intervals.value.forEach((interval, index) => {
      const intervalStart = new Date(interval.date + "T" + interval.time);
      const intervalEnd = new Date(intervalStart.getTime() + 30 * 60000);

      const isOverlapping =
        eventStart < intervalEnd && eventEnd > intervalStart;

      if (isOverlapping) {
        intervals.value[index].selected = true;
      }
    });
  });

  // Save the updated availability intervals
  await saveAvailability();

  // Mark Microsoft Calendar events as imported in the database
  const { error: importError } = await supabase
    .from("participants")
    .update({ mcal_imported: "true" })
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (importError) {
    console.log(importError.message);
  }
}

function combineDateAndTime(startDate, startTime) {
  const datePart = new Date(startDate);
  const timeParts = startTime.split(":");

  datePart.setHours(timeParts[0], timeParts[1], timeParts[2] || 0);

  return datePart.toISOString();
}

function setParticipantData(participant) {
  displayName.value = participant.name;
  participant_name.value = participant.name;
  showDialog.value = false;

  loadAvailability(participant.availability);
}

const saveDisplayName = async () => {
  if (newDisplayName.value) {
    const participant = await ensureParticipant(newDisplayName.value);

    if (participant) {
      setParticipantData(participant);
      await fetchParticipants();
    }
  }
};

// Interval Grid Methods
function formatDate(date) {
  const options = { year: "2-digit", month: "short", day: "2-digit" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function generateIntervals() {
  // Parse dates
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  // Generate date array
  dates.value = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.value.push(new Date(currentDate).toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Parse times
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const startTimeMinutes = parseTime(startTime.value);
  const endTimeMinutes = parseTime(endTime.value);

  // Generate time array
  times.value = [];
  let currentMinutes = startTimeMinutes;
  while (currentMinutes < endTimeMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    times.value.push(("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2));
    currentMinutes += 30;
  }

  // Generate intervals
  intervals.value = [];
  for (let date of dates.value) {
    for (let time of times.value) {
      intervals.value.push({
        date,
        time,
        selected: false,
      });
    }
  }
}

function toggleInterval(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  intervals.value[intervalIndex].selected =
    !intervals.value[intervalIndex].selected;

  // Save availability after toggling an interval
  debouncedSaveAvailability();
}

function isSelected(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  return intervals.value[intervalIndex].selected;
}

const bitString = computed(() => {
  return intervals.value
    .map((interval) => (interval.selected ? "0" : "1"))
    .join("");
});

// Function to save availability to Supabase (debounced)
const saveAvailability = async () => {
  if (!participant_name.value) {
    toast({
      title: "Error",
      description: "Participant not identified.",
      variant: "destructive",
    });
    return;
  }

  const { error } = await supabase
    .from("participants")
    .update({ availability: bitString.value })
    .eq("event_id", event_id.value)
    .eq("name", participant_name.value);

  if (error) {
    console.error("Error updating availability:", error.message);
    toast({
      title: "Error",
      description: "Failed to save availability.",
      variant: "destructive",
    });
  } else {
    // Refresh participants list to update heatmap
    await fetchParticipants();
  }
};

// Debounced version of saveAvailability
const debouncedSaveAvailability = debounce(saveAvailability, 500);

// Function to load existing availability into intervals
function loadAvailability(availabilityString) {
  if (
    !availabilityString ||
    availabilityString.length !== intervals.value.length
  ) {
    // Initialize to ones if availabilityString is null or length mismatch
    availabilityString = "1".repeat(intervals.value.length);
  }

  availabilityString.split("").forEach((char, index) => {
    intervals.value[index].selected = char === "0";
  });
}

// Computed property to calculate availability counts for the heatmap
const availabilityCounts = computed(() => {
  if (!intervals.value.length) return [];
  const counts = Array(intervals.value.length).fill(0);
  event_participants.value.forEach((participant) => {
    const name = Object.keys(participant)[0];
    const availabilityString = participant[name];
    if (
      availabilityString &&
      availabilityString.length === intervals.value.length
    ) {
      for (let i = 0; i < availabilityString.length; i++) {
        if (availabilityString[i] === "1") {
          counts[i]++;
        }
      }
    }
  });
  return counts;
});

// Function to get the heatmap color for a cell
function getHeatmapColor(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  const count = availabilityCounts.value[intervalIndex] || 0;
  const totalParticipants = event_participants.value.length || 1; // Prevent division by zero
  const opacity = count / totalParticipants;
  return `rgba(34, 197, 94, ${opacity})`; // Adjust the color as needed
}

// Function to get the availability count for a cell
function getAvailabilityCount(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  return availabilityCounts.value[intervalIndex] || 0;
}

function getSortedAvailability() {
  // Create an array to hold timeslot and count pairs
  let availabilityDict = [];

  // Iterate over the intervals and calculate availability counts for each timeslot
  intervals.value.forEach((interval, index) => {
    const timeSlot = `${interval.date} ${interval.time}`;
    const availabilityCount = availabilityCounts.value[index] || 0;
    availabilityDict.push({ timeslot: timeSlot, count: availabilityCount });
  });

  // Sort the array by availability count from most to least
  availabilityDict.sort((a, b) => b.count - a.count);

  // Return only the top 10 timeslots as an array
  return availabilityDict.slice(0, 10);
}


const isDragging = ref(false); // Track if dragging is active
const selectionMode = ref(true); // Track if we're selecting or deselecting
const startCell = ref(null); // Track the start cell for tap selection
const endCell = ref(null); // Track the end cell for tap selection

// Function to start selecting (both for drag and tap)
function startSelection(dateIndex, timeIndex) {
  isDragging.value = true;
  const isAlreadySelected = isSelected(dateIndex, timeIndex);
  selectionMode.value = !isAlreadySelected; // Toggle the mode based on the initial cell's state
  toggleInterval(dateIndex, timeIndex);
  startCell.value = { dateIndex, timeIndex }; // Store the start cell for tap selection
}

// Function to end the selection process (for drag selection)
function endSelection() {
  isDragging.value = false;
  startCell.value = null; // Reset start cell after dragging or tap selection is complete
  endCell.value = null; // Reset end cell
  // Trigger save logic if needed (e.g., debouncedSaveAvailability())
}

// Function to handle dragging over cells
function dragSelection(dateIndex, timeIndex) {
  if (isDragging.value) {
    // Only toggle the cell if it hasn't already been toggled in the current drag operation
    if (isSelected(dateIndex, timeIndex) !== selectionMode.value) {
      toggleInterval(dateIndex, timeIndex);
    }
  }
}

// Function to handle tap selection start and end (for touch devices)
function tapSelection(dateIndex, timeIndex) {
  if (!startCell.value) {
    // If there's no start cell yet, set this as the start cell
    startSelection(dateIndex, timeIndex);
  } else {
    // This is the end tap, so perform the selection for all cells between start and end
    endCell.value = { dateIndex, timeIndex };
    selectCellsInRange(startCell.value, endCell.value);
    endSelection(); // Finalize the selection process
  }
}

// Function to select all cells between the start and end points
function selectCellsInRange(start, end) {
  const [startDateIndex, endDateIndex] = [
    Math.min(start.dateIndex, end.dateIndex),
    Math.max(start.dateIndex, end.dateIndex),
  ];
  const [startTimeIndex, endTimeIndex] = [
    Math.min(start.timeIndex, end.timeIndex),
    Math.max(start.timeIndex, end.timeIndex),
  ];

  for (let i = startDateIndex; i <= endDateIndex; i++) {
    for (let j = startTimeIndex; j <= endTimeIndex; j++) {
      if (isSelected(i, j) !== selectionMode.value) {
        toggleInterval(i, j);
      }
    }
  }
}

function getMergedClass(dateIndex, timeIndex) {
  const hasAbove = timeIndex > 0 && isSelected(dateIndex, timeIndex - 1);
  const hasBelow =
    timeIndex < times.value.length - 1 && isSelected(dateIndex, timeIndex + 1);

  let classes = "";

  // Handle top and bottom corners only
  if (!hasAbove) {
    classes += " rounded-t-lg"; // Rounded top if no selected cell above
  }
  if (!hasBelow) {
    classes += " rounded-b-lg"; // Rounded bottom if no selected cell below
  }

  return classes.trim();
}

async function deleteEventFromDB(eventId) {
  // Placeholder for actual deletion logic
  try {
    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      throw error;
    }
    return true;
  } catch (err) {
    console.error("Error deleting event:", err.message);
    return false;
  }
}

async function confirmDelete() {
  const success = await deleteEventFromDB(event_id.value);
  if (success) {
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
      variant: "success",
      duration: 1000,
    });
    setTimeout(() => {
      navigateTo("/");
    }, 1000);
  } else {
    toast({
      title: "Deletion Failed",
      description: "There was an error deleting the event.",
      variant: "destructive",
      duration: 1000,
    });
  }
}

function toggleOverlay() {
  showOverlay.value = true;
  console.log("Overlay toggled to true"); // Debug message
}

function closeOverlay() {
  showOverlay.value = false;
  console.log("Overlay toggled to false"); // Debug message
}

</script>

<style scoped>
.interval-cell {
  cursor: pointer;
  user-select: none; /* Prevent text selection while dragging */
}

.interval-cell .selected {
  @apply bg-red-400 border-red-400;
}

th,
td {
  text-align: center;
}
</style>
