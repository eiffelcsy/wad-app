<template>
  <div v-if="canEditRole">
    <Dialog v-if="userRole.value !== 'owner'">
      <DialogTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="pencil-button"
          @click="openDialog"
        >
          <PencilIcon class="pencil-icon size-5"></PencilIcon>
        </Button>
      </DialogTrigger>
      <DialogContent
        v-if="isDialogOpen"
        class="dialog-content w-full max-w-[400px] overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Change the user's role or remove them from the team.
          </DialogDescription>
        </DialogHeader>
        <Select
          v-model="selectedRole"
          class="w-full text-sm sm:text-base p-2 sm:p-3 border border-gray-300 rounded"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            variant="destructive"
            class="delete-user-button"
            @click="confirmDeleteUser"
            >Delete User</Button
          >
          <DialogClose>Cancel</DialogClose>
          <Button type="submit" @click="updateRole">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Toaster />
  </div>
</template>

<style scoped></style>

<script setup>
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ref, onMounted, computed, defineEmits } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PencilIcon } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster } from "@/components/ui/toast";

// Accepting currentUserId as a prop
const props = defineProps({
  currentUserId: {
    type: String,
    required: true,
  },
});

// Define the emit function for emitting events
const emit = defineEmits(["roleUpdated"]);

const supabase = useSupabaseClient();
const user = useSupabaseUser().value;
const router = useRouter();
const route = useRoute();

const userRole = ref(null); // Store the owner’s role
const selectedRole = ref("");
const teamCode = route.params.teamId; // This represents the `code` from `teams` table
const currentTeamId = ref(null); // Store the `id` associated with the `code`

const canEditRole = computed(() => userRole.value === "owner");
const { toast } = useToast();

// Control dialog visibility
const isDialogOpen = ref(false);

// Open the dialog
function openDialog() {
  isDialogOpen.value = true;
}

// Close the dialog
function closeDialog() {
  isDialogOpen.value = false;
}

onMounted(async () => {
  if (!supabase || !user || !teamCode) {
    console.error("Supabase client, user, or teamCode not initialized");
    return;
  }

  try {
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("code", teamCode)
      .single();

    if (teamError) throw teamError;

    currentTeamId.value = teamData.id;

    const { data: memberData, error: roleError } = await supabase
      .from("team_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("team_id", currentTeamId.value)
      .single();

    if (roleError) throw roleError;
    userRole.value = memberData.role;

    if (canEditRole.value) {
      const { data: userData, error: userRoleError } = await supabase
        .from("team_members")
        .select("role")
        .eq("user_id", props.currentUserId)
        .eq("team_id", currentTeamId.value)
        .single();

      if (userRoleError) throw userRoleError;
      selectedRole.value = userData.role;
    }
  } catch (error) {
    console.error("Error fetching team data or user role:", error.message);
  }
});

// Function to update the user’s role in the team
async function updateRole() {
  try {
    const { error } = await supabase
      .from("team_members")
      .update({ role: selectedRole.value })
      .eq("user_id", props.currentUserId)
      .eq("team_id", currentTeamId.value);

    if (error) throw error;

    // Emit the `roleUpdated` event with the updated role details
    emit("roleUpdated", {
      userId: props.currentUserId,
      newRole: selectedRole.value,
    });

    // Close the dialog after saving changes
    closeDialog();
  } catch (error) {
    console.error("Error updating user role:", error.message);
    toast({
      title: "There was an error updating the user role.",
      variant: "destructive",
    });
  }
}

// Function to confirm and delete the user from the team
async function confirmDeleteUser() {
  const confirmed = confirm(
    "Are you sure you want to delete this user from the team? This action cannot be undone."
  );

  if (!confirmed) return; // Exit if the user cancels

  try {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("user_id", props.currentUserId)
      .eq("team_id", currentTeamId.value);

    if (error) throw error;
    toast({
      title: "User removed from team successfully!",
      variant: "success",
    });
    await router.push(`/team/${teamCode}`);
    window.location.reload();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    toast({
      title: "There was an error deleting the user from the team.",
      variant: "destructive",
    });
  }
}
</script>
