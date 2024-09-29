<!-- TODO: Events homepage, include create, edit and delete buttons for each event , maybe in a table -->
<template>
  <div>
    <Header/>
    <div class="container h-screen">
      Events page for {{ user }}
    </div>
  </div>
</template>

<script setup>
import Header from '../components/ui/header/header.vue';

const { $supabase } = useNuxtApp();

const displayName = ref("");
const email = ref("");

const {
  data: { user },
} = await $supabase.auth.getUser();

if (user) {
  email.value = user.email;
  displayName.value = user.user_metadata.name;
}
</script>
