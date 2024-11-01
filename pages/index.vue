<template>
  <div>
    <PageHeader class="dark:bg-zinc-950" />
    <div class="bg-zinc-50 dark:bg-black">
      <div class="container min-h-screen">
        <div class="w-full pt-8 md:pt-10 lg:pt-14">
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
                    <div
                      v-if="upcomingEvents.length === 0"
                      class="text-base text-zinc-400 dark:text-zinc-500"
                    >
                      No upcoming events found.
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
                                ><ArrowUpRight class="size-4 hover:opacity-70"
                              /></NuxtLink>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter
                    class="flex flex-col md:flex-row items-end justify-between px-6 pb-6"
                  >
                    <div
                      class="w-full md:w-auto flex justify-start gap-4 md:gap-0"
                    >
                      <Button
                        class="mt-2 md:mr-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black dark:hover:bg-zinc-400"
                        @click="toCreate"
                      >
                        <CalendarIcon class="mr-2" />Create Event
                      </Button>
                      <Button
                        variant="outline"
                        class="mt-2 md:ml-2 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
                        @click="toJoin"
                      >
                        <PlusCircledIcon class="mr-2" />Join Event
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      class="border-zinc-300 dark:border-zinc-600 text-black dark:text-white p-0 h-8 mt-4"
                      @click="navigateTo('/events')"
                    >
                      View all Events
                      <ArrowRight class="size-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div class="mt-4 md:mt-6 lg:mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Project TODOs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      v-if="todos.length === 0"
                      class="text-base text-zinc-400 dark:text-zinc-500"
                    >
                      No assigned TODOs found.
                    </div>
                    <ul v-else>
                      <table class="min-w-full">
                        <thead>
                          <tr>
                            <th class="py-2 px-4 border-b border-gray-300 text-left">#</th>
                            <th class="py-2 px-4 border-b border-gray-300 text-left">Title</th>
                            <th class="py-2 px-4 border-b border-gray-300 text-left">Status</th>
                            <th class="py-2 px-4 border-b border-gray-300 text-left">Project</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(todo, index) in todos" :key="todo.id" >
                            <td class="py-2 px-4 border-b border-gray-300">{{ index + 1 }}</td>
                            <td class="py-2 px-4 border-b border-gray-300">{{ todo.title }}</td>
                            <td class="py-2 px-4 border-b border-gray-300">{{ todo.status }}</td>
                            <td class="py-2 px-4 border-b border-gray-300">
                              {{ getProjectTitle(todo.project_id) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </ul>
                  </CardContent>
                  <CardFooter class="flex justify-end">
                    <Button
                      variant="link"
                      class="border-zinc-300 dark:border-zinc-600 text-black dark:text-white p-0 h-8 mt-2"
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
              <Card class="mb-4 md:mb-6 lg:mb-8">
                <CardHeader>
                  <CardTitle>Manage Teams</CardTitle>
                </CardHeader>
                <CardFooter
                  class="flex flex-col md:flex-row items-end justify-between px-6 pb-6"
                >
                  <div
                    class="w-full md:w-auto flex justify-start gap-4 md:gap-0"
                  >
                    <Button
                      class="mt-2 md:mr-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black dark:hover:bg-zinc-400"
                      @click="toCreateTeam"
                    >
                      <PersonIcon class="mr-2" />Create Team
                    </Button>
                    <Button
                      variant="outline"
                      class="mt-2 md:ml-2 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
                      @click="toJoinTeam"
                    >
                      <PlusCircledIcon class="mr-2" />Join Team
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    class="border-zinc-300 dark:border-zinc-600 text-black dark:text-white p-0 h-8 mt-4"
                    @click="navigateTo('/teams')"
                  >
                    View all Teams
                    <ArrowRight class="size-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="flex flex-row">
                    <Avatar class="w-16 h-16 mr-6">
                      <img :src="profilePictureUrl" />
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
                  <div class="mt-8 flex flex-col gap-4">
                    <gCalButton />
                    <mCalButton />
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
import { CalendarIcon, PlusCircledIcon, PersonIcon } from "@radix-icons/vue";
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
import { ArrowRight, ArrowUpRight, Pencil } from "lucide-vue-next";
import { PageFooter } from "@/components/custom/page-footer";
import { gCalButton } from "@/components/custom/gcal-button";
import { mCalButton } from "@/components/custom/mcal-button";

definePageMeta({
  middleware: "landing",
});

// Supabase setup
const supabase = useSupabaseClient();

const showDialog = ref(false);
const newDisplayName = ref("");
const displayName = ref("");
const profilePictureUrl = ref("");
const email = ref("");
const user = useSupabaseUser();

// State variables for Upcoming Events and TODOs
const upcomingEvents = ref([]);
const todos = ref([]);

const projects = ref([]);

// Fetch user info and open dialog if display name is missing
if (user.value) {
  email.value = user.value.email;
  if (
    user.value.app_metadata.provider == "email" &&
    !user.value.app_metadata.providers.includes("google")
  ) {
    const { data: profilePicData, error: profilePicError } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(`pics/default-${user.value.id}.png`);
    profilePictureUrl.value = profilePicData.publicUrl;
  } else {
    profilePictureUrl.value = user.value.user_metadata.avatar_url;
  }

  if (user.value.user_metadata.name) {
    displayName.value = user.value.user_metadata.name;
  } else {
    showDialog.value = true;
  }
}

// Fetch upcoming events for the logged-in user
const fetchUpcomingEvents = async () => {
  // Fetch event IDs from the participants table where the user is a participant
  const { data: participantData, error: participantError } = await supabase
    .from("participants")
    .select("event_id")
    .eq("user_id", user.value.id);

  if (participantError) {
    console.error("Error fetching event IDs:", participantError.message);
    return;
  }

  // If no events are found in the participants table
  if (!participantData || participantData.length === 0) {
    console.log("No upcoming events found for this user.");
    upcomingEvents.value = [];
    return;
  }

  // Extract event IDs
  const eventIds = participantData.map((participant) => participant.event_id);

  // Fetch the event details for these event IDs
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds) // Fetch events where the event ID is in the list of participant event IDs
    .gte("start_date", new Date().toISOString().split("T")[0]) // Only fetch upcoming events (date greater than or equal to today)
    .order("start_date", { ascending: true });

  if (eventError) {
    console.error("Error fetching events:", eventError.message);
  } else {
    upcomingEvents.value = eventData;
  }
};

// Fetch TODOs for the logged-in user
const fetchTodos = async () => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("assigned_to", user.value.id);

  if (error) {
    console.error("Error fetching todos:", error.message);
  } else {
    todos.value = data;
  }
};

// Fetch data on component mount
onMounted(() => {
  if (user.value) {
    fetchUpcomingEvents();
    fetchTodos();
  }
});

// Function to save the display name
const saveDisplayName = async () => {
  if (newDisplayName.value) {
    const { error } = await supabase.auth.updateUser({
      data: { name: newDisplayName.value },
    });

    if (error) {
      console.error("Error updating profile:", error.message);
    } else {
      displayName.value = newDisplayName.value;
      showDialog.value = false;
    }
  }
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


const fetchProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error("Error fetching projects:", error.message);
  } else {
    projects.value = data;
  }
};

const getProjectTitle = (project_id) => {
  const project = projects.value.find((proj) => proj.id === project_id);
  return project ? project.title : "Unknown Project";
};

onMounted(() => {
  fetchProjects();
});
</script>
