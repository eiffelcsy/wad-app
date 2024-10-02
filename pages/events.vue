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

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
</script>
