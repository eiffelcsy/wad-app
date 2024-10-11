<template>
  <div>
    <Button class="w-full bg-green-600" v-if="gCalConnected"
      ><CircleCheckBig class="mr-2"/> Google Calendar is Connected</Button
    >
    <Button class="w-full" @click="connectGoogleCalendar" v-else>
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
import { CircleCheckBig } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const connectionStatus = ref("");
const gCalConnected = ref(false);

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { data: gtokens, error } = await supabase
  .from("gtokens")
  .select("*")
  .eq("user_id", user.value.id)
  .single();

if (gtokens) {
  gCalConnected.value = true;
} else if (error) {
  console.log(error.message);
}

async function connectGoogleCalendar() {
  try {
    const redirectFrom = route.fullPath;
    window.location.href = `/api/auth/google?redirect_uri=${encodeURIComponent(
      redirectFrom
    )}`;
  } catch (error) {
    console.error("Error:", error);
    connectionStatus.value = "An error occurred during calendar connection.";
  }
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>
