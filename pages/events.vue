<!-- TODO: Events homepage, include create, edit and delete buttons for each event , maybe in a table -->
<template>
  <div>
    <PageHeader />
    <div class="bg-zinc-50 dark:bg-black min-h-screen">
      <div class="container w-full pt-8 md:pt-10 lg:pt-14">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Your Events
        </h1>
      </div>
      <div class="container w-full flex flex-row justify-between pt-8">
        <div class="relative w-full max-h-10 pr-2 items-center">
          <Input
            id="searchEvents"
            type="text"
            placeholder="Search Event Titles..."
            class="pl-10 text-base md:text-sm"
            v-model="searchQuery"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Search class="size-6 text-muted-foreground" />
          </span>
          <Drawer v-if="isMobile" v-model:open="isOpen">
            <DrawerTrigger as-child>
              <Button
                as-child
                size="icon"
                variant="ghost"
                class="absolute end-3 inset-y-0 max-w-[32px] hover:bg-transparent transform active:translate-y-px transition-transform"
              >
                <span class="flex items-center justify-center">
                  <Ellipsis class="size-4 text-muted-foreground" />
                </span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div class="mx-auto mt-4 mb-8 w-full max-w-sm">
                <RadioGroup
                  v-model="selectedSortOption"
                  class="flex flex-col gap-4"
                >
                  <div class="flex items-center space-x-4">
                    <RadioGroupItem
                      id="sortByDate"
                      value="sortByDate"
                      @click="closeDrawer"
                    />
                    <Label for="sortByDate" class="text-base font-normal"
                      >Sort by Date</Label
                    >
                  </div>
                  <div class="flex items-center space-x-4">
                    <RadioGroupItem
                      id="sortByTitle"
                      value="sortByTitle"
                      @click="closeDrawer"
                    />
                    <Label for="SortByTitle" class="text-base font-normal"
                      >Sort by Title</Label
                    >
                  </div>
                </RadioGroup>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <Select
          v-if="!isMobile"
          default-value="sortByDate"
          v-model="selectedSortOption"
        >
          <SelectTrigger class="max-w-36 mr-2">
            <SelectValue placeholder="Sort By..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="sortByDate">Sort By Date</SelectItem>
              <SelectItem value="sortByTitle">Sort By Title</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          @click="navigateTo('/create-event')"
          v-if="isMobile"
          size="icon"
          class="min-w-[40px] text-zinc-100 dark:text-zinc-900"
        >
          <Plus class="size-4" />
        </Button>
        <Button
          @click="navigateTo('/create-event')"
          v-else
          class="text-zinc-100 dark:text-zinc-900"
        >
          New Event
          <Plus class="size-4 ml-2" />
        </Button>
      </div>
      <div class="container w-full py-8">
        <Tabs default-value="all" class="w-full">
          <TabsList class="w-full">
            <TabsTrigger value="all" class="w-full"> All Events </TabsTrigger>
            <TabsTrigger value="past" class="w-full"> Past Events </TabsTrigger>
            <TabsTrigger value="upcoming" class="w-full">
              Upcoming Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>Showing all your events.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Time Range</TableHead>
                      <TableHead>Event Code</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="allEvents.length == 0">
                      <TableCell colspan="6" class="text-center">No Events Found.</TableCell>
                    </TableRow>
                    <TableRow v-for="event in allEvents" :key="event.id">
                      <TableCell>{{ event.title }}</TableCell>
                      <TableCell>{{ event.description }}</TableCell>
                      <TableCell
                        >{{ event.start_date }} to
                        {{ event.end_date }}</TableCell
                      >
                      <TableCell
                        >{{ event.start_time }} to
                        {{ event.end_time }}</TableCell
                      >
                      <TableCell>{{ event.code }}</TableCell>
                      <TableCell></TableCell>
                      <!-- Placeholder for actions -->
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
                <CardDescription
                  >Showing events that have already occurred.</CardDescription
                >
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Time Range</TableHead>
                      <TableHead>Event Code</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="pastEvents.length == 0">
                      <TableCell colspan="6" class="text-center">No Events Found.</TableCell>
                    </TableRow>
                    <TableRow v-for="event in pastEvents" :key="event.id">
                      <TableCell>{{ event.title }}</TableCell>
                      <TableCell>{{ event.description }}</TableCell>
                      <TableCell
                        >{{ event.start_date }} to
                        {{ event.end_date }}</TableCell
                      >
                      <TableCell
                        >{{ event.start_time }} to
                        {{ event.end_time }}</TableCell
                      >
                      <TableCell>{{ event.code }}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription
                  >Showing events that are yet to occur.</CardDescription
                >
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Time Range</TableHead>
                      <TableHead>Event Code</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="upcomingEvents.length == 0">
                      <TableCell colspan="6" class="text-center">No Events Found.</TableCell>
                    </TableRow>
                    <TableRow v-for="event in upcomingEvents" :key="event.id">
                      <TableCell>{{ event.title }}</TableCell>
                      <TableCell>{{ event.description }}</TableCell>
                      <TableCell
                        >{{ event.start_date }} to
                        {{ event.end_date }}</TableCell
                      >
                      <TableCell
                        >{{ event.start_time }} to
                        {{ event.end_time }}</TableCell
                      >
                      <TableCell>{{ event.code }}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
  <PageFooter />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { PageHeader } from "@/components/custom/page-header";
import { Ellipsis, Plus, Search } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMediaQuery } from "@vueuse/core";
import { PageFooter } from "@/components/custom/page-footer";
import { navigateTo } from "nuxt/app";

const isMobile = useMediaQuery("(max-width: 600px)");
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const events = ref([]);
const selectedSortOption = ref("sortByDate");

const fetchEvents = async () => {
  if (!user.value) return;

  // Step 1: Fetch event IDs from participants table where user is a participant
  const { data: participantUserData, error: participantUserError } =
    await supabase
      .from("participants")
      .select("event_id")
      .eq("user_id", user.value.id);

  if (participantUserError) {
    console.error("Error fetching participant data:", participantUserError);
    return;
  }

  const eventIds = participantUserData.map(
    (participant) => participant.event_id
  );

  // Step 2: Fetch event details from events table using event IDs
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds);

  if (eventError) {
    console.error("Error fetching event data:", eventError);
  } else {
    console.log("Fetched Events Data:", eventData); // Debugging log
    events.value = eventData;
  }
};

onMounted(() => {
  fetchEvents();
});

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const searchQuery = ref(""); 

const sortedAndFilteredEvents = computed(() => {
  let filteredEvents = events.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query))
    );
  }

  return filteredEvents.slice().sort((a, b) => {
    if (selectedSortOption.value === "sortByDate") {
      return new Date(b.start_date) - new Date(a.start_date);
    } else if (selectedSortOption.value === "sortByTitle") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
});

const allEvents = computed(() => sortedAndFilteredEvents.value);
const pastEvents = computed(() =>
  sortedAndFilteredEvents.value.filter(
    (event) => new Date(event.start_date) < currentDate
  )
);
const upcomingEvents = computed(() =>
  sortedAndFilteredEvents.value.filter(
    (event) => new Date(event.start_date) >= currentDate
  )
);
</script>
