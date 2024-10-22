<template>
  <div>
    <PageHeader />
    <div
      class="w-full px-8 min-h-screen flex flex-col pt-8 pb-10 items-center bg-zinc-50 dark:bg-black"
    >
      <div class="mx-auto w-full lg:w-1/2">
        <h1
          class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4 text-center"
        >
          New Team
        </h1>
        <p
          class="text-base text-zinc-400 dark:text-zinc-500 text-center"
        >
          Create and customize a new team by filling in the details below.
        </p>
      </div>
      <transition name="fade" mode="out-in">
        <div
          v-if="currentView === 1"
          key="view1"
          class="relative w-full lg:w-1/2 h-full flex flex-col md:items-center md:mt-4 lg:mt-8"
        >
          <!-- View 1: Team Name and Description -->
          <div
            class="w-full flex flex-col mt-4 md:flex-row md:justify-center gap-4 md:gap-6 lg:gap-8"
          >
            <Card class="w-full">
              <CardContent class="pt-4">
                <div>
                  <h1
                    class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
                  >
                    Team Name
                  </h1>
                  <Input
                    id="teamName"
                    type="text"
                    placeholder="Enter Team Name"
                    v-model="teamName"
                    class="w-full h-12 text-sm sm:text-base p-2 sm:p-3"
                  />
                  <div v-if="errors.teamName" class="error absolute text-xs mt-1">
                    {{ errors.teamName }}
                  </div>
                </div>
                <div class="pt-4">
                  <h1
                    class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
                  >
                    Description
                  </h1>
                  <Textarea
                    id="description"
                    type="text"
                    placeholder="Enter Description"
                    v-model="description"
                    class="w-full h-12 lg:h-40 text-sm sm:text-base p-2 sm:p-3 mt-2"
                  />
                  <div
                    v-if="errors.description"
                    class="error absolute text-xs mt-1"
                  >
                    {{ errors.description }}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button @click="nextView" class="mt-6 md:mt-8 lg:mt-10 w-full"
            >Next</Button
          >
        </div>

        <div
          v-else-if="currentView === 2"
          key="view2"
          class="relative w-full lg:w-1/2 h-full flex flex-col md:items-center md:mt-4 lg:mt-8"
        >
          <!-- View 2: Review and Submit -->
          <div class="mb-8">
            <h1
              class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
            >
              Review and Submit
            </h1>
            <p class="text-zinc-700 dark:text-zinc-300 mt-4 text-center">
              Please review your information before submitting.
            </p>
            <div class="mt-6 space-y-2">
              <div>
                <strong class="text-zinc-800 dark:text-zinc-100">Team Name: </strong>
                <span class="text-zinc-700 dark:text-zinc-300">{{ teamName }}</span>
              </div>
              <div v-if="description">
                <strong class="text-zinc-800 dark:text-zinc-100">Description: </strong>
                <span class="text-zinc-700 dark:text-zinc-300">{{ description }}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-8 w-full">
            <Button @click="prevView" variant="outline" class="w-full mr-2"
              >Back</Button
            >
            <Button @click="submitTeam" class="w-full ml-2 bg-green-600 text-white"
              >Create Team</Button
            >
          </div>
        </div>
      </transition>

      <!-- Dialog -->
      <Dialog :open="showDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle class="tw-text-xl">
              Team Created: <strong>{{ teamCode }}</strong>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Share this code or link below to invite members.
          </DialogDescription>
          <div class="flex items-center space-x-2">
            <div class="grid flex-1 gap-2">
              <Input readonly :default-value="shareableLink" />
            </div>
            <Button type="submit" size="sm" class="px-3" @click="copyLink">
              <span class="sr-only">Copy</span>
              <Copy class="w-4 h-4" />
            </Button>
          </div>
          <DialogFooter class="sm:justify-start">
            <DialogClose as-child>
              <Button type="button" variant="secondary" @click="closeDialog">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <PageFooter />
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { navigateTo } from 'nuxt/app';
import { PageHeader } from '@/components/custom/page-header';
import { PageFooter } from '@/components/custom/page-footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Copy } from 'lucide-vue-next';

const supabase = useSupabaseClient();

interface Errors {
  teamName?: string;
  description?: string;
}

const teamName = ref<string>(''); // Initialize team name
const description = ref<string>(''); // Initialize description
const currentView = ref<number>(1); // Keeps track of the current view
const errors = ref<Errors>({}); // Holds errors related to input fields
const teamCode = ref<string | null>(null); // Team code generated
const shareableLink = ref<string>(''); // Shareable team link
const showDialog = ref<boolean>(false); // Control dialog visibility
const user = useSupabaseUser().value; // Current user info from Supabase

// Validation function for the current view
const validateCurrentView = (): boolean => {
  errors.value = {};

  if (currentView.value === 1) {
    if (!teamName.value.trim()) {
      errors.value.teamName = 'Team Name is required.';
    }
  }

  return Object.keys(errors.value).length === 0;
};

// Navigation functions
const nextView = () => {
  if (validateCurrentView()) {
    currentView.value++;
  }
};

const prevView = () => {
  currentView.value--;
};

// Generate unique team code
const generateTeamCode = async (): Promise<string | null> => {
  let code = '';
  let exists = true;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  while (exists) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if code exists in Supabase table
    const { data, error } = await supabase
      .from('teams')
      .select('code')
      .eq('code', code);

    if (error) {
      console.error('Error checking team code:', error);
      return null;
    }

    if (data.length === 0) {
      exists = false; // Unique code found
    }
  }

  return code;
};

// Function to submit the team
const submitTeam = async () => {
  teamCode.value = await generateTeamCode();

  if (!teamCode.value) {
    alert('Failed to generate team code. Please try again.');
    return;
  }

  // Prepare data for insertion
  const teamData = {
    team_name: teamName.value,
    description: description.value,
    creator_user_id: user?.id || null,  // Use the current user ID
    code: teamCode.value,
  };

  // Insert into Supabase
  const { data, error } = await supabase.from('teams').insert([teamData]);

  if (error) {
    console.error('Error creating team:', error);
    alert('Failed to create team. Please try again.');
    return;
  }

  // Set shareable link
  shareableLink.value = `${window.location.origin}/team/${teamCode.value}`;

  // Show dialog after team is created
  if (shareableLink.value) {
    showDialog.value = true;
  }
};

// Close the dialog and redirect to the created team page
const closeDialog = () => {
  showDialog.value = false;
  navigateTo(`/team/${teamCode.value}`);
};

// Copy the shareable link to clipboard
const copyLink = () => {
  navigator.clipboard.writeText(shareableLink.value);
  alert('Link copied to clipboard!');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.error {
  color: red;
}
</style>
