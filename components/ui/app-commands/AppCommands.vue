<template>
  <div>
    <CommandDialog :open="open" @update:open="closeDialog">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList class="min-h-[32rem] p-2">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Events">
          <CommandItem value="search-events" @select="handleCommand">
            <CalendarDays class="size-4 mr-2" /> Search Events...
          </CommandItem>
          <CommandItem value="create-event" @select="handleCommand">
            <Plus class="size-4 mr-2" /> Create New Event...
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Teams">
          <CommandItem value="search-teams" @select="handleCommand">
            <UsersRound class="size-4 mr-2" /> Search Teams...
          </CommandItem>
          <CommandItem value="create-team" @select="handleCommand">
            <Plus class="size-4 mr-2" /> Create New Team...
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem value="search-projects" @select="handleCommand">
            <Boxes class="size-4 mr-2" /> Search Projects...
          </CommandItem>
          <CommandItem value="create-new-project" @select="handleCommand">
            <Plus class="size-4 mr-2" /> Create New Project
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="General">
          <CommandItem value="change-theme" @select="handleCommand">
            <Monitor class="size-4 mr-2" /> Change Theme...
          </CommandItem>
          <CommandItem value="copy-url" @select="handleCommand">
            <Copy class="size-4 mr-2" /> Copy Current URL
          </CommandItem>
          <CommandItem value="notifications-preferences-settings" @select="handleCommand">
            <Settings class="size-4 mr-2" /> Notification Preferences
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem value="home" @select="handleCommand">
            <ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold">&nbsp;Home</span>
          </CommandItem>
          <CommandItem value="go-your-events" @select="handleCommand">
            <ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold">&nbsp;Your events</span>
          </CommandItem>
          <CommandItem value="go-your-teams" @select="handleCommand">
            <ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold">&nbsp;Your teams</span>
          </CommandItem>
          <CommandItem value="go-your-projects" @select="handleCommand">
            <ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold">&nbsp;Your projects</span>
          </CommandItem>
          <CommandItem value="go-notification-inbox" @select="handleCommand">
            <ArrowRight class="size-4 mr-2" /> Go to<span class="font-bold">&nbsp;Notification Inbox</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Help">
          <CommandItem value="documentation" @select="handleCommand">
            <BookOpen class="size-4 mr-2" /> View Documentation
          </CommandItem>
          <CommandItem value="contact-support" @select="handleCommand">
            <AtSign class="size-4 mr-2" /> Contact Support
          </CommandItem>
          <CommandItem value="faq" @select="handleCommand">
            <TableOfContents class="size-4 mr-2" /> Frequently Asked Questions
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  Monitor,
  Plus,
  UsersRound,
  Copy,
  Settings,
  BookOpen,
  AtSign,
  TableOfContents
} from "lucide-vue-next";
import { navigateTo } from 'nuxt/app';

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:open"]);

const closeDialog = () => {
  emit('update:open', false);
};

const handleCommand = (eventObj: string) => {
  const value = eventObj.detail.value
  switch (value) {
    case 'home':
      navigateTo('/');
      break;
    case 'go-your-events':
      navigateTo('/events');
      break;
    case 'go-your-teams':
      navigateTo('/teams');
      break;
    case 'go-your-projects':
      navigateTo('/projects');
      break;
    case 'go-notification-inbox':
      navigateTo('/');
      break;
    case 'search-events':
      navigateTo('/events');
      break;
    case 'create-event':
      navigateTo('/create-event');
      break;
    case 'search-teams':
      navigateTo('/teams');
      break;
    case 'create-team':
      navigateTo('/create-team');
      break;
    case 'search-projects':
      navigateTo('/projects');
      break;
    case 'create-new-project':
      navigateTo('/create-project');
      break;
    case 'change-theme':
      // Implement theme change logic
      break;
    case 'copy-url':
      navigator.clipboard.writeText(window.location.href);
      break;
    case 'notifications-preferences-settings':
      navigateTo('/notifications/settings');
      break;
    case 'documentation':
      navigateTo('/documentation');
      break;
    case 'contact-support':
      navigateTo('/support');
      break;
    case 'faq':
      navigateTo('/faq');
      break;
    default:
      console.error('Unknown command:', value);
  }
  closeDialog();
};

</script>

<style></style>
