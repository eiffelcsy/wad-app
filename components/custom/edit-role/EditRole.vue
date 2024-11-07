<template>
    <div v-if="canEditRole"> <!-- Conditionally render the edit role dialog if the user has permission -->
        <Dialog>
            <DialogTrigger as-child>
                <Button variant="outline" size="icon">
                    <PencilIcon class="size-5"></PencilIcon>
                </Button>
            </DialogTrigger>
            <DialogContent class="dialog-content w-full max-w-[400px] overflow-hidden">
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
                            <div class="fixed-width-content flex flex-col w-full mt-4 gap-4 box-border">
                                <!-- Role selection dropdown -->
                                <div>
                                    <label class="text-base md:text-xl text-zinc-800 dark:text-zinc-100 font-semibold my-2">User Role</label>
                                    <Select v-model="selectedRole" class="w-full h-12 text-sm sm:text-base p-2 sm:p-3">
                                        <option value="admin">Admin</option>
                                        <option value="member">Member</option>
                                    </Select>
                                </div>
                                <!-- Delete button -->
                                <Button variant="destructive" @click="deleteUser">Delete User</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter class="p-6 pt-0 box-border">
                    <DialogClose>Cancel</DialogClose>
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
} from '@/components/ui/dialog';
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Select } from "@/components/ui/select"; // Make sure to import a Select component if you have it
import { PencilIcon } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";

// Supabase client setup
const supabase = useSupabaseClient();
const user = useSupabaseUser().value;
const router = useRouter();
const route = useRoute();
const isMobile = useMediaQuery("(max-width: 1000px)");

// Reactive variables for role details and permissions
const userRole = ref(null); // Store the owner’s role
const selectedRole = ref(''); // The role of the user being edited
const currentUserId = route.params.userId; // The ID of the user whose role is being edited
const currentTeamId = route.params.teamId; // The team ID for which the role is being edited

// Computed property to check if the user can edit roles
const canEditRole = computed(() => userRole.value === "owner");

// Fetch the owner’s role and the selected user's role on component mount
onMounted(async () => {
    if (!supabase || !user || !currentTeamId) {
        console.error("Supabase client, user, or currentTeamId not initialized");
        return;
    }

    // Fetch the owner’s role in the team
    const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .eq("code", currentTeamId)
        .single();

    if (teamError) {
        console.error("Error fetching team ID:", teamError.message);
        return;
    }

    const teamId = teamData.id;

    const { data: memberData, error: roleError } = await supabase
        .from("team_members")
        .select("role")
        .eq("user_id", user.id)
        .eq("team_id", teamId)
        .single();

    if (roleError) {
        console.error("Error fetching owner’s role:", roleError.message);
        return;
    }
    userRole.value = memberData.role;

    // If the owner can edit, fetch the selected user's role
    if (canEditRole.value) {
        const { data: userData, error: userRoleError } = await supabase
            .from("team_members")
            .select("role")
            .eq("user_id", currentUserId)
            .eq("team_id", teamId)
            .single();

        if (userRoleError) {
            console.error("Error fetching user role:", userRoleError.message);
        } else {
            selectedRole.value = userData.role;
        }
    }
});

// Function to update the user’s role in the team
async function updateRole() {
    try {
        const { error } = await supabase
            .from("team_members")
            .update({ role: selectedRole.value })
            .eq("user_id", currentUserId)
            .eq("team_id", teamId);

        if (error) throw error;
        alert("User role updated successfully!");
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
            .eq("user_id", currentUserId)
            .eq("team_id", teamId);

        if (error) throw error;
        alert("User removed from team successfully!");
        await router.push(`/team/${currentTeamId}`);
        window.location.reload();
    } catch (error) {
        console.error("Error deleting user:", error.message);
        alert("There was an error deleting the user from the team.");
    }
}
</script>
