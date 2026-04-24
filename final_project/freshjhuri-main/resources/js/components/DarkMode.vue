<script setup>
import { Moon, Sun } from "lucide-vue-next";
import { computed } from "vue";
import { useAppearance } from "@/composables/useAppearance";

const { resolvedAppearance, updateAppearance } = useAppearance();

const isDark = computed(() => resolvedAppearance.value === "dark");

const toggleTheme = () => {
  const next = isDark.value ? "light" : "dark";
  updateAppearance(next);
};
</script>

<template>
  <button
    @click="toggleTheme"
    type="button"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark"
    class="navbar-button inline-flex h-10 w-10 items-center justify-center rounded-full"
  >
    <Moon
      v-if="!isDark"
      class="h-4 w-4"
    />

    <Sun
      v-else
      class="h-4 w-4"
    />
  </button>
</template>
