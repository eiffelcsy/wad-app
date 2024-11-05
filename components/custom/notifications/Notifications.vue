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
      <PopoverContent class="w-96 mr-[6.5rem] bg-zinc-50 dark:bg-black p-0">
        <Tabs default-value="inbox" class="w-full">
          <TabsList class="w-full rounded-none bg-transparent border-b p-0">
            <TabsTrigger value="inbox" class="w-full"> Inbox </TabsTrigger>
            <TabsTrigger value="archive" class="w-full"> Archive </TabsTrigger>
          </TabsList>
          <!-- Inbox Notifications -->
          <TabsContent value="inbox" class="mt-0">
            <div v-if="inboxNotifications.length > 0">
              <ScrollArea class="w-full h-[30rem] border-b">
                <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                  <li
                    v-for="notification in inboxNotifications"
                    :key="notification.id"
                    class="px-4 py-4 hover:bg-gray-100 dark:hover:bg-zinc-900"
                    @mouseover="markAsRead(notification.id)"
                    @click="() => navigateTo(notification.target_path)"
                  >
                    <div class="flex flex-row justify-between">
                      <div class="w-64">
                        <p
                          class="text-sm text-zinc-900 dark:text-zinc-100 font-medium"
                        >
                          {{ notification.message }}
                        </p>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400">
                          {{ formatDate(notification.created_at) }}
                        </p>
                      </div>
                      <div>
                        <Button
                          size="icon"
                          variant="ghost"
                          class="rounded-full"
                          @click="archiveNotification(notification.id)"
                          ><Archive class="size-4"
                        /></Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </ScrollArea>
              <div class="w-full flex flex-row gap-2 p-2">
                <Button
                  size="sm"
                  variant="outline"
                  class="w-full"
                  @click="markAllAsRead"
                  >Mark all as read</Button
                >
                <Button
                  size="sm"
                  variant="outline"
                  class="w-full"
                  @click="archiveAll"
                  >Archive all</Button
                >
              </div>
            </div>
            <div
              v-else
              class="w-full h-[30rem] my-4 flex items-center justify-center"
            >
              <div class="flex flex-col items-center justify-center gap-2">
                <div
                  class="w-12 h-12 p-2 rounded-full bg-zinc-900 flex items-center justify-center"
                >
                  <Inbox class="w-6 h-6 opacity-50" />
                </div>
                <h1 class="text-zinc-500 text-center">No new notifications</h1>
              </div>
            </div>
          </TabsContent>
          <!-- Archived Notifications -->
          <TabsContent value="archive" class="mt-0">
            <div v-if="archivedNotifications.length > 0">
              <ScrollArea class="w-full h-[32rem]">
                <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                  <li
                    v-for="notification in archivedNotifications"
                    :key="notification.id"
                    class="px-4 py-4 hover:bg-gray-100 dark:hover:bg-zinc-900"
                  >
                    <p
                      class="text-sm text-zinc-900 dark:text-zinc-100 font-medium"
                    >
                      {{ notification.message }}
                    </p>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400">
                      {{ formatDate(notification.created_at) }}
                    </p>
                  </li>
                </ul>
              </ScrollArea>
            </div>
            <div
              v-else
              class="w-full h-[30rem] my-4 flex items-center justify-center"
            >
              <div class="flex flex-col items-center justify-center gap-2">
                <div
                  class="w-12 h-12 p-2 rounded-full bg-zinc-900 flex items-center justify-center"
                >
                  <Archive class="w-6 h-6 opacity-50" />
                </div>
                <h1 class="text-zinc-500 text-center">
                  No notifications in archive
                </h1>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
import { ref, onMounted, computed } from "vue";
import { Archive, BellIcon, Inbox } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { navigateTo } from "nuxt/app";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const notifications = ref([]);
const unreadCount = ref(0);

async function fetchNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching notifications:", error);
  else {
    notifications.value = data || [];
    unreadCount.value = notifications.value.filter((n) => !n.read).length;
  }
}

async function archiveNotification(notificationId) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_archived: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error archiving notification:", error);
    return;
  }

  const notification = notifications.value.find((n) => n.id === notificationId);
  if (notification) {
    notification.is_archived = true;
  }
}

function markAllAsRead() {
  const unreadNotifications = notifications.value.filter((n) => !n.read);
  unreadNotifications.forEach(async (notification) => {
    await markAsRead(notification.id);
  });
}

function archiveAll() {
  const inboxNotifications = notifications.value.filter((n) => !n.is_archived);
  inboxNotifications.forEach(async (notification) => {
    await archiveNotification(notification.id);
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

// Computed properties for inbox and archived notifications
const inboxNotifications = computed(() =>
  notifications.value.filter((n) => !n.is_archived)
);
const archivedNotifications = computed(() =>
  notifications.value.filter((n) => n.is_archived)
);

onMounted(() => {
  fetchNotifications();
  supabase
    .channel("notifications-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.value.id}`,
      },
      (payload) => {
        notifications.value.unshift(payload.new);
        unreadCount.value += 1;
      }
    )
    .subscribe();
});
</script>

<style scoped></style>
