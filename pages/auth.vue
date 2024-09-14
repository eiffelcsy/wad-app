<template>
  <span>
    <div class="min-h-screen flex flex-col justify-center items-center">
      <!-- Container for the authentication form -->
      <div class="w-full max-w-[32rem] p-16 flex flex-col justify-center">
        <!-- Dynamic heading based on authentication type (login or register) -->
        <h1
          class="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-zinc-100"
        >
          {{
            authType === "login" ? "Log in to Rendez." : "Register an account."
          }}
        </h1>

        <!-- Google Sign-In button container -->
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

        <Separator label="OR" class="mt-8"/>

        <!-- Authentication form (handles both login and registration) -->
        <form @submit.prevent="handleLogin" class="w-full mt-2">
          <!-- Email input field -->
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

          <!-- Password input field -->
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

          <!-- Confirm Password field (only for registration) -->
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

          <!-- Submit button with dynamic text based on auth type -->
          <Button
            type="submit"
            class="w-full text-sm sm:text-base py-2 sm:py-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
          >
            {{ authType === "login" ? "Sign In" : "Sign Up" }}
          </Button>
        </form>

        <!-- Toggle between login and registration forms -->
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

        <!-- Dark mode toggle button -->
        <Button
          @click="toggleDarkMode"
          class="absolute bottom-4 right-4 p-2 size-9 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-full"
        >
          <SunIcon v-if="isDark" />
          <MoonIcon v-else />
        </Button>
      </div>

      <!-- Button to navigate back to the home page -->
      <Button
        @click="backHome"
        variant="link"
        class="w-96 text-zinc-500 dark:text-zinc-400"
      >
        <ArrowLeftIcon class="w-4 h-4 mr-2" />Back to Home
      </Button>

      <!-- Toaster component for displaying notifications -->
      <Toaster />
    </div>
  </span>
</template>

<script setup>
/**
 * Importing necessary functions and components from Vue, Radix Icons,
 * and custom components for toast notifications and navigation.
 */
import { h, ref, onMounted, watch } from "vue";
import { SunIcon, MoonIcon, ArrowLeftIcon } from "@radix-icons/vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";
import { navigateTo } from "nuxt/app";

// Accessing Supabase for authentication
const { $supabase } = useNuxtApp();
// Initializing the toast notification system
const { toast } = useToast();

// Reactive variables to store form inputs and states
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const authType = ref("login"); // Determines whether the form is for login or registration
const passwordMismatch = ref(false); // Tracks if passwords match during registration
const isDark = ref(false); // Tracks dark mode state
const googleButton = ref(null); // Reference to the Google Sign-In button container

/**
 * Toggles the authentication form between login and registration modes.
 */
const toggleAuthType = () => {
  authType.value = authType.value === "login" ? "register" : "login";
};

/**
 * Handles form submission for both login and registration.
 * - For login: Attempts to sign in the user with email and password.
 * - For registration: Validates password match and attempts to register the user.
 */
const handleLogin = async () => {
  if (authType.value === "login") {
    // Attempt to sign in the user
    const { error } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      // Display error toast if login fails
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
      // Display success toast and navigate to home on successful login
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
    // Registration process
    if (password.value !== confirmPassword.value) {
      // Check if passwords match
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

    // Attempt to register the user
    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) {
      // Display error toast if registration fails
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
      // Display success toast indicating email confirmation is needed
      toast({
        title: "Email Confirmation Sent",
        description: "Check your inbox.",
        variant: "success",
      });
    }
  }
};

/**
 * Navigates the user back to the home page.
 */
const backHome = () => {
  navigateTo("/");
};

/**
 * Toggles between dark and light modes by adding/removing the 'dark' class
 * on the HTML document element.
 */
const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

/**
 * Handles Google Sign-In callback.
 * Attempts to sign in the user with the Google ID token received.
 *
 * @param {Object} response - The response object from Google Sign-In.
 */
async function handleLoginWithGoogle(response) {
  const { data, error } = await $supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
  });
  if (error) {
    // Display error toast if Google login fails
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
    // Display success toast and navigate to home on successful Google login
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

/**
 * Lifecycle hook that runs when the component is mounted.
 * - Sets up the global Google Sign-In callback.
 * - Loads the Google Identity Services script if not already loaded.
 * - Renders the Google Sign-In button.
 */
onMounted(() => {
  // Assign the callback function to the global window object
  window.handleLoginWithGoogle = handleLoginWithGoogle;

  // Check if the Google Identity script is already loaded
  if (!document.getElementById("google-identity-script")) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.id = "google-identity-script";
    document.head.appendChild(script);

    // Render the Google button once the script is loaded
    script.onload = () => {
      renderGoogleButton();
    };
  } else {
    // If the script is already loaded, render the Google button immediately
    renderGoogleButton();
  }
});

/**
 * Renders the Google Sign-In button with appropriate configurations based on authType.
 */
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

// Watcher that re-renders the Google Sign-In button when authType changes
watch(authType, () => {
  renderGoogleButton();
});
</script>
