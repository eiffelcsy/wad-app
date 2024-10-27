import LocomotiveScroll from 'locomotive-scroll';

export default defineNuxtPlugin((nuxtApp) => {
  let scrollInstance: { destroy: () => void; };

  nuxtApp.provide('initLocomotiveScroll', (selector: string) => {
    const container = document.querySelector(selector);
    if (container && !scrollInstance) {
      scrollInstance = new LocomotiveScroll({
        el: container,
        smooth: true,
      });
    }
    return scrollInstance;
  });

  nuxtApp.hook('app:unmount', () => {
    // Destroy Locomotive Scroll instance if it exists on unmount
    if (scrollInstance) scrollInstance.destroy();
  });
});
