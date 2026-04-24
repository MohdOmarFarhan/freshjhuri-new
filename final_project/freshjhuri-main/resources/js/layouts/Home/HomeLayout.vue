<script setup>
import Footer from "./Footer.vue";
import Navbar from "./Navbar.vue";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  navbarFloating: {
    type: Boolean,
    default: false,
  },
});

const scrollProgress = ref(0);
const showScroller = ref(false);
let scrollTicking = false;
let onScroll = null;
let onResize = null;

const progressStyle = computed(() => {
  return { height: `${Math.round(scrollProgress.value * 100)}%` };
});

const updateScrollState = () => {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop || 0;
  const maxScrollTop = Math.max(0, doc.scrollHeight - window.innerHeight);
  scrollProgress.value = maxScrollTop > 0 ? Math.min(1, Math.max(0, scrollTop / maxScrollTop)) : 0;
  showScroller.value = maxScrollTop > 200 && scrollTop > 120;
};

const scheduleUpdate = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollState();
    scrollTicking = false;
  });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToBottom = () => {
  const doc = document.documentElement;
  window.scrollTo({ top: doc.scrollHeight, behavior: "smooth" });
};

onMounted(() => {
  updateScrollState();
  onScroll = () => scheduleUpdate();
  onResize = () => scheduleUpdate();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
});

onBeforeUnmount(() => {
  if (onScroll) window.removeEventListener("scroll", onScroll);
  if (onResize) window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <Navbar :floating="props.navbarFloating" />
    <main class="grow m-auto w-full">
      <slot />
    </main>

    <Footer />

    <div
      v-show="showScroller"
      class="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3"
    >
      <button
        type="button"
        class="navbar-button inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
        aria-label="Scroll to top"
        @click="scrollToTop"
      >
        <ChevronUp class="h-6 w-6" />
      </button>

      <div class="flex h-20 w-3 items-end justify-center overflow-hidden rounded-full bg-foreground/10">
        <div class="w-full rounded-full bg-primary" :style="progressStyle"></div>
      </div>

      <button
        type="button"
        class="navbar-button inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
        aria-label="Scroll to bottom"
        @click="scrollToBottom"
      >
        <ChevronDown class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>
