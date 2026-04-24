<script setup>
import { Link, router, Head } from "@inertiajs/vue3";
import { Plus, SquarePen, Trash } from "lucide-vue-next";
import { computed } from "vue";
import { confirmDeletion } from "@/helper/sweetAlertHelpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/AppLayout.vue";
import { can } from "@/lib/can";

const props = defineProps({
  serviceVideos: Object,
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Service Videos", href: "/service-videos" },
];

const rows = computed(() => {
  const items = props.serviceVideos?.data ?? [];
  return items.map((video, index) => ({
    serial: (props.serviceVideos?.from || 0) + index,
    ...video,
  }));
});

const deleteServiceVideo = (id) => {
  confirmDeletion(() => {
    router.delete(route("service-videos.destroy", id));
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Service Videos" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle class="text-xl font-bold">Service Videos</CardTitle>
          <Button v-if="can('SERVICE_VIDEO_CREATE')" as-child>
            <Link :href="route('service-videos.create')">
              <Plus class="mr-2 h-4 w-4" /> Add Video
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <div
            v-if="$page.props.flash?.message"
            class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
          >
            {{ $page.props.flash.message }}
          </div>

          <div class="crud-table-wrap">
            <table class="crud-table table-fixed">
              <thead class="crud-table-head">
                <tr>
                  <th class="crud-th w-24">Serial</th>
                  <th class="crud-th w-72">Title (EN)</th>
                  <th class="crud-th">Video Link</th>
                  <th class="crud-th w-32 text-center">Status</th>
                  <th class="crud-th w-32 text-center">Action</th>
                </tr>
              </thead>

              <tbody class="crud-table-body">
                <tr v-for="video in rows" :key="video.id" class="crud-row">
                  <td class="crud-td whitespace-nowrap">
                    {{ video.serial }}
                  </td>
                  <td class="crud-td">
                    {{ video.title_en || "—" }}
                  </td>
                  <td class="crud-td max-w-0">
                    <a :href="video.video_link" target="_blank" class="block truncate text-blue-500 hover:underline">
                      {{ video.video_link }}
                    </a>
                  </td>
                  <td class="crud-td whitespace-nowrap text-center">
                    <Badge :variant="video.status ? 'default' : 'secondary'" class="text-xs">
                      {{ video.status ? "Active" : "Inactive" }}
                    </Badge>
                  </td>
                  <td class="crud-td whitespace-nowrap text-center">
                    <div class="flex justify-center gap-2">
                      <Button
                        v-if="can('SERVICE_VIDEO_EDIT')"
                        variant="ghost"
                        size="icon"
                        as-child
                        class="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                      >
                        <Link :href="route('service-videos.edit', video.id)">
                          <SquarePen class="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        v-if="can('SERVICE_VIDEO_DELETE')"
                        variant="ghost"
                        size="icon"
                        @click="deleteServiceVideo(video.id)"
                        class="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                      >
                        <Trash class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="serviceVideos?.links" class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ serviceVideos.from }} to {{ serviceVideos.to }} of {{ serviceVideos.total }} entries
            </div>
            <div class="flex gap-2">
              <Button
                v-for="(link, index) in serviceVideos.links"
                :key="index"
                variant="outline"
                size="sm"
                :class="{
                  'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500': link.active,
                  'opacity-50 cursor-not-allowed': !link.url
                }"
                :disabled="!link.url"
                @click="link.url && router.get(link.url)"
                v-html="link.label"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
