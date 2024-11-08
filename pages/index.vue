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
                <Card class="hover:border-indigo-600 transition duration-500">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                          v-if="upcomingEvents.length > 0"
                        >
                          <TableCell class="text-left">{{
                            event.title
                          }}</TableCell>
                          <TableCell class="text-left text-nowrap">
                            {{
                              new Date(event.start_date).toLocaleDateString()
                            }}
                            to
                            {{ new Date(event.end_date).toLocaleDateString() }}
                          </TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" aschild
                              ><NuxtLink
                                :to="{
                                  name: 'event-eventId',
                                  params: { eventId: event.code },
                                }"
                                ><ArrowUpRight
                                  class="size-4 hover:opacity-70" /></NuxtLink
                            ></Button>
                          </TableCell>
                        </TableRow>
                        <TableRow v-else>
                          <TableCell
                            colspan="3"
                            class="text-center text-zinc-500"
                          >
                            No events found.
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter
                    class="flex flex-col md:flex-row items-end justify-between px-6 pb-6"
                  >
                    <div
                      class="w-full md:w-auto flex justify-start gap-4 md:gap-0"
                    >
                      <Button
                        class="mt-2 md:mr-2 bg-indigo-600 text-white dark:hover:bg-indigo-700"
                        @click="toCreate"
                      >
                        <CalendarIcon class="mr-2" />Create Event
                      </Button>
                      <Button
                        variant="outline"
                        class="mt-2 md:ml-2"
                        @click="toJoin"
                      >
                        <PlusCircledIcon class="mr-2" />Join Event
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      class="text-black dark:text-white p-0 h-8 mt-4"
                      @click="() => navigateTo('/events')"
                    >
                      View all Events
                      <ArrowRight class="size-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div class="mt-4 md:mt-6 lg:mt-8">
                <Card class="hover:border-indigo-600 transition duration-500">
                  <CardHeader>
                    <CardTitle>Project Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table class="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead class="py-2 px-4 text-left"
                            >Title</TableHead
                          >
                          <TableHead class="py-2 px-4 text-left"
                            >Status</TableHead
                          >
                          <TableHead class="py-2 px-4 text-left"
                            >Project</TableHead
                          >
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow
                          v-for="(todo, index) in todos"
                          :key="todo.id"
                          v-if="todos.length > 0"
                        >
                          <TableCell class="py-2 px-4">{{
                            todo.title
                          }}</TableCell>
                          <TableCell class="py-2 px-4"
                            ><span class="text-red-600">{{
                              todo.status == "pending" ? "Pending" : ""
                            }}</span
                            ><span class="text-amber-500">{{
                              todo.status == "in_progress" ? "In Progress" : ""
                            }}</span></TableCell
                          >
                          <TableCell class="py-2 px-4 flex flex-row">
                            <NuxtLink
                              :to="{
                                name: 'project-projectId',
                                params: { projectId: todo.project_id },
                              }"
                              class="relative hover:before:w-full after:content-['_↗'] before:absolute before:left-0 before:-bottom-0.5 before:h-[1px] before:bg-primary"
                              >{{ getProjectTitle(todo.project_id) }}
                            </NuxtLink>
                          </TableCell>
                        </TableRow>
                        <TableRow v-else>
                          <TableCell
                            colspan="3"
                            class="text-center text-zinc-500"
                          >
                            No tasks found.
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter class="flex justify-end">
                    <Button
                      variant="link"
                      class="text-black dark:text-white p-0 h-8 mt-2"
                      @click="() => navigateTo('/projects')"
                    >
                      View all Projects
                      <ArrowRight class="size-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div class="order-last lg:order-1">
              <Card
                class="mb-4 md:mb-6 lg:mb-8 hover:border-indigo-600 transition duration-500"
              >
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
                      class="mt-2 md:mr-2 bg-indigo-600 text-white hover:bg-indigo-700"
                      @click="toCreateTeam"
                    >
                      <PersonIcon class="mr-2" />Create Team
                    </Button>
                    <Button
                      variant="outline"
                      class="mt-2 md:ml-2"
                      @click="toJoinTeam"
                    >
                      <PlusCircledIcon class="mr-2" />Join Team
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    class="border-zinc-300 dark:border-zinc-600 text-black dark:text-white p-0 h-8 mt-4"
                    @click="() => navigateTo('/teams')"
                  >
                    View all Teams
                    <ArrowRight class="size-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              <Card class="hover:border-indigo-600 transition duration-500">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="flex flex-row">
                    <Avatar class="w-16 h-16 mr-6" @click="openProfileDialog">
                      <div
                        class="w-16 h-16 rounded-full flex items-center justify-center absolute opacity-0 hover:opacity-100 hover:backdrop-brightness-50 transition-all duration-300"
                      >
                        <Pencil class="text-white" />
                      </div>
                      <img :src="profilePictureUrl" />
                    </Avatar>
                    <div>
                      <div class="flex flex-row gap-2 items-center">
                        <h1 class="text-2xl font-semibold">
                          {{ displayName }}
                        </h1>
                        <Pencil
                          class="w-4 h-4 opacity-0 hover:opacity-100 transition-all duration-200"
                          @click="openDialog"
                        />
                      </div>
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
                <Dialog v-model:open="isProfileDialogOpen">
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div class="flex flex-col items-center gap-4">
                      <img
                        v-if="newAvatarUrl"
                        :src="newAvatarUrl"
                        class="w-32 h-32 rounded-full object-cover"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleAvatarUpload"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        class="bg-indigo-600 hover:bg-indigo-700 text-white"
                        @click="saveAvatar"
                        >Save</Button
                      >
                      <Button variant="outline" @click="closeProfileDialog"
                        >Cancel</Button
                      >
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>
          </div>
        </div>

        <!-- Dialog for updating display name -->
        <Dialog v-model:open="showDialog">
          <DialogOverlay />
          <DialogContent class="w-5/6 rounded-md border-indigo-600">
            <DialogTitle>Update Display Name</DialogTitle>
            <DialogDescription>
              Please enter your display name to continue.
            </DialogDescription>
            <Input
              v-model="newDisplayName"
              placeholder="Enter your display name"
              class="my-4"
            />
            <DialogFooter>
              <Button
                @click="saveDisplayName"
                class="bg-indigo-600 hover:bg-indigo-700 text-white"
                >Save</Button
              >
              <Button variant="outline" @click="closeDialog">Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <Toaster />
    <PageFooter />
  </div>
</template>

<script setup>
import { CalendarIcon, PlusCircledIcon, PersonIcon } from "@radix-icons/vue";
import { navigateTo } from "#app";
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
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";

definePageMeta({
  middleware: "landing",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toast } = useToast();

const showDialog = ref(false);
const newDisplayName = ref("");
const displayName = ref("");
const profilePictureUrl = ref("");
const email = ref("");
const upcomingEvents = ref([]);
const todos = ref([]);
const projects = ref([]);
const isProfileDialogOpen = ref(false);
const newAvatarUrl = ref(null);
const selectedFile = ref(null);
const uploading = ref(false);

function openProfileDialog() {
  isProfileDialogOpen.value = true;
}

function openDialog() {
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
}

function closeProfileDialog() {
  isProfileDialogOpen.value = false;
  newAvatarUrl.value = null;
  selectedFile.value = null;
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (file) {
    newAvatarUrl.value = URL.createObjectURL(file);
    selectedFile.value = file;
  }
}

async function saveAvatar() {
  uploading.value = true;
  try {
    const file = selectedFile.value;
    if (!file) {
      throw new Error("Please select an image to upload.");
    }

    const filePath = `pics/${user.value.id}`;
    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file);
    if (error) throw error;

    profilePictureUrl.value = URL.createObjectURL(file);

    closeProfileDialog();
  } catch (error) {
    console.error("Error uploading avatar:", error.message);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `Error uploading profile picture: ${error.message}`,
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
  } finally {
    uploading.value = false;
  }
}

if (user.value) {
  email.value = user.value.email;
  if (
    user.value.app_metadata.provider == "email" &&
    !user.value.app_metadata.providers.includes("google")
  ) {
    const { data: profilePicData, error: profilePicError } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(`pics/${user.value.id}`);
    if (profilePicError) {
      const { data: defaultProfilePicData, error: defaultProfilePicError } =
        supabase.storage
          .from("profile-pictures")
          .getPublicUrl(`default-pics/default-${user.value.id}.png`);
      if (defaultProfilePicError) {
        console.error(defaultProfilePicError.message);
      } else {
        profilePictureUrl.value = defaultProfilePicData.publicUrl;
      }
    } else {
      profilePictureUrl.value = profilePicData.publicUrl;
    }
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
    todos.value = data.filter((todo) => todo.status !== "completed");
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
