<template>
  <ClientOnly>
    <div id="scroll-container" data-scroll-container>
      <main class="min-h-screen">
        <div
          class="h-[4.5rem] px-8 md:px-12 lg:px-16 flex flex-row items-center justify-between bg-zinc-50"
        >
          <div class="flex flex-row items-center">
            <NuxtImg src="/images/logo_light.png" class="logo-animation" />
            <h1
              v-if="!isMobile"
              class="text-xl font-bold tracking-wider title-fade-in-left"
            >
              MeetLah
            </h1>
          </div>
          <div class="flex flex-row items-center">
            <Button
              @click="toLogin"
              variant="outline"
              class="border-zinc-300 dark:border-zinc-600 login-button-animation mr-2"
            >
              <EnterIcon class="w-4 h-4 mr-2" />Login
            </Button>
            <Button
              class="w-28 button-fade-in-left bg-indigo-600 start-button-animation"
            >
              Get Started
            </Button>
          </div>
        </div>
        <!-- Hero Section -->
        <section
          class="h-screen px-8 py-20 justify-center bg-zinc-50 overflow-hidden"
          data-scroll-section
        >
          <div class="h-full flex flex-col mx-auto justify-center items-center">
            <div class="flex-1 max-w-3xl w-full text-center space-y-8">
              <h1
                class="text-5xl md:text-7xl font-bold tracking-tight fade-in-bottom"
                data-scroll
              >
                <span class="keywords text-indigo-600">Schedule</span>
                meetings <br />
                <span class="keywords text-indigo-600">& Manage</span>
                projects <br />
                with ease.
              </h1>
              <p class="text-base lg:text-lg fade-in-bottom" data-scroll>
                <span class="text-indigo-600 font-semibold">MeetLah</span>
                combines intelligent scheduling with powerful project management
                tools to help teams work smarter, not harder.
              </p>
              <div
                class="flex flex-col md:flex-row gap-4 fade-in-bottom justify-center"
                data-scroll
              >
                <form
                  @submit.prevent="handleJoin"
                  class="flex flex-row justify-center"
                >
                  <Input
                    v-model="joinCode"
                    id="join-code"
                    type="text"
                    placeholder="Enter Event Code"
                    required
                    class="w-full text-sm sm:text-base p-2 sm:p-3"
                  />
                  <Button
                    class="w-28 ml-2 bg-indigo-600 dark:bg-zinc-200 text-white dark:text-black"
                  >
                    Join Event
                  </Button>
                </form>
                <Button variant="outline" class="w-28 button-fade-in-left">
                  How it Works
                </Button>
              </div>
            </div>
            <div class="flex flex-col lg:flex-row w-full h-full gap-16 justify-center items-end p-8 order-first lg:order-last">
              <div class="w-72 h-96 border rounded-xl"></div>
              <div class="w-48 h-80 border rounded-xl"></div>
              <div class="w-96 h-64 border rounded-xl"></div>
              <div class="w-48 h-80 border rounded-xl"></div>
              <div class="w-72 h-96 border rounded-xl"></div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="px-4 py-20 bg-white" data-scroll-section>
          <div class="max-w-6xl mx-auto">
            <div class="grid md:grid-cols-3 gap-8">
              <Card class="relative overflow-hidden" data-scroll>
                <CardHeader data-scroll>
                  <div
                    class="h-12 w-12 rounded-lg bg-black/90 flex items-center justify-center mb-4"
                    data-scroll
                  >
                    <Calendar class="h-6 w-6 text-white" />
                  </div>
                  <CardTitle class="text-xl" data-scroll
                    >Smart Scheduling</CardTitle
                  >
                </CardHeader>
                <CardContent data-scroll>
                  <p class="text-gray-600">
                    Automatically find the perfect meeting time across multiple
                    calendars and timezones.
                  </p>
                </CardContent>
              </Card>

              <Card class="relative overflow-hidden" data-scroll>
                <CardHeader data-scroll>
                  <div
                    class="h-12 w-12 rounded-lg bg-black/90 flex items-center justify-center mb-4"
                    data-scroll
                  >
                    <KanbanSquare class="h-6 w-6 text-white" />
                  </div>
                  <CardTitle class="text-xl" data-scroll
                    >Project Tracking</CardTitle
                  >
                </CardHeader>
                <CardContent data-scroll>
                  <p class="text-gray-600">
                    Keep your projects on track with intuitive task management
                    and progress monitoring.
                  </p>
                </CardContent>
              </Card>

              <Card class="relative overflow-hidden" data-scroll>
                <CardHeader data-scroll>
                  <div
                    class="h-12 w-12 rounded-lg bg-black/90 flex items-center justify-center mb-4"
                    data-scroll
                  >
                    <Users class="h-6 w-6 text-white" />
                  </div>
                  <CardTitle class="text-xl" data-scroll
                    >Team Collaboration</CardTitle
                  >
                </CardHeader>
                <CardContent data-scroll>
                  <p class="text-gray-600">
                    Foster seamless collaboration with integrated chat, file
                    sharing, and team spaces.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <!-- Social Proof Section -->
        <section class="px-4 py-20" data-scroll-section>
          <div class="max-w-6xl mx-auto text-center">
            <p class="text-gray-600 mb-8 text-lg" data-scroll>
              Trusted by teams at
            </p>
            <div
              class="flex flex-wrap justify-center gap-12 opacity-50"
              data-scroll
            >
              <NuxtImg
                src="/images/company-1.png"
                alt="Company Logo 1"
                class="h-10 w-auto"
                data-scroll
              />
              <NuxtImg
                src="/images/company-2.png"
                alt="Company Logo 2"
                class="h-10 w-auto"
                data-scroll
              />
              <NuxtImg
                src="/images/company-3.png"
                alt="Company Logo 3"
                class="h-10 w-auto"
                data-scroll
              />
              <NuxtImg
                src="/images/company-4.png"
                alt="Company Logo 4"
                class="h-10 w-auto"
                data-scroll
              />
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="px-4 py-20 bg-black text-white" data-scroll-section>
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6" data-scroll>
              Ready to transform how your team works?
            </h2>
            <p class="text-gray-400 mb-8 text-lg" data-scroll>
              Join thousands of teams already using MeetLah to streamline their
              workflows.
            </p>
            <Button size="lg" variant="secondary" class="px-8" data-scroll>
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>
    </div>
  </ClientOnly>
</template>

<script setup>
import { EnterIcon } from "@radix-icons/vue";
import { useMediaQuery } from "@vueuse/core";
import { onMounted, nextTick } from "vue";
const { $initLocomotiveScroll } = useNuxtApp();

const isMobile = useMediaQuery("(max-width: 600px)");

onMounted(async () => {
  await nextTick();
  $initLocomotiveScroll("#scroll-container");
});
</script>

<style>
@keyframes fadeInTop {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInBottom {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.title-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 1s ease-out forwards;
  animation-delay: 0.5s; /* Adjust the delay as needed */
}

.button-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 0.4s ease-out forwards;
  animation-delay: 1.6s; /* Adjust the delay as needed */
}

.logo-animation {
  @apply size-12 transform transition-all mr-2;
  animation: fadeInBottom 0.5s ease-out forwards;
  transform-origin: top left;
}

.start-button-animation {
  @apply transform transition-all;
  animation: fadeInBottom 0.5s ease-out forwards;
  transform-origin: top left;
}

.login-button-animation {
  opacity: 0;
  animation: fadeInRight 1s ease-out forwards;
  animation-delay: 0.5s; /* Adjust the delay as needed */
}

.fade-in-bottom {
  opacity: 0;
  animation: fadeInBottom 0.8s ease-out forwards;
  animation-delay: 0.4s;
}
.fade-in-bottom:nth-child(1) {
  animation-delay: 0.6s;
}
.fade-in-bottom:nth-child(2) {
  animation-delay: 0.8s;
}
.fade-in-bottom:nth-child(3) {
  animation-delay: 1s;
}
.fade-in-bottom:nth-child(4) {
  animation-delay: 1.2s;
}
</style>
