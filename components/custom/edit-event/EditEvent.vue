<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" v-if="!isMobile"> Edit Event </Button>
      <Button variant="outline" size="icon" v-if="isMobile">
        <Pencil class="size-5"></Pencil>
      </Button>
    </DialogTrigger>
    <DialogContent class="dialog-content w-full max-w-[600px] overflow-hidden">
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>Edit Event</DialogTitle>
        <DialogDescription>
          Make changes to your event here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <!--Scroll container-->
      <div
        class="scroll-container overflow-y-auto overflow-x-hidden max-h-[75vh] px-6 w-full"
      >
        <div class="content-wrapper grid gap-4 py-4 w-full">
          <div class="flex flex-col justify-between w-full">
            <div
              class="fixed-width-content flex flex-col w-full mt-4 gap-4 box-border"
            >
              <Card class="w-full">
                <CardContent class="pt-4">
                  <div>
                    <h1
                      class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
                    >
                      Title
                    </h1>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter Title"
                      v-model="title"
                      class="w-full h-12 text-sm sm:text-base p-2 sm:p-3"
                    />
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
                  </div>
                </CardContent>
              </Card>
              <Card class="w-full">
                <CardContent class="pt-4">
                  <div>
                    <h1
                      class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:mb-4"
                    >
                      Select Date Range
                    </h1>
                    <div
                      class="mt-2 flex justify-center items-center w-full box-border"
                    >
                      <RangeCalendar
                        v-model="dateRange"
                        class="rounded-md border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div
            class="fixed-width-content flex flex-col w-full mt-4 gap-4 box-border"
          >
            <Card class="w-full">
              <CardContent class="w-full box-border">
                <div>
                  <h1
                    class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
                  >
                    Select Time Range
                  </h1>
                  <div
                    class="mt-4 lg:mt-8 flex flex-col md:flex-row justify-center gap-4 xl:gap-8"
                  >
                    <div>
                      <label
                        class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >Start Time</label
                      >
                      <div class="flex flex-row gap-2">
                        <Select v-model="startTime">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <template v-for="hour in 12" :key="hour">
                                <SelectItem
                                  :value="`${hour
                                    .toString()
                                    .padStart(2, '0')}:00`"
                                >
                                  {{ `${hour.toString().padStart(2, "0")}:00` }}
                                </SelectItem>
                                <SelectItem
                                  :value="`${hour
                                    .toString()
                                    .padStart(2, '0')}:30`"
                                >
                                  {{ `${hour.toString().padStart(2, "0")}:30` }}
                                </SelectItem>
                              </template>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Select v-model="startTimeMeridiem">
                          <SelectTrigger>
                            <SelectValue placeholder="AM or PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="AM"> AM </SelectItem>
                              <SelectItem value="PM"> PM </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <!-- <div
                                    v-if="errors.startTime"
                                    class="error absolute text-xs mt-1"
                                >
                                    {{ errors.startTime }}
                                </div> -->
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >End Time</label
                      >
                      <div class="flex flex-row gap-2">
                        <Select v-model="endTime">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <template v-for="hour in 12" :key="hour">
                                <SelectItem
                                  :value="`${hour
                                    .toString()
                                    .padStart(2, '0')}:00`"
                                >
                                  {{ `${hour.toString().padStart(2, "0")}:00` }}
                                </SelectItem>
                                <SelectItem
                                  :value="`${hour
                                    .toString()
                                    .padStart(2, '0')}:30`"
                                >
                                  {{ `${hour.toString().padStart(2, "0")}:30` }}
                                </SelectItem>
                              </template>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Select v-model="endTimeMeridiem">
                          <SelectTrigger>
                            <SelectValue placeholder="AM or PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="AM"> AM </SelectItem>
                              <SelectItem value="PM"> PM </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <!-- <div
                                    v-if="errors.endTime"
                                    class="error absolute text-xs mt-1"
                                >
                                    {{ errors.endTime }}
                                </div> -->
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card class="w-full">
              <CardContent class="w-full box-border">
                <div>
                  <h1
                    class="text-lg md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2"
                  >
                    Number of Participants
                  </h1>
                  <div class="mt-4 lg:mt-6">
                    <NumberField
                      id="numParticipants"
                      :default-value="1"
                      :min="1"
                      v-model="numberOfParticipants"
                    >
                      <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldContent>
                    </NumberField>
                    <!-- <div
                                v-if="errors.numberOfParticipants"
                                class="error text-xs mt-1"
                                >
                                {{ errors.numberOfParticipants }}
                                </div> -->
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <!-- test p 2 -->
      <DialogFooter class="p-6 pt-0 box-border">
        <DialogClose> Cancel </DialogClose>
        <Button type="submit" @click="updateEvent"> Save changes </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <Toaster />
</template>

<script setup>
import dayjs from "dayjs";
import { parseDate } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMediaQuery } from "@vueuse/core";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-vue-next";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";

dayjs.extend(customParseFormat);

// Setup reactive variables
const supabase = useSupabaseClient();
const user = useSupabaseUser().value;
const router = useRouter();
const isMobile = useMediaQuery("(max-width: 1000px)");
const title = ref("");
const description = ref("");
const dateRange = ref({ start: null, end: null });
const startTime = ref("");
const startTimeMeridiem = ref("");
const endTime = ref("");
const endTimeMeridiem = ref("");
const numberOfParticipants = ref(1);
const currentCode = useRoute().params.eventId; // Use directly from route
const { toast } = useToast();

// Fetch event details
onMounted(async () => {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return;
  }
  // Fetch current event details from the database
  const { data: findEvent, error: findEventError } = await supabase
    .from("events")
    .select("*")
    .eq("code", currentCode)
    .single();

  if (findEventError) {
    console.error("Error fetching event details:", findEventError.message);
    toast({
      title: "There was an error fetching the event details.",
      variant: "destructive",
    });
  } else {
    title.value = findEvent.title;
    description.value = findEvent.description;
    startTime.value = convertTo12HourFormat(findEvent.start_time)[0];
    startTimeMeridiem.value = convertTo12HourFormat(findEvent.start_time)[1];
    endTime.value = convertTo12HourFormat(findEvent.end_time)[0];
    endTimeMeridiem.value = convertTo12HourFormat(findEvent.end_time)[1];
    dateRange.value.start = parseDate(findEvent.start_date);
    dateRange.value.end = parseDate(findEvent.end_date);
    numberOfParticipants.value = findEvent.number_of_participants;
  }
});

const convertTo12HourFormat = (time24) => {
  let [hours, minutes] = time24.split(":").map(Number);
  let meridiem = "AM";

  if (hours >= 12) {
    meridiem = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12;
  }

  const time12Hour = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
  return [time12Hour, meridiem];
};

// Update event details
async function updateEvent() {
  let updates;
  try {
    // Combine time and meridiem for parsing
    const startTimeString = `${startTime.value
      .toString()
      .trim()} ${startTimeMeridiem.value.toString().trim()}`;
    const endTimeString = `${endTime.value
      .toString()
      .trim()} ${endTimeMeridiem.value.toString().trim()}`;

    // Parse and format the time in 24-hour format
    const adjustedStartTime = dayjs(startTimeString, "hh:mm A").format("HH:mm");
    const adjustedEndTime = dayjs(endTimeString, "hh:mm A").format("HH:mm");

    updates = {
      title: title.value,
      description: description.value,
      creator_user_id: user ? user.id : null,
      start_date: dayjs(dateRange.value.start).format("YYYY-MM-DD"),
      end_date: dayjs(dateRange.value.end).format("YYYY-MM-DD"),
      start_time: adjustedStartTime,
      end_time: adjustedEndTime,
      number_of_participants: numberOfParticipants.value,
      code: currentCode,
    };
    // Update the event in the database
    const { error } = await supabase
      .from("events")
      .update(updates)
      .eq("code", currentCode);
    if (error) throw error;
    // Optionally show a success message
    console.log(updates);
    toast({
      title: "Event updated successfully!",
      variant: "success",
    });
    // After successful update, use router.push to navigate back to the event page
    await router.push(`/event/${currentCode}`);

    // Optionally, reload the page with a full refresh
    window.location.reload();
  } catch (error) {
    console.log(updates);
    console.error("Error updating event:", error.message);
    toast({
      title: "There was an error updating the event.",
      variant: "destructive",
    });
  }
  console.log(updates);
}
</script>

<style scoped>
/* Dialog content styling with max width fixed */
.dialog-content {
  width: 100%;
  max-width: 600px;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Content wrapper within dialog */
.content-wrapper {
  width: 100%;
  max-width: 100%;
}

/* Prevent horizontal scrolling on container */
.scroll-container {
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Fixed width for elements to ensure no scaling */
.fixed-width-content {
  max-width: 600px;
  width: 100%;
  flex-direction: column;
  flex-wrap: nowrap;
  box-sizing: border-box;
}

/* Apply box-sizing universally */
*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
