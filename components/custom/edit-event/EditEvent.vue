<template>
<div>
    <Dialog>
        <DialogTrigger as-child>
            <Button variant="outline" v-if="!isMobile">
                Edit Event
            </Button>
            <Button variant="outline" size="icon" v-if="isMobile">
                <List class="size-5"></list>
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
            <DialogHeader class="p-6 pb-0">
                <DialogTitle>Edit Event</DialogTitle>
                <DialogDescription>
                    Make changes to your event here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4 overflow-y-auto px-6">
                <div class="flex flex-col justify-between">
                    <div class="w-full flex flex-col mt-4 md:flex-row md:justify-center gap-4 md:gap-6 lg:gap-8">
                        <Card class="w-full">
                            <CardContent class="pt-4">
                                <div>
                                <h1
                                    class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
                                > Title </h1>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Enter Title"
                                    
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
                                        
                                        class="w-full h-12 lg:h-40 text-sm sm:text-base p-2 sm:p-3 mt-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent class="pt-4">
                                <div>
                                    <h1 class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:mb-4"
                                    > Select Date Range</h1>
                                    <div class="mt-2 flex justify-center items-center">
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
            </div>
            <DialogFooter class="p-6 pt-0">
                <Button type="submit" @click="updateEvent">
                    Save changes
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</div>
</template>

<script setup>
//Dialog import
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// idk js import first
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "nuxt/app";
import { useMediaQuery } from "@vueuse/core";
import debounce from "lodash.debounce";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { List, Trash2 } from "lucide-vue-next";

// toast alert
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster } from "@/components/ui/toast";


const isMobile = useMediaQuery("(max-width: 1000px)");
const supabase = useSupabaseClient();

// Get the event ID from the route


//Get the current user from Supabase
const user = useSupabaseUser().value;

// Update event details
async function updateEvent() {
  try {
    const user = useSupabaseUser();

    const updates = {
        title: title.value,
        description: description.value,
        creator_user_id: user.id,
        start_date: dayjs(dateRange.value.start).format("YYYY-MM-DD"),
        end_date: dayjs(dateRange.value.end).format("YYYY-MM-DD"),
        start_time: adjustedStartTime,
        end_time: adjustedEndTime,
        number_of_participants: numberOfParticipants.value,
        code: eventCode.value,
    }

    const { error } = await supabase.from('events').upsert([updates])

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } 
}
</script>