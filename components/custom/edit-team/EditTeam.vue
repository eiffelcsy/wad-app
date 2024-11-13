<template>
    <div v-if="canEditTeam"> <!-- Conditionally render the edit team dialog if the user has permission -->
        <Dialog>
            <DialogTrigger as-child>
                <Button variant="outline" v-if="!isMobile">Edit Team</Button>
                <Button variant="outline" size="icon" v-if="isMobile">
                    <Pencil class="size-5"></Pencil>
                </Button>
            </DialogTrigger>
            <DialogContent class="dialog-content w-full max-w-[600px] overflow-hidden">
                <DialogHeader class="p-6 pb-0">
                    <DialogTitle>Edit Team</DialogTitle>
                    <DialogDescription>
                        Make changes to your team here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <!-- Scroll container -->
                <div class="scroll-container overflow-y-auto overflow-x-hidden max-h-[75vh] px-6 w-full">
                    <div class="content-wrapper grid gap-4 py-4 w-full">
                        <div class="flex flex-col justify-between w-full">
                            <div class="fixed-width-content flex flex-col w-full mt-4 gap-4 box-border">
                                <Card class="w-full">
                                    <CardContent class="pt-4">
                                        <div>
                                            <h1
                                                class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4">
                                                Team Name</h1>
                                            <Input id="teamName" type="text" placeholder="Enter Team Name"
                                                v-model="teamName"
                                                class="w-full h-12 text-sm sm:text-base p-2 sm:p-3" />
                                        </div>
                                        <div class="pt-4">
                                            <h1
                                                class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4">
                                                Description</h1>
                                            <Textarea id="description" type="text" placeholder="Enter Description"
                                                v-model="description"
                                                class="w-full h-12 lg:h-40 text-sm sm:text-base p-2 sm:p-3 mt-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter class="p-6 pt-0 box-border">
                    <DialogClose>Cancel</DialogClose>
                    <Button type="submit" @click="updateTeam">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<style scoped>
/* Same styling as the EditEvent component */
.dialog-content {
    width: 100%;
    max-width: 600px;
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
    max-width: 600px;
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
// Dialog imports and necessary components
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";

// Supabase client setup
const supabase = useSupabaseClient();
const user = useSupabaseUser().value;
const router = useRouter();
const route = useRoute();
const isMobile = useMediaQuery("(max-width: 1000px)");

// Reactive variables for team details and permissions
const teamName = ref('');
const description = ref('');
const userRole = ref(null); // Store the user role fetched from Supabase
const currentTeamId = route.params.teamId; // Get the team ID from the route

// Computed property to check if the user can edit the team
const canEditTeam = computed(() => userRole.value === "owner" || userRole.value === "admin");

// Fetch team details and user role on component mount
onMounted(async () => {
    if (!supabase || !user || !currentTeamId) {
        console.error("Supabase client, user, or currentTeamId not initialized");
        return;
    }

    // Fetch the user's role from the `team_members` table
    // Fetch team ID from the `teams` table using the code (currentTeamId)
    const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .eq("code", currentTeamId)
        .single();

    if (teamError) {
        console.error("Error fetching team ID:", teamError.message);
    } else {
        const teamId = teamData.id; // Get the actual team ID from the teams table

        // Now, use teamId to fetch the user's role from the `team_members` table
        const { data: memberData, error: roleError } = await supabase
            .from("team_members")
            .select("role")
            .eq("user_id", user.id)
            .eq("team_id", teamId) // Use the actual team ID here
            .single();

        if (roleError) {
            console.error("Error fetching user role:", roleError.message);
        } else {
            userRole.value = memberData.role;
        }
    }


    // Fetch current team details from the database if user has permission
    if (canEditTeam.value) {
        const { data: team, error: teamError } = await supabase
            .from("teams")
            .select("team_name, description")
            .eq("code", currentTeamId)
            .single();

        if (teamError) {
            console.error("Error fetching team details:", teamError.message);
            alert("There was an error fetching the team details.");
        } else {
            teamName.value = team.team_name;
            description.value = team.description;
        }
    }
});

// Update team details
async function updateTeam() {
    try {
        // Update team details in the database
        const { error } = await supabase
            .from('teams')
            .update({
                team_name: teamName.value,
                description: description.value,
            })
            .eq('code', currentTeamId);

        if (error) throw error;

        // Success message and redirect
        alert("Team updated successfully!");
        await router.push(`/team/${currentTeamId}`);
        window.location.reload();
    } catch (error) {
        console.error("Error updating team:", error.message);
        alert("There was an error updating the team.");
    }
}
</script>
