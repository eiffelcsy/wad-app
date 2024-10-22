<template>
  <div>
    <PageHeader v-if="user" class="dark:bg-zinc-950" />
    <div
      v-else
      class="flex flex-row justify-between py-4 px-8 md:px-12 lg:px-16 bg-zinc-50 dark:bg-black"
    >
      <div class="flex items-center">
        <NuxtLink to="/" class="">
          <p class="text-xl font-bold tracking-wider">MeetLah</p>
        </NuxtLink>
      </div>
      <Button
        @click="toLogin"
        variant="outline"
        class="lg:right-12 border-zinc-300 dark:border-zinc-600"
      >
        <EnterIcon class="w-4 h-4 mr-2" />Login
      </Button>
    </div>
    <div class="bg-zinc-50 dark:bg-black">
      <div class="container min-h-screen">
        <div
          v-if="!user"
          class="w-full h-lvh content-center md:w-2/3 md:px-8 lg:w-1/2 lg:px-16"
        >
          <h1
            class="text-3xl md:text-4xl lg:text-5xl text-zinc-800 dark:text-zinc-100 font-bold my-2"
          >
            Simplify Scheduling. Amplify Collaboration.
          </h1>
          <p
            class="text-base md:text-lg lg:text-xl text-zinc-400 dark:text-zinc-500 my-2 lg:my-4 lg:pr-4"
          >
            MeetLah makes it easy to coordinate meetings and events. Share your
            availability, let others pick a time, and get notified instantly.
          </p>
          <Button
            class="mt-2 mr-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
            @click="toCreate"
          >
            Create Event
            <CalendarIcon class="ml-2" />
          </Button>
          <Button
            variant="outline"
            class="mt-2 ml-2 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
            @click="toJoin"
          >
            Join Event
            <PlusCircledIcon class="ml-2" />
          </Button>
        </div>

        <div v-else class="w-full pt-8 md:pt-10 lg:pt-14">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold">
            Hi, {{ displayName }}!
          </h1>
          <div
            class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 py-8 md:py-10 lg:py-12"
          >
            <div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div v-if="upcomingEvents.length === 0">
                      No upcoming events.
                    </div>
                    <div v-else>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead class="w-1/2">Title</TableHead>
                            <TableHead>Date Range</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow
                            v-for="event in upcomingEvents"
                            :key="event.id"
                          >
                            <TableCell class="text-left">{{
                              event.title
                            }}</TableCell>
                            <TableCell class="text-left text-nowrap">
                              {{
                                new Date(event.start_date).toLocaleDateString()
                              }}
                              to
                              {{
                                new Date(event.end_date).toLocaleDateString()
                              }}
                            </TableCell>
                            <TableCell>
                              <NuxtLink
                                :to="{
                                  name: 'event-eventId',
                                  params: { eventId: event.code },
                                }"
                                ><Pencil class="size-4"
                              /></NuxtLink>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter
                    class="flex justify-between md:justify-start px-6 pb-6"
                  >
                    <Button
                      variant="outline"
                      class="mt-2 md:mr-2 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
                      @click="toJoin"
                    >
                      Join Event
                      <PlusCircledIcon class="ml-2" />
                    </Button>
                    <Button
                      class="mt-2 md:ml-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black dark:hover:bg-zinc-400"
                      @click="toCreate"
                    >
                      Create Event
                      <CalendarIcon class="ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
                            <!-- Teams Section -->
                            <div class="mt-4 md:mt-6 lg:mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="flex flex-wrap">
                      <Button
                        variant="outline"
                        class="mt-2 mr-2 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
                        @click="toJoinTeam"
                      >
                        Join Team
                        <PlusCircledIcon class="ml-2" />
                      </Button>
                      <Button
                        class="mt-2 mr-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
                        @click="toCreateTeam"
                      >
                        Create Team
                        <PersonIcon class="ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        class="mt-2 mr-2 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
                        @click="toMyTeams"
                      >
                        My Teams
                        <PersonIcon class="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div class="mt-4 md:mt-6 lg:mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Project TODOs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div v-if="todos.length === 0">No TODOs found.</div>
                    <ul v-else>
                      <li v-for="todo in todos" :key="todo.id">
                        {{ todo.title }} - {{ todo.status }}
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter class="flex justify-end">
                    <Button
                      variant="link"
                      class="border-zinc-300 dark:border-zinc-600 text-black dark:text-white p-0 h-8"
                      @click="navigateTo('/projects')"
                    >
                      View all Projects
                      <ArrowRight class="size-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div class="order-last lg:order-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="flex flex-row">
                    <Avatar class="w-16 h-16 mr-6">
                      <UserRoundIcon
                        size="24px"
                        strokeWidth="{1}"
                        class="opacity-60"
                      />
                    </Avatar>
                    <div>
                      <h1 class="text-2xl font-semibold">
                        {{ displayName }}
                      </h1>
                      <p class="text-base text-zinc-400 dark:text-zinc-500">
                        {{ email }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-8 flex flex-col gap-6">
                    <gCalButton />
                    <Button>Placeholder for Microsoft Outlook</Button>
                    <Button>Placeholder for Apple Calendar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <!-- Dialog for updating display name -->
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
                >Save</Button
              >
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <PageFooter />
  </div>
</template>

<script setup>
import { CalendarIcon, EnterIcon, PlusCircledIcon, PersonIcon } from "@radix-icons/vue";
import { navigateTo } from "nuxt/app";
import { PageHeader } from "@/components/custom/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ref, onMounted } from "vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Pencil } from "lucide-vue-next";
import { PageFooter } from "@/components/custom/page-footer";
import { gCalButton } from "@/components/custom/gcal-button";

// Supabase setup
const supabase = useSupabaseClient();

const showDialog = ref(false);
const newDisplayName = ref("");
const displayName = ref("");
const email = ref("");
const user = useSupabaseUser();

// State variables for Upcoming Events and TODOs
const upcomingEvents = ref([]);
const todos = ref([]);

// Fetch user info and open dialog if display name is missing
if (user.value) {
  if (user.value.user_metadata.name) {
    displayName.value = user.value.user_metadata.name;
  } else {
    showDialog.value = true;
  }
  email.value = user.value.email;
}

// Navigation functions for Events
const toLogin = () => {
  navigateTo("/auth");
};
const toCreate = () => {
  if (user.value) {
    navigateTo("/create-event");
  } else {
    navigateTo("/auth");
  }
};
const toJoin = () => {
  navigateTo("/join");
};

// Navigation functions for Teams
const toCreateTeam = () => {
  if (user.value) {
    navigateTo("/create-team");
  } else {
    navigateTo("/auth");
  }
};
const toJoinTeam = () => {
  navigateTo("/join-team");
};
const toMyTeams = () => {
  navigateTo("/my-teams");
};
</script>
