<template>
  <div>
    <button @click="handleClick">{{ buttonText }}</button>
    <div v-html="output"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const output = ref('');
const buttonText = 'Get Calendar Events';

async function handleClick() {
  try {
    const response = await fetch('/api/calendar/events');
    if (response.status === 401) {
      // User is not authenticated; redirect to login
      window.location.href = '/api/auth/google';
    } else if (response.ok) {
      const events = await response.json();
      if (events.length === 0) {
        output.value = 'No events found.';
      } else {
        output.value = events
          .map(
            (event) =>
              `${event.summary} (${event.start.dateTime || event.start.date}) - ${event.calendarName}`
          )
          .join('<br/>');
      }
    } else {
      output.value = 'Error fetching events.';
    }
  } catch (error) {
    console.error('Error:', error);
    output.value = 'An error occurred.';
  }
}

</script>

<style scoped>
/* Add any necessary styles here */
</style>
