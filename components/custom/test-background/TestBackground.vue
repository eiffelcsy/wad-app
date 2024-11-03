<template>
    <div class="relative w-screen h-screen">  
      <!-- Gradient Background -->
      <div class="w-full h-full relative overflow-hidden bg-white dark:bg-black">
        <!-- SVG Filter -->
        <svg xmlns="http://www.w3.org/2000/svg" class="hidden">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
  
        <!-- Gradients Container -->
        <div class="w-full h-full" :style="{ filter: 'url(#goo) blur(40px)' }">
          <!-- Gradient Circles -->
          <div v-for="(gradient, index) in gradients" 
               :key="index"
               class="absolute"
               :style="[
                 $colorMode.preference == 'dark' ? darkGradientStyle(gradient) : gradientStyle(gradient),
                 {
                   width: gradient.doubleSize ? '160%' : '80%',
                   height: gradient.doubleSize ? '160%' : '80%',
                   top: gradient.doubleSize ? '-30%' : '10%',
                   left: gradient.doubleSize ? '-30%' : '10%',
                   transformOrigin: gradient.transformOrigin,
                   animation: `${gradient.animation} ${gradient.duration}s ${gradient.timing} infinite`,
                   opacity: gradient.opacity
                 }
               ]">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useColorMode } from '@vueuse/core';

  const colorMode = useColorMode();
  
  // Light mode gradients (indigo-50 to indigo-600)
  const gradients = [
    {
      color: '238, 242, 255', // indigo-50
      animation: 'moveVertical',
      duration: 30,
      timing: 'ease',
      transformOrigin: 'center center',
      opacity: 0.7 // Slightly reduced from 0.8
    },
    {
      color: '224, 231, 255', // indigo-100
      animation: 'moveInCircle',
      duration: 20,
      timing: 'ease',
      transformOrigin: 'calc(50% - 400px)',
      opacity: 0.7
    },
    {
      color: '199, 210, 254', // indigo-200
      animation: 'moveInCircle',
      duration: 40,
      timing: 'linear',
      transformOrigin: 'calc(50% + 400px)',
      opacity: 0.7
    },
    {
      color: '165, 180, 252', // indigo-300
      animation: 'moveHorizontal',
      duration: 40,
      timing: 'ease',
      transformOrigin: 'calc(50% - 200px)',
      opacity: 0.6 // Slightly reduced from 0.7
    },
    {
      color: '129, 140, 248', // indigo-400
      animation: 'moveInCircle',
      duration: 20,
      timing: 'ease',
      transformOrigin: 'calc(50% - 800px) calc(50% + 200px)',
      opacity: 0.7,
      doubleSize: true
    },
    {
      color: '99, 102, 241', // indigo-500
      animation: 'moveDiagonal',
      duration: 25,
      timing: 'ease-in-out',
      transformOrigin: 'calc(50% + 600px) calc(50% - 200px)',
      opacity: 0.7
    },
    {
      color: '79, 70, 229', // indigo-600
      animation: 'moveFigureEight',
      duration: 35,
      timing: 'ease-in-out',
      transformOrigin: 'center center',
      opacity: 0.65
    }
  ]
  
  // Dark mode gradients (indigo-400 to indigo-950)
  const darkGradients = [
    {
      color: '129, 140, 248', // indigo-400
      opacity: 0.7
    },
    {
      color: '99, 102, 241', // indigo-500
      opacity: 0.7
    },
    {
      color: '79, 70, 229', // indigo-600
      opacity: 0.7
    },
    {
      color: '67, 56, 202', // indigo-700
      opacity: 0.6
    },
    {
      color: '55, 48, 163', // indigo-800
      opacity: 0.7
    },
    {
      color: '49, 46, 129', // indigo-900
      opacity: 0.7
    },
    {
      color: '30, 27, 75', // indigo-950
      opacity: 0.65
    }
  ]
  
  // Light mode gradient style
  const gradientStyle = (gradient: any) => ({
    background: `radial-gradient(circle at center, rgba(${gradient.color}, 0.7) 0, rgba(${gradient.color}, 0) 50%)`,
    mixBlendMode: 'multiply'
  })
  
  // Dark mode gradient style
  const darkGradientStyle = (gradient: any) => {
    const darkGradient = darkGradients[gradients.indexOf(gradient)]
    return {
      background: `radial-gradient(circle at center, rgba(${darkGradient.color}, 0.7) 0, rgba(${darkGradient.color}, 0) 50%)`,
      mixBlendMode: 'multiply'
    }
  }
  </script>
  
  <style>
  @keyframes moveInCircle {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes moveVertical {
    0% { transform: translateY(-50%); }
    50% { transform: translateY(50%); }
    100% { transform: translateY(-50%); }
  }
  
  @keyframes moveHorizontal {
    0% { transform: translateX(-50%) translateY(-10%); }
    50% { transform: translateX(50%) translateY(10%); }
    100% { transform: translateX(-50%) translateY(-10%); }
  }
  
  @keyframes moveDiagonal {
    0% { transform: translate(-30%, -30%); }
    50% { transform: translate(30%, 30%); }
    100% { transform: translate(-30%, -30%); }
  }
  
  @keyframes moveFigureEight {
    0% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20%, 20%) scale(0.9); }
    50% { transform: translate(0, 40%) scale(1); }
    75% { transform: translate(-20%, 20%) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Dongle:wght@700&display=swap');
  
  .font-dongle {
    font-family: 'Dongle', sans-serif;
  }
  </style>