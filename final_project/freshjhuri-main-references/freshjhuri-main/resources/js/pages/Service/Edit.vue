<script setup>
import { Link, Head, useForm } from "@inertiajs/vue3";
import { ArrowLeft, Image as ImageIcon } from "lucide-vue-next";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
  service: Object,
});

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Services", href: "/services" },
  { title: "Edit", href: `/services/${props.service.id}/edit` },
];

const toLines = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) return value.join("\n");
  return String(value);
};

const form = useForm({
  _method: "PUT",
  title_en: props.service.title_en || "",
  title_bn: props.service.title_bn || "",
  description_en: props.service.description_en || "",
  description_bn: props.service.description_bn || "",
  benefits_en: toLines(props.service.benefits_en),
  benefits_bn: toLines(props.service.benefits_bn),
  video_url: props.service.video_url || "",
  image: null,
  status: Boolean(props.service.status),
  sort_order: props.service.sort_order ?? 0,
});

const imagePreview = ref(
  props.service.image ? (props.service.image.startsWith("http") ? props.service.image : `/storage/${props.service.image}`) : null
);

const handleImageUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  form.image = file;
  imagePreview.value = URL.createObjectURL(file);
};

const submit = () => {
  form.post(route("services.update", props.service.id), {
    preserveScroll: true,
  });
};
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Edit Service" />

    <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
      <div class="mb-4">
        <Button variant="ghost" as-child>
          <Link :href="route('services.index')" class="flex items-center">
            <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold">Edit Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submit" class="space-y-6" enctype="multipart/form-data">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="title_en">Title (English) <span class="text-red-500">*</span></Label>
                <Input id="title_en" v-model="form.title_en" type="text" :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.title_en }" />
                <span v-if="form.errors.title_en" class="text-sm text-red-500">{{ form.errors.title_en }}</span>
              </div>

              <div class="space-y-2">
                <Label for="title_bn">Title (Bangla) <span class="text-red-500">*</span></Label>
                <Input id="title_bn" v-model="form.title_bn" type="text" :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.title_bn }" />
                <span v-if="form.errors.title_bn" class="text-sm text-red-500">{{ form.errors.title_bn }}</span>
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="description_en">Description (English)</Label>
                <Textarea id="description_en" v-model="form.description_en" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="description_bn">Description (Bangla)</Label>
                <Textarea id="description_bn" v-model="form.description_bn" rows="4" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label for="benefits_en">Benefits (English) (one per line)</Label>
                <Textarea id="benefits_en" v-model="form.benefits_en" rows="5" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label for="benefits_bn">Benefits (Bangla) (one per line)</Label>
                <Textarea id="benefits_bn" v-model="form.benefits_bn" rows="5" class="resize-none" />
              </div>

              <div class="space-y-2">
                <Label for="sort_order">Sort Order</Label>
                <Input id="sort_order" v-model="form.sort_order" type="number" min="0" />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="video_url">Video URL (Facebook / YouTube) (optional)</Label>
                <Input
                  id="video_url"
                  v-model="form.video_url"
                  type="url"
                  placeholder="https://www.facebook.com/.../videos/... or https://youtu.be/..."
                  :class="{ 'border-red-500 focus-visible:ring-red-500': form.errors.video_url }"
                />
                <span v-if="form.errors.video_url" class="text-sm text-red-500">{{ form.errors.video_url }}</span>
              </div>

              <div class="space-y-2 flex items-center gap-3 pt-7">
                <Checkbox id="status" v-model:checked="form.status" />
                <Label for="status">Active</Label>
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="image">Image</Label>
                <div class="flex items-center gap-4">
                  <Button type="button" variant="outline" @click="$refs.imageInput.click()">
                    <ImageIcon class="mr-2 h-4 w-4" /> Choose Image
                  </Button>
                  <input ref="imageInput" id="image" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                  <span v-if="form.errors.image" class="text-sm text-red-500">{{ form.errors.image }}</span>
                </div>

                <div v-if="imagePreview" class="mt-3">
                  <img :src="imagePreview" alt="Preview" class="h-40 w-72 object-cover rounded-xl border border-border" />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <Button variant="outline" as-child type="button">
                <Link :href="route('services.index')">Cancel</Link>
              </Button>
              <Button type="submit" :disabled="form.processing">
                {{ form.processing ? "Updating..." : "Update Service" }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>

