<template>
  <div class="relative w-screen h-screen">
    <!-- Gradient Background -->
    <div
      class="w-full h-full absolute inset-0 overflow-hidden bg-white dark:bg-black opacity-30"
    >
      <!-- SVG Filter -->
      <svg xmlns="http://www.w3.org/2000/svg" class="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <!-- Gradients Container -->
      <div class="w-full h-full" :style="{ filter: 'url(#goo) blur(40px)' }">
        <!-- Gradient Circles -->
        <div
          v-for="(gradient, index) in gradients"
          :key="index"
          class="absolute"
          :style="[
            $colorMode.preference == 'dark'
              ? darkGradientStyle(gradient)
              : gradientStyle(gradient),
            {
              width: gradient.doubleSize ? '160%' : '80%',
              height: gradient.doubleSize ? '160%' : '80%',
              top: gradient.doubleSize ? '-30%' : '10%',
              left: gradient.doubleSize ? '-30%' : '10%',
              transformOrigin: gradient.transformOrigin,
              animation: `${gradient.animation} ${gradient.duration}s ${gradient.timing} infinite`,
              opacity: gradient.opacity,
            },
          ]"
        ></div>
      </div>
    </div>
    <div
      data-scroll-section
      class="h-[4.5rem] px-8 md:px-12 lg:px-16 flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-950"
    >
      <div class="flex flex-row items-center">
        <NuxtImg
          src="/images/logo_light.png"
          class="logo-animation"
          v-if="$colorMode.value === 'light'"
        />
        <NuxtImg
          src="/images/logo_dark.png"
          class="logo-animation"
          v-if="$colorMode.value === 'dark'"
        />
        <h1
          v-if="!isMobile"
          class="text-xl font-bold tracking-wider title-fade-in-left"
        >
          Meet<span class="text-indigo-600 dark:text-indigo-500">L</span>ah
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
          @click="toRegister"
          class="w-28 button-fade-in-left bg-indigo-600 hover:bg-indigo-700 start-button-animation text-white"
        >
          Get Started
        </Button>
      </div>
    </div>
    <!-- Hero Section -->
    <section
      class="h-screen px-8 pt-8 lg:pt-[10vh] flex flex-col mx-auto justify-center items-center bg-zinc-50 dark:bg-zinc-950"
      data-scroll-section
    >
      <div
        class="relative z-10 flex-1 max-w-3xl w-full lg:text-center space-y-4 md:space-y-6 lg:space-y-8"
      >
        <h1
          class="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight fade-in-bottom"
          data-scroll
        >
          <span class="keywords text-indigo-600">Schedule</span>
          meetings <br />
          <span class="keywords text-indigo-600">& Manage</span>
          projects <br />
          with ease.
        </h1>
        <p class="text-base lg:text-lg fade-in-bottom" data-scroll>
          Work smarter, not harder, with
          <span class="text-indigo-600 font-semibold">MeetLah</span>.
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
              class="w-28 ml-2 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Join Event
            </Button>
          </form>
          <Button
            variant="outline"
            class="w-28 button-fade-in-left"
            @click="toDesc()"
          >
            How it Works
          </Button>
        </div>
      </div>
      <div
        class="relative z-0 lg:-translate-y-20 flex flex-col lg:flex-row w-full lg:h-full gap-4 lg:gap-16 lg:justify-center items-start lg:items-end lg:p-8 order-first lg:order-last"
      >
        <div
          class="lg:hover:-translate-y-10 transition duration-300 ease-in-out"
        >
          <div
            class="relative w-56 md:w-64 lg:w-72 max-h-64 md:max-h-80 lg:max-h-none lg:h-96 border rounded-xl overflow-hidden relative card-far-fade-in-right"
          >
            <NuxtImg src="/images/meeting_stock.jpg" class="w-full" />
          </div>
        </div>
        <div
          class="lg:w-48 lg:h-80 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
        >
          <div
            class="relative lg:w-48 lg:h-80 border rounded-xl bg-indigo-700 card-near-fade-in-right hidden lg:block"
          >
            <div class="p-4 flex flex-col h-full text-white justify-end">
              <div class="flex-col">
                <KanbanSquare size="2rem" stroke-width="1" class="mb-2" />
                <h2 class="text-xl font-medium">
                  Streamlined Project Management
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full md:w-3/4 lg:w-96 h-20 md:h-24 lg:h-64 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
        >
          <div
            class="relative w-full md:w-3/4 lg:w-96 h-20 md:h-24 lg:h-64 py-4 px-6 lg:py-8 lg:px-10 border border-indigo-100 dark:border-indigo-900 rounded-xl bg-white dark:bg-zinc-950 fade-in-bottom flex flex-col justify-between"
          >
            <div
              class="size-10 bg-indigo-100 dark:bg-indigo-700 rounded-lg items-center justify-center hidden lg:flex"
            >
              <ChartLine size="1.6rem" strokeWidth="1" />
            </div>
            <div
              class="h-full lg:h-auto flex flex-row lg:flex-col lg:justify-end"
            >
              <p class="w-32 lg:w-full text-xl tracking-tight" v-if="!isMobile">
                Total Events Scheduled:
              </p>
              <h1 class="text-5xl font-semibold lg:my-2 tracking-wide">
                {{ eventCounter }}
              </h1>
              <div class="ml-2 md:ml-auto lg:ml-0 flex flex-col justify-center">
                <p class="text-xl tracking-tight" v-if="isMobile">
                  Events Scheduled
                </p>
                <p class="text-xs lg:text-base font-light">
                  Increase of
                  <span class="text-indigo-400">{{ monthlyCount }}</span>
                  this month.
                </p>
              </div>
              <div
                class="size-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center self-center ml-auto"
                v-if="isMobile"
              >
                <ChartLine size="1.6rem" strokeWidth="1" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-48 lg:h-80 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
        >
          <div
            class="relative w-48 lg:h-80 border border-indigo-100 rounded-xl bg-indigo-100 dark:bg-indigo-200 card-near-fade-in-left hidden lg:block"
          >
            <div class="p-4 flex flex-col h-full text-indigo-950 justify-end">
              <div class="flex-col">
                <Users size="2rem" stroke-width="1" />
                <h2 class="text-xl font-medium mt-2">
                  Designed for Collaboration
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-full lg:w-72 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
        >
          <div
            class="relative w-full lg:w-72 mb-8 lg:mb-0 h-1 lg:h-96 border rounded-xl bg-indigo-900 relative overflow-hidden card-far-fade-in-left"
          >
            <div
              class="absolute w-[12rem] h-[12rem] -top-[10%] -left-[10%] bg-indigo-600 rounded-full scale-150 opacity-30 flex items-center justify-center"
            >
              <div
                class="relative w-[45%] h-[45%] bg-indigo-900 rounded-full scale-150"
              ></div>
            </div>
            <div class="absolute bottom-0 p-8">
              <h1 class="text-xl font-light text-white">
                Group assignments, team projects, or gatherings — MeetLah is
                here to support you.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();

// Light mode gradients (indigo-50 to indigo-600)
const gradients = [
  {
    color: "238, 242, 255", // indigo-50
    animation: "moveVertical",
    duration: 30,
    timing: "ease",
    transformOrigin: "center center",
    opacity: 0.7, // Slightly reduced from 0.8
  },
  {
    color: "224, 231, 255", // indigo-100
    animation: "moveInCircle",
    duration: 20,
    timing: "ease",
    transformOrigin: "calc(50% - 400px)",
    opacity: 0.7,
  },
  {
    color: "199, 210, 254", // indigo-200
    animation: "moveInCircle",
    duration: 40,
    timing: "linear",
    transformOrigin: "calc(50% + 400px)",
    opacity: 0.7,
  },
  {
    color: "165, 180, 252", // indigo-300
    animation: "moveHorizontal",
    duration: 40,
    timing: "ease",
    transformOrigin: "calc(50% - 200px)",
    opacity: 0.6, // Slightly reduced from 0.7
  },
  {
    color: "129, 140, 248", // indigo-400
    animation: "moveInCircle",
    duration: 20,
    timing: "ease",
    transformOrigin: "calc(50% - 800px) calc(50% + 200px)",
    opacity: 0.7,
    doubleSize: true,
  },
  {
    color: "99, 102, 241", // indigo-500
    animation: "moveDiagonal",
    duration: 25,
    timing: "ease-in-out",
    transformOrigin: "calc(50% + 600px) calc(50% - 200px)",
    opacity: 0.7,
  },
  {
    color: "79, 70, 229", // indigo-600
    animation: "moveFigureEight",
    duration: 35,
    timing: "ease-in-out",
    transformOrigin: "center center",
    opacity: 0.65,
  },
];

// Dark mode gradients (indigo-400 to indigo-950)
const darkGradients = [
  {
    color: "129, 140, 248", // indigo-400
    opacity: 0.7,
  },
  {
    color: "99, 102, 241", // indigo-500
    opacity: 0.7,
  },
  {
    color: "79, 70, 229", // indigo-600
    opacity: 0.7,
  },
  {
    color: "67, 56, 202", // indigo-700
    opacity: 0.6,
  },
  {
    color: "55, 48, 163", // indigo-800
    opacity: 0.7,
  },
  {
    color: "49, 46, 129", // indigo-900
    opacity: 0.7,
  },
  {
    color: "30, 27, 75", // indigo-950
    opacity: 0.65,
  },
];

// Light mode gradient style
const gradientStyle = (gradient: any) => ({
  background: `radial-gradient(circle at center, rgba(${gradient.color}, 0.7) 0, rgba(${gradient.color}, 0) 50%)`,
  mixBlendMode: "multiply",
});

// Dark mode gradient style
const darkGradientStyle = (gradient: any) => {
  const darkGradient = darkGradients[gradients.indexOf(gradient)];
  return {
    background: `radial-gradient(circle at center, rgba(${darkGradient.color}, 0.7) 0, rgba(${darkGradient.color}, 0) 50%)`,
    mixBlendMode: "multiply",
  };
};
</script>

<style>
@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

@keyframes moveDiagonal {
  0% {
    transform: translate(-30%, -30%);
  }
  50% {
    transform: translate(30%, 30%);
  }
  100% {
    transform: translate(-30%, -30%);
  }
}

@keyframes moveFigureEight {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20%, 20%) scale(0.9);
  }
  50% {
    transform: translate(0, 40%) scale(1);
  }
  75% {
    transform: translate(-20%, 20%) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

@import url("https://fonts.googleapis.com/css2?family=Dongle:wght@700&display=swap");

.font-dongle {
  font-family: "Dongle", sans-serif;
}
</style>
