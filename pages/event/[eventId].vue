<!-- TODO: styling -->
<template>
  <div>
    <div>
      <h1>{{ event_title }}</h1>
      <h1>{{ event_code }}</h1>
      <h1>Welcome, {{ displayName }}</h1>
      <p class="text-xs">{{ event_participants }}</p>
    </div>

    <client-only>
      <div class="flex flex-row gap-32">
        <div>
          <!-- Interval Grid -->
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th v-for="(date, dateIndex) in dates" :key="dateIndex">
                  {{ formatDate(date) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                <td>{{ time }}</td>
                <td
                  v-for="(date, dateIndex) in dates"
                  :key="dateIndex"
                  @click="toggleInterval(dateIndex, timeIndex)"
                  :class="{ selected: isSelected(dateIndex, timeIndex) }"
                  class="interval-cell"
                >
                  <!-- Interval Cell -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <!-- Heatmap Grid -->
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th v-for="(date, dateIndex) in dates" :key="dateIndex">
                  {{ formatDate(date) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                <td>{{ time }}</td>
                <td
                  v-for="(date, dateIndex) in dates"
                  :key="dateIndex"
                  :style="{
                    backgroundColor: getHeatmapColor(dateIndex, timeIndex),
                  }"
                  class="heatmap-cell"
                >
                  {{ getAvailabilityCount(dateIndex, timeIndex) }}
                </td>
              </tr>
            </tbody>
          </table>
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
    <Toaster />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster } from "@/components/ui/toast";
import { navigateTo } from "nuxt/app";
import debounce from "lodash.debounce";

const supabase = useSupabaseClient();
const route = useRoute();
const { toast } = useToast();

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
    let gCalEvents = await fetchGoogleCalEvents(timeMin, timeMax);
    
    if (gCalEvents) {
      await updateAvailabilityFromGoogleCal(gCalEvents);
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
  const user = useSupabaseUser().value;
  let name = "";

  if (user) {
    name = user.user_metadata.name;
    const participant = await ensureParticipant(name, user.id, user.email);
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
  const user = useSupabaseUser();

  if (user) {
    try {
      const response = await fetch(
        `/api/calendar/events?timeMin=${timeMin}&timeMax=${timeMax}`
      );
      return response.json();
    } catch (err) {
      console.error("Error fetching events:", err.message);
    }
  } else {
    return null;
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
        intervals.value[index].selected = false;
      }
    });

  });

  await saveAvailability();
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
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
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
    .map((interval) => (interval.selected ? "1" : "0"))
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
    // Initialize to zeros if availabilityString is null or length mismatch
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
  return `rgba(102, 204, 102, ${opacity})`; // Adjust the color as needed
}

// Function to get the availability count for a cell
function getAvailabilityCount(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  return availabilityCounts.value[intervalIndex] || 0;
}
</script>

<style>
.interval-cell {
  width: 50px;
  height: 30px;
  border: 1px solid #8a8a8a;
  background-color: #caffca;
  cursor: pointer;
}

.interval-cell.selected {
  background-color: #ffb7b7;
}

.heatmap-cell {
  width: 50px;
  height: 30px;
  border: 1px solid #ccc;
  text-align: center;
}

table {
  border-collapse: collapse;
  margin-bottom: 20px;
  /* Add some spacing between the grids */
}

th,
td {
  text-align: center;
}
</style>
