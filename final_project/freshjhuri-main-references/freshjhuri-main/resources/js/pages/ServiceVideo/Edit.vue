<script setup>
import { useForm, Head, Link } from "@inertiajs/vue3";
import { ArrowLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
  serviceVideo: Object,
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Service Videos", href: "/service-videos" },
  { title: "Edit", href: `/service-videos/${props.serviceVideo.id}/edit` },
];

const form = useForm({
  title_en: props.serviceVideo.title_en || "",
  title_bn: props.serviceVideo.title_bn || "",
  video_link: props.serviceVideo.video_link || "",
  status: props.serviceVideo.status == true || props.serviceVideo.status == 1 || props.serviceVideo.status == "1" ? 1 : 0,
});

const sanitizeVideoLink = (value) => {
  return String(value || "").replace(/`/g, "").trim();
};

const submit = () => {
  form.video_link = sanitizeVideoLink(form.video_link);
  form.status = Number(form.status) ? 1 : 0;
  form.put(route("service-videos.update", props.serviceVideo.id), {
    preserveScroll: true,
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Edit Service Video" />
    <div class="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-6">
          <CardTitle class="text-xl font-bold">Edit Service Video</CardTitle>
          <Button variant="outline" as-child>
            <Link :href="route('service-videos.index')">
              <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="submit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="title_en">Title (English)</Label>
                <Input
                  id="title_en"
                  v-model="form.title_en"
                  type="text"
                  placeholder="Enter title in English"
                />
                <div v-if="form.errors.title_en" class="text-sm text-red-500 mt-1">
                  {{ form.errors.title_en }}
                </div>
              </div>

              <div class="space-y-2">
                <Label for="title_bn">Title (Bengali)</Label>
                <Input
                  id="title_bn"
                  v-model="form.title_bn"
                  type="text"
                  placeholder="Enter title in Bengali"
                />
                <div v-if="form.errors.title_bn" class="text-sm text-red-500 mt-1">
                  {{ form.errors.title_bn }}
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="video_link">YouTube Video URL <span class="text-red-500">*</span></Label>
              <Input
                id="video_link"
                v-model="form.video_link"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <div v-if="form.errors.video_link" class="text-sm text-red-500 mt-1">
                {{ form.errors.video_link }}
              </div>
            </div>

            <div class="space-y-2 pt-4">
              <Label class="text-sm font-medium">Status</Label>
              <select
                v-model="form.status"
                class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
              <div v-if="form.errors.status" class="text-sm text-red-500">
                {{ form.errors.status }}
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <Button type="submit" :disabled="form.processing">
                Update Video
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
