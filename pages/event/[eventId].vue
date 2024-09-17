<template>
  <div>
    <div>
      <h1>{{ event_title }}</h1>
      <h1>Welcome, {{ displayName }}</h1>
      <p>Existing Participants: {{ event_participants }}</p>
    </div>

    <client-only>
      <!-- Interval Grid -->
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th v-for="(date, dateIndex) in dates" :key="dateIndex">{{ formatDate(date) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(time, timeIndex) in times" :key="timeIndex">
            <td>{{ time }}</td>
            <td v-for="(date, dateIndex) in dates" :key="dateIndex" @click="toggleInterval(dateIndex, timeIndex)"
              :class="{ selected: isSelected(dateIndex, timeIndex) }" class="interval-cell">
              <!-- Interval Cell -->
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Existing Dialog and Toast Components -->
      <Dialog :open="showDialog">
        <DialogOverlay />
        <DialogContent class="w-5/6 rounded-md">
          <DialogTitle>Update Display Name</DialogTitle>
          <DialogDescription>
            Please enter your display name to continue.
          </DialogDescription>

          <Input v-model="newDisplayName" placeholder="Enter your display name" class="my-4" />

          <div class="flex justify-end">
            <Button @click="saveDisplayName" class="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black">
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast';
import { navigateTo, useNuxtApp } from 'nuxt/app';
import debounce from 'lodash.debounce';

const { $supabase } = useNuxtApp();
const route = useRoute();
const { toast } = useToast();

const showDialog = ref(false);
const event_id = ref('');
const newDisplayName = ref('');
const displayName = ref('');
const event_title = ref('');
const event_participants = ref([]);

// Variables for the interval grid
const startDate = ref('');
const endDate = ref('');
const startTime = ref('');
const endTime = ref('');
const dates = ref([]);
const times = ref([]);
const intervals = ref([]);

// Variable to store the participant's name
const participant_name = ref(null);

const event_code = route.params.eventId;

onMounted(async () => {
  // Fetch event details from Supabase
  const { data: findEvent, error: findEventError } = await $supabase
    .from('events')
    .select('*')
    .eq('code', event_code)
    .single();

  if (findEventError) {
    toast({
      title: 'Invalid link.',
      description: 'No event with this code is found.',
      variant: 'destructive',
    });
    setTimeout(() => navigateTo('/join'), 1000);
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
    const { data: findParticipants } = await $supabase
      .from('participants')
      .select('name')
      .eq('event_id', event_id.value);

    if (findParticipants) {
      event_participants.value = findParticipants.map((p) => p.name);
    }

    // Fetch participant availability
    await fetchParticipantData();
  }
});

async function fetchParticipantData() {
  const { data: userData } = await $supabase.auth.getUser();
  const user = userData.user;

  if (!user && event_code) {
    showDialog.value = true;
  } else {
    let existingParticipant = null;

    if (user) {
      // Fetch participant by user_id
      const { data } = await $supabase
        .from('participants')
        .select('*')
        .eq('event_id', event_id.value)
        .eq('user_id', user.id)
        .single();

      existingParticipant = data;
    } else if (newDisplayName.value) {
      // Fetch participant by name
      const { data } = await $supabase
        .from('participants')
        .select('*')
        .eq('event_id', event_id.value)
        .eq('name', newDisplayName.value)
        .single();

      existingParticipant = data;
    }

    if (existingParticipant) {
      // Participant exists
      displayName.value = existingParticipant.name;
      participant_name.value = existingParticipant.name;

      // Load availability
      loadAvailability(existingParticipant.availability);
    } else {
      // Create new participant
      const newParticipant = {
        event_id: event_id.value,
        name: user ? user.user_metadata.name : newDisplayName.value,
        user_id: user ? user.id : null,
        email: user ? user.email : null,
      };

      const { data: insertedParticipant, error } = await $supabase
        .from('participants')
        .insert(newParticipant)
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting participant:', error);
      } else {
        displayName.value = insertedParticipant.name;
        participant_name.value = insertedParticipant.name;

        // Load availability
        loadAvailability(insertedParticipant.availability);
      }
    }
  }
}

const saveDisplayName = async () => {
  if (newDisplayName.value) {
    const { data, error } = await $supabase
      .from('participants')
      .insert({
        event_id: event_id.value,
        name: newDisplayName.value,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating participant:', error.message);
    } else {
      displayName.value = data.name;
      participant_name.value = data.name;
      showDialog.value = false;

      // Load availability
      loadAvailability(data.availability);
    }
  }
};

// Interval Grid Methods
function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
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
    const [hours, minutes] = timeStr.split(':').map(Number);
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
    times.value.push(
      ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2)
    );
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
  intervals.value[intervalIndex].selected = !intervals.value[intervalIndex].selected;

  // Save availability after toggling an interval
  debouncedSaveAvailability();
}

function isSelected(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  return intervals.value[intervalIndex].selected;
}

const bitString = computed(() => {
  return intervals.value.map((interval) => (interval.selected ? '1' : '0')).join('');
});

// Function to save availability to Supabase (debounced)
const saveAvailability = async () => {
  if (!participant_name.value) {
    toast({
      title: 'Error',
      description: 'Participant not identified.',
      variant: 'destructive',
    });
    return;
  }

  const { error } = await $supabase
    .from('participants')
    .update({ availability: bitString.value })
    .eq('event_id', event_id.value)
    .eq('name', participant_name.value);

  if (error) {
    console.error('Error updating availability:', error.message);
    toast({
      title: 'Error',
      description: 'Failed to save availability.',
      variant: 'destructive',
    });
  }
};

// Debounced version of saveAvailability
const debouncedSaveAvailability = debounce(saveAvailability, 500);

// Function to load existing availability into intervals
function loadAvailability(availabilityString) {
  if (!availabilityString || availabilityString.length !== intervals.value.length) {
    // Initialize to zeros if availabilityString is null or length mismatch
    availabilityString = '0'.repeat(intervals.value.length);
  }

  availabilityString.split('').forEach((char, index) => {
    intervals.value[index].selected = char === '1';
  });
}
</script>

<style>
.interval-cell {
  width: 50px;
  height: 30px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.interval-cell.selected {
  background-color: #66cc66;
}

table {
  border-collapse: collapse;
}

th,
td {
  text-align: center;
}
</style>
