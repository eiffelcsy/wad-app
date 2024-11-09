<template>
    <div v-if="canEditRole">
        <!-- Conditionally render the edit role dialog if the user has permission and is not the owner -->
        <Dialog v-if="userRole.value !== 'owner'">
            <DialogTrigger as-child>
                <Button variant="outline" size="icon" class="pencil-button" @click="openDialog">
                    <PencilIcon class="pencil-icon size-5"></PencilIcon>
                </Button>
            </DialogTrigger>
            <DialogContent v-if="isDialogOpen" class="dialog-content w-full max-w-[400px] overflow-hidden">
                <DialogHeader class="p-6 pb-0">
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Change the user's role or remove them from the team.
                    </DialogDescription>
                </DialogHeader>
                <!-- Content for editing role -->
                <div class="scroll-container overflow-y-auto overflow-x-hidden max-h-[50vh] px-6 w-full">
                    <div class="content-wrapper grid gap-4 py-4 w-full">
                        <div class="flex flex-col justify-between w-full">
                            <div class="fixed-width-content flex items-center w-full mt-4 gap-4 box-border">
                                <!-- Role selection dropdown -->
                                <div class="flex-1">
                                    <label class="text-base md:text-xl text-zinc-800 dark:text-zinc-100 font-semibold my-2">User Role</label>
                                    <select v-model="selectedRole" class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 border border-gray-300 rounded">
                                        <option value="admin">Admin</option>
                                        <option value="member">Member</option>
                                    </select>
                                </div>
                                <!-- Smaller Delete button to the right of the dropdown -->
                                <Button variant="destructive" class="delete-user-button ml-4" @click="deleteUser">Delete User</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter class="p-6 pt-0 box-border">
                    <DialogClose @click="closeDialog">Cancel</DialogClose>
                    <Button type="submit" @click="updateRole">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<style scoped>
/* Dialog content styling */
.dialog-content {
    width: 100%;
    max-width: 400px;
    overflow-x: hidden;
    box-sizing: border-box;
}

.content-wrapper {
    width: 100%;
    max-width: 100%;
}

.scroll-container {
    width: 100%;
    max-width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
}

.fixed-width-content {
    max-width: 400px;
    width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    box-sizing: border-box;
}

/* Style for Delete User button */
.delete-user-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem; /* Smaller font */
    min-width: auto; /* Make the button narrower */
}

/* Pencil button and icon styling */
.pencil-button {
    background: none; /* Ensure button has no background */
    border: none; /* Remove any border */
    padding: 0;
}

.pencil-icon {
    background: transparent; /* Transparent background */
    padding: 0; /* Remove padding for a cleaner look */
}

/* General box sizing */
*,
*::before,
*::after {
    box-sizing: border-box;
}
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

        alert("User role updated successfully!");

        // Emit the `roleUpdated` event with the updated role details
        emit("roleUpdated", { userId: props.currentUserId, newRole: selectedRole.value });

        // Close the dialog after saving changes
        closeDialog();
    } catch (error) {
        console.error("Error updating user role:", error.message);
        alert("There was an error updating the user role.");
    }
}

// Function to delete the user from the team
async function deleteUser() {
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
