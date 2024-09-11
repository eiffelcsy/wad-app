<template>
  <span>
    <div class="min-h-screen flex flex-col justify-center items-center">
      <div class="w-full max-w-[32rem] p-16 flex flex-col justify-center">
        <h1
          class="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-zinc-100"
        >
          {{
            authType === "login" ? "Log in to Rendez." : "Register an account."
          }}
        </h1>
        <div class="mt-12">
          <div
            id="g_id_onload"
            :data-context="authType === 'login' ? 'signin' : 'signup'"
            data-client_id="422505154716-tdip3m0gi7b7f0u1pkogv9tbrtjf4ddl.apps.googleusercontent.com"
            data-ux_mode="popup"
            data-callback="handleLoginWithGoogle"
            data-auto_select="true"
            data-itp_support="true"
            data-use_fedcm_for_prompt="true"
          ></div>
          <div ref="googleButton"></div>
        </div>
        <hr class="mt-8" />
        <form @submit.prevent="handleLogin" class="w-full mt-2">
          <div class="my-4">
            <Label
              for="email"
              class="text-sm sm:text-base text-zinc-900 dark:text-zinc-300"
              >Email</Label
            >
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="name@domain.com"
              required
              class="w-full text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600 mt-2"
              autocomplete="email"
            />
          </div>
          <div class="my-4">
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
              class="w-full text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600 mt-2"
              autocomplete="new-password"
            />
          </div>
          <div v-if="authType === 'register'" class="my-4">
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
            class="w-full text-sm sm:text-base py-2 sm:py-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
          >
            {{ authType === "login" ? "Sign In" : "Sign Up" }}
          </Button>
        </form>

        <Button
          variant="link"
          @click="toggleAuthType"
          class="text-xs sm:text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-4"
        >
          {{
            authType === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"
          }}
        </Button>
        <Button
          @click="toggleDarkMode"
          class="absolute bottom-4 right-4 p-2 size-9 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-full"
        >
          <SunIcon v-if="isDark" />
          <MoonIcon v-else />
        </Button>
      </div>
      <Button
        @click="backHome"
        variant="link"
        class="w-96 text-zinc-500 dark:text-zinc-400"
        ><ArrowLeftIcon class="w-4 h-4 mr-2" />Back to Home</Button
      >
      <Toaster />
    </div>
  </span>
</template>

<script setup>
import { h, ref, onMounted } from "vue";
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
const googleButton = ref(null);

const toggleAuthType = () => {
  authType.value = authType.value === "login" ? "register" : "login";
};

const handleLogin = async () => {
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

const backHome = () => {
  navigateTo("/");
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

async function handleLoginWithGoogle(response) {
  const { data, error } = await $supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
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
}

Vue.prototype.handleLoginWithGoogle = handleLoginWithGoogle;

onMounted(() => {
  if (!document.getElementById("google-identity-script")) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.id = "google-identity-script";
    document.head.appendChild(script);

    script.onload = () => {
      renderGoogleButton();
    };
  } else {
    renderGoogleButton();
  }
});

const renderGoogleButton = () => {
  window.google.accounts.id.renderButton(googleButton.value, {
    type: "standard",
    shape: "pill",
    theme: "outline",
    text: authType.value === "login" ? "signin_with" : "signup_with",
    size: "large",
    logo_alignment: "left",
  });
};

watch(authType, () => {
  renderGoogleButton();
});
</script>
