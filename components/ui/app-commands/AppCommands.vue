<template>
  <div>
    <CommandDialog :open="open" @update:open="$emit('update:open', false)">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList class="min-h-[32rem] p-2">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Events">
          <CommandItem value="search-events"> Search Events... </CommandItem>
          <CommandItem value="create-event"> Create New Event... </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Teams">
          <CommandItem value="search-teams"> Search Teams... </CommandItem>
          <CommandItem value="create-team"> Create New Team... </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem value="search-projects">
            Search Projects...
          </CommandItem>
          <CommandItem value="create-new-project">
            Create New Project
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="General">
          <CommandItem value="change-theme"> Change Theme.... </CommandItem>
          <CommandItem value="copy-url"> Copy Current URL </CommandItem>
          <CommandItem value="notifications">
            Notification Preferences
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem value="home"
            ><ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold"
              >&nbsp;Home</span
            >
          </CommandItem>
          <CommandItem value="go-your-events"
            ><ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold"
              >&nbsp;Your events</span
            >
          </CommandItem>
          <CommandItem value="go-your-teams"
            ><ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold"
              >&nbsp;Your teams</span
            >
          </CommandItem>
          <CommandItem value="go-your-projects"
            ><ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold"
              >&nbsp;Your projects</span
            >
          </CommandItem>
          <CommandItem value="go-notification-inbox"
            ><ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold"
              >&nbsp;Notification Inbox</span
            >
          </CommandItem>
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
import { ArrowRight } from "lucide-vue-next";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:open"]);
</script>

<style></style>
