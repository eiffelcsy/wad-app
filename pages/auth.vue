<template>
  <div
    class="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col lg:flex-row items-center justify-between"
  >
    <div class="hidden lg:block lg:w-3/5">
      <Carousel
        class="w-full"
        :plugins="[
          Autoplay({
            delay: 3800,
          }),
        ]"
        @select="updateSlide"
        :slideIndex="currentSlide"
      >
        <CarouselContent class="-ml-0">
          <CarouselItem class="pl-0">
            <img
              class="w-full h-screen dark:brightness-90"
              src="/public/auth-stock-1.webp"
            />
          </CarouselItem>
          <CarouselItem class="pl-0"><img
              class="w-full h-screen dark:brightness-90"
              src="/public/auth-stock-2.webp"
            /></CarouselItem>
          <CarouselItem class="pl-0"><img
              class="w-full h-screen dark:brightness-90"
              src="/public/auth-stock-3.webp"
            /></CarouselItem>
        </CarouselContent>
        <div class="absolute bottom-4 w-full flex justify-center space-x-2">
          <span
            v-for="(slide, index) in slides"
            :key="index"
            :class="[
              'w-3 h-3 rounded-full cursor-pointer transition-all duration-300',
              currentSlide === index ? 'bg-zinc-500 dark:bg-zinc-300' : 'bg-zinc-300 dark:bg-zinc-600'
            ]"
            @click="goToSlide(index)"
          ></span>
        </div>
      </Carousel>
    </div>
    <div class="w-full h-screen lg:w-2/5 p-8 flex lg:justify-center">
      <Card class="w-full self-center lg:order-last bg-white dark:bg-zinc-800">
        <CardHeader>
          <CardTitle
            class="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-zinc-900 dark:text-white"
          >
            {{ authType === "login" ? "Login" : "Register" }}
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
              class="w-full text-sm sm:text-base py-2 sm:py-3 bg-zinc-500 dark:bg-zinc-600 text-white"
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
        class="absolute top-2 right-2 p-2 size-9 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-full"
      >
        <SunIcon v-if="isDark" />
        <MoonIcon v-else />
      </Button>
    </div>
    <Toaster />
  </div>
</template>

<script setup>
import { h, ref } from "vue";
import { SunIcon, MoonIcon } from "@radix-icons/vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const { $supabase } = useNuxtApp();
const { toast } = useToast();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const authType = ref("login");
const passwordMismatch = ref(false);
const isDark = ref(false);
const currentSlide = ref(0);

const slides = ref([
  { src: "/public/auth-stock.webp" },
  { src: "/public/another-slide.webp" },
  { src: "/public/third-slide.webp" },
]);

const updateSlide = (index) => {
  currentSlide.value = index;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

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

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
</script>
