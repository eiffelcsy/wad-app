<template>
  <div>
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
    <Toaster />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";
import { navigateTo } from "nuxt/app";

const { $supabase } = useNuxtApp();
const route = useRoute();
const { toast } = useToast();

const showDialog = ref(false);
const event_id = ref("");
const newDisplayName = ref("");
const displayName = ref("");

const event_code = route.params.eventId;
const { data: findEventId, error: findEventError } = await $supabase
  .from("events")
  .select("id")
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
  event_id.value = findEventId.id;
}

const {
  data: { user },
} = await $supabase.auth.getUser();

if (!user && event_code) {
  showDialog.value = true;
} else if (user && event_code) {
  if (event_id) {
    const { data: existingParticipant, error: selectError } = await $supabase
      .from("participants")
      .select("*")
      .eq("event_id", event_id.value)
      .eq("user_id", user.id)
      .single();

    displayName.value = existingParticipant.name;

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking participant:", selectError);
    } else if (existingParticipant) {
      console.log("Participant already exists:", existingParticipant);
    } else {
      const { data, error } = await $supabase.from("participants").insert({
        event_id: event_id.value,
        user_id: user.id,
        name: user.user_metadata.name,
        email: user.email,
      });

      if (error) {
        console.error("Error inserting participant:", error);
      } else {
        console.log("Participant added.");
      }
    }
  }
}

const saveDisplayName = async () => {
  if (newDisplayName.value) {
    const { data, error } = await $supabase.from("participants").insert({
      event_id: event_id.value,
      name: newDisplayName.value,
    });

    if (error) {
      console.error("Error updating profile:", error.message);
    } else {
      displayName.value = newDisplayName.value;
      showDialog.value = false;
    }
  }
};
</script>
