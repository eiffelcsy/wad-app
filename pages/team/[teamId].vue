<template>
  <div>
    <PageHeader />
    <div class="bg-zinc-50 dark:bg-black min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <!-- Display Team Name, Code, and Description -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold">{{ team_name }}</h1>
            <p class="text-base text-zinc-400 dark:text-zinc-500 mt-1">
              Team Code: <span class="font-bold">{{ team_code }}</span>
            </p>
            <p v-if="team_description" class="text-base text-zinc-400 dark:text-zinc-500 mt-1">
              {{ team_description }}
            </p>
          </div>
          <!-- Edit Team Button, visible to owners and admins only -->
          <EditTeam />
        </div>

        <!-- Search bar for team members -->
        <div class="relative w-full max-h-10 pr-2 mb-6">
          <Input
            id="searchMembers"
            type="text"
            placeholder="Search Users..."
            class="pl-10 text-base"
            v-model="searchQuery"
          />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>

        <!-- Tabs for Member Roles -->
        <Tabs default-value="all" class="w-full">
          <TabsList class="w-full border-b border-gray-300">
            <TabsTrigger value="all" class="w-full py-2 text-lg font-medium">All</TabsTrigger>
            <TabsTrigger value="owner" class="w-full py-2 text-lg font-medium">Owner</TabsTrigger>
            <TabsTrigger value="admins" class="w-full py-2 text-lg font-medium">Admins</TabsTrigger>
            <TabsTrigger value="members" class="w-full py-2 text-lg font-medium">Members</TabsTrigger>
          </TabsList>

          <!-- All Members Tab -->
          <TabsContent value="all">
            <Card class="mt-6">
              <CardHeader class="px-6 py-4">
                <CardTitle class="text-xl font-semibold">All</CardTitle>
                <CardDescription class="text-gray-500">Showing everyone in the team.</CardDescription>
              </CardHeader>
              <CardContent class="px-6 py-4">
                <Table class="w-full border border-gray-300">
                  <TableHeader>
                    <TableRow class="bg-gray-100">
                      <TableHead class="py-2 px-6">Name</TableHead>
                      <TableHead class="py-2 px-6">Email</TableHead>
                      <TableHead class="py-2 px-6">Role</TableHead>
                      <TableHead class="py-2 px-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="filteredAllMembers.length === 0">
                      <TableCell colspan="4" class="text-center py-4 text-gray-500">No Members Found.</TableCell>
                    </TableRow>
                    <TableRow v-for="member in filteredAllMembers" :key="member.user_id">
                      <TableCell class="py-2 px-6">{{ member.name }}</TableCell>
                      <TableCell class="py-2 px-6">{{ member.email }}</TableCell>
                      <TableCell class="py-2 px-6">{{ capitalizeRole(member.role) }}</TableCell>
                      <TableCell class="py-2 px-6">
                          <EditRole v-if="member.role !== 'owner'" :currentUserId="member.user_id" @roleUpdated="handleRoleUpdated" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Owner Tab -->
          <TabsContent value="owner">
            <Card class="mt-6">
              <CardHeader class="px-6 py-4">
                <CardTitle class="text-xl font-semibold">Owner</CardTitle>
                <CardDescription class="text-gray-500">Showing the team owner.</CardDescription>
              </CardHeader>
              <CardContent class="px-6 py-4">
                <Table class="w-full border border-gray-300">
                  <TableHeader>
                    <TableRow class="bg-gray-100">
                      <TableHead class="py-2 px-6">Name</TableHead>
                      <TableHead class="py-2 px-6">Email</TableHead>
                      <TableHead class="py-2 px-6">Role</TableHead>
                      <TableHead class="py-2 px-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="filteredOwnerMembers.length === 0">
                      <TableCell colspan="4" class="text-center py-4 text-gray-500">No Owner Found.</TableCell>
                    </TableRow>
                    <TableRow v-for="owner in filteredOwnerMembers" :key="owner.user_id">
                      <TableCell class="py-2 px-6">{{ owner.name }}</TableCell>
                      <TableCell class="py-2 px-6">{{ owner.email }}</TableCell>
                      <TableCell class="py-2 px-6">{{ capitalizeRole(owner.role) }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Admins Tab -->
          <TabsContent value="admins">
            <Card class="mt-6">
              <CardHeader class="px-6 py-4">
                <CardTitle class="text-xl font-semibold">Admins</CardTitle>
                <CardDescription class="text-gray-500">Showing all team admins.</CardDescription>
              </CardHeader>
              <CardContent class="px-6 py-4">
                <Table class="w-full border border-gray-300">
                  <TableHeader>
                    <TableRow class="bg-gray-100">
                      <TableHead class="py-2 px-6">Name</TableHead>
                      <TableHead class="py-2 px-6">Email</TableHead>
                      <TableHead class="py-2 px-6">Role</TableHead>
                      <TableHead class="py-2 px-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="filteredAdminMembers.length === 0">
                      <TableCell colspan="4" class="text-center py-4 text-gray-500">No Admins Found.</TableCell>
                    </TableRow>
                    <TableRow v-for="admin in filteredAdminMembers" :key="admin.user_id">
                      <TableCell class="py-2 px-6">{{ admin.name }}</TableCell>
                      <TableCell class="py-2 px-6">{{ admin.email }}</TableCell>
                      <TableCell class="py-2 px-6">{{ capitalizeRole(admin.role) }}</TableCell>
                      <TableCell class="py-2 px-6">
                        <EditRole :currentUserId="admin.user_id" @roleUpdated="handleRoleUpdated" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Members Tab -->
          <TabsContent value="members">
            <Card class="mt-6">
              <CardHeader class="px-6 py-4">
                <CardTitle class="text-xl font-semibold">Members</CardTitle>
                <CardDescription class="text-gray-500">Showing all regular members.</CardDescription>
              </CardHeader>
              <CardContent class="px-6 py-4">
                <Table class="w-full border border-gray-300">
                  <TableHeader>
                    <TableRow class="bg-gray-100">
                      <TableHead class="py-2 px-6">Name</TableHead>
                      <TableHead class="py-2 px-6">Email</TableHead>
                      <TableHead class="py-2 px-6">Role</TableHead>
                      <TableHead class="py-2 px-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-if="filteredMemberMembers.length === 0">
                      <TableCell colspan="4" class="text-center py-4 text-gray-500">No Members Found.</TableCell>
                    </TableRow>
                    <TableRow v-for="member in filteredMemberMembers" :key="member.user_id">
                      <TableCell class="py-2 px-6">{{ member.name }}</TableCell>
                      <TableCell class="py-2 px-6">{{ member.email }}</TableCell>
                      <TableCell class="py-2 px-6">{{ capitalizeRole(member.role) }}</TableCell>
                      <TableCell class="py-2 px-6">
                        <EditRole :currentUserId="member.user_id" @roleUpdated="handleRoleUpdated" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <!-- Display Projects associated with the team -->
        <div class="container w-full pt-8">
          <h2 class="text-2xl font-semibold mb-4">Team Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              v-for="(project, index) in teamProjects"
              :key="index"
              class="mt-6 hover:border-indigo-600 relative"
            >
              <div class="absolute top-2 right-2 flex gap-2">
                <!-- Edit Icon Button -->
                <Button
                  @click="startEditing(project.id, project.title)"
                  class="text-blue-500 hover:text-blue-700"
                  variant="ghost"
                  size="icon"
                >
                  <Edit class="size-5" />
                </Button>

                <!-- Delete Icon Button -->
                <Button
                  @click="deleteProject(project.id)"
                  class="text-red-500 hover:text-red-700"
                  variant="ghost"
                  size="icon"
                >
                  <Trash class="size-5" />
                </Button>
              </div>
              <CardHeader class="gap-2">
                <CardTitle>
                  <div>
                    <h1 class="text-xl hover:underline">{{ project.title }}</h1>
                    <p class="text-base font-light text-zinc-500 mt-1">
                      {{ project.id }}
                    </p>
                  </div>
                </CardTitle>
                <CardDescription>
                  <Badge class="mt-2">{{ project.team_name }}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{{ project.description }}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PageHeader } from "@/components/custom/page-header";
import { PageFooter } from "@/components/custom/page-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash, PencilIcon } from "lucide-vue-next";
import { EditTeam } from "@/components/custom/edit-team";
import { EditRole } from "@/components/custom/edit-role";


const supabase = useSupabaseClient();
const route = useRoute();
const user = useSupabaseUser().value;

const allMembers = ref([]);
const ownerMembers = ref([]);
const adminMembers = ref([]);
const memberMembers = ref([]);
const team_name = ref('');
const team_code = ref('');
const team_description = ref('');
const teamProjects = ref([]);
const searchQuery = ref("");

// Computed property to check if the user can edit the team (if they are 'owner' or 'admin')
const canEditTeam = computed(() => {
  return allMembers.value.some(
    (member) => member.user_id === user.id && (member.role === 'owner' || member.role === 'admin')
  );
});

// Computed property to check if the user is an owner
const isOwner = computed(() => {
  return allMembers.value.some(
    (member) => member.user_id === user.id && member.role === 'owner'
  );
});

// Filtered lists for each tab based on the search query
const filteredAllMembers = computed(() => {
  if (!searchQuery.value) return allMembers.value;
  const query = searchQuery.value.toLowerCase();
  return allMembers.value.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
  );
});

const filteredOwnerMembers = computed(() => {
  if (!searchQuery.value) return ownerMembers.value;
  const query = searchQuery.value.toLowerCase();
  return ownerMembers.value.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
  );
});

const filteredAdminMembers = computed(() => {
  if (!searchQuery.value) return adminMembers.value;
  const query = searchQuery.value.toLowerCase();
  return adminMembers.value.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
  );
});

const filteredMemberMembers = computed(() => {
  if (!searchQuery.value) return memberMembers.value;
  const query = searchQuery.value.toLowerCase();
  return memberMembers.value.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
  );
});

// Function to capitalize the first letter of the role
const capitalizeRole = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const ensureUserInTeam = async (teamId) => {
  if (user) {
    const name = user.user_metadata.name;
    const email = user.email;

    // Check if the user already exists in team_members
    const { data: existingMember, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching team member:", error.message);
      return;
    }

    if (!existingMember) {
      // Insert the user if they are not already in the team_members table
      const { error: insertError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          name: name,
          email: email,
          role: 'member', // Default role; adjust as needed
          added_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Error inserting team member:", insertError.message);
      } else {
        // Re-fetch team members after successfully adding the new user
        await fetchTeamMembers(teamId);
      }
    } else if (!existingMember.name || !existingMember.email) {
      // Update the user’s name and email if they are missing
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ name, email })
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error("Error updating team member:", updateError.message);
      } else {
        // Re-fetch team members after successfully updating the user's info
        await fetchTeamMembers(teamId);
      }
    }
  }
};

// Function to fetch team details based on team code
const fetchTeamDetails = async () => {
  try {
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id, team_name, code, description')
      .eq('code', route.params.teamId)
      .single();

    if (teamError || !teamData) {
      console.error('Error fetching team:', teamError);
      return;
    }

    team_name.value = teamData.team_name;
    team_code.value = teamData.code;
    team_description.value = teamData.description;

    await fetchTeamMembers(teamData.id);
    await fetchTeamProjects(teamData.id);
  } catch (error) {
    console.error('Unexpected error fetching team details:', error);
  }
};

// Function to fetch team members based on team ID
const fetchTeamMembers = async (teamId) => {
  try {
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select('user_id, name, email, role')
      .eq('team_id', teamId);

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return;
    }

     // Ensure the logged-in user's display name and email are saved in the team_members table
     await ensureUserInTeam(teamId);

    allMembers.value = teamMembers;
    ownerMembers.value = teamMembers.filter((member) => member.role === 'owner');
    adminMembers.value = teamMembers.filter((member) => member.role === 'admin');
    memberMembers.value = teamMembers.filter((member) => member.role === 'member');
  } catch (error) {
    console.error('Unexpected error fetching team members:', error);
  }
};

// Function to fetch projects based on team ID
const fetchTeamProjects = async (teamId) => {
  try {
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('team_id', teamId);

    if (projectsError) {
      console.error('Error fetching team projects:', projectsError);
      return;
    }

    teamProjects.value = projectsData;
  } catch (error) {
    console.error('Unexpected error fetching team projects:', error);
  }
};

// Function to delete a project
const deleteProject = async (projectId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      console.error("Error deleting project:", deleteError);
      return;
    }

    teamProjects.value = teamProjects.value.filter((project) => project.id !== projectId);
  } catch (err) {
    console.error("Unexpected error deleting project:", err);
  }
};

// Function to start editing a project
const startEditing = (projectId, currentTitle) => {
  editingProjectId.value = projectId;
  editTitle.value = currentTitle;
};

// Function to handle role updates from the EditRole component
// Function to handle role updates from the EditRole component
function handleRoleUpdated({ userId, newRole }) {
    // Find the member in `allMembers` and update their role
    const member = allMembers.value.find((member) => member.user_id === userId);
    if (member) {
        // Update the role in the `allMembers` array
        member.role = newRole;

        // Update `adminMembers` and `memberMembers` lists
        if (newRole === 'admin') {
            // Move to `adminMembers` if they are not already there
            if (!adminMembers.value.some(m => m.user_id === userId)) {
                adminMembers.value.push(member);
            }
            // Remove from `memberMembers` if they exist there
            memberMembers.value = memberMembers.value.filter(m => m.user_id !== userId);
        } else if (newRole === 'member') {
            // Move to `memberMembers` if they are not already there
            if (!memberMembers.value.some(m => m.user_id === userId)) {
                memberMembers.value.push(member);
            }
            // Remove from `adminMembers` if they exist there
            adminMembers.value = adminMembers.value.filter(m => m.user_id !== userId);
        }
    }
}

// Initial data fetching
onMounted(() => {
  fetchTeamDetails();
});
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}
</style>