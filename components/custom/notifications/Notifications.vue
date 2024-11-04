<template>
  <div class="relative block">
    <!-- Bell Button -->
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-transparent"
          @click="toggleDropdown"
        >
          <Avatar class="w-8 h-8 border bg-zinc-50 dark:bg-zinc-900">
            <BellIcon
              :size="18"
              :strokeWidth="2"
              class="opacity-60 hover:opacity-100"
            />
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-96 mr-[6.5rem] bg-black">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li
            v-for="notification in notifications"
            :key="notification.id"
            class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="markAsRead(notification.id)"
          >
            <p class="text-sm text-gray-900 dark:text-gray-100">
              {{ notification.message }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(notification.created_at) }}
            </p>
          </li>
        </ul>
        <div
          v-if="notifications.length === 0"
          class="p-4 text-center text-gray-500 dark:text-gray-400"
        >
          No new notifications
        </div>
      </PopoverContent>
    </Popover>
    <!-- Notification Indicator -->
    <span
      v-if="unreadCount > 0"
      class="absolute right-0.5 top-0.5 flex h-2.5 w-2.5"
    >
      <span
        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"
      ></span>
      <span
        class="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500"
      ></span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { BellIcon } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const notifications = ref([]);
const unreadCount = ref(0);
const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) markAllAsRead();
}

async function fetchNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching notifications:", error);
  else {
    notifications.value = data || [];
    unreadCount.value =
      data?.filter((notification) => !notification.read).length || 0;
  }
}

function markAllAsRead() {
  const unreadNotifications = notifications.value.filter((n) => !n.read);
  unreadNotifications.forEach(async (notification) => {
    await markAsRead(notification.id);
  });
}

async function markAsRead(notificationId) {
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  const notification = notifications.value.find((n) => n.id === notificationId);
  if (notification) notification.read = true;
  unreadCount.value = notifications.value.filter((n) => !n.read).length;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

onMounted(() => {
  fetchNotifications();
  supabase
    .channel("notifications-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        notifications.value.unshift(payload.new);
        unreadCount.value += 1;
      }
    )
    .subscribe();
});
</script>

<style scoped></style>
