<template>
  <div
    class="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8"
  >
    <Card
      class="w-full"
    >
      <CardHeader>
        <CardTitle
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
        >
          {{ authType === "login" ? "Login" : "Register" }}
        </CardTitle>
        <CardDescription class="text-sm sm:text-base text-center">
          {{ authType === "login" ? "Welcome back!" : "Join us today!" }}
        </CardDescription>
      </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
            <div class="space-y-2">
              <Label for="email" class="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="example@mail.com"
                required
                class="w-full text-sm sm:text-base p-2 sm:p-3"
                autocomplete="email"
              />
            </div>
            <div class="space-y-2">
              <Label for="password" class="text-sm sm:text-base"
                >Password</Label
              >
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="Password"
                required
                class="w-full text-sm sm:text-base p-2 sm:p-3"
                autocomplete="new-password"
              />
            </div>
            <Button
              type="submit"
              class="w-full text-sm sm:text-base py-2 sm:py-3"
            >
              {{ authType === "login" ? "Sign In" : "Sign Up" }}
            </Button>
          </form>
        </CardContent>
        <CardFooter class="flex justify-center">
          <Button
            variant="link"
            @click="toggleAuthType"
            class="text-xs sm:text-sm md:text-base"
          >
            {{
              authType === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"
            }}
          </Button>
        </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
const { $supabase } = useNuxtApp();

const email = ref("");
const password = ref("");
const authType = ref("login");

const toggleAuthType = () => {
  authType.value = authType.value === "login" ? "register" : "login";
};

const handleSubmit = async () => {
  if (authType.value === "login") {
    const { error } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      console.log("Login failed: " + error.message);
    } else {
      console.log("Login Success!");
      navigateTo('/');
    }
  } else {
    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) console.log("Registration failed: " + error.message);
  }
};
</script>

<style scoped></style>
