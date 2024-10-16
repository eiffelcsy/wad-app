<template>
  <div>
    <CommandDialog :open="open" @update:open="$emit('update:open', false)">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList class="min-h-96 p-2">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Events">
          <CommandItem value="calendar"> Calendar </CommandItem>
          <CommandItem value="schedule-meeting"> Schedule Meeting </CommandItem>
          <CommandItem value="view-events"> View Upcoming Events </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Teams">
          <CommandItem value="team-profile"> View Team Profile </CommandItem>
          <CommandItem value="team-billing"> Team Billing </CommandItem>
          <CommandItem value="team-settings"> Team Settings </CommandItem>
          <CommandItem value="manage-members">
            Manage Team Members
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem value="project-overview"> Project Overview </CommandItem>
          <CommandItem value="create-new-project">
            Create New Project
          </CommandItem>
          <CommandItem value="view-all-projects">
            View All Projects
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="General">
          <CommandItem value="app-settings"> Application Settings </CommandItem>
          <CommandItem value="user-profile"> User Profile </CommandItem>
          <CommandItem value="notifications">
            Notification Preferences
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem value="dashboard"> Go to Dashboard </CommandItem>
          <CommandItem value="home"> Go to Home </CommandItem>
          <CommandItem value="reports"> View Reports </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Help">
          <CommandItem value="documentation"> View Documentation </CommandItem>
          <CommandItem value="contact-support"> Contact Support </CommandItem>
          <CommandItem value="faq"> Frequently Asked Questions </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>

<script lang="ts" setup>
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:open"]);
</script>

<style></style>
