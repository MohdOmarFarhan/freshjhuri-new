<script setup>
import { Link, Head } from "@inertiajs/vue3";
import { ArrowLeft } from "lucide-vue-next";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
  service: Object,
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Services", href: "/services" },
  { title: "Show", href: `/services/${props.service.id}` },
];

const imageUrl = computed(() => {
  const path = props.service?.image;
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `/storage/${path}`;
});

const getYoutubeEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      const match = u.pathname.match(/^\/(shorts|embed)\/([^/?#]+)/i);
      if (match?.[2]) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
};

const videoEmbed = computed(() => {
  const url = props.service?.video_url;
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
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Service Details" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <div class="mb-4">
        <Button variant="ghost" as-child>
          <Link :href="route('services.index')" class="flex items-center">
            <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <CardTitle class="text-xl font-bold">Service Details</CardTitle>
          <Badge :variant="service.status ? 'default' : 'secondary'">
            {{ service.status ? "Active" : "Inactive" }}
          </Badge>
        </CardHeader>
        <CardContent class="space-y-6">
          <div v-if="videoEmbed" class="rounded-2xl overflow-hidden border border-border">
            <div class="w-full aspect-video bg-black/5 dark:bg-white/5">
              <iframe
                class="w-full h-full"
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
          </div>
          <div v-if="imageUrl" class="rounded-2xl overflow-hidden border border-border">
            <img :src="imageUrl" alt="Service" class="w-full h-72 object-cover" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="text-xs text-muted-foreground">Title (EN)</div>
              <div class="text-base font-semibold text-foreground">{{ service.title_en }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-xs text-muted-foreground">Title (BN)</div>
              <div class="text-base font-semibold text-foreground">{{ service.title_bn }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="text-xs text-muted-foreground">Description (EN)</div>
              <div class="text-sm text-foreground whitespace-pre-wrap">{{ service.description_en || "—" }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-xs text-muted-foreground">Description (BN)</div>
              <div class="text-sm text-foreground whitespace-pre-wrap">{{ service.description_bn || "—" }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="text-xs text-muted-foreground">Benefits (EN)</div>
              <ul class="list-disc list-inside text-sm text-foreground space-y-1">
                <li v-for="(b, i) in (service.benefits_en || [])" :key="i">{{ b }}</li>
                <li v-if="!service.benefits_en || service.benefits_en.length === 0" class="list-none text-muted-foreground">—</li>
              </ul>
            </div>
            <div class="space-y-2">
              <div class="text-xs text-muted-foreground">Benefits (BN)</div>
              <ul class="list-disc list-inside text-sm text-foreground space-y-1">
                <li v-for="(b, i) in (service.benefits_bn || [])" :key="i">{{ b }}</li>
                <li v-if="!service.benefits_bn || service.benefits_bn.length === 0" class="list-none text-muted-foreground">—</li>
              </ul>
            </div>
          </div>

          <div class="text-sm text-muted-foreground">
            Sort Order: <span class="text-foreground font-medium">{{ service.sort_order ?? 0 }}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
