<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold mb-6">Your Team</h1>
    <Tabs default-value="all" class="w-full">
      <TabsList class="w-full border-b border-gray-300">
        <TabsTrigger value="all" class="w-full py-2 text-lg font-medium">All Members</TabsTrigger>
        <TabsTrigger value="owner" class="w-full py-2 text-lg font-medium">Owner</TabsTrigger>
        <TabsTrigger value="admins" class="w-full py-2 text-lg font-medium">Admins</TabsTrigger>
        <TabsTrigger value="members" class="w-full py-2 text-lg font-medium">Members</TabsTrigger>
      </TabsList>

      <!-- All Members Tab -->
      <TabsContent value="all">
        <Card class="mt-6">
          <CardHeader class="px-6 py-4">
            <CardTitle class="text-xl font-semibold">All Members</CardTitle>
            <CardDescription class="text-gray-500">Showing all team members.</CardDescription>
          </CardHeader>
          <CardContent class="px-6 py-4">
            <Table class="w-full border border-gray-300">
              <TableHeader>
                <TableRow class="bg-gray-100">
                  <TableHead class="py-2 px-4">Name</TableHead>
                  <TableHead class="py-2 px-4">Email</TableHead>
                  <TableHead class="py-2 px-4">Role</TableHead>
                  <TableHead class="py-2 px-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="allMembers.length === 0">
                  <TableCell colspan="4" class="text-center py-4 text-gray-500">No Members Found.</TableCell>
                </TableRow>
                <TableRow v-for="member in allMembers" :key="member.id">
                  <TableCell class="py-2 px-4">{{ member.name }}</TableCell>
                  <TableCell class="py-2 px-4">{{ member.email }}</TableCell>
                  <TableCell class="py-2 px-4">{{ member.role }}</TableCell>
                  <TableCell class="py-2 px-4">
                    <!-- Placeholder for actions (e.g., message, view profile) -->
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
                  <TableHead class="py-2 px-4">Name</TableHead>
                  <TableHead class="py-2 px-4">Email</TableHead>
                  <TableHead class="py-2 px-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="ownerMembers.length === 0">
                  <TableCell colspan="3" class="text-center py-4 text-gray-500">No Owner Found.</TableCell>
                </TableRow>
                <TableRow v-for="owner in ownerMembers" :key="owner.id">
                  <TableCell class="py-2 px-4">{{ owner.name }}</TableCell>
                  <TableCell class="py-2 px-4">{{ owner.email }}</TableCell>
                  <TableCell class="py-2 px-4">
                    <!-- Placeholder for actions (e.g., message, view profile) -->
                  </TableCell>
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
                  <TableHead class="py-2 px-4">Name</TableHead>
                  <TableHead class="py-2 px-4">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="adminMembers.length === 0">
                  <TableCell colspan="2" class="text-center py-4 text-gray-500">No Admins Found.</TableCell>
                </TableRow>
                <TableRow v-for="admin in adminMembers" :key="admin.id">
                  <TableCell class="py-2 px-4">{{ admin.name }}</TableCell>
                  <TableCell class="py-2 px-4">{{ admin.email }}</TableCell>
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
                  <TableHead class="py-2 px-4">Name</TableHead>
                  <TableHead class="py-2 px-4">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="memberMembers.length === 0">
                  <TableCell colspan="2" class="text-center py-4 text-gray-500">No Members Found.</TableCell>
                </TableRow>
                <TableRow v-for="member in memberMembers" :key="member.id">
                  <TableCell class="py-2 px-4">{{ member.name }}</TableCell>
                  <TableCell class="py-2 px-4">{{ member.email }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Supabase setup
const supabase = useSupabaseClient();
const allMembers = ref([]);
const ownerMembers = ref([]);
const adminMembers = ref([]);
const memberMembers = ref([]);

// Function to fetch team members based on their role
const fetchTeamMembers = async () => {
  try {
    // Fetch team members from the "team_members" table
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select('user_id, role')
      .eq('team_id', /* Pass the teamId dynamically here */);

    if (error) {
      console.error('Error fetching team members:', error);
      return;
    }

    // Fetch user details based on user_id in teamMembers
    const userIds = teamMembers.map((member) => member.user_id);
    const { data: users, error: userError } = await supabase
      .from('participants')
      .select('user_id, name, email')
      .in('user_id', userIds);

    if (userError) {
      console.error('Error fetching user details:', userError);
      return;
    }

    // Map user details to their respective roles
    allMembers.value = teamMembers.map((member) => {
      const user = users.find((user) => user.user_id === member.user_id);
      return { ...user, role: member.role };
    });

    // Filter users into different role-based arrays
    ownerMembers.value = allMembers.value.filter((member) => member.role === 'owner');
    adminMembers.value = allMembers.value.filter((member) => member.role === 'admin');
    memberMembers.value = allMembers.value.filter((member) => member.role === 'member');
  } catch (error) {
    console.error('Error fetching team members:', error);
  }
};

// Fetch team members on component mount
onMounted(() => {
  fetchTeamMembers();
});
</script>

<style scoped>
/* Custom styling for consistent table layout */
.table-wrapper {
  overflow-x: auto;
}
</style>
