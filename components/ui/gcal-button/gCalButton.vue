<template>
  <div>
    <Button class="w-full" @click="connectGoogleCalendar">
      <img
        src="/icons/google.svg"
        alt="gIcon"
        class="mr-4 h-4 w-4 invert dark:invert-0"
      />
      Connect to Google Calendar
    </Button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const connectionStatus = ref("");

async function connectGoogleCalendar() {
  try {
    const redirectFrom = route.fullPath
    window.location.href = `/api/auth/google?redirect_uri=${encodeURIComponent(redirectFrom)}`;
  } catch (error) {
    console.error("Error:", error);
    connectionStatus.value = "An error occurred during calendar connection.";
  }
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>
