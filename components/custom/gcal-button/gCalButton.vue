<template>
  <div>
    <Button
      class="w-full transition-all duration-300 ease-in-out bg-green-600 hover:bg-red-600 text-white"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="disconnectGoogleCalendar"
      v-if="gCalConnected"
    >
      <template v-if="isHovered">
        <XCircle class="mr-2 size-4" /> Disconnect from Google Calendar
      </template>
      <template v-else>
        <CircleCheckBig class="mr-2 size-4" /> Google Calendar is Connected
      </template>
    </Button>
    <Button class="w-full" v-else @click="connectGoogleCalendar">
      <img
        src="/icons/google.svg"
        alt="gIcon"
        class="mr-4 size-4 invert dark:invert-0"
      />
      Connect to Google Calendar
    </Button>
    <Toaster/>
  </div>
</template>

<script setup>
import { CircleCheckBig, XCircle } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";

const route = useRoute();
const connectionStatus = ref("");
const gCalConnected = ref(false);
const isHovered = ref(false);

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toast } = useToast();

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

async function disconnectGoogleCalendar() {
  const { error: disconnectError } = await supabase
    .from("gtokens")
    .delete()
    .eq("user_id", user.value.id)
    .single();

  if (disconnectError) {
    console.log(disconnectError.message);
    toast({
      title: "Disconnect Failed...",
      description: disconnectError.message,
      variant: "destructive",
      action: h(
        ToastAction,
        {
          altText: "Try again",
        },
        {
          default: () => "Try again",
        }
      ),
    });
  } else {
    toast({
      title: "Disconnect Success!",
      description: "You have successfully disconnected your Google Calendar.",
      variant: "success",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}
</script>

<style scoped></style>
