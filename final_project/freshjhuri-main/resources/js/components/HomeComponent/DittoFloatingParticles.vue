<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const containerRef = ref(null);
const reducedMotion = ref(false);
const mouse = ref({ x: 0, y: 0 });
const viewport = ref({ w: 0, h: 0 });
const rafId = ref(0);
const elapsedMs = ref(0);

const icons = computed(() => {
  if (props.type === 'honey') return ['🐝', '🍯', '🌼', '🐝', '✨'];
  if (props.type === 'fruits') return ['🥭', '🍃', '🥭', '🌿', '✨'];
  if (props.type === 'spices') return ['🌶️', '✨', '🍂', '🌰', '✨'];
  if (props.type === 'dates') return ['🌴', '✨', '🍂', '🟤', '✨'];
  if (props.type === 'combo') return ['🎁', '✨', '🧺', '✨', '🎁'];
  if (props.type === 'new-arrival') return ['🆕', '✨', '🍃', '✨', '🆕'];
  return ['✨', '🍃', '✨', '🍂', '✨'];
});

const particles = computed(() => {
  const items = icons.value;
  return items.map((icon, i) => {
    const top = `${(i * 17) % 80 + 10}%`;
    const left = `${(i * 23) % 80 + 10}%`;
    const size = (i % 3) * 0.5 + 1.5;
    return {
      key: `${props.type}-${i}`,
      icon,
      top,
      left,
      fontSize: `${size}rem`,
      index: i,
    };
  });
});

const particleStyle = (p) => {
  const w = viewport.value.w || 1;
  const h = viewport.value.h || 1;

  const xNorm = (mouse.value.x / w - 0.5) * 2;
  const yNorm = (mouse.value.y / h - 0.5) * 2;
  const speed = (p.index + 1) * 35;

  const elapsed = elapsedMs.value / 1000;
  const floatX = Math.sin(elapsed * (0.8 + p.index * 0.11)) * 18;
  const floatY = Math.cos(elapsed * (0.7 + p.index * 0.09)) * 22;

  const px = reducedMotion.value ? floatX : floatX - xNorm * speed;
  const py = reducedMotion.value ? floatY : floatY - yNorm * speed;

  return {
    top: p.top,
    left: p.left,
    fontSize: p.fontSize,
    transform: `translate3d(${px}px, ${py}px, 0)`,
  };
};

const syncViewport = () => {
  const el = containerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  viewport.value = { w: rect.width, h: rect.height };
  if (!mouse.value.x && !mouse.value.y) {
    mouse.value = { x: rect.width / 2, y: rect.height / 2 };
  }
};

const onMove = (e) => {
  const el = containerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  mouse.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const tick = () => {
  elapsedMs.value = performance.now();
  rafId.value = requestAnimationFrame(tick);
};

onMounted(() => {
  elapsedMs.value = performance.now();
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  syncViewport();
  window.addEventListener('resize', syncViewport);
  window.addEventListener('mousemove', onMove);
  rafId.value = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport);
  window.removeEventListener('mousemove', onMove);
  if (rafId.value) cancelAnimationFrame(rafId.value);
});
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div
      v-for="p in particles"
      :key="p.key"
      class="absolute opacity-60 drop-shadow-lg blur-[0.75px] will-change-transform"
      :style="particleStyle(p)"
    >
      {{ p.icon }}
    </div>
  </div>
</template>

