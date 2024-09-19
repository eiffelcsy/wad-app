<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="currentView === 1" key="view1">
        <!-- View 1: Title and Description -->
        <h2>Create Task - Step 1</h2>
        <div>
          <label>Title</label>
          <input type="text" v-model="title" />
          <div v-if="errors.title" class="error">{{ errors.title }}</div>
        </div>
        <div>
          <label>Description</label>
          <textarea v-model="description"></textarea>
          <div v-if="errors.description" class="error">
            {{ errors.description }}
          </div>
        </div>
        <button @click="nextView">Next</button>
      </div>

      <div v-else-if="currentView === 2" key="view2">
        <!-- View 2: Date Range Picker for start_date and end_date -->
        <h2>Create Task - Step 2</h2>
        <label>Date Range</label>
        <RangeCalendar v-model="dateRange" />
        <div v-if="errors.dateRange" class="error">{{ errors.dateRange }}</div>
        <button @click="prevView">Back</button>
        <button @click="nextView">Next</button>
      </div>

      <div v-else-if="currentView === 3" key="view3">
        <!-- View 3: Time Selection for start_time and end_time -->
        <h2>Create Task - Step 3</h2>
        <div>
          <label>Start Time</label>
          <input type="time" v-model="startTime" />
          <div v-if="errors.startTime" class="error">
            {{ errors.startTime }}
          </div>
        </div>
        <div>
          <label>End Time</label>
          <input type="time" v-model="endTime" />
          <div v-if="errors.endTime" class="error">{{ errors.endTime }}</div>
        </div>
        <button @click="prevView">Back</button>
        <button @click="nextView">Next</button>
      </div>

      <div v-else-if="currentView === 4" key="view4">
        <!-- View 4: Number of Participants -->
        <h2>Create Task - Step 4</h2>
        <div>
          <label>Number of Participants</label>
          <input type="number" v-model="numberOfParticipants" min="1" />
          <div v-if="errors.numberOfParticipants" class="error">
            {{ errors.numberOfParticipants }}
          </div>
        </div>
        <button @click="prevView">Back</button>
        <button @click="nextView">Next</button>
      </div>

      <div v-else-if="currentView === 5" key="view5">
        <!-- View 5: Submit -->
        <h2>Create Task - Review and Submit</h2>
        <p>Please review your information before submitting.</p>
        <!-- Display summary of inputs -->
        <div><strong>Title:</strong> {{ title }}</div>
        <div><strong>Description:</strong> {{ description }}</div>
        <div>
          <strong>Date Range:</strong> {{ formatDate(dateRange.start) }} to
          {{ formatDate(dateRange.end) }}
        </div>
        <div>
          <strong>Time:</strong> {{ startTime }} to
          {{ endTime }}
        </div>
        <div>
          <strong>Number of Participants:</strong> {{ numberOfParticipants }}
        </div>
        <button @click="prevView">Back</button>
        <button @click="submitEvent">Submit</button>
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

const start = today(getLocalTimeZone());
const end = start.add({ days: 7 });

const title = ref("");
const description = ref("");
const startTime = ref(null);
const endTime = ref(null);
const numberOfParticipants = ref(1);
const currentView = ref(1);
const errors = ref({});
const dateRange = ref({
  start,
  end,
}) as Ref<DateRange>;

const {
  data: { user },
} = await $supabase.auth.getUser();

const validateCurrentView = () => {
  errors.value = {};

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

const nextView = () => {
  if (validateCurrentView()) {
    currentView.value++;
  }
};

const prevView = () => {
  currentView.value--;
};

const generateEventCode = async () => {
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
  navigateTo(`/event/${eventCode}`);
};

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.error {
  color: red;
}
</style>
