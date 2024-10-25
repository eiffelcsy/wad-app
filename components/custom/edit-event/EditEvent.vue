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
                <div class="flex flex-col justify-between h-[300dvh]">
                    <p>
                        This is some placeholder content to show the scrolling behavior for modals. We use repeated line breaks to demonstrate how content can exceed minimum inner height, thereby showing inner scrolling. When content becomes longer than the predefined max-height of modal, content will be cropped and scrollable within the modal.
                    </p>
                    <p>This content should appear at the bottom after you scroll.</p>
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