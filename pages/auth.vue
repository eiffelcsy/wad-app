<template>
  <div
    class="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-center items-center"
  >
    <div class="w-full p-8 flex justify-center">
      <Card class="w-[32rem] px-4 pt-8 pb-8 self-center lg:order-last bg-white dark:bg-zinc-800">
        <CardHeader>
          <CardTitle
            class="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-zinc-900 dark:text-white"
          >
            {{ authType === "login" ? "Log in to Rendez" : "Register an account" }}
          </CardTitle>
          <CardDescription
            class="text-sm sm:text-base text-center text-zinc-600 dark:text-zinc-300"
          >
            {{ authType === "login" ? "Welcome back!" : "Join us today!" }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
            <div class="space-y-2">
              <Label
                for="email"
                class="text-sm sm:text-base text-zinc-900 dark:text-zinc-300"
                >Email</Label
              >
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="example@mail.com"
                required
                class="w-full text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600"
                autocomplete="email"
              />
            </div>
            <div class="space-y-2">
              <Label
                for="password"
                class="text-sm sm:text-base text-zinc-900 dark:text-zinc-300"
                >Password</Label
              >
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="Password"
                required
                class="w-full text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600"
                autocomplete="new-password"
              />
            </div>
            <div v-if="authType === 'register'" class="space-y-2">
              <Label
                for="confirmPassword"
                class="text-sm sm:text-base text-zinc-900 dark:text-zinc-300"
                >Confirm Password</Label
              >
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Re-enter Password"
                required
                class="w-full text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600"
                autocomplete="new-password"
              />
            </div>
            <Button
              type="submit"
              class="w-full text-sm sm:text-base py-2 sm:py-3 bg-zinc-700 dark:bg-zinc-600 text-white"
            >
              {{ authType === "login" ? "Sign In" : "Sign Up" }}
            </Button>
          </form>
        </CardContent>
        <CardFooter class="flex justify-center">
          <Button
            variant="link"
            @click="toggleAuthType"
            class="text-xs sm:text-sm md:text-base text-zinc-500 dark:text-zinc-400"
          >
            {{
              authType === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"
            }}
          </Button>
        </CardFooter>
      </Card>
      <Button
        @click="toggleDarkMode"
        class="absolute bottom-4 right-4 p-2 size-9 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-full"
      >
        <SunIcon v-if="isDark" />
        <MoonIcon v-else />
      </Button>
    </div>
    <Button @click="back" variant="link" class="w-96 text-zinc-500 dark:text-zinc-400"><ArrowLeftIcon class="w-4 h-4 mr-2"/>Back to Home</Button>
    <Toaster />
  </div>
</template>

<script setup>
import { h, ref } from "vue";
import { SunIcon, MoonIcon, ArrowLeftIcon } from "@radix-icons/vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";
import { navigateTo } from "nuxt/app";

const { $supabase } = useNuxtApp();
const { toast } = useToast();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const authType = ref("login");
const passwordMismatch = ref(false);
const isDark = ref(false);

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
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
        action: h(
          ToastAction,
          {
            altText: "Try again",
          },
          {
            default: () => "Try again",
          }
        ),
      });
    } else {
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        variant: "success",
        duration: 1000,
      });
      setTimeout(() => {
        navigateTo("/");
      }, 1200);
    }
  } else {
    if (password.value !== confirmPassword.value) {
      passwordMismatch.value = true;
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Passwords do not match.",
        variant: "destructive",
        action: h(
          ToastAction,
          {
            altText: "Try again",
          },
          {
            default: () => "Try again",
          }
        ),
      });
      return;
    }

    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
        action: h(
          ToastAction,
          {
            altText: "Try again",
          },
          {
            default: () => "Try again",
          }
        ),
      });
    } else {
      toast({
        title: "Email Confirmation Sent",
        description: "Check your inbox.",
        variant: "success",
      });
    }
  }
};

const back = () => {
  navigateTo("/")
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
</script>
