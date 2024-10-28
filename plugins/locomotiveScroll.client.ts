import LocomotiveScroll from "locomotive-scroll";

export default defineNuxtPlugin((nuxtApp) => {
  let scrollInstance;

  nuxtApp.provide("initLocomotiveScroll", (selector: string) => {
    const container = document.querySelector(selector);
    if (container && !scrollInstance) {
      console.log("Initializing Locomotive Scroll");
      scrollInstance = new LocomotiveScroll({
        el: container,
        smooth: true,
        multiplier: 0.8,
        lerp:0.025,
      });
    } else if (!container) {
      console.error(`Element with selector "${selector}" not found.`);
    }
    return scrollInstance;
  });

  nuxtApp.hook("app:unmount", () => {
    if (scrollInstance) {
      console.log("Destroying Locomotive Scroll");
      scrollInstance.destroy();
      scrollInstance = null; // Reset instance
    }
  });
});