<script setup>
import { Link } from "@inertiajs/vue3";
import { CheckCircle, ChevronLeft, ChevronRight, Play } from "lucide-vue-next";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useLocalization } from "@/helper/localization";

const props = defineProps({
  services: {
    type: Array,
    default: () => [],
  },
  serviceVideos: {
    type: Array,
    default: () => [],
  },
});

const { locale } = useLocalization();

const service = computed(() => (props.services?.length ? props.services[0] : null));

const activeVideoUrl = ref(null);
const thumbsRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const updateThumbScrollState = () => {
  const el = thumbsRef.value;
  if (!el) return;
  const maxScrollLeft = el.scrollWidth - el.clientWidth;
  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft < maxScrollLeft - 1;
};

const scrollThumbs = (direction) => {
  const el = thumbsRef.value;
  if (!el) return;
  const amount = Math.max(180, Math.floor(el.clientWidth * 0.8));
  el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
};

watch(() => props.serviceVideos, (videos) => {
  if (videos && videos.length > 0) {
    activeVideoUrl.value = videos[0].video_link;
  } else if (service.value?.video_url) {
    activeVideoUrl.value = service.value.video_url;
  }
  setTimeout(updateThumbScrollState, 0);
}, { immediate: true });

onMounted(() => {
  updateThumbScrollState();
  window.addEventListener("resize", updateThumbScrollState);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateThumbScrollState);
});

const getLocalized = (item, base) => {
  if (!item) return "";
  const key = `${base}_${locale.value}`;
  return item[key] ?? item[`${base}_en`] ?? "";
};

const imageUrl = computed(() => {
  const path = service.value?.image;
  if (!path) return "https://placehold.co/1200x900?text=Service+Image";
  if (path.startsWith("http")) return path;
  return `/storage/${path}`;
});

const getYoutubeId = (url) => {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return u.pathname.replace("/", "").trim() || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        return u.searchParams.get("v") || null;
      }
      const match = u.pathname.match(/^\/(shorts|embed)\/([^/?#]+)/i);
      if (match?.[2]) {
        return match[2];
      }
    }
  } catch {
    return null;
  }
  return null;
};

const getYoutubeEmbedUrl = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

const getYoutubeThumbnail = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
};

const videoEmbed = computed(() => {
  const url = activeVideoUrl.value;
  if (!url) return null;

  const youtube = getYoutubeEmbedUrl(url);
  if (youtube) {
    return {
      provider: "youtube",
      src: `${youtube}?rel=0&modestbranding=1`,
    };
  }

  return {
    provider: "facebook",
    src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
  };
});

const benefits = computed(() => {
  const s = service.value;
  if (!s) {
    return [
      "On-site crop and soil assessment",
      "Customized fertilizer & nutrition plans",
      "Pest and disease diagnosis support",
      "Yield optimization and field guidance",
    ];
  }

  const key = `benefits_${locale.value}`;
  const list = s[key] ?? s.benefits_en ?? [];
  return Array.isArray(list) ? list : [];
});

const sectionLabel = computed(() => (locale.value === "bn" ? "আমাদের সেবা" : "Our Services"));
const buttonLabel = computed(() => (locale.value === "bn" ? "পরামর্শ বুক করুন" : "Book a Consultation"));
const fallbackTitle = computed(() =>
  locale.value === "bn" ? "ফিল্ড লেভেল টেকনিক্যাল সাপোর্ট" : "Field-Level Technical Support"
);
const fallbackDescription = computed(() =>
  locale.value === "bn"
    ? "আমাদের বিশেষজ্ঞরা আপনার খামারে সরাসরি সহায়তা প্রদান করে।"
    : "Our specialists provide hands-on guidance at your farm."
);
</script>

<template>
  <section id="services" class="py-10 bg-accent/20 lg:py-12 overflow-hidden">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-start">
        <div class="relative animate-in fade-in slide-in-from-left-8 duration-700 space-y-4 w-full min-w-0">
          <div class="rounded-3xl overflow-hidden relative w-full">
            <div v-if="videoEmbed" class="w-full aspect-video bg-black/5 dark:bg-white/5 overflow-hidden">
              <iframe
                class="block w-full h-full max-w-full"
                :src="videoEmbed.src"
                style="border: none; overflow: hidden"
                scrolling="no"
                frameborder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowfullscreen="true"
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
              />
            </div>
            <img
              v-else
              :src="imageUrl"
              alt="Field support service"
              class="block w-full max-w-full aspect-video object-cover"
              loading="lazy"
            />
            
            <div
              class="absolute -bottom-6 -right-6 hidden lg:block rounded-2xl p-5 bg-background/70 backdrop-blur-xl border border-border shadow-lg z-10"
            >
              <div class="text-3xl font-bold text-primary">24/7</div>
              <div class="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </div>

          <!-- Video Slider Thumbnails -->
          <div v-if="serviceVideos && serviceVideos.length > 0" class="relative w-full">
            <div
              v-show="canScrollLeft"
              class="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent"
            />
            <div
              v-show="canScrollRight"
              class="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent"
            />
            <button
              v-show="canScrollLeft"
              type="button"
              class="absolute left-1 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border backdrop-blur-sm hover:bg-background focus:outline-none"
              @click="scrollThumbs('left')"
              aria-label="Scroll thumbnails left"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <button
              v-show="canScrollRight"
              type="button"
              class="absolute right-1 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border backdrop-blur-sm hover:bg-background focus:outline-none"
              @click="scrollThumbs('right')"
              aria-label="Scroll thumbnails right"
            >
              <ChevronRight class="h-5 w-5" />
            </button>

            <div
              ref="thumbsRef"
              class="flex gap-3 overflow-x-auto pb-3 pt-2 scrollbar-hide snap-x snap-mandatory"
              @scroll="updateThumbScrollState"
            >
              <div v-for="video in serviceVideos" :key="video.id" class="flex flex-col gap-1.5 items-center snap-start flex-shrink-0">
                <button
                  @click="activeVideoUrl = video.video_link"
                  class="relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-18 rounded-lg overflow-hidden border-2 transition-all duration-300"
                  :class="activeVideoUrl === video.video_link ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'"
                >
                  <img 
                    v-if="getYoutubeThumbnail(video.video_link)" 
                    :src="getYoutubeThumbnail(video.video_link)" 
                    class="w-full h-full object-cover"
                    alt="Video Thumbnail"
                  />
                  <div v-else class="w-full h-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Play class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </div>
                  <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div class="bg-white/80 rounded-full p-1 shadow backdrop-blur-sm">
                      <Play class="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
                    </div>
                  </div>
                </button>
                <span 
                  v-if="getLocalized(video, 'title')" 
                  class="text-xs text-muted-foreground text-center truncate w-20 sm:w-24 md:w-28 font-medium px-0.5" 
                  :title="getLocalized(video, 'title')"
                >
                  {{ getLocalized(video, 'title') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="animate-in fade-in slide-in-from-right-8 duration-700 w-full min-w-0">
          <span class="text-primary font-semibold text-sm tracking-wider uppercase">
            {{ sectionLabel }}
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-3 mb-4 lg:mb-6 break-words">
            {{ getLocalized(service, "title") || fallbackTitle }}
          </h2>
          <p class="text-muted-foreground leading-relaxed text-justify mb-6 lg:mb-8 break-words">
            {{ getLocalized(service, "description") || fallbackDescription }}
          </p>

          <div class="space-y-3 sm:space-y-4 mb-6 lg:mb-8">
            <div v-for="benefit in benefits" :key="benefit" class="flex items-start gap-3">
              <CheckCircle class="text-primary shrink-0 w-5 h-5 mt-0.5" />
              <span class="text-foreground font-medium break-words flex-1">{{ benefit }}</span>
            </div>
          </div>

          <Link
            :href="route('contact.page')"
            class="inline-flex px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:brightness-110 transition-all text-center"
          >
            {{ buttonLabel }}
          </Link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Ensure proper containment on mobile */
.container {
    overflow-x: hidden;
}

/* Fix for iOS Safari */
@supports (-webkit-touch-callout: none) {
    .container {
        width: 100%;
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>
