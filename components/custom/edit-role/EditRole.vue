<template>
    <div v-if="canEditRole">
        <Dialog v-if="userRole.value !== 'owner'">
            <DialogTrigger as-child>
                <Button variant="ghost" size="icon" class="pencil-button" @click="openDialog">
                    <PencilIcon class="pencil-icon size-5"></PencilIcon>
                </Button>
            </DialogTrigger>
            <DialogContent v-if="isDialogOpen" class="dialog-content w-full max-w-[400px] overflow-hidden">
                <DialogHeader class="p-6 pb-2">
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Change the user's role or remove them from the team.
                    </DialogDescription>
                </DialogHeader>

                <!-- User Role section wrapped in flex container with spacer -->
                <div class="user-role-wrapper px-6 pt-2 flex flex-col" style="margin-top: -8px;">
                    <div class="user-role-section">
                        <label class="text-base md:text-xl text-zinc-800 dark:text-zinc-100 font-semibold my-2">User Role</label>
                        <select v-model="selectedRole" class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 border border-gray-300 rounded">
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                        </select>
                    </div>
                    <!-- Spacer div to maintain space between dropdown and buttons -->
                    <div class="spacer" style="height: 16px;"></div>
                </div>

                <!-- Dialog Footer with Buttons -->
                <DialogFooter class="p-6 pt-4 box-border flex justify-end gap-2">
                    <Button variant="destructive" class="delete-user-button" @click="confirmDeleteUser">Delete User</Button>
                    <DialogClose>Cancel</DialogClose>
                    <Button type="submit" @click="updateRole">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<style scoped>
</style>

<script setup>
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { ref, onMounted, computed, defineEmits } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PencilIcon } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";

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
const isMobile = useMediaQuery("(max-width: 1000px)");

const userRole = ref(null); // Store the owner’s role
const selectedRole = ref(''); // The role of the user being edited
const teamCode = route.params.teamId; // This represents the `code` from `teams` table
const currentTeamId = ref(null); // Store the `id` associated with the `code`

const canEditRole = computed(() => userRole.value === "owner");

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
        emit("roleUpdated", { userId: props.currentUserId, newRole: selectedRole.value });

        // Close the dialog after saving changes
        closeDialog();
    } catch (error) {
        console.error("Error updating user role:", error.message);
        alert("There was an error updating the user role.");
    }
}

// Function to confirm and delete the user from the team
async function confirmDeleteUser() {
    const confirmed = confirm("Are you sure you want to delete this user from the team? This action cannot be undone.");

    if (!confirmed) return; // Exit if the user cancels

    try {
        const { error } = await supabase
            .from("team_members")
            .delete()
            .eq("user_id", props.currentUserId)
            .eq("team_id", currentTeamId.value);

        if (error) throw error;
        alert("User removed from team successfully!");
        await router.push(`/team/${teamCode}`);
        window.location.reload();
    } catch (error) {
        console.error("Error deleting user:", error.message);
        alert("There was an error deleting the user from the team.");
    }
}
</script>
