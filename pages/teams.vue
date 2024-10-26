<template>
  <div>
    <PageHeader />
    <div class="bg-zinc-50 dark:bg-black">
      <div class="container w-full pt-8 md:pt-10 lg:pt-14">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold">Your Teams</h1>
      </div>
      <div class="container w-full flex flex-row justify-between pt-8">
        <div class="relative w-full max-h-10 pr-2 items-center">
          <Input
            id="searchTeams"
            type="text"
            placeholder="Search Teams..."
            class="pl-10 text-base md:text-sm"
          />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>
        <Button
          @click="navigateTo('/create-team')"
          class="text-zinc-100 dark:text-zinc-900"
        >
          New Team<Plus class="size-4 ml-2" />
        </Button>
      </div>
      <div class="min-h-screen">
        <div class="container w-full grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-3 justify-center">
          <Card
            v-for="(team, index) in teams"
            :key="index"
            class="mt-6 hover:border-zinc-700"
          >
            <NuxtLink
              :to="{
                name: 'team-teamId',
                params: { teamId: team.id },
              }"
            >
              <CardHeader class="gap-2">
                <CardTitle>
                  <div>
                    <h1 class="text-xl hover:underline">{{ team.team_name }}</h1>
                    <p class="text-base font-light text-zinc-500 mt-1">
                      {{ team.id }}
                    </p>
                  </div>
                </CardTitle>
                <CardDescription>
                  <p>{{ team.description }}</p>
                </CardDescription>
              </CardHeader>
            </NuxtLink>
            <CardContent>
              <div v-if="team.role === 'owner'" class="flex justify-between mt-4">
                <Button @click="manageTeam(team.id)" class="mr-2">Manage Team</Button>
                <Button @click="deleteTeam(team.id)" variant="destructive">Delete Team</Button>
              </div>
              <div v-else class="flex justify-center mt-4">
                <Button @click="leaveTeam(team.id)" variant="outline">Leave Team</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { PageHeader } from "@/components/custom/page-header";
import { Ellipsis, Plus, Search } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMediaQuery } from "@vueuse/core";
import { PageFooter } from "@/components/custom/page-footer";
import { navigateTo } from "nuxt/app";

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const teams = ref([]);

const fetchTeams = async () => {
  const { data: associatedTeams, error: associatedError } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("user_id", user.value.id);

  if (associatedError) {
    console.error("Error fetching team memberships: ", associatedError);
    return;
  }

  const teamIds = associatedTeams?.map((team) => team.team_id);
  const { data: teamDetails, error: teamDetailsError } = await supabase
    .from("teams")
    .select("*")
    .in("id", teamIds || []);

  if (teamDetailsError) {
    console.error("Error fetching team details:", teamDetailsError);
    return;
  }

  teams.value = teamDetails.map((team) => {
    const membership = associatedTeams.find((member) => member.team_id === team.id);
    return {
      ...team,
      role: membership ? membership.role : "member",
    };
  });
};

const manageTeam = (teamId) => {
  navigateTo(`/team/${teamId}/manage`);
};

const deleteTeam = async (teamId) => {
  if (confirm("Are you sure you want to delete this team?")) {
    const { error } = await supabase.from("teams").delete().eq("id", teamId);

    if (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete the team. Please try again.");
      return;
    }

    // Remove the team from local data
    teams.value = teams.value.filter((team) => team.id !== teamId);
    alert("Team deleted successfully.");
  }
};

const leaveTeam = async (teamId) => {
  if (confirm("Are you sure you want to leave this team?")) {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", user.value.id);

    if (error) {
      console.error("Error leaving team:", error);
      alert("Failed to leave the team. Please try again.");
      return;
    }

    // Remove the team from local data
    teams.value = teams.value.filter((team) => team.id !== teamId);
    alert("You have left the team.");
  }
};

onMounted(() => {
  fetchTeams();
});
</script>

<style></style>
